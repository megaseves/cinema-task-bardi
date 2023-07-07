const pool = require("../db/dbconnection");
const nodemailer = require("nodemailer");
let TOKEN = randomNumber();
let WAITING_TIME = 120000;

function randomNumber() {
    return Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
}

const postsController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT * FROM seats")
            res.json({
                data: rows
            });
        } catch (e) {
            console.log(e);
            res.json({
                status: "error",
                message: e
            })
        }
    },
    reserveSeat: async (req, res) => {
        const seatNumber = req.body.id;
        const seat = "SELECT status FROM seats WHERE seat_id = ?"
        const [row, fields] = await pool.query(seat, [seatNumber]);
        const status = row[0].status;

        if (status && status === 'free') {
            const sql = "UPDATE seats SET status = ? WHERE seat_id = ?";
            const [rows, fields] = await pool.query(sql, ['reserved', seatNumber]);

            const randomToken = randomNumber();
            TOKEN = randomToken;
            console.log(TOKEN);
            res.send({token: randomToken});

            setTimeout(async () => {
                const seatQuery = "SELECT status FROM seats WHERE seat_id = ?"
                const [row, fields] = await pool.query(seatQuery, [seatNumber]);
                const status = row[0].status;

                if (status && status === 'reserved') {
                    const sql = "UPDATE seats SET status = ? WHERE seat_id = ?"
                    const [rows, fields] = await pool.query(sql, ['free', seatNumber])
                    TOKEN = randomNumber();
                }
            }, WAITING_TIME);

            /*res.send('success');*/
        } else {
            res.status(400).send('error');
        }
    },
    buySeat: async (req, res) => {
        const seats = req.body.seat_ids;
        const token = req.body.token | 0;
        const email = req.body.email;
        if (token === TOKEN) {

            seats.forEach(seat => {
                const sql = "UPDATE seats SET status = ?, user_email = ? WHERE seat_id = ?"
                pool.query(sql, ['sold', email, seat.seatNumber])
            })

            emailSender(email);

            res.send('Succes')
        } else {
            console.log('NO NO NO')
            res.send('error')
        }


    }
}

function emailSender(email) {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "emailsenderfromnodejsapp@gmail.com",
            pass: "aasuzrliwamqjhdl"
        }
    });

    let details = {
        from: "emailsenderfromnodejsapp@gmail.com",
        to: `${email}`,
        subject: "Bardi - Cinema",
        text: "Köszönjük a vásárlást!"
    }

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send('Success');
            console.log('Email has sent');
        }
    })
}

module.exports = postsController;