"use server";

import { getAuthHeader } from "@/lib/auth";
import { refresh } from "next/cache";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { validationConfig } from "@/app/constants/validation";

const API_BASE = process.env.API_URL ?? "http://localhost:8000";

// Server Actionをまたぐとエラーのクラス情報は失われるため、
// メッセージ自体をそのまま表示できる文言にして投げる
const parseErrorMessage = async (res: Response): Promise<string | null> => {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message) && typeof data.message[0] === "string") {
      return data.message[0];
    }
  } catch {
    // レスポンスがJSONでない場合はフォールバックに委ねる
  }
  return null;
};

const throwApiError = async (res: Response, fallback: string): Promise<never> => {
  const message = await parseErrorMessage(res);
  throw new Error(message ?? fallback);
};

// 旅行を追加
export const createTrip = async (formData: FormData) => {
  const body = {
    title: formData.get("title"),
    area: formData.getAll("area"),
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
    status: "want",
  };
  const res = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await throwApiError(res, validationConfig.createError);
  }
  refresh();
};

// 旅行を更新
export const updateTrip = async (
  tripId: string,
  data: {
    title?: string;
    area?: string[];
    startDate?: string;
    endDate?: string;
    budget?: number;
    status?: "want" | "done";
  },
) => {
  const res = await fetch(`${API_BASE}/trips/${tripId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    await throwApiError(res, validationConfig.updateError);
  }
  revalidatePath(`/trips/${tripId}`);
};

// 旅行のステータスを変更
export const updateTripStatus = async (id: string, status: "want" | "done") => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) await throwApiError(res, validationConfig.updateError);
  revalidatePath("/");
};

// スポットを追加
export const createSpot = async (tripId: string, formData: FormData) => {
  const body = {
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    memo: formData.get("memo") || undefined,
  };
  const res = await fetch(`${API_BASE}/trips/${tripId}/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) await throwApiError(res, validationConfig.createError);
  revalidatePath(`/trips/${tripId}`);
};

// 支出を追加
export const createExpense = async (tripId: string, formData: FormData) => {
  const body = {
    category: formData.get("category"),
    amount: Number(formData.get("amount")),
    memo: formData.get("memo") || undefined,
  };
  const res = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) await throwApiError(res, validationConfig.createError);
  revalidatePath(`/trips/${tripId}`);
};

// スポットを更新
export const updateSpot = async (
  spotId: number,
  tripId: string,
  data: { name?: string; category?: string; memo?: string },
) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwApiError(res, validationConfig.saveError);
  revalidatePath(`/trips/${tripId}`);
};

// 支出を更新
export const updateExpense = async (
  expenseId: number,
  tripId: string,
  data: { category?: string; amount?: number; memo?: string },
) => {
  const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwApiError(res, validationConfig.saveError);
  revalidatePath(`/trips/${tripId}`);
};

// 旅行を削除
export const deleteTrip = async (id: string) => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) await throwApiError(res, validationConfig.deleteError);
  revalidatePath("/");
};

// スポットチェックの切り替え
export const toggleSpotChecked = async (spotId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}/check`, {
    method: "PATCH",
    headers: await getAuthHeader(),
  });
  if (!res.ok) await throwApiError(res, validationConfig.updateError);
  revalidatePath(`/trips/${tripId}`);
};

// スポットを削除
export const deleteSpot = async (spotId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) await throwApiError(res, validationConfig.deleteError);
  revalidatePath(`/trips/${tripId}`);
};

// 支出を削除
export const deleteExpense = async (expenseId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) await throwApiError(res, validationConfig.deleteError);
  revalidatePath(`/trips/${tripId}`);
};

// 参加者を追加
export const createParticipant = async (tripId: string, formData: FormData) => {
  const body = {
    name: formData.get("name"),
    email: formData.get("email") || undefined,
  };
  const res = await fetch(`${API_BASE}/trips/${tripId}/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) await throwApiError(res, validationConfig.createError);
  revalidatePath(`/trips/${tripId}`);
};

// 参加者を更新
export const updateParticipant = async (
  participantId: number,
  tripId: string,
  data: { name?: string; email?: string },
) => {
  const res = await fetch(`${API_BASE}/participants/${participantId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(data),
  });
  if (!res.ok) await throwApiError(res, validationConfig.saveError);
  revalidatePath(`/trips/${tripId}`);
};

// 参加者を削除
export const deleteParticipant = async (participantId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/participants/${participantId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) await throwApiError(res, validationConfig.deleteError);
  revalidatePath(`/trips/${tripId}`);
};

// ログイン
export const login = async (prevState: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    return { status: "error", data: null, error };
  }

  const { accessToken, username } = await res.json();
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
  cookieStore.set("accessToken", accessToken, cookieOptions);
  cookieStore.set("username", username, cookieOptions);

  redirect("/");
};

// ユーザ登録
export const register = async (prevState: any, formData: FormData) => {
  const body = {
    username: formData.get("username"),
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.text();
    return { status: "error", data: null, error };
  }

  const { accessToken, username } = await res.json();
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
  cookieStore.set("accessToken", accessToken, cookieOptions);
  cookieStore.set("username", username, cookieOptions);

  redirect("/");
};

// ログアウト
export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("username");
  redirect("/login");
};
