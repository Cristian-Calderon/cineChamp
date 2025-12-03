/**
 * Sistema de niveles para CineChamp
 * Inspirado en el sistema de Steam
 *
 * Fórmula: XP necesario para nivel N = 100 * N^1.5
 * Esto hace que cada nivel requiera más XP que el anterior
 */

export interface NivelInfo {
  nivelActual: number;
  xpActual: number;
  xpParaNivelActual: number;
  xpParaSiguienteNivel: number;
  xpEnNivelActual: number;
  porcentajeProgreso: number;
}

/**
 * Calcula el XP necesario para alcanzar un nivel específico
 */
export function calcularXPParaNivel(nivel: number): number {
  if (nivel <= 1) return 0;
  return Math.floor(100 * Math.pow(nivel, 1.5));
}

/**
 * Calcula el nivel actual basado en la experiencia total
 */
export function calcularNivel(experienciaTotal: number): number {
  if (experienciaTotal <= 0) return 1;

  let nivel = 1;
  while (calcularXPParaNivel(nivel + 1) <= experienciaTotal) {
    nivel++;
  }

  return nivel;
}

/**
 * Obtiene información completa sobre el nivel del usuario
 */
export function obtenerInfoNivel(experienciaTotal: number): NivelInfo {
  const nivelActual = calcularNivel(experienciaTotal);
  const xpParaNivelActual = calcularXPParaNivel(nivelActual);
  const xpParaSiguienteNivel = calcularXPParaNivel(nivelActual + 1);
  const xpEnNivelActual = experienciaTotal - xpParaNivelActual;
  const xpNecesarioEnNivel = xpParaSiguienteNivel - xpParaNivelActual;
  const porcentajeProgreso = (xpEnNivelActual / xpNecesarioEnNivel) * 100;

  return {
    nivelActual,
    xpActual: experienciaTotal,
    xpParaNivelActual,
    xpParaSiguienteNivel,
    xpEnNivelActual,
    porcentajeProgreso: Math.min(100, Math.max(0, porcentajeProgreso))
  };
}

/**
 * Formatea la experiencia con separadores de miles
 */
export function formatearXP(xp: number): string {
  return xp.toLocaleString('es-ES');
}
