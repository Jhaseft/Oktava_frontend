/**
 * Utilidades para comparar versiones tipo semver ("7.0.0").
 * Ignora sufijos pre-release ("7.0.0-beta.1" => [7,0,0]).
 */

function parse(version: string): number[] {
  return version
    .trim()
    .split('-')[0] // descarta pre-release
    .split('.')
    .map((p) => parseInt(p, 10) || 0);
}

/**
 * Compara dos versiones.
 * @returns -1 si a < b, 0 si a === b, 1 si a > b
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const va = parse(a);
  const vb = parse(b);
  const len = Math.max(va.length, vb.length);

  for (let i = 0; i < len; i++) {
    const na = va[i] ?? 0;
    const nb = vb[i] ?? 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

/** ¿`current` es estrictamente menor que `target`? */
export function isVersionLower(current: string, target: string): boolean {
  return compareVersions(current, target) < 0;
}
