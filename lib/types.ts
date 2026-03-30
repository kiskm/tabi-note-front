export type TripStatus = 'want' | 'done';
export type ExpenseCategory = 'transport' | 'hotel' | 'food' | 'other';

export type Spot = {
  id: number;
  name: string;
  category: string | null;
  memo: string | null;
  lat: number | null;
  lng: number | null;
  imageUrl: string | null;
  tripId: number;
};

export type Expense = {
  id: number;
  category: ExpenseCategory;
  amount: number;
  memo: string | null;
  tripId: number;
};

export type Trip = {
  id: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  area: string | null;
  status: TripStatus;
  budget: number | null;
};

export type TripDetail = Trip & {
  spots: Spot[];
  expenses: Expense[];
};
