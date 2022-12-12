import {ModelDefinition, Registry} from "miragejs/-types";
import {belongsTo, Model} from "miragejs";
import Schema from "miragejs/orm/schema";

interface CurrencyAttributes {
    display: string
    symbol: string
}

const CurrencyModel: ModelDefinition<CurrencyAttributes> = Model.extend({})

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

type UserKind = "owner" | "customer"

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
    payOut: belongsTo("paymentMethod")
})

export const AppModels = {
    currency: CurrencyModel,
    region: RegionModel,
    paymentMethod: PaymentMethodModel,
    user: UserModel
}

export const AppFactories = {}

export type AppRegistry = Registry<typeof AppModels, typeof AppFactories>
export type AppSchema = Schema<AppRegistry>
