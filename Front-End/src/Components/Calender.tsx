import { useState } from "react";
import type { EventT } from "./Events";
import { colorClassMap, HandleEventModal } from "./Modals/HandleDayModal";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { parseTimeTo24Hour } from "../Util/util";
type Props = {
  events: EventT[];
};
export type CalenderT = {
  events: EventT[];
};
export type Color = {
  color: string;
};
export const Calender = (props: Props) => {
  const { events } = props;
  const [controlledDate, setControlledDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>("");
  //This is to have custom colors for the event backgrounds
  //Need to create function to generate months and days
  const generateMonthDays = (year: number, month: number) => {
    month--;
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() == month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  const days = generateMonthDays(
    controlledDate.getFullYear(),
    controlledDate.getMonth() + 1
  );

  const openAddEventModal = (events: EventT[], selectedDate: string) => {
    setSelectedDay(selectedDate);
    (
      document.getElementById("handle_event_modal") as HTMLDialogElement
    )?.showModal();
  };
  //Filtering events per month

  const totalEventsPerMonth = events.filter((ev) => {
    const currentDate = new Date(ev.date);
    return currentDate.getMonth() === controlledDate.getMonth();
  });
  const sortedEvents = events.sort(
    (a: any, b: any) => parseTimeTo24Hour(a.time) - parseTimeTo24Hour(b.time)
  );
  return (
    <div className="rounded-xl shadow-sm p-4 bg-base-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        {/* Month Navigation */}
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

        {/* Event Count */}
        <div className="mt-2 md:mt-0  font-medium text-primary">
          Events:
          <span className="font-bold">{totalEventsPerMonth.length}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const dayEvents = sortedEvents.filter((e) => {
            const eventDate = new Date(e.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.toDateString() === d.toDateString();
          });
          //Max events for day block
          const max = 2;
          const remaining = dayEvents.length - max;
          return (
            <div
              key={d.toISOString()}
              className="rounded-lg p-2 h-34 flex flex-col justify-start bg-base-200 hover:bg-gray-100 cursor-pointer transition shadow-sm"
              onClick={() => {
                const adjustedDate = new Date(d);
                adjustedDate.setDate(adjustedDate.getDate());
                openAddEventModal(
                  dayEvents,
                  adjustedDate.toISOString().slice(0, 10)
                );
              }}
            >
              {/* Day number */}
              <div className="font-semibold mb-1 text-primary flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                  {d.toUTCString().slice(0, 3)}
                  <div>({dayEvents.length}) </div>
                  {/* Remaining Events to prevent leaking */}
                </div>
                <div>{d.getDate()}</div>
              </div>

              {/* Events AKA DAY BOX */}
              <div className="flex flex-col gap-2 overflow-y-auto h-20 ">
                {dayEvents.slice(0, max).map((e, i) => (
                  <div
                    key={i}
                    className="tooltip tooltip-bottom w-full tooltip"
                    data-tip={e.time}
                  >
                    <div
                      className={`${
                        colorClassMap[e.color || "primary"]
                      } text-white text-xs px-1 rounded-md truncate`}
                    >
                      {e.title}
                    </div>
                  </div>
                ))}
                {/* Remaining Events Badge */}
                <div className="justify-center flex flex-row">
                  {dayEvents.length > max ? (
                    <div className="text-white rounded-md truncate bg-primary text-xs px-1 max-w-1/2 ">
                      {remaining} more events
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      <HandleEventModal selectedDate={selectedDay} events={events} />
    </div>
  );
};
