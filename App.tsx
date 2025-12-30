
import React, { useState, useEffect } from 'react';
import { View, AppConfig } from './types.ts';
import Home from './views/Home.tsx';
import Capture from './views/Capture.tsx';
import Settings from './views/Settings.tsx';
import About from './views/About.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('app_config');
    return saved ? JSON.parse(saved) : {
      serverUrl: 'http://192.168.1.2:3000',
      version: '1.0.0 (Build 20240520)',
      buildBy: 'Rochester Tian',
      contact: 'rochester.tian@gmail.com'
    };
  });

  useEffect(() => {
    localStorage.setItem('app_config', JSON.stringify(config));
  }, [config]);

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home onNavigate={setCurrentView} config={config} />;
      case View.CAPTURE:
        return <Capture onBack={() => setCurrentView(View.HOME)} config={config} />;
      case View.SETTINGS:
        return <Settings config={config} onUpdateConfig={setConfig} onBack={() => setCurrentView(View.HOME)} />;
      case View.ABOUT:
        return <About config={config} onBack={() => setCurrentView(View.HOME)} />;
      default:
        return <Home onNavigate={setCurrentView} config={config} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto shadow-xl bg-white dark:bg-slate-900">
      <main className="flex-1 overflow-y-auto pb-20 safe-area-pt">
        {renderView()}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 flex justify-around items-center h-16 safe-area-pb z-50">
        <button 
          onClick={() => setCurrentView(View.HOME)}
          className={`flex flex-col items-center flex-1 py-2 ${currentView === View.HOME ? 'text-blue-500' : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-xs mt-1">首页</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.CAPTURE)}
          className={`flex flex-col items-center flex-1 py-2 -mt-8`}
        >
          <div className="bg-blue-600 p-3 rounded-full shadow-lg text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="text-xs mt-1 text-blue-600 font-bold">拍照</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.SETTINGS)}
          className={`flex flex-col items-center flex-1 py-2 ${currentView === View.SETTINGS ? 'text-blue-500' : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-xs mt-1">设置</span>
        </button>
        <button 
          onClick={() => setCurrentView(View.ABOUT)}
          className={`flex flex-col items-center flex-1 py-2 ${currentView === View.ABOUT ? 'text-blue-500' : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-xs mt-1">关于</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
