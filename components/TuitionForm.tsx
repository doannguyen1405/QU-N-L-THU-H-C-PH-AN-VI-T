
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Calculator, UserRound, ArrowLeft, Calendar, Clock, Save, RotateCcw } from 'lucide-react';
import { TuitionData, TuitionItem, TuitionType } from '../types';
import { calculateAmount, formatCurrency } from '../utils/formatters';

interface TuitionFormProps {
  type: TuitionType;
  initialData?: TuitionData;
  onSubmit: (data: TuitionData) => void;
  onBack: () => void;
}

const TuitionForm: React.FC<TuitionFormProps> = ({ type, initialData, onSubmit, onBack }) => {
  const defaultNotes = `- Tồn tháng trước sẽ tính vào tháng sau.\n- Học sinh bán trú nghỉ ngày nào sẽ trừ tiền ăn ngày đó. Giờ can thiệp cá nhân sẽ được dạy bù.\n- Học sinh can thiệp cá nhân nghỉ buổi nào sẽ bố trí học bù. Nếu không bố trí dạy bù được, thì sẽ trừ vào học phí tháng tiếp theo.`;

  const getDefaultItems = (t: TuitionType): TuitionItem[] => {
    if (t === 'daycare') {
      return [
        { id: 'd1', content: 'Phí lớp nhóm', unit: 'Tháng', quantity: 1, rate: 1600000, discount: 10 },
        { id: 'd2', content: 'Phí can thiệp cá nhân 1', unit: 'Giờ', quantity: 0, rate: 110000, discount: 10 },
        { id: 'd3', content: 'Phí can thiệp cá nhân 2', unit: 'Giờ', quantity: 0, rate: 100000, discount: 10 },
        { id: 'd4', content: 'Tiền ăn', unit: 'Ngày', quantity: 0, rate: 30000, discount: 0 },
        { id: 'd5', content: 'Phụ phí', unit: 'Tháng', quantity: 1, rate: 30000, discount: 0 },
        { id: 'd6', content: 'Phí sổ liên lạc điện tử', unit: 'Tháng', quantity: 0, rate: 20000, discount: 0 },
        { id: 'd7', content: 'Hoàn phí can thiệp cá nhân 1', unit: 'Giờ', quantity: 0, rate: 110000, discount: 10 },
        { id: 'd8', content: 'Hoàn phí can thiệp cá nhân 2', unit: 'Giờ', quantity: 0, rate: 100000, discount: 10 },
        { id: 'd9', content: 'Hoàn tiền ăn', unit: 'Ngày', quantity: 0, rate: 30000, discount: 0 },
      ];
    }
    return [
      { id: 'i1', content: 'Phí can thiệp cá nhân 1', unit: 'Giờ', quantity: 0, rate: 135000, discount: 10 },
      { id: 'i2', content: 'Phí can thiệp cá nhân 2', unit: 'Giờ', quantity: 0, rate: 130000, discount: 10 },
      { id: 'i3', content: 'Phí sổ liên lạc điện tử', unit: 'Tháng', quantity: 0, rate: 20000, discount: 0 },
      { id: 'i4', content: 'Hoàn phí can thiệp cá nhân 1', unit: 'Tháng', quantity: 0, rate: 135000, discount: 10 },
      { id: 'i5', content: 'Hoàn phí can thiệp cá nhân 2', unit: 'Giờ', quantity: 0, rate: 130000, discount: 10 },
    ];
  };

  const [formData, setFormData] = useState<TuitionData>(initialData || {
    type,
    studentName: '',
    className: type === 'daycare' ? 'Bán trú' : 'Can thiệp cá nhân',
    phoneNumber: '',
    monthYear: `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    createdDate: new Date().toLocaleDateString('vi-VN'),
    studyFormat: type === 'daycare' ? 'Bán trú tại trường' : 'Can thiệp cá nhân theo giờ',
    studySchedule: '', 
    studyHours: type === 'daycare' ? '07h00 - 16h00' : '',
    note: defaultNotes,
    issuer: '', 
    items: getDefaultItems(type)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const draftKey = `tuition_draft_${type}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !initialData) {
      setHasDraft(true);
    }
  }, [type, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof TuitionItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem: TuitionItem = {
      id: Math.random().toString(36).substr(2, 9),
      content: '',
      unit: '',
      quantity: 0,
      rate: 0,
      discount: 0
    };
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    const draftKey = `tuition_draft_${type}`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
    
    setTimeout(() => {
      setSaveStatus('saved');
      setHasDraft(false); // Clear the prompt since we just "saved" current
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  const handleLoadDraft = () => {
    const draftKey = `tuition_draft_${type}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
        setHasDraft(false);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Vui lòng chọn học sinh';
    if (!formData.className.trim()) newErrors.className = 'Vui lòng nhập lớp';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    
    if (type === 'daycare' && !formData.studySchedule.trim()) {
      newErrors.studySchedule = 'Vui lòng chọn lịch học';
    }
    
    if (!formData.issuer.trim()) newErrors.issuer = 'Vui lòng chọn người lập phiếu';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Clear draft upon successful submission
      const draftKey = `tuition_draft_${type}`;
      localStorage.removeItem(draftKey);
      onSubmit(formData);
    } else {
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const totalAmount = formData.items.reduce((sum, item) => {
    const amount = calculateAmount(item.quantity, item.rate, item.discount);
    return item.content.toLowerCase().includes('hoàn') ? sum - amount : sum + amount;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors uppercase text-sm tracking-widest">
          <ArrowLeft size={20} /> QUAY LẠI CHỌN LOẠI HÌNH
        </button>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${type === 'daycare' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
            {type === 'daycare' ? 'Học Phí Bán Trú' : 'Học Phí Cá Nhân'}
          </span>
        </div>
      </div>

      {hasDraft && (
        <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-pulse-slow">
          <div className="flex items-center gap-3 text-amber-800 font-bold text-sm">
            <RotateCcw size={20} />
            Hệ thống tìm thấy bản nháp bạn đã lưu trước đó. Bạn có muốn khôi phục không?
          </div>
          <button 
            onClick={handleLoadDraft}
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition-colors"
          >
            KHÔI PHỤC NGAY
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Calculator size={24} />
            </div>
            NHẬP THÔNG TIN PHIẾU THU
          </h2>
          <button 
            onClick={handleSaveDraft}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              saveStatus === 'saved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {saveStatus === 'saving' ? (
              <span className="flex items-center gap-2 animate-pulse">LƯU...</span>
            ) : saveStatus === 'saved' ? (
              <><CheckCircle size={16} /> ĐÃ LƯU BẢN NHÁP</>
            ) : (
              <><Save size={16} /> LƯU BẢN NHÁP</>
            )}
          </button>
        </div>

        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Họ tên học sinh <span className="text-red-500">*</span></label>
              <select 
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.studentName ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer`}
              >
                <option value="">-- Chọn học sinh --</option>
                {type === 'daycare' ? (
                  <>
                    <option value="Nguyễn Hoàng Hiệp">Nguyễn Hoàng Hiệp</option>
                    <option value="Nguyễn Phi Toàn">Nguyễn Phi Toàn</option>
                  </>
                ) : (
                  <>
                    <option value="Bùi Phúc Nhật">Bùi Phúc Nhật</option>
                    <option value="Gia Hưng">Gia Hưng</option>
                    <option value="Hoàng Minh Lâm">Hoàng Minh Lâm</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lớp <span className="text-red-500">*</span></label>
              <input 
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.className ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-800`}
                placeholder="VD: Bán trú"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input 
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.phoneNumber ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-800`}
                placeholder="Nhập SĐT (chỉ số)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phiếu thu tháng</label>
              <input 
                name="monthYear"
                value={formData.monthYear}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-black text-blue-600"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Nội dung chi tiết</h3>
              <button 
                onClick={addItem}
                className="flex items-center gap-2 text-sm text-blue-600 font-black hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
              >
                <Plus size={18} /> THÊM KHOẢN THU
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-[0.1em]">
                  <tr>
                    <th className="px-4 py-4 text-left w-12">STT</th>
                    <th className="px-4 py-4 text-left min-w-[200px]">Nội dung thu</th>
                    <th className="px-4 py-4 text-center w-24">ĐVT</th>
                    <th className="px-4 py-4 text-center w-20">SL</th>
                    <th className="px-4 py-4 text-left w-32">Mức phí</th>
                    <th className="px-4 py-4 text-center w-24">Giảm %</th>
                    <th className="px-4 py-4 text-right w-36">Thành tiền</th>
                    <th className="px-4 py-4 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-black text-slate-300">{idx + 1}</td>
                      <td className="px-2 py-2">
                        <input 
                          value={item.content}
                          onChange={(e) => handleItemChange(idx, 'content', e.target.value)}
                          className={`w-full px-3 py-2 bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none font-bold ${item.content.toLowerCase().includes('hoàn') ? 'text-red-600' : 'text-slate-700'}`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input 
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className={`w-full px-3 py-2 bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none text-center font-medium ${item.content.toLowerCase().includes('hoàn') ? 'text-red-500' : ''}`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none text-center font-bold ${item.content.toLowerCase().includes('hoàn') ? 'text-red-500' : ''}`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input 
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none font-bold ${item.content.toLowerCase().includes('hoàn') ? 'text-red-500' : 'text-slate-600'}`}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input 
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(idx, 'discount', parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none text-center font-bold ${item.content.toLowerCase().includes('hoàn') ? 'text-red-500' : 'text-emerald-600'}`}
                        />
                      </td>
                      <td className={`px-4 py-4 text-right font-black ${item.content.toLowerCase().includes('hoàn') ? 'text-red-600' : 'text-slate-800'}`}>
                        {item.content.toLowerCase().includes('hoàn') ? '-' : ''}{formatCurrency(calculateAmount(item.quantity, item.rate, item.discount))}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50">
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-right font-black text-slate-800 uppercase tracking-widest">Tổng thực thu</td>
                    <td className="px-4 py-6 text-right font-black text-blue-700 text-2xl">
                      {formatCurrency(totalAmount)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t-2 border-slate-100">
             <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Calendar size={12} /> Lịch học {type === 'daycare' && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    {type === 'daycare' ? (
                      <select 
                        name="studySchedule"
                        value={formData.studySchedule}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.studySchedule ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer`}
                      >
                        <option value="">-- Chọn lịch học --</option>
                        <option value="Thứ hai đến thứ sáu">Thứ hai đến thứ sáu</option>
                        <option value="Thứ hai đến thứ bảy">Thứ hai đến thứ bảy</option>
                      </select>
                    ) : (
                      <input 
                        name="studySchedule"
                        value={formData.studySchedule}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-700"
                        placeholder="VD: Thứ 2, 4, 6"
                      />
                    )}
                    {type === 'daycare' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Plus size={16} className="rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Clock size={12} /> Giờ học
                  </label>
                  <input 
                    name="studyHours"
                    value={formData.studyHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    placeholder={type === 'daycare' ? '07h00 - 16h00' : 'Nhập thời gian học'}
                  />
                </div>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hình thức học tập</label>
                  <input 
                    name="studyFormat"
                    value={formData.studyFormat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Người lập phiếu <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.issuer ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none appearance-none font-bold text-slate-800 cursor-pointer`}
                    >
                      <option value="">Chọn người lập phiếu</option>
                      <option value="Nguyễn Thị Bích">Nguyễn Thị Bích</option>
                      <option value="Nguyễn Ngọc Đoàn">Nguyễn Ngọc Đoàn</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú phiếu thu</label>
            <textarea 
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none leading-relaxed"
              placeholder="Nhập ghi chú..."
            />
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-6">
            <button 
              onClick={handleSaveDraft}
              className="px-8 py-5 bg-white border-2 border-slate-200 text-slate-600 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 text-lg"
            >
              <Save size={24} />
              LƯU BẢN NHÁP
            </button>
            <button 
              onClick={handleSubmit}
              className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 transition-all active:scale-95 text-lg"
            >
              <CheckCircle size={24} />
              HOÀN THÀNH PHIẾU THU
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(0.995); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TuitionForm;
