
import React, { useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TuitionForm from './components/TuitionForm';
import Receipt from './components/Receipt';
import History from './components/History';
import { ViewState, TuitionData, TuitionType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedType, setSelectedType] = useState<TuitionType | null>(null);
  const [tuitionData, setTuitionData] = useState<TuitionData | null>(null);

  const handleLogin = (code: string) => {
    if (code === 'Anviet@2026') {
      setIsAuthenticated(true);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTuitionData(null);
    setSelectedType(null);
    setView('login');
  };

  const handleSelectType = (type: TuitionType) => {
    setSelectedType(type);
    setView('form');
  };

  const handleFormSubmit = (data: TuitionData) => {
    // Lưu vào lịch sử LocalStorage
    const historyJson = localStorage.getItem('tuition_history');
    const history: TuitionData[] = historyJson ? JSON.parse(historyJson) : [];
    
    // Nếu là sửa từ lịch sử thì cập nhật, nếu không thì thêm mới
    const receiptWithId = { ...data, id: data.id || Date.now().toString() };
    
    const existingIndex = history.findIndex(h => h.id === receiptWithId.id);
    if (existingIndex > -1) {
      history[existingIndex] = receiptWithId;
    } else {
      history.unshift(receiptWithId);
    }
    
    localStorage.setItem('tuition_history', JSON.stringify(history));
    
    setTuitionData(receiptWithId);
    setView('receipt');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleViewReceipt = (data: TuitionData) => {
    setTuitionData(data);
    setView('receipt');
  };

  const handleEdit = () => {
    if (tuitionData) {
      setSelectedType(tuitionData.type);
    }
    setView('form');
  };

  const handleBackToDashboard = () => {
    setTuitionData(null);
    setSelectedType(null);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
      />
      
      <main className={`flex-1 ${isAuthenticated ? "pt-16" : ""}`}>
        {view === 'login' && (
          <Login onLogin={handleLogin} />
        )}

        {isAuthenticated && view === 'dashboard' && (
          <Dashboard 
            onSelectType={handleSelectType} 
            onViewHistory={handleViewHistory}
          />
        )}

        {isAuthenticated && view === 'history' && (
          <History 
            onViewReceipt={handleViewReceipt}
            onBack={handleBackToDashboard}
          />
        )}

        {isAuthenticated && view === 'form' && selectedType && (
          <TuitionForm 
            type={selectedType}
            initialData={tuitionData || undefined} 
            onSubmit={handleFormSubmit} 
            onBack={handleBackToDashboard}
          />
        )}

        {isAuthenticated && view === 'receipt' && tuitionData && (
          <Receipt 
            data={tuitionData} 
            onEdit={handleEdit} 
            onBack={handleViewHistory} 
          />
        )}
      </main>

      {/* Helper for print only text if needed */}
      <div className="hidden print-only fixed bottom-4 left-0 w-full text-center text-[8px] text-slate-300 font-bold uppercase tracking-widest">
        In từ hệ thống quản lý nội bộ TRUNG TÂM AN VIỆT - Phiếu thu chính thức
      </div>
    </div>
  );
};

export default App;
