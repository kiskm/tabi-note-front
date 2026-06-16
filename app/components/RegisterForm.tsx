"use client";

import { useActionState, useEffect } from "react";
import { register } from "../actions";

const RegisterForm = () => {
  const [state, formAction, pending] = useActionState(register, null);

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
          <label htmlFor="username">ユーザー名</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            disabled={pending}
          />
        </div>

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
          {pending ? "登録中..." : "登録する"}
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

export default RegisterForm;
