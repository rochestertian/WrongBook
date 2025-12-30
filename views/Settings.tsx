import React, { useState } from 'react';
import { AppConfig } from '../types.ts';

interface SettingsProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdateConfig, onBack }) => {
  const [url, setUrl] = useState(config.serverUrl);
  const [testStatus, setTestStatus] = useState<'none' | 'testing' | 'ok' | 'fail'>('none');

  const handleSave = () => {
    onUpdateConfig({ ...config, serverUrl: url });
    alert('✅ 配置已保存');
    onBack();
  };

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      await fetch(`${url}/ping`, { signal: controller.signal }).catch(() => {});
      setTestStatus('ok');
    } catch (e) {
      setTestStatus('fail');
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">配置中心</h2>
        <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <label className="block text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">NAS 地址</label>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={testConnection}
            className={`w-full py-3 rounded-xl text-xs font-bold ${
                testStatus === 'ok' ? 'bg-green-100 text-green-600' :
                testStatus === 'fail' ? 'bg-red-100 text-red-600' :
                'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {testStatus === 'testing' ? '正在拨号...' : 
             testStatus === 'ok' ? '✅ 连接成功' : 
             testStatus === 'fail' ? '❌ 无法连接' : '探测服务器状态'}
          </button>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          保存并应用
        </button>
      </div>
    </div>
  );
};

export default Settings;