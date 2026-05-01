import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidationNotice = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-red-500/15 border-2 border-red-500/30 rounded-2xl p-4 mb-6 flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="p-2 bg-red-500/30 rounded-xl text-red-500 mt-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-1 drop-shadow-sm">Random Input Detected</h4>
              <p className="text-xs text-text-heading leading-relaxed max-w-sm font-medium">
                One or more values look like random inputs (e.g., pH outside 1-14).
                The system knows it's random, but you can continue to use the app and make predictions.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValidationNotice;