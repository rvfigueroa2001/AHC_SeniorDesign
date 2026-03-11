import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

function LoginPanel({ isOpen, onClose }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("login-open");
      setTimeout(() => setPanelOpen(true), 10);
    } else {
      document.body.classList.remove("login-open");
      setPanelOpen(false);
    }

    return () => document.body.classList.remove("login-open");
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (!formData.email || !formData.password) {
        setError("Please enter your email and password.");
        setLoading(false);
        return;
      }

      setError("Invalid username or password.");
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      <div
        className={`login-backdrop ${panelOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`login-panel ${panelOpen ? "open" : ""}`}>
        <div className="login-panel-inner">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 fw-bold">Welcome back</h2>
              <p className="mb-0 login-subtext">
                Sign in to continue your housing journey.
              </p>
            </div>

            <Button
              variant="outline-light"
              className="rounded-pill px-3"
              onClick={onClose}
            >
              Close
            </Button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                type="button"
                variant="outline-light"
                className="rounded-pill px-4"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="rounded-pill px-4"
                disabled={loading}
              >
                {loading ? "Loading..." : "Log In"}
              </Button>
            </div>
          </Form>
        </div>
      </aside>
    </>
  );
}

export default LoginPanel; 