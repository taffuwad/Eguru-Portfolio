import { useEffect, useState } from "react";
import './ProCard2.css'

const PROJECTS = [
  { name: "Restaurant2", className: "card-restaurant2", speed: "-0.1" },
  { name: "Shop2", className: "card-shop2", speed: "-0.13" },
  { name: "Real estate2", className: "card-real-estate2", speed: "-0.18" },
  { name: "Restaurant concept2", className: "card-restaurant-concept2", speed: "-0.2" },
];

const ProCard2 = () => {
  const [enableParallax, setEnableParallax] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1025px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");
    const updateParallax = (event) => setEnableParallax(event.matches);

    mediaQuery.addEventListener("change", updateParallax);
    return () => mediaQuery.removeEventListener("change", updateParallax);
  }, []);

  return (
    <div className="works-gallery2 cursor-pointer">
      {PROJECTS.map(({ name, className, speed }) => (
        <article
          key={className}
          className={`pro-card2 ${className}`}
          aria-label={name}
          {...(enableParallax
            ? { "data-scroll": "", "data-scroll-speed": speed }
            : {})}
        />
      ))}
    </div>
  );
};

export default ProCard2;
