import React from 'react'
import Background from './components/Background'
import Foreground from './components/Foreground'
// Remember to update the Foreground component to remove the filesize display

function App() {
  return (
    <div className='relative w-full h-screen bg-zinc-800 font-sf-pro-display'>
      <Background />
      <Foreground />
    </div>
  )
}

export default App