import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [form, setForm] = useState({
    bio: profile?.bio || "",
    leetcode_handle: profile?.leetcode_handle || "",
    codeforces_handle: profile?.codeforces_handle || "",
    codechef_handle: profile?.codechef_handle || "",
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)   // parent does the PATCH + closes
    setSaving(false)
  }

  const inputClass = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
  const labelClass = "text-text-secondary text-xs font-medium block mb-1.5"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" width="w-[520px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Username</label>
          <input type="text" value={profile?.username || ""} disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`} />
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange}
            rows={2} className={`${inputClass} resize-none`}
            placeholder="Tell others about yourself..." />
        </div>

        {/* Platform handles */}
        <div>
          <p className="text-text-secondary text-xs font-medium mb-2">Platform Handles</p>
          <div className="space-y-2">
            {[
              { label: "LeetCode",   name: "leetcode_handle",   color: "#F89F1B" },
              { label: "Codeforces", name: "codeforces_handle", color: "#3B82F6" },
              { label: "CodeChef",   name: "codechef_handle",   color: "#FCD34D" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-text-muted text-xs w-24 shrink-0">{p.label}</span>
                <input
                  type="text"
                  name={p.name}
                  value={form[p.name]}
                  onChange={handleChange}
                  placeholder={`@your_handle`}
                  className={`${inputClass} flex-1`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditProfileModal