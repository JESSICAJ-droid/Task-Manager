
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Could not load tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch {
      setError("Cannot connect to the backend. Is it running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Could not create task");
      }

      const newTask = await response.json();

      setTasks((current) => [...current, newTask]);
      setTitle("");
    } catch {
      setError("Could not add the task.");
    }
  }

  async function toggleTask(task) {
    try {
      setError("");

      const response = await fetch(`${API}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const updatedTask = await response.json();

      setTasks((current) =>
        current.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch {
      setError("Could not update the task.");
    }
  }

  async function deleteTask(id) {
    try {
      setError("");

      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch {
      setError("Could not delete the task.");
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="app">
      <header>
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>TaskFlow<span>.</span></h1>
        <p className="subtitle">
          Small steps. Big progress.
        </p>
      </header>

      <section className="summary">
        <div>
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong>{tasks.length - completedCount}</strong>
        </div>
      </section>

      <form className="task-form" onSubmit={addTask}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          aria-label="New task"
        />
        <button type="submit">+ Add task</button>
      </form>

      <nav className="filters">
        {["all", "active", "completed"].map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "selected" : ""}
            onClick={() => setFilter(item)}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <section className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="empty">No tasks here. Add one above!</p>
          ) : (
            filteredTasks.map((task) => (
              <article className="task" key={task.id}>
                <label className="task-title">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span className={task.completed ? "done" : ""}>
                    {task.title}
                  </span>
                </label>

                <button
                  className="delete"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </article>
            ))
          )}
        </section>
      )}

      <footer>Built by Developer</footer>
    </main>
  );
}

export default App;
