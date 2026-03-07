import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// İŞTE BEYAZ EKRANIN SEBEBİ BURASIYDI: ClipboardList ikonunu da ekledik! 👇
import { LogOut, User, ShieldAlert, Car, CalendarPlus, ClipboardList } from 'lucide-react'; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Bileşen yüklendiğinde kullanıcının giriş yapıp yapmadığını kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Üst Navigasyon Barı */}
      <nav className="bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Car className="text-red-600" size={28} />
              <span className="text-xl font-black tracking-tighter italic">
                İTÜ <span className="text-red-600">RACING</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {user.role === 'admin' || user.role === 'superadmin' ? (
                    <><ShieldAlert size={12} className="text-red-500" /> Yönetici Paneli</>
                  ) : (
                    <><User size={12} /> Üye Paneli</>
                  )}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-lg transition-all"
                title="Çıkış Yap"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana İçerik Alanı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Hoş Geldin, <span className="text-red-500">{user.name}</span>! 🏎️
          </h2>
          <p className="text-gray-400 mb-8">
            Burası senin ana merkezin. Aşağıdaki menüleri kullanarak işlemlerini yapabilirsin.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            
            {/* HERKESİN GÖRDÜĞÜ İZİN İSTEME BUTONU */}
            <Link 
              to="/leave-request" 
              className="bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-all p-6 rounded-xl flex flex-col items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="bg-red-600/20 p-4 rounded-full text-red-500 group-hover:scale-110 transition-transform">
                <CalendarPlus size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">İzin Talebi Oluştur</h3>
              <p className="text-sm text-gray-400 text-center">Antrenman veya toplantılara katılamayacaksan bildir.</p>
            </Link>

            {/* SADECE ADMİNLERİN GÖRECEĞİ İZİN YÖNETİM BUTONU */}
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <Link 
                to="/admin/leaves" 
                className="bg-white/5 border border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all p-6 rounded-xl flex flex-col items-center justify-center gap-3 group cursor-pointer"
              >
                <div className="bg-yellow-500/20 p-4 rounded-full text-yellow-500 group-hover:scale-110 transition-transform">
                  <ClipboardList size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">İzinleri Yönet</h3>
                <p className="text-sm text-gray-400 text-center">Takımdan gelen izin taleplerini onayla veya reddet.</p>
              </Link>
            )}

            {/* ÇOK YAKINDA BUTONU */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col items-center justify-center gap-3 opacity-50">
              <div className="bg-gray-600/20 p-4 rounded-full text-gray-400">
                <Car size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-400">Çok Yakında</h3>
              <p className="text-sm text-gray-500 text-center">Yeni özellikler yolda.</p>
            </div>
            
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-500">
            🚧 <strong>Yapım Aşamasında:</strong> Yakında buraya kişisel istatistikleriniz ve yoklama bilgileriniz gelecek!
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;