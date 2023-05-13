const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Esemkaencjl123",
    database: "social"
})

module.exports = { db }