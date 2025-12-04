import { filter } from 'rxjs';
import { Sort } from '../services/dto/tools.filter.dto';
import { ITool } from '../types/tool';

export function toUppercaseFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function absoluteValue(string: string): number {
  const numericString = string.replace(/[^\d.,-]/g, '');
  const numericValue = Math.abs(parseFloat(numericString));
  return numericValue;
}

/**
 * Applique les filtres (status, department, categories) aux données brutes.
 */
export function applyFilters(allTools: ITool[], filters: any): ITool[] {
  console.log("🚀 ~ applyFilters ~ filters:", filters)
  let filtered = allTools;

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((tool) => tool.status === filters.status);
  }

  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter(
      (tool) => tool.owner_department === filters.department
    );
  }

  if (filters.categories && filters.categories !== 'all') {
    filtered = filtered.filter((tool) =>
      tool.category.toLowerCase().includes(filters.categories.toLowerCase())
    );
  }
  
  if (filters.minPrice && filters.maxPrice) {
      filtered = filtered.filter((tool) => {
      const price = +tool.monthly_cost || 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });
    console.log("🚀 ~ applyFilters ~ filtered:", filtered)
  }

  return filtered;
}

/**
 * Trie les outils selon la colonne et la direction spécifiées.
 */
export function sortTools(
  tools: ITool[],
  column: Sort,
  direction: 'asc' | 'desc'
): ITool[] {
  const sortedTools = [...tools];

  sortedTools.sort((a, b) => {
    const aValue = a[column as keyof ITool];
    const bValue = b[column as keyof ITool];

    let comparison = 0;

    // Logique de comparaison pour les chaînes et les autres types (nombres)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (aValue > bValue) {
      comparison = 1;
    } else if (aValue < bValue) {
      comparison = -1;
    }

    // Inverse le résultat si la direction est 'desc'
    return direction === 'desc' ? comparison * -1 : comparison;
  });

  return sortedTools;
}
