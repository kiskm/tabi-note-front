"use client";

import { logout } from "@/app/actions";
import { buttonConfig } from "@/app/constants/ui";

export const LogoutButton = () => {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="ml-auto px-2 py-1 text-md rounded-md bg-red-500 text-white hover:bg-red-700 transition-colors duration-300 cursor-pointer"
      >
        {buttonConfig.logout}
      </button>
    </form>
  );
};
