
import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, isAuthenticated }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              TRUNG TÂM CAN THIỆP SỚM AN VIỆT
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              QUẢN LÝ THU HỌC PHÍ
            </p>
          </div>
        </div>
        
        {isAuthenticated && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
