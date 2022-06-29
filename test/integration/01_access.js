import ChaiHttp from 'chai-http'
import chai from "chai"
import {booleanResponse, objectResponse} from "./responses.js"

const expect = chai.expect
chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Access", () => {
    let token = ""
    let id = ""

    it("Get uuid", (done) => {
        chai.request(url)
            .get('/access/uuid')
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))
                expect(res).to.have.status(200)
                done()
            })
    })

    it("Authenticate", (done) => {
        chai.request(url)
            .post('/access/')
            .send({
                email: "root@xoycoin.com",
                password: "xoycoin0112358"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)

                if (res.body) {
                    token = "Bearer " + res.body.token
                    id = res.body.id
                }
                done()
            })
    })

    it("Get access", (done) => {
        chai.request(url)
            .get('/access/')
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get access by id", (done) => {
        chai.request(url)
            .get('/access/' + id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Enable access session", (done) => {
        chai.request(url)
            .put('/access/')
            .set('Authorization', token)
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Delete access session", (done) => {
        chai.request(url)
            .delete('/access/')
            .set('Authorization', token)
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Activate access", (done) => {
        chai.request(url)
            .put('/access/activate')
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Inactivate access", (done) => {
        chai.request(url)
            .put('/access/inactivate')
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Lock access", (done) => {
        chai.request(url)
            .put('/access/lock')
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })
})