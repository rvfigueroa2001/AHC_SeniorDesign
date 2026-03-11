// src/pages/Home.jsx
import { useState } from "react";
import ApplicationModal from "../components/ApplicationModal";
import FooterMap from "../components/FooterMap";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* HERO */}
      <header
        className="vh-100 d-flex align-items-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('https://3das.com/wp-content/uploads/2024/01/1a-neighborhood_typical-1545x1030.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Affordable Housing</h1>

          <div className="d-inline-flex flex-column align-items-center gap-3">
            <button
              type="button"
              className="btn btn-lg btn-primary px-5"
              onClick={() => setShowModal(true)}
            >
              Start Application
            </button>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-5 main_sec">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#1f2937" }}>
              How does it work?
            </h2>
            <p style={{ color: "#374151" }} className="mb-0">
              Quick guide for new users, just following this three simple steps.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="glass-card">
                <h5 className="fw-bold" style={{ color: "#1f2937" }}>
                  1) Tell Us About Your Situation
                </h5>
                <p style={{ color: "#4b5563" }}>
                  Fill a simple form with income, family size, and location.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-card">
                <h5 className="fw-bold" style={{ color: "#1f2937" }}>
                  2) Get Recommendations
                </h5>
                <p style={{ color: "#4b5563" }}>
                  Receive program and housing matches based on your eligibility.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="glass-card">
                <h5 className="fw-bold" style={{ color: "#1f2937" }}>
                  3) Connect & Apply
                </h5>
                <p style={{ color: "#4b5563" }}>
                  Contact organizations directly and save your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <FooterMap />

      {/* GET UPDATES */}
      <section id="updates" className="py-5 main_sec">
        <div className="container">
          <div className="glass-card">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-lg-6">
                <h3 className="fw-bold mb-1" style={{ color: "#1f2937" }}>
                  Get Updates
                </h3>
                <p className="mb-0" style={{ color: "#4b5563" }}>
                  News on programs, new units, and housing tips.
                </p>
              </div>

              <div className="col-12 col-lg-6">
                <form
                  className="d-flex flex-column flex-sm-row gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Subscription sent");
                  }}
                >
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email address"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>

                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="consent"
                    required
                  />
                  <label
                    className="form-check-label"
                    htmlFor="consent"
                    style={{ color: "#4b5563" }}
                  >
                    I agree to receive email updates. I can unsubscribe at any
                    time.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <ApplicationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
}