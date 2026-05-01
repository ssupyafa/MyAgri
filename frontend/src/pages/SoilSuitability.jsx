import React, { useState } from 'react';
import axios from 'axios';
import { Thermometer, Wind, Sun, CheckCircle2, AlertCircle, Loader2, Landmark } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import ValidationNotice from '../components/ValidationNotice';
import { checkFormDataForRandomness, isValueRandom } from '../utils/validation';

const SoilSuitability = () => {
  const [formData, setFormData] = useState({
    TS: '', T2M_MAX: '', T2M: '', T2M_MIN: '', T2MDEW: '',
    QV2M: '', RH2M: '', WS10M: '', WS2M: '',
    ALLSKY_SFC_PAR_TOT: '', ALLSKY_SFC_SW_DWN: '', PS: '', PRECTOTCORR: ''
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
      const response = await axios.post('/api/suitability', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === 'success') {
        setResult(response.data.prediction);
      } else {
        setError(response.data.message || 'Prediction failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="flex items-center gap-4 mb-12">
            <button onClick={() => { setResult(null); setIsRandom(false); setFormData({
              TS: '', T2M_MAX: '', T2M: '', T2M_MIN: '', T2MDEW: '',
              QV2M: '', RH2M: '', WS10M: '', WS2M: '',
              ALLSKY_SFC_PAR_TOT: '', ALLSKY_SFC_SW_DWN: '', PS: '', PRECTOTCORR: ''
            }); }} className="label-text hover:text-primary transition-colors italic">← Re-analyze Parameters</button>
          </div>
          <GlassCard className="text-center py-16 px-12 border-primary/20">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <CheckCircle2 size={48} className="text-primary" />
            </div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase block mb-2">Neural Network Analysis Complete</span>
            <h2 className="text-5xl font-serif text-text-heading mb-6">Soil Suitability Result</h2>
            <div className="flex flex-col items-center gap-4 mb-12">
              <div className="text-8xl font-bold text-primary tabular-nums">
                {result.suitability.toFixed(1)}<span className="text-4xl text-primary/50">%</span>
              </div>
              <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${result.suitability}%` }}
                />
              </div>
            </div>

            <div className="max-w-lg mx-auto bg-white/5 p-6 rounded-2xl border border-white/5">
              <p className="text-lg text-text-heading italic leading-relaxed">
                "{result.analysis}"
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
               <ActionButton onClick={() => window.print()} className="!bg-white/5 !text-text-heading border border-white/10">Export Report</ActionButton>
               <ActionButton onClick={() => { setResult(null); setIsRandom(false); setFormData({
                  TS: '', T2M_MAX: '', T2M: '', T2M_MIN: '', T2MDEW: '',
                  QV2M: '', RH2M: '', WS10M: '', WS2M: '',
                  ALLSKY_SFC_PAR_TOT: '', ALLSKY_SFC_SW_DWN: '', PS: '', PRECTOTCORR: ''
                }); }}>New Analysis</ActionButton>
            </div>
          </GlassCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-12">
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase block mb-2">Analytical Engine V4.0</span>
        <h1 className="text-6xl font-serif text-text-heading leading-tight mb-6">
          Soil Suitability <br/><span className="italic text-primary">Prediction</span>
        </h1>
        <p className="text-text-body max-w-xl leading-relaxed">
          Input environmental parameters to calculate the cultivation potential of your specific land coordinates. Our neural network processes 13 distinct atmospheric variables.
        </p>
      </div>

      <ValidationNotice isVisible={isRandom} />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Thermometer size={20} className="text-primary" />
              <h3 className="text-xl font-serif text-text-heading">Thermal Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Surface Temperature (K)" name="TS" placeholder="e.g. 295.15" value={formData.TS} onChange={handleChange} isRandom={isValueRandom('TS', formData.TS)} required />
              <InputField label="Max 2m Temperature (C)" name="T2M_MAX" placeholder="e.g. 32.4" value={formData.T2M_MAX} onChange={handleChange} isRandom={isValueRandom('T2M_MAX', formData.T2M_MAX)} required />
              <InputField label="Avg 2m Temperature (C)" name="T2M" placeholder="e.g. 25.8" value={formData.T2M} onChange={handleChange} isRandom={isValueRandom('T2M', formData.T2M)} required />
              <InputField label="Min 2m Temperature (C)" name="T2M_MIN" placeholder="e.g. 18.6" value={formData.T2M_MIN} onChange={handleChange} isRandom={isValueRandom('T2M_MIN', formData.T2M_MIN)} required />
              <InputField label="2m Dew Point Temp (C)" name="T2MDEW" placeholder="e.g. 16.7" value={formData.T2MDEW} onChange={handleChange} isRandom={isValueRandom('T2MDEW', formData.T2MDEW)} required />
            </div>
          </section>

          {}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Wind size={20} className="text-primary" />
              <h3 className="text-xl font-serif text-text-heading">Atmospheric Dynamics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="2m Specific Humidity (g/kg)" name="QV2M" placeholder="e.g. 8.7" value={formData.QV2M} onChange={handleChange} isRandom={isValueRandom('QV2M', formData.QV2M)} required />
              <InputField label="2m Relative Humidity (%)" name="RH2M" placeholder="e.g. 65" value={formData.RH2M} onChange={handleChange} isRandom={isValueRandom('RH2M', formData.RH2M)} required />
              <InputField label="10m Wind Speed (m/s)" name="WS10M" placeholder="e.g. 3.2" value={formData.WS10M} onChange={handleChange} isRandom={isValueRandom('WS10M', formData.WS10M)} required />
              <InputField label="2m Wind Speed (m/s)" name="WS2M" placeholder="e.g. 1.5" value={formData.WS2M} onChange={handleChange} isRandom={isValueRandom('WS2M', formData.WS2M)} required />
            </div>
          </section>

          {}
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Sun size={20} className="text-primary" />
              <h3 className="text-xl font-serif text-text-heading">Solar & Geo Indices</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="All Sky Surface PAR Total (MJ/m²)" name="ALLSKY_SFC_PAR_TOT" placeholder="e.g. 45.2" value={formData.ALLSKY_SFC_PAR_TOT} onChange={handleChange} isRandom={isValueRandom('ALLSKY_SFC_PAR_TOT', formData.ALLSKY_SFC_PAR_TOT)} required />
              <InputField label="Sky Surface Shortwave Down (W/m²)" name="ALLSKY_SFC_SW_DWN" placeholder="e.g. 23.5" value={formData.ALLSKY_SFC_SW_DWN} onChange={handleChange} isRandom={isValueRandom('ALLSKY_SFC_SW_DWN', formData.ALLSKY_SFC_SW_DWN)} required />
              <InputField label="Surface Pressure (kPa)" name="PS" placeholder="e.g. 101.3" value={formData.PS} onChange={handleChange} isRandom={isValueRandom('PS', formData.PS)} required />
              <InputField label="Corrected Precipitation (mm/day)" name="PRECTOTCORR" placeholder="e.g. 110" value={formData.PRECTOTCORR} onChange={handleChange} isRandom={isValueRandom('PRECTOTCORR', formData.PRECTOTCORR)} required />
            </div>
          </section>

          <div className="pt-8">
            <ActionButton type="submit" disabled={loading} icon={loading ? Loader2 : Landmark}>
              {loading ? 'Processing Neural Model...' : 'RUN SUITABILITY MODEL'}
            </ActionButton>
            {error && <p className="mt-4 text-red-500 text-xs flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}
          </div>
        </div>

        <aside className="space-y-8">
          <GlassCard className="!bg-primary/5 border-primary/20">
            <h4 className="text-text-heading font-serif text-lg mb-4">Data Integrity</h4>
            <p className="text-xs text-text-body leading-relaxed mb-6">
              Ensure all measurements reflect a 24-hour mean where applicable for the highest accuracy in soil health mapping.
            </p>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Model Confidence</span>
              <span className="text-xs font-bold text-primary">94.2%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-[94%]" />
            </div>
          </GlassCard>

          <GlassCard className="!bg-white/5">
             <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Sun size={20} className="text-primary" />
                </div>
                <div>
                   <h4 className="text-text-heading font-serif text-lg mb-2">Expert Insight</h4>
                   <p className="text-xs text-text-body leading-relaxed italic">
                     "Optimal nutrient uptake is observed when Surface Temperature fluctuates less than 8.5°C over a 24-hour period."
                   </p>
                </div>
             </div>
          </GlassCard>
        </aside>
      </form>
    </Layout>
  );
};

export default SoilSuitability;