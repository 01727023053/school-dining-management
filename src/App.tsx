import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import StudentList from './components/Students/StudentList';
import AttendanceManager from './components/Attendance/AttendanceManager';
import BiometricAttendance from './components/BiometricAttendance/BiometricAttendance';
import QRAttendance from './components/QRAttendance/QRAttendance';
import PaymentManager from './components/Payments/PaymentManager';
import MobilePayment from './components/MobilePayment/MobilePayment';
import ExpenseManager from './components/Expenses/ExpenseManager';
import SupplierManager from './components/Suppliers/SupplierManager';
import DueCustomerManager from './components/DueCustomers/DueCustomerManager';
import CashTrackingManager from './components/CashTracking/CashTrackingManager';
import ReportsManager from './components/Reports/ReportsManager';
import SettingsManager from './components/Settings/SettingsManager';
import StudentPaymentPortal from './components/MobilePayment/StudentPaymentPortal';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/attendance" element={<AttendanceManager />} />
        <Route path="/biometric-attendance" element={<BiometricAttendance />} />
        <Route path="/qr-attendance" element={<QRAttendance />} />
        <Route path="/payments" element={<PaymentManager />} />
        <Route path="/mobile-payment" element={<MobilePayment />} />
        <Route path="/expenses" element={<ExpenseManager />} />
        <Route path="/suppliers" element={<SupplierManager />} />
        <Route path="/due-customers" element={<DueCustomerManager />} />
        <Route path="/cash-tracking" element={<CashTrackingManager />} />
        <Route path="/reports" element={<ReportsManager />} />
        <Route path="/settings" element={<SettingsManager />} />
        <Route path="/student-payment" element={<StudentPaymentPortal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;