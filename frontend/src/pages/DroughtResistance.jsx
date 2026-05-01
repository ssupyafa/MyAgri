import React, { useState } from 'react';
import axios from 'axios';
import { Droplets, Thermometer, Wind, Sun, CheckCircle2, AlertCircle, Loader2, Dna, Settings, Activity, Landmark } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';
import ValidationNotice from '../components/ValidationNotice';
import { checkFormDataForRandomness, isValueRandom } from '../utils/validation';

const DroughtResistance = () => {
  const [formData, setFormData] = useState({
    Precipitation_mm: '', Temperature_C: '', Solar_Radiation_MJ_m2: '',
    Evapotranspiration_mm: '', 'Soil_Moisture_%': '', 'Humidity_%': '',
    Drought_Duration_days: '', WUE_g_per_mm: '', Leaf_Water_Potential_MPa: '',
    Stomatal_Conductance_mol_m2_s: '', Root_Depth_cm: '',
    Photosynthetic_Rate_umol_m2_s: '', Plant_Biomass_g_m2: '', ZmDREB2A: 0,
    Root_QTL: 0, ZmNAC: 0, Planting_Density_plants_ha: '', Soil_Type: 'Loam',
    Growth_Stage: 'Vegetative'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isRandom, setIsRandom] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = { ...formData, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value };
    setFormData(newFormData);
    setIsRandom(checkFormDataForRandomness(newFormData));
  };

  const handleSliderChange = (e) => {
    const newFormData = { ...formData, Root_QTL: e.target.checked ? 1 : 0 };
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
      const response = await axios.post('/api/drought', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === 'success' && response.data.result.status === 'success') {
        setResult(response.data.result.prediction);
      } else {
        setError(response.data.result?.message || response.data.message || 'Prediction failed: Ensure all fields are filled correctly.');
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
           <button onClick={() => { setResult(null); setIsRandom(false); setFormData({
              Precipitation_mm: '', Temperature_C: '', Solar_Radiation_MJ_m2: '',
              Evapotranspiration_mm: '', 'Soil_Moisture_%': '', 'Humidity_%': '',
              Drought_Duration_days: '', WUE_g_per_mm: '', Leaf_Water_Potential_MPa: '',
              Stomatal_Conductance_mol_m2_s: '', Root_Depth_cm: '',
              Photosynthetic_Rate_umol_m2_s: '', Plant_Biomass_g_m2: '', ZmDREB2A: 0,
              Root_QTL: 0, ZmNAC: 0, Planting_Density_plants_ha: '', Soil_Type: 'Loam',
              Growth_Stage: 'Vegetative'
           }); }} className="label-text hover:text-primary transition-colors italic mb-8">← Adjust Biological Parameters</button>
           <GlassCard className="text-center py-16 border-primary/20">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Droplets size={40} className="text-primary" />
              </div>
              <h2 className="text-5xl font-serif text-text-heading mb-4">Resistance Index</h2>
              <div className="text-8xl font-bold text-primary tabular-nums mb-8">
                {result.toFixed(1)}<span className="text-4xl opacity-50">%</span>
              </div>
              <p className="text-text-body max-w-md mx-auto leading-relaxed mb-12">
                Predictive markers indicate a <span className="text-primary font-bold">{result > 70 ? 'high' : result > 40 ? 'moderate' : 'low'}</span> probability of crop survival under current climatic stress conditions.
              </p>
              <ActionButton onClick={() => { setResult(null); setIsRandom(false); setFormData({
                 Precipitation_mm: '', Temperature_C: '', Solar_Radiation_MJ_m2: '',
                 Evapotranspiration_mm: '', 'Soil_Moisture_%': '', 'Humidity_%': '',
                 Drought_Duration_days: '', WUE_g_per_mm: '', Leaf_Water_Potential_MPa: '',
                 Stomatal_Conductance_mol_m2_s: '', Root_Depth_cm: '',
                 Photosynthetic_Rate_umol_m2_s: '', Plant_Biomass_g_m2: '', ZmDREB2A: 0,
                 Root_QTL: 0, ZmNAC: 0, Planting_Density_plants_ha: '', Soil_Type: 'Loam',
                 Growth_Stage: 'Vegetative'
              }); }} className="max-w-xs mx-auto">Generate New Model</ActionButton>
           </GlassCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-12">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#A3C148] uppercase block mb-2">Scientific Analysis Module</span>
        <h1 className="text-6xl font-serif text-text-heading leading-tight mb-4">
          Drought Resistance <br/><span className="italic text-primary">Prediction Engine</span>
        </h1>
        <p className="text-text-body max-w-xl leading-relaxed">
          Utilize multivariate physiological and genetic markers to forecast crop survival rates under extreme arid stress.
        </p>
      </div>

      <ValidationNotice isVisible={isRandom} />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {}
          <GlassCard title="Climate & Soil Dynamics" icon={Sun}>
            <div className="grid grid-cols-2 gap-6">
              <InputField label="Temperature (°C)" name="Temperature_C" placeholder="e.g. 32.5" value={formData.Temperature_C} onChange={handleChange} isRandom={isValueRandom('Temperature_C', formData.Temperature_C)} required />
              <InputField label="Humidity (%)" name="Humidity_%" placeholder="e.g. 15.0" value={formData['Humidity_%']} onChange={handleChange} isRandom={isValueRandom('Humidity_%', formData['Humidity_%'])} required />
              <InputField label="Solar Radiation (W/m²)" name="Solar_Radiation_MJ_m2" placeholder="e.g. 850" value={formData.Solar_Radiation_MJ_m2} onChange={handleChange} isRandom={isValueRandom('Solar_Radiation_MJ_m2', formData.Solar_Radiation_MJ_m2)} required />
              <InputField label="Soil Moisture (V/V)" name="Soil_Moisture_%" placeholder="e.g. 0.12" value={formData['Soil_Moisture_%']} onChange={handleChange} isRandom={isValueRandom('Soil_Moisture_%', formData['Soil_Moisture_%'])} required />
              <InputField label="Evapotranspiration (mm/day)" name="Evapotranspiration_mm" placeholder="e.g. 6.2" value={formData.Evapotranspiration_mm} onChange={handleChange} isRandom={isValueRandom('Evapotranspiration_mm', formData.Evapotranspiration_mm)} required />
              <InputField label="Precipitation (mm)" name="Precipitation_mm" placeholder="e.g. 0.0" value={formData.Precipitation_mm} onChange={handleChange} isRandom={isValueRandom('Precipitation_mm', formData.Precipitation_mm)} required />
            </div>
          </GlassCard>

          {}
          <GlassCard title="Physiological Status" icon={Activity}>
             <div className="grid grid-cols-3 gap-4">
                <InputField label="Leaf Water (MPa)" name="Leaf_Water_Potential_MPa" value={formData.Leaf_Water_Potential_MPa} onChange={handleChange} isRandom={isValueRandom('Leaf_Water_Potential_MPa', formData.Leaf_Water_Potential_MPa)} required />
                <InputField label="Stomatal Cond." name="Stomatal_Conductance_mol_m2_s" value={formData.Stomatal_Conductance_mol_m2_s} onChange={handleChange} isRandom={isValueRandom('Stomatal_Conductance_mol_m2_s', formData.Stomatal_Conductance_mol_m2_s)} required />
                <InputField label="WUE (g/mm)" name="WUE_g_per_mm" value={formData.WUE_g_per_mm} onChange={handleChange} isRandom={isValueRandom('WUE_g_per_mm', formData.WUE_g_per_mm)} required />
                <InputField label="Photosynthetic Rate" name="Photosynthetic_Rate_umol_m2_s" value={formData.Photosynthetic_Rate_umol_m2_s} onChange={handleChange} isRandom={isValueRandom('Photosynthetic_Rate_umol_m2_s', formData.Photosynthetic_Rate_umol_m2_s)} required />
                <InputField label="Plant Biomass (g)" name="Plant_Biomass_g_m2" value={formData.Plant_Biomass_g_m2} onChange={handleChange} isRandom={isValueRandom('Plant_Biomass_g_m2', formData.Plant_Biomass_g_m2)} required />
                <InputField label="Root Depth (cm)" name="Root_Depth_cm" value={formData.Root_Depth_cm} onChange={handleChange} isRandom={isValueRandom('Root_Depth_cm', formData.Root_Depth_cm)} required />
             </div>
          </GlassCard>
        </div>

        <aside className="space-y-8">
           {}
           <GlassCard title="Genomic Markers" icon={Dna} className="border-primary/20 bg-primary/5">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-text-heading uppercase tracking-widest mb-1">ZmDREB2A Expressor</p>
                     <p className="text-[8px] text-text-body leading-relaxed">Presence of drought-responsive transcription factor</p>
                   </div>
                   <input type="checkbox" name="ZmDREB2A" checked={formData.ZmDREB2A === 1} onChange={handleChange} className="w-10 h-5 bg-white/5 border border-white/10 rounded-full appearance-none checked:bg-primary relative transition-all cursor-pointer before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white/20 before:rounded-full checked:before:left-6 checked:before:bg-background before:transition-all" />
                </div>
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-text-heading uppercase tracking-widest mb-1">ZmNAC Pathway</p>
                     <p className="text-[8px] text-text-body leading-relaxed">Activation of cellular stress signaling</p>
                   </div>
                   <input type="checkbox" name="ZmNAC" checked={formData.ZmNAC === 1} onChange={handleChange} className="w-10 h-5 bg-white/5 border border-white/10 rounded-full appearance-none checked:bg-primary relative transition-all cursor-pointer before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white/20 before:rounded-full checked:before:left-6 checked:before:bg-background before:transition-all" />
                </div>

                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-text-heading uppercase tracking-widest mb-1">Root_QTL Expression</p>
                      <p className="text-[8px] text-text-body leading-relaxed">Quantitative Trait Locus for root density</p>
                    </div>
                    <input type="checkbox" name="Root_QTL" checked={formData.Root_QTL === 1} onChange={handleSliderChange} className="w-10 h-5 bg-white/5 border border-white/10 rounded-full appearance-none checked:bg-primary relative transition-all cursor-pointer before:content-[''] before:absolute before:left-1 before:top-1 before:w-3 before:h-3 before:bg-white/20 before:rounded-full checked:before:left-6 checked:before:bg-background before:transition-all" />
                 </div>
              </div>
           </GlassCard>

           {}
           <GlassCard title="Field Configuration" icon={Settings}>
              <div className="space-y-4">
                 <div>
                    <label className="label-text">Soil Type</label>
                    <select name="Soil_Type" value={formData.Soil_Type} onChange={handleChange} className="input-field w-full appearance-none bg-[#1C211B]">
                       {['Loam', 'Clay', 'Silt'].map(t => <option key={t}>{t}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="label-text">Growth Stage</label>
                    <select name="Growth_Stage" value={formData.Growth_Stage} onChange={handleChange} className="input-field w-full appearance-none bg-[#1C211B]">
                       {['Vegetative', 'Flowering', 'Grain_Fill'].map(s => <option key={s}>{s}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <InputField label="Duration (Days)" name="Drought_Duration_days" value={formData.Drought_Duration_days} onChange={handleChange} isRandom={isValueRandom('Drought_Duration_days', formData.Drought_Duration_days)} required />
                    <InputField label="Density (sq/m)" name="Planting_Density_plants_ha" value={formData.Planting_Density_plants_ha} onChange={handleChange} isRandom={isValueRandom('Planting_Density_plants_ha', formData.Planting_Density_plants_ha)} required />
                 </div>
              </div>
           </GlassCard>
           <div className="pt-4">
              <ActionButton type="submit" disabled={loading} icon={loading ? Loader2 : Landmark}>
                {loading ? 'Crunching biological data...' : 'GENERATE RESISTANCE MODEL'}
              </ActionButton>
              {error && <p className="mt-4 text-red-500 text-xs flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}
           </div>
        </aside>
      </form>
    </Layout>
  );
};

export default DroughtResistance;