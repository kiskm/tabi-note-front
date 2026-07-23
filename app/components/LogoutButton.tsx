"use client";

import { logout } from "@/app/actions";
import { buttonConfig } from "@/app/constants/ui";

export const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="inline-flex items-center gap-1 border border-orange-300 text-orange-800 text-sm px-3.5 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-300 cursor-pointer"
      >
        {buttonConfig.logout}
      </button>
    </form>
  );
};
