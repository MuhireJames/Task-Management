import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center p-5 bg-white shadow rounded">
        <h2 className="mb-4">
          <span className="text-primary">Welcome</span> to the{" "}
          <span className="text-success">Task Management App</span>
        </h2>
        <p className="mb-4">
          <span>Manage your tasks efficiently</span> and{" "}
          <span>stay organized</span> with our Task Management App. Whether
          you're working on a project or managing your daily tasks, our app
          helps you <span>stay on top of your tasks</span> with ease.
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
