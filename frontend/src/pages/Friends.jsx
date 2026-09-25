import { useState, useEffect, useCallback } from 'react'
import { Users, Trophy, Search, Activity, UserPlus, X, RefreshCw } from 'lucide-react'
import { Card, Button } from '../components/ui/Ui'

import FriendRow from '../components/friends/FriendRow'
import ActivityFeed from '../components/friends/ActivityFeed'
import { JamsPanel, Leaderboard } from '../components/friends/JamsLeaderboard'
import api from '../services/api'

const TABS   = ["All Friends", "Online", "In Contest", "Offline"]
const COLORS  = ["#7C3AED", "#EF4444", "#10B981", "#3B82F6", "#F59E0B", "#EC4899"]
const getColor = id => COLORS[id % COLORS.length]

// Add Friend Modal
const AddFriendModal = ({ onClose, onAdded }) => {
  const [handle, setHandle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const send = async () => {
    if (!handle.trim()) return
    setLoading(true)
    setError("")
    try {
      await api.post("/friends/request", { handle: handle.trim() })
      onAdded?.()
      onClose()
    } catch (e) {
      setError(e.response?.data?.error || "Failed to send request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 w-80 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary text-sm font-bold">Add Friend</h2>
          <button onClick={onClose} className="text-text-faint hover:text-text-secondary"><X size={16} /></button>
        </div>
        <input
          autoFocus
          value={handle}
          onChange={e => { setHandle(e.target.value); setError("") }}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Username, LeetCode or CF handle..."
          className="w-full bg-bg-input border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple/60 transition-colors"
        />
        {error && <p className="text-status-hard text-xs mt-2">{error}</p>}
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" size="sm" onClick={send} className="flex-1" disabled={loading}>
            {loading ? "Sending…" : "Send Request"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Pending requests banner
const PendingBanner = ({ requests, onAccept, onDismiss }) => {
  if (!requests.length) return null
  return (
    <div className="bg-accent-purple/10 border border-accent-purple/30 rounded-xl p-3 flex items-center justify-between gap-3">
      <p className="text-accent-purple text-xs font-semibold">
        🔔 {requests.length} pending friend request{requests.length > 1 ? "s" : ""}
      </p>
      <div className="flex gap-2">
        {requests.slice(0, 2).map(r => (
          <button
            key={r.friendship_id}
            onClick={() => onAccept(r.friendship_id)}
            className="text-xs font-semibold bg-accent-purple text-white px-2.5 py-1 rounded-lg hover:bg-accent-purple/80 transition-colors"
          >
            Accept {r.name}
          </button>
        ))}
        <button onClick={onDismiss} className="text-text-faint hover:text-text-secondary"><X size={14} /></button>
      </div>
    </div>
  )
}

const Friends = () => {
  const [tab, setTab]           = useState("All Friends")
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState("")
  const [showAdd, setShowAdd]   = useState(false)

  // API data
  const [friends,     setFriends]     = useState([])
  const [activity,    setActivity]    = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [stats,       setStats]       = useState(null)
  const [pending,     setPending]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [fRes, aRes, lRes, sRes, pRes] = await Promise.all([
        api.get("/friends"),
        api.get("/friends/activity"),
        api.get("/friends/leaderboard"),
        api.get("/friends/stats"),
        api.get("/friends/requests"),
      ])

      setFriends((fRes.data.friends || []).map((f, i) => ({ ...f, color: getColor(f.id || i) })))
      setActivity(aRes.data.activity || [])
      setLeaderboard(lRes.data.leaderboard || [])
      setStats(sRes.data)
      setPending(pRes.data.requests || [])
    } catch (e) {
      setError(e.response?.data?.error || "Failed to load friends data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Accept a pending friend request
  const acceptRequest = async (fid) => {
    try {
      await api.post(`/friends/accept/${fid}`)
      load()
    } catch (e) {
      console.error("Accept failed:", e)
    }
  }

  // Remove a friend
  const removeFriend = async (fid) => {
    try {
      await api.delete(`/friends/${fid}`)
      setSelected(null)
      load()
    } catch (e) {
      console.error("Remove failed:", e)
    }
  }

  // Derived counts
  const onlineCount  = friends.filter(f => f.status === "online" || f.status === "solving").length
  const contestCount = friends.filter(f => f.status === "contest").length
  const offlineCount = friends.filter(f => f.status === "away").length
  const avgSolved    = friends.length
    ? Math.round(friends.reduce((a, f) => a + (f.solved || 0), 0) / friends.length)
    : 0

  const summaryCards = [
    { label: "Active Now",    value: stats?.active_now   ?? onlineCount,  sub: "Solving or in contest",  color: "#10B981", icon: Users    },
    { label: "In Contest",    value: stats?.in_contest   ?? contestCount, sub: "Live right now",          color: "#EF4444", icon: Trophy   },
    { label: "Total Friends", value: stats?.total_friends ?? friends.length, sub: "Across all skill levels", color: "#7C3AED", icon: Users  },
    { label: "Avg Solved",    value: stats?.avg_solved   ?? avgSolved,    sub: "Friend group avg",         color: "#3B82F6", icon: Activity },
  ]

  const tabCount = { "Online": onlineCount, "In Contest": contestCount, "Offline": offlineCount }

  const q = search.toLowerCase()
  const filtered = friends.filter(f => {
    const match = f.name.toLowerCase().includes(q) || (f.handle || "").toLowerCase().includes(q)
    if (tab === "Online")     return match && (f.status === "online" || f.status === "solving")
    if (tab === "In Contest") return match && f.status === "contest"
    if (tab === "Offline")    return match && f.status === "away"
    return match
  })

  // Leaderboard split: me vs others
  const meEntry   = leaderboard.find(e => e.is_me)
  const lbEntries = leaderboard
    .filter(e => !e.is_me)
    .map((e, i) => ({
      rank:   e.rank ?? i + 1,
      name:   e.name,
      avatar: e.avatar,
      color:  getColor(e.user_id ?? i),
      score:  e.score,
    }))

  const lbMe = meEntry
    ? { name: meEntry.name, avatar: meEntry.avatar, color: "#7C3AED", score: meEntry.score }
    : null

  return (
    <div className="space-y-4">
      {showAdd && <AddFriendModal onClose={() => setShowAdd(false)} onAdded={load} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold flex items-center gap-2">
            <Users size={22} /> Friends
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Learn together. Grow together.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button onClick={load} className="text-text-faint hover:text-text-secondary transition-colors p-1.5 rounded-lg hover:bg-bg-input" title="Refresh">
            <RefreshCw size={14} />
          </button>
          {/* Search */}
          <div className="flex items-center gap-2 bg-bg-input border border-border-subtle rounded-lg px-3 py-2">
            <Search size={13} className="text-text-faint" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-faint outline-none w-36"
            />
          </div>
          <Button variant="primary" size="sm" className="flex items-center gap-1.5" onClick={() => setShowAdd(true)}>
            <UserPlus size={14} /> Add Friend
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-status-hard/10 border border-status-hard/30 rounded-xl p-3 text-status-hard text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Pending requests banner */}
      <PendingBanner
        requests={pending}
        onAccept={acceptRequest}
        onDismiss={() => setPending([])}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {summaryCards.map(c => (
          <Card key={c.label} className="p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card" style={{ backgroundColor: c.color }} />
            <div className="flex items-start justify-between ml-2">
              <div>
                <p className="text-text-muted text-xs">{c.label}</p>
                <p className="text-text-primary text-3xl font-extrabold mt-1">{loading ? "—" : c.value}</p>
                <p className="text-xs mt-0.5" style={{ color: c.color }}>{c.sub}</p>
              </div>
              <c.icon size={20} className="text-text-faint mt-1" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-[1fr_260px_240px] gap-3">

        {/* Friend list */}
        <div className="space-y-2">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === t ? "bg-accent-purple/15 text-accent-purple" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {t}{tabCount[t] !== undefined && <span className="ml-1 text-[10px]">({tabCount[t]})</span>}
              </button>
            ))}
          </div>

          <Card className="p-2 space-y-1">
            {loading ? (
              <p className="text-text-faint text-sm text-center py-8">Loading friends…</p>
            ) : filtered.length === 0 ? (
              <p className="text-text-faint text-sm text-center py-8">
                {search ? "No friends match your search." : "No friends yet — send your first request!"}
              </p>
            ) : (
              filtered.map(f => (
                <FriendRow
                  key={f.id}
                  friend={f}
                  selected={selected?.id === f.id}
                  onClick={() => setSelected(prev => prev?.id === f.id ? null : f)}
                />
              ))
            )}
          </Card>

          {/* Selected friend detail */}
          {selected && (
            <Card className="p-4 border border-accent-purple/20">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: selected.color }}
                >
                  {selected.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-bold">{selected.name}</p>
                  <p className="text-text-faint text-xs">{selected.handle}</p>
                </div>
                {!useMock && selected.friendship_id && (
                  <button
                    onClick={() => removeFriend(selected.friendship_id)}
                    className="text-status-hard text-xs hover:underline shrink-0"
                  >
                    Remove
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="text-text-faint hover:text-text-secondary shrink-0">
                  <X size={15} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Solved",   value: selected.solved ?? "—"           },
                  { label: "Accuracy", value: selected.acc ? `${selected.acc}%` : "—" },
                  { label: "Streak",   value: selected.streak ? `🔥 ${selected.streak}d` : "—" },
                ].map(s => (
                  <div key={s.label} className="bg-bg-input rounded-lg p-2.5 text-center">
                    <p className="text-text-primary text-sm font-bold">{s.value}</p>
                    <p className="text-text-faint text-[10px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              {selected.activity && (
                <p className="text-accent-purple text-xs mt-3 truncate">{selected.activity}</p>
              )}
            </Card>
          )}
        </div>

        {/* Activity feed */}
        <ActivityFeed items={activity} />

        {/* Jams + Leaderboard */}
        <div className="space-y-3">
          <JamsPanel jams={[]} />
          <Leaderboard entries={lbEntries} me={lbMe} />
        </div>

      </div>
    </div>
  )
}

export default Friends
