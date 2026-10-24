import './home.css'

const Home = () => {
  return (
    <div
      id="home"
      className='home z-10 relative h-screen w-full flex justify-center items-end'
    >
      <p className="hpara absolute left-20 top-40 ">
        I’m a full-stack developer based in Bangladesh, drawn to where<br></br>
        design meets functionality. I build digital experiences and<br></br>
        AI-powered automations that solve real problems.
      </p>
      <div className='home-copy text-text-light uppercase text-center font-main font-bold'>
        <h1>Every great trick</h1>
        <h1>has three</h1>
        <h1>parts.Your website</h1>
        <h1>is the Prestige.</h1>
      </div>
    </div>
  )
}

export default Home