import React from 'react'
import Roster from './Roster'
import logo from './assets/ash and pikachus training board.png'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6 p-6">
      <img src={logo}/>
      <Roster/>
    </div>
  )
}

export default App
