import express, { Request, Response, json, urlencoded } from 'express'
import 'express-async-errors'
import fileUpload from 'express-fileupload'

import cors from 'cors'
import morgan from 'morgan'

import CustomError from '@/utils/CustomError'

import error_handler from '@/middlewares/error-handler'
import success_handler from '@/middlewares/success-handler'

// Initialization
const app = express()

// Middleware configuration
app.use(cors())
app.use(json({ limit: '50mb' }))
app.use(urlencoded({ limit: '50mb', extended: true }))
app.use(morgan('dev'))
app.use(
  fileUpload({
    createParentPath: true
  })
)

// Add success logger middleware
app.use(success_handler)

app.get('/', async (req: Request, res: Response) => {
  res.json({
    message: 'Hello, World!'
  })
})

// Test route - To check logging
app.get('/ftc', async (req: Request, res: Response) => {
  const { f: fahrenheit } = req.query
  const celsius = ((Number(fahrenheit) - 32) * 5) / 9

  res.json({
    message: 'Fahrenheit to Celsius',
    data: {
      fahrenheit: Number(fahrenheit),
      celsius: Number(celsius.toFixed(2))
    }
  })
})

// Routes - others routes should be imported here

// Handle unknown routes
app.all('*', (req, _, next) => {
  next(new CustomError(`Route '${req.originalUrl}' not found`, 404))
})

// Error Middleware configuration
app.use(error_handler)

export default app
