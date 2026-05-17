// ============================================================
// CountriesPage — browse all 211 FIFA member nations with flags
// Filterable by confederation and name search
// ============================================================

import { useState } from 'react';
import { FIFA_COUNTRIES, type Confederation, type Country } from '../../data/countries';
import { FlagImg } from '../UI/FlagImg';
import { CountryDetailModal } from './CountryDetailModal';
import './CountriesPage.css';

const CONFEDERATIONS: { value: Confederation | 'ALL'; label: string }[] = [
  { value: 'ALL',       label: 'All' },
  { value: 'UEFA',      label: 'UEFA — Europe' },
  { value: 'CONMEBOL', label: 'CONMEBOL — South America' },
  { value: 'CONCACAF', label: 'CONCACAF — N/C America & Caribbean' },
  { value: 'AFC',       label: 'AFC — Asia' },
  { value: 'CAF',       label: 'CAF — Africa' },
  { value: 'OFC',       label: 'OFC — Oceania' },
];

interface CountriesPageProps {
  onBack: () => void;
}

export function CountriesPage({ onBack }: CountriesPageProps) {
  const [search, setSearch] = useState('');
  const [conf, setConf] = useState<Confederation | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Country | null>(null);

  const filtered = FIFA_COUNTRIES
    .filter(c => conf === 'ALL' || c.confederation === conf)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="countries-page">
      <div className="countries-page__header">
        <button className="countries-page__back" onClick={onBack}>← Back</button>
        <h2 className="countries-page__title">🏆 WC 2026 — 48 Nations</h2>
        <span className="countries-page__count">{filtered.length} / {FIFA_COUNTRIES.length}</span>
      </div>

      {/* Filters */}
      <div className="countries-page__filters">
        <input
          className="countries-page__search"
          type="text"
          placeholder="Search country…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="countries-page__select"
          value={conf}
          onChange={e => setConf(e.target.value as Confederation | 'ALL')}
        >
          {CONFEDERATIONS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="countries-page__grid">
        {filtered.map(country => (
          <button
            key={country.name}
            className="country-card"
            onClick={() => setSelected(country)}
            title={`View ${country.name} profile`}
          >
            <FlagImg teamName={country.name} size="md" />
            <span className="country-card__name">{country.name}</span>
            <span className="country-card__conf">{country.confederation}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="countries-page__empty">No countries match your search.</p>
        )}
      </div>

      {/* Country detail popup */}
      {selected && (
        <CountryDetailModal country={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
