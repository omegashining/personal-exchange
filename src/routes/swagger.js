import AbstractRouter from "./abstract-router"
import swaggerDocument from '../swagger/swagger.json'

export default class SwaggerRouter extends AbstractRouter {
    init() {
        this.swagger('/', swaggerDocument)
    }
}