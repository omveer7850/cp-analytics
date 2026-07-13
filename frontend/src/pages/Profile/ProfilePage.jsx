import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from 'react-icons/si';
import PlatformConnect from '../../components/PlatformConnect';
import { getUserDoc, updateProfile } from '../../services/supabaseService';
import { fetchLeetCodeProfile, fetchLeetCodeSolved } from '../../services/leetcode';
import { fetchCFUser } from '../../services/codeforces';
import { fetchGithubProfile } from '../../services/github';
import { fetchAllCodechefData } from '../../services/codechef';
import { fetchAtCoderProfile } from '../../services/atcoder';
import './ProfilePage.css';

const AtCoderIcon = () => (
  <svg viewBox="0 0 100 100" width="16" height="16" fill="currentColor">
    <path d="M50 0L0 100h100L50 0z" />
    <path d="M50 20l35 65H15l35-65z" fill="white" />
  </svg>
);

async function fetchLeetCodeCombined(username) {
  const [profile, solved] = await Promise.all([
    fetchLeetCodeProfile(username),
    fetchLeetCodeSolved(username),
  ]);
  return { ...profile, ...solved };
}

const PLATFORMS = [
  { key: 'leetcode', label: 'LeetCode', fetchProfile: fetchLeetCodeCombined, color: '#ffa116', icon: <SiLeetcode /> },
  { key: 'codeforces', label: 'Codeforces', fetchProfile: fetchCFUser, color: '#1f8acb', icon: <SiCodeforces /> },
  { key: 'github', label: 'GitHub', fetchProfile: fetchGithubProfile, color: '#8b5cf6', icon: <SiGithub /> },
  { key: 'codechef', label: 'CodeChef', fetchProfile: fetchAllCodechefData, color: '#8b5e3c', icon: <SiCodechef /> },
  { key: 'atcoder', label: 'AtCoder', fetchProfile: fetchAtCoderProfile, color: '#222222', icon: <AtCoderIcon /> },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileDoc, setProfileDoc] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ university: '', linkedin: '', bio: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserDoc(user.id).then((doc) => {
      setProfileDoc(doc);
      setForm({
        university: doc?.university || '',
        linkedin: doc?.linkedin || '',
        bio: doc?.bio || '',
      });
    });
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const startEditing = () => setEditing(true);
  const cancelEditing = () => {
    setForm({
      university: profileDoc?.university || '',
      linkedin: profileDoc?.linkedin || '',
      bio: profileDoc?.bio || '',
    });
    setEditing(false);
  };

  const saveEditing = async () => {
    setSaving(true);
    try {
      await updateProfile(user.id, form);
      setProfileDoc((prev) => ({ ...prev, ...form }));
      setEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Anonymous User';
  const username = user.user_metadata?.user_name || user.email?.split('@')[0] || 'user';

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button type="button" className="profile-header__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-frame">
        { }
        <div className="profile-frame__left">
          <div className="profile-id-banner" />

          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="profile-id-avatar" />
          ) : (
            <div className="profile-id-avatar profile-id-avatar--fallback">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="profile-id-name">{fullName}</h1>
          <p className="profile-id-username">@{username}</p>

          {!editing && (
            <button type="button" className="profile-edit-btn profile-edit-btn--centered" onClick={startEditing}>
              Edit Profile
            </button>
          )}

          <div className="profile-id-fields">
            {editing ? (
              <>
                <div className="profile-field">
                  <label className="profile-field__label">🎓 University</label>
                  <input
                    className="profile-field__input"
                    value={form.university}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    placeholder="e.g. IIT Delhi"
                  />
                </div>
                <div className="profile-field">
                  <label className="profile-field__label">in LinkedIn</label>
                  <input
                    className="profile-field__input"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div className="profile-field">
                  <label className="profile-field__label">Bio</label>
                  <textarea
                    className="profile-field__textarea"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="A short line about yourself"
                    rows={3}
                  />
                </div>

                <div className="profile-edit-actions">
                  <button type="button" className="profile-btn profile-btn--ghost" onClick={cancelEditing} disabled={saving}>
                    Cancel
                  </button>
                  <button type="button" className="profile-btn" onClick={saveEditing} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <InfoRow icon="🎓" label="University" value={profileDoc?.university} />
                <InfoRow
                  icon={<span className="profile-info-row__in">in</span>}
                  label="LinkedIn"
                  value={profileDoc?.linkedin}
                  link={profileDoc?.linkedin ? normalizeUrl(profileDoc.linkedin) : null}
                />
                <div className="profile-bio">
                  {profileDoc?.bio || <span className="profile-bio--empty">No bio added yet.</span>}
                </div>
              </>
            )}
          </div>
        </div>

        {}
        <div className="profile-frame__right">
          <h2 className="profile-section__title">Platform Connections</h2>
          <div className="profile-platform-rows">
            {PLATFORMS.map((p) => (
              <div key={p.key} className="profile-platform-row" style={{ '--platform-color': p.color }}>
                <span className="profile-platform-row__icon" style={{ background: `${p.color}22`, color: p.color }}>
                  {p.icon}
                </span>
                <span className="profile-platform-row__name">{p.label}</span>
                <div className="profile-platform-row__connect">
                  <PlatformConnect
                    platform={p.key}
                    label={p.label}
                    fetchProfile={p.fetchProfile}
                    onData={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeUrl(value) {
  if (!value) return null;
  return value.startsWith('http') ? value : `https://${value}`;
}

function InfoRow({ icon, label, value, link }) {
  return (
    <div className="profile-info-row">
      <span className="profile-info-row__label">
        <span className="profile-info-row__icon">{icon}</span>
        {label}
      </span>
      {value ? (
        link ? (
          <a href={link} target="_blank" rel="noreferrer" className="profile-info-row__value profile-info-row__value--link">
            {value}
          </a>
        ) : (
          <span className="profile-info-row__value">{value}</span>
        )
      ) : (
        <span className="profile-info-row__empty">Not set</span>
      )}
    </div>
  );
}