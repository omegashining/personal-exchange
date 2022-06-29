import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import Companies from "../data/companies.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Levels", () => {
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

    it("Create level", (done) => {
        chai.request(url)
            .post('/levels/')
            .set('Authorization', token)
            .send({
                companyId: Companies[0].id,
                order: 2,
                description: "LEVEL_2"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                id = res.body.id
                done()
            })
    })

    it("Update level", (done) => {
        chai.request(url)
            .put('/levels/')
            .set('Authorization', token)
            .send({
                id,
                description: "LEVEL_2_CHANGE"
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get levels by company", (done) => {
        chai.request(url)
            .get('/levels/company/' + Companies[0].id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})