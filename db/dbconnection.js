const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    database: "cinema",
    user: "bardi",
    password: "123"
});

module.exports = pool.promise();