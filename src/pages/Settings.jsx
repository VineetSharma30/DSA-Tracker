import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const sections = [
  { id: "account",   label: "Account"        },
  { id: "platforms", label: "Platforms"       },
  { id: "notifs",    label: "Notifications"   },
  { id: "privacy",   label: "Privacy"         },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-accent-purple" : "bg-border-subtle"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  )
}

const SETTINGS_STORAGE_KEY = "dsa_tracker_settings";

function Settings() {
  const [activeSection, setActiveSection] = useState("account")
  const [savedMessage, setSavedMessage] = useState("")

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fullName: "Vineet Sharma",
      username: "@vineet_s",
      email: "vineet@example.com",
      notifs: {
        contestReminders: true,
        weeklyReport: true,
        streakAlerts: true,
        platformSync: false,
      },
      privacy: {
        publicProfile: false,
        showStreak: true,
        showRatings: true,
      },
      handles: {
        leetcode: "vineet_code",
        codeforces: "vineet_cf",
        codechef: "vineet_cc",
        hackerrank: "vineet_hr",
      }
    };
  });

  const showNotification = (msg) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(""), 2500);
  };

  const saveSettings = (updated) => {
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      showNotification("Settings updated successfully!");
    } catch (e) {
      console.error(e);
    }
  };


  const inputClass = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
  const labelClass = "text-text-secondary text-xs font-medium block mb-1.5"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Settings</h1>
          <p className="text-text-muted text-sm mt-0.5">Manage your account and preferences</p>
        </div>
        {savedMessage && (
          <div className="bg-status-easy/20 border border-status-easy text-status-easy text-xs px-3.5 py-1.5 rounded-full font-medium animate-fade-in">
            ✓ {savedMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar nav */}
        <Card className="p-2 h-fit">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-pill text-sm transition-colors cursor-pointer ${
                activeSection === s.id
                  ? "bg-accent-purple/10 text-accent-purple font-medium"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </Card>

        {/* Content */}
        <div className="col-span-3 space-y-4">
          {activeSection === "account" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => setSettings(s => ({ ...s, fullName: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings(s => ({ ...s, username: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(s => ({ ...s, email: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>New Password</label>
                  <input type="password" placeholder="Leave blank to keep current" className={inputClass} />
                </div>
              </div>
              <Button variant="primary" size="md" onClick={() => saveSettings(settings)}>
                Save Changes
              </Button>
            </Card>
          )}

          {activeSection === "platforms" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">
                Platform Handles
              </h3>
              <p className="text-text-muted text-xs">
                Connect your competitive programming accounts to sync ratings and stats automatically.
              </p>
              {[
                { key: "leetcode", name: "LeetCode",   color: "#F89F1B", placeholder: "your_leetcode_handle" },
                { key: "codeforces", name: "Codeforces", color: "#3B82F6", placeholder: "your_cf_handle" },
                { key: "codechef", name: "CodeChef",   color: "#FCD34D", placeholder: "your_codechef_handle" },
                { key: "hackerrank", name: "HackerRank", color: "#00C853", placeholder: "your_hr_handle" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-text-secondary text-sm w-28 shrink-0">{p.name}</span>
                  <input
                    type="text"
                    value={settings.handles?.[p.key] || ""}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      handles: { ...s.handles, [p.key]: e.target.value }
                    }))}
                    placeholder={`@${p.placeholder}`}
                    className={`${inputClass} flex-1`}
                  />
                  <Button variant="secondary" size="sm" onClick={() => showNotification(`Synced ${p.name}!`)}>
                    Sync
                  </Button>
                </div>
              ))}
              <Button variant="primary" size="md" onClick={() => saveSettings(settings)}>
                Save Handles
              </Button>
            </Card>
          )}

          {activeSection === "notifs" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">
                Notifications
              </h3>
              {[
                { key: "contestReminders", label: "Contest Reminders", desc: "Get notified 1 hour before a contest starts" },
                { key: "weeklyReport",     label: "Weekly Report",     desc: "Receive a summary of your weekly performance" },
                { key: "streakAlerts",     label: "Streak Alerts",     desc: "Alert when your streak is about to break" },
                { key: "platformSync",     label: "Auto Platform Sync", desc: "Automatically sync platform stats daily" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div>
                    <p className="text-text-primary text-sm font-medium">{n.label}</p>
                    <p className="text-text-faint text-xs mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle
                    checked={settings.notifs?.[n.key] ?? false}
                    onChange={(val) => {
                      const updated = {
                        ...settings,
                        notifs: { ...settings.notifs, [n.key]: val }
                      };
                      saveSettings(updated);
                    }}
                  />
                </div>
              ))}
            </Card>
          )}

          {activeSection === "privacy" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-text-primary text-sm font-semibold border-b border-border-subtle pb-3">
                Privacy
              </h3>
              <div className="space-y-3">
                {[
                  { key: "publicProfile", label: "Public Profile",    desc: "Allow others to view your profile at /u/vineet_s" },
                  { key: "showStreak",    label: "Show Streak",       desc: "Display your current streak on your public profile" },
                  { key: "showRatings",   label: "Show Ratings",      desc: "Show platform ratings on your public profile" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                    <div>
                      <p className="text-text-primary text-sm font-medium">{item.label}</p>
                      <p className="text-text-faint text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={settings.privacy?.[item.key] ?? false}
                      onChange={(val) => {
                        const updated = {
                          ...settings,
                          privacy: { ...settings.privacy, [item.key]: val }
                        };
                        saveSettings(updated);
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-status-hard text-xs font-semibold uppercase tracking-wide mb-3">Danger Zone</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-status-hard/40 text-status-hard hover:border-status-hard cursor-pointer"
                  onClick={() => showNotification("Demo: Account deletion requested")}
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings