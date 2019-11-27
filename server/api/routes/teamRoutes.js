/**
 * Module for the team routes.
 *
 * @author Mats Loock
 * @version 1.2.0
 */

'use strict'

const teamController = require('../controllers/teamController')
const express = require('express')
const router = express.Router()

// /teams?q=
router.get('/', teamController.list)

// /teams/:id
router.get('/:id', teamController.get)

module.exports = router
