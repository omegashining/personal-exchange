import chai from "chai"

const expect = chai.expect

export const booleanResponse = async (err, res) => {
    if (err) {
        console.log("Error: " + err)
        throw err
    }

    console.log("Res: " + JSON.stringify(res.body))

    expect(res).to.have.status(200)
    expect(res.body.result).to.equals(true)
}

export const objectResponse = async (err, res) => {
    if (err) {
        console.log("Error: " + err)
        throw err
    }

    console.log("Res: " + JSON.stringify(res.body))

    expect(res).to.have.status(200)
    expect(!!res.body.id).to.equals(true)
}

export const arrayResponse = async (err, res) => {
    if (err) {
        console.log("Error: " + err)
        throw err
    }

    console.log("Res: " + JSON.stringify(res.body))

    expect(res).to.have.status(200)
    expect(res.body.length).to.be.greaterThan(0)
}

