
import React, { useState } from 'react';
import { Lock, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (code: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== 'Anviet@2026') {
      setError('Mã số bí mật không chính xác. Vui lòng thử lại.');
      return;
    }
    setError('');
    onLogin(code);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-slate-100">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck size={40} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">QUẢN LÝ THU HỌC PHÍ</h2>
            <p className="text-slate-500 font-medium tracking-wide">TRUNG TÂM CAN THIỆP SỚM AN VIỆT</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block ml-1 uppercase tracking-wider">Mã trường</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Hãy nhập mã số bí mật"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-lg font-medium"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                title={showPassword ? "Ẩn mã số" : "Hiện mã số"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em]">Cổng thông tin quản lý nội bộ</p>
          <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase">Lưu ý: Không chia sẻ mã này với người ngoài</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
