import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setError("")
    register({
      username: form.username || "New Coder",
      email: form.email || "coder@example.com"
    })
    navigate("/dashboard")
  }

  const handleGoogleSignup = () => {
    register({
      username: "Google User",
      email: "google_user@example.com"
    })
    navigate("/dashboard")
  }

  const platforms = [
    { name: "LeetCode",   color: "text-platform-leetcode border-platform-leetcode" },
    { name: "Codeforces", color: "text-platform-codeforces border-platform-codeforces" },
    { name: "CodeChef",   color: "text-platform-codechef border-platform-codechef" },
    { name: "HackerRank", color: "text-platform-hackerrank border-platform-hackerrank" },
  ]

  return (
		<div className="min-h-screen bg-bg-base flex items-center px-16 lg:gap-70">
      {/* Left hero — same as Login */}
      <div className="flex-1 max-w-lg">
        <div className="flex items-center gap-3 mb-20 pb-10">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white font-bold text-xs">
            {"<>"}
          </div>
          <span className="text-text-primary font-extrabold">DSA Tracker</span>
        </div>
        <div className="relative h-80 pt-14 mb-30">
            {/* <img src="../assets/Ellipse.svg" alt="-" className="absolute w-full h-full" /> */} {/* Not working */}
            <h1 className="text-5xl font-extrabold text-text-primary leading-tight">
                    Start your
            </h1>
            <h1 className="text-5xl font-extrabold text-accent-purple leading-tight mb-4">
                DSA journey.
            </h1>
			<div className="text-text-muted text-sm leading-relaxed mb-10">
                <p> Join thousands of competitive programmers tracking their progress </p>
                <p> across LeetCode, Codeforces, CodeChef & HackerRank. </p>
			</div>
		</div>


        <div className="flex gap-3">
          {platforms.map((p) => (
            <span
              key={p.name}
              className={`px-3 py-1.5 rounded-pill border text-xs font-medium ${p.color}`}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Right: register card */}
      <Card className="w-110 p-10">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Create account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="user1234"
              className="w-full bg-bg-input border border-border-DEFAULT rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full bg-bg-input border border-border-DEFAULT rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full bg-bg-input border border-border-DEFAULT rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
            />
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-text-secondary text-xs font-medium block mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className="w-full bg-bg-input border border-border-DEFAULT rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple transition-colors"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-status-hard text-xs font-medium bg-status-hard/10 border border-status-hard/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button variant="primary" size="lg" className="w-full mt-2">
            Create Account →
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-text-faint text-xs">or sign up with</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full cursor-pointer"
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-xs text-text-muted mt-5">
          Already have an account?{" "}
          <span
            className="text-accent-purple cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Sign in →
          </span>
        </p>
      </Card>
    </div>
  )
}

export default Register