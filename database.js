import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows;
}

export async function getUser(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE id = ?
    `, [id])
    return rows[0];
}

export async function createUser(email, firstname, lastname, user_type, manager) {
    const result = await pool.query(`
    INSERT INTO users (email, firstname, lastname, user_type, manager)
    VALUES (?, ?, ?, ?, ?)
    `, [email, firstname, lastname, user_type, manager])
    
    const id = result.insertId
    return await getUser(id);
}

//const users = await createUser("slave2@gmail.com", "Dardal", "Slave", "SLAVE", "manager@gmail.com")
const display = await getUsers()
console.log(display);