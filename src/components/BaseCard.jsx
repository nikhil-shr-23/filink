import React from 'react'
import { motion } from "framer-motion"

function BaseCard({ data, reference, children }) {
  return (
    <motion.div 
      drag 
      dragConstraints={reference} 
      whileHover={{scale: 1.05}} 
      dragElastic={0.2} 
      dragTransition={{bounceStiffness: 300, bounceDamping: 20}}
      className='flex-shrink-0 relative w-60 h-72 bg-zinc-900/90 rounded-[45px] text-white py-10 px-8 overflow-hidden'
    >
      <h3>{data.title}</h3>
      <p>{data.desc}</p>
      {children}
    </motion.div>
  )
}

export default BaseCard