import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    leetcode_handle: profile?.platforms?.[0]?.handle || "",
    codeforces_handle: profile?.platforms?.[1]?.handle || "",
    codechef_handle: profile?.platforms?.[2]?.handle || "",
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  const inputClass = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
  const labelClass = "text-text-secondary text-xs font-medium block mb-1.5"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" width="w-[520px]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" name="name" value={form.name}
              onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Username</label>
            <input type="text" name="username" value={form.username}
              onChange={handleChange} className={inputClass} />
          </div>
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
          <Button type="submit" variant="primary" size="md" className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditProfileModal