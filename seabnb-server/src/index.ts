import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'

dotenv.config()
const app = express()

app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
})