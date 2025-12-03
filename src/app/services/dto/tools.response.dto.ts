import { ITool } from "../../types/tool";

export interface IToolResponseDto {
    tools: ITool[];
    total: number;
}