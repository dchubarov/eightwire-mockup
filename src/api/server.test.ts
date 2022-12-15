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
})

test("reconcile orders", async () => {
    // create and approve some orders
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"giorgi", payee: "mariam", amount: 1000})})
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"john", payee: "hanna", amount: 375})})
    await fetch(testServer.namespace + "/orders/1/approve")
    await fetch(testServer.namespace + "/orders/2/approve")

    let json = await fetch(testServer.namespace + "/orders/reconcile?ids=1,2")
        .then(response => response.json())

    console.log(JSON.stringify(json))

    json = await fetch(testServer.namespace + "/orders")
        .then(response => response.json())

    console.log(JSON.stringify(deserialize(json)))
})

test("get transactions", async () => {
    // create some transactions
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"giorgi", payee: "mariam", amount: 1000})})
    await fetch(testServer.namespace + "/orders", {method: "post", body: JSON.stringify({payer:"john", payee: "hanna", amount: 375})})
    await fetch(testServer.namespace + "/orders/1/approve")
    await fetch(testServer.namespace + "/orders/2/approve")
    await fetch(testServer.namespace + "/orders/reconcile?ids=1,2")

    const json = await fetch(testServer.namespace + "/transactions?from=john-apay&include=fromAccount,toAccount")
        .then(response => response.json())

    console.log(JSON.stringify(deserialize(json)))

})

beforeEach(() => {
    testServer = makeApiServer()
})

afterEach(() => {
    testServer.shutdown()
})
