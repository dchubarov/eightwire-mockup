import {makeApiServer} from "./server";
import {Server} from "miragejs/server";
import {AppRegistry} from "./models";
import {deserialize} from "./json-api-deserialize";

let testServer: Server<AppRegistry>

test("request all users", async () => {

    const json = await fetch(testServer.namespace + "/users")
        .then(response => response.json())

    console.debug(JSON.stringify(deserialize(json)))
})

test("request user including payment methods", async () => {
    const json = await fetch(testServer.namespace + "/users/master?include=region,pay-in.currency,pay-out.currency")
        .then(response => response.json())

    console.debug(JSON.stringify(deserialize(json)))
})

test("create new order", async () => {
    const request = {
        payer: "john",
        payee: "hanna",
        amount: 1000
    }

    const json = await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify(request)})
        .then(response => response.json())

    console.debug(JSON.stringify(deserialize(json)))
})

test("get orders with filter", async () => {
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"john", payee: "hanna", amount: 100})})
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"john", payee: "hanna", amount: 200})})
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"john", payee: "hanna", amount: 300})})

    const json = await fetch(testServer.namespace + "/orders?user=john&include=payee,payee.region,payer-method.currency")
        .then(response => response.json())

    console.log(JSON.stringify(deserialize(json)))
    // if (json.data && json.data.length > 0) {
    //     json.data.forEach((v: Object) => {
    //         console.log(JSON.stringify(deserialize(v)))
    //     })
    // }
})

beforeEach(() => {
    testServer = makeApiServer()
})

afterEach(() => {
    testServer.shutdown()
})
