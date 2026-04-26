export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-teal-400 animate-ping opacity-30" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  )
}
