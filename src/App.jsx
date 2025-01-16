import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'


import Videoo from './pages/video/Videoo';

const App = () => {
  const [sidebar,setSidebar] = useState(true)
  return (
    <div>
      <Navbar setSidebar={setSidebar}/>
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar}/>}/>
        <Route path='/video/:categoryId/:videoId' element={<Videoo/>}/>
      </Routes>
    </div>
  )
}

export default App