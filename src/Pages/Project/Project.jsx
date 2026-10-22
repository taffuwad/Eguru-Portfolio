import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import ProjectCard from './ProjectCard'
import Navbar from '../../components/Navbar/Navbar'
import End from '../../components/End/End'
import vid1 from '../../assets/videos/vid1.mp4'


const Projects = () => {

  const projects = [{
    image1: 'https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg',
    image2: 'https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg'
  }, {
    image1: 'https://k72.ca/uploads/caseStudies/OKA/OKA_thumbnail-1280x960.jpg',
    image2: 'https://k72.ca/uploads/caseStudies/Opto/thumbnailimage_opto-1280x960.jpg'
  }, {
    image1: 'https://plus.unsplash.com/premium_photo-1774404553612-32e2dfeb7603?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    image2: 'https://plus.unsplash.com/premium_photo-1774404553664-60a58a7a4075?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  }]


  gsap.registerPlugin(ScrollTrigger)

  useGSAP(function () {
    gsap.from('.hero', {
      height: '100px',
      stagger: {
        amount: 0.4
      },
      scrollTrigger: {
        trigger: '.lol',
        start: 'top 100%',
        end: 'top -150%',
        scrub: true
      }
    })
  })

  return (
    <>
      <Navbar />
      <main className='lg:p-4 p-2'>
        <div className='pt-[45vh]'>
          <h2 className='font-[font2] lg:text-[9.5vw] text-7xl uppercase'>Projets</h2>
        </div>
        <div className='-lg:mt-20 lol'>
          {projects.map(function (elem, idx) {
            return <div key={idx} className='hero w-full lg:h-[850px] mb-4 flex lg:flex-row flex-col lg:gap-4 gap-2'>
              <ProjectCard image1={elem.image1} image2={elem.image2} />
            </div>
          })}
        </div>
        <div className="pro-vid h-[80vh] w-full">
          <video
            className='h-full w-full object-cover'
            src={vid1}
            loop
            muted
            autoPlay
            playsInline
            preload="metadata"
          />
        </div>
      </main>
      <End />
    </>
  )
}

export default Projects