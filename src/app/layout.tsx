import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProductsProvider } from '@/context/ProductsContext';

export const metadata: Metadata = {
  title: 'Product Admin Dashboard | DummyJSON Catalog',
  description:
    'Production-grade product administration dashboard built with Next.js, React, Tailwind CSS, and Axios. Features server-side pagination, debounced search, category filtering, and CRUD operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <ToastProvider>
          <AuthProvider>
            <ProductsProvider>
              {children}
            </ProductsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
