import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import imgperfil from './assets/images-perfil/perfil-example.jpg'

import Profile from './user-profile/profile';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='App'>
        <Profile img={imgperfil} nick="Juan" ubicacion="Barcelona" grupo="Sin grupo" />

        {/* main */}

        {/* etiqueta footer */}
      </div>
    </>
  )
}

export default App
