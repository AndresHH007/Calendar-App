import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addEvent as networkAddEvent, getEvents } from "../network";
import { Calender } from "./Calender";
import { FaCalendar } from "react-icons/fa";
import { Timeline } from "./Timeline";
//Implement time for my type and db TODO
//And the events filter by time set per day
export type EventT = {
  id: number;
  title: string;
  date: Date;
  color?: string;
  time: string;
};
export const Events = () => {
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
  //Function for posting an event

  // Loading and error for gueries
  if (isLoading) return <div className="loading loading-spinner" />;
  if (error) return <div>Error Loading Events</div>;

  return (
    <div className="p-6  mx-auto flex flex-col gap-4">
      <Calender
        events={events}
        controlledDate={controlledDate}
        setControlledDate={setControlledDate}
      />
      <div className="w-full my-4">
        <Timeline events={events} controlledDate={controlledDate} />
      </div>
    </div>
  );
};
