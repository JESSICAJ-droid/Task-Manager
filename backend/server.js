
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn React", completed: false },
  { id: 2, title: "Practise Node.js", completed: true }
];

// Test whether the server is running
app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: "Task title is required"
    });
  }

  const task = {
    id: Date.now(),
    title: title.trim(),
    completed: false
  };

  tasks.push(task);

  res.status(201).json(task);
});

// Update task completion
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    item => item.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  if (typeof req.body.completed !== "boolean") {
    return res.status(400).json({
      error: "completed must be true or false"
    });
  }

  task.completed = req.body.completed;
  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some(task => task.id === id);

  if (!exists) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  tasks = tasks.filter(task => task.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`TaskFlow API: http://localhost:${PORT}`);
});
