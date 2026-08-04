export type TripStatus = "want" | "done";
export type ExpenseCategory = "transport" | "hotel" | "food" | "other";

export type Spot = {
  id: number;
  name: string;
  category: string | null;
  memo: string | null;
  lat: number | null;
  lng: number | null;
  imageUrl: string | null;
  checked: boolean;
  tripId: string;
};

export type Expense = {
  id: number;
  category: ExpenseCategory;
  amount: number;
  memo: string | null;
  tripId: string;
  paidByParticipantId: number | null;
  paidBy: Participant | null;
  splitParticipants: Participant[];
};

export type Participant = {
  id: number;
  name: string;
  email: string | null;
  tripId: string;
  userId: string | null;
};

export type Trip = {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  area: string[];
  status: TripStatus;
  budget: number | null;
  userId: string;
  spots: Spot[];
};

export type TripDetail = Trip & {
  spots: Spot[];
  expenses: Expense[];
  participants: Participant[];
};

export type SubmitState = { error: string | null };
