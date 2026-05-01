import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Bug, AlertCircle, Loader2, CheckCircle2, Leaf, Image as ImageIcon } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';

const CropDisease = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  };

  const onDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/crop_disease', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status === 'success') {
        setResult(response.data.result);
      } else {
        setError(response.data.message || 'Detection failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during disease detection');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <button onClick={() => { setResult(null); setFile(null); setPreview(null); }} className="label-text hover:text-primary transition-colors italic mb-8">← Upload New Foliage Capture</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="!p-4 border-white/5 bg-white/5">
              <img src={preview} alt="Captured Foliage" className="w-full aspect-square object-cover rounded-xl shadow-2xl" />
            </GlassCard>

            <div className="flex flex-col justify-center">
              <GlassCard className="border-primary/20 bg-primary/5">
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block mb-2">Neural Analysis Result</span>
                <h2 className="text-4xl font-serif text-text-heading mb-6">{result.label.replace('___', ' ').replace('__', ' ')}</h2>
                <div className="flex items-center gap-4 mb-8">
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-text-body font-bold uppercase tracking-widest">Confidence Score</span>
                        <span className="text-primary font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${result.confidence * 100}%` }} />
                      </div>
                   </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-8">
                   <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="text-primary mt-1" />
                      <p className="text-xs text-text-body leading-relaxed italic">
                        {result.label.includes('Healthy')
                          ? "System scan indicates no presence of active pathogens. Continue monitoring and maintain standard irrigation protocols."
                          : "Urgent: Bacterial/Fungal pathogens identified. We recommend localized isolation of the affected specimen to prevent ecosystem contamination."}
                      </p>
                   </div>
                </div>

                <ActionButton onClick={() => { setResult(null); setFile(null); setPreview(null); }}>Initiate New Scan</ActionButton>
              </GlassCard>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1597148802029-281961601334?q=80&w=2832&auto=format&fit=crop"
            alt="Leaf"
            className="w-[600px]"
          />
        </div>
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase block mb-4">High-Precision Pathogen Detection</span>
        <h1 className="text-7xl font-serif text-text-heading leading-tight mb-8">
          Crop Disease <br/><span className="italic text-primary">Prediction</span>
        </h1>
        <p className="text-text-body max-w-2xl mx-auto leading-relaxed">
          Leverage high-precision neural networks to identify botanical pathogens before they impact your yield. Upload a high-resolution macro capture of the affected foliage.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <GlassCard className="!p-2 border-white/5 relative group">
           <div
             onDrop={onDrop}
             onDragOver={onDragOver}
             className={`border-2 border-dashed ${file ? 'border-primary/50' : 'border-white/5'} rounded-2xl h-[400px] flex flex-col items-center justify-center transition-all bg-[rgba(20,24,19,0.5)] group-hover:bg-[rgba(20,24,19,0.8)] relative overflow-hidden`}
           >
              {preview ? (
                <>
                  <img src={preview} alt="Upload Preview" className="w-full h-full object-cover opacity-50 transition-all group-hover:opacity-100" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                     <Upload size={32} className="text-primary mb-4" />
                     <p className="text-xs font-bold text-white uppercase tracking-widest">Click to Replace File</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <h4 className="text-2xl font-serif text-text-heading mb-2">Drop foliage capture here</h4>
                  <p className="text-xs text-text-body uppercase tracking-widest font-bold">Or click to browse filesystem</p>
                </>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
           </div>

           <div className="flex justify-center gap-4 mt-12 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                 <AlertCircle size={12} className="text-primary" />
                 <span className="text-[10px] text-text-body uppercase tracking-widest font-bold">Max Size: 25MB</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                 <ImageIcon size={12} className="text-primary" />
                 <span className="text-[10px] text-text-body uppercase tracking-widest font-bold">Formats: JPG, RAW</span>
              </div>
           </div>
        </GlassCard>

        <div className="mt-8">
           <ActionButton
             onClick={handleSubmit}
             disabled={!file || loading}
             icon={loading ? Loader2 : Leaf}
             className="max-w-md mx-auto"
           >
             {loading ? 'Executing Neural Prediction...' : 'EXECUTE NEURAL PREDICTION'}
           </ActionButton>
           {error && <p className="mt-4 text-center text-red-500 text-xs flex items-center justify-center gap-2"><AlertCircle size={14} /> {error}</p>}
        </div>
      </div>
    </Layout>
  );
};

export default CropDisease;