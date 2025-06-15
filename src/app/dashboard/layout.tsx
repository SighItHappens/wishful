'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ReactNode } from 'react';

export default function LayoutForDashboard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
