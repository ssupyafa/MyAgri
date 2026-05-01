import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';

const Signup = () => {
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/signup', formData);
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.session);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B110A]">
      {}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2813&auto=format&fit=crop"
          alt="Forest Path"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B110A]" />
        <div className="absolute top-12 left-12">
          <h1 className="text-primary italic text-2xl">Digital Agriculture</h1>
        </div>

        <div className="absolute bottom-24 left-12 max-w-lg">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase block mb-4">Phase One: Integration</span>
          <h2 className="text-7xl font-serif text-text-heading mb-6 leading-tight">
            Begin Your Cultivation
          </h2>
          <p className="text-lg text-text-body leading-relaxed max-w-md">
            Step into a realm where high-fidelity sensory data meets the raw potential of the earth. Secure your place in the future of autonomous agriculture.
          </p>
          <div className="mt-12 h-px w-24 bg-white/20" />
          <span className="text-[10px] text-white/20 uppercase tracking-widest mt-4 block">Seed ID: 882.491.0</span>
        </div>
      </div>

      {}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center px-6 md:px-12 py-12 relative z-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-12">
             <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Precise Agriculture</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-4">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" name="first" placeholder="Alexander" value={formData.first} onChange={handleChange} required />
              <InputField label="Last Name" name="last" placeholder="Thorne" value={formData.last} onChange={handleChange} required />
            </div>

            <InputField label="Email" type="email" name="email" placeholder="a.thorne@arboretum.io" value={formData.email} onChange={handleChange} required />
            <InputField label="Username" name="username" placeholder="athorne_arboretum" value={formData.username} onChange={handleChange} required />
            <InputField label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />

            <ActionButton type="submit" disabled={loading} className="mt-8 py-4">
              {loading ? 'Processing...' : 'JOIN THE ECOSYSTEM'}
            </ActionButton>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <span className="text-[10px] text-[#444] uppercase tracking-widest block mb-4">Protocol Check</span>
            <p className="text-xs text-text-body">
              Already integrated? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 text-center px-12">
          <p className="text-[8px] text-white/20 uppercase tracking-widest leading-relaxed">
            By proceeding, you consent to the digital arboretum biometrics processing and security protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;