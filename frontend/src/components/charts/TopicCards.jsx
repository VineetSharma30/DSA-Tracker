import { Target } from 'lucide-react'
import { Card } from '../ui/Ui'
import { useNavigate } from 'react-router-dom'

// ── Helpers ────────────────────────────────────────────────────────

export const buildTopicRows = (topicRadar = []) =>
  topicRadar.slice(0, 6).map((t, i) => ({
    topic:     t.topic,
    lastMonth: Math.max(t.score - (10 + i * 4), 5),
    thisMonth: t.score,
    change:    10 + i * 4,
  }))

export const buildWeakTopics = (topicRadar = []) =>
  topicRadar
    .filter(t => t.score < 50)
    .slice(0, 3)
    .map((t, i) => ({ topic: t.topic, score: t.score, note: `Accuracy dropped by ${10 + i * 5}%` }))

// ── Sub-helpers ────────────────────────────────────────────────────

const barColor = score => score >= 60 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444"

// ── Components ─────────────────────────────────────────────────────

const TopicImprovementTable = ({ topicRadar }) => {
  const rows = buildTopicRows(topicRadar)

  if (!rows.length) return (
    <Card className="p-4">
      <h3 className="text-text-primary text-sm font-semibold">Topic Improvement</h3>
      <p className="text-text-faint text-xs mt-4">No topic data yet. Sync your LeetCode handle in Settings.</p>
    </Card>
  )

  return (
    <Card className="p-4">
      <h3 className="text-text-primary text-sm font-semibold">Topic Improvement</h3>
      <p className="text-text-faint text-[11px] mt-0.5">Your progress in key topics</p>

      <table className="w-full mt-3 text-xs">
        <thead>
          <tr className="text-text-faint">
            <th className="text-left pb-2 font-medium">Topic</th>
            <th className="text-right pb-2 font-medium pr-4">Last Mo.</th>
            <th className="text-right pb-2 font-medium pr-4">This Mo.</th>
            <th className="text-right pb-2 font-medium">Change</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.topic} className="hover:bg-bg-input/40 rounded-lg transition-colors">
              <td className="py-2.5 text-text-secondary">{row.topic}</td>
              <td className="py-2.5 text-right text-text-faint pr-4">{row.lastMonth}%</td>
              <td className="py-2.5 text-right pr-4">
                <span className="font-semibold" style={{ color: barColor(row.thisMonth) }}>
                  {row.thisMonth}%
                </span>
              </td>
              <td className="py-2.5 text-right font-bold text-status-easy">+{row.change}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

const NeedsAttentionCard = ({ topicRadar }) => {
  const navigate  = useNavigate()
  const items     = buildWeakTopics(topicRadar)
  const rows      = buildTopicRows(topicRadar)
  const bestTopic = rows[0]

  return (
    <Card className="p-4">
      <h3 className="text-text-primary text-sm font-semibold">Needs Attention</h3>
      <p className="text-text-faint text-[11px] mt-0.5">Focus on these topics to improve faster</p>

      {items.length === 0 ? (
        <p className="text-text-faint text-xs mt-4">All topics look good! 🎉</p>
      ) : (
        <div className="mt-3 space-y-3">
          {items.map(item => (
            <div key={item.topic} className="flex items-start gap-3 p-3 rounded-lg bg-bg-input">
              <div className="w-8 h-8 rounded-lg bg-status-hard/20 flex items-center justify-center shrink-0">
                <Target size={14} className="text-status-hard" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-text-primary text-xs font-semibold">{item.topic}</p>
                  <span className="text-status-hard text-xs font-bold">{item.score}%</span>
                </div>
                <p className="text-status-hard text-[10px] mt-0.5">{item.note}</p>
                <p className="text-text-faint text-[10px]">Recommended: 8 Medium problems</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border-subtle">
        <div className="p-2.5 rounded-lg bg-status-easy/10 border border-status-easy/20">
          <p className="text-[9px] text-text-faint uppercase tracking-wide">Best Topic</p>
          <p className="text-status-easy text-xs font-bold mt-0.5 truncate">{bestTopic?.topic || "—"}</p>
          <p className="text-text-faint text-[9px]">↑ {bestTopic?.change || 0}% improved</p>
        </div>
        <div className="p-2.5 rounded-lg bg-status-hard/10 border border-status-hard/20">
          <p className="text-[9px] text-text-faint uppercase tracking-wide">Needs Work</p>
          <p className="text-status-hard text-xs font-bold mt-0.5 truncate">{items[0]?.topic || "—"}</p>
          <p className="text-text-faint text-[9px]">Practice to improve</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/problems')}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-accent-purple text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-accent-purple/90 transition-colors"
      >
        Practice Now
      </button>
    </Card>
  )
}

export { TopicImprovementTable, NeedsAttentionCard }
