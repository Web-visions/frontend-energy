import { Batteries, Header, SliderComponent, Companies, InverterSect, AboutUs, Location, Testimonial, Footer } from '../Components'

const Home = () => {
  return (
    <div className='mt-24'>

        <SliderComponent/>
        <Batteries/>
        <Companies/>
        <InverterSect/>
        <AboutUs/>
        <Location/>
        <Testimonial/>
    </div>
  )
}

export default Home