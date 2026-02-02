
import React, { useState, useEffect } from 'react';
/* Added Users to the lucide-react import list */
import { Search, ArrowLeft, Eye, Trash2, Calendar, User, FileText, ChevronRight, Users } from 'lucide-react';
import { TuitionData } from '../types';
import { calculateAmount, formatCurrency } from '../utils/formatters';

interface HistoryProps {
  onViewReceipt: (data: TuitionData) => void;
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onViewReceipt, onBack }) => {
  const [history, setHistory] = useState<TuitionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'daycare' | 'individual'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('tuition_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu thu này khỏi lịch sử?')) {
      const updated = history.filter(h => h.id !== id);
      setHistory(updated);
      localStorage.setItem('tuition_history', JSON.stringify(updated));
    }
  };

  const getGrandTotal = (data: TuitionData) => {
    return data.items.reduce((sum, item) => {
      const amount = calculateAmount(item.quantity, item.rate, item.discount);
      return item.content.toLowerCase().includes('hoàn') ? sum - amount : sum + amount;
    }, 0);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors uppercase text-xs tracking-widest mb-4">
            <ArrowLeft size={16} /> QUAY LẠI TRANG CHỦ
          </button>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Lịch sử phiếu thu</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm tên học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none w-full sm:w-64 font-bold text-slate-700"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">Tất cả loại hình</option>
            <option value="daycare">Bán trú</option>
            <option value="individual">Cá nhân</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">Chưa có dữ liệu phiếu thu</h3>
          <p className="text-slate-400 font-medium">Các phiếu thu bạn lập sẽ xuất hiện tại đây sau khi hoàn thành.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id}
              onClick={() => onViewReceipt(item)}
              className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${item.type === 'daycare' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {item.type === 'daycare' ? <Users size={28} /> : <User size={28} />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-800 uppercase leading-none">{item.studentName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${item.type === 'daycare' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {item.type === 'daycare' ? 'Bán trú' : 'Cá nhân'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {item.monthYear}</span>
                  <span className="flex items-center gap-1.5"><FileText size={14} /> Lập ngày: {item.createdDate}</span>
                </div>
              </div>

              <div className="text-right md:px-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tổng tiền</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(getGrandTotal(item))}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button 
                  onClick={(e) => { e.stopPropagation(); onViewReceipt(item); }}
                  className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  title="Xem lại"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={(e) => handleDelete(item.id!, e)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
                <div className="ml-2 text-slate-200 group-hover:text-blue-300 transition-colors hidden md:block">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
