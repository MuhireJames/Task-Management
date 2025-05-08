import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`, { withCredentials: true });
        setTask(res.data);
      } catch (err) {
        toast.error("Failed to fetch task.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/tasks/${id}`, task, { withCredentials: true });
      toast.success("Task updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <ClipLoader color="#007bff" size={50} />
      </div>
    );
  }

  if (!task) return <p>Task not found</p>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header text-center bg-primary text-white">
              <h2>Edit Task</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      id="status"
                      className="form-select"
                      name="status"
                      value={task.status}
                      onChange={handleChange}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="form-select"
                      name="priority"
                      value={task.priority}
                      onChange={handleChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="due_date" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="due_date"
                    className="form-control"
                    name="due_date"
                    value={task.due_date?.slice(0, 10)}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Update Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
