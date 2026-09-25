import { useState } from 'react'
import { Plus, Target, Trophy, BookOpen, Code2 } from 'lucide-react'
import {Card, Button} from '../components/ui/ui'
import { goalsData } from '../data/mockData'
import AddGoalModal from '../components/dashboard/AddGoalModal'

const categoryIcons = {
  problems: Code2,
  rating:   Trophy,
  learning: BookOpen,
  topic:    Target,
};

// Goal Card

function GoalCard({ goal }) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const Icon = categoryIcons[goal.category] || Target;
  const isNearDeadline = pct >= 90;
  const isComplete = pct >= 100;

  return (
    <Card className="p-5 relative overflow-hidden">
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
        style={{ backgroundColor: goal.color }}
      />

      <div className="ml-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              <Icon size={14} style={{ color: goal.color }} />
            </div>
            <div>
              <p className="text-text-primary text-sm font-semibold">{goal.title}</p>
              <p className="text-text-faint text-[10px] mt-0.5">Deadline: {goal.deadline}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p
              className="text-lg font-extrabold"
              style={{ color: isComplete ? "#10B981" : goal.color }}
            >
              {pct}%
            </p>
            {isComplete && (
              <span className="text-[10px] text-status-easy font-medium">Complete!</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-border-subtle rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: goal.color }}
          />
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-text-faint text-[10px]">
            {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
          </p>
          {isNearDeadline && !isComplete && (
            <p className="text-status-medium text-[10px] font-medium">Almost there!</p>
          )}
        </div>
      </div>
    </Card>
  )
}


// Goals
const GOALS_STORAGE_KEY = "dsa_tracker_goals";

function Goals() {
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(GOALS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : goalsData;
    } catch {
      return goalsData;
    }
  });
  const [showAddModal, setShowAddModal] = useState(false)

  const completed = goals.filter(g => g.current >= g.target).length;
  const inProgress = goals.length - completed;

  const handleAddGoal = (newGoal) => {
    setGoals(prev => {
      const updated = [...prev, newGoal];
      try {
        localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save goal", e);
      }
      return updated;
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Goals</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Track your DSA targets and milestones
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" size="md" className="flex items-center gap-2">
          <Plus size={16} /> Add Goal
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Goals",  value: goals.length, color: "#7C3AED" },
          { label: "In Progress",  value: inProgress,        color: "#F59E0B" },
          { label: "Completed",    value: completed,         color: "#10B981" },
        ].map((s) => (
          <Card key={s.label} className="p-4 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
              style={{ backgroundColor: s.color }}
            />
            <p className="text-text-muted text-xs ml-3">{s.label}</p>
            <p className="text-text-primary text-3xl font-extrabold ml-3 mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGoal}
      />
    </div>
  )
}

export default Goals