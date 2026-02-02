
import React, { useState, useEffect } from 'react';
import { Home, User, ArrowRight, GraduationCap, Users, ShieldCheck, History as HistoryIcon } from 'lucide-react';
import { TuitionType, TuitionData } from '../types';

interface DashboardProps {
  onSelectType: (type: TuitionType) => void;
  onViewHistory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectType, onViewHistory }) => {
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('tuition_history') || '[]');
    setHistoryCount(history.length);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Hệ Thống Quản Lý Thu Học Phí An Việt</h2>
        <p className="text-slate-500 text-lg font-medium">Vui lòng chọn chức năng để tiếp tục</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daycare Option */}
        <button 
          onClick={() => onSelectType('daycare')}
          className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Home size={100} className="text-blue-600" />
          </div>
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Học phí Bán trú</h3>
          <p className="text-slate-500 mb-8 font-medium text-sm">Trọn gói tiền ăn, học phẩm và dịch vụ bán trú.</p>
          <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-2 transition-transform uppercase tracking-wider text-xs">
            LẬP PHIẾU MỚI <ArrowRight size={16} />
          </div>
        </button>

        {/* Individual Option */}
        <button 
          onClick={() => onSelectType('individual')}
          className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-emerald-500 transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap size={100} className="text-emerald-600" />
          </div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
            <User size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Học phí Cá nhân</h3>
          <p className="text-slate-500 mb-8 font-medium text-sm">Tính theo số giờ can thiệp và tiết dạy riêng lẻ.</p>
          <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:translate-x-2 transition-transform uppercase tracking-wider text-xs">
            LẬP PHIẾU MỚI <ArrowRight size={16} />
          </div>
        </button>

        {/* History Option */}
        <button 
          onClick={onViewHistory}
          className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-amber-500 transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <HistoryIcon size={100} className="text-amber-600" />
          </div>
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-inner">
            <HistoryIcon size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Lịch sử phiếu thu</h3>
          <p className="text-slate-500 mb-8 font-medium text-sm">Đã lưu <span className="text-amber-600 font-black">{historyCount}</span> phiếu thu trong hệ thống.</p>
          <div className="flex items-center gap-2 text-amber-600 font-bold group-hover:translate-x-2 transition-transform uppercase tracking-wider text-xs">
            XEM DANH SÁCH <ArrowRight size={16} />
          </div>
        </button>
      </div>
      
      <div className="mt-16 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1 tracking-tight uppercase text-xs">Thông báo hệ thống</h4>
          <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
            Phiếu thu sau khi nhấn "Hoàn thành" sẽ được tự động lưu vào trình duyệt này để bạn có thể xem lại hoặc in lại bất cứ lúc nào trong mục Lịch sử.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
