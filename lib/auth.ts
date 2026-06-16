import { cookies } from "next/headers";

// アクセストークンの取得（ログイン確認）
export const getAuthHeader = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
