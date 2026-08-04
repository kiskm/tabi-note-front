export const CATEGORIES = [
  { value: "transport", label: "交通" },
  { value: "hotel", label: "宿泊" },
  { value: "food", label: "食事" },
  { value: "other", label: "その他" },
];

export const formConfig = {
  title: "費用を追加",
  amount: {
    label: "金額",
    placeholder: "例: 3000",
  },
  category: {
    label: "カテゴリ",
    placeholder: "例: 食費",
  },
} as const;

export const tripFormConfig = {
  addHeading: "旅行を追加",
  editHeading: "旅行を編集",
  title: "タイトル",
  tripName: "例：京都・奈良 紅葉旅",
  areaLabel: "エリア",
  areaPlaceholder: "エリアを選択",
  startDate: "開始日",
  endDate: "終了日",
  budgetLabel: "予算（円）",
  budget: "例：60000",
};

export const spotFormConfig = {
  addHeading: "スポットを追加",
  editHeading: "スポットを編集",
  spotName: "スポット名 *",
  category: "カテゴリ（例：観光、グルメ）",
  memo: "メモ（任意）",
};

export const expenseFormConfig = {
  addHeading: "支出を追加",
  editHeading: "支出を編集",
  amount: "金額（円） *",
  memo: "メモ（任意）",
  paidByPlaceholder: "支払った人を選択",
  splitParticipants: "精算対象者（この費用を割り勘する人）",
};

export const participantFormConfig = {
  addHeading: "参加者を追加",
  editHeading: "参加者を編集",
  name: "名前 *",
  email: "メールアドレス（任意）",
};

export const userFormConfig = {
  userName: "ユーザ名",
  email: "メールアドレス",
  password: "パスワード",
};
