import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./Nav.css";

const LINKS = [
  { id: "home", label: "Home", number: "01" },
  { id: "about", label: "About", number: "02" },
  { id: "works", label: "Works", number: "03" },
  { id: "contact", label: "Contact", number: "04" },
];

const FullscreenNav = ({ isOpen, onClose }) => {
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (event, id) => {
    if (document.getElementById(id)) return;

    if (location.pathname !== "/") {
      event.preventDefault();
      onClose();
      navigate(`/#${id}`);
    }
  };

  useGSAP(
    () => {
      const nav = navRef.current;
      const links = nav.querySelectorAll(".fullscreen-nav-link");
      gsap.set(nav, { autoAlpha: 0, yPercent: 100, pointerEvents: "none" });
      gsap.set(links, { autoAlpha: 0, yPercent: 60 });
      return () => {
        gsap.killTweensOf([nav, ...links]);
      };
    },
    { scope: navRef }
  );

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const links = nav.querySelectorAll(".fullscreen-nav-link");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      gsap.killTweensOf([nav, ...links]);
      gsap.set(nav, {
        autoAlpha: isOpen ? 1 : 0,
        yPercent: isOpen ? 0 : 100,
        pointerEvents: isOpen ? "auto" : "none",
      });
      gsap.set(links, {
        autoAlpha: isOpen ? 1 : 0,
        yPercent: 0,
      });
      return;
    }

    if (isOpen) {
      gsap.killTweensOf([nav, ...links]);
      gsap.set(nav, { pointerEvents: "auto" });
      gsap
        .timeline()
        .to(nav, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.75,
          ease: "power4.inOut",
        })
        .to(
          links,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.35"
        );
    } else {
      gsap.killTweensOf([nav, ...links]);
      if (gsap.getProperty(nav, "autoAlpha") === 0) return;

      gsap
        .timeline()
        .to(links, {
          autoAlpha: 0,
          yPercent: -20,
          duration: 0.65,
          stagger: 0.04,
          ease: "power2.in",
        })
        .to(
          nav,
          {
            autoAlpha: 0,
            yPercent: 100,
            pointerEvents: "none",
            duration: 0.55,
            ease: "power3.inOut",
          },
          "-=0.2"
        );
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={navRef}
      className="fullscreen-nav"
      id="fullscreen-navigation"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <nav className="fullscreen-nav-content" aria-label="Main navigation">

        <div className="fullscreen-nav-links">
          {LINKS.map(({ id, label }) => (
            <a
              className="fullscreen-nav-link"
              href={`#${id}`}
              key={id}
              onClick={(event) => {
                onClose();
                handleNavigate(event, id);
              }}
            >
              <span>{label}</span>
              
            </a>
          ))}
        </div>

      </nav>
    </div>
  );
};

export default FullscreenNav;