import type { Expense, Participant } from "./types";

export type SettlementTransaction = {
  fromParticipantId: number;
  toParticipantId: number;
  amount: number;
};

// 参考値: 全費用合計を参加者数で単純に均等割りした場合の1人あたりの金額
export const calculateReferencePerPerson = (
  expenses: Expense[],
  participantCount: number,
): number => {
  if (participantCount === 0) return 0;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return Math.round(total / participantCount);
};

// 費用ごとの精算対象者を考慮した、誰が誰にいくら払うべきかのリスト(最小取引数に整理)
export const calculateSettlement = (
  expenses: Expense[],
  participants: Participant[],
): SettlementTransaction[] => {
  const balances = new Map<number, number>(
    participants.map((p) => [p.id, 0]),
  );

  for (const expense of expenses) {
    if (expense.paidByParticipantId === null) continue;
    if (expense.splitParticipants.length === 0) continue;

    const share = Math.round(
      expense.amount / expense.splitParticipants.length,
    );
    for (const target of expense.splitParticipants) {
      balances.set(target.id, (balances.get(target.id) ?? 0) - share);
    }
    balances.set(
      expense.paidByParticipantId,
      (balances.get(expense.paidByParticipantId) ?? 0) + expense.amount,
    );
  }

  const debtors = [...balances.entries()]
    .filter(([, amount]) => amount < 0)
    .map(([id, amount]) => ({ id, amount: -amount }))
    .sort((a, b) => b.amount - a.amount);
  const creditors = [...balances.entries()]
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);

  const transactions: SettlementTransaction[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);
    if (amount > 0) {
      transactions.push({
        fromParticipantId: debtor.id,
        toParticipantId: creditor.id,
        amount,
      });
    }
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return transactions;
};
