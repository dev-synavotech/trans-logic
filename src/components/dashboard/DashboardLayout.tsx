import { ReactNode, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "support" | "affiliate" | "customer" | "provider";
}

const DashboardLayout = ({ children, role = "admin" }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className={`flex-1 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <DashboardHeader role={role} />

        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
