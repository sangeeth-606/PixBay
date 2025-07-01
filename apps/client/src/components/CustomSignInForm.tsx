import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";

interface CustomSignInFormProps {
  hideHeading?: boolean;
}

const CustomSignInForm: React.FC<CustomSignInFormProps> = ({ hideHeading }) => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  // Google sign-in handler (restored to match Clerk prebuilt flow)
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      await signIn.authenticateWithPopup({
        strategy: "oauth_google",
      });
      await setActive({ session: signIn.createdSessionId });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  // Email/password sign-in handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const result = await signIn?.create({ identifier: email, password });
      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        // Optionally, close modal or redirect here
      } else if (result?.status === "needs_first_factor") {
        setError("Additional authentication required.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Sign in failed");
    }
    setLoading(false);
  };

  // Sign up and forgot password handlers (show info for now)
  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setInfo(
      "Sign up flow is not implemented in this modal. Please use the main sign up page.",
    );
  };
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setInfo(
      "Password reset flow is not implemented in this modal. Please use the main reset page.",
    );
  };

  return (
    <>
      {/* Only render heading/subheading if not hidden */}
      {!hideHeading && (
        <>
          <h2 className="text-lg font-medium mb-1 text-gray-900 tracking-tight">
            Sign in to Pixbay
          </h2>
          <p className="text-gray-400 mb-5 text-xs font-normal">
            Welcome back! To continue, sign in to your account
          </p>
        </>
      )}
      {/* Social login */}
      <button
        type="button"
        className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-md font-medium flex items-center justify-center mb-3 hover:bg-gray-100 transition text-sm shadow-sm"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        {/* Google icon */}
        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
          <g>
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.77-5.62C33.64 3.61 29.28 1.5 24 1.5 14.98 1.5 7.06 7.44 3.68 15.09l6.91 5.37C12.13 14.13 17.56 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.59C43.93 37.13 46.1 31.36 46.1 24.55z"
            />
            <path
              fill="#FBBC05"
              d="M10.59 28.46A14.48 14.48 0 0 1 9.5 24c0-1.56.27-3.07.76-4.46l-6.91-5.37A23.93 23.93 0 0 0 0 24c0 3.77.9 7.34 2.5 10.46l8.09-6z"
            />
            <path
              fill="#EA4335"
              d="M24 46.5c6.48 0 11.93-2.14 15.9-5.84l-7.19-5.59c-2 1.41-4.56 2.25-8.71 2.25-6.44 0-11.87-4.63-13.41-10.77l-8.09 6C7.06 40.56 14.98 46.5 24 46.5z"
            />
          </g>
        </svg>
        Sign in with Google
      </button>
      {/* Divider mimic */}
      <div className="flex items-center my-3 w-full">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>
      {/* Email/password form */}
      <form onSubmit={handleSignIn} className="space-y-2 w-full">
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white placeholder-gray-400 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white placeholder-gray-400 transition"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        {info && <div className="text-blue-500 text-xs mt-1">{info}</div>}
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded-md font-medium hover:bg-emerald-600 transition text-sm shadow disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {/* Links mimic */}
      <div className="flex justify-between mt-4 w-full text-xs text-gray-400">
        <span>
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="text-emerald-600 hover:underline"
            onClick={handleSignUp}
          >
            Sign up
          </a>
        </span>
        <a
          href="#"
          className="text-emerald-600 hover:underline"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </a>
      </div>
    </>
  );
};

export default CustomSignInForm;
