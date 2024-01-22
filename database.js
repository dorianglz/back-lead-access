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

// export async function getManagerLeads(id, search, limit, offset) {
//     const [rows] = await pool.query(`
//     SELECT *
//     FROM leads
//     WHERE manager_id = ?
//     AND (firstname LIKE "%${search}%"
//     OR email LIKE "%${search}%"
//     OR statut LIKE "%${search}%" 
//     OR phone_number_concatenated LIKE "%${search}%" 
//     OR lastname LIKE "%${search}%")
//     LIMIT ?
//     OFFSET ?
//     `, [id, limit, offset])
//     return rows;
// }

export async function getManagerLeads(id, search, status, limit, offset) {
    let query = `
    SELECT *
    FROM leads
    WHERE manager_id = ?
    `;

    const params = [id];

    if (search) {
        query += `
            AND (firstname LIKE ? 
            OR email LIKE ? 
            OR phone_number_concatenated LIKE ? 
            OR lastname LIKE ?)`;
        
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (status) {
        query += `
            AND statut = ?`;
        
        params.push(status);
    }

    query += `
    LIMIT ?
    OFFSET ?`;

    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}



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

// export async function getUserLeads(id, search, limit, offset) {
//     const [rows] = await pool.query(`
//     SELECT *
//     FROM leads
//     WHERE assigned_to = ?
//     AND (firstname LIKE "%${search}%"
//     OR email LIKE "%${search}%" 
//     OR phone_number_concatenated LIKE "%${search}%" 
//     OR lastname LIKE "%${search}%")
//     LIMIT ?
//     OFFSET ?
//     `, [id, limit, offset])
//     return rows;
// }

export async function getUserLeads(id, search, status, limit, offset) {
    let query = `
    SELECT *
    FROM leads
    WHERE assigned_to = ?
    `;

    const params = [id];

    if (search) {
        query += `
            AND (firstname LIKE ? 
            OR email LIKE ? 
            OR phone_number_concatenated LIKE ? 
            OR lastname LIKE ?)`;
        
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (status) {
        query += `
            AND statut = ?`;
        
        params.push(status);
    }

    query += `
    LIMIT ?
    OFFSET ?`;

    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
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

export async function getLeadsDepartementCount(departement, id) {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE departement IN (?)
        AND assigned_to is null 
        AND manager_id = ?
    `, [departement, id])
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

export async function getNRPCount(id) {
    const [rows] = await pool.query(`
    SELECT COUNT(*)
    FROM leads
    WHERE statut = "NRP"
    and manager_id = ?
    `, [id])
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

export async function addLeadToCollab(id, region, number, manager_id) {
    const [rows] = await pool.query(`
    UPDATE leads
    SET assigned_to = ?
    WHERE (departement IN (?) AND assigned_to is NULL AND manager_id = ?)
    LIMIT ?
    `, [id, region, manager_id, number])
    return rows.affectedRows;
}

export async function clearNRP(id) {
    const [rows] = await pool.query(`
    UPDATE leads
    SET assigned_to = NULL, statut = NULL
    WHERE statut = "NRP"
    and manager_id = ?
    `, [id])
    return rows;
}


export async function getAllStatusCount(id) {
    const [rows] = await pool.query(`
    SELECT statut, COUNT(*) AS count_statut
    FROM lead_access_app.leads
    WHERE manager_id=?
    GROUP BY statut
    ORDER BY count_statut DESC;
    `, [id])
    return rows;
}

export async function getAllStatusCountUser(id) {
    const [rows] = await pool.query(`
    SELECT statut, COUNT(*) AS count_statut
    FROM lead_access_app.leads
    WHERE assigned_to=?
    GROUP BY statut
    ORDER BY count_statut DESC;
    `, [id])
    return rows;
}