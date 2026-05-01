import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, MoreVertical, Bug, Thermometer, Droplets, Sprout, Calendar } from 'lucide-react'

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const reports = [
    { id: 1, type: 'disease', title: 'Corn Northern Leaf Blight', date: '2026-03-27 14:20', status: 'High Severity', confidence: '99%' },
    { id: 2, type: 'suitability', title: 'Soil Nutrient Analysis', date: '2026-03-26 10:15', status: 'Excellent', confidence: '94%' },
    { id: 3, type: 'drought', title: 'Seasonal Drought Risk', date: '2026-03-25 16:45', status: 'Moderate', confidence: '78%' },
    { id: 4, type: 'crop', title: 'Q2 Planting Strategy', date: '2026-03-24 09:30', status: 'Optimized', confidence: '88%' },
    { id: 5, type: 'disease', title: 'Potato Late Blight Scan', date: '2026-03-23 11:20', status: 'Low Risk', confidence: '92%' },
  ]

  const getIcon = (type) => {
    switch(type) {
      case 'disease': return <Bug size={16} />;
      case 'suitability': return <Thermometer size={16} />;
      case 'drought': return <Droplets size={16} />;
      case 'crop': return <Sprout size={16} />;
      default: return <FileText size={16} />;
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-xs text-primary uppercase tracking-[0.2em] mb-2 font-display font-bold">Historical Data Repository</p>
          <h1 className="text-5xl font-display font-medium leading-tight">
            Analytical <span className="text-primary italic">Reports</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white">
            <Filter size={20} />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-background rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg shadow-primary/10">
            <Download size={18} />
            EXPORT ALL
          </button>
        </div>
      </header>

      <div className="glass-morphism rounded-3xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Analysis Type</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Report Title</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status / Result</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence</th>
              <th className="px-8 py-6 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-none"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-primary transition-colors`}>
                      {getIcon(report.type)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">{report.type}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-medium text-gray-200">{report.title}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    {report.date}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    report.status.includes('High') || report.status.includes('Moderate')
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 group-hover:bg-primary transition-all" style={{ width: report.confidence }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">{report.confidence}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 text-gray-400">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className="p-8 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
          <p className="text-xs text-gray-500">Showing <span className="text-gray-300 font-bold">5</span> of <span className="text-gray-300 font-bold">128</span> reports</p>
          <div className="flex gap-2">
            {[1, 2, 3, '...', 12].map((p, i) => (
              <button key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${p === 1 ? 'bg-primary text-background' : 'hover:bg-white/10 text-gray-500 hover:text-white'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports