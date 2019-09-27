const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const cors = require('./cors')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus = 200
    })
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        next()
    })
    .get(cors.cors, (req, res, next) => {
        res.end('Will send all the leaders to you!')
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.end('Will add the leaders: ' + req.body.name + " with details: " + req.body.description)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation not supported on /leaders')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.end('Deleting all leaders')
    })

leaderRouter.route('/:leaderId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus = 200
    })
    .get(cors.cors, (req, res, next) => {
        res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!')
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403
        res.end('Post operation not supported on /leader ' + req.params.leaderId)
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.write('Updating the leader: ' + req.params.leaderId + '\n')
        res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description)
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.end('Deleting leader: ' + req.params.leaderId)
    })

module.exports = leaderRouter