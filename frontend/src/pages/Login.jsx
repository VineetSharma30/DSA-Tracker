import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Card, Button} from '../components/ui/Ui'
import { useNavigate } from 'react-router-dom'

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Login attempt:", { email, password });
	};

	const platforms = [
		{
			name: "LeetCode",
			color: "text-platform-leetcode border-platform-leetcode",
		},
		{
			name: "Codeforces",
			color: "text-platform-codeforces border-platform-codeforces",
		},
		{
			name: "CodeChef",
			color: "text-platform-codechef border-platform-codechef",
		},
		{
			name: "HackerRank",
			color: "text-platform-hackerrank border-platform-hackerrank",
		},
	];

	return (
		<div className="min-h-screen bg-bg-base flex items-center px-16 lg:gap-70">
			{/* Left: hero */}
			<div className="flex-1 max-w-lg">
				<div className="flex items-center gap-3 mb-20 pb-10">
					<div className="w-9 h-9 rounded-lg bg-linear-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white font-bold text-xs">
						{"< >"}
					</div>
					<span className="text-text-primary font-extrabold">DSA Tracker</span>
				</div>
				<div className="relative h-80 pt-14 mb-30">
          {/* <img src="../assets/Ellipse.svg" alt="-" className="absolute w-full h-full" /> */} {/* Not working */}
					<h1 className="text-5xl font-extrabold text-text-primary leading-tight">
						Master DSA.
					</h1>
					<h1 className="text-5xl font-extrabold text-accent-purple leading-tight mb-4">
						Track Everything.
					</h1>
					<div className="text-text-muted text-sm leading-relaxed mb-10">
						<p> Your unified dashboard for LeetCode, Codeforces, </p>
						<p> CodeChef & HackerRank. Spot weak areas. </p>
						<p> Crush contests. Get AI-powered insights. </p>
					</div>
				</div>

				<div className="flex gap-3">
					{platforms.map((p) => (
						<span
							key={p.name}
							className={`px-3 py-1.5 rounded-pill border text-xs font-medium bg-accent-russianBlack ${p.color}`}
						>
							{p.name}
						</span>
					))}
				</div>
			</div>

			{/* Right: auth card */}
			<Card className="w-110 p-10 mt-2">
				<h2 className="text-2xl font-bold text-text-primary mb-1">
					Welcome back
				</h2>
				<p className="text-text-muted text-sm mb-6">
					Sign in to continue your DSA journey
				</p>

				<form onSubmit={handleSubmit} className="space-y-2">
					<div>
						<label className="text-text-secondary text-xs font-medium block mb-2">
							Email Address
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="user@example.com"
							className="w-full bg-bg-input border border-border-DEFAULT rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple"
						/>
					</div>

					<div>
						<label className="text-text-secondary text-xs font-medium block mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••••••"
							className="w-full bg-bg-input border border-border-DEFAULT rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent-purple"
						/>
					</div>

					<p className=" px-1 text-right text-xs text-accent-purple cursor-pointer">
						Forgot password?
					</p>

					<Button
						variant="primary"
						size="lg"
						className="w-full drop-shadow-accent-purple drop-shadow-sm"
					>
						Sign In →
					</Button>
				</form>

				<div className="flex items-center gap-3 my-6">
					<div className="flex-1 h-px bg-border-subtle" />
					<span className="text-text-faint text-xs">or continue with</span>
					<div className="flex-1 h-px bg-border-subtle" />
				</div>

				<div className="space-y-3">
					<Button variant="secondary" size="lg" className="w-full">
						Continue with Google
					</Button>
					{/* <Button
						variant="secondary"
						size="lg"
						className="w-full flex items-center justify-center gap-2"
					>
						<FaGithub size={16} /> Continue with GitHub
					</Button> */}
				</div>

				<p className="text-center text-xs text-text-muted mt-6">
					Don't have an account?{" "}
					<span
					className="text-accent-purple cursor-pointer hover:underline"
					onClick={() => navigate("/register")}
					>
					Create one free →
					</span>
				</p>
			</Card>
		</div>
	);
}

export default Login;
