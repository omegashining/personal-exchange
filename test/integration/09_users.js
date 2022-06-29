import ChaiHttp from 'chai-http'
import chai from "chai"
import {booleanResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import Companies from "../data/companies.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Users", () => {
    let token = ""
    let userId = ""

    it("Authenticate", (done) => {
        chai.request(url)
            .post('/access/')
            .send({
                email: Data[0].email,
                password: Data[0].password
            })
            .end(async (err, res) => {
                await objectResponse(err, res)

                if (res.body) {
                    token = "Bearer " + res.body.token
                }
                done()
            })
    })

    it("Create user", (done) => {
        chai.request(url)
            .post('/users/')
            .set('Authorization', token)
            .send({
                companyId: Companies[0].id,
                name: "User Integration",
                email: "user_integration@domain.com",
                password: "user_integration"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                userId = res.body.id
                done()
            })
    })

    it("Update user", (done) => {
        chai.request(url)
            .put('/users/')
            .set('Authorization', token)
            .send({
                id: userId,
                levelId: 1,
                name: "User Integration Change",
                email: "user_integration_change@domain.com"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Update user password", (done) => {
        chai.request(url)
            .put('/users/password/')
            .set('Authorization', token)
            .send({
                id: userId,
                password: "user_integration_change"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get user by id", (done) => {
        chai.request(url)
            .get('/users/' + userId)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Activate user", (done) => {
        chai.request(url)
            .put('/users/activate')
            .set('Authorization', token)
            .send({
                id: userId
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Inactivate user", (done) => {
        chai.request(url)
            .put('/users/inactivate')
            .set('Authorization', token)
            .send({
                id: userId
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Lock user", (done) => {
        chai.request(url)
            .put('/users/lock')
            .set('Authorization', token)
            .send({
                id: userId
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })
})