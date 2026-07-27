"use client";

import { startTransition, useActionState, useState } from "react";
import { register } from "@/app/actions";
import Link from "next/link";
import { buttonConfig, headingConfig } from "@/app/constants/ui";
import { userFormConfig } from "@/app/constants/form";
import { validationConfig } from "@/app/constants/validation";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, action, pending] = useActionState<{ error: string | null } | null>(
    async () => {
      const fd = new FormData();
      fd.append("username", username.trim());
      fd.append("email", email.trim());
      fd.append("password", password);
      return await register(null, fd);
    },
    null,
  );

  const handleSubmit = () => {
    // バリデーション
    if (!username.trim()) {
      setError(validationConfig.user.usernameRequired);
      setUsername("");
      return;
    }
    if (!email.trim()) {
      setError(validationConfig.user.emailRequired);
      setEmail("");
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(validationConfig.user.emailInvalid);
      setEmail("");
      return;
    }
    if (!password) {
      setError(validationConfig.user.passwordRequired);
      return;
    }
    if (password.length < 6 || password.length > 32) {
      setError(validationConfig.user.passwordLength);
      setPassword("");
      return;
    }

    setError(null);
    startTransition(() => action());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-3">
              <h1 className="flex text-xl font-serif justify-center">
                {headingConfig.register}
              </h1>
              <div className="flex flex-col">
                <label htmlFor="username">{userFormConfig.userName}</label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  disabled={pending}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">{userFormConfig.email}</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  disabled={pending}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">{userFormConfig.password}</label>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  disabled={pending}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg py-2 px-3 bg-gray-900 text-gray-100 text-lg font-serif shadow-md hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                >
                  {pending
                    ? buttonConfig.registerPending
                    : buttonConfig.register}
                </button>
              </div>
              {(error || state?.error) && (
                <p className="text-xs text-red-500 text-center">
                  {error || state?.error}
                </p>
              )}
            </div>
          </form>
          <div className="mt-2 flex justify-center">
            <button className="rounded-lg py-2 px-3 border border-gray-200 text-lg font-serif text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
              <Link href={`/login`}>{buttonConfig.backToLogin}</Link>
            </button>
          </div>
        </div>
      </div>
      <LoadingOverlay visible={pending} />
    </>
  );
};

export default RegisterForm;
