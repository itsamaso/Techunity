import { Outlet } from "react-router-dom";

import Bottombar from "@/components/shared/Bottombar";

const RootLayout = () => {
  return (
    <div className="w-full flex flex-col">
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
