import React from 'react'

// Componente principal que muestra un mensaje de bienvenida
function Welcome({ nombre }: { nombre: string }) {
  return <h1>¡Bienvenido, {nombre}!</h1>
}

function App() {
  return (
    <div>
      <Welcome nombre="Mundo" />
    </div>
  )
}

export default App
