import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "support" | "affiliate" | "customer" | "provider";
}

const DashboardLayout = ({ children, role = "admin" }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar role={role} />
      
      <div className="flex-1 lg:ml-64">
        <DashboardHeader role={role} />
        
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
