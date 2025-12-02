import { ITool } from "./tool";
import { IUser } from "./user";

export interface IUserTool {
    user_id: IUser;
    tool_id: ITool;
    usage_frequency: "daily" | "weekly" | "monthly" | "rarely";
    created_at: string;
    updated_at: string;
    proficiency_level: "beginner" | "intermediate" | "advanced" | "expert"
}