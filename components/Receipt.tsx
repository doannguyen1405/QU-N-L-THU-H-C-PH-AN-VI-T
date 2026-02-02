
import React from 'react';
import { Edit, Printer, Download, ArrowLeft } from 'lucide-react';
import { TuitionData } from '../types';
import { calculateAmount, formatCurrency, maskPhoneNumber } from '../utils/formatters';

interface ReceiptProps {
  data: TuitionData;
  onEdit: () => void;
  onBack: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ data, onEdit, onBack }) => {
  
  // Xử lý logic IN PHIẾU (Isolated Window)
  const handlePrintReceipt = () => {
    const printContent = document.getElementById('receipt-print-area');
    if (!printContent) return;

    // Tạo cửa sổ in mới
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Vui lòng cho phép mở cửa sổ pop-up để thực hiện in.");
      return;
    }

    // Lấy các style hiện tại (bao gồm Tailwind CDN từ index.html)
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>In Phiếu Thu - An Việt</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${styles}
          <style>
            body { 
              background: white !important; 
              margin: 0; 
              padding: 0; 
              display: flex;
              justify-content: center;
              font-family: 'Inter', sans-serif;
            }
            .receipt-container { 
              box-shadow: none !important; 
              width: 210mm !important; 
              min-height: 297mm !important;
              margin: 0 !important; 
              border: none !important;
              padding: 15mm 20mm 10mm 20mm !important;
              display: flex;
              flex-direction: column;
            }
            .footer-branding {
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              margin-top: auto;
              padding-top: 20px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            @media print {
              @page { margin: 0; size: A4; }
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent.innerHTML}
            <div class="footer-branding">Phần mềm được phát triển bởi An Hòa EduTech</div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Xử lý logic TẢI PDF (Blob HTML - Chuẩn bị để in PDF)
  const handleDownloadPDF = () => {
    const printContent = document.getElementById('receipt-print-area');
    if (!printContent) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('\n');

    const fileName = `Phieu_Thu_${data.studentName.replace(/\s+/g, '_')}_${data.monthYear.replace(/\s+/g, '_')}`;

    const htmlBlobContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${fileName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${styles}
          <style>
            body { background: white; margin: 0; padding: 0; display: flex; justify-content: center; font-family: 'Inter', sans-serif; }
            .receipt-container { 
              box-shadow: none !important; 
              width: 210mm !important; 
              min-height: 297mm !important;
              padding: 20mm;
              border: none !important; 
              display: flex;
              flex-direction: column;
            }
            .footer-branding {
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              margin-top: auto;
              padding-top: 20px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            @media print { @page { size: A4; margin: 0; } body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent.innerHTML}
            <div class="footer-branding">Phần mềm được phát triển bởi An Hòa EduTech</div>
          </div>
          <script>
            window.onload = () => {
              alert("Hệ thống đã chuẩn bị tệp tin. Vui lòng chọn 'Lưu dưới dạng PDF' trong hộp thoại tiếp theo.");
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlBlobContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalAmount = data.items.reduce((sum, item) => {
    const amount = calculateAmount(item.quantity, item.rate, item.discount);
    return item.content.toLowerCase().includes('hoàn') ? sum - amount : sum + amount;
  }, 0);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-100 no-print">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 font-black uppercase text-xs tracking-widest hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} /> QUAY LẠI
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onEdit}
              className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-black rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest"
            >
              <Edit size={16} /> SỬA DỮ LIỆU
            </button>
            <button 
              onClick={handlePrintReceipt}
              className="px-6 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 uppercase text-[10px] tracking-widest"
            >
              <Printer size={16} /> IN PHIẾU
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="px-6 py-2.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 uppercase text-[10px] tracking-widest"
            >
              <Download size={16} /> TẢI PDF
            </button>
          </div>
        </div>

        {/* The Receipt Document */}
        <div className="receipt-container relative shadow-2xl bg-white p-[20mm] flex flex-col" id="receipt-print-area">
          {/* Main Receipt Content Wrapper */}
          <div className="flex-1">
            {/* Logo - Top Left */}
            <div className="absolute top-10 left-10 w-28 h-28 flex items-center justify-center border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm">
              <img 
                src="https://sf-static.upanhlaylink.com/img/image_202602021d529a6140e91b0775ccc2835d6bf2c2.jpg" 
                alt="An Viet Logo" 
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* Header Info */}
            <div className="text-center mb-10 pt-4 space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">TRUNG TÂM CAN THIỆP SỚM AN VIỆT</h2>
              <p className="text-sm font-bold text-slate-600">Địa chỉ: Trung Báo, X. Cao Dương, T. Phú Thọ</p>
              <p className="text-sm font-black text-blue-700">Điện thoại: 0984.538.228 - 0925.717.826</p>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-[0.2em] border-b-4 border-slate-900 inline-block pb-2">
                PHIẾU HỌC PHÍ {data.monthYear.toUpperCase()}
              </h1>
            </div>

            {/* Student/General Info */}
            <div className="grid grid-cols-2 gap-4 text-slate-800 font-bold border-y-2 border-slate-100 py-6 mb-8 text-base">
              <div className="space-y-2">
                <p>Học sinh: <span className="font-black text-lg text-slate-950">{data.studentName}</span></p>
                <p>Lớp: <span className="text-slate-600 font-bold">{data.className}</span></p>
              </div>
              <div className="space-y-2 text-right">
                <p>Phụ huynh (SĐT): <span className="text-slate-600 font-bold">{maskPhoneNumber(data.phoneNumber)}</span></p>
                <p>Ngày lập phiếu: <span className="text-slate-600 font-bold">{data.createdDate}</span></p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border-2 border-slate-900 mb-8 text-sm">
              <thead className="bg-slate-100 font-black text-slate-900 uppercase tracking-wider">
                <tr>
                  <th className="border-2 border-slate-900 px-2 py-4 text-center w-12">STT</th>
                  <th className="border-2 border-slate-900 px-4 py-4 text-left">Nội dung thu</th>
                  <th className="border-2 border-slate-900 px-2 py-4 text-center w-16">ĐVT</th>
                  <th className="border-2 border-slate-900 px-2 py-4 text-center w-12">SL</th>
                  <th className="border-2 border-slate-900 px-3 py-4 text-right w-28">Mức phí</th>
                  <th className="border-2 border-slate-900 px-2 py-4 text-center w-16">Giảm giá</th>
                  <th className="border-2 border-slate-900 px-4 py-4 text-right w-32 font-black">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="text-slate-900">
                {data.items.map((item, idx) => {
                  const isRefund = item.content.toLowerCase().includes('hoàn');
                  const amount = calculateAmount(item.quantity, item.rate, item.discount);
                  return (
                    <tr key={idx} className={`font-bold ${isRefund ? 'text-red-600' : ''}`}>
                      <td className="border-2 border-slate-900 px-2 py-3 text-center">{idx + 1}</td>
                      <td className="border-2 border-slate-900 px-4 py-3 font-black">{item.content}</td>
                      <td className="border-2 border-slate-900 px-2 py-3 text-center">{item.unit}</td>
                      <td className="border-2 border-slate-900 px-2 py-3 text-center">{item.quantity}</td>
                      <td className="border-2 border-slate-900 px-3 py-3 text-right">{formatCurrency(item.rate)}</td>
                      <td className="border-2 border-slate-900 px-2 py-3 text-center">{item.discount > 0 ? `${item.discount}%` : ''}</td>
                      <td className="border-2 border-slate-900 px-4 py-3 text-right font-black">
                        {isRefund ? '-' : ''}{formatCurrency(amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="border-2 border-slate-900 px-6 py-4 text-right font-black uppercase text-base tracking-[0.2em]">Tổng thực thu</td>
                  <td className="border-2 border-slate-900 px-4 py-4 text-right font-black text-xl bg-slate-50">
                    {formatCurrency(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Footer details */}
            <div className="grid grid-cols-1 gap-1 mb-8 text-slate-800 text-sm italic font-bold">
              <p>● Hình thức: {data.studyFormat}</p>
              {data.studySchedule && <p>● Lịch học: {data.studySchedule}</p>}
              {data.studyHours && <p>● Giờ học: {data.studyHours}</p>}
            </div>

            <div className="mb-10 text-slate-700 text-[11px] leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-black uppercase text-[10px] text-slate-400 mb-2 tracking-widest">Ghi chú & Quy định</h4>
              <div className="whitespace-pre-line">
                {data.note}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 items-start mb-16">
              <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Thanh toán chuyển khoản</h4>
                    <div className="text-sm font-bold text-slate-800 space-y-2">
                       <p>Ngân hàng: <span className="text-slate-950">TPBank (Tiên Phong)</span></p>
                       <p>Số tài khoản: <span className="text-blue-700 font-black text-base underline tracking-wider">10000815935</span></p>
                       <p>Chủ tài khoản: <span className="text-slate-950 uppercase font-black">Nguyễn Thị Bích</span></p>
                    </div>
                    <div className="mt-6 flex items-center gap-6">
                       <div className="w-50 h-50 border-2 border-slate-200 p-2 flex items-center justify-center bg-white rounded-2xl shadow-inner">
                         <img 
                           src="https://sf-static.upanhlaylink.com/img/image_20260202839e4db9dfbd79c90f8c9f02d89a1908.jpg" 
                           alt="Payment QR" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                       <p className="text-[11px] text-slate-500 font-black uppercase leading-relaxed italic max-w-[120px]">Quét mã QR để thực hiện chuyển khoản nhanh</p>
                    </div>
                 </div>
              </div>
              <div className="text-center pt-8">
                 <p className="font-black text-slate-900 uppercase tracking-widest mb-24">Người lập phiếu</p>
                 <div className="space-y-1">
                   <p className="font-black text-xl text-slate-950 italic">{data.issuer || '................................'}</p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bộ phận quản lý - An Việt</p>
                 </div>
              </div>
            </div>

            <div className="text-center mt-auto border-t-2 border-slate-100 pt-6">
               <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em]">TRUNG TÂM CAN THIỆP SỚM AN VIỆT - VÌ SỰ PHÁT TRIỂN CỦA TRẺ</p>
            </div>
          </div>

          {/* Branding Footer (Visible on Screen) */}
          <div className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pb-4">
            Phần mềm được phát triển bởi An Hòa EduTech
          </div>
        </div>
      </div>
      
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            .receipt-container { 
              box-shadow: none !important; 
              border: none !important;
              width: 100% !important; 
              max-width: none !important;
              padding: 0 !important;
              margin: 0 !important;
              position: static !important;
              display: flex !important;
              flex-direction: column !important;
              min-height: 297mm !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Receipt;
