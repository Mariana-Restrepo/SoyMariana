import type { CategoryInfo, CategoryKey } from '@soymariana/content';

export type CategoryFilter = CategoryKey | 'all';

export function filterByCategory<T extends { category: CategoryKey }>(
  items: readonly T[],
  filter: CategoryFilter,
): T[] {
  return filter === 'all' ? [...items] : items.filter((item) => item.category === filter);
}

/** Categorías que tienen al menos un elemento (para no mostrar filtros vacíos). */
export function categoriesWithItems(
  categories: readonly CategoryInfo[],
  items: readonly { category: CategoryKey }[],
): CategoryInfo[] {
  const used = new Set(items.map((i) => i.category));
  return categories.filter((c) => used.has(c.key));
}
