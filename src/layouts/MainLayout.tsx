import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';
import { CaregiverProvider } from '@/features/caregivers/context/CaregiverContext';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CaregiverProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar for desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar (conditionally rendered) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background p-6 shadow-lg">
              <Sidebar mobile onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
            <Outlet />
          </main>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </CaregiverProvider>
  );
};

export default MainLayout;