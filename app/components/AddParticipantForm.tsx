"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createParticipant } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { participantFormConfig } from "@/app/constants/form";
import { buttonConfig, toggleConfig } from "@/app/constants/ui";
import CancelButton from "@/app/components/CancelButton";
import LoadingOverlay from "@/app/components/LoadingOverlay";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddParticipantForm = ({ tripId }: { tripId: string }) => {
  // 状態管理
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [state, action, pending] = useActionState<{
    error: string | null;
  }>(
    async () => {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (email.trim()) fd.append("email", email.trim());
      try {
        await createParticipant(tripId, fd);
        setOpen(false);
        setName("");
        setEmail("");
        router.refresh();
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : validationConfig.createError,
        };
      }
    },
    { error: null },
  );

  const handleSubmit = async () => {
    // バリデーション
    if (!name.trim()) {
      setError(validationConfig.participant.nameRequired);
      setName("");
      return;
    }
    if (name.trim().length > 100) {
      setError(validationConfig.participant.nameLength);
      setName("");
      return;
    }
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setError(validationConfig.participant.emailInvalid);
      setEmail("");
      return;
    }

    setError(null);
    startTransition(() => action());
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border border-violet-600 text-violet-800
                       px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-50 duration-300"
      >
        {toggleConfig.addParticipant}
      </button>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">
          {participantFormConfig.addHeading}
        </p>
        {(error || state.error) && (
          <p className="text-xs text-red-500 mb-3">{error || state.error}</p>
        )}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={participantFormConfig.name}
          maxLength={100}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={participantFormConfig.email}
          maxLength={255}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <div className="flex gap-2">
          <CancelButton
            setEditing={() => setOpen(false)}
            setError={() => setError(null)}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
          >
            {pending ? buttonConfig.addPending : buttonConfig.add}
          </button>
        </div>
      </div>
      <LoadingOverlay visible={pending} />
    </>
  );
};

export default AddParticipantForm;
