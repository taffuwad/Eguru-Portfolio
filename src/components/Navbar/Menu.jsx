import "./Nav.css";

const Menu = ({ isOpen, onToggle }) => {
  return (
    <div className="menu">
      <button
        className={`menu-toggle${isOpen ? " is-open" : ""}`}
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="fullscreen-navigation"
        onClick={onToggle}
      >
        <span />
        <span />
      </button>
    </div>
  );
};

export default Menu;