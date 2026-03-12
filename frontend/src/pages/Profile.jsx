import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, CreditCard, Lock, Loader2, ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate, token]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/me');
      setProfile(data);
      setFormData({
        email: data.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Profil yüklenemedi.');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');
    setError('');

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Yeni şifreler eşleşmiyor!');
        setSaveLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Yeni şifre en az 6 karakter olmalıdır.');
        setSaveLoading(false);
        return;
      }
    }

    try {
      const payload = { email: formData.email };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const { data } = await api.put('/users/me', payload);

      setMessage(data.message);
      if (data.user) {
        setProfile(data.user);
        localStorage.setItem('user', JSON.stringify({ id: data.user._id, name: data.user.name, role: data.user.role }));
      }
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Güncelleme başarısız.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/dashboard" className="p-2 bg-white/5 hover:bg-red-600/20 hover:text-red-500 rounded-lg transition-all border border-white/10">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase">
              Profil Ayarları
            </h1>
            <p className="text-gray-400 text-sm mt-1">Bilgilerinizi görüntüleyin ve güncelleyin</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
              <CheckCircle size={18} /> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ad Soyad</label>
              <div className="relative flex items-center gap-2 rounded-xl py-3 px-4 bg-white/5 border border-white/10 text-gray-300">
                <User size={18} className="text-gray-500" />
                <span>{profile.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Öğrenci No</label>
              <div className="relative flex items-center gap-2 rounded-xl py-3 px-4 bg-white/5 border border-white/10 text-gray-300">
                <CreditCard size={18} className="text-gray-500" />
                <span>{profile.studentId || '—'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-600 transition-all"
                  placeholder="E-posta"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                <Lock size={16} /> Şifre Değiştir (İsteğe bağlı)
              </h3>
              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-red-600 transition-all"
                  placeholder="Mevcut şifreniz"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-red-600 transition-all"
                  placeholder="Yeni şifre"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-red-600 transition-all"
                  placeholder="Yeni şifre tekrar"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Şifre değiştirmek istemiyorsanız bu alanları boş bırakın.</p>
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
