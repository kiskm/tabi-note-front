import { buttonConfig, textConfig, titleConfig } from "@/app/constants/ui";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-b-gray-400">
        <h1 className="px-4 md:px-8 pt-6 text-3xl font-semibold font-serif text-gray-900">
          <Link href="/">{titleConfig.title}</Link>
        </h1>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold font-serif">
          {textConfig.notFoundTrip}
        </h1>
        <p className="text-gray-500">{textConfig.notFoundTripTips}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          {buttonConfig.backToTop}
        </Link>
      </div>
    </>
  );
};

export default NotFound;
