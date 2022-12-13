import {ModelDefinition, Registry} from "miragejs/-types";
import {belongsTo, hasMany, Model} from "miragejs";
import Schema from "miragejs/orm/schema";

interface CurrencyAttributes {
    display: string
    symbol: string
}

const CurrencyModel: ModelDefinition<CurrencyAttributes> = Model.extend({})

interface ExchangeRateAttributes {
    fromCurrencyId: string
    toCurrencyId: string
    rate: number
}

const ExchangeRateModel: ModelDefinition<ExchangeRateAttributes> = Model.extend({
    fromCurrency: belongsTo("currency"),
    toCurrency: belongsTo("currency")
})

interface RegionAttributes {
    display: string
    serviceFee: number
}

const RegionModel: ModelDefinition<RegionAttributes> = Model.extend({})

interface PaymentMethodAttributes {
    display: string
    currencyId: string,
    paymentFee: number,
    payoutFee: number
}

const PaymentMethodModel: ModelDefinition<PaymentMethodAttributes> = Model.extend({
    currency: belongsTo("currency")
})

type UserKind = "master" | "customer"

interface UserAttributes {
    display: string
    kind: UserKind,
    verified: boolean,
    regionId: string
    payInId: string,
    payOutId: string
}

const UserModel: ModelDefinition<UserAttributes> = Model.extend({
    region: belongsTo("region"),
    payIn: belongsTo("paymentMethod"),
    payOut: belongsTo("paymentMethod"),
    trusted: hasMany("user")
})

type OrderStatus = "created" | "rejected"

export interface OrderAttributes {
    status: OrderStatus
    statusMsg: string
    payerId: string
    payerMethodId: string
    payeeId: string
    payeeMethodId: string
    paymentAmount: number
    paymentServiceFee: number
    paymentFee: number
    payoutAmount: number
    payoutFee: number
    createDate: Date
    performDate: Date
}

const OrderModel: ModelDefinition<OrderAttributes> = Model.extend({
    payer: belongsTo("user"),
    payerMethod: belongsTo("paymentMethod"),
    payee: belongsTo("user"),
    payeeMethod: belongsTo("paymentMethod"),
})

export const AppModels = {
    currency: CurrencyModel,
    rate: ExchangeRateModel,
    region: RegionModel,
    paymentMethod: PaymentMethodModel,
    user: UserModel,
    order: OrderModel
}

export const AppFactories = {}

export type AppRegistry = Registry<typeof AppModels, typeof AppFactories>
export type AppSchema = Schema<AppRegistry>
