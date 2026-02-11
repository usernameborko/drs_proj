import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../../api/users/UserAPI";
import type { RegisterDTO } from "../../models/user/RegisterDTO";
import { validateRegister, type RegisterErrors } from "../../types/validation/registerValidation";

interface InputFieldProps {
  name: keyof RegisterDTO;
  label: string;
  type?: string;
  placeholder?: string;
  borderColor?: string;
  focusColor?: string;
  value: string;
  showPassword?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword?: () => void;
  error?: string;
  submitted?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  borderColor = "border-indigo-200",
  focusColor = "focus:border-indigo-500",
  value,
  showPassword = false,
  onChange,
  toggleShowPassword,
  error,
  submitted,
}) => {
  const errorClass = "block min-h-[1rem] text-xs mt-1 transition-all duration-200";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {type === "password" ? (
        <div className="relative">
          <input
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-transparent px-2 py-1.5 border-b-2 ${borderColor} ${focusColor}
                       outline-none transition-colors duration-300 placeholder:text-gray-400 pr-14`}
            autoComplete="new-password"
          />
          {toggleShowPassword && (
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-medium
                         text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-transparent px-2 py-1.5 border-b-2 ${borderColor} ${focusColor}
                     outline-none transition-colors duration-300 placeholder:text-gray-400
                     ${type === "date" ? "cursor-pointer" : ""}`}
        />
      )}
      <span
        className={`${errorClass} ${
          submitted && error ? "text-red-500" : "text-transparent"
        }`}
      >
        {error || "​"}
      </span>
    </div>
  );
};

export const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterDTO>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    gender: "",
    country: "",
    street: "",
    number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    const validationErrors = validateRegister(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    setIsLoading(true);
    try {
      await userAPI.register(form);
      navigate("/profile");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setServerError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-8 bg-white/95 backdrop-blur-sm shadow-2xl border border-purple-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          Create Account
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Fill in your details to get started
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1"
      >
        <InputField
          name="first_name"
          label="First Name"
          placeholder="John"
          borderColor="border-cyan-200"
          focusColor="focus:border-cyan-500"
          value={form.first_name}
          onChange={handleChange}
          error={errors.first_name}
          submitted={submitted}
        />
        <InputField
          name="last_name"
          label="Last Name"
          placeholder="Doe"
          borderColor="border-cyan-200"
          focusColor="focus:border-cyan-500"
          value={form.last_name}
          onChange={handleChange}
          error={errors.last_name}
          submitted={submitted}
        />

        <InputField
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          submitted={submitted}
        />
        <InputField
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          error={errors.password}
          submitted={submitted}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date of Birth
          </label>
          <input
            name="date_of_birth"
            type="date"
            value={form.date_of_birth || ""}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1.5 border-b-2 border-emerald-200 
                       focus:border-emerald-500 outline-none transition-colors duration-300 cursor-pointer"
          />
          <span
            className={`block min-h-[1rem] text-xs mt-1 transition-all duration-200 ${
              submitted && errors.date_of_birth
                ? "text-red-500"
                : "text-transparent"
            }`}
          >
            {errors.date_of_birth || "​"}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="w-full bg-transparent px-2 py-1.5 border-b-2 border-emerald-200 
                       focus:border-emerald-500 outline-none transition-colors duration-300 cursor-pointer"
          >
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <span
            className={`block min-h-[1rem] text-xs mt-1 transition-all duration-200 ${
              submitted && errors.gender ? "text-red-500" : "text-transparent"
            }`}
          >
            {errors.gender || "​"}
          </span>
        </div>

        <InputField
          name="country"
          label="Country"
          placeholder="Serbia"
          borderColor="border-fuchsia-200"
          focusColor="focus:border-fuchsia-500"
          value={form.country || ""}
          onChange={handleChange}
          error={errors.country}
          submitted={submitted}
        />
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <InputField
              name="street"
              label="Street"
              placeholder="Main Street"
              borderColor="border-fuchsia-200"
              focusColor="focus:border-fuchsia-500"
              value={form.street || ""}
              onChange={handleChange}
              error={errors.street}
              submitted={submitted}
            />
          </div>
          <div>
            <InputField
              name="number"
              label="No."
              placeholder="42"
              borderColor="border-fuchsia-200"
              focusColor="focus:border-fuchsia-500"
              value={form.number || ""}
              onChange={handleChange}
              error={errors.number}
              submitted={submitted}
            />
          </div>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 
                       hover:from-violet-600 hover:to-indigo-600
                       text-white rounded-xl py-3 font-semibold
                       transition-all duration-300 transform hover:scale-[1.01]
                       disabled:opacity-70 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-gray-600 text-sm mt-5">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-500 hover:text-indigo-700 font-medium hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};