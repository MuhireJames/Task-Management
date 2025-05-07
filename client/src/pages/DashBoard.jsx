import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { api } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DashBoard() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // State to store current user
  const navigate = useNavigate();
  const socket = io("http://localhost:5100"); // Replace with your backend URL

  // Fetch current user
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

  // Fetch tasks from the backend
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

    // Listen for task assignment notifications
    socket.on("taskAssigned", (task) => {
      toast.info(`New task assigned: ${task.title}`);
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStatusChange = (e) => setFilterStatus(e.target.value);
  const handlePriorityChange = (e) => setFilterPriority(e.target.value);

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesPriority = filterPriority
      ? task.priority === filterPriority
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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
    if (!currentUser?.isAdmin) {
      toast.warn("Only admins can delete tasks.");
      return;
    }

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

  return (
    <div>
      {/* NavBar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/dashboard">
            Task Manager
          </Link>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search tasks"
              aria-label="Search"
              value={search}
              onChange={handleSearchChange}
            />
          </form>
          <div className="d-flex align-items-center">
            <select
              className="form-select me-3" // Added spacing here
              value={filterStatus}
              onChange={handleStatusChange}
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
            <select
              className="form-select me-3" // Added spacing here
              value={filterPriority}
              onChange={handlePriorityChange}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {currentUser && (
              <span className="me-3">
                {" "}
                {/* Added spacing here */}
                Hello, <strong>{currentUser.username}</strong>
              </span>
            )}
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome Message */}
      <div className="container mt-4">
        <div className="alert alert-success text-center">
          Welcome to the Task Manager Dashboard!
        </div>
      </div>

      {/* Body */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Assigned Tasks</h2>
          <Link to="/create-task" className="btn btn-primary">
            Add Task
          </Link>
        </div>
        <div className="row">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id || task._id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text">{task.description}</p>
                    <p className="mb-1">
                      <strong>Status:</strong> {task.status}
                    </p>
                    <p className="mb-1">
                      <strong>Priority:</strong> {task.priority}
                    </p>
                    <p className="mb-1">
                      <strong>Due Date:</strong>{" "}
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Assigned To:</strong>{" "}
                      {task.assigned_to?.username || "Unassigned"}
                    </p>
                    <div className="d-flex justify-content-between mt-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditTask(task.id || task._id)}
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
