// /app/dashboard/layout.tsx (Example)
'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext'; 

export default function LayoutForDashboard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
        <DashboardLayout>
        {children}
        </DashboardLayout>
    </ThemeProvider>
  );
}
