/**
 * The starting point of the application.
 *
 * @author Mats Loock
 * @version 1.2.0
 */

'use strict'

const express = require('express')
const logger = require('morgan')

const app = express()
const port = process.env.PORT || 3000

// Set the header of all responses.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET')
  next()
})

// Additional middleware.
app.use(logger('dev'))

// Register routes. All of the routes will be prefixed with /api.
const router = express.Router()
app.use('/api', router)
router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to this very simple api!' }))
router.use('/teams', require('./api/routes/teamRoutes'))

// Start listening.
app.listen(port, () => {
  console.log(`RESTful API server started on http://localhost:${port}`)
})
