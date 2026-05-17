// ============================================================
// CountryDetailModal — shows power ranking, FIFA rank, and bio
// for a WC 2026 team when clicked in the Countries page.
// ============================================================

import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { FlagImg } from '../UI/FlagImg';
import { getTeamProfile, getTeamRoster } from '../../data/teamProfiles';
import type { Country } from '../../data/countries';
import './CountryDetailModal.css';

interface CountryDetailModalProps {
  country: Country;
  onClose: () => void;
}

function rankColor(r: number) {
  if (r <= 3) return '#b45309';  // gold text
  if (r <= 10) return '#1d4ed8'; // strong blue
  if (r <= 20) return '#0369a1'; // medium blue
  return '#64748b';               // muted
}

function rankBadge(r: number) {
  if (r === 1) return '🥇';
  if (r === 2) return '🥈';
  if (r === 3) return '🥉';
  return null;
}

export function CountryDetailModal({ country, onClose }: CountryDetailModalProps) {
  const profile = getTeamProfile(country.name);
  const roster  = getTeamRoster(country.name);
  const [tab, setTab] = useState<'profile' | 'squad'>('profile');

  return (
    <Modal title="" onClose={onClose}>
      <div className="cdm">
        {/* Flag + name hero */}
        <div className="cdm__hero">
          <FlagImg teamName={country.name} size="lg" className="cdm__flag" />
          <div className="cdm__hero-text">
            <h2 className="cdm__name">{country.name}</h2>
            <span className="cdm__conf">{country.confederation}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="cdm__tabs">
          <button
            className={`cdm__tab ${tab === 'profile' ? 'cdm__tab--active' : ''}`}
            onClick={() => setTab('profile')}
          >
            📋 Profile
          </button>
          <button
            className={`cdm__tab ${tab === 'squad' ? 'cdm__tab--active' : ''}`}
            onClick={() => setTab('squad')}
          >
            👥 Squad
          </button>
        </div>

        {tab === 'profile' && (
          profile ? (
            <>
              {/* Rankings row */}
              <div className="cdm__ranks">
                <div className="cdm__rank-card">
                  <span className="cdm__rank-label">Power Rank</span>
                  <span
                    className="cdm__rank-value"
                    style={{ color: rankColor(profile.powerRank) }}
                  >
                    {rankBadge(profile.powerRank) && (
                      <span className="cdm__rank-badge">{rankBadge(profile.powerRank)}</span>
                    )}
                    #{profile.powerRank}
                    <span className="cdm__rank-of"> / 48</span>
                  </span>
                </div>

                <div className="cdm__rank-divider" />

                <div className="cdm__rank-card">
                  <span className="cdm__rank-label">FIFA Ranking</span>
                  <span
                    className="cdm__rank-value"
                    style={{ color: rankColor(profile.fifaRank) }}
                  >
                    #{profile.fifaRank}
                  </span>
                </div>
              </div>

              {/* Offensive / Defensive ratings */}
              <div className="cdm__ratings">
                <div className="cdm__rating-row">
                  <span className="cdm__rating-label">⚡ Offensive</span>
                  <div className="cdm__rating-bar-wrap">
                    <div
                      className="cdm__rating-bar cdm__rating-bar--attack"
                      style={{ width: `${profile.offensiveRating * 10}%` }}
                    />
                  </div>
                  <span className="cdm__rating-score">{profile.offensiveRating.toFixed(1)}</span>
                </div>
                <div className="cdm__rating-row">
                  <span className="cdm__rating-label">🛡️ Defensive</span>
                  <div className="cdm__rating-bar-wrap">
                    <div
                      className="cdm__rating-bar cdm__rating-bar--defense"
                      style={{ width: `${profile.defensiveRating * 10}%` }}
                    />
                  </div>
                  <span className="cdm__rating-score">{profile.defensiveRating.toFixed(1)}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="cdm__bio">{profile.bio}</p>
            </>
          ) : (
            <p className="cdm__no-data">No profile available for this team.</p>
          )
        )}

        {tab === 'squad' && (
          <div className="cdm__squad">
            <p className="cdm__squad-note">
              WC 2026 provisional squad — {roster.length} players
            </p>
            <div className="cdm__squad-grid">
              {roster.map((name, i) => (
                <div key={i} className="cdm__squad-player">
                  <span className="cdm__squad-num">{i + 1}</span>
                  <span className="cdm__squad-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
