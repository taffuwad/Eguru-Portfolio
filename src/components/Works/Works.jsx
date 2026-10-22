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
        <PlantButton />
      </div>
    </section>
  );
};

export default Works;