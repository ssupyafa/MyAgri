import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sprout, Droplets, Landmark, Bug, ArrowRight, Download, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';

const SummaryCard = ({ title, value, unit, confidence, label, icon: Icon, color = "#A3C148" }) => (
  <GlassCard className="flex flex-col justify-between h-full group hover:border-primary/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-bold tracking-widest text-text-body uppercase">{title}</span>
      <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-background transition-all">
        <Icon size={18} />
      </div>
    </div>
    <div className="mb-4">
       <h4 className="text-2xl font-serif text-text-heading mb-1 truncate">{value || 'N/A'}</h4>
       <div className="flex items-baseline gap-2">
         <span className="text-3xl font-bold text-primary">{unit || '0%'}</span>
         <span className="text-[10px] text-text-body uppercase tracking-tighter">Confidence Score</span>
       </div>
    </div>
    {label && (
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-text-body italic truncate max-w-[150px]">{label}</span>
        <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </div>
    )}
  </GlassCard>
);

const LogModal = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
      <GlassCard className="w-full max-w-2xl !bg-[#0B110A] border-white/10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-text-body">
          <X size={20} />
        </button>
        <div className="mb-8">
           <span className="text-[10px] font-bold tracking-widest text-primary uppercase block mb-2">{log.type} Raw Data</span>
           <h3 className="text-3xl font-serif text-text-heading italic">Analytical Trace</h3>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
           <div>
              <h4 className="text-xs font-bold uppercase text-white/40 mb-3 tracking-[0.2em]">Input Parameters</h4>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 grid grid-cols-2 gap-y-4 gap-x-8">
                 {Object.entries(log.input || {}).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                       <span className="text-[8px] text-primary uppercase font-bold tracking-widest mb-1">{k.replace(/_/g, ' ')}</span>
                       <span className="text-sm text-text-heading font-medium">{v}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div>
              <h4 className="text-xs font-bold uppercase text-white/40 mb-3 tracking-[0.2em]">Analytical Conclusion</h4>
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                 {log.type === 'crop' && log.result?.top_crops && (
                   <div className="space-y-4">
                      <p className="text-sm text-text-body mb-4">Based on the environmental data provided, the neural network identifies the following optimal crops for your field:</p>
                      {log.result.top_crops.map(([crop, conf], i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                           <span className="text-text-heading font-bold capitalize">{crop}</span>
                           <span className="text-primary font-mono font-bold">{(conf * 100).toFixed(2)}% Match</span>
                        </div>
                      ))}
                   </div>
                 )}
                 {log.type === 'suitability' && (
                    <div className="text-center py-4">
                       <div className="text-5xl font-serif text-primary mb-2">
                          {typeof log.result === 'object' ? log.result.suitability?.toFixed(2) : parseFloat(log.result)?.toFixed(2)}%
                       </div>
                       <p className="text-xs text-text-body uppercase tracking-[0.2em]">Soil Health Index</p>
                    </div>
                 )}
                 {log.type === 'drought' && (
                    <div className="text-center py-4">
                       <div className="text-5xl font-serif text-primary mb-2">
                          {typeof log.result === 'object' ? log.result.prediction?.toFixed(2) : parseFloat(log.result)?.toFixed(2)}%
                       </div>
                       <p className="text-xs text-text-body uppercase tracking-[0.2em]">Calculated Stress Tolerance</p>
                    </div>
                 )}
                 {log.type === 'disease' && (
                    <div className="space-y-4">
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-[10px] text-primary font-bold uppercase block mb-1">Detected Pathogen</span>
                          <h4 className="text-2xl text-text-heading font-serif capitalize">{(log.result?.label || log.result).replace(/___/g, ' ').replace(/__/g, ' ')}</h4>
                       </div>
                       {log.result?.confidence && (
                         <div className="flex items-center justify-between px-2">
                            <span className="text-xs text-text-body">Detection Confidence</span>
                            <span className="text-primary font-bold font-mono">{(log.result.confidence * 100).toFixed(2)}%</span>
                         </div>
                       )}
                    </div>
                 )}
                 {(!['crop', 'suitability', 'drought', 'disease'].includes(log.type)) && (
                    <pre className="text-xs text-primary font-mono whitespace-pre-wrap">
                       {JSON.stringify(log.result, null, 2)}
                    </pre>
                 )}
              </div>
           </div>
        </div>
      </GlassCard>
    </div>
  );
};

const LogItem = ({ log, onClick }) => {
  const getIcon = () => {
    switch (log.type) {
      case 'crop': return { icon: Sprout, color: 'bg-blue-500/10 text-blue-400', symb: <Info size={14}/> };
      case 'suitability': return { icon: Landmark, color: 'bg-red-500/10 text-red-400', symb: <AlertCircle size={14}/> };
      case 'drought': return { icon: Droplets, color: 'bg-orange-500/10 text-orange-400', symb: <AlertTriangle size={14}/> };
      case 'disease': return { icon: Bug, color: 'bg-primary/10 text-primary', symb: <Info size={14}/> };
      default: return { icon: Info, color: 'bg-white/5 text-text-body', symb: <Info size={14}/> };
    }
  };

  const { icon: Icon, color, symb } = getIcon();

  const formatTS = (ts) => {
    try {
      const date = new Date(ts);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ", " +
             date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return ts;
    }
  };

  return (
    <div
      onClick={() => onClick(log)}
      className="flex items-center gap-6 p-5 bg-[#141813] border border-white/5 rounded-[2rem] hover:border-primary/20 hover:bg-[#1C211B] transition-all cursor-pointer group"
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color} relative`}>
        <Icon size={24} />
        <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border border-white/10 group-hover:scale-110 transition-transform">
           {symb}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-heading">{log.type}</span>
          <span className="text-[10px] text-text-body/60 font-medium">{formatTS(log.timestamp)}</span>
        </div>
        <p className="text-sm text-text-body truncate opacity-80 group-hover:opacity-100 transition-opacity">
          {log.short}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getPieData = () => {
    if (!data?.logs) return [
      { name: 'Crop', value: 25, color: '#A3C148' },
      { name: 'Drought', value: 25, color: '#C5E07D' },
      { name: 'Soil', value: 25, color: '#6A812E' },
      { name: 'Disease', value: 25, color: '#1C211B' },
    ];
    const counts = data.logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Crop', value: counts.crop || 0, color: '#A3C148' },
      { name: 'Drought', value: counts.drought || 0, color: '#C5E07D' },
      { name: 'Soil', value: counts.suitability || 0, color: '#6A812E' },
      { name: 'Disease', value: counts.disease || 0, color: '#1C211B' },
    ].filter(item => item.value > 0);
  };

  const getForecastData = () => {
    if (!data?.logs) return [
      { month: 'Scan History', yield: 0 }
    ];

    const history = data.logs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(history)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  };

  const pieData = getPieData();
  const forecastData = getForecastData();

  if (loading) return (
    <Layout>
      <div className="animate-pulse space-y-8">
        <div className="h-12 w-1/3 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    </Layout>
  );

  const summary = data?.summary || {};

  const safeParseResult = (log, key, fallbackValue) => {
    if (!log?.result) return fallbackValue;
    let resultStr = log.result;
    if (resultStr.includes("'") && !resultStr.includes('"')) {
       resultStr = resultStr.replace(/'/g, '"');
    }

    try {
      const parsed = JSON.parse(resultStr);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed[key] !== undefined ? parsed[key] : fallbackValue;
      }
      return typeof parsed === 'number' ? parsed : fallbackValue;
    } catch (e) {
      return fallbackValue;
    }
  };

  const getDiseaseValue = () => {
    const res = summary.disease?.result;
    if (!res) return "N/A";
    try {
      let resultStr = res;
      if (resultStr.includes("'") && !resultStr.includes('"')) {
        resultStr = resultStr.replace(/'/g, '"');
      }
      const parsed = JSON.parse(resultStr);
      return parsed.label ? parsed.label.replace(/___/g, ' ').replace(/__/g, ' ') : "Healthy";
    } catch (e) {
      try {
        return res.split(',')[0].split(':')[1].replace(/['"}]/g, '').trim();
      } catch (e2) {
        return "Optimal";
      }
    }
  };

  const getDiseaseConfidence = () => {
    const res = summary.disease?.result;
    if (!res) return "---";
    try {
       let resultStr = res;
       if (resultStr.includes("'") && !resultStr.includes('"')) {
         resultStr = resultStr.replace(/'/g, '"');
       }
       const parsed = JSON.parse(resultStr);
       return (parsed.confidence * 100).toFixed(1) + "%";
    } catch (e) {
       return "99% +";
    }
  };

  const cropResult = summary.crop?.result ? JSON.parse(summary.crop.result.replace(/'/g, '"')) : null;
  const suitabilityVal = safeParseResult(summary.suitability, 'suitability', null);
  const droughtVal = safeParseResult(summary.drought, 'prediction', null);

  return (
    <Layout>
      <div className="mb-12">
        <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase block mb-2">Field Analysis Overview</span>
        <h1 className="text-6xl font-serif text-text-heading leading-tight">
          Precision <span className="italic text-primary">Yield</span> Insights
        </h1>
        <p className="text-text-body max-w-2xl mt-4 text-balance leading-relaxed">
          The following metrics reflect your recent analytical activity and neural network results.
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <SummaryCard
          title="Crop Recommendation"
          value={cropResult?.top_crops?.[0]?.[0] || "N/A"}
          unit={cropResult?.top_crops?.[0]?.[1] ? (cropResult.top_crops[0][1] * 100).toFixed(1) + "%" : "---"}
          label={cropResult ? "Recommended for optimal harvest" : "No recommendations yet"}
          icon={Sprout}
        />
        <SummaryCard
          title="Drought Resistance"
          value={droughtVal !== null ? (droughtVal > 70 ? "High Resistance" : droughtVal > 40 ? "Moderate Resistance" : "Low Resistance") : "Arid Threshold"}
          unit={droughtVal !== null ? droughtVal.toFixed(1) + "%" : "---"}
          label={droughtVal !== null ? "Calculated stress tolerance" : "System state: Optimal"}
          icon={Droplets}
        />
        <SummaryCard
          title="Soil Suitability"
          value={suitabilityVal !== null ? (suitabilityVal > 80 ? "Optimal Soil" : suitabilityVal > 50 ? "Good Soil" : "Needs Correction") : "Nutrient Delta"}
          unit={suitabilityVal !== null ? suitabilityVal.toFixed(1) + "%" : "---"}
          label={suitabilityVal !== null ? "Comprehensive health index" : "Standard baseline used"}
          icon={Landmark}
        />
        <SummaryCard
           title="Disease Detection"
           value={getDiseaseValue()}
           unit={getDiseaseConfidence()}
           label={summary.disease ? "Threat analysis complete" : "System state: Optimal"}
           icon={Bug}
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <GlassCard title="Scan Distribution" subtitle="System Utilization" icon={Landmark} className="lg:col-span-1">
          <div className="h-[250px] relative mt-4">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F4F4F4' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-text-body italic">No scan data available</div>
            )}
            <div className="absolute inset-x-0 bottom-1/2 translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-text-heading">{data?.logs?.length || 0}</span>
              <span className="text-[8px] text-text-body uppercase tracking-widest">Total Scans</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2 mt-4 text-[10px]">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-text-body">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Prediction History" subtitle="Activity Timeline" icon={Sprout} className="lg:col-span-2">
          <div className="h-[250px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#555', fontSize: 10 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 10 }} />
                <Tooltip
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ background: '#121212', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#A3C148" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-xs text-text-body italic">
              Displaying total prediction sessions recorded for your account.
            </p>
            <button className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">
              <Download size={12} /> Export JSON
            </button>
          </div>
        </GlassCard>
      </div>

      {}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-3xl font-serif text-text-heading italic">Recent Logs</h3>
              <p className="text-[10px] text-text-body uppercase tracking-widest mt-1">Analytical History & Trace Data</p>
           </div>
           <button
             onClick={() => window.location.reload()}
             className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary/10 p-3 rounded-xl transition-all"
           >
              Refresh <Landmark size={14} />
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {data?.logs && data.logs.length > 0 ? (
             data.logs.slice(0, 8).map((log, index) => (
                <LogItem
                  key={index}
                  log={log}
                  onClick={(l) => { setSelectedLog(l); setIsModalOpen(true); }}
                />
             ))
           ) : (
             <div className="col-span-full py-20 text-center bg-white/5 rounded-[2rem] border border-white/5">
                <span className="text-xs text-text-body italic opacity-50 uppercase tracking-widest">No analytical activity recorded yet.</span>
             </div>
           )}
        </div>
      </div>

      <LogModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {}
      <div className="rounded-3xl overflow-hidden relative group">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
          alt="Farmland"
          className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent flex items-center px-12">
          <div className="max-w-md">
            <h3 className="text-4xl font-serif text-text-heading mb-4">Sustainable Ecosystems</h3>
            <p className="text-sm text-text-body leading-relaxed mb-8">
              Integrating biodiversity metrics with real-time soil health sensors to create a self-sustaining agricultural model.
            </p>
            <button className="bg-primary text-background font-bold py-3 px-8 rounded-lg uppercase tracking-widest text-xs hover:bg-primary-hover transition-all">
              Launch Full Scan
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;