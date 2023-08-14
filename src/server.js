import express from "express"
import cors from "cors"
import * as db from "./db/dbPool"
import { authenticateJWT } from "./middlewares/authMiddleware"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import codeHandler from "./routes/code"

const secretKey = process.env.ACCESS_TOKEN_SECRET

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// initialize YugabyteDB

// Initialize the database schema (execute this once)
/*(async () => {
    const client = await db.getClient()
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await client.query('CREATE TABLE IF NOT EXISTS users (id UUID DEFAULT uuid_generate_v4(), username VARCHAR(50) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL)')
    client.release()
})()*/

// register user
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        // Store user data in YugabyteDB
        await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword])

        const token = jwt.sign({ username }, secretKey)
        res.status(201).json({ token })
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).json({ error: 'Unable to register user' })
    }
})

// login user
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username])
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, secretKey)
            res.status(200).json({ token })
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).json({ error: 'Unable to log in' })
    }
})

// Protected route with authentication middleware
app.get('/api/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'You have access to the protected route' })
})

// handle user queries
app.get('api/user', authenticateJWT, userHandler)

// handle db queries for code
app.get('/api/code', authenticateJWT, codeHandler)

// handle db queries for notes
// app.get('/api/notes', authenticateJWT, noteHandler)

// start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})