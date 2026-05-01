import React from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-white pt-16 selection:bg-primary selection:text-background">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-6 lg:p-10 max-w-[1600px] mx-auto"
      >
        {children}
      </motion.main>
    </div>
  )
}

export default PageWrapper