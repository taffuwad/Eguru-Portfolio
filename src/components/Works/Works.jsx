import { useNavigate } from "react-router";
import PlantButton from "./MoreBtn";
import ProCard2 from "./ProCard2";
import ProCards from "./ProCards";
import "./Works.css";

const Works = () => {

  const navigate = useNavigate();

  return (
    <section id="works" className="works">
      <header className="works-header">
        <h1 className="works-title">Works</h1>
      </header>
      <ProCards />
      <ProCard2 />
      <div onClick={() => navigate("/projects")} className="see-more-con">
        <PlantButton
          className="see-more-button"
          data-scroll
          data-scroll-speed="0.3"
        />
      </div>
    </section>
  );
};

export default Works;