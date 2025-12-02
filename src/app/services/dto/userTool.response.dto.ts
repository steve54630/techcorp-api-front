export interface IUserToolResponse {
  user_id: number;
  tool_id: number;
  usage_frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  last_used: string; // ISO date
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
