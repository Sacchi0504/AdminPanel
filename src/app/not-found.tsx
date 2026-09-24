import React from 'react';
import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-md w-full shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-inner">
          <PackageX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400 mt-2 mb-6 leading-relaxed">
          The page or product resource you are searching for does not exist or has moved.
        </p>
        <Link
          href="/products"
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-teal-600/20"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
