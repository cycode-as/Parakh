'use client';

import { useState } from 'react';

export default function InputForm({
  jobText,
  resumeText,
  onJobTextChange,
  onResumeTextChange,
  onSubmit,
  disabled,
  jobRef,
}) {
  const [jobError, setJobError] = useState(null);
  const [resumeError, setResumeError] = useState(null);

  function handleSubmit() {
    const trimmedJob = jobText.trim();
    const trimmedResume = resumeText.trim();

    let hasError = false;

    if (trimmedJob.length === 0) {
      setJobError('Job description is required');
      hasError = true;
    } else {
      setJobError(null);
    }

    if (trimmedResume.length === 0) {
      setResumeError('Resume is required');
      hasError = true;
    } else {
      setResumeError(null);
    }

    if (!hasError) {
      onSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Job Description */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="job-description"
          className="text-sm font-medium text-gray-700"
        >
          Job Description
        </label>
        <textarea
          id="job-description"
          ref={jobRef}
          value={jobText}
          onChange={(e) => {
            onJobTextChange(e.target.value);
            if (jobError) setJobError(null);
          }}
          placeholder="Paste the job description here..."
          maxLength={20000}
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-y"
          style={{ minHeight: '200px' }}
        />
        {jobError && (
          <p className="text-xs text-red-600" role="alert">
            {jobError}
          </p>
        )}
      </div>

      {/* Resume */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="resume"
          className="text-sm font-medium text-gray-700"
        >
          Your Resume
        </label>
        <textarea
          id="resume"
          value={resumeText}
          onChange={(e) => {
            onResumeTextChange(e.target.value);
            if (resumeError) setResumeError(null);
          }}
          placeholder="Paste your resume here..."
          maxLength={20000}
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-y"
          style={{ minHeight: '200px' }}
        />
        {resumeError && (
          <p className="text-xs text-red-600" role="alert">
            {resumeError}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Analyze →
      </button>
    </div>
  );
}
