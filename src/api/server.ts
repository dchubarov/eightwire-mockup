import {Server} from "miragejs/server";
import {createServer, JSONAPISerializer, Response} from "miragejs";
import {AppFactories, AppModels, AppRegistry, AppSchema, OrderAttributes} from "./models";

import initialCurrencies from "./seeds/currencies.json"
import initialExchangeRates from "./seeds/exchange-rates.json"
import initialRegions from "./seeds/regions.json"
import initialPaymentMethods from "./seeds/payment-methods.json"
import initialUsers from "./seeds/users.json"
import {Instantiate} from "miragejs/-types";
import {apiBaseurl} from "./client";

export function makeApiServer(env?: string): Server {
    return createServer({
        logging: process.env.NODE_ENV === "development",
        namespace: apiBaseurl(),
        environment: env,
        models: AppModels,
        factories: AppFactories,
        serializers: {
            application: JSONAPISerializer
        },

        seeds(server: Server<AppRegistry>) {
            server.db.loadData({
                currencies: initialCurrencies,
                rates: initialExchangeRates,
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

            this.post("/orders", (schema: AppSchema, request) => {
                const requestJson = JSON.parse(request.requestBody)
                const newOrder: Partial<OrderAttributes> = {createDate: new Date()}
                let check = true

                let payer: Instantiate<AppRegistry, "user"> | null = null
                if (check) {
                    if (requestJson.payer) {
                        payer = schema.find("user", requestJson.payer)
                    }
                    if (payer === null) {
                        newOrder.statusMsg = `Payer not found: ${requestJson.payer}`
                        check = false
                    } else if (!payer.verified || !payer.regionId) {
                        newOrder.statusMsg = "Payer must complete their profile and pass verification in order to send money"
                        check = false
                    } else if (!payer.payInId) {
                        newOrder.statusMsg = "Payer's default payment method undefined"
                        check = false
                    } else {
                        newOrder.payerMethodId = payer.payInId
                        newOrder.payerId = payer.id
                    }
                }

                let payee: Instantiate<AppRegistry, "user"> | null = null
                if (check) {
                    if (requestJson.payee) {
                        payee = schema.find("user", requestJson.payee)
                    }
                    if (payee === null) {
                        newOrder.statusMsg = `Payee not found: ${requestJson.payee}`
                        check = false
                    } else if (!payee.verified) {
                        newOrder.statusMsg = "Payee must complete their profile and pass verification in order to receive money"
                        check = false
                    } else if (!payee.payOutId) {
                        newOrder.statusMsg = "Payee's default payout method undefined"
                        check = false
                    } else {
                        newOrder.payeeMethodId = payee.payOutId
                        newOrder.payeeId = payee.id
                    }
                }

                if (check) {
                    let amount = NaN
                    if (requestJson.amount) {
                        amount = Number(requestJson.amount)
                    }
                    if (isNaN(amount) || amount <= 0) {
                        newOrder.statusMsg = `Invalid amount: ${requestJson.amount}`
                        check = false
                    } else {
                        const payerRegion = schema.find("region", payer!.regionId)
                        const paymentMethod = schema.find("paymentMethod", payer!.payInId)

                        newOrder.paymentServiceFee = amount * payerRegion!.serviceFee
                        newOrder.paymentFee = amount * paymentMethod!.paymentFee
                        newOrder.paymentAmount = amount + newOrder.paymentServiceFee + newOrder.paymentFee

                        const payoutMethod = schema.find("paymentMethod", payee!.payOutId)
                        const payout = currencyExchange(schema, paymentMethod!.currencyId, payoutMethod!.currencyId, amount)
                        if (isNaN(payout)) {
                            newOrder.statusMsg = "Could not calculate payout fee"
                            check = false
                        } else {
                            newOrder.payoutFee = payout * payoutMethod!.payoutFee
                            newOrder.payoutAmount = payout
                        }
                    }
                }

                return schema.create("order", {
                    status: check ? "created" : "rejected",
                    ...newOrder
                })
            });

            this.get("/orders", (schema: AppSchema, request) => {
                let statuses: string[] = []
                if (request.queryParams.status) {
                    statuses = request.queryParams.status.split(",")
                }

                const predicate = (order: Instantiate<AppRegistry, "order">) => {
                    let ok = true

                    if (ok && statuses.length > 0)
                        ok = statuses.includes(order.status)
                    if (ok && request.queryParams.payer)
                        ok = order.payerId === request.queryParams.payer
                    if (ok && request.queryParams.payee)
                        ok = order.payeeId === request.queryParams.payee

                    return ok
                }

                return schema.where("order", predicate)
            });

            this.get("/orders/:id", (schema: AppSchema, request) => {
                return schema.find("order", request.params.id) || new Response(404)
            });

            this.get("/orders/:id/approve", (schema: AppSchema, request) => {
                const order = schema.find("order", request.params.id)
                if (order !== null && order.status === "created") {
                    order.status = "pending"
                    order.save()
                    return new Response(204)
                }
                return new Response(404)
            });

            this.delete("/orders/:id", (schema: AppSchema, request) => {
                const order = schema.find("order", request.params.id)
                if (order === null || order.status !== "created") {
                    return new Response(401)
                } else {
                    order.destroy()
                    return new Response(204)
                }
            });

            this.timing = 0;
        }
    })
}

function currencyExchange(schema: AppSchema, fromCurrencyId: string, toCurrencyId: string, amount: number): number {
    const exchange = schema.findBy("rate", r => {
        return (r.fromCurrencyId === fromCurrencyId && r.toCurrencyId === toCurrencyId) ||
            (r.fromCurrencyId === toCurrencyId && r.toCurrencyId === fromCurrencyId)
    })

    if (exchange !== null) {
        if (exchange.fromCurrencyId === toCurrencyId) {
            return Math.ceil(amount * exchange.rate)
        } else {
            return Math.ceil(amount / exchange.rate)
        }
    }

    return NaN
}
