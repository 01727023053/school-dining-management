import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Users, CreditCard, ShoppingCart, TrendingUp, TrendingDown, FileText, Filter, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ReportsManager: React.FC = () => {
  const { students, attendance, payments, expenses, cashEntries } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [reportType, setReportType] = useState('overview');

  // Calculate date ranges
  const today = new Date();
  const thisMonthStart = startOfMonth(today);
  const thisMonthEnd = endOfMonth(today);
  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  const getDateRange = () => {
    switch (selectedPeriod) {
      case 'today':
        return { start: format(today, 'yyyy-MM-dd'), end: format(today, 'yyyy-MM-dd') };
      case 'thisWeek':
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return { start: format(weekStart, 'yyyy-MM-dd'), end: format(weekEnd, 'yyyy-MM-dd') };
      case 'thisMonth':
        return { start: format(thisMonthStart, 'yyyy-MM-dd'), end: format(thisMonthEnd, 'yyyy-MM-dd') };
      case 'lastMonth':
        return { start: format(lastMonthStart, 'yyyy-MM-dd'), end: format(lastMonthEnd, 'yyyy-MM-dd') };
      default:
        return { start: format(thisMonthStart, 'yyyy-MM-dd'), end: format(thisMonthEnd, 'yyyy-MM-dd') };
    }
  };

  const { start, end } = getDateRange();

  // Filter data by date range
  const filteredPayments = payments.filter(p => p.date >= start && p.date <= end);
  const filteredExpenses = expenses.filter(e => e.date >= start && e.date <= end);
  const filteredAttendance = attendance.filter(a => a.date >= start && a.date <= end);
  const filteredCashEntries = cashEntries.filter(c => c.date >= start && c.date <= end);

  // Calculate statistics
  const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.totalPrice, 0);
  const totalCashIncome = filteredCashEntries.filter(c => c.amount > 0).reduce((sum, c) => sum + c.amount, 0);
  const totalCashExpense = Math.abs(filteredCashEntries.filter(c => c.amount < 0).reduce((sum, c) => sum + c.amount, 0));
  const netIncome = totalPayments + totalCashIncome - totalExpenses - totalCashExpense;

  // Attendance statistics
  const totalAttendanceRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter(a => a.present).length;
  const attendanceRate = totalAttendanceRecords > 0 ? (presentCount / totalAttendanceRecords) * 100 : 0;

  // Chart data
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.totalPrice;
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const paymentMethodData = payments.reduce((acc, payment) => {
    const method = payment.method === 'bkash' ? 'বিকাশ' : 
                  payment.method === 'nagad' ? 'নগদ' : 
                  payment.method === 'cash' ? 'ক্যাশ' : payment.method;
    acc[method] = (acc[method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentMethodData).map(([method, amount]) => ({
    name: method,
    value: amount
  }));

  // Daily income/expense trend
  const dailyData = [];
  for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayPayments = payments.filter(p => p.date === dateStr).reduce((sum, p) => sum + p.amount, 0);
    const dayExpenses = expenses.filter(e => e.date === dateStr).reduce((sum, e) => sum + e.totalPrice, 0);
    const dayCashIncome = cashEntries.filter(c => c.date === dateStr && c.amount > 0).reduce((sum, c) => sum + c.amount, 0);
    const dayCashExpense = Math.abs(cashEntries.filter(c => c.date === dateStr && c.amount < 0).reduce((sum, c) => sum + c.amount, 0));
    
    dailyData.push({
      date: format(d, 'dd/MM'),
      income: dayPayments + dayCashIncome,
      expense: dayExpenses + dayCashExpense,
      net: (dayPayments + dayCashIncome) - (dayExpenses + dayCashExpense)
    });
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const lowBalanceStudents = students.filter(s => s.balance <= 300);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">রিপোর্ট ও বিশ্লেষণ</h1>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">আজ</option>
            <option value="thisWeek">এই সপ্তাহ</option>
            <option value="thisMonth">এই মাস</option>
            <option value="lastMonth">গত মাস</option>
          </select>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="font-bengali">PDF ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Period Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800 font-bengali">
            রিপোর্টের সময়কাল: {format(new Date(start), 'dd MMMM yyyy')} - {format(new Date(end), 'dd MMMM yyyy')}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">৳{totalPayments + totalCashIncome}</p>
              <p className="text-xs text-gray-500 font-bengali">পেমেন্ট + ক্যাশ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট খরচ</p>
              <p className="text-2xl font-bold text-red-600">৳{totalExpenses + totalCashExpense}</p>
              <p className="text-xs text-gray-500 font-bengali">ক্রয় + অন্যান্য</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              netIncome >= 0 ? 'bg-blue-100' : 'bg-orange-100'
            }`}>
              <BarChart3 className={`w-6 h-6 ${netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">নিট আয়</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                ৳{netIncome}
              </p>
              <p className="text-xs text-gray-500 font-bengali">আয় - খরচ</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">উপস্থিতির হার</p>
              <p className="text-2xl font-bold text-purple-600">{attendanceRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 font-bengali">{presentCount}/{totalAttendanceRecords} উপস্থিত</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">দৈনিক আয়-ব্যয়ের ট্রেন্ড</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `৳${value}`, 
                  name === 'income' ? 'আয়' : name === 'expense' ? 'খরচ' : 'নিট'
                ]}
              />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="income" />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="expense" />
              <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} name="net" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">ক্যাটেগরি অনুযায়ী খরচ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`৳${value}`, 'খরচ']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">পেমেন্ট মেথড অনুযায়ী আয়</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`৳${value}`, 'পেমেন্ট']} />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students by Payment */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">সর্বোচ্চ পেমেন্টকারী শিক্ষার্থী</h3>
          <div className="space-y-3">
            {students
              .map(student => ({
                ...student,
                totalPayments: filteredPayments
                  .filter(p => p.studentId === student.id)
                  .reduce((sum, p) => sum + p.amount, 0)
              }))
              .filter(s => s.totalPayments > 0)
              .sort((a, b) => b.totalPayments - a.totalPayments)
              .slice(0, 5)
              .map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 font-bengali">{student.name}</p>
                      <p className="text-sm text-gray-500">রোল: {student.roll}</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">৳{student.totalPayments}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Low Balance Alert */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">কম ব্যালেন্স সতর্কতা</h3>
          <div className="space-y-3">
            {lowBalanceStudents.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">!</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 font-bengali">{student.name}</p>
                    <p className="text-sm text-gray-500">রোল: {student.roll}</p>
                  </div>
                </div>
                <span className="font-bold text-red-600">৳{student.balance}</span>
              </div>
            ))}
            {lowBalanceStudents.length === 0 && (
              <div className="text-center py-4">
                <p className="text-green-600 font-bengali">সব শিক্ষার্থীর ব্যালেন্স পর্যাপ্ত!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800 font-bengali">পেমেন্ট সামারি</h4>
              <p className="text-sm text-blue-600 font-bengali">
                {filteredPayments.length} টি লেনদেন
              </p>
              <p className="text-lg font-bold text-blue-700">৳{totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800 font-bengali">খরচ সামারি</h4>
              <p className="text-sm text-red-600 font-bengali">
                {filteredExpenses.length} টি আইটেম
              </p>
              <p className="text-lg font-bold text-red-700">৳{totalExpenses}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800 font-bengali">উপস্থিতি সামারি</h4>
              <p className="text-sm text-green-600 font-bengali">
                {presentCount} জন উপস্থিত
              </p>
              <p className="text-lg font-bold text-green-700">{attendanceRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">রিপোর্ট এক্সপোর্ট</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-bengali">PDF রিপোর্ট</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-5 h-5" />
            <span className="font-bengali">Excel ডাউনলোড</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="w-5 h-5" />
            <span className="font-bengali">বিস্তারিত ভিউ</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="font-bengali">চার্ট এক্সপোর্ট</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsManager;