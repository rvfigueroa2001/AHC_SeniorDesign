import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar as BSNavbar, Button } from "react-bootstrap";

function Navbar({ onOpenLogin, onOpenSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const handleScroll = () => {
      let current = "";
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        if (
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <BSNavbar
      expand="lg"
      fixed="top"
      className={`header ${scrolled ? "scrolled" : ""}`}
    >
      <Container fluid>
        <BSNavbar.Brand as={Link} to="/">
          AffordaHouse
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar" />

        <BSNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto gap-4 align-items-center">
            <Nav.Link
              onClick={() => scrollTo("how-it-works")}
              className={activeSection === "how-it-works" ? "active" : ""}
            >
              How it Works
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollTo("resources")}
              className={activeSection === "resources" ? "active" : ""}
            >
              Resources
            </Nav.Link>

            <Nav.Link
              onClick={() => scrollTo("contact")}
              className={activeSection === "contact" ? "active" : ""}
            >
              Contact
            </Nav.Link>

            <Button
              type="button"
              className="nav-link"
              onClick={onOpenLogin}
            >
              Log In
            </Button>

            <Button
              type="button"
              className="nav-link"
              onClick={onOpenSignup}
            >
              Sign Up
            </Button>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;