import { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card, Badge, Button} from '../components/ui/Ui'
import { mockProblems } from '../data/mockData'
import AddProblemModal from '../components/dashboard/AddProblemModal'

// Lookup tables for Badge props
const difficultyBadge = {
  Easy:   { color: "easy",   variant: "outlined" },
  Medium: { color: "medium", variant: "outlined" },
  Hard:   { color: "hard",   variant: "outlined" },
};

const statusBadge = {
  "Solved":        { color: "easy",   variant: "filled" },
  "Attempted":     { color: "medium", variant: "filled" },
  "Not Attempted": { color: "muted",  variant: "outlined" },
};

const PLATFORMS = ["All", "LeetCode", "Codeforces", "CodeChef"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

function Problems() {
  const [platform, setPlatform]     = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch]         = useState("");

  const [problems, setProblems] = useState(mockProblems) // local state instead of const
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddProblem = (newProblem) => {
    setProblems(prev => [newProblem, ...prev])
  }

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchPlatform   = platform === "All"   || p.platform   === platform;
      const matchDifficulty = difficulty === "All" || p.difficulty === difficulty;
      const matchSearch     = p.title.toLowerCase().includes(search.toLowerCase());
      return matchPlatform && matchDifficulty && matchSearch;
    });
  }, [platform, difficulty, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Problems</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Track and practice problems across all platforms
          </p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2"
          onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Problem
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Platform tabs */}
        <div className="flex gap-2">
          {PLATFORMS.map((p) => (
            <Button
              key={p}
              variant={platform === p ? "primary" : "secondary"}
              size="sm"
              onClick={() => setPlatform(p)}
            >
              {p}
            </Button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border-subtle" />

        {/* Difficulty pills */}
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "primary" : "secondary"}
              size="sm"
              onClick={() => setDifficulty(d)}
            >
              {d}
            </Button>
          ))}
        </div>

        {/* Search — pushed to the right */}
        <div className="ml-auto flex items-center gap-2 bg-bg-input border border-border-DEFAULT rounded-pill px-3 py-1.5 w-56">
          <Search size={13} className="text-text-faint shrink-0" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-text-secondary placeholder:text-text-faint outline-none w-full"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_130px_110px_130px_130px_100px] px-4 py-2.5 border-b border-border-subtle bg-bg-base">
          {["#", "Title", "Platform", "Difficulty", "Topic", "Status", "Solved"].map((h) => (
            <span key={h} className="text-text-faint text-[11px] font-medium uppercase tracking-wide">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-sm">
            No problems match your filters.
          </div>
        ) : (
          filtered.map((problem, index) => (
            <div
              key={problem.id}
              className={`grid grid-cols-[40px_1fr_130px_110px_130px_130px_100px] px-4 py-3 items-center border-b border-border-subtle last:border-b-0 hover:bg-bg-input transition-colors ${
                index % 2 === 0 ? "" : "bg-bg-base/40"
              }`}
            >
              <span className="text-text-faint text-xs">{index + 1}</span>
              <span className="text-text-primary text-sm font-medium truncate pr-4">{problem.title}</span>
              <span className="text-text-muted text-xs">{problem.platform}</span>
              <div>
                <Badge {...difficultyBadge[problem.difficulty]} className="text-[10px] px-2 py-0.5">
                  {problem.difficulty}
                </Badge>
              </div>
              <span className="text-text-muted text-xs">{problem.topic}</span>
              <div>
                <Badge {...statusBadge[problem.status]} className="text-[10px] px-2 py-0.5">
                  {problem.status}
                </Badge>
              </div>
              <span className="text-text-faint text-xs">{problem.solvedAt}</span>
            </div>
          ))
        )}

        {/* Footer: row count */}
        <div className="px-4 py-2.5 border-t border-border-subtle">
          <p className="text-text-faint text-xs">
            Showing {filtered.length} of {problems.length} problems
          </p>
        </div>
      </Card>
       <AddProblemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProblem}
      />
    </div>
  );
}

export default Problems;