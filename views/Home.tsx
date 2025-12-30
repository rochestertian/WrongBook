
import React, { useState, useEffect } from 'react';
import { View, AppConfig, Question } from '../types.ts';

interface HomeProps {
  onNavigate: (view: View) => void;
  config: AppConfig;
}

const APP_ICON_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cmVjdCB4PSIyMCIgeT0iMTYiIHdpZHRoPSI4OCIgaGVpZ2h0PSI5NiIgcng9IjgiIGZpbGw9IiMzNDQ5NWUiLz4NCjxwYXRoIGQ9Ik0zMiAyNkg5Nk0zMiA0Mkg5Nk0zMiA1OEg5NiIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KPGNpcmNsZSBjeD0iOTQiIGN5PSI5NCIgcj0iMjQiIGZpbGw9IndoaXRlIi8+DQo8cGF0aCBkPSJNOTQgOTRMMTAyIDEwMk05NCA5NEw4NiA4Nk05NCA5NEw4NiAxMDJNOTQgOTRMMTAyIDg2IiBzdHJva2U9IiNlNzRjM2MiIHN0cm9rZS11aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+DQo8L3N2Zz4=';

const Home: React.FC<HomeProps> = ({ onNavigate, config }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('questions_db');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', subject: '数学', title: '三角函数难题', createdAt: '2024-05-20', imageUrl: 'https://picsum.photos/seed/101/100/100', category: '几何', difficulty: 4 },
      { id: '2', subject: '英语', title: '虚拟语气完形填空', createdAt: '2024-05-19', imageUrl: 'https://picsum.photos/seed/102/100/100', category: '语法', difficulty: 3, reviewDate: new Date().toISOString() },
      { id: '3', subject: '物理', title: '动量守恒定律实验', createdAt: '2024-05-18', imageUrl: 'https://picsum.photos/seed/103/100/100', category: '力学', difficulty: 5 }
    ] as Question[];
  });

  useEffect(() => {
    localStorage.setItem('questions_db', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

    const checkReminders = () => {
        const now = new Date();
        questions.forEach(q => {
            if (q.reviewDate) {
                const rDate = new Date(q.reviewDate);
                if (rDate <= now && Notification.permission === "granted") {
                    new Notification("复习提醒", {
                        body: `你有错题到期了：[${q.subject}] ${q.title}`,
                        icon: APP_ICON_SVG
                    });
                }
            }
        });
    };

    checkReminders();
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [questions]);

  const setReview = (id: string, days: number) => {
    if (days < 0) return;
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    targetDate.setDate(targetDate.getDate() + days);
    
    setQuestions(prev => prev.map(q => 
        q.id === id ? { ...q, reviewDate: targetDate.toISOString() } : q
    ));
  };

  const handleCustomReview = (id: string) => {
    const input = window.prompt('请输入复习间隔（天数）：', '7');
    const days = parseInt(input || '0', 10);
    if (!isNaN(days) && days > 0) {
      setReview(id, days);
    }
  };

  const isDue = (isoDate?: string) => {
    if (!isoDate) return false;
    return new Date(isoDate) <= new Date();
  };

  return (
    <div className="px-6 py-8 pb-24">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <img src={APP_ICON_SVG} alt="Logo" className="w-14 h-14 rounded-2xl shadow-xl" />
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white">错题本</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Wrong Notebook</p>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{isOnline ? '在线' : '离线'}</span>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-600 p-5 rounded-[2rem] text-white">
          <p className="text-blue-100 text-xs font-bold">已录入</p>
          <h2 className="text-4xl font-black">{questions.length}</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700">
          <p className="text-slate-400 text-xs font-bold">待复习</p>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white">
            {questions.filter(q => isDue(q.reviewDate)).length}
          </h2>
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">题目列表</h3>
            <span className="text-[10px] text-slate-400 font-medium">按时间倒序</span>
        </div>
        {questions.map(item => (
          <div key={item.id} className={`bg-white dark:bg-slate-800 p-4 rounded-3xl border transition-all duration-300 ${isDue(item.reviewDate) ? 'border-amber-400 shadow-lg ring-1 ring-amber-400/20' : 'border-slate-100 dark:border-slate-700'}`}>
            <div className="flex items-start space-x-4 mb-4">
              <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover bg-slate-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[10px] font-black text-blue-600 dark:text-blue-400 rounded-md uppercase">{item.subject}</span>
                  {isDue(item.reviewDate) && <span className="text-[9px] text-amber-600 font-black animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span> 待复习
                  </span>}
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-base leading-snug line-clamp-2">{item.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">录入于: {item.createdAt}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">设定复习间隔</span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded">
                  {item.reviewDate ? `下次: ${new Date(item.reviewDate).toLocaleDateString()}` : '未提醒'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setReview(item.id, 1)} 
                  className="flex-1 text-[11px] py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold transition-all"
                >
                  每天
                </button>
                <button 
                  onClick={() => setReview(item.id, 7)} 
                  className="flex-1 text-[11px] py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold transition-all"
                >
                  每周
                </button>
                <button 
                  onClick={() => setReview(item.id, 30)} 
                  className="flex-1 text-[11px] py-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-bold transition-all"
                >
                  每月
                </button>
                <button 
                  onClick={() => handleCustomReview(item.id)} 
                  className="flex-1 text-[11px] py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 rounded-xl font-bold transition-all"
                >
                  自定义
                </button>
              </div>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
            <div className="text-center py-20">
                <div className="text-4xl mb-4 opacity-20 text-slate-400">📝</div>
                <p className="text-slate-400 font-medium">还没有录入任何错题</p>
                <button onClick={() => onNavigate(View.CAPTURE)} className="mt-4 text-blue-600 font-bold text-sm">去拍照录入</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;
