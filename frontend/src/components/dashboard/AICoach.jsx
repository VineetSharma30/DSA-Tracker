import { useState, useEffect } from 'react'
import { Sparkles, FileText, Target, Flame, RefreshCw, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Card, Button } from '../ui/Ui'
import Modal from '../ui/Modal'
import api from '../../services/api'

const MODAL_TITLE = {
  report:    "📋 Your Full DSA Report",
  recommend: "🎯 What To Solve Next",
  roast:     "🔥 Roast My DSA",
}

// How each markdown element is rendered inside the modal (dark theme + links open in a new tab).
const MD = {
  a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent-purpleLight font-medium underline decoration-accent-purple/40 hover:decoration-accent-purple" />,
  strong: (props) => <strong {...props} className="text-text-primary font-semibold" />,
  em: (props) => <em {...props} className="text-text-muted" />,
  p: (props) => <p {...props} className="text-text-secondary text-sm leading-relaxed mb-2.5" />,
  ul: (props) => <ul {...props} className="list-disc pl-5 space-y-1 mb-2.5" />,
  ol: (props) => <ol {...props} className="list-decimal pl-5 space-y-2 mb-2.5" />,
  li: (props) => <li {...props} className="text-text-secondary text-sm leading-relaxed" />,
  h1: (props) => <h2 {...props} className="text-text-primary text-sm font-bold mt-3 mb-1.5" />,
  h2: (props) => <h2 {...props} className="text-text-primary text-sm font-bold mt-3 mb-1.5" />,
  h3: (props) => <h3 {...props} className="text-text-primary text-xs font-semibold uppercase tracking-wide mt-3 mb-1" />,
  code: (props) => <code {...props} className="bg-bg-input text-accent-purpleLight px-1.5 py-0.5 rounded text-xs" />,
}

function AICoach() {
  const [insight, setInsight] = useState(null)
  const [loadingInsight, setLoadingInsight] = useState(true)

  // One modal handles all three long-form features (report / recommend / roast).
  const [modal, setModal] = useState(null)        // which feature is open
  const [content, setContent] = useState("")
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState("")

  const fetchInsight = async (refresh = false) => {
    setLoadingInsight(true)
    try {
      const res = await api.get(`/ai/insight${refresh ? '?refresh=true' : ''}`)
      setInsight(res.data.insight)
    } catch {
      setInsight(null)   // banner falls back to its placeholder text
    } finally {
      setLoadingInsight(false)
    }
  }

  useEffect(() => { fetchInsight() }, [])

  const loadContent = async (kind, refresh = false) => {
    setModalLoading(true)
    setModalError("")
    setContent("")
    try {
      const res = await api.get(`/ai/${kind}${refresh ? '?refresh=true' : ''}`)
      // Each endpoint names its field differently — grab whichever came back.
      setContent(res.data.report || res.data.recommendations || res.data.roast || "")
    } catch (err) {
      setModalError(err.response?.data?.error || "AI is unavailable right now. Is the API key set?")
    } finally {
      setModalLoading(false)
    }
  }

  const openModal = (kind) => {
    setModal(kind)
    loadContent(kind)
  }

  return (
    <>
      <Card className="p-4 bg-linear-to-br from-accent-purple/15 to-accent-blue/10 border border-accent-purple/30">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-accent-purpleLight" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-text-primary text-sm font-semibold">AI Coach</p>
              <button
                onClick={() => fetchInsight(true)}
                className="text-text-faint hover:text-text-secondary transition-colors"
                title="Regenerate insight"
              >
                <RefreshCw size={13} className={loadingInsight ? "animate-spin" : ""} />
              </button>
            </div>

            <p className="text-text-secondary text-xs mt-1 leading-relaxed">
              {loadingInsight
                ? "Analyzing your progress…"
                : (insight || "Add or sync some problems and I'll analyze your progress.")}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="secondary" size="sm" onClick={() => openModal('report')} className="flex items-center gap-1.5">
                <FileText size={13} /> Full Report
              </Button>
              <Button variant="secondary" size="sm" onClick={() => openModal('recommend')} className="flex items-center gap-1.5">
                <Target size={13} /> What to solve
              </Button>
              <Button variant="secondary" size="sm" onClick={() => openModal('roast')} className="flex items-center gap-1.5">
                <Flame size={13} /> Roast me
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal ? MODAL_TITLE[modal] : ""}
        width="w-[560px]"
      >
        {modalLoading ? (
          <p className="text-text-muted text-sm py-10 text-center">✨ Generating…</p>
        ) : modalError ? (
          <p className="text-status-hard text-sm py-4">{modalError}</p>
        ) : (
          <div className="space-y-3">
            <div className="max-h-[55vh] overflow-y-auto pr-1">
              <ReactMarkdown components={MD}>{content}</ReactMarkdown>
            </div>
            <div className="flex gap-2 pt-3 border-t border-border-subtle">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigator.clipboard?.writeText(content)}
                className="flex items-center gap-1.5"
              >
                <Copy size={13} /> Copy
              </Button>
              <Button variant="secondary" size="sm" onClick={() => loadContent(modal, true)}>
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default AICoach
