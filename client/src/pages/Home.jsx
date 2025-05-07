import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container text-center p-5 bg-white shadow rounded">
        <h2 className="mb-4">Welcome to the Task Management App</h2>
        <p className="mb-4">
          Manage your tasks efficiently and stay organized with our Task
          Management App. Whether you're working on a project or managing your
          daily task allocation, our app helps you stay on top of your tasks
          with ease.
        </p>
        <div>
          <button
            className="btn btn-primary btn-lg me-3"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
