export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'student';
  phone?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  roll: string;
  class: string;
  section: string;
  photo?: string;
  parentPhone: string;
  parentName: string;
  address: string;
  mealCharge: number;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  present: boolean;
  method: 'biometric' | 'qr' | 'manual';
  timestamp: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket' | 'upay' | 'cash' | 'bank';
  transactionId?: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: 'kg' | 'litre' | 'piece' | 'dozen' | 'other';
  stock: number;
  lowStockThreshold: number;
}

export interface Expense {
  id: string;
  category: string;
  item: string; // অথবা itemId: string ব্যবহার করতে পারেন
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierId?: string; // সরবরাহকারী
  date: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  previousDue: number;
  todaysBill: number;
  todaysDeposit: number;
  totalDue: number;
  lastUpdated: string;
}

export interface DueCustomer {
  id: string;
  name: string;
  phone: string;
  previousDue: number;
  todaysDue: number;
  deposit: number;
  totalDue: number;
  dueDate: string;
  reminderSent: boolean;
}

export interface CashEntry {
  id: string;
  source: 'home' | 'match' | 'shop' | 'meal_payment' | 'expense' | 'other';
  amount: number;
  description: string;
  date: string;
}

export interface BiometricDevice {
  id: string;
  name: string;
  ip: string;
  port?: number;
  model?: string;
  location?: string;
  status: 'connected' | 'disconnected' | 'scanning' | 'error';
  lastSync: string;
  isActive: boolean;
  maxUsers?: number;
  currentUsers?: number;
  firmwareVersion?: string;
  serialNumber?: string;
}
