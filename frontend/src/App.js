import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Unable to fetch tasks from backend");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        title: title,
      });

      setTasks([...tasks, response.data]);
      setTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Unable to add task");
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`);

      const updatedTasks = tasks.map((task) =>
        task.id === id ? response.data : task
      );

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Unable to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      const remainingTasks = tasks.filter((task) => task.id !== id);
      setTasks(remainingTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Unable to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>Full-Stack DevOps Task Manager</h1>
        <p className="subtitle">
          React Frontend + Node.js Backend + Docker + Kubernetes + GitHub Actions
        </p>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : (
          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="empty">No tasks available</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div>
                    <h3 className={task.completed ? "completed" : ""}>
                      {task.title}
                    </h3>
                    <p>{task.completed ? "Completed" : "Pending"}</p>
                  </div>

                  <div className="actions">
                    <button
                      className="complete-btn"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;