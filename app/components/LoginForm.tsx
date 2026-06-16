"use client";

import { useActionState, useEffect } from "react";
import { login } from "../actions";

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
    <>
      <form action={formAction}>
        <div className="form-field">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={pending}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={pending}
          />
        </div>

        <button type="submit" disabled={pending} className="submit-button">
          {pending ? "ログイン中..." : "ログインする"}
        </button>

        {state?.error && (
          <div className="error-message">
            <p>エラーが発生しました：{state.error}</p>
          </div>
        )}
      </form>
    </>
  );
};

export default LoginForm;
