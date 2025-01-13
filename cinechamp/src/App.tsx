import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Profile from './user-profile/profile';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='App'>
        <Profile img={reactLogo} nick="Juan" ubicacion="Barcelona" grupo="Latinos" />

        {/* main */}

        {/* etiqueta footer */}
      </div>
    </>
  )
}

export default App
