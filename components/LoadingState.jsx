'use client';

import { useState, useEffect } from 'react';

export const MESSAGES = [
  'Scanning job for red flags...',
  'Reading your resume...',
  'Comparing skills...',
  'Generating your report...',
];

/**
 * Pure helper: returns the message at tick N.
 * Used directly by property-based tests (task 7.2).
 * @param {number} n - tick count (any non-negative integer)
 * @returns {string}
 */
export function getMessageAtTick(n) {
  return MESSAGES[n % MESSAGES.length];
}

/**
 * LoadingState component
 * @param {{ active: boolean }} props
 */
export default function LoadingState({ active }) {
  const [tickIndex, setTickIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setTickIndex((prev) => prev + 1);
    }, 1500);

    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  const message = getMessageAtTick(tickIndex);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      {/* Spinner */}
      <svg
        className="animate-spin h-10 w-10 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>

      {/* Step message */}
      <p className="text-base font-medium text-gray-700 text-center transition-all duration-300">
        {message}
      </p>
    </div>
  );
}
