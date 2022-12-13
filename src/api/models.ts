import {ModelDefinition, Registry} from "miragejs/-types";
import {belongsTo, hasMany, Model} from "miragejs";
import Schema from "miragejs/orm/schema";

interface CurrencyAttributes {
    display: string
    symbol: string
    mde: number
}

const CurrencyModel: ModelDefinition<CurrencyAttributes> = Model.extend({})

interface ExchangeRateAttributes {
    fromCurrencyId: string
    fromUnitsMde: number
    toCurrencyId: string
    toUnitsMde: number
    rate: number
}

const ExchangeRateModel: ModelDefinition<ExchangeRateAttributes> = Model.extend({
    fromCurrency: belongsTo("currency"),
    toCurrency: belongsTo("currency")
})

interface RegionAttributes {
    display: string
}

const RegionModel: ModelDefinition<RegionAttributes> = Model.extend({})

interface PaymentMethodAttributes {
    display: string
    currencyId: string
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

export const AppModels = {
    currency: CurrencyModel,
    rate: ExchangeRateModel,
    region: RegionModel,
    paymentMethod: PaymentMethodModel,
    user: UserModel
}

export const AppFactories = {}

export type AppRegistry = Registry<typeof AppModels, typeof AppFactories>
export type AppSchema = Schema<AppRegistry>
