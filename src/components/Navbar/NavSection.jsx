// NavSection.jsx
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./Nav.css";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "works", label: "Works" },
  { id: "contact", label: "Contact" },
];

/* 0.07s per letter — replaces the .letter:nth-child(n) delay chain */
const LETTER_STAGGER = 0.07;

/** Two identical copies of the word, letter by letter, for the roll effect */
function StaggeredText({ text }) {
  const letters = Array.from(text);

  return (
    <>
      {[0, 1].map((copy) => (
        <div className="nav-block" key={copy} aria-hidden="true">
          {letters.map((char, i) => (
            <span
              key={i}
              className="letter"
              style={{ transitionDelay: `${i * LETTER_STAGGER}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

function NavSection({ lenis = null }) {
  const [activeId, setActiveId] = useState(LINKS[0].id);
  const location = useLocation();
  const navigate = useNavigate();

  /* Track which section is in view (keeps aria-current in sync) */
  useEffect(() => {
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(
      Boolean
    );
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Lenis when available, native smooth scroll otherwise */
  const handleNavigate = useCallback(
    (event, id) => {
      const target = document.getElementById(id);
      if (!target) {
        if (location.pathname !== "/") {
          event.preventDefault();
          navigate(`/#${id}`);
        }
        return;
      }

      event.preventDefault();
      setActiveId(id);

      if (typeof lenis?.scrollTo === "function") {
        lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      } else {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }

      window.history.replaceState(null, "", `#${id}`);
    },
    [lenis, location.pathname, navigate]
  );

  return (
    <nav className="nav-section" aria-label="Main navigation">
      <div className="nav-list">
        {LINKS.map(({ id, label }) => {
          const isActive = location.pathname === "/" && activeId === id;

          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(event) => handleNavigate(event, id)}
              aria-current={isActive ? "page" : undefined}
              className={`nav-link ${isActive ? "is-active" : ""}`}
            >
              {/* Real, readable label for screen readers */}
              <span className="sr-only">{label}</span>
              <StaggeredText text={label} />
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default NavSection