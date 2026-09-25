import { useState, useEffect } from 'react'
import { Plus, Target, Trophy, BookOpen, Code2, Trash2, Minus } from 'lucide-react'
import { Card, Button, LoadingSpinner } from '../components/ui/Ui'
import AddGoalModal from '../components/dashboard/AddGoalModal'
import api from '../services/api'

// Maps a goal category to an icon component
const icons = {
  problems: Code2,
  rating:   Trophy,
  learning: BookOpen,
  topic:    Target,
}

// Shared style for the +/- stepper buttons
const stepBtn = "w-6 h-6 rounded-md flex items-center justify-center bg-bg-input text-text-muted hover:text-text-primary transition-colors"

// --- Sub-components ---

const ColorBar = ({ color }) => (
  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card" style={{ backgroundColor: color }} />
)

const ProgressBar = ({ pct, color }) => (
  <div className="mt-3 h-2 bg-border-subtle rounded-full overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${pct}%`, backgroundColor: color }}
    />
  </div>
)

// --- GoalCard ---

const GoalCard = ({ goal, onDelete, onUpdate }) => {
  const { id, title, color, category, deadline, current_value: cur, target_value: max, progress_pct } = goal

  const pct  = progress_pct ?? Math.min(Math.round((cur / max) * 100), 100)
  const Icon = icons[category] || Target
  const done = pct >= 100
  const near = pct >= 90 && !done

  const due = deadline
    ? new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "No deadline"

  return (
    <Card className="p-5 relative overflow-hidden group">
      <ColorBar color={color} />

      <button
        onClick={() => onDelete(id)}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-text-faint hover:text-status-hard hover:bg-status-hard/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={13} />
      </button>

      <div className="ml-3">

        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
              <Icon size={14} style={{ color }} />
            </div>
            <div>
              <p className="text-text-primary text-sm font-semibold">{title}</p>
              <p className="text-text-faint text-[10px] mt-0.5">Deadline: {due}</p>
            </div>
          </div>
          <div className="text-right shrink-0 mr-6">
            <p className="text-lg font-extrabold" style={{ color: done ? "#10B981" : color }}>{pct}%</p>
            {done && <span className="text-[10px] text-status-easy font-medium">Complete!</span>}
          </div>
        </div>

        <ProgressBar pct={pct} color={color} />

        {/* Counter + stepper */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-text-faint text-[10px]">{cur.toLocaleString()} / {max.toLocaleString()}</p>
          <div className="flex items-center gap-1.5">
            {near && <p className="text-status-medium text-[10px] font-medium mr-1">Almost there!</p>}
            <button
              onClick={() => onUpdate(goal, -1)}
              disabled={cur <= 0}
              className={`${stepBtn} disabled:opacity-30`}
            >
              <Minus size={12} />
            </button>
            <button onClick={() => onUpdate(goal, 1)} className={stepBtn}>
              <Plus size={12} />
            </button>
          </div>
        </div>

      </div>
    </Card>
  )
}

// --- Goals page ---

const Goals = () => {
  const [goals, setGoals]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    api.get('/goals')
      .then(res => setGoals(res.data.goals))
      .catch(() => setError("Failed to load goals"))
      .finally(() => setLoading(false))
  }, [])

  const done   = goals.filter(g => g.is_completed || g.progress_pct >= 100).length
  const active = goals.length - done

  const addGoal = async (payload) => {
    try {
      const res = await api.post('/goals', payload)
      setGoals(prev => [res.data.goal, ...prev])
    } catch (err) {
      console.error("Add goal failed:", err)
    }
  }

  const deleteGoal = async (id) => {
    if (!confirm("Delete this goal?")) return
    try {
      await api.delete(`/goals/${id}`)
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      console.error("Delete goal failed:", err)
    }
  }

  const updateProgress = async (goal, delta) => {
    const newVal = Math.max(0, goal.current_value + delta)
    try {
      const res = await api.put(`/goals/${goal.id}`, { current_value: newVal })
      setGoals(prev => prev.map(g => g.id === goal.id ? res.data.goal : g))
    } catch (err) {
      console.error("Update goal failed:", err)
    }
  }

  const stats = [
    { label: "Total Goals", value: goals.length, color: "#7C3AED" },
    { label: "In Progress", value: active,        color: "#F59E0B" },
    { label: "Completed",   value: done,           color: "#10B981" },
  ]

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Goals</h1>
          <p className="text-text-muted text-sm mt-0.5">Track your DSA targets and milestones</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" size="md" className="flex items-center gap-2">
          <Plus size={16} /> Add Goal
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="p-4 relative overflow-hidden">
            <ColorBar color={s.color} />
            <p className="text-text-muted text-xs ml-3">{s.label}</p>
            <p className="text-text-primary text-3xl font-extrabold ml-3 mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Goal list */}
      {loading ? (
        <LoadingSpinner message="Loading goals..." />
      ) : error ? (
        <Card className="p-8 text-center text-status-hard text-sm">{error}</Card>
      ) : goals.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-text-muted text-sm">No goals yet. Set your first target!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} onUpdate={updateProgress} />
          ))}
        </div>
      )}

      <AddGoalModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={addGoal} />

    </div>
  )
}

export default Goals
