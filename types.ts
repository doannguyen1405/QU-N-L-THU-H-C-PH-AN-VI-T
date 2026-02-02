
export interface TuitionItem {
  id: string;
  content: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number; // percentage
}

export type TuitionType = 'daycare' | 'individual';

export interface TuitionData {
  id?: string;
  type: TuitionType;
  studentName: string;
  className: string;
  phoneNumber: string;
  monthYear: string;
  createdDate: string;
  items: TuitionItem[];
  studyFormat: string;
  studySchedule: string;
  studyHours: string;
  note: string;
  issuer: string;
}

export type ViewState = 'login' | 'dashboard' | 'form' | 'receipt' | 'history';
