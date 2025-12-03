import { Sort } from "../services/dto/tools.filter.dto";

 export const columnHeaders : { key: Sort ; label: string, resume : boolean }[] = [
    { key: Sort.NAME, label: 'Tool', resume: true },
    { key: Sort.CATEGORY, label: 'Category', resume: false },
    { key: Sort.DEPARTMENT, label: 'Department', resume: true },
    { key: Sort.ACTIVE_USERS_COUNT, label: 'Users', resume: true },
    { key: Sort.MONTHLY_COST, label: 'Monthly Cost', resume: true },
    { key: Sort.STATUS, label: 'Status', resume: true },
    { key: Sort.UPDATED_AT, label: 'Updated At', resume: false },
  ];