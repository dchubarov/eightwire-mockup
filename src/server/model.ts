
export interface HealthResponse {
    status?: string
    version?: string
}

export type UserType = "owner" | "customer"

export interface User {
    id: string
    type: UserType
    verified: boolean
    display?: string
}
