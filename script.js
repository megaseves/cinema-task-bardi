fetch("http://localhost:5000/api/v1/posts/seats")
    .then(res => {
        return res.json();
})
    .then(data => {
            console.log(data.data);
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

                    const seatContainer = document.querySelector('.seats-container');
                    seatContainer.insertAdjacentElement('beforeend', seatDiv);
            })
    })
.catch(error => console.log(error))