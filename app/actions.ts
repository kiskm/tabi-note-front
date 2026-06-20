"use server";

import { getAuthHeader } from "@/lib/auth";
import { refresh } from "next/cache";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE = process.env.API_URL ?? "http://localhost:8000";

// 旅行を追加
export const createTrip = async (formData: FormData) => {
  const body = {
    title: formData.get("title"),
    area: formData.get("area") || undefined,
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
    throw new Error("Failed to create trip");
  }
  refresh();
};

export const updateTripStatus = async (id: string, status: "want" | "done") => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update trip");
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
  if (!res.ok) throw new Error("Failed to create spot");
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
  if (!res.ok) throw new Error("Failed to create expense");
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
  if (!res.ok) throw new Error("Failed to update spot");
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
  if (!res.ok) throw new Error("Failed to update expense");
  revalidatePath(`/trips/${tripId}`);
};

// 旅行を削除
export const deleteTrip = async (id: string) => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete trip");
  revalidatePath("/");
};

// スポットチェックの切り替え
export const toggleSpotChecked = async (spotId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}/check`, {
    method: "PATCH",
    headers: await getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to toggle spot");
  revalidatePath(`/trips/${tripId}`);
};

// スポットを削除
export const deleteSpot = async (spotId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete spot");
  revalidatePath(`/trips/${tripId}`);
};

// 支出を削除
export const deleteExpense = async (expenseId: number, tripId: string) => {
  const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete expense");
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

  const { accessToken } = await res.json();
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: "/",
  });

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

  const { accessToken } = await res.json();
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: "/",
  });

  redirect("/");
};

// ログアウト
export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  redirect("/login");
};
