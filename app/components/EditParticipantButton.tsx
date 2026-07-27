"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateParticipant } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { participantFormConfig } from "@/app/constants/form";
import { buttonConfig } from "@/app/constants/ui";
import CancelButton from "@/app/components/CancelButton";
import LoadingOverlay from "@/app/components/LoadingOverlay";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EditParticipantButton = ({
  participantId,
  tripId,
  name,
  email,
}: {
  participantId: number;
  tripId: string;
  name: string;
  email: string | null;
}) => {
  const router = useRouter();
  // 状態管理
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameVal, setNameVal] = useState(name);
  const [emailVal, setEmailVal] = useState(email ?? "");

  const [state, action, pending] = useActionState<{
    error: string | null;
  }>(
    async () => {
      try {
        await updateParticipant(participantId, tripId, {
          name: nameVal.trim(),
          email: emailVal.trim() || undefined,
        });
        setEditing(false);
        router.refresh();
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : validationConfig.saveError,
        };
      }
    },
    { error: null },
  );

  const handleSave = async () => {
    // バリデーション
    if (!nameVal.trim()) {
      setError(validationConfig.participant.nameRequired);
      setNameVal("");
      return;
    }
    if (nameVal.trim().length > 100) {
      setError(validationConfig.participant.nameLength);
      setNameVal("");
      return;
    }
    if (emailVal.trim() && !EMAIL_PATTERN.test(emailVal.trim())) {
      setError(validationConfig.participant.emailInvalid);
      setEmailVal("");
      return;
    }

    setError(null);
    startTransition(() => action());
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-400 hover:text-blue-500 px-2 cursor-pointer"
      >
        {buttonConfig.edit}
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-900">
            {participantFormConfig.editHeading}
          </p>
          {(error || state.error) && (
            <p className="text-xs text-red-500 mb-3">{error || state.error}</p>
          )}
          <input
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            placeholder={participantFormConfig.name}
            maxLength={100}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <input
            type="email"
            value={emailVal}
            onChange={(e) => setEmailVal(e.target.value)}
            placeholder={participantFormConfig.email}
            maxLength={255}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <div className="flex gap-2">
            <CancelButton
              setEditing={() => setEditing(false)}
              setError={() => setError(null)}
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
            >
              {pending ? buttonConfig.savePending : buttonConfig.save}
            </button>
          </div>
        </div>
      </div>
      <LoadingOverlay visible={pending} />
    </>
  );
};
