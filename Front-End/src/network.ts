//GO TO INDEX.TS TO CREATE ENDPOINTS

import type { EventT } from "./Components/Events";

export const getEvents = async () => {
  const res = await fetch("http://localhost:4000/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};
//When adding events, we need to put in all parameters needed in here and in index.ts
export const addEvent = async (title: string, date: string, time: string) => {
  const res = await fetch("http://localhost:4000/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, date, time }),
  });
  if (!res.ok) throw new Error("Failed to add event");
  return res.json();
};
export const deleteEvent = async (eventId: string | number) => {
  try {
    const response = await fetch(`http://localhost:4000/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
export const updateEventColor = async (id: number, color: string) => {
  const res = await fetch(`http://localhost:4000/events/${id}/color`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color }),
  });
  if (!res.ok) throw new Error("Failed to update event color");
  return res.json();
};
export const updateEventDate = async (event: EventT) => {
  const res = await fetch(`http://localhost:4000/events/${event.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
};
