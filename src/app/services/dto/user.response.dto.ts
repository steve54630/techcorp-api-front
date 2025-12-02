export interface IUserResponse {
  id: number
  name: string
  email: string
  department_id: number
  role: string // "Senior Developer", "UX Designer", etc.
  active: boolean
  joined_at: string // "YYYY-MM-DD"
}