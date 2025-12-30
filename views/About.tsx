import React from 'react';
import { AppConfig } from '../types.ts';

interface AboutProps {
  config: AppConfig;
  onBack: () => void;
}

const APP_ICON_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cmVjdCB4PSIyMCIgeT0iMTYiIHdpZHRoPSI4OCIgaGVpZ2h0PSI5NiIgcng9IjgiIGZpbGw9IiMzNDQ5NWUiLz4NCjxwYXRoIGQ9Ik0zMiAyNkg5Nk0zMiA0Mkg5Nk0zMiA1OEg5NiIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KPGNpcmNsZSBjeD0iOTQiIGN5PSI5NCIgcj0iMjQiIGZpbGw9IndoaXRlIi8+DQo8cGF0aCBkPSJNOTQgOTRMMTAyIDEwMk05NCA5NEw4NiA4Nk05NCA5NEw4NiAxMDJNOTQgOTRMMTAyIDg2IiBzdHJva2U9IiNlNzRjM2MiIHN0cm9rZS11aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQo8L3N2Zz4=';

const About: React.FC<AboutProps> = ({ config, onBack }) => {
  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center py-16">
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img src={APP_ICON_SVG} alt="App Icon" className="relative w-28 h-28 rounded-[2rem] shadow-2xl mb-8 transform group-hover:scale-105 transition-transform duration-500" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">错题本 <span className="text-blue-600">Pro</span></h2>
        <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm font-medium tracking-wide">Wrong Notebook Enterprise</p>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] p-8 space-y-6 border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center group">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">应用版本</span>
          <span className="font-mono text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">{config.version}</span>
        </div>
        
        <div className="h-px bg-slate-100 dark:bg-slate-700/50"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">构建开发者</span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{config.buildBy}</span>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700/50"></div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">联系支持</span>
          <a 
            href={`mailto:${config.contact}`} 
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
          >
            {config.contact}
          </a>
        </div>
      </div>

      <div className="mt-20 text-center space-y-2">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.3em]">Built for NAS Cloud Storage</p>
        <p className="text-[11px] text-slate-300 dark:text-slate-700">© 2024 Rochester Tian. Made with passion.</p>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-12 w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-sm py-4 transition-colors"
      >
        返回上一页
      </button>
    </div>
  );
};

export default About;