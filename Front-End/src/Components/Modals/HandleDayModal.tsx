import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteEvent as networkDeleteEvent,
  addEvent as networkAddEvent,
  updateEventColor,
} from "../../network";
import type { EventT } from "../Events";
import { FaX } from "react-icons/fa6";
import { parseTimeTo24Hour } from "../../Util/util";

type Props = {
  selectedDate?: string;
  events: EventT[];
};
// Dynamics Colors
export const colorClassMap: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  error: "bg-error",
};
export const daisyColors = [
  "primary",
  "accent",
  "info",
  "error",
  "warning",
  "secondary",
  "success",
];
export const HandleEventModal = (props: Props) => {
  const { events, selectedDate } = props;

  const queryClient = useQueryClient();
  //Variables
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);
  // Add
  const { mutateAsync: addEvent } = useMutation({
    mutationFn: async (newEvent: {
      title: string;
      date: string;
      time: string;
    }) => await networkAddEvent(newEvent.title, newEvent.date, newEvent.time),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
  // Delete
  const { mutateAsync: deleteEvent } = useMutation({
    mutationFn: async (id: number) => await networkDeleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const { mutateAsync: changeColor } = useMutation({
    mutationFn: ({ id, color }: { id: number; color: string }) =>
      updateEventColor(id, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    localDate.setDate(localDate.getDate() + 1);
    addEvent({ title, date: localDate.toISOString(), time });
    setTitle("");
    setTime("");
    closeModal();
  };

  const dayEvents = events.filter(
    (event) => new Date(event.date).toISOString().slice(0, 10) === selectedDate
  );
  //Need to filter the events by the time given in object

  const filtDaysByTime = dayEvents.sort(
    (a: any, b: any) => parseTimeTo24Hour(a.time) - parseTimeTo24Hour(b.time)
  );

  const closeModal = () => {
    (
      document.getElementById("handle_event_modal") as HTMLDialogElement
    )?.close();
  };
  return (
    <dialog id="handle_event_modal" className="modal">
      <div className="modal-box max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">
            Events for {selectedDate}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-error"
            onClick={closeModal}
          >
            <FaX />
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-2">
          <div className="overflow-y-auto h-40">
            {filtDaysByTime.length === 0 ? (
              <p className="text-sm text-gray-500">No events for this day</p>
            ) : (
              filtDaysByTime.map((d) => (
                <div
                  key={d.id}
                  className="flex justify-between items-center bg-base-200 px-3 py-2 rounded-md m-2"
                >
                  <span>{d.title}</span>
                  <div>{d.time}</div>
                  <div className="flex flex-row gap-2">
                    <button
                      className={`btn ${
                        colorClassMap[d.color || "primary"]
                      } btn-xs`}
                      onClick={() => {
                        const currentIndex = daisyColors.indexOf(
                          d.color || "primary"
                        );
                        const nextIndex =
                          (currentIndex + 1) % daisyColors.length;
                        const nextColor = daisyColors[nextIndex];
                        changeColor({ id: d.id, color: nextColor });
                      }}
                    >
                      Change Color
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => deleteEvent(d.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Event Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <h4 className="font-medium text-primary">Add Event</h4>
          <input
            className="input input-bordered w-full"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            className="input input-bordered w-full"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={title === "" || time == ""}
          >
            Add Event
          </button>
        </form>
      </div>

      {/* Backdrop that auto-closes */}
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
};
