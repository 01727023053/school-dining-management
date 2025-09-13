import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Attendance, Payment, Expense, Supplier, DueCustomer, CashEntry, BiometricDevice } from '../types';

interface DataContextType {
  students: Student[];
  attendance: Attendance[];
  payments: Payment[];
  expenses: Expense[];
  suppliers: Supplier[];
  dueCustomers: DueCustomer[];
  cashEntries: CashEntry[];
  biometricDevices: BiometricDevice[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  addDueCustomer: (customer: Omit<DueCustomer, 'id'>) => void;
  updateDueCustomer: (id: string, customer: Partial<DueCustomer>) => void;
  addCashEntry: (entry: Omit<CashEntry, 'id'>) => void;
  addBiometricDevice: (device: Omit<BiometricDevice, 'id' | 'status' | 'lastSync' | 'isActive'>) => void;
  updateBiometricDevice: (id: string, device: Partial<BiometricDevice>) => void;
  deleteBiometricDevice: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [attendance, setAttendance] = useState<Attendance[] | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [dueCustomers, setDueCustomers] = useState<DueCustomer[] | null>(null);
  const [cashEntries, setCashEntries] = useState<CashEntry[] | null>(null);
  const [biometricDevices, setBiometricDevices] = useState<BiometricDevice[] | null>(null);

  // Load demo data
  useEffect(() => {
    const demoStudents: Student[] = [
      {
        id: '1',
        name: 'Student User',
        roll: '001',
        class: 'Class 10',
        section: 'A',
        parentPhone: '01712345678',
        parentName: 'মোঃ করিম',
        address: 'ঢাকা',
        mealCharge: 80,
        balance: 1200,
        status: 'active',
        createdAt: new Date().toISOString(),
        photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '2',
        name: 'ফাতিমা খাতুন',
        roll: '002',
        class: 'Class 10',
        section: 'A',
        parentPhone: '01812345678',
        parentName: 'মোঃ রহিম',
        address: 'চট্টগ্রাম',
        mealCharge: 75,
        balance: 250,
        status: 'active',
        createdAt: new Date().toISOString(),
        photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '3',
        name: 'মোহাম্মদ রাহুল',
        roll: '003',
        class: 'Class 9',
        section: 'B',
        parentPhone: '01912345678',
        parentName: 'মোঃ আলী',
        address: 'সিলেট',
        mealCharge: 85,
        balance: 800,
        status: 'active',
        createdAt: new Date().toISOString(),
        photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '4',
        name: 'সাদিয়া আক্তার',
        roll: '004',
        class: 'Class 8',
        section: 'A',
        parentPhone: '01612345678',
        parentName: 'মোঃ হাসান',
        address: 'রাজশাহী',
        mealCharge: 70,
        balance: 150,
        status: 'active',
        createdAt: new Date().toISOString(),
        photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '5',
        name: 'তানভীর আহমেদ',
        roll: '005',
        class: 'Class 7',
        section: 'C',
        parentPhone: '01512345678',
        parentName: 'মোঃ সালাম',
        address: 'খুলনা',
        mealCharge: 75,
        balance: 950,
        status: 'active',
        createdAt: new Date().toISOString(),
        photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      }
    ];

    const demoAttendance: Attendance[] = [
      {
        id: '1',
        studentId: '1',
        date: new Date().toISOString().split('T')[0],
        present: true,
        method: 'manual',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        studentId: '2',
        date: new Date().toISOString().split('T')[0],
        present: true,
        method: 'qr',
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        studentId: '3',
        date: new Date().toISOString().split('T')[0],
        present: false,
        method: 'manual',
        timestamp: new Date().toISOString()
      }
    ];

    const demoPayments: Payment[] = [
      {
        id: '1',
        studentId: '1',
        amount: 500,
        method: 'bkash',
        transactionId: 'BKS123456',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      },
      {
        id: '2',
        studentId: '2',
        amount: 300,
        method: 'cash',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
    ];

    const demoExpenses: Expense[] = [
      {
        id: '1',
        category: 'চাল-ডাল',
        item: 'বাসমতি চাল',
        quantity: 10,
        unitPrice: 65,
        totalPrice: 650,
        date: new Date().toISOString().split('T')[0],
        description: 'উন্নত মানের চাল'
      },
      {
        id: '2',
        category: 'সবজি',
        item: 'আলু',
        quantity: 5,
        unitPrice: 30,
        totalPrice: 150,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        category: 'মাছ-মাংস',
        item: 'রুই মাছ',
        quantity: 2,
        unitPrice: 350,
        totalPrice: 700,
        date: new Date().toISOString().split('T')[0],
        description: 'তাজা রুই মাছ'
      },
      {
        id: '4',
        category: 'তেল-মসলা',
        item: 'সয়াবিন তেল',
        quantity: 2,
        unitPrice: 180,
        totalPrice: 360,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '5',
        category: 'গ্যাস',
        item: 'গ্যাস সিলিন্ডার',
        quantity: 1,
        unitPrice: 1200,
        totalPrice: 1200,
        date: new Date().toISOString().split('T')[0]
      }
    ];

    const demoCashEntries: CashEntry[] = [
      {
        id: '1',
        source: 'meal_payment',
        amount: 2500,
        description: 'আজকের মিল পেমেন্ট',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        source: 'home',
        amount: 5000,
        description: 'বাড়ি থেকে টাকা',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '3',
        source: 'expense',
        amount: -1200,
        description: 'গ্যাস সিলিন্ডার কিনেছি',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '4',
        source: 'match',
        amount: 800,
        description: 'ডেলিভারি থেকে আয়',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '5',
        source: 'shop',
        amount: 1500,
        description: 'দোকান থেকে আয়',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '6',
        source: 'expense',
        amount: -650,
        description: 'চাল কিনেছি',
        date: new Date().toISOString().split('T')[0]
      }
    ];

    const demoSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'রহিম ট্রেডার্স',
        phone: '01712345678',
        address: 'কাঁচাবাজার, ঢাকা',
        previousDue: 5000,
        todaysBill: 2000,
        todaysDeposit: 3000,
        totalDue: 4000,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'করিম এন্টারপ্রাইজ',
        phone: '01812345679',
        address: 'নিউমার্কেট, ঢাকা',
        previousDue: 8000,
        todaysBill: 1500,
        todaysDeposit: 2000,
        totalDue: 7500,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'আলী ব্রাদার্স',
        phone: '01912345680',
        address: 'চকবাজার, চট্টগ্রাম',
        previousDue: 0,
        todaysBill: 3000,
        todaysDeposit: 3000,
        totalDue: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '4',
        name: 'হাসান সাপ্লায়ার্স',
        phone: '01612345681',
        address: 'কাপাসগোলা, সিলেট',
        previousDue: 12000,
        todaysBill: 2500,
        todaysDeposit: 1000,
        totalDue: 13500,
        lastUpdated: new Date().toISOString()
      }
    ];

    const demoDueCustomers: DueCustomer[] = [
      {
        id: '1',
        name: 'মোঃ আব্দুল করিম',
        phone: '01712345682',
        previousDue: 2000,
        todaysDue: 500,
        deposit: 1000,
        totalDue: 1500,
        dueDate: '2025-01-15',
        reminderSent: false
      },
      {
        id: '2',
        name: 'রহিমা বেগম',
        phone: '01812345683',
        previousDue: 3000,
        todaysDue: 800,
        deposit: 500,
        totalDue: 3300,
        dueDate: '2025-01-10',
        reminderSent: true
      },
      {
        id: '3',
        name: 'সালাম মিয়া',
        phone: '01912345684',
        previousDue: 1500,
        todaysDue: 600,
        deposit: 2100,
        totalDue: 0,
        dueDate: '2025-01-20',
        reminderSent: false
      },
      {
        id: '4',
        name: 'ফাতেমা খাতুন',
        phone: '01612345685',
        previousDue: 4000,
        todaysDue: 1200,
        deposit: 800,
        totalDue: 4400,
        dueDate: '2025-01-05',
        reminderSent: true
      }
    ];

    const demoBiometricDevices: BiometricDevice[] = [
      {
        id: '1',
        name: 'Main Gate Scanner',
        ip: '192.168.1.100',
        port: 4370,
        model: 'ZKTeco F18',
        location: 'প্রধান গেট',
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        maxUsers: 3000,
        currentUsers: 150,
        firmwareVersion: '6.60.1.85',
        serialNumber: 'ZKT001'
      },
      {
        id: '2',
        name: 'Dining Hall Scanner',
        ip: '192.168.1.101',
        port: 4370,
        model: 'ZKTeco K50-A',
        location: 'ডাইনিং হল',
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        maxUsers: 5000,
        currentUsers: 85,
        firmwareVersion: '6.70.2.10',
        serialNumber: 'ZKT004'
      },
      {
        id: '3',
        name: 'Office Scanner',
        ip: '192.168.1.102',
        port: 4370,
        model: 'ZKTeco F22',
        location: 'অফিস রুম',
        status: 'disconnected',
        lastSync: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isActive: false,
        maxUsers: 2000,
        currentUsers: 45,
        firmwareVersion: '6.60.1.88',
        serialNumber: 'ZKT003'
      },
      {
        id: '4',
        name: 'Library Scanner',
        ip: '192.168.1.103',
        port: 4370,
        model: 'ZKTeco K50-A',
        location: 'লাইব্রেরি',
        status: 'connected',
        lastSync: new Date().toISOString(),
        isActive: true,
        maxUsers: 5000,
        currentUsers: 120,
        firmwareVersion: '6.70.2.10',
        serialNumber: 'ZKT005'
      }
    ];

    setStudents(demoStudents);
    setAttendance(demoAttendance);
    setPayments(demoPayments);
    setExpenses(demoExpenses);
    setCashEntries(demoCashEntries);
    setSuppliers(demoSuppliers);
    setDueCustomers(demoDueCustomers);
    setBiometricDevices(demoBiometricDevices);
  }, []);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentUpdate: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...studentUpdate } : s));
  };

  const addAttendance = (attendanceData: Omit<Attendance, 'id'>) => {
    const newAttendance = { ...attendanceData, id: Date.now().toString() };
    setAttendance(prev => [...prev, newAttendance]);
    
    // Deduct meal charge if present
    if (attendanceData.present) {
      const student = students.find(s => s.id === attendanceData.studentId);
      if (student) {
        updateStudent(student.id, { balance: student.balance - student.mealCharge });
      }
    }
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    setPayments(prev => [...prev, newPayment]);
    
    // Add to student balance
    const student = students.find(s => s.id === payment.studentId);
    if (student) {
      updateStudent(student.id, { balance: student.balance + payment.amount });
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expenseUpdate: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...expenseUpdate } : e));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...supplier, id: Date.now().toString() };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, supplierUpdate: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...supplierUpdate } : s));
  };

  const addDueCustomer = (customer: Omit<DueCustomer, 'id'>) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    setDueCustomers(prev => [...prev, newCustomer]);
  };

  const updateDueCustomer = (id: string, customerUpdate: Partial<DueCustomer>) => {
    setDueCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customerUpdate } : c));
  };

  const addCashEntry = (entry: Omit<CashEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setCashEntries(prev => [...prev, newEntry]);
  };

  const addBiometricDevice = (device: Omit<BiometricDevice, 'id' | 'status' | 'lastSync' | 'isActive'>) => {
    const newDevice: BiometricDevice = {
      ...device,
      id: Date.now().toString(),
      status: 'disconnected',
      lastSync: new Date().toISOString(),
      isActive: true,
      currentUsers: 0
    };
    setBiometricDevices(prev => [...prev, newDevice]);
  };

  const updateBiometricDevice = (id: string, deviceUpdate: Partial<BiometricDevice>) => {
    setBiometricDevices(prev => prev.map(d => d.id === id ? { ...d, ...deviceUpdate } : d));
  };

  const deleteBiometricDevice = (id: string) => {
    setBiometricDevices(prev => prev.filter(d => d.id !== id));
  };

  // Render a loading state until data is populated from useEffect
  if (students === null) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <DataContext.Provider value={{
      students: students || [],
      attendance: attendance || [],
      payments: payments || [],
      expenses: expenses || [],
      suppliers: suppliers || [],
      dueCustomers: dueCustomers || [],
      cashEntries: cashEntries || [],
      biometricDevices: biometricDevices || [],
      addStudent,
      updateStudent,
      addAttendance,
      addPayment,
      addExpense,
      updateExpense,
      addSupplier,
      updateSupplier,
      addDueCustomer,
      updateDueCustomer,
      addCashEntry,
      addBiometricDevice,
      updateBiometricDevice,
      deleteBiometricDevice
    }}>
      {children}
    </DataContext.Provider>
  );
};
