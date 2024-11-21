"use client"
import { motion } from "motion/react"

const HeroPage = () => {
  return (
    <motion.div
      initial={{ y: 500 }}
      animate={{ y: 0 }}
      className="w-full h-full p-4">
        <h1 className="font-bold text-9xl text-center">Image Colors Extractor</h1>

    </motion.div>
  )
}

export default HeroPage
