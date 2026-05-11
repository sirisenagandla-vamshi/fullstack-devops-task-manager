const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn Docker",
    completed: false,
  },
  {
    id: 2,
    title: "Deploy app to Kubernetes",
    completed: false,
  },
];

// Health check API
app.get("/", (req, res) => {
  res.send("Backend server is running successfully");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  const newTask = {
    id: Date.now(),
    title,
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Mark task completed / not completed
app.put("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;

  res.json(task);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const existingTask = tasks.find((task) => task.id === taskId);

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks = tasks.filter((task) => task.id !== taskId);

  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});