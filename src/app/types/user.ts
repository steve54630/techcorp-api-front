import { IDepartment } from "./department";

export interface IUser {
    id: number;
    name: string;
    email: string;
    department : IDepartment;
    created_at: string;
    updated_at: string;
}