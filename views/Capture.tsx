
import React, { useRef, useState } from 'react';
import { AppConfig, SUBJECTS } from '../types.ts';

interface CaptureProps {
  onBack: () => void;
  config: AppConfig;
}

const Capture: React.FC<CaptureProps> = ({ onBack, config }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onerror = () => reject(new Error('无法读取图片文件，请重试'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(base64Str);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          // 模拟一个极短的延迟以确保用户能看到处理状态，提升心理预期感
          setTimeout(() => resolve(compressedBase64), 400);
        } catch (err) {
          console.error('Compression failed:', err);
          resolve(base64Str);
        }
      };
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(null); // 清除旧图
      setErrorMsg(null);
      setIsProcessing(true); // 立即显示加载状态
      
      const reader = new FileReader();
      reader.onerror = () => {
        setErrorMsg('文件读取失败，请检查手机存储权限');
        setIsProcessing(false);
      };
      reader.onload = async (event) => {
        const originalBase64 = event.target?.result as string;
        try {
          const compressed = await compressImage(originalBase64);
          setPhoto(compressed);
        } catch (err: any) {
          setErrorMsg(err.message || '图片处理失败');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!photo) return;
    setIsUploading(true);
    setErrorMsg(null);
    
    try {
      const response = await fetch(`${config.serverUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photo,
          subject: selectedSubject,
          timestamp: new Date().toISOString()
        }),
      }).catch(() => {
        throw new Error('无法连接到服务器，请检查设置中的 NAS 地址是否正确');
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `服务器返回错误: ${response.status}`);
      }

      alert(`[${selectedSubject}] 错题已成功同步至 NAS`);
      onBack();
    } catch (err: any) {
      setErrorMsg(err.message || '上传失败，请检查网络连接');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 active:bg-slate-100 dark:active:bg-slate-800 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">录入错题</h2>
        <div className="w-10"></div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start space-x-3 animate-in shake duration-300">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-relaxed">{errorMsg}</p>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-[0.2em]">选择科目</label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                selectedSubject === s 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div 
        onClick={!photo && !isProcessing ? triggerCamera : undefined}
        className={`aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden relative flex items-center justify-center border-2 border-dashed transition-all duration-500 ${
          photo 
          ? 'border-transparent shadow-2xl shadow-blue-500/10' 
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500/50'
        }`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 animate-pulse">正在优化图像...</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Applying Compression</p>
          </div>
        ) : photo ? (
          <div className="relative w-full h-full group animate-in fade-in zoom-in-95 duration-500">
            <img src={photo} alt="Preview" className="w-full h-full object-contain bg-slate-50 dark:bg-black" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <button onClick={triggerCamera} className="bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                更换图片
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 group cursor-pointer">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <svg className="w-10 h-10 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="text-slate-800 dark:text-slate-100 font-black text-xl mb-1">拍摄或选择照片</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">支持从相册选取或实时拍摄</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleCapture}
      />

      <div className="mt-10 space-y-4">
        {photo && (
          <button 
            onClick={handleUpload}
            disabled={isUploading || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                同步到 NAS 云端...
              </span>
            ) : '确认并录入错题'}
          </button>
        )}
        
        {photo && (
          <button 
            onClick={triggerCamera}
            disabled={isUploading}
            className="w-full font-bold py-4 rounded-[1.2rem] transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            重新拍摄
          </button>
        )}
      </div>
    </div>
  );
};

export default Capture;
