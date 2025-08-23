import { useEffect } from 'react'
import { Batteries, Header, SliderComponent, Companies, InverterSect, AboutUs, Location, Testimonial, Footer } from '../Components'
import ProductFinder from '../Components/ProductFinder'

const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className='mt-0'>

      <SliderComponent />
      <ProductFinder />
      <Batteries />
      <Companies />
      <InverterSect />
      <AboutUs />
      <Location />
      <Testimonial />
    </div>
  )
}

export default Home