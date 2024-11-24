"use client";
import { useState } from "react";
import Link from "next/link";
import {
  IconLogoMainColor,
  IconCloseAsideBar,
  IconOpenAsideBar,
  IconCupRanking,
  IconExploreGlobal,
  IconSettings,
  IconHome,
} from "@/icons/Icons";
import { motion } from "motion/react";

const Header = () => {
  const [openedAside, setOpenedAside] = useState(false);

  const handleShowAside = () => {
    setOpenedAside(!openedAside);
  };

  const routes = [
    { name: "Home", path: "", icon: <IconHome /> },
    { name: "Explore", path: "explore", icon: <IconExploreGlobal /> },
    { name: "Featured", path: "featured", icon: <IconCupRanking /> },
    { name: "Settings", path: "settings", icon: <IconSettings /> },
  ];

  return (
    <motion.header
      initial={{ width: openedAside ? "72px" : "384px" }}
      animate={{ width: openedAside ? "72px" : "384px" }}
      className="relative h-full flex flex-col justify-between rounded-2xl z-50"
    >
      <nav className="flex flex-col text-neutral-400">
        <div className="w-full p-2">
          <div className="flex items-center justify-between bg-white rounded-xl border border-neutral-300 p-0.5 pr-1.5">
            <Link href="/" className="group flex items-center gap-2 w-fit">
              <i className="size-10 p-1 group-hover:rotate-45 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <IconLogoMainColor />
              </i>
            </Link>
            <button
              className={`flex group hover:bg-neutral-300/60 rounded-lg transition-all ${
                openedAside ? "translate-x-7" : ""
              }`}
              onClick={handleShowAside}
            >
              <i className="size-8 p-1 hover:text-neutral-800 group-active:scale-90 transition-all">
                {openedAside ? <IconOpenAsideBar /> : <IconCloseAsideBar />}
              </i>
            </button>
          </div>
        </div>
        <div className="w-full border-t border-neutral-300"></div>
        <ul>
          <li>
            <p className="text-sm pb-3">Main</p>
          </li>
          {routes.map((item, index) => (
            <li key={index}>
              <a
                href={`/${item.path}`}
                className="text-sm w-full hover:text-neutral-800 transition-all flex items-center gap-1 capitalize hover:bg-neutral-300 rounded-xl "
              >
                <i className="size-6">{item.icon}</i>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-full h-40 p-4">
        <div className="relative bg-gradient-to-t from-slate-400 to-white w-full h-full rounded-2xl border border-slate-300 overflow-hidden">
          <i className="absolute -top-32 left-1/2 rotate-90 -translate-x-1/2 size-60 text-white/20 blur-xl">
            <IconLogoMainColor />
          </i>
          <div className="w-full h-full flex flex-col items-center justify-center text-white select-none">
            <p className="text-3xl text-center font-semibold z-50">
              Join ImColExt
            </p>
            <p className="text-sm z-50 leading-3">To access more features</p>
            <button className="text-xs bg-neutral-100 hover:bg-white text-neutral-800 font-semibold px-6 py-2.5 rounded-lg mt-4 z-50 cursor-pointer hover:scale-105 transition-all duration-300 leading-3 hover:shadow-[0_0_8px_#ffffff]">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
