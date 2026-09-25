import { useState, useEffect } from 'react'
import { Card, Button } from '../components/ui/Ui'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const navSections = [
  { id: "account",   label: "Account"       },
  { id: "platforms", label: "Platforms"     },
  { id: "notifs",    label: "Notifications" },
  { id: "privacy",   label: "Privacy"       },
]

const platformFields = [
  { name: "LeetCode",   color: "#F89F1B", key: "leetcode_handle",   placeholder: "your_leetcode_handle", syncable: true  },
  { name: "Codeforces", color: "#3B82F6", key: "codeforces_handle", placeholder: "your_cf_handle",       syncable: true  },
  { name: "CodeChef",   color: "#FCD34D", key: "codechef_handle",   placeholder: "your_codechef_handle", syncable: false },
  { name: "HackerRank", color: "#00C853", key: null,                placeholder: "coming soon",          syncable: false },
]

const notifFields = [
  { key: "contestReminders", label: "Contest Reminders",  desc: "Get notified 1 hour before a contest starts"   },
  { key: "weeklyReport",     label: "Weekly Report",      desc: "Receive a summary of your weekly performance"   },
  { key: "streakAlerts",     label: "Streak Alerts",      desc: "Alert when your streak is about to break"       },
  { key: "platformSync",     label: "Auto Platform Sync", desc: "Automatically sync platform stats daily"        },
]

const privacyFields = [
  { key: "publicProfile", label: "Public Profile", desc: (u) => `Allow others to view your profile at /u/${u || "you"}` },
  { key: "showStreak",    label: "Show Streak",    desc: () => "Display your current streak on your public profile"     },
  { key: "showRatings",   label: "Show Ratings",   desc: () => "Show platform ratings on your public profile"           },
]

const defaultPrefs = {
  contestReminders: true,
  weeklyReport:     true,
  streakAlerts:     true,
  platformSync:     false,
  publicProfile:    false,
  showStreak:       true,
  showRatings:      true,
}

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-accent-purple" : "bg-border-subtle"}`}
  >
    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
  </button>
)

const inputCls = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
const labelCls = "text-text-secondary text-xs font-medium block mb-1.5"

const Settings = () => {
  const { user, setUser, logout } = useAuth()
  const [section, setSection] = useState("account")

  const [handles, setHandles]           = useState({
    leetcode_handle:   user?.leetcode_handle   || "",
    codeforces_handle: user?.codeforces_handle || "",
    codechef_handle:   user?.codechef_handle   || "",
  })
  const [savingHandles, setSavingHandles] = useState(false)
  const [syncing, setSyncing]             = useState({})
  const [syncMsg, setSyncMsg]             = useState("")
  const [backfilling, setBackfilling]     = useState(false)

  const [bio, setBio]                   = useState(user?.bio || "")
  const [savingAccount, setSavingAccount] = useState(false)
  const [accountMsg, setAccountMsg]       = useState("")

  const [prefs, setPrefs]               = useState({ ...defaultPrefs, ...(user?.preferences || {}) })
  const [savingPrefs, setSavingPrefs]   = useState(false)
  const [prefsMsg, setPrefsMsg]         = useState("")

  const [deletingAccount, setDeletingAccount]   = useState(false)
  const [deleteConfirm, setDeleteConfirm]       = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (user?.preferences) setPrefs(prev => ({ ...defaultPrefs, ...user.preferences, ...prev }))
  }, [user])

  const saveHandles = async () => {
    setSavingHandles(true)
    setSyncMsg("")
    try {
      const res = await api.patch('/auth/me', handles)
      setUser(res.data.user)
      setSyncMsg("✅ Handles saved! Hit Sync to pull your stats.")
    } catch (err) {
      setSyncMsg(`❌ ${err.response?.data?.error || "Failed to save handles"}`)
    } finally {
      setSavingHandles(false)
    }
  }

  const saveAccount = async () => {
    setSavingAccount(true)
    setAccountMsg("")
    try {
      const res = await api.patch('/auth/me', { bio })
      setUser(res.data.user)
      setAccountMsg("✅ Saved!")
    } catch (err) {
      setAccountMsg(`❌ ${err.response?.data?.error || "Failed to save"}`)
    } finally {
      setSavingAccount(false)
    }
  }

  const syncPlatform = async (platform) => {
    setSyncing(prev => ({ ...prev, [platform]: true }))
    setSyncMsg("")
    try {
      await api.post(`/platforms/sync/${platform.toLowerCase()}`)
      if (platform === "LeetCode") {
        const res = await api.post('/platforms/leetcode/import-submissions?clean=true')
        setSyncMsg(`✅ Synced! Imported ${res.data.imported} problems.`)
      } else {
        setSyncMsg(`✅ ${platform} stats synced!`)
      }
    } catch (err) {
      setSyncMsg(`❌ ${err.response?.data?.error || "Sync failed"}`)
    } finally {
      setSyncing(prev => ({ ...prev, [platform]: false }))
    }
  }

  const backfillTopics = async () => {
    setBackfilling(true)
    setSyncMsg("")
    try {
      const res = await api.post('/platforms/leetcode/backfill-topics')
      setSyncMsg(`✅ Topics fixed: ${res.data.fixed} updated, ${res.data.skipped} already had topics, ${res.data.errors} errors.`)
    } catch (err) {
      setSyncMsg(`❌ ${err.response?.data?.error || "Backfill failed"}`)
    } finally {
      setBackfilling(false)
    }
  }

  const savePrefs = async () => {
    setSavingPrefs(true)
    setPrefsMsg("")
    try {
      await api.patch('/auth/me/preferences', prefs)
      setPrefsMsg("✅ Preferences saved!")
    } catch (err) {
      setPrefsMsg(`❌ ${err.response?.data?.error || "Failed to save preferences"}`)
    } finally {
      setSavingPrefs(false)
    }
  }

  const deleteAccount = async () => {
    if (deleteConfirm !== user?.username) {
      setPrefsMsg(`❌ Type your username "${user?.username}" to confirm.`)
      return
    }
    setDeletingAccount(true)
    try {
      await api.delete('/auth/me')
      logout()
    } catch (err) {
      setPrefsMsg(`❌ ${err.response?.data?.error || "Failed to delete account"}`)
      setDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Settings</h1>
        <p className="text-text-muted text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-4 gap-4 items-start">
        {/* Sidebar */}
        <Card className="p-2 h-fit">
          {navSections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-pill text-sm transition-colors ${
                section === s.id
                  ? "bg-accent-purple/10 text-accent-purple font-medium"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </Card>

        <div className="col-span-3 space-y-4">

          {section === "account" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">Account Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Username</label>
                  <input type="text" value={user?.username || ""} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={user?.email || ""} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={280}
                  rows={3}
                  placeholder="A short line about your DSA journey..."
                  className={`${inputCls} resize-none`}
                />
                <p className="text-text-faint text-[10px] mt-1">{bio.length}/280</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="primary" size="md" onClick={saveAccount} disabled={savingAccount}>
                  {savingAccount ? "Saving..." : "Save Changes"}
                </Button>
                {accountMsg && <p className="text-xs text-text-muted">{accountMsg}</p>}
              </div>
              <p className="text-text-faint text-[11px]">Username, email and password changes aren't supported yet.</p>
            </Card>
          )}

          {section === "platforms" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">Platform Handles</h3>
              <p className="text-text-muted text-xs">Connect your competitive programming accounts to sync ratings and stats automatically.</p>
              {platformFields.map(p => (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-text-secondary text-sm w-28 shrink-0">{p.name}</span>
                  <input
                    type="text"
                    placeholder={`@${p.placeholder}`}
                    className={`${inputCls} flex-1 ${!p.key ? "opacity-50 cursor-not-allowed" : ""}`}
                    value={p.key ? handles[p.key] : ""}
                    disabled={!p.key}
                    onChange={e => setHandles(prev => ({ ...prev, [p.key]: e.target.value }))}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => syncPlatform(p.name)}
                    disabled={syncing[p.name] || !p.syncable}
                    title={p.syncable ? "" : "Sync not available for this platform yet"}
                  >
                    {syncing[p.name] ? "Syncing..." : "Sync"}
                  </Button>
                </div>
              ))}
              {syncMsg && <p className="text-xs text-text-muted">{syncMsg}</p>}
              <div className="flex items-center gap-3 pt-1">
                <Button variant="primary" size="md" onClick={saveHandles} disabled={savingHandles}>
                  {savingHandles ? "Saving..." : "Save Handles"}
                </Button>
              </div>
              <div className="mt-2 pt-4 border-t border-border-subtle">
                <p className="text-text-secondary text-xs font-semibold mb-1">Fix Problem Topics</p>
                <p className="text-text-faint text-[11px] mb-3">
                  If you imported problems before the topic-detection fix, click below to backfill missing topic and difficulty data from LeetCode.
                </p>
                <Button variant="secondary" size="sm" onClick={backfillTopics} disabled={backfilling}>
                  {backfilling ? "Fixing topics..." : "Fix Missing Topics"}
                </Button>
              </div>
            </Card>
          )}

          {section === "notifs" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">Notifications</h3>
              {notifFields.map(n => (
                <div key={n.key} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div>
                    <p className="text-text-primary text-sm font-medium">{n.label}</p>
                    <p className="text-text-faint text-xs mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle checked={prefs[n.key]} onChange={val => setPrefs(prev => ({ ...prev, [n.key]: val }))} />
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1">
                <Button variant="primary" size="md" onClick={savePrefs} disabled={savingPrefs}>
                  {savingPrefs ? "Saving..." : "Save Preferences"}
                </Button>
                {prefsMsg && <p className="text-xs text-text-muted">{prefsMsg}</p>}
              </div>
            </Card>
          )}

          {section === "privacy" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">Privacy</h3>
              <div className="space-y-3">
                {privacyFields.map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                    <div>
                      <p className="text-text-primary text-sm font-medium">{item.label}</p>
                      <p className="text-text-faint text-xs mt-0.5">{item.desc(user?.username)}</p>
                    </div>
                    <Toggle checked={prefs[item.key]} onChange={val => setPrefs(prev => ({ ...prev, [item.key]: val }))} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button variant="primary" size="md" onClick={savePrefs} disabled={savingPrefs}>
                  {savingPrefs ? "Saving..." : "Save Preferences"}
                </Button>
                {prefsMsg && <p className="text-xs text-text-muted">{prefsMsg}</p>}
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-status-hard text-xs font-semibold uppercase tracking-wide mb-3">Danger Zone</p>
                {!showDeleteConfirm ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-status-hard/40 text-status-hard hover:border-status-hard"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-3 p-4 border border-status-hard/30 rounded-lg bg-status-hard/5">
                    <p className="text-text-primary text-xs font-medium">
                      This will permanently delete your account, all problems, goals, and stats.
                      This <span className="font-bold text-status-hard">cannot be undone.</span>
                    </p>
                    <p className="text-text-muted text-xs">
                      Type your username <span className="font-semibold text-text-primary">{user?.username}</span> to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={e => setDeleteConfirm(e.target.value)}
                      placeholder={user?.username}
                      className={`${inputCls} border-status-hard/40 focus:border-status-hard`}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="border-status-hard/40 text-status-hard hover:border-status-hard"
                        onClick={deleteAccount}
                        disabled={deletingAccount || deleteConfirm !== user?.username}
                      >
                        {deletingAccount ? "Deleting..." : "Permanently Delete"}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirm("") }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}

export default Settings