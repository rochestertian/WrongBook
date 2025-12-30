import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 增强型日志系统
const logger = {
  info: (msg: string) => console.log(`%c[INFO] ${msg}`, 'color: #3b82f6; font-weight: bold'),
  success: (msg: string) => console.log(`%c[SUCCESS] ${msg}`, 'color: #10b981; font-weight: bold'),
  error: (msg: string) => console.error(`%c[ERROR] ${msg}`, 'color: #ef4444; font-weight: bold')
};

logger.info('错题本 Pro 正在初始化...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  logger.error("无法找到 DOM 根节点 '#root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    logger.success('React 渲染层已就绪');
  } catch (error) {
    logger.error('渲染崩溃: ' + (error instanceof Error ? error.message : String(error)));
    
    // 降级 UI 渲染
    rootElement.innerHTML = `
      <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; font-family:sans-serif; background:#f8fafc; color:#1e293b; text-align:center;">
        <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
        <h2 style="font-weight:900; margin-bottom:8px;">应用启动受阻</h2>
        <p style="color:#64748b; font-size:14px; max-width:300px; line-height:1.6;">可能是因为网络限制或浏览器版本过低导致的脚本加载失败。</p>
        <button onclick="window.location.reload()" style="margin-top:24px; padding:12px 32px; background:#3b82f6; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; box-shadow:0 10px 15px -3px rgba(59,130,246,0.3);">
          尝试刷新
        </button>
      </div>
    `;
  }
}