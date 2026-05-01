import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      const response = await axios.post('/api/login', formData);
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.session);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B110A] relative overflow-hidden">
      {}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1511497584788-8767fe771d22?q=80&w=2832&auto=format&fit=crop"
          alt="Forest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B110A] via-transparent to-transparent" />
      </div>

      <div className="z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-primary italic text-2xl mb-2">Digital Agriculture</h1>
        </div>

        <GlassCard className="!bg-[rgba(20,24,19,0.9)] !p-10 border-white/5">
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase block mb-2">Verification Required</span>
            <h2 className="text-4xl font-serif text-text-heading mb-3">Return to Agriculture</h2>
            <p className="text-sm text-text-body leading-relaxed">
              Access your precision agricultural data and ecosystem analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-4">{error}</div>}
            <InputField
              label="Username"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <InputField
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="absolute top-0 right-0 label-text !mb-0 lowercase italic font-normal">Forgot Password?</button>
            </div>

            <ActionButton type="submit" disabled={loading} className="mt-6 py-4" icon={LogIn}>
              {loading ? 'Verifying...' : 'SIGN IN TO DASHBOARD'}
            </ActionButton>
          </form>

          <div className="mt-8 text-center text-xs text-text-body">
            New here? <Link to="/signup" className="text-primary font-bold hover:underline">Register Organization</Link>
          </div>
        </GlassCard>

        <p className="mt-12 text-center text-[10px] text-[#444] leading-relaxed max-w-xs mx-auto italic">
          "Precision is the bridge between nature's chaos and sustainable prosperity. Welcome back to the digital frontier of agronomy."
        </p>
      </div>
    </div>
  );
};

export default Login;