import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth/AuthAPI";
import { validateLogin, type LoginErrors } from "../../types/validation/loginValidation";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    const validationErrors = validateLogin({ email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    setIsLoading(true);

    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem("access_token", data.access_token);
      window.dispatchEvent(new Event("login"));
      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      setServerError("Login failed. Please check your credentials.");
      setEmail("");
      setPassword("");
      setSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const errorClass = "block min-h-[1.1rem] text-xs mt-1 transition-all duration-200";

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl p-8 bg-white/95 backdrop-blur-sm shadow-2xl border border-purple-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          Welcome Back
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent px-3 py-2 border-b-2 border-indigo-200 
                       focus:border-indigo-500 outline-none transition-colors duration-300
                       placeholder:text-gray-400"
            placeholder="your@email.com"
            autoComplete="email"
          />
          <span className={`${errorClass} ${submitted && errors.email ? "text-red-500" : "text-transparent"}`}>
            {errors.email || "​"}
          </span>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-3 py-2 border-b-2 border-indigo-200 
                         focus:border-indigo-500 outline-none transition-colors duration-300
                         placeholder:text-gray-400 pr-16"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium
                         text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <span className={`${errorClass} ${submitted && errors.password ? "text-red-500" : "text-transparent"}`}>
            {errors.password || "​"}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 
                     hover:from-violet-600 hover:to-indigo-600
                     text-white rounded-xl py-3 font-semibold
                     transition-all duration-300 transform hover:scale-[1.02]
                     disabled:opacity-70 disabled:cursor-not-allowed
                     shadow-lg hover:shadow-xl cursor-pointer mt-6"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don't have an account?{" "}
        <Link 
          to="/register" 
          className="text-indigo-500 hover:text-indigo-700 font-medium hover:underline transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};