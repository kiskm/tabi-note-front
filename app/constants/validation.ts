export const validationConfig = {
  trip: {
    titleRequired: "タイトルは必須です",
    titleLength: "タイトルは100文字以内で入力してください",
    areaLength: "エリアは100文字以内で入力してください",
    dateSelect: "終了日は開始日以降の日付を入力してください",
    budgetRequired: "予算は0以上で入力してください",
    budgetLength: "予算は9,999,999円以下で入力してください",
    budgetInteger: "予算は整数で入力してください",
    createError: "追加に失敗しました",
  },
  spot: {
    spotRequired: "スポット名は必須です",
    spotLength: "スポット名は100文字以内で入力してください",
    categoryLength: "カテゴリは50文字以内で入力してください",
    memoLength: "メモは500文字以内で入力してください",
    createError: "追加に失敗しました",
  },
  expense: {
    amountRequired: "金額は必須です",
    amountOverZero: "金額は0以上で入力してください",
    amountLength: "金額は9,999,999円以下で入力してください",
    amountInteger: "金額は整数で入力してください",
    memoLength: "メモは500文字以内で入力してください",
  },
  createError: "追加に失敗しました",
};
