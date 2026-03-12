import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

const DirectScan = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { qrToken: urlQrToken } = useParams(); // URL üzerinden gelen QR token
  const scannerRef = useRef(null); 
  const processedRef = useRef(false); // Çift işlemi engelle

  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  // JWT token'ı çıkar — URL veya düz token olabilir
  const extractToken = (scannedText) => {
    // Eğer tam bir URL ise, /direct-scan/ sonrasını al
    if (scannedText.includes('/direct-scan/')) {
      return scannedText.split('/direct-scan/')[1];
    }
    // Değilse zaten JWT token'dır
    return scannedText;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // URL'den QR token geldiyse direkt işle (kamera açma)
    if (urlQrToken && !processedRef.current) {
      processedRef.current = true;
      processQRCode(urlQrToken);
      return;
    }

    // Kamera ile tarama
    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) return;

      scannerRef.current = new Html5QrcodeScanner(
        "reader", 
        { 
          qrbox: { width: 250, height: 250 }, 
          fps: 10,
          rememberLastUsedCamera: true
        }, 
        false 
      );

      scannerRef.current.render(
        (decodedText) => {
          if (scannerRef.current) {
            scannerRef.current.clear().catch(e => console.log(e));
            scannerRef.current = null;
          }
          const jwtToken = extractToken(decodedText);
          processQRCode(jwtToken);
        },
        (err) => {
          // anlık hataları yut
        }
      );
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.log("Kamera arka planda temizlendi."));
        scannerRef.current = null;
      }
    };
  }, [navigate, urlQrToken]);

  const processQRCode = async (qrToken) => {
    setLoading(true);
    setError(null);
    setScanResult(null);

    const deviceId = getOrCreateDeviceId();

    try {
      const response = await api.post(
        '/attendance/scan',
        { qrToken: qrToken, deviceId: deviceId }
      );
      
      setScanResult({
        message: response.data.message,
        type: response.data.type
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Karekod okutulurken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch (e) {
        console.log("Kamera kapatılamadı.", e);
      }
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        <button onClick={handleBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-black italic tracking-tighter">YOKLAMA <span className="text-red-600">SİSTEMİ</span></h1>
          <p className="text-sm text-gray-400 mt-1">
            {urlQrToken ? 'QR kod işleniyor...' : 'Lütfen kameranızı ekrandaki karekoda hizalayın.'}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
            <p className="text-gray-400 font-semibold animate-pulse">Karekod doğrulanıyor...</p>
          </div>
        ) : scanResult ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="text-green-500 mb-4" size={64} />
            <h2 className="text-xl font-bold text-white mb-2">İşlem Başarılı!</h2>
            <p className="text-green-400 font-semibold mb-6">{scanResult.message}</p>
            <button onClick={handleBack} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all">
              Ana Sayfaya Dön
            </button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <XCircle className="text-red-500 mb-4" size={64} />
            <h2 className="text-xl font-bold text-white mb-2">Başarısız!</h2>
            <p className="text-red-400 text-sm mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all">
              Tekrar Dene
            </button>
          </div>
        ) : !urlQrToken ? (
          <div className="overflow-hidden rounded-2xl">
            <div id="reader" className="w-full min-h-[250px]"></div>
          </div>
        ) : null}

        <div className="mt-8 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <ShieldAlert className="text-blue-500 flex-shrink-0" size={20} />
          <p className="text-xs text-blue-400 leading-relaxed">
            <strong>Bilgi:</strong> Dinamik QR sistemi aktif — her okutmadan sonra QR kod otomatik yenilenir. Ekran görüntüsü ile yoklama yapılamaz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectScan;