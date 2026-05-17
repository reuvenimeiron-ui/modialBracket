// ============================================================
// FIFA World Cup 2026 — 48 qualified nations
// Flags served via flagcdn.com using ISO 3166-1 alpha-2 codes
// Special sub-nation codes: gb-eng (England), gb-sct (Scotland)
// ============================================================

export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'AFC' | 'CAF' | 'OFC';

export interface Country {
  name: string;
  code: string;           // ISO 3166-1 alpha-2 (lowercase), or flagcdn sub-nation code
  confederation: Confederation;
}

export const FIFA_COUNTRIES: Country[] = [
  // ── CONMEBOL (6) ─────────────────────────────────────────
  { name: 'Argentina',              code: 'ar', confederation: 'CONMEBOL' },
  { name: 'Brazil',                 code: 'br', confederation: 'CONMEBOL' },
  { name: 'Colombia',               code: 'co', confederation: 'CONMEBOL' },
  { name: 'Ecuador',                code: 'ec', confederation: 'CONMEBOL' },
  { name: 'Paraguay',               code: 'py', confederation: 'CONMEBOL' },
  { name: 'Uruguay',                code: 'uy', confederation: 'CONMEBOL' },

  // ── UEFA (16) ────────────────────────────────────────────
  { name: 'Austria',                code: 'at',     confederation: 'UEFA' },
  { name: 'Belgium',                code: 'be',     confederation: 'UEFA' },
  { name: 'Bosnia and Herzegovina', code: 'ba',     confederation: 'UEFA' },
  { name: 'Croatia',                code: 'hr',     confederation: 'UEFA' },
  { name: 'Czech Republic',         code: 'cz',     confederation: 'UEFA' },
  { name: 'England',                code: 'gb-eng', confederation: 'UEFA' },
  { name: 'France',                 code: 'fr',     confederation: 'UEFA' },
  { name: 'Germany',                code: 'de',     confederation: 'UEFA' },
  { name: 'Netherlands',            code: 'nl',     confederation: 'UEFA' },
  { name: 'Norway',                 code: 'no',     confederation: 'UEFA' },
  { name: 'Portugal',               code: 'pt',     confederation: 'UEFA' },
  { name: 'Scotland',               code: 'gb-sct', confederation: 'UEFA' },
  { name: 'Spain',                  code: 'es',     confederation: 'UEFA' },
  { name: 'Sweden',                 code: 'se',     confederation: 'UEFA' },
  { name: 'Switzerland',            code: 'ch',     confederation: 'UEFA' },
  { name: 'Türkiye',                code: 'tr',     confederation: 'UEFA' },

  // ── CONCACAF (6) ────────────────────────────────────────
  { name: 'Canada',                 code: 'ca', confederation: 'CONCACAF' },
  { name: 'Curaçao',               code: 'cw', confederation: 'CONCACAF' },
  { name: 'Haiti',                  code: 'ht', confederation: 'CONCACAF' },
  { name: 'Mexico',                 code: 'mx', confederation: 'CONCACAF' },
  { name: 'Panama',                 code: 'pa', confederation: 'CONCACAF' },
  { name: 'United States',          code: 'us', confederation: 'CONCACAF' },

  // ── AFC (9) ──────────────────────────────────────────────
  { name: 'Australia',              code: 'au', confederation: 'AFC' },
  { name: 'Iran',                   code: 'ir', confederation: 'AFC' },
  { name: 'Iraq',                   code: 'iq', confederation: 'AFC' },
  { name: 'Japan',                  code: 'jp', confederation: 'AFC' },
  { name: 'Jordan',                 code: 'jo', confederation: 'AFC' },
  { name: 'Qatar',                  code: 'qa', confederation: 'AFC' },
  { name: 'Saudi Arabia',           code: 'sa', confederation: 'AFC' },
  { name: 'South Korea',            code: 'kr', confederation: 'AFC' },
  { name: 'Uzbekistan',             code: 'uz', confederation: 'AFC' },

  // ── CAF (10) ─────────────────────────────────────────────
  { name: 'Algeria',                code: 'dz', confederation: 'CAF' },
  { name: 'Cape Verde',             code: 'cv', confederation: 'CAF' },
  { name: 'DR Congo',               code: 'cd', confederation: 'CAF' },
  { name: 'Egypt',                  code: 'eg', confederation: 'CAF' },
  { name: 'Ghana',                  code: 'gh', confederation: 'CAF' },
  { name: 'Ivory Coast',            code: 'ci', confederation: 'CAF' },
  { name: 'Morocco',                code: 'ma', confederation: 'CAF' },
  { name: 'Senegal',                code: 'sn', confederation: 'CAF' },
  { name: 'South Africa',           code: 'za', confederation: 'CAF' },
  { name: 'Tunisia',                code: 'tn', confederation: 'CAF' },

  // ── OFC (1) ──────────────────────────────────────────────
  { name: 'New Zealand',            code: 'nz', confederation: 'OFC' },
];

// ---- Helpers ----------------------------------------------------------------

/** O(1) lookup map: lowercase country name → ISO flagcdn code */
const _codeMap = new Map<string, string>(
  FIFA_COUNTRIES.map(c => [c.name.toLowerCase(), c.code]),
);

/**
 * Returns the flagcdn.com ISO code for a team name, or '' if not found.
 * Matching is case-insensitive.
 */
export function getFlagCode(teamName: string): string {
  return _codeMap.get(teamName.toLowerCase()) ?? '';
}

/** Returns all WC2026 countries for a given confederation, sorted alphabetically */
export function getCountriesByConfederation(conf: Confederation): Country[] {
  return FIFA_COUNTRIES
    .filter(c => c.confederation === conf)
    .sort((a, b) => a.name.localeCompare(b.name));
}
