import { useState } from 'react'
import {Modal, Button} from '../ui/Ui'
const CATEGORIES = ["problems", "rating", "topic", "learning"]
const COLORS = ["#7C3AED", "#F89F1B", "#3B82F6", "#10B981", "#EF4444", "#F59E0B"]

const empty = { title: "", category: "problems", target: "", current: "0", deadline: "", color: "#7C3AED" }

function AddGoalModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(empty)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.target) return
    onAdd({
      ...form,
      id: Date.now(),
      target: Number(form.target),
      current: Number(form.current),
    })
    setForm(empty)
    onClose()
  }

  const inputClass = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
  const labelClass = "text-text-secondary text-xs font-medium block mb-1.5"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Goal Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Solve 50 Graph problems" className={inputClass} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={`${inputClass} cursor-pointer`}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
              className={`${inputClass} cursor-pointer`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Target Value *</label>
            <input type="number" name="target" value={form.target} onChange={handleChange}
              placeholder="e.g. 50" className={inputClass} required min="1" />
          </div>
          <div>
            <label className={labelClass}>Current Progress</label>
            <input type="number" name="current" value={form.current} onChange={handleChange}
              placeholder="0" className={inputClass} min="0" />
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className={labelClass}>Accent Color</label>
          <div className="flex gap-2 mt-1">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, color: c }))}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  outline: form.color === c ? `2px solid ${c}` : "none",
                  outlineOffset: "2px"
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1">
            Add Goal
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddGoalModal