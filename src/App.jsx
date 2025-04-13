import React from 'react'
import Roster from './Roster'
import logo from './assets/ash and pikachus training board.png'
import bg from './assets/pokemonbgredfade.png'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6 p-6" 
    style={{
      backgroundImage: `url(${bg})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '30rem 30rem', 
    }}
    
>
      <img src={logo}/>
      <Roster/>
    </div>
  )
}

export default App
