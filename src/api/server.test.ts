import {makeApiServer} from "./server";
import {Server} from "miragejs/server";
import {AppRegistry} from "./models";
import {deserialize} from "json-api-deserialize";

let testServer: Server<AppRegistry>

test("request all users", async () => {

    const json = await fetch(testServer.namespace + "/users")
        .then(response => response.json())

    console.debug(JSON.stringify(deserialize(json)))
})

test("request user including payment methods", async () => {
    const json = await fetch(testServer.namespace + "/users/john?include=region,pay-in.currency,pay-out.currency")
        .then(response => response.json())

    console.debug(JSON.stringify(deserialize(json)))
})

beforeEach(() => {
    testServer = makeApiServer()
})

afterEach(() => {
    testServer.shutdown()
})
