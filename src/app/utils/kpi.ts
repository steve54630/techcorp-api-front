import IAnalytics from "../types/analytics";

export interface Kpi {
    title: string;
    value: number;
    target?: number;
    icon: string;
    unit: string;
    trend: string;}

export function extractKpiData(data : IAnalytics) : Kpi[] {
    const kpiData : Kpi[] = [
        { title: 'Budget', value: data.budget_overview.current_month_total, target: data.budget_overview.monthly_limit, icon: 'trending-up', unit: '€', trend: data.kpi_trends.budget_change }, 
        { title: 'Tools', value: 147, icon: 'wrench', unit: '', trend: data.kpi_trends.tools_change }, 
        { title: 'Departments', value: 8, icon: 'building-2', unit: '', trend: data.kpi_trends.departments_change }, 
        { title: 'Cost per user', value: data.cost_analytics.cost_per_user, icon: 'users', unit: '€', trend: data.kpi_trends.cost_per_user_change }, 
    ];
    return kpiData;
}