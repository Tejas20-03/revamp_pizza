"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Slice Not Found
          </h2>
          <p className="text-gray-600">
            Looks like this pizza has been delivered to another address!
          </p>
        </div>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors duration-300"
        >
          Back to Main Menu
        </Link>
      </div>
    </div>
  );
}
