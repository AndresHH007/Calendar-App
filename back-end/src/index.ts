import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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
