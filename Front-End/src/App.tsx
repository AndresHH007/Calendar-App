import { FaBars, FaCalendar, FaMoon } from "react-icons/fa6";
import { Events } from "./Components/Events";
import { HomePage } from "./Components/HomePage";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiApplearcade } from "react-icons/si";
import { Timeline } from "./Components/Timeline";
import { GrDrawer } from "react-icons/gr";

//TODO:
//Import holidays and append them to my events
//Make sure to keep them disabled. so they are not removeable. and possibly add IDs to them.

export const App = () => {
  const navigate = useNavigate();
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
  const list = [
    { title: "Calender View", linkto: "/calender" },
    { title: "Timeline View", linkto: "/timeline" },
  ];
  return (
    <div>
      <div className="p-2  justify-between flex flex-row z-99  bg-base-200 ">
        <div>
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* <!-- Page content here --> */}
              <div className="btn btn-sm">
                <label htmlFor="my-drawer">
                  <FaBars size={20} />
                </label>
              </div>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {list.map((item) => (
                  <div
                    className="m-2 rounded-box p-2 hover:bg-base-100"
                    onClick={() => navigate(item.linkto)}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 max-w-md mx-auto items-center text-4xl font-bold mb-2 text-primary">
          <div onClick={() => navigate("/")}>Calender App</div>
          <FaCalendar size={24} />
        </div>
        <div>{themeController}</div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calender" element={<Events />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </div>
  );
};
