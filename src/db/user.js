import * as db from "./dbPool"

// User queries
const getUserByUsername = async (username) => {
    const stmt = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(stmt, [username]);
    return result.rows[0];
};

const createUser = async (username, hashedPassword) => {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const values = [username, hashedPassword];
    await db.query(query, values);
};

export default {
    getUserByUsername,
    createUser
}