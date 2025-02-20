import Link from "next/link";
import { JSX } from "react";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-center text-white">
      <h1 className="text-8xl font-extrabold tracking-wide text-red-500 drop-shadow-lg">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-300">
        Oops! The page you are looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-yellow-600 px-8 py-3 text-lg font-medium text-black shadow-md transition duration-300 ease-in-out hover:bg-green-700 hover:shadow-lg"
      >
            Go to Home
      </Link>
    </div>
  );
}
