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

export async function getManagerLeads(id, search, limit, offset) {
    const [rows] = await pool.query(`
    SELECT *
    FROM leads
    WHERE manager_id = ?
    AND (firstname LIKE "%${search}%"
    OR email LIKE "%${search}%" 
    OR phone_number_concatenated LIKE "%${search}%" 
    OR lastname LIKE "%${search}%")
    LIMIT ?
    OFFSET ?
    `, [id, limit, offset])
    return rows;
}

/*
SELECT * FROM lead_access_app.leads
WHERE firstname LIKE "%%"
OR email LIKE "%%" 
OR phone_number_concatenated LIKE "%%" 
OR lastname LIKE "%%";

WHERE manager_id = 1 AND
(firstname LIKE "%aa%"
OR email LIKE "%aa%" 
OR phone_number_concatenated LIKE "%aa%" 
OR lastname LIKE "%aa%");
*/

export async function getManagerLeadsCount(id) {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE manager_id = ?
    `, [id])
    return rows[0]['COUNT(*)'];
}

export async function getManagerLeadsCountNotAssigned(id) {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE manager_id = ?
    AND assigned_to IS NULL
    `, [id])
    return rows[0]['COUNT(*)'];
}

export async function getUserLeads(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM leads
    WHERE assigned_to = ?
    LIMIT 1000
    `, [id])
    return rows;
}

export async function getUserLeadsCount(id) {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE assigned_to = ?
    `, [id])
    return rows[0]['COUNT(*)'];
}

export async function getLeadsDepartementCount(departement) {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE departement IN (?) AND assigned_to is null 
    `, [departement])
    return rows[0]['COUNT(*)'];
}

export async function getNRP() {
    const [rows] = await pool.query(`
    SELECT *
    FROM leads
    WHERE statut = "NRP"
    `)
    return rows;
}

export async function getNRPCount() {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE statut = "NRP"
    `)
    return rows[0]['COUNT(*)'];
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

export async function getCollaborators(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE manager_id = ?
    `, [id])
    return rows;
}

export async function checkUserMdp(email, password) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE email = ? AND password = ?
    `, [email, password])
    return rows[0];
}

export async function createUser(email, password, firstname, lastname, user_type, manager_id) {
    const result = await pool.query(`
    INSERT INTO users (email, password, firstname, lastname, user_type, manager_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `, [email, password, firstname, lastname, user_type, manager_id])
    
    const id = result.insertId
    return await getUserById(id);
}

export async function updateLead(id, champ, value) {
    const set = "SET " + champ + " = '" + value + "'";
    const [rows] = await pool.query("UPDATE leads " + set + " WHERE id = ?", [id])
    return rows[0];
}

export async function addLeadToCollab(id, region, number) {
    const [rows] = await pool.query(`
    UPDATE leads
    SET assigned_to = ?
    WHERE (departement IN (?) AND assigned_to is NULL)
    LIMIT ?
    `, [id, region, number])
    return rows.affectedRows;
}

export async function clearNRP() {
    const [rows] = await pool.query(`
    UPDATE leads
    SET assigned_to = NULL, statut = NULL
    WHERE statut = "NRP"
    `,)
    return rows;
}