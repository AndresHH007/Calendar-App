import { useState } from "react";
import type { EventT } from "./Events";
import { colorClassMap, HandleEventModal } from "./Modals/HandleDayModal";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { parseTimeTo24Hour } from "../Util/util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventDate } from "../network";
type Props = {
  events: EventT[];
  controlledDate: Date;
  setControlledDate: (controlledDate: Date) => void;
};
export type CalenderT = {
  events: EventT[];
};
export type Color = {
  color: string;
};
export const Calender = (props: Props) => {
  const queryClient = useQueryClient();
  const { events, controlledDate, setControlledDate } = props;
  const currentDate = new Date();
  const [selectedDay, setSelectedDay] = useState<string>("");
  //Dragg state
  const [draggedEvent, setDraggedEvent] = useState<EventT | null>(null);

  const updateEventDateMutation = useMutation({
    mutationFn: async (updatedEvent: EventT) => {
      await updateEventDate(updatedEvent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
  // Mutates current prop that was given to my mutation function above.
  const handleDrop = (newDate: Date) => {
    if (!draggedEvent) return;

    updateEventDateMutation.mutate({
      ...draggedEvent,
      date: newDate,
    });
    setDraggedEvent(null);
  };
  //Need to create function to generate months and days
  const generateMonthDays = (year: number, month: number) => {
    month--;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // last day of month
    const days: (Date | null)[] = [];

    // Add blanks for days before first of month
    const blanks = firstDayOfMonth.getDay(); // 0-sunday , 1-Monday
    for (let i = 0; i < blanks; i++) {
      days.push(null);
    }

    // Add actual days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push(new Date(year, month, d));
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

  const eventsFilteredByMonth = events.filter((ev) => {
    const currentDate = new Date(ev.date);
    return currentDate.getMonth() === controlledDate.getMonth();
  });
  const sortedEvents = eventsFilteredByMonth.sort(
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
        <div className="flex flex-row gap-4 justify-evenly">
          <div>Week</div>
          <div>Month</div>
          <div></div>
        </div>
        {/* Event Count */}
        <div className="mt-2 md:mt-0  font-medium text-primary flex flex-row gap-2">
          <div>Events:</div>
          <span className="font-bold">{eventsFilteredByMonth.length}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, ind) => {
          if (!d) {
            return <div key={"blank-" + ind} />;
          }
          const dayEvents = sortedEvents.filter((e) => {
            const eventDate = new Date(e.date);
            return eventDate.toDateString() === d.toDateString();
          });
          //Max events for day block
          const max = 2;
          const remaining = dayEvents.length - max;
          return (
            <div
              key={d.toISOString()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(d)}
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
              <div
                className={`font-semibold mb-2 text-primary flex flex-row justify-between ${
                  currentDate.toDateString() === d.toDateString()
                    ? "text-secondary"
                    : ""
                }`}
              >
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
                    draggable
                    onDragStart={() => setDraggedEvent(e)}
                    key={i}
                    className="tooltip tooltip-bottom w-full tooltip"
                    data-tip={e.time}
                  >
                    <div
                      className={`${
                        colorClassMap[e.color || "primary"]
                      } flex flex-row justify-between text-black px-2 text-xs rounded-md truncate`}
                    >
                      <div>{e.title}</div>
                      <div>{e.time}</div>
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
