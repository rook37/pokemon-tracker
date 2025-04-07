import React from 'react'
import Home from './Home'
import Roster from './Roster'
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6 p-6">
      <h1 className="text-4xl font-bold text-blue-600">Team Pokemon's Training Board</h1>
      <Roster/>
    </div>
  )
}

export default App
