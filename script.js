

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
        (seat.status === 'sold') && seatDiv.classList.add("seatSold");
        (seat.status === 'free') && seatDiv.classList.add("seatFree");
        (seat.status === 'reserved') && seatDiv.classList.add("seatReserved");

        seatDiv.dataset.id = seat.seat_id;

        seatContainer.insertAdjacentElement('beforeend', seatDiv);


    });
}

refreshData();
setInterval(refreshData, 5000);


/*

function refreshData() {
    const seatContainer = document.querySelector('.seats-container');
    seatContainer.innerHTML = "";
    fetch("http://localhost:5000/api/v1/posts/seats")
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.data.forEach(seat => {
                let seatDiv = document.createElement("div");

                let seatId = document.createElement("div");
                seatId.textContent = `${seat.seat_id}`;

                seatDiv.append(seatId);

                seatDiv.classList.add("seat");
                (seat.status === 'sold') && seatDiv.classList.add("seatSold");
                (seat.status === 'free') && seatDiv.classList.add("seatFree");
                (seat.status === 'reserved') && seatDiv.classList.add("seatReserved");

                seatDiv.dataset.id = seat.seat_id;

                seatContainer.insertAdjacentElement('beforeend', seatDiv);
            })
        })
        .catch(error => console.log(error))
}
*/


