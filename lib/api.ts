import type { Trip, TripDetail } from "@/lib/types";
import { getAuthHeader } from "@/lib/auth";

const API_BASE = process.env.API_URL ?? "http://localhost:8000";

// 旅行の全件表示
export const getTrips = async (): Promise<Trip[]> => {
  const res = await fetch(`${API_BASE}/trips`, {
    cache: "no-store",
    headers: await getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
};

// 旅行の一件表示
export const getTrip = async (id: number): Promise<TripDetail> => {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    cache: "no-store",
    headers: await getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
};
