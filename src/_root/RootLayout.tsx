import { Outlet } from "react-router-dom";

import Sidebar from "@/components/shared/Sidebar";

const RootLayout = () => {
  return (
    <div className="w-full flex h-screen">
      <Sidebar />
      <main className="flex-1 ml-80 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
