"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSpot } from "@/app/actions";

export const EditSpotButton = ({
  spotId,
  tripId,
  name,
  category,
  memo,
}: {
  spotId: number;
  tripId: number;
  name: string;
  category: string | null;
  memo: string | null;
}) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameVal, setNameVal] = useState(name);
  const [categoryVal, setCategoryVal] = useState(category ?? "");
  const [memoVal, setMemoVal] = useState(memo ?? "");

  const handleSave = async () => {
    // バリデーション
    if (!nameVal.trim()) {
      setError("スポット名は必須です");
      setNameVal("");
      return;
    }
    if (nameVal.trim().length > 100) {
      setError("スポット名は100文字以内で入力してください");
      setNameVal("");
      return;
    }
    if (categoryVal.trim().length > 50) {
      setError("カテゴリは50文字以内で入力してください");
      setCategoryVal("");
      return;
    }
    if (memoVal.trim().length > 500) {
      setError("メモは500文字以内で入力してください");
      setMemoVal("");
      return;
    }

    setError(null);
    setPending(true);
    try {
      await updateSpot(spotId, tripId, {
        name: nameVal.trim(),
        category: categoryVal.trim() || undefined,
        memo: memoVal.trim() || undefined,
      });
      setEditing(false);
      router.refresh();
    } catch {
      setError("保存に失敗しました");
    } finally {
      setPending(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-400 hover:text-blue-500 px-2 cursor-pointer"
      >
        編集
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">スポットを編集</p>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
          placeholder="スポット名 *"
          maxLength={100}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <input
          value={categoryVal}
          onChange={(e) => setCategoryVal(e.target.value)}
          placeholder="カテゴリ"
          maxLength={50}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <input
          value={memoVal}
          onChange={(e) => setMemoVal(e.target.value)}
          placeholder="メモ"
          maxLength={500}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 cursor-pointer"
          >
            {pending ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
};
