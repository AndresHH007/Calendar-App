import { FaCalendar, FaMoon } from "react-icons/fa6";
import { Events } from "./Components/Events";
import { useEffect, useState } from "react";
import { SiApplearcade } from "react-icons/si";

//TODO:
//Import holidays and append them to my events
//Make sure to keep them disabled. so they are not removeable. and possibly add IDs to them.

export const App = () => {
  const [isdark, setIsDark] = useState(
    JSON.parse(localStorage.getItem("isdark") ?? "")
  );
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isdark ? "dark" : "synthwave"
    );
  }, [isdark]);
  const themeController = (
    <div>
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          className="theme-controller"
          value={isdark ? "dark" : "synthwave"}
          checked={isdark}
          onChange={() => setIsDark(!isdark)}
        />
        {isdark ? <FaMoon size={24} /> : <SiApplearcade size={24} />}
      </label>
    </div>
  );
  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-4  justify-between flex flex-row">
        <div className="flex flex-row gap-2 max-w-md mx-auto items-center text-4xl font-bold mb-4 text-primary">
          <div>Calender</div>
          <FaCalendar size={24} />
        </div>
        <div>{themeController}</div>
      </div>
      <Events />
    </div>
  );
};
