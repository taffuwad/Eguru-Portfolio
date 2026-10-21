import { useState } from "react";
import Logo from "./Logo";
import "./Nav.css";
import NavSection from "./NavSection";
import Menu from "./Menu";
import FullscreenNav from "./FullscreenNav";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <Logo />
        <NavSection />
        <Menu
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((open) => !open)}
        />
      </header>
      <FullscreenNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;