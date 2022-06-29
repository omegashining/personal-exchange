import express from 'express'
import apicache from "apicache"
import swaggerUi from "swagger-ui-express"

export default class Router {
    constructor(logger) {
        apicache.options({
            appendKey: (req, res) => `${req.path}:${JSON.stringify(req.body)}:${JSON.stringify(req.query)}:${JSON.stringify(req.params)}`
        })
        this.logger = logger
        this.router = express.Router()
        this.cache = apicache.middleware
        this.init()
    }

    init() {
    }

    swagger( path, document ) {
        this.router.use( path, swaggerUi.serve );
        this.router.get( path, swaggerUi.setup( document ) );
    }

    get(path, cache, passport, callback) {
        if (!cache)
            this.router.get(path, this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
        else
            this.router.get(path, this.cache(cache), this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
    }

    post(path, cache, passport, callback) {
        if (!cache)
            this.router.post(path, this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
        else
            this.router.post(path, this.cache(cache), this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
    }

    put(path, cache, passport, callback) {
        if (!cache)
            this.router.put(path, this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
        else
            this.router.put(path, this.cache(cache), this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
    }

    delete(path, cache, passport, callback) {
        if (!cache)
            this.router.delete(path, this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
        else
            this.router.delete(path, this.cache(cache), this._bindCustomResponses, passport ? passport : this._passport, this._getCallback(callback))
    }

    getRouter() {
        return this.router
    }

    _getCallback(callback) {
        return async (...params) => {
            try {
                const startTime = new Date().getTime()
                const response = await callback.apply(this, params)
                const endTime = new Date().getTime()
                const latency = endTime - startTime
                params[1].sendSuccess(response)
                this.logger.debug(`${params[0].method} ${params[0].path}`, {
                    response: {
                        status: 200,
                        executionTime: latency
                    },
                    request: JSON.stringify(params[0].body)
                })
            } catch (error) {
                this.logger.error(`${params[0].method} ${params[0].path}`, {
                    response: {
                        status: 500,
                        error: error + ''
                    },
                    request: JSON.stringify(params[0].body)
                })
                params[1].sendError(error + '')
            }
        }
    }

    _passport(req, res, next) {
        next()
    }

    _bindCustomResponses(req, res, next) {
        res.sendSuccess = (payload) => {
            res.status(200).json(payload)
        }
        res.sendError = (error) => {
            res.status(500).json(error)
        }
        next()
    }
}