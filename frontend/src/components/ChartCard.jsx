import React from 'react'
import { motion } from 'framer-motion'
import { Maximize2, MoreHorizontal } from 'lucide-react'

const ChartCard = ({ title, subtitle, children, icon: Icon, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-morphism rounded-2xl p-6 flex flex-col gap-4 group hover:border-white/20 transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-display font-semibold text-gray-200">{title}</h3>
            {Icon && <Icon size={16} className="text-primary opacity-60" />}
          </div>
          {subtitle && <p className="text-xs text-gray-400 uppercase tracking-wider">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <Maximize2 size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-[220px]">
        {children}
      </div>
    </motion.div>
  )
}

export default ChartCard