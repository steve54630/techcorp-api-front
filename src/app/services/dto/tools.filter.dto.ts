export interface IToolFilter {
    status?: "active" | "unused" | "expiring"
    name_like?: string
    sort?: "name" | "monthly_cost"
    order?: "asc" | "desc"
}