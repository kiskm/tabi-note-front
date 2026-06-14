import { buttonConfig } from "@/app/constants/ui";

type Props = {
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const CancelButton = ({ setEditing, setError }: Props) => {
  return (
    <button
      type="button"
      onClick={() => {
        setEditing(false);
        setError(null);
      }}
      className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
    >
      {buttonConfig.cancel}
    </button>
  );
};
