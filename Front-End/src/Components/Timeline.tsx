import { useQuery } from "@tanstack/react-query";
import { parseTimeTo24Hour } from "../Util/util";
import type { EventT } from "./Events";
import { colorClassMap } from "./Modals/HandleDayModal";
import { useState } from "react";
import { getEvents } from "../network";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

export const Timeline = () => {
  const [controlledDate, setControlledDate] = useState<Date>(new Date());
  //Grab my events
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery<EventT[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  });
  const eventsFilteredByMonth = events.filter((ev) => {
    const currentDate = new Date(ev.date);
    return currentDate.getMonth() === controlledDate.getMonth();
  });
  // sort by Time
  const sortedEvents = eventsFilteredByMonth.sort(
    (a: any, b: any) => parseTimeTo24Hour(a.time) - parseTimeTo24Hour(b.time)
  );
  //Sort by Date events
  const sortedDateEvents = sortedEvents.sort((a: EventT, b: EventT) => {
    return a.date.getTime() - b.date.getTime();
  });

  return (
    <div className="flex flex-col gap-4 items-center h-full ">
      <div className="flex items-center gap-4 text-primary text-xl font-semibold">
        <button
          className="btn btn-xs btn-outline btn-circle hover:bg-primary hover:text-white transition"
          onClick={() =>
            setControlledDate(
              new Date(
                controlledDate.getFullYear(),
                controlledDate.getMonth() - 1
              )
            )
          }
        >
          <BiLeftArrow />
        </button>

        <div className="px-4 py-1   min-w-[150px] text-center">
          {controlledDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button
          className="btn btn-xs btn-outline btn-circle hover:bg-primary hover:text-white transition"
          onClick={() =>
            setControlledDate(
              new Date(
                controlledDate.getFullYear(),
                controlledDate.getMonth() + 1
              )
            )
          }
        >
          <BiRightArrow />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <ul className="timeline timeline-vertical w-full">
          {sortedDateEvents.map((ev, idx) => (
            <li key={ev.id} className="flex ">
              {/* Left connector */}
              {idx !== 0 && <hr className="bg-primary" />}
              {/* Dot in the middle */}
              <div className="timeline-middle">
                <div
                  className={`w-4 h-4 rounded-full ${
                    ev.color ? `bg-${ev.color}-500` : "bg-primary"
                  }`}
                />
              </div>
              {/* Event box */}
              <div
                className={`timeline-${
                  idx % 2 === 0 ? "start" : "end"
                } timeline-box  ${
                  colorClassMap[ev.color || "primary"]
                } text-black`}
              >
                <div className="font-semibold flex flex-row justify-between">
                  <div>{ev.title}</div>
                  <div>{ev.time}</div>
                </div>
                <div className="text-xs opacity-70">
                  {new Date(ev.date).toDateString()}
                </div>
              </div>
              {/* Right connector */}
              {idx !== events.length - 1 && <hr className="bg-primary" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
