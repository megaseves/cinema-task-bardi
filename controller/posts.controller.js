const pool = require("../db/dbconnection")

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
            // TODO make the token RANDOM
            res.send({token: 12345});

            setTimeout(async () => {
                const seatQuery = "SELECT status FROM seats WHERE seat_id = ?"
                const [row, fields] = await pool.query(seatQuery, [seatNumber]);
                const status = row[0].status;

                if (status && status === 'reserved') {
                    const sql = "UPDATE seats SET status = ? WHERE seat_id = ?"
                    const [rows, fields] = await pool.query(sql, ['free', seatNumber])
                }
            }, 15000);

            /*res.send('success');*/
        } else {
            res.status(400).send('error');
        }

    }
}

module.exports = postsController;