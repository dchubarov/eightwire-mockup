import {Server} from "miragejs/server";
import {createServer, JSONAPISerializer, Response} from "miragejs";
import {AppFactories, AppModels, AppRegistry, AppSchema} from "./models";

import initialCurrencies from "./seeds/currencies.json"
import initialRegions from "./seeds/regions.json"
import initialPaymentMethods from "./seeds/payment-methods.json"
import initialUsers from "./seeds/users.json"

export function makeApiServer(env?: string): Server {
    return createServer({
        logging: process.env.NODE_ENV === "development",
        namespace: "/api",
        environment: env,
        models: AppModels,
        factories: AppFactories,
        serializers: {
            application: JSONAPISerializer
        },

        seeds(server: Server<AppRegistry>) {
            server.db.loadData({
                currencies: initialCurrencies,
                regions: initialRegions,
                paymentMethods: initialPaymentMethods,
                users: initialUsers,
            })
        },

        routes() {
            this.get("/users", (schema: AppSchema) => {
                return schema.all("user")
            });

            this.get("/users/:id", (schema: AppSchema, request) => {
                return schema.find("user", request.params.id) || new Response(404)
            });

            this.get("/health", () => {
                return {
                    data: {
                        status: "OK",
                        version: "1.0.0-mockup",
                    }
                }
            });

            this.timing = 0;
        }
    })
}