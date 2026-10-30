import Logo from '../Navbar/Logo'
import { useLocation, useNavigate } from 'react-router'
import './End.css'

const End = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionNavigation = (event, id) => {
    if (document.getElementById(id)) return;

    if (location.pathname !== "/") {
      event.preventDefault();
      navigate(`/#${id}`);
    }
  };

  return (
    <footer  className="footer">
      <div className="footer-main">
        <div className="footer-brand footer-reveal">
          <Logo />
          
        </div>

        <nav className="footer-column footer-reveal" aria-label="Footer navigation">
          <span className="footer-label">Explore</span>
          <a href="#home" onClick={(event) => handleSectionNavigation(event, "home")}>Home</a>
          <a href="#about" onClick={(event) => handleSectionNavigation(event, "about")}>About</a>
          <a href="#works" onClick={(event) => handleSectionNavigation(event, "works")}>Works</a>
          <a href="#contact" onClick={(event) => handleSectionNavigation(event, "contact")}>Contact</a>
        </nav>

        <div className="footer-column footer-reveal">
          <span className="footer-label">Find me</span>
          <a 
            href="https://wa.me/8801920409685?text=Hello%20Fuwad%2C%20I%20want%20to%20work%20with%20you."
            target="_blank"
            rel="noopener noreferrer"
          >Whatsapp</a>
          <a href="#home">LinkedIn</a>
          <a href="#home">GitHub</a>
          <a href="#home">Facebook</a>
        </div>
      </div>

      <div className="footer-bottom footer-reveal">
        <span>© 2026 | Eguru</span>
        <span>Privacy Policy | fuwadtalukderdev@gmail.com</span>
        <span>Fuwad Talukder</span>
      </div>
    </footer>
  )
}

export default End
