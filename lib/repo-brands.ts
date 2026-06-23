// ==========================================
//  Vehicle Brand store (ยี่ห้อรถยนต์)
//  In-memory prototype — resets on server restart
// ==========================================

export interface Brand {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

let nextId = 100;

export const brands: Brand[] = [
  "TOYOTA", "ISUZU", "NISSAN", "MITSUBISHI", "HONDA",
  "CHEVROLET", "MAZDA", "FORD", "HYUNDAI", "MG",
].map((name, i) => ({
  id: `BRD-${String(i + 1).padStart(3, "0")}`,
  name,
  active: true,
  createdAt: "2024-01-01T00:00:00Z",
}));

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function createBrand(data: Omit<Brand, "id" | "createdAt">): Brand {
  const brand: Brand = {
    ...data,
    id: `BRD-${String(++nextId).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  brands.push(brand);
  return brand;
}

export function updateBrand(id: string, data: Partial<Omit<Brand, "id" | "createdAt">>): Brand | null {
  const idx = brands.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  brands[idx] = { ...brands[idx], ...data };
  return brands[idx];
}

export function deleteBrand(id: string): boolean {
  const idx = brands.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  brands.splice(idx, 1);
  return true;
}
