import { useState } from 'react'
import { MapPin, Calendar, ExternalLink, Edit3 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { profileData as defaultProfileData, overallStats } from '../data/mockData'
import EditProfileModal from '../components/dashboard/EditProfileModal'
import { useAuth } from '../context/AuthContext'

const PROFILE_STORAGE_KEY = "dsa_tracker_profile_data";

function Profile() {
  const { user, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      ...defaultProfileData,
      name: user?.name || defaultProfileData.name,
      avatarInitial: user?.avatarInitial || defaultProfileData.avatarInitial,
      bio: user?.bio || defaultProfileData.bio,
    };
  });

  const handleSaveProfile = (newData) => {
    const updated = {
      ...profile,
      name: newData.name || profile.name,
      username: newData.username || profile.username,
      bio: newData.bio || profile.bio,
      avatarInitial: (newData.name ? newData.name.charAt(0) : profile.avatarInitial).toUpperCase(),
      platforms: profile.platforms.map((p) => {
        if (p.platform === "LeetCode" && newData.leetcode_handle) return { ...p, handle: newData.leetcode_handle };
        if (p.platform === "Codeforces" && newData.codeforces_handle) return { ...p, handle: newData.codeforces_handle };
        if (p.platform === "CodeChef" && newData.codechef_handle) return { ...p, handle: newData.codechef_handle };
        return p;
      })
    };
    setProfile(updated);
    updateUser({
      name: updated.name,
      bio: updated.bio,
      avatarInitial: updated.avatarInitial,
    });
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Profile</h1>
          <p className="text-text-muted text-sm mt-0.5">Your coding identity and platform accounts</p>
        </div>
        <Button onClick={() => setShowEditModal(true)} variant="secondary" size="sm" className="flex items-center gap-2">
          <Edit3 size={14} /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Profile card */}
          <Card className="overflow-hidden">
            {/* Banner */}
            <div className="h-20 bg-linear-to-br from-accent-purple to-accent-blue" />

            {/* Avatar */}
            <div className="px-5 pb-5">
              <div className="w-18 h-18 rounded-full bg-accent-purple border-4 border-bg-card flex items-center justify-center text-white text-2xl font-bold -mt-8 mb-3">
                {profile.avatarInitial}
              </div>

              <h2 className="text-text-primary text-lg font-bold">{profile.name}</h2>
              <p className="text-text-muted text-xs mt-0.5">{profile.username}</p>
              <p className="text-text-secondary text-xs mt-2 leading-relaxed">{profile.bio}</p>

              <div className="flex items-center gap-1.5 mt-3 text-text-faint text-xs">
                <Calendar size={12} />
                <span>Joined {profile.joinedDate}</span>
              </div>

              {/* Stat mini row */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border-subtle">
                {profile.stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-text-primary text-sm font-bold">{s.value}</p>
                    <p className="text-text-faint text-[10px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Platform accounts */}
          <Card className="p-4">
            <h3 className="text-text-primary text-sm font-semibold mb-3">Platform Accounts</h3>
            <div className="space-y-3">
              {profile.platforms.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary text-xs font-semibold">{p.name}</span>
                      <span className="text-text-faint text-[10px]">{p.handle}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: p.color }}>{p.rating}</span>
                    <Badge color="muted" variant="outlined" className="text-[9px] px-1.5 py-0">
                      {p.rank}
                    </Badge>
                    <ExternalLink size={11} className="text-text-faint cursor-pointer hover:text-text-secondary" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column — spans 2 */}
        <div className="col-span-2 space-y-4">
          {/* Overall score banner */}
          <Card className="p-5 bg-linear-to-br from-accent-purple to-accent-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs">Overall DSA Score</p>
                <p className="text-white text-4xl font-extrabold mt-1">
                  {overallStats.dsaScore}
                  <span className="text-white/60 text-lg font-normal">/100</span>
                </p>
                <p className="text-white/90 text-sm font-medium mt-1">{overallStats.scoreLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Global Rank</p>
                <p className="text-white text-2xl font-bold mt-1">#{overallStats.globalRank.toLocaleString()}</p>
                <p className="text-white/60 text-xs mt-1">Top 8% worldwide</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${overallStats.dsaScore}%` }}
              />
            </div>
          </Card>

          {/* Per-platform rating cards */}
          <div className="grid grid-cols-2 gap-3">
            {profile.platforms.map((p) => (
              <Card key={p.name} className="p-4 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
                  style={{ backgroundColor: p.color }}
                />
                <div className="ml-3">
                  <div className="flex items-center justify-between">
                    <p className="text-text-muted text-xs">{p.name}</p>
                    <Badge color="muted" variant="outlined" className="text-[9px]">{p.rank}</Badge>
                  </div>
                  <p className="text-2xl font-extrabold mt-1" style={{ color: p.color }}>{p.rating}</p>
                  <p className="text-text-faint text-[10px] mt-1">{p.handle}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent activity */}
          <Card className="p-4">
            <h3 className="text-text-primary text-sm font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { text: "Solved Trapping Rain Water", platform: "LeetCode", time: "2 hours ago", color: "#F89F1B" },
                { text: "Attempted Course Schedule", platform: "LeetCode", time: "Yesterday", color: "#F89F1B" },
                { text: "Participated in Round 986", platform: "Codeforces", time: "3 days ago", color: "#3B82F6" },
                { text: "Solved Maximum Subarray", platform: "LeetCode", time: "4 days ago", color: "#F89F1B" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activity.color }} />
                  <p className="text-text-secondary text-xs flex-1">{activity.text}</p>
                  <span className="text-text-faint text-[10px] shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  )
}

export default Profile