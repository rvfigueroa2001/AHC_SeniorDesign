import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPanel from "./components/LoginPanelRevised";
import SignupModal from "./components/SignupModal";
import Home from "./pages/Home";
import Results from "./pages/Results";

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSignup={() => setIsSignupOpen(true)}
        />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>

        <Footer />

        <LoginPanel
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />

        <SignupModal
          show={isSignupOpen}
          handleClose={() => setIsSignupOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}