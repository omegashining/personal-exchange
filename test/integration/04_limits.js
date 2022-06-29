import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import Levels from "../data/levels.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Limits", () => {
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

    it("Create limit", (done) => {
        chai.request(url)
            .post('/limits/')
            .set('Authorization', token)
            .send({
                levelId: Levels[0].id,
                type: "MXN",
                deposit: 50,
                withdrawal: 50
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                id = res.body.id
                done()
            })
    })

    it("Update limit", (done) => {
        chai.request(url)
            .put('/limits/')
            .set('Authorization', token)
            .send({
                id,
                type: "MXN",
                deposit: 100,
                withdrawal: 100
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get limits by level", (done) => {
        chai.request(url)
            .get('/limits/level/' + Levels[0].id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})
