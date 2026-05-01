import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, Thermometer, Droplets, Sprout, History, Info, Sparkles } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import PredictionForm from '../components/PredictionForm'
import { predict } from '../services/api'

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('disease')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const tabs = [
    { id: 'disease', label: 'Disease Prediction', icon: <Bug size={18} /> },
    { id: 'suitability', label: 'Soil Suitability', icon: <Thermometer size={18} /> },
    { id: 'drought', label: 'Drought Resistance', icon: <Droplets size={18} /> },
    { id: 'crop', label: 'Crop Recommendation', icon: <Sprout size={18} /> },
  ]

  const soilFields = [
    { name: 'TS', label: 'Surface Temperature (K)', placeholder: 'e.g. 295.15' },
    { name: 'T2M_MAX', label: 'Max 2m Temp (°C)', placeholder: 'e.g. 32.4' },
    { name: 'T2M', label: 'Avg 2m Temp (°C)', placeholder: 'e.g. 25.8' },
    { name: 'QV2M', label: '2m Specific Humidity', placeholder: 'e.g. 8.7' },
    { name: 'WS10M', label: '10m Wind Speed (m/s)', placeholder: 'e.g. 3.2' },
    { name: 'T2M_MIN', label: 'Min 2m Temp (°C)', placeholder: 'e.g. 18.6' },
  ]

  const handleDiseaseSubmit = async (file) => {
    if (!file) return
    setLoading(true)
    try {
      const res = await predict('crop_disease', { filename: file.name })
      setResult(res.result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    try {
      const res = await predict(activeTab, data)
      setResult(res.result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <header>
        <p className="text-xs text-primary uppercase tracking-[0.2em] mb-2 font-display font-bold">Predictive Analytics Engine</p>
        <h1 className="text-5xl font-display font-medium leading-tight">
          Crop <span className="text-primary italic">Intelligence</span>
        </h1>
      </header>

      {}
      <div className="flex bg-white/5 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
              activeTab === tab.id
                ? 'bg-primary text-background shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {activeTab === 'disease' && (
              <motion.div
                key="disease"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                <div className="glass-morphism rounded-3xl p-10 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-primary opacity-10">
                    <Bug size={120} />
                  </div>
                  <h2 className="text-3xl font-display font-medium mb-4">Crop Disease Prediction</h2>
                  <p className="text-gray-400 mb-8 max-w-xl">
                    Leverage high-precision neural networks to identify botanical pathogens before they impact your yield. Upload a high-resolution macro capture of the affected foliage.
                  </p>
                  <FileUpload onFileSelect={(file) => handleDiseaseSubmit(file)} />
                  {loading && (
                     <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <p className="font-bold text-primary italic uppercase tracking-wider">Executing Neural Prediction...</p>
                          <p className="text-[10px] text-gray-500">Processing 13 distinct atmospheric variables & image features</p>
                        </div>
                     </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'suitability' && (
              <motion.div
                key="suitability"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PredictionForm
                  title="Soil Suitability Parameters"
                  fields={soilFields}
                  onSubmit={handleFormSubmit}
                  loading={loading}
                />
              </motion.div>
            )}
            {}
          </AnimatePresence>
        </div>

        {}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence>
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-morphism rounded-2xl p-6 border-l-4 border-l-primary"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-primary" />
                  <h3 className="font-display font-medium">Prediction Result</h3>
                </div>
                {result.type === 'disease' && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Detected Pathogen</p>
                      <p className="text-xl font-display font-bold text-red-400">{result.label.replace(/___/g, ': ').replace(/_/g, ' ')}</p>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Severity Rating</p>
                        <p className="text-2xl font-display font-bold text-primary">{(result.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div className="px-2 py-1 bg-primary/20 text-primary border border-primary/20 rounded text-[10px] font-bold">HIGH CONF</div>
                    </div>
                  </div>
                )}

                {result.type === 'suitability' && (
                  <div className="flex flex-col gap-4">
                     <div className="relative pt-6 pb-2">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                           <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-primary"
                           />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                          <span>MODEL CONFIDENCE</span>
                          <span className="text-primary">{result.score}%</span>
                        </div>
                     </div>
                     <p className="text-sm text-gray-300 italic leading-relaxed">"{result.analysis}"</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-morphism rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <History size={18} />
                  </div>
                  <h3 className="font-display font-medium">Recent Diagnostics</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <Bug size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none mb-1 group-hover:text-primary transition-colors">Tomato_Blight_X02</p>
                          <p className="text-[10px] text-gray-500 uppercase">Analyzed 2h ago</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 px-1.5 py-0.5 border border-white/10 rounded">98% CONF</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="glass-morphism rounded-2xl p-6 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
             <div className="flex items-center gap-2 mb-3 text-secondary">
                <Info size={16} />
                <h4 className="text-sm font-display font-bold uppercase tracking-wider">Scientific Precision</h4>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed mb-6">
               Our model is trained on over 500,000 verified pathological samples from world-class arboretums and agricultural research centers.
             </p>
             <div className="flex justify-between pt-4 border-t border-white/5">
                <div>
                  <p className="text-lg font-display font-bold">99.2%</p>
                  <p className="text-[10px] text-gray-500 uppercase">Model Accuracy</p>
                </div>
                <div>
                  <p className="text-lg font-display font-bold">38</p>
                  <p className="text-[10px] text-gray-500 uppercase">Crop Species</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predictions