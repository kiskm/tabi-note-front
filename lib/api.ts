import type { Trip, TripDetail } from "./types";

const API_BASE = process.env.API_URL ?? "http://localhost:8000";

export const getTrips = async (): Promise<Trip[]> => {
  const res = await fetch(`${API_BASE}/trips`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
};

export const getTrip = async (id: number): Promise<TripDetail> => {
  const res = await fetch(`${API_BASE}/trips/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
};
