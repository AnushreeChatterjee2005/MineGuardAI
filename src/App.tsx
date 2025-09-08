import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Dashboard } from "./Dashboard";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster theme="dark" />
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <LoginPage />
      </Unauthenticated>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-red-950 to-black">
      {/* Left Side - Branding */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg">
          <div className="mb-8">
            <img src="/MineGuardAI Logo - Transparent Background.png" alt="MineGuardAI Logo" className="w-28 h-28 mb-6" />
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight text-shadow-subtle">MineGuardAI</h1>
            <p className="text-red-300 text-xl font-light mb-6 tracking-wide">AI-Powered Rockfall Prediction</p>
          </div>
            <p className="text-red-200/90 text-lg font-normal leading-relaxed max-w-lg">
              Advanced AI technology for predicting and preventing rockfall incidents in mining operations. 
              <span className="block mt-2 text-red-300/80 text-base font-light">Secure access for mine safety professionals.</span>
            </p>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-red-950/30 border border-red-800 rounded-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-red-300/80 font-light">Sign in to access your dashboard</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
