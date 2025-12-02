export interface IUserFilter {
    active? : boolean
    name_like? : string
    embed? : "department" | "user_tools"
}