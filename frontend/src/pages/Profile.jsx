import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCircle, Mail, ShieldCheck, LogOut, RefreshCcw, MapPin, Calendar, Edit3, Fingerprint } from 'lucide-react';
import Layout from '../components/Layout';
import GlassCard from '../components/GlassCard';
import InputField from '../components/InputField';
import ActionButton from '../components/ActionButton';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first: '', last: '', email: '', username: '', title: '', location: ''
  });
  const [exportEmail, setExportEmail] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState({ type: '', text: '' });
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.status === 'success') {
          const userData = res.data.data;
          setUser(userData);
          setFormData({
            first: userData.first || '',
            last: userData.last || '',
            email: userData.email || '',
            username: userData.username || '',
            title: userData.title || 'Agronomist',
            location: userData.location || 'Unknown'
          });
          setExportEmail(userData.email || '');
        }
      } catch (err) {
        if (err.response?.status === 401) {
           localStorage.removeItem('token');
           navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success') {
        setUser({ ...user, ...formData });
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!exportEmail) {
      setExportMessage({ type: 'error', text: 'Please provide a recipient email' });
      return;
    }
    setExportLoading(true);
    setExportMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/export-data', { email: exportEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 'success') {
        setExportMessage({ type: 'success', text: 'Data export initiated. Please check your inbox shortly.' });
      } else {
        setExportMessage({ type: 'error', text: res.data.message || 'Export failed' });
      }
    } catch (err) {
      setExportMessage({ type: 'error', text: err.response?.data?.message || 'System error during export' });
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) return <Layout><div className="animate-pulse bg-white/5 h-[600px] rounded-3xl" /></Layout>;

  return (
    <Layout>
      <div className="text-center mb-16">
        <h1 className="text-7xl font-serif text-text-heading mb-4 italic">Personal Repository</h1>
        <p className="text-text-body max-w-2xl mx-auto leading-relaxed">
           Manage your digital footprint within the arboretum ecosystem. Your profile settings govern data visualization preferences and local environmental parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {}
        <GlassCard className="lg:col-span-1 flex flex-col items-center text-center !bg-[#0B110A] border-white/5 h-full">
           <div className="relative mb-6">
              <div className="w-32 h-32 rounded-3xl border-2 border-primary p-1 bg-background overflow-hidden">
                 <img
                   src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                   alt="Avatar"
                   className="w-full h-full object-cover rounded-2xl bg-primary/20"
                 />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-[#1C211B] border border-white/10 rounded-full text-text-body hover:text-primary transition-colors">
                 <Edit3 size={14} />
              </button>
           </div>
           <h3 className="text-2xl font-serif text-text-heading mb-1">{user?.first} {user?.last}</h3>
           <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-8">{user?.title || 'Agronomist'}</p>

           <div className="grid grid-cols-2 gap-4 w-full mb-12">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                 <span className="block text-[8px] text-text-body uppercase mb-1">Fields</span>
                 <span className="text-lg font-bold text-text-heading">12 active</span>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                 <span className="block text-[8px] text-text-body uppercase mb-1">Precision</span>
                 <span className="text-lg font-bold text-text-heading">98.4%</span>
              </div>
           </div>

           <div className="space-y-3 w-full mb-12">
              <div className="flex items-center gap-3 text-xs text-text-body">
                 <MapPin size={14} className="text-primary" />
                 <span>{user?.location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-body">
                 <Calendar size={14} className="text-primary" />
                 <span>Joined {user?.joined}</span>
              </div>
           </div>

           <button
             onClick={handleLogout}
             className="mt-auto w-full flex items-center justify-center gap-3 py-4 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-text-body hover:bg-white/5 hover:text-red-500 hover:border-red-500/20 transition-all"
           >
              Logout <LogOut size={16} />
           </button>
        </GlassCard>

        {}
        <GlassCard className="lg:col-span-2 relative">
           <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-serif text-text-heading mb-2">Identity Matrix</h3>
                <p className="text-[10px] text-text-body uppercase tracking-[0.2em]">System-wide identification credentials</p>
              </div>
              <Fingerprint size={32} className="text-white/10" />
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              {message.text && (
                <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest ${
                  message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {message.text}
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <InputField label="First Name" name="first" value={formData.first} onChange={handleChange} />
                <InputField label="Last Name" name="last" value={formData.last} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="label-text">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field w-full pl-10"
                    />
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="label-text">Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="input-field w-full pl-10"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] font-bold">@</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Title" name="title" value={formData.title} onChange={handleChange} />
                <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
              </div>

              <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                    <ShieldCheck size={14} className="text-primary/50" />
                    <span>Your data is encrypted with AES-256 standard protocol.</span>
                 </div>
                 <ActionButton type="submit" className="!max-w-[200px]" icon={RefreshCcw} disabled={saveLoading}>
                    {saveLoading ? 'Updating...' : 'Update Profile'}
                 </ActionButton>
              </div>
           </form>
         </GlassCard>
      </div>

      <div className="max-w-5xl mx-auto mt-8">
        <GlassCard className="relative overflow-hidden border-primary/10">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-xl">
                 <h3 className="text-3xl font-serif text-text-heading mb-3 underline decoration-primary/30 underline-offset-8">Data Forge</h3>
                 <p className="text-xs text-text-body leading-relaxed mb-6">
                    Request a cryptographic compilation of your entire environmental interaction history. Our system will generate a comprehensive PDF dossier containing all previous soil analyses, crop recommendations, and diagnostic scans.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                       <label className="label-text">Recipient Email</label>
                       <input 
                          type="email" 
                          value={exportEmail}
                          onChange={(e) => setExportEmail(e.target.value)}
                          placeholder="receiving@email.com"
                          className="input-field w-full"
                       />
                    </div>
                    <ActionButton 
                       onClick={handleExportData} 
                       className="sm:w-auto w-full !h-[50px] !px-8" 
                       icon={Mail} 
                       disabled={exportLoading}
                    >
                       {exportLoading ? 'Processing...' : 'Export History'}
                    </ActionButton>
                 </div>
                 
                 {exportMessage.text && (
                    <div className={`mt-6 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${
                       exportMessage.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                       {exportMessage.text}
                    </div>
                 )}
              </div>
              <div className="hidden md:block opacity-20">
                 <RefreshCcw size={120} className="text-white animate-spin-slow" />
              </div>
           </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

export default Profile;