import ChaiHttp from 'chai-http'
import chai from "chai"
import {booleanResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json";

const expect = chai.expect
chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Webhooks", () => {
    let token = ""
    let id = ""
    const endpoint = "http://www.domain.com/service"

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

    it("Create webhook", (done) => {
        chai.request(url)
            .post('/webhooks/')
            .set('Authorization', token)
            .send({
                url: endpoint,
                contentType: "application/json"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                id = res.body.id
                done()
            })
    })

    it("Get webhook", (done) => {
        chai.request(url)
            .get('/webhooks/' + id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                expect(res.body.url).to.equals(endpoint)
                done()
            })
    })

    it("Add webhook event", (done) => {
        chai.request(url)
            .post('/webhooks/event/')
            .set('Authorization', token)
            .send({
                id,
                eventId: 1
            })
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                expect(res.body.result).to.equals(1)
                done()
            })
    })

    it("Activate webhook", (done) => {
        chai.request(url)
            .put('/webhooks/activate')
            .set('Authorization', token)
            .send({
                id
            })
            .end(async (err, res) => {
                await booleanResponse(err, res)
                done()
            })
    })

    it("Inactive webhook", (done) => {
        chai.request(url)
            .put('/webhooks/inactivate')
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