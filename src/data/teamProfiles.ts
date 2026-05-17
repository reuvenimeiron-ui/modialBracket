// ============================================================
// WC 2026 Team Profiles
// powerRank        — tournament power ranking (1 = strongest)
// fifaRank         — official FIFA ranking as of January 2026
// offensiveRating  — attacking quality score out of 10
// defensiveRating  — defensive solidity score out of 10
// bio              — original one-sentence team summary
// ============================================================

export interface TeamProfile {
  powerRank: number;
  fifaRank: number;
  offensiveRating: number;
  defensiveRating: number;
  bio: string;
  /** Optional WC roster — 23 player names. Falls back to placeholders if absent. */
  roster?: string[];
}

/** Returns the team's WC squad, or 23 placeholder names if not yet populated. */
export function getTeamRoster(teamName: string): string[] {
  const profile = TEAM_PROFILES[teamName];
  if (profile?.roster && profile.roster.length > 0) return profile.roster;
  return Array.from({ length: 23 }, (_, i) => `Player ${i + 1}`);
}

export const TEAM_PROFILES: Record<string, TeamProfile> = {

  // ── CONMEBOL ──────────────────────────────────────────────
  'Argentina': {
    powerRank: 2,
    fifaRank: 2,
    offensiveRating: 9.5,
    defensiveRating: 8.5,
    bio: 'Back-to-back Copa América winners and reigning World Cup champions, with Lionel Messi leading a deep squad built for one last title run.',
  },
  'Brazil': {
    powerRank: 5,
    fifaRank: 5,
    offensiveRating: 9.0,
    defensiveRating: 7.5,
    bio: 'A new era under Carlo Ancelotti sees Vinícius Jr. and Rodrygo spearhead a Seleção hungry to end their 24-year wait for a sixth World Cup crown.',
  },
  'Colombia': {
    powerRank: 10,
    fifaRank: 13,
    offensiveRating: 8.5,
    defensiveRating: 7.0,
    bio: "Copa América 2025 finalists and CONMEBOL's most dangerous dark horse, driven by Luis Díaz and James Rodríguez at the peak of their powers.",
  },
  'Ecuador': {
    powerRank: 17,
    fifaRank: 23,
    offensiveRating: 6.5,
    defensiveRating: 8.5,
    bio: 'The most defensively miserly side in CONMEBOL qualification, with Moisés Caicedo and Piero Hincapié forming an elite midfield-to-defence axis.',
  },
  'Paraguay': {
    powerRank: 32,
    fifaRank: 39,
    offensiveRating: 6.0,
    defensiveRating: 7.0,
    bio: "Gritty survivors of the CONMEBOL marathon, powered by Miguel Almirón's Premier League quality and a collective hard-to-break defensive shape.",
  },
  'Uruguay': {
    powerRank: 12,
    fifaRank: 16,
    offensiveRating: 7.5,
    defensiveRating: 8.5,
    bio: "Marcelo Bielsa's high-energy pressing side notched landmark wins over both Brazil and Argentina during qualification, proving South America's deepest threat.",
  },

  // ── UEFA ──────────────────────────────────────────────────
  'Austria': {
    powerRank: 22,
    fifaRank: 24,
    offensiveRating: 7.0,
    defensiveRating: 6.5,
    bio: 'Consistent European qualifiers with a physically imposing squad drawn heavily from RB Leipzig and Bundesliga clubs, aiming to reach the knockout rounds for the first time.',
  },
  'Belgium': {
    powerRank: 13,
    fifaRank: 8,
    offensiveRating: 8.5,
    defensiveRating: 7.0,
    bio: "Kevin De Bruyne's probable farewell tournament; a Golden Generation in its final chapter, buoyed by Jeremy Doku's explosive emergence on the wing.",
  },
  'Bosnia and Herzegovina': {
    powerRank: 39,
    fifaRank: 57,
    offensiveRating: 6.0,
    defensiveRating: 5.5,
    bio: 'Qualification debutants on the expanded 48-team stage, featuring technically gifted forwards who compete across Europe\'s top five leagues.',
  },
  'Croatia': {
    powerRank: 11,
    fifaRank: 10,
    offensiveRating: 7.5,
    defensiveRating: 8.5,
    bio: "Luka Modrić's likely final World Cup as captain, backed by Joško Gvardiol's world-class defensive quality and a squad that has reached three semi-finals in a decade.",
  },
  'Czech Republic': {
    powerRank: 38,
    fifaRank: 39,
    offensiveRating: 6.5,
    defensiveRating: 6.0,
    bio: 'Patrik Schick provides a clinical finishing threat, and the Czechs are capable of a tournament shock against any opponent on their day.',
  },
  'England': {
    powerRank: 3,
    fifaRank: 4,
    offensiveRating: 9.0,
    defensiveRating: 9.0,
    bio: 'Qualified without conceding a single goal under Thomas Tuchel, with Jude Bellingham and Harry Kane forming a world-class spine that must finally convert in a major final.',
  },
  'France': {
    powerRank: 4,
    fifaRank: 3,
    offensiveRating: 9.5,
    defensiveRating: 8.0,
    bio: "The 2018 champions return with Kylian Mbappé's electrifying pace and Didier Deschamps' battle-hardened tournament experience, hunting a third World Cup title.",
  },
  'Germany': {
    powerRank: 8,
    fifaRank: 9,
    offensiveRating: 9.0,
    defensiveRating: 8.0,
    bio: 'Julian Nagelsmann has reignited German football, with Jamal Musiala and Florian Wirtz combining to form one of the most exciting attacking partnerships at the tournament.',
  },
  'Netherlands': {
    powerRank: 6,
    fifaRank: 7,
    offensiveRating: 8.5,
    defensiveRating: 8.5,
    bio: "Unbeaten through qualification with Virgil van Dijk anchoring the defence and Xavi Simons providing creative spark — the Oranje are genuine contenders once more.",
  },
  'Norway': {
    powerRank: 15,
    fifaRank: 29,
    offensiveRating: 8.5,
    defensiveRating: 6.5,
    bio: "Erling Haaland's 55 international goals powered a perfect qualifying campaign, ending Norway's 28-year World Cup absence and making them a must-watch dark horse.",
  },
  'Portugal': {
    powerRank: 7,
    fifaRank: 6,
    offensiveRating: 9.0,
    defensiveRating: 7.5,
    bio: 'Nations League 2025 winners loaded with elite midfield talent in Bruno Fernandes and Bernardo Silva, with the squad depth to go deep regardless of Cristiano Ronaldo\'s role.',
  },
  'Scotland': {
    powerRank: 36,
    fifaRank: 36,
    offensiveRating: 6.0,
    defensiveRating: 6.5,
    bio: "The Tartan Army returns to the World Cup for the first time since 1998, rallying around Scott McTominay's commanding midfield presence and remarkable qualifier form.",
  },
  'Spain': {
    powerRank: 1,
    fifaRank: 1,
    offensiveRating: 9.5,
    defensiveRating: 9.0,
    bio: "FIFA's #1 ranked team and Euro 2024 champions, with Lamine Yamal at 18 already redefining the game — the clear favourite to lift the trophy in 2026.",
  },
  'Sweden': {
    powerRank: 37,
    fifaRank: 28,
    offensiveRating: 6.0,
    defensiveRating: 6.5,
    bio: 'Tall, physical, and meticulously organised, the Blåvitt mix Bundesliga and La Liga experience with a direct style that can trouble any defence.',
  },
  'Switzerland': {
    powerRank: 23,
    fifaRank: 17,
    offensiveRating: 7.0,
    defensiveRating: 8.0,
    bio: 'Quarter-finalists in each of the last two major tournaments, the Swiss remain the model of European efficiency and tactical discipline under Murat Yakin.',
  },
  'Türkiye': {
    powerRank: 31,
    fifaRank: 37,
    offensiveRating: 7.0,
    defensiveRating: 6.0,
    bio: 'A technically refined squad packed with Bundesliga talent, qualifying through the expanded UEFA allocation and capable of a genuine shock run.',
  },

  // ── CONCACAF ──────────────────────────────────────────────
  'Canada': {
    powerRank: 24,
    fifaRank: 27,
    offensiveRating: 7.0,
    defensiveRating: 6.5,
    bio: "Host nation making their first World Cup appearance since 1986, built around Bayern Munich star Alphonso Davies and a generation of players finally ready for the main stage.",
  },
  'Curaçao': {
    powerRank: 48,
    fifaRank: 82,
    offensiveRating: 4.0,
    defensiveRating: 4.0,
    bio: 'The Dutch Caribbean island nation pulled off a historic run of upsets to reach their first-ever World Cup, making them one of the tournament\'s most extraordinary stories.',
  },
  'Haiti': {
    powerRank: 47,
    fifaRank: 84,
    offensiveRating: 4.5,
    defensiveRating: 4.5,
    bio: 'A remarkable CONCACAF qualifying campaign from the Caribbean side who punch well above their FIFA ranking through fierce collective commitment.',
  },
  'Mexico': {
    powerRank: 19,
    fifaRank: 15,
    offensiveRating: 7.0,
    defensiveRating: 6.5,
    bio: "Joint host nation and seven-time consecutive round-of-16 finisher, pinning their hopes on home advantage and a new generation of forwards to break their quarter-final curse.",
  },
  'Panama': {
    powerRank: 33,
    fifaRank: 30,
    offensiveRating: 5.5,
    defensiveRating: 7.5,
    bio: "The Canaleros combine physical resilience with disciplined organisation, returning to the World Cup after their impressive 2018 debut with a squad now rich in top-league experience.",
  },
  'United States': {
    powerRank: 16,
    fifaRank: 14,
    offensiveRating: 7.5,
    defensiveRating: 7.0,
    bio: "Host nation with the most home-crowd advantage, where Mauricio Pochettino has built genuine tactical structure around a young, rapid squad that has already beaten Uruguay 5-1.",
  },

  // ── AFC ───────────────────────────────────────────────────
  'Australia': {
    powerRank: 21,
    fifaRank: 26,
    offensiveRating: 7.0,
    defensiveRating: 6.5,
    bio: "Premier League talent throughout the lineup makes the Socceroos one of Asia's most complete sides, aiming to repeat their stunning 2022 run to the round of 16.",
  },
  'Iran': {
    powerRank: 30,
    fifaRank: 20,
    offensiveRating: 5.5,
    defensiveRating: 8.0,
    bio: 'One of Asia\'s most physical and disciplined outfits, the Iranians make their third consecutive World Cup appearance with a hard-to-break defensive system.',
  },
  'Iraq': {
    powerRank: 40,
    fifaRank: 56,
    offensiveRating: 5.5,
    defensiveRating: 5.0,
    bio: "Qualified via the intercontinental playoff, marking a significant milestone for Iraqi football's growing technical base under their driven young squad.",
  },
  'Japan': {
    powerRank: 14,
    fifaRank: 18,
    offensiveRating: 7.5,
    defensiveRating: 7.5,
    bio: 'Topped their qualifying group with 30 goals unbeaten, making their eighth consecutive World Cup with a well-drilled, tactically versatile squad pushing for a first-ever quarter-final.',
  },
  'Jordan': {
    powerRank: 41,
    fifaRank: 64,
    offensiveRating: 5.0,
    defensiveRating: 5.5,
    bio: "First-ever World Cup qualification is a landmark for Jordanian football, secured through a brilliant AFC run that shocked the continent and captured the world's imagination.",
  },
  'Qatar': {
    powerRank: 43,
    fifaRank: 54,
    offensiveRating: 5.0,
    defensiveRating: 5.5,
    bio: 'The 2022 hosts return as a participating nation rather than an automatic qualifier, having invested heavily in their domestic football infrastructure and squad depth.',
  },
  'Saudi Arabia': {
    powerRank: 34,
    fifaRank: 60,
    offensiveRating: 6.0,
    defensiveRating: 6.5,
    bio: 'Buoyed by a star-studded domestic league and the extraordinary memory of their 2022 group-stage victory over Argentina, the Green Falcons arrive with renewed ambition.',
  },
  'South Korea': {
    powerRank: 20,
    fifaRank: 22,
    offensiveRating: 7.5,
    defensiveRating: 7.0,
    bio: "Son Heung-min leads a technically refined collective for what may be his final World Cup, as the squad aims to rekindle the spirit of their legendary 2002 home run.",
  },
  'Uzbekistan': {
    powerRank: 44,
    fifaRank: 50,
    offensiveRating: 5.0,
    defensiveRating: 5.0,
    bio: 'A historic debut for the Silk Road nation after topping their AFC qualification group, making Uzbekistan one of the most intriguing first-time participants at any World Cup.',
  },

  // ── CAF ───────────────────────────────────────────────────
  'Algeria': {
    powerRank: 25,
    fifaRank: 34,
    offensiveRating: 7.0,
    defensiveRating: 6.5,
    bio: "The Desert Foxes return to the World Cup stage with a resurgent squad featuring Riyad Mahrez's veteran flair and an unbeaten qualification campaign.",
  },
  'Cape Verde': {
    powerRank: 45,
    fifaRank: 67,
    offensiveRating: 5.0,
    defensiveRating: 5.0,
    bio: 'The island nation of half a million people makes their first-ever World Cup appearance after a dramatic playoff win — football\'s ultimate Cinderella story.',
  },
  'DR Congo': {
    powerRank: 46,
    fifaRank: 65,
    offensiveRating: 5.0,
    defensiveRating: 5.0,
    bio: 'The Leopards arrived via the intercontinental playoff with a squad of French-league veterans ready to announce themselves on the global stage.',
  },
  'Egypt': {
    powerRank: 26,
    fifaRank: 35,
    offensiveRating: 7.0,
    defensiveRating: 7.5,
    bio: "Mohamed Salah's historic scoring form and the Pharaohs' resolute defensive organisation make them Africa's most dangerous counter-attacking threat.",
  },
  'Ghana': {
    powerRank: 27,
    fifaRank: 72,
    offensiveRating: 6.5,
    defensiveRating: 6.0,
    bio: 'The Black Stars blend experience from England, Germany, and Turkey with emerging domestic talent, bringing the unpredictability that makes them a constant threat.',
  },
  'Ivory Coast': {
    powerRank: 28,
    fifaRank: 44,
    offensiveRating: 7.0,
    defensiveRating: 6.5,
    bio: 'Reigning Africa Cup of Nations champions with a squad of top-European-league players led by their commanding defensive core and creative midfield.',
  },
  'Morocco': {
    powerRank: 9,
    fifaRank: 11,
    offensiveRating: 7.5,
    defensiveRating: 9.0,
    bio: "Africa's 2022 semi-finalists return with a 100% qualifying record and Achraf Hakimi's world-class wing-play driving Walid Regragui's expertly organised side.",
  },
  'Senegal': {
    powerRank: 18,
    fifaRank: 19,
    offensiveRating: 7.5,
    defensiveRating: 7.0,
    bio: 'Undefeated throughout African qualification with an exceptional goal difference, as Nicolas Jackson and Ismaïla Sarr lead a dynamic post-Mané generation.',
  },
  'South Africa': {
    powerRank: 29,
    fifaRank: 61,
    offensiveRating: 6.0,
    defensiveRating: 6.5,
    bio: "Bafana Bafana's first World Cup in 18 years, returning with Percy Tau's creative edge and a collective hunger that carried them through a tough CAF group.",
  },
  'Tunisia': {
    powerRank: 35,
    fifaRank: 41,
    offensiveRating: 5.5,
    defensiveRating: 7.5,
    bio: 'Compact, well-organised, and experienced on the World Cup stage, the Eagles of Carthage traditionally make themselves extremely difficult to break down.',
  },

  // ── OFC ───────────────────────────────────────────────────
  'New Zealand': {
    powerRank: 42,
    fifaRank: 87,
    offensiveRating: 4.5,
    defensiveRating: 5.5,
    bio: "Oceania's sole representative arrives with the spirit of their famous 2010 unbeaten group stage run, a committed squad, and the island-nation pride of an entire confederation.",
  },
};

/** Returns the profile for a team, or null if not found. */
export function getTeamProfile(teamName: string): TeamProfile | null {
  return TEAM_PROFILES[teamName] ?? null;
}
