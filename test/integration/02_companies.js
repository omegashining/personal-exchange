import ChaiHttp from 'chai-http'
import chai from "chai"
import {booleanResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Companies", () => {
    let token = ""
    let id = ""

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

    it("Create company", (done) => {
        chai.request(url)
            .post('/companies/')
            .set('Authorization', token)
            .send({
                name: "Company Integration"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                id = res.body.id
                done()
            })
    })

    it("Update company", (done) => {
        chai.request(url)
            .put('/companies/')
            .set('Authorization', token)
            .send({
                id,
                name: "Company Integration Change"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get company by id", (done) => {
        chai.request(url)
            .get('/companies/' + id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Activate company", (done) => {
        chai.request(url)
            .put('/companies/activate')
            .set('Authorization', token)
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Inactivate company", (done) => {
        chai.request(url)
            .put('/companies/inactivate')
            .set('Authorization', token)
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Lock company", (done) => {
        chai.request(url)
            .put('/companies/lock')
            .set('Authorization', token)
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })
})
