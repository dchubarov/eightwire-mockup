import {createServer, Model, Response} from 'miragejs'

export function makeServer(environment?: string) {
    createServer({
        namespace: "/api",

        environment: environment,

        models: {
            user: Model
        },

        seeds(server) {
            server.create("user", {id: "owner", type: "owner", verified: true, display: "The Owner"})
            server.create("user", {id: "dime", type: "customer", verified: true, display: "Dmitry Chubarov"})
        },

        routes() {
            this.get("/health", () => {
                return {status: "OK", version: "1.0.0-mockup"}
            })

            this.get("/users", (schema) => {
                return schema.all("user")
            })

            this.get("/users/:id", (schema, request) => {
                return schema.find("user", request.params.id) || new Response(404)
            })

            this.logging = true
        }
    })
}
