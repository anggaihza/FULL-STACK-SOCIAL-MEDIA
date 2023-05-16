const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Esemkaencjl123",
    database: "sosmed"
})



module.exports = { db }