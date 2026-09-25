import { useState, useEffect } from 'react'
import { Calendar, ExternalLink, Edit3 } from 'lucide-react'
import { Card, Button, Badge, LoadingSpinner } from '../components/ui/Ui'
import { useAuth } from '../context/AuthContext'
import EditProfileModal from '../components/dashboard/EditProfileModal'
import api from '../services/api'

const platformMeta = {
  LeetCode:   { color: "#F89F1B", handleKey: "leetcode_handle"   },
  Codeforces: { color: "#3B82F6", handleKey: "codeforces_handle" },
  CodeChef:   { color: "#FCD34D", handleKey: "codechef_handle"   },
}

const relativeTime = (iso) => {
  if (!iso) return "—"
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7)  return `${days} days ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const Profile = () => {
  const { user, setUser } = useAuth()
  const [stats, setStats]         = useState(null)
  const [recent, setRecent]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [showEdit, setShowEdit]   = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, probRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/problems'),
        ])
        setStats(statsRes.data)
        setRecent(probRes.data.problems.slice(0, 5))
      } catch (err) {
        console.error("Failed to load profile:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveProfile = async (form) => {
    try {
      const res = await api.patch('/auth/me', form)
      setUser(res.data.user)
      setShowEdit(false)
    } catch (err) {
      console.error("Failed to save profile:", err)
    }
  }

  if (loading || !stats) return <LoadingSpinner message="Loading profile..." />

  const platforms = Object.entries(platformMeta)
    .filter(([, m]) => user?.[m.handleKey])
    .map(([name, m]) => {
      const stat = stats.platform_stats?.find(ps => ps.platform === name)
      return {
        name,
        handle: "@" + user[m.handleKey],
        rating: stat?.rating || "—",
        rank:   stat?.rank   || "Unrated",
        color:  m.color,
      }
    })

  const dsaScore = Math.min(Math.round(
    (stats.total_solved / 5) * 0.4 +
    stats.accuracy * 0.3 +
    (Math.min(stats.current_streak, 30) / 30) * 100 * 0.2 +
    (stats.hard_solved / Math.max(stats.total_solved, 1)) * 100 * 0.1
  ), 100)

  const scoreLabel  = dsaScore >= 80 ? "Excellent" : dsaScore >= 60 ? "Good" : dsaScore >= 40 ? "Fair" : "Keep going!"
  const lcStat      = stats.platform_stats?.find(ps => ps.platform === "LeetCode")
  const globalRank  = lcStat?.global_rank

  const miniStats = [
    { label: "Problems", value: stats.total_solved ?? 0 },
    { label: "Streak",   value: `${stats.current_streak ?? 0}d` },
    { label: "Score",    value: `${dsaScore}/100` },
    { label: "Rank",     value: globalRank ? `#${(globalRank / 1000).toFixed(1)}K` : "—" },
  ]

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Profile</h1>
          <p className="text-text-muted text-sm mt-0.5">Your coding identity and platform accounts</p>
        </div>
        <Button onClick={() => setShowEdit(true)} variant="secondary" size="sm" className="flex items-center gap-2">
          <Edit3 size={14} /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="h-20 bg-linear-to-br from-accent-purple to-accent-blue" />
            <div className="px-5 pb-5">
              <div className="w-18 h-18 rounded-full bg-accent-purple border-4 border-bg-card flex items-center justify-center text-white text-2xl font-bold -mt-8 mb-3">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-text-primary text-lg font-bold">{user?.username}</h2>
              <p className="text-text-muted text-xs mt-0.5">@{user?.username}</p>
              <p className="text-text-secondary text-xs mt-2 leading-relaxed">
                {user?.bio || "No bio yet — add one from Edit Profile."}
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-text-faint text-xs">
                <Calendar size={12} />
                <span>Joined {joined}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border-subtle">
                {miniStats.map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-text-primary text-sm font-bold">{s.value}</p>
                    <p className="text-text-faint text-[10px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-text-primary text-sm font-semibold mb-3">Platform Accounts</h3>
            {platforms.length === 0 ? (
              <p className="text-text-faint text-xs">No platforms connected. Add handles in Settings.</p>
            ) : (
              <div className="space-y-3">
                {platforms.map(p => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary text-xs font-semibold">{p.name}</span>
                        <span className="text-text-faint text-[10px]">{p.handle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: p.color }}>{p.rating}</span>
                      <Badge color="muted" variant="outlined" className="text-[9px] px-1.5 py-0">{p.rank}</Badge>
                      <ExternalLink size={11} className="text-text-faint cursor-pointer hover:text-text-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="col-span-2 space-y-4">
          <Card className="p-5 bg-linear-to-br from-accent-purple to-accent-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs">Overall DSA Score</p>
                <p className="text-white text-4xl font-extrabold mt-1">
                  {dsaScore}<span className="text-white/60 text-lg font-normal">/100</span>
                </p>
                <p className="text-white/90 text-sm font-medium mt-1">{scoreLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Global Rank</p>
                <p className="text-white text-2xl font-bold mt-1">
                  {globalRank ? `#${globalRank.toLocaleString()}` : "—"}
                </p>
                <p className="text-white/60 text-xs mt-1">LeetCode</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${dsaScore}%` }} />
            </div>
          </Card>

          {platforms.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {platforms.map(p => (
                <Card key={p.name} className="p-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card" style={{ backgroundColor: p.color }} />
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
          )}

          <Card className="p-4">
            <h3 className="text-text-primary text-sm font-semibold mb-3">Recent Activity</h3>
            {recent.length === 0 ? (
              <p className="text-text-faint text-xs">No activity yet — add or sync some problems.</p>
            ) : (
              <div className="space-y-2">
                {recent.map(p => (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: platformMeta[p.platform]?.color || "#6B7280" }} />
                    <p className="text-text-secondary text-xs flex-1 truncate">
                      <span className="text-text-muted">{p.status}</span> {p.title}
                    </p>
                    <span className="text-text-faint text-[10px] shrink-0">{relativeTime(p.solved_at || p.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <EditProfileModal isOpen={showEdit} onClose={() => setShowEdit(false)} profile={user} onSave={saveProfile} />
    </div>
  )
}

export default Profile
