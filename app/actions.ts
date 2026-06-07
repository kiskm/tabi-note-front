"use server";

import { refresh } from "next/cache";
import { revalidatePath } from "next/cache";

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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  refresh();
};

export const updateTripStatus = async (id: number, status: "want" | "done") => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update trip");
  revalidatePath("/");
};

export const createSpot = async (tripId: number, formData: FormData) => {
  const body = {
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    memo: formData.get("memo") || undefined,
  };
  const res = await fetch(`${API_BASE}/trips/${tripId}/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create spot");
  revalidatePath(`/trips/${tripId}`);
};

export const createExpense = async (tripId: number, formData: FormData) => {
  const body = {
    category: formData.get("category"),
    amount: Number(formData.get("amount")),
    memo: formData.get("memo") || undefined,
  };
  const res = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  revalidatePath(`/trips/${tripId}`);
};

export const updateSpot = async (
  spotId: number,
  tripId: number,
  data: { name?: string; category?: string; memo?: string },
) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update spot");
  revalidatePath(`/trips/${tripId}`);
};

export const updateExpense = async (
  expenseId: number,
  tripId: number,
  data: { category?: string; amount?: number; memo?: string },
) => {
  const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  revalidatePath(`/trips/${tripId}`);
};

export const deleteTrip = async (id: number) => {
  const res = await fetch(`${API_BASE}/trips/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete trip");
  revalidatePath("/");
};

export const toggleSpotChecked = async (spotId: number, tripId: number) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}/check`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to toggle spot");
  revalidatePath(`/trips/${tripId}`);
};

export const deleteSpot = async (spotId: number, tripId: number) => {
  const res = await fetch(`${API_BASE}/spots/${spotId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete spot");
  revalidatePath(`/trips/${tripId}`);
};

export const deleteExpense = async (expenseId: number, tripId: number) => {
  const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  revalidatePath(`/trips/${tripId}`);
};
