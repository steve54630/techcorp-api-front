export interface IToolFilter {
    status?: "active" | "unused" | "expiring" | null
    name_like?: string
    _sort?: Sort
    _order?: "asc" | "desc"
    _page?: number
    _limit?: number
}

export enum Sort {
    NAME = "name",
    MONTHLY_COST = "monthly_cost",
    DEPARTMENT = "department",
    STATUS = "status",
    ACTIVE_USERS_COUNT = "active_users_count",
    CATEGORY = "category",
    UPDATED_AT = "updated_at",
    ID = "_id"
}