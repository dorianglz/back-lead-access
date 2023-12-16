import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export async function getLeads() {
    const [rows] = await pool.query("SELECT * FROM leads")
    return rows;
}

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows;
}

export async function getUserById(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE id = ?
    `, [id])
    return rows[0];
}

export async function getUserByEmail(email) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE email = ?
    `, [email])
    return rows[0];
}

export async function checkUserMdp(email, password) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE email = ? AND password = ?
    `, [email, password])
    return rows[0];
}

export async function createUser(email, password, firstname, lastname, user_type, manager) {
    const result = await pool.query(`
    INSERT INTO users (email, password, firstname, lastname, user_type, manager)
    VALUES (?, ?, ?, ?, ?, ?)
    `, [email, password, firstname, lastname, user_type, manager])
    
    const id = result.insertId
    return await getUserById(id);
}

//const users = await createUser("slave2@gmail.com", "Dardal", "Slave", "SLAVE", "manager@gmail.com")
// const display = await getLeads()
// console.log(display);