import PlantButton from "./MoreBtn";
import ProCards from "./ProCards";
import "./Works.css";

const Works = () => {
  return (
    <section id="works" className="works">
      <header className="works-header">
        <h1 className="works-title">Works</h1>
      </header>
      <ProCards />
      <div className="see-more-con">
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