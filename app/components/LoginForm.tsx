"use client";

import { useActionState, useEffect } from "react";
import { login } from "@/app/actions";
import Link from "next/link";

const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, null);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.status === "success") {
      alert(JSON.stringify(state.data));
    } else if (state.status === "error") {
      alert(state.error);
    }
  }, [state]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
        <form action={formAction}>
          <div className="flex flex-col gap-3">
            <h1 className="flex text-xl font-serif justify-center">ログイン</h1>
            <div className="flex flex-col">
              <label htmlFor="email">メールアドレス</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={pending}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">パスワード</label>
              <input
                id="password"
                name="password"
                type="password"
                required
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
                {pending ? "ログイン中..." : "ログインする"}
              </button>
            </div>
            {state?.error && (
              <div className="error-message">
                <p>エラーが発生しました：{state.error}</p>
              </div>
            )}
          </div>
        </form>
        <div className="mt-2 flex justify-center">
          <button className="rounded-lg py-2 px-3 border border-gray-200 text-lg font-serif text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
            <Link href={`/register`}>新規登録</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
