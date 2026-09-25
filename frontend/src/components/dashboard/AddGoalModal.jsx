import { useState } from 'react'
import { Modal, Button } from '../ui/Ui'

const categories = ["problems", "rating", "topic", "learning"]
const colors     = ["#7C3AED", "#F89F1B", "#3B82F6", "#10B981", "#EF4444", "#F59E0B"]

const emptyForm = {
  title:    "",
  category: "problems",
  target:   "",
  current:  "0",
  deadline: "",
  color:    "#7C3AED",
}

// Shared styles for inputs and labels
const inputCls = "w-full bg-bg-input border border-border-DEFAULT rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
const labelCls = "text-text-secondary text-xs font-medium block mb-1.5"

// Reusable label + input wrapper
const Field = ({ label, children }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
)

const AddGoalModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState(emptyForm)

  // Updates one field in the form by its input name
  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.target) return

    onAdd({
      title:         form.title.trim(),
      category:      form.category,
      target_value:  Number(form.target),
      current_value: Number(form.current),
      deadline:      form.deadline || null,
      color:         form.color,
    })

    setForm(emptyForm)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Goal">
      <form onSubmit={onSubmit} className="space-y-4">

        <Field label="Goal Title *">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="e.g. Solve 50 Graph problems"
            className={inputCls}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select name="category" value={form.category} onChange={onChange} className={`${inputCls} cursor-pointer`}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Deadline">
            <input type="date" name="deadline" value={form.deadline} onChange={onChange} className={`${inputCls} cursor-pointer`} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Target Value *">
            <input type="number" name="target" value={form.target} onChange={onChange} placeholder="e.g. 50" className={inputCls} required min="1" />
          </Field>
          <Field label="Current Progress">
            <input type="number" name="current" value={form.current} onChange={onChange} placeholder="0" className={inputCls} min="0" />
          </Field>
        </div>

        <Field label="Accent Color">
          <div className="flex gap-2 mt-1">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, color: c }))}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  outline:       form.color === c ? `2px solid ${c}` : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </Field>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit"  variant="primary"   size="md" className="flex-1">Add Goal</Button>
        </div>

      </form>
    </Modal>
  )
}

export default AddGoalModal