import type { Trip, TripDetail } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function getTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_BASE}/trips`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}

export async function getTrip(id: number): Promise<TripDetail> {
  const res = await fetch(`${API_BASE}/trips/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch trip');
  return res.json();
}
