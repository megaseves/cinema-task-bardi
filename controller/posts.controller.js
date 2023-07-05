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
    }
}

module.exports = postsController;