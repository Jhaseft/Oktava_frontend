import type { Product, Category } from '@/src/types/product.types';

export type MenuSection = { category: Category; products: Product[] };

export function toPairs<T>(arr: T[]): [T, T | null][] {
  const pairs: [T, T | null][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1] ?? null]);
  }
  return pairs;
}

export function getProductCategoryId(product: Product): string | null {
  if (typeof product.category === 'object' && product.category?.id) return product.category.id;
  if (typeof product.categoryId === 'string' && product.categoryId) return product.categoryId;
  return null;
}

export function getProductCategoryName(product: Product): string {
  if (typeof product.category === 'object' && product.category?.name) return product.category.name;
  if (typeof product.category === 'string' && product.category.trim()) return product.category;
  return 'Categoría';
}

function mapKnownCategories(categories: Category[], products: Product[]): MenuSection[] {
  return categories
    .map((c) => ({ category: c, products: products.filter((p) => getProductCategoryId(p) === c.id) }))
    .filter((s) => s.products.length > 0);
}

function groupProductsIntoMap(products: Product[], excludeIds?: Set<string>): MenuSection[] {
  const map = new Map<string, MenuSection>();
  for (const p of products) {
    const categoryId = getProductCategoryId(p);
    if (!categoryId || excludeIds?.has(categoryId)) continue;
    if (!map.has(categoryId)) {
      map.set(categoryId, {
        category: { id: categoryId, name: getProductCategoryName(p), description: null },
        products: [],
      });
    }
    map.get(categoryId)!.products.push(p);
  }
  return Array.from(map.values());
}

/** Agrupa los productos (ya filtrados por texto) en secciones por categoría. */
export function buildSections(products: Product[], categories: Category[]): MenuSection[] {
  if (categories.length > 0) {
    const byKnown = mapKnownCategories(categories, products);
    const knownIds = new Set(categories.map((c) => c.id));
    return [...byKnown, ...groupProductsIntoMap(products, knownIds)];
  }
  return groupProductsIntoMap(products);
}

/** Dado el scroll actual y las posiciones Y de cada sección, devuelve la sección visible. */
export function activeSectionId(
  sections: MenuSection[],
  offsets: Record<string, number>,
  scrollY: number,
): string {
  let current = 'all';
  for (const s of sections) {
    const off = offsets[s.category.id];
    if (off != null && off <= scrollY) current = s.category.id;
  }
  return current;
}
