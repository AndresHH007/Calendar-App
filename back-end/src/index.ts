import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
//Get Users
app.get("/users", async (req, res) => {
  const user = await prisma.userM.findMany();
  res.json(user);
});
// Create event
app.post("/events", async (req, res) => {
  const { title, date, time } = req.body;
  const event = await prisma.event.create({
    data: { title, date: new Date(date), time },
  });
  res.json(event);
});

// Get events
app.get("/events", async (req, res) => {
  const events = await prisma.event.findMany();
  res.json(events);
});

//Delete Event
app.delete("/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    await prisma.event.delete({
      where: { id },
    });

    res.status(204).send(); // success, no content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});
app.put("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ error: "Invalid id" });

  const { title, date, time, color } = req.body;

  if (
    title === undefined &&
    date === undefined &&
    time === undefined &&
    color === undefined
  ) {
    return res.status(400).json({ error: "No fields to update" });
  }

  // Parse/validate incoming date if present
  let parsedDate: Date | undefined;
  if (date !== undefined && date !== null) {
    try {
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // 'YYYY-MM-DD' -> treat as UTC midnight to avoid timezone shifts
        parsedDate = new Date(date + "T00:00:00.000Z");
      } else {
        parsedDate = new Date(date);
      }
      if (isNaN(parsedDate.getTime())) throw new Error("Invalid date");
    } catch (err) {
      return res.status(400).json({ error: "Invalid date format" });
    }
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(parsedDate ? { date: parsedDate } : {}),
        ...(time !== undefined ? { time } : {}),
        ...(color !== undefined ? { color } : {}),
      },
    });
    return res.json(updated);
  } catch (err) {
    console.error("PUT /events/:id error:", err);
    return res.status(500).json({ error: "Failed to update event" });
  }
});
//Change Color
app.put("/events/:id/color", async (req, res) => {
  const { id } = req.params;
  const { color } = req.body;

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: { color },
    });
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update color" });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
