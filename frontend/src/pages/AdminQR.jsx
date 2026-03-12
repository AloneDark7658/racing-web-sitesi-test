import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, Loader2, Pencil, Trash2, X, Save, ShieldCheck, RefreshCcw } from 'lucide-react';

const AdminQR = () => {
  const [qrData, setQrData] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [isExisting, setIsExisting] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Düzenleme ve iptal state'leri
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const token = localStorage.getItem('token');

  // İlk yüklemede oturum var mı kontrol et
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get('/attendance/active-session');
        if (data) {
          setQrData(data.qrData);
          setStartTime(data.startTime);
          setIsExisting(true);
        }
      } catch (err) {}
    };
    if(token) fetchSession();
  }, [token]);

  // --- DİNAMİK QR: Her 3 saniyede QR değişmiş mi kontrol et ---
  useEffect(() => {
    if (!token || !isExisting) return;

    const pollQR = async () => {
      try {
        const { data } = await api.get('/attendance/active-session');
        if (data && data.qrData !== qrData) {
          setQrData(data.qrData);
          setStartTime(data.startTime);
        }
      } catch (err) {
        // Oturum silinmişse
        setQrData('');
        setIsExisting(false);
      }
    };

    const interval = setInterval(pollQR, 3000);
    return () => clearInterval(interval);
  }, [token, isExisting, qrData]);

  // Canlı yoklama listesi
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const { data } = await api.get('/attendance/today');
        setAttendees(Array.isArray(data) ? data : []);
      } catch (err) {
        setAttendees([]);
      } finally {
        setLoadingList(false);
      }
    };

    if(token) {
      fetchAttendees(); 
      const interval = setInterval(fetchAttendees, 5000); 
      return () => clearInterval(interval); 
    }
  }, [token]);

  const handleGenerate = async () => {
    try {
      const { data } = await api.post('/attendance/generate', { startTime });
      setQrData(data.qrData);
      setIsExisting(true);
    } catch (err) {
      alert("QR oluşturulamadı!");
    }
  };

  const handleUpdate = async () => {
    if (!editTime) return;
    setActionLoading(true);
    setActionMessage('');
    try {
      const { data } = await api.put('/attendance/session', { startTime: editTime });
      setQrData(data.qrData);
      setStartTime(data.startTime);
      setIsEditing(false);
      setActionMessage(data.message);
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Güncelleme başarısız.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('⚠️ Bugünün oturumunu ve tüm yoklama kayıtlarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
    setActionLoading(true);
    setActionMessage('');
    try {
      const { data } = await api.delete('/attendance/session');
      setQrData('');
      setIsExisting(false);
      setStartTime('18:00');
      setAttendees([]);
      setActionMessage(data.message);
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'İptal başarısız.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={18} /> Dashboard'a Dön
        </Link>

        {/* Aksiyon mesajı */}
        {actionMessage && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl mb-6 text-sm font-bold text-center">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SOL TARAF: QR KOD */}
          <div className="lg:col-span-5 bg-[#141414] p-8 rounded-3xl border border-white/10 shadow-xl h-fit">
            <h1 className="text-xl font-black italic mb-6 text-center uppercase tracking-tighter">
              YOKLAMA <span className="text-red-600">MASASI</span>
            </h1>

            {isExisting ? (
              <>
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl mb-4 flex items-center justify-center gap-2 text-green-500 text-xs font-bold">
                  <CheckCircle size={14} /> OTURUM AKTİF
                </div>

                {/* DÜZENLEME / İPTAL BUTONLARI */}
                {isEditing ? (
                  <div className="bg-black/30 border border-white/10 p-4 rounded-xl mb-4 space-y-3">
                    <p className="text-xs text-gray-400 font-bold uppercase">Yeni Mesai Saati</p>
                    <input 
                      type="time" 
                      className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xl font-mono text-center outline-none focus:border-red-600 transition-colors"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={handleUpdate}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Güncelle
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <X size={14} /> Vazgeç
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => { setEditTime(startTime); setIsEditing(true); }}
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Pencil size={13} /> Saati Düzenle
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-500 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      Oturumu İptal Et
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 mb-8">
                <input 
                  type="time" 
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-2xl font-mono text-center outline-none focus:border-red-600 transition-colors"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                <button 
                  onClick={handleGenerate}
                  className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  BAŞLAT
                </button>
              </div>
            )}

            {qrData && (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {/* QR'a sadece JWT token gömülüyor — üye bu kodu okuttuğunda DirectScan işler */}
                  <QRCodeCanvas value={qrData} size={220} level="M" />
                </div>
                <p className="mt-4 text-2xl font-black">{startTime}</p>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Pist Açılış Saati</p>
                
                {/* Dinamik QR bilgilendirmesi */}
                <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg">
                  <ShieldCheck className="text-green-500 flex-shrink-0" size={14} />
                  <p className="text-[10px] text-green-400 font-semibold">
                    Dinamik güvenlik aktif — QR her okutmada yenilenir
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ TARAF: LİSTE */}
          <div className="lg:col-span-7 bg-[#141414] border border-white/10 rounded-3xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <Users className="text-red-500" size={20} /> Canlı Paddock
            </h2>

            {loadingList ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-red-600" /></div>
            ) : attendees.length === 0 ? (
              <div className="text-center py-12 text-gray-600 text-sm italic">Bekleniyor...</div>
            ) : (
              <div className="space-y-2">
                {attendees.map((att) => (
                  <div key={att._id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        att.colorCode === 'green' ? 'bg-green-500' : 
                        att.colorCode === 'yellow' ? 'bg-yellow-400' : 'bg-red-600'
                      }`}></div>
                      <span className="font-bold text-sm">{att.userId?.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                      {new Date(att.scanTime).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminQR;