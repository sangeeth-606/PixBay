import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

interface CustomSignInFormProps {
  hideHeading?: boolean;
}

const CustomSignInForm: React.FC<CustomSignInFormProps> = ({ hideHeading }) => {
  const { signIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isSignInLoaded) return;
    setError("");
    setLoading(true);
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: unknown) {
      setError(
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message ||
          "Google sign-in failed",
      );
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  const handleSignIn = async () => {
    if (!isSignInLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn?.create({ identifier: email, password });
      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err?.errors?.[0]?.message || "Sign in failed");
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!isSignUpLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp?.create({ emailAddress: email, password });
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      // Handle verification flow if needed
    } catch (err: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err?.errors?.[0]?.message || "Sign up failed");
    }
    setLoading(false);
  };

  return (
    <>
      {!hideHeading && (
        <>
          <h2 className="text-lg font-medium mb-1 text-gray-900 tracking-tight">
            {isSignUp ? "Create an account" : "Sign in to Pixbay"}
          </h2>
          <p className="text-gray-400 mb-5 text-xs font-normal">
            {isSignUp
              ? "Welcome! Please fill in your details to get started."
              : "Welcome back! To continue, sign in to your account"}
          </p>
        </>
      )}
      <button
        type="button"
        className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-md font-medium flex items-center justify-center mb-3 hover:bg-gray-100 transition text-sm shadow-sm"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
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
        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
      </button>
      <div className="flex items-center my-3 w-full">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 w-full">
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
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 rounded-md font-medium hover:bg-emerald-600 transition text-sm shadow disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Processing..." : isSignUp ? "Sign up" : "Sign in"}
        </button>
      </form>
      <div className="flex justify-between mt-4 w-full text-xs text-gray-400">
        <span>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <a
            href="#"
            className="text-emerald-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </a>
        </span>
        {!isSignUp && (
          <a href="#" className="text-emerald-600 hover:underline">
            Forgot password?
          </a>
        )}
      </div>
    </>
  );
};

export default CustomSignInForm;
