import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import api from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaUser, FaFlag, FaTasks } from "react-icons/fa";

function DashBoard() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const navigate = useNavigate();
  const socket = io("http://localhost:5100");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/auth/current-user", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (err) {
        console.error("Error fetching current user:", err);
        toast.error("Failed to fetch current user.");
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks", { withCredentials: true });
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to fetch tasks.");
      }
    };

    fetchTasks();

    socket.on("taskAssigned", (task) => {
      toast.info(`New task assigned: ${task.title}`);
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    return () => socket.disconnect();
  }, [socket]);

  const isDueToday = (date) => {
    const today = new Date();
    const dueDate = new Date(date);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  };

  const isDueThisWeek = (date) => {
    const now = new Date();
    const dueDate = new Date(date);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return dueDate >= startOfWeek && dueDate <= endOfWeek;
  };

  const isOverdue = (date) => {
    const dueDate = new Date(date);
    const now = new Date();
    return dueDate < now && !isDueToday(date);
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      const matchesPriority = filterPriority
        ? task.priority === filterPriority
        : true;

      let matchesDueDate = true;
      if (filterDueDate === "today") matchesDueDate = isDueToday(task.due_date);
      else if (filterDueDate === "week")
        matchesDueDate = isDueThisWeek(task.due_date);
      else if (filterDueDate === "overdue")
        matchesDueDate = isOverdue(task.due_date);

      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // Sort tasks by due date in ascending order

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Failed to log out.");
    }
  };

  const handleEditTask = (taskId) => {
    if (!taskId) {
      console.error("Task ID is undefined");
      return;
    }
    navigate(`/edit-task/${taskId}`);
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${taskId}`, { withCredentials: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task.");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-danger";
      case "Medium":
        return "text-warning";
      case "Low":
        return "text-success";
      default:
        return "";
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-light min-vh-100"
          : "bg-light text-dark min-vh-100"
      }
    >
      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            Task Manager
          </Link>
          <div className="d-flex flex-wrap flex-grow-1 align-items-center justify-content-end gap-2">
            <input
              className="form-control"
              style={{ maxWidth: "180px" }}
              type="search"
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select"
              style={{ maxWidth: "150px" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
            <select
              className="form-select"
              style={{ maxWidth: "150px" }}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="form-select"
              style={{ maxWidth: "150px" }}
              value={filterDueDate}
              onChange={(e) => setFilterDueDate(e.target.value)}
            >
              <option value="">All Due Dates</option>
              <option value="today">Due Today</option>
              <option value="week">Due This Week</option>
              <option value="overdue">Overdue</option>
            </select>
            <button
              className={`btn ${darkMode ? "btn-light" : "btn-dark"} btn-sm`}
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            {currentUser && (
              <span className="me-2">
                Hello, <strong>{currentUser.username}</strong>
              </span>
            )}
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome Message */}
      <div className="container mt-4">
        <div
          className={`alert ${
            darkMode ? "alert-dark" : "alert-success"
          } text-center`}
        >
          Welcome to the Task Manager Dashboard!
        </div>
      </div>

      {/* Task List */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h3 className="mb-3 mb-md-0">
            Hello Team, here are your assigned tasks. Good luck!
          </h3>
          <Link to="/create-task" className="btn btn-primary">
            Add Task
          </Link>
        </div>
        <div className="row">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task._id} className="col-12 col-sm-6 col-md-4 mb-4">
                <div
                  className={`card h-100 ${
                    darkMode ? "bg-secondary text-light" : ""
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text">{task.description}</p>
                    <p className="mb-1">
                      <FaTasks className="me-2" />
                      <strong>Status:</strong> {task.status}
                    </p>
                    <p className={`mb-1 ${getPriorityColor(task.priority)}`}>
                      <FaFlag className="me-2" />
                      <strong>Priority:</strong> {task.priority}
                    </p>
                    <p className="mb-1">
                      <FaCalendarAlt className="me-2" />
                      <strong>Due Date:</strong>{" "}
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <FaUser className="me-2" />
                      <strong>Assigned To:</strong>{" "}
                      {task.assigned_to?.username || "Unassigned"}
                    </p>
                    <div className="d-flex justify-content-between mt-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditTask(task._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
