import React from 'react'
import { Contact, Help, Home, Login, Payment, ProductPage, Services, Signup } from './pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer, Header } from './Components'
import AddtoCartPage from './pages/AddtoCartPage'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<ProductPage/>}/>
          <Route path='/cart' element={<AddtoCartPage/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/log-in' element={<Login/>}/>
          <Route path='/sign-in' element={<Signup/>}/>
          <Route path='/services' element={<Services/>}/>
          <Route path='/help' element={<Help/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App