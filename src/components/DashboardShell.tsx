"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Sidebar from "./Sidebar";

interface DashboardContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
  openMobileMenu: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

interface DashboardShellProps {
  role: "MAHASISWA" | "DOSEN" | "ADMIN";
  userName: string;
  userEmail: string;
  children: ReactNode;
}

export default function DashboardShell({
  role,
  userName,
  userEmail,
  children,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const openMobileMenu = () => setIsMobileMenuOpen(true);

  return (
    <DashboardContext.Provider
      value={{
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        openMobileMenu,
      }}
    >
      <div className="flex min-h-screen bg-[#f5f5f7]">
        {/* Sidebar (Desktop and Mobile Drawer) */}
        <Sidebar
          role={role}
          userName={userName}
          userEmail={userEmail}
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />

        {/* Main Content Area: md:ml-64 so it aligns with fixed desktop sidebar */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all">
          {children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
