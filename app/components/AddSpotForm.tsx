"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSpot } from "@/app/actions";

const AddSpotForm = ({ tripId }: { tripId: number }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = async () => {
    // バリデーション
    if (!name.trim()) {
      setError("スポット名は必須です");
      setName("");
      return;
    }
    if (name.trim().length > 100) {
      setError("スポット名は100文字以内で入力してください");
      setName("");
      return;
    }
    if (category.trim().length > 50) {
      setError("カテゴリは50文字以内で入力してください");
      setCategory("");
      return;
    }
    if (memo.trim().length > 500) {
      setError("メモは500文字以内で入力してください");
      setMemo("");
      return;
    }

    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.append("name", name.trim());
    if (category.trim()) fd.append("category", category.trim());
    if (memo.trim()) fd.append("memo", memo.trim());
    try {
      await createSpot(tripId, fd);
      setOpen(false);
      setName("");
      setCategory("");
      setMemo("");
      router.refresh();
    } catch {
      setError("追加に失敗しました");
    } finally {
      setPending(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        + スポットを追加
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">スポットを追加</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="スポット名 *"
        maxLength={100}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="カテゴリ（例：観光、グルメ）"
        maxLength={50}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="メモ（任意）"
        maxLength={500}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50"
        >
          {pending ? "追加中..." : "追加"}
        </button>
      </div>
    </div>
  );
};

export default AddSpotForm;
