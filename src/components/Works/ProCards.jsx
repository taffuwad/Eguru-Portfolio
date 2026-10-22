import { useEffect, useState } from "react";

const PROJECTS = [
  { name: "Restaurant", className: "card-restaurant", speed: "0.2" },
  { name: "Shop", className: "card-shop", speed: "0.3" },
  { name: "Real estate", className: "card-real-estate", speed: "0.4" },
  { name: "Restaurant concept", className: "card-restaurant-concept", speed: "0.5" },
];

const ProCards = () => {
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
    <div className="works-gallery cursor-pointer">
      {PROJECTS.map(({ name, className, speed }) => (
        <article
          key={className}
          className={`pro-card ${className}`}
          aria-label={name}
          {...(enableParallax
            ? { "data-scroll": "", "data-scroll-speed": speed }
            : {})}
        />
      ))}
    </div>
  );
};

export default ProCards;
