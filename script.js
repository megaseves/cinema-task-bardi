let RESERVED_IDS = [];
let TOKEN = 0;
let WAITING_TIME = 120000;

function refreshData() {
    const xhr = new XMLHttpRequest();
    const seatContainer = document.querySelector('.seats-container');

    xhr.onload = function() {
        if(this.status === 200) {
            createElements(JSON.parse(xhr.responseText));
        } else {
            console.warn('Did not recieve 200 OK from response!');
        }
    };

    xhr.open('get', 'http://localhost:5000/api/v1/posts/seats');
    xhr.send();
}

function createElements(data) {

    const seatContainer = document.querySelector('.seats-container');
    seatContainer.innerHTML = "";

    data.data.forEach(seat => {
        let seatDiv = document.createElement("div");

        let seatId = document.createElement("div");
        seatId.textContent = `${seat.seat_id}`;

        seatDiv.append(seatId);

        seatDiv.classList.add("seat");
        seatDiv.dataset.button = "button";
        (seat.status === 'sold') && seatDiv.classList.add("seatSold");
        (seat.status === 'free') && seatDiv.classList.add("seatFree");
        (seat.status === 'reserved') && seatDiv.classList.add("seatReserved");

        seatDiv.dataset.id = seat.seat_id;

        seatContainer.insertAdjacentElement('beforeend', seatDiv);


    });
}


refreshData();
/*setInterval(refreshData, 1000); // 1000 ms = 1 másodperc*/
setInterval(errorMessageClean, 3000);
setInterval(loopingFunctions, 1000);


window.onload = function() {
    setInterval(clickableDivs, 1000);
};

function clickableDivs() {
    const divElements = document.querySelectorAll('[data-id]');

    const buttonPressed = async e => {
        const seatNumber = Number.parseInt(e.target.innerText);
        let requestBody = {
            id: seatNumber
        }
        await fetch("http://localhost:5000/api/v1/posts/reserve", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(r => {
                if (r.status !== 200) {
                    const errorContainer = document.querySelector('.error-message');
                    errorContainer.innerText = `Nem sikerült lefoglalni a ${seatNumber} számon lévő széket!`
                } else {
                    r.json().then(data => {
                        TOKEN = data.token;

                        RESERVED_IDS.push({
                            seatNumber: seatNumber,
                            expiration: new Date().getTime() + WAITING_TIME
                        });

                    })
                }
            }
        )

    }

    for (let elem of divElements) {
        elem.addEventListener("click", buttonPressed);
    }
}

function errorMessageClean() {
    const errorContainer = document.querySelector('.error-message');
    errorContainer.innerText = '';
}


function listenReservedIdsExpirationTime() {
    let newList = [];
    if (RESERVED_IDS.length > 0) {
        RESERVED_IDS.forEach(e => {
            if (new Date().getTime() < e.expiration) {
                newList.push(e);
            }
        })
    }
    RESERVED_IDS = newList;
}

function createReservedDivs() {
    const reservedContainer = document.querySelector('.reserved-div');
    reservedContainer.innerHTML = "";

    RESERVED_IDS.forEach(elem => {
        const reserveElem = document.createElement('div');

        reserveElem.innerText = `Lefoglalt szék: ${elem.seatNumber}`

        reservedContainer.insertAdjacentElement('beforeend', reserveElem);
    })
}

function submitForm(event) {
    event.preventDefault();

    let form = document.getElementById("buySeats");
    let email = form.elements["email"].value;

    let data = {
        seat_ids: RESERVED_IDS,
        token: TOKEN,
        email: email
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/api/v1/posts/buy");
    xhr.setRequestHeader("Content-Type", "application/json");
   /* xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            // Kezeld a választ itt
            console.log(response);
        }
    };*/
    xhr.send(JSON.stringify(data));

}

const form = document.getElementById("buySeats");
form.addEventListener("submit", submitForm);


function loopingFunctions() {
    refreshData()
    listenReservedIdsExpirationTime();
    createReservedDivs();
}

