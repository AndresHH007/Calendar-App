import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { addEvent as networkAddEvent, getEvents } from "../network";
import { Calender } from "./Calender";
import { FaCalendar } from "react-icons/fa";
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
    <div className="p-6  mx-auto">
      <div className="p-6 max-w-md mx-auto">
        <div className="flex flex-row gap-2 items-center text-4xl font-bold mb-4 text-primary text-center">
          <div>Calender</div>
          <FaCalendar size={24} />
        </div>
      </div>
      <div className="my-2">
        <Calender events={events} />
      </div>
    </div>
  );
};
