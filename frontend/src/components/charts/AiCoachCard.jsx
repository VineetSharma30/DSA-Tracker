import { useState } from 'react'
import { Brain, ExternalLink } from 'lucide-react'
import { Card } from '../ui/Ui'
import { buildWeakTopics } from './TopicCards'

// Real LeetCode curated problems per DSA topic.

const topicProblems = {
  "Arrays": [
    { title: "Two Sum",                        url: "https://leetcode.com/problems/two-sum/" },
    { title: "Container With Most Water",      url: "https://leetcode.com/problems/container-with-most-water/" },
    { title: "Trapping Rain Water",            url: "https://leetcode.com/problems/trapping-rain-water/" },
  ],
  "Strings": [
    { title: "Longest Substring No Repeat",   url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { title: "Valid Anagram",                  url: "https://leetcode.com/problems/valid-anagram/" },
    { title: "Minimum Window Substring",       url: "https://leetcode.com/problems/minimum-window-substring/" },
  ],
  "Dynamic Programming": [
    { title: "Climbing Stairs",                url: "https://leetcode.com/problems/climbing-stairs/" },
    { title: "Longest Common Subsequence",     url: "https://leetcode.com/problems/longest-common-subsequence/" },
    { title: "Coin Change",                    url: "https://leetcode.com/problems/coin-change/" },
  ],
  "Trees": [
    { title: "Binary Tree Level Order",        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    { title: "Validate Binary Search Tree",    url: "https://leetcode.com/problems/validate-binary-search-tree/" },
    { title: "Lowest Common Ancestor",         url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  ],
  "Graphs": [
    { title: "Number of Islands",              url: "https://leetcode.com/problems/number-of-islands/" },
    { title: "Pacific Atlantic Water Flow",    url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
    { title: "Course Schedule",               url: "https://leetcode.com/problems/course-schedule/" },
  ],
  "Binary Search": [
    { title: "Binary Search",                  url: "https://leetcode.com/problems/binary-search/" },
    { title: "Search in Rotated Array",        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { title: "Find Min in Rotated Array",      url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  ],
  "Stack": [
    { title: "Valid Parentheses",              url: "https://leetcode.com/problems/valid-parentheses/" },
    { title: "Min Stack",                      url: "https://leetcode.com/problems/min-stack/" },
    { title: "Daily Temperatures",             url: "https://leetcode.com/problems/daily-temperatures/" },
  ],
  "Linked List": [
    { title: "Reverse Linked List",            url: "https://leetcode.com/problems/reverse-linked-list/" },
    { title: "Merge Two Sorted Lists",         url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { title: "Detect Cycle in Linked List",    url: "https://leetcode.com/problems/linked-list-cycle/" },
  ],
  "Greedy": [
    { title: "Jump Game",                      url: "https://leetcode.com/problems/jump-game/" },
    { title: "Gas Station",                    url: "https://leetcode.com/problems/gas-station/" },
    { title: "Meeting Rooms II",               url: "https://leetcode.com/problems/meeting-rooms-ii/" },
  ],
  "Sorting": [
    { title: "Sort Colors",                    url: "https://leetcode.com/problems/sort-colors/" },
    { title: "Merge Intervals",                url: "https://leetcode.com/problems/merge-intervals/" },
    { title: "Largest Number",                 url: "https://leetcode.com/problems/largest-number/" },
  ],
  "BFS": [
    { title: "Word Ladder",                    url: "https://leetcode.com/problems/word-ladder/" },
    { title: "Rotting Oranges",               url: "https://leetcode.com/problems/rotting-oranges/" },
    { title: "Shortest Path in Grid",          url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/" },
  ],
  "DFS": [
    { title: "Number of Islands",              url: "https://leetcode.com/problems/number-of-islands/" },
    { title: "Pacific Atlantic Water",         url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
    { title: "Clone Graph",                   url: "https://leetcode.com/problems/clone-graph/" },
  ],
  "Topological Sort": [
    { title: "Course Schedule",               url: "https://leetcode.com/problems/course-schedule/" },
    { title: "Course Schedule II",             url: "https://leetcode.com/problems/course-schedule-ii/" },
    { title: "Alien Dictionary",               url: "https://leetcode.com/problems/alien-dictionary/" },
  ],
  "Dijkstra": [
    { title: "Network Delay Time",             url: "https://leetcode.com/problems/network-delay-time/" },
    { title: "Cheapest Flights K Stops",       url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
    { title: "Path with Min Effort",           url: "https://leetcode.com/problems/path-with-minimum-effort/" },
  ],
}


const buildTags = weakTopics => {
  const real = weakTopics
    .map(t => t.topic)
    .filter(t => Object.keys(topicProblems).some(k =>
      k.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(k.toLowerCase())
    ))
  return real.length ? real.slice(0, 4) : Object.keys(topicProblems)
}

const resolve = tag =>
  Object.keys(topicProblems).find(k =>
    k.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(k.toLowerCase())
  ) || "BFS"

const AiCoachCard = ({ topicRadar }) => {
  const weakTopics = buildWeakTopics(topicRadar)
  const tags       = buildTags(weakTopics)

  const [activeTag, setActiveTag] = useState(tags[0] || "BFS")
  const problems = topicProblems[resolve(activeTag)] || []

  return (
    <Card className="p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Brain size={15} className="text-accent-purple" />
        <h3 className="text-text-primary text-sm font-semibold">AI Coach</h3>
      </div>
      <p className="text-text-faint text-[11px] mt-0.5">Personalised recommendations</p>

      <div className="mt-3 p-3 rounded-lg bg-bg-input">
        <p className="text-text-secondary text-xs leading-relaxed">
          {weakTopics.length
            ? `Strengthen your ${weakTopics[0].topic} skills. Start with these topics:`
            : "Strengthen your Graph skills. Start with these topics:"}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                activeTag === tag
                  ? "bg-accent-purple text-white border-accent-purple"
                  : "bg-accent-purple/10 text-accent-purple border-accent-purple/30 hover:bg-accent-purple/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex-1 space-y-2">
        <p className="text-text-faint text-[10px] uppercase tracking-wide font-medium">
          {activeTag} — Recommended Problems
        </p>
        {problems.map((prob, i) => (
          <a
            key={i}
            href={prob.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-lg bg-bg-input hover:bg-border-subtle transition-colors group"
          >
            <span className="text-text-faint text-[10px] w-4 shrink-0">{i + 1}.</span>
            <p className="text-text-secondary text-xs flex-1 group-hover:text-text-primary transition-colors truncate">
              {prob.title}
            </p>
            <ExternalLink size={11} className="text-text-faint group-hover:text-accent-purple transition-colors shrink-0" />
          </a>
        ))}
      </div>

      <p className="text-text-faint text-[10px] text-center mt-3">Powered by AI ✨</p>
    </Card>
  )
}

export default AiCoachCard
