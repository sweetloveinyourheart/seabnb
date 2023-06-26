import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { openapiSpecification } from './configs/swagger'
import { GlobalException } from './middlewares/globalExeception'
import router from './routers'
import mongoose from 'mongoose'

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Config mongo connection
const connectionString = process.env.MONGO_URI as string
mongoose
  .connect(connectionString)
  .then(() => console.log(`Database connected`))
  .catch(() => console.log(`Connect to database failed`))

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use("/api-v1/", router)
app.use(GlobalException)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
})