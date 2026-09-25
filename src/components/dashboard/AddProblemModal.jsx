import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const PLATFORMS   = ["LeetCode", "Codeforces", "CodeChef", "HackerRank"]
const DIFFICULTIES = ["Easy", "Medium", "Hard"]
const TOPICS      = ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "DP", "Binary Search", "Stacks", "Two Pointers", "Others"]
const STATUSES    = ["Solved", "Attempted", "Not Attempted"]

const empty = { title: "", platform: "LeetCode", difficulty: "Easy", topic: "Arrays", status: "Solved", url: "", notes: "" }

function AddProblemModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(empty)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onAdd({ ...form, id: Date.now(), solvedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) })
    setForm(empty)
    onClose()
  }

  const inputClass = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
  const labelClass = "text-text-secondary text-xs font-medium block mb-1.5"
  const selectClass = `${inputClass} cursor-pointer`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Problem">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className={labelClass}>Problem Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Two Sum"
            className={inputClass}
            required
          />
        </div>

        {/* Platform + Difficulty — 2 col */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Platform</label>
            <select name="platform" value={form.platform} onChange={handleChange} className={selectClass}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} className={selectClass}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Topic + Status — 2 col */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Topic</label>
            <select name="topic" value={form.topic} onChange={handleChange} className={selectClass}>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={selectClass}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* URL */}
        <div>
          <label className={labelClass}>Problem URL <span className="text-text-faint">(optional)</span></label>
          <input
            type="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://leetcode.com/problems/..."
            className={inputClass}
          />
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes <span className="text-text-faint">(optional)</span></label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Key insight, approach used..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1">
            Add Problem
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddProblemModal