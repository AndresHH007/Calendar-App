import { parseTimeTo24Hour } from "../Util/util";
import type { EventT } from "./Events";
import { colorClassMap } from "./Modals/HandleDayModal";

type Props = {
  events: EventT[];
  controlledDate: Date;
};
export const Timeline = ({ events, controlledDate }: Props) => {
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
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="w-full overflow-x-auto">
      <ul className="timeline timeline-horizontal w-full">
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
  );
};
