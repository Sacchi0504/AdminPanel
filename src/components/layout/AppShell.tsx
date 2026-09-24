'use client';

import React, { ReactNode } from 'react';
import Link from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Package, Plus, ShieldCheck, User as UserIcon } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <NextLink href="/products" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white group-hover:text-teal-400 transition-colors">
                  ProductAdmin
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                  Portal
                </span>
              </div>
            </NextLink>

            <nav className="hidden md:flex items-center gap-1">
              <NextLink
                href="/products"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/products'
                    ? 'bg-slate-800 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                Products
              </NextLink>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <NextLink
              href="/products/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold transition-all duration-150 shadow-md shadow-teal-600/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </NextLink>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="flex items-center gap-2.5">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-slate-800"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 text-xs font-semibold">
                    {user?.firstName?.[0] || 'A'}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-medium text-slate-200 leading-none">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-none">
                    @{user?.username}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Product Admin Dashboard &bull; Connected to DummyJSON API
      </footer>
    </div>
  );
}
