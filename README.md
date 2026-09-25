# ⚡ DSA Tracker

A modern, unified analytics and progress tracking dashboard for competitive programmers and software engineers practicing Data Structures & Algorithms across **LeetCode**, **Codeforces**, **CodeChef**, and **HackerRank**.

---

## 🚀 Features

- **📊 Comprehensive Dashboard**
  - Instant snapshot of total solved problems, accuracy rate, active streak, and overall DSA score.
  - Real-time rating cards with trend badges for LeetCode, Codeforces, CodeChef, and HackerRank.
  - Quick platform filtering to inspect specific platform performance.

- **📈 Visual Analytics & Charts**
  - **Consistency Heatmap**: Visualize daily coding streaks and problem activity.
  - **Problems Over Time**: Daily and weekly progression charts.
  - **Difficulty Breakdown**: Easy, Medium, and Hard distribution graphs.
  - **Topic Mastery Radar**: Spot strength and weakness across Arrays, Trees, Graphs, DP, etc.
  - **Weekly Velocity & Rating History**: Track rating trajectory and practice tempo.

- **📝 Problem Management**
  - Interactive problem list with instant search and platform/difficulty filtering.
  - **Add Problem Modal**: Add problems with title, difficulty, topic tags, and submission notes.
  - Client-side persistence via `localStorage`.

- **🎯 Goals & Milestones**
  - Create and track custom milestones (Problem count, Rating targets, Topics).
  - Visual progress bars, deadline indicators, and completion badges.

- **🏆 Contest Tracker**
  - Upcoming contests calendar for LeetCode, Codeforces, CodeChef, and HackerRank.
  - Interactive contest registration toggle with persistent state.
  - Recent contest participation and rating change history.

- **👤 Profile & Settings**
  - Editable user profile with customizable handles, avatar initial, and bio.
  - Granular notification preferences and privacy controls with instant feedback toasts.
  - Demo authentication system with one-click guest access or credentials.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Storage**: Browser `localStorage` (Zero external backend dependency required)

---

## 📂 Project Structure

```text
DSA-Tracker/
├── README.md
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
├── index.html
└── src/
    ├── App.jsx                         # Application routing & layouts
    ├── main.jsx                        # Vite app entry point
    ├── index.css                       # Global styles & Tailwind imports
    ├── context/
    │   └── AuthContext.jsx             # Client-side auth & user session state
    ├── data/
    │   └── mockData.js                 # Initial mock metrics, problems & contests
    ├── layouts/
    │   └── AppLayout.jsx               # Sidebar + Topbar wrapper layout
    ├── pages/
    │   ├── Login.jsx                   # Sign in & demo login
    │   ├── Register.jsx                # Sign up page
    │   ├── Dashboard.jsx               # Main stats & metrics overview
    │   ├── Problems.jsx                # Problem list, search & modal
    │   ├── Analytics.jsx               # Deep-dive charts & radar
    │   ├── Goals.jsx                   # Milestones & targets
    │   ├── Contests.jsx                # Contest calendar & registration
    │   ├── Profile.jsx                 # Profile view & edit modal
    │   └── Settings.jsx                # Account, notifications & privacy
    ├── components/
    │   ├── charts/                     # Reusable Recharts components
    │   ├── dashboard/                  # Topbar, stat cards & modals
    │   ├── sidebar/                    # Navigation sidebar & streak card
    │   └── ui/                         # Reusable Button, Card, Badge, Modal
    └── services/
        ├── api.js                      # Standalone client mock API service
        └── auth.js                     # Standalone client mock auth service
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VineetSharma30/DSA-Tracker.git
   cd DSA-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Authentication Notes

The frontend is configured to run **completely standalone** without needing a backend server:
- Click **"⚡ Quick Demo Login (Skip)"** on the login page to immediately enter the dashboard.
- Any email/password combination will also successfully log you in and persist your session in `localStorage`.
- Use the **Logout** button in the top navigation bar to return to the authentication screen.

---

## 📦 Production Build

To build the static application bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 💾 Full-Stack / Backend Archive

The full-stack Flask backend (SQLAlchemy models, migrations, and routes) is safely preserved on the `backup-changes` git branch and archived in `DSA-Tracker-backup-changes.zip`. To inspect or switch to the backend work:

```bash
git checkout backup-changes
```
