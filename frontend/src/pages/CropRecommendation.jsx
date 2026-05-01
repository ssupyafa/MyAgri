import React, { useState } from 'react';
import axios from 'axios';
import { Sprout, Thermometer, Droplets, CloudRain, CheckCircle2, AlertCircle, Loader2, Leaf } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import ValidationNotice from '../components/ValidationNotice';
import { checkFormDataForRandomness, isValueRandom } from '../utils/validation';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isRandom, setIsRandom] = useState(false);

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    setIsRandom(checkFormDataForRandomness(newFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/crop_recommendation', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === 'success') {
        setResult(response.data.top_crops);
      } else {
        setError(response.data.message || 'Recommendation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during recommendation');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-12">
          <div className="flex items-center gap-4 mb-12">
            <button onClick={() => { setResult(null); setIsRandom(false); setFormData({
              N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
            }); }} className="label-text hover:text-primary transition-colors italic">← Change Environmental Parameters</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GlassCard className="h-full border-primary/20">
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block mb-2">Analysis Results</span>
                <h2 className="text-4xl font-serif text-text-heading mb-8">Recommended Cultivation</h2>
                <div className="space-y-6">
                  {result.map((crop, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-primary text-background' : 'bg-white/5 text-primary'}`}>
                          <Sprout size={24} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-serif text-text-heading capitalize">{crop[0]}</h4>
                          <p className="text-xs text-text-body uppercase tracking-wider">Suitability Index: {(crop[1] * 100).toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-bold text-lg">#{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 bg-primary/10 p-6 rounded-2xl">
                   <p className="text-sm text-primary leading-relaxed italic">
                     "Our model suggests {result[0][0]} as the primary candidate based on your specific NPK and pH values. This crop shows the highest metabolic compatibility with your current soil profile."
                   </p>
                </div>
              </GlassCard>
            </div>

            <div className="space-y-8">
               <GlassCard title="Ecosystem Match" className="!bg-[#1C211B]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-body">Soil Fertility</span>
                      <span className="text-primary font-bold">High</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[85%]" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-body">Water Stress</span>
                      <span className="text-primary font-bold">Minimal</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[20%]" />
                    </div>
                  </div>
               </GlassCard>
                <ActionButton onClick={() => { setResult(null); setIsRandom(false); setFormData({
                   N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
                }); }}>New Analysis</ActionButton>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-12">
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase block mb-2">Precision Analytics</span>
        <h1 className="text-6xl font-serif text-text-heading leading-tight mb-6">
          Intelligent <span className="italic text-primary">Cultivation</span> Guidance
        </h1>
        <p className="text-text-body max-w-xl leading-relaxed">
          Leverage advanced soil metrics and environmental variables to identify the optimal crop for your specific ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-serif text-text-heading">Environmental Parameters</h3>
           </div>

           <ValidationNotice isVisible={isRandom} />

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputField label="Nitrogen Content (N)" name="N" placeholder="Value in mg/kg" value={formData.N} onChange={handleChange} isRandom={isValueRandom('N', formData.N)} required />
                <InputField label="Temperature (°C)" name="temperature" placeholder="Average ambient" value={formData.temperature} onChange={handleChange} isRandom={isValueRandom('temperature', formData.temperature)} required />
                <InputField label="Phosphorus Content (P)" name="P" placeholder="Value in mg/kg" value={formData.P} onChange={handleChange} isRandom={isValueRandom('P', formData.P)} required />
                <InputField label="Relative Humidity (%)" name="humidity" placeholder="Moisture percentage" value={formData.humidity} onChange={handleChange} isRandom={isValueRandom('humidity', formData.humidity)} required />
                <InputField label="Potassium Content (K)" name="K" placeholder="Value in mg/kg" value={formData.K} onChange={handleChange} isRandom={isValueRandom('K', formData.K)} required />
                <InputField label="Soil pH Value" name="ph" placeholder="Scale (0.0 - 14.0)" value={formData.ph} onChange={handleChange} isRandom={isValueRandom('ph', formData.ph)} required />
              </div>

              <InputField label="Average Rainfall (mm)" name="rainfall" placeholder="Annualized precipitation" value={formData.rainfall} onChange={handleChange} isRandom={isValueRandom('rainfall', formData.rainfall)} required />

              <div className="pt-4">
                <ActionButton type="submit" disabled={loading} icon={loading ? Loader2 : Sprout}>
                  {loading ? 'Analyzing Micro-nutrients...' : 'Generate Recommendation'}
                </ActionButton>
                {error && <p className="mt-4 text-red-500 text-xs flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}
              </div>
           </form>
        </GlassCard>

        <aside className="space-y-8">
          <GlassCard className="!bg-white/5 border-white/5">
            <div className="flex flex-col justify-center h-[200px]">
              <h4 className="text-text-heading font-serif text-2xl mb-4">Precision Soil Analysis</h4>
              <p className="text-xs text-text-body leading-relaxed">
                Our algorithm uses multi-variate regression to correlate your nutrient levels with global crop yield databases.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="!bg-white/5 border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Leaf size={18} />
              </div>
              <h4 className="text-text-heading font-serif text-lg">Optimal pH Balance</h4>
            </div>
            <p className="text-xs text-text-body leading-relaxed mb-6">
              Most cereal crops thrive between 6.0 and 7.5 pH. Values outside this range may limit nutrient bioavailability.
            </p>
            <div className="relative h-2 w-full bg-white/5 rounded-full mb-2">
              <div className="absolute left-[42%] right-[54%] top-0 bottom-0 bg-primary opacity-50" />
              <div className="absolute left-[45%] w-1 h-4 -top-1 bg-primary rounded-full shadow-[0_0_10px_rgba(163,193,72,0.8)]" />
            </div>
            <div className="flex justify-between text-[8px] text-[#555] uppercase font-bold">
              <span>Acidic</span>
              <span className="text-primary/60">Optimal Range</span>
              <span>Alkaline</span>
            </div>
          </GlassCard>
        </aside>
      </div>
    </Layout>
  );
};

export default CropRecommendation;