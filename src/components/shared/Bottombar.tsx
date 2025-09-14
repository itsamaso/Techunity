import { Link, useLocation } from "react-router-dom";

import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${
              isActive && "rounded-[10px] bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 shadow-lg"
            } flex-center flex-col gap-1 p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-100 hover:via-secondary-100 hover:to-accent-100 hover:rounded-[10px]`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && link.label !== "Coding" && "invert-white"} ${link.label === "Coding" && "!invert-0 !brightness-100"}`}
            />

            <p className="small-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
