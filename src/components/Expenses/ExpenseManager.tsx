import React, { useState } from 'react';
import { Plus, Search, ShoppingCart, Calendar, Download, Edit, Trash2, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import ExpenseForm from './ExpenseForm';
import { EXPENSE_CATEGORIES } from '../../../constants';
import ExpenseDetails from './ExpenseDetails';
import toast from 'react-hot-toast';

const ExpenseManager: React.FC = () => {
  const { expenses } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesDate = !filterDate || expense.date === filterDate;
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalPrice, 0);
  const todayExpenses = expenses.filter(e => e.date === format(new Date(), 'yyyy-MM-dd'));
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.totalPrice, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'চাল-ডাল':
        return '🍚';
      case 'সবজি':
        return '🥬';
      case 'মাছ-মাংস':
        return '🐟';
      case 'তেল-মসলা':
        return '🧄';
      case 'গ্যাস':
        return '🔥';
      case 'বিদ্যুৎ':
        return '⚡';
      case 'পানি':
        return '💧';
      default:
        return '📦';
    }
  };

  const handleEdit = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    setEditingExpense(expenseId);
    setShowForm(true);
    toast.success(`"${expense?.item}" সম্পাদনা মোড চালু হয়েছে`);
  };

  const handleDelete = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (confirm(`আপনি কি নিশ্চিত যে "${expense?.item}" এর খরচ মুছে ফেলতে চান?`)) {
      // In a real app, this would call a delete function
      toast.success(`"${expense?.item}" এর খরচ মুছে ফেলা হয়েছে`);
    }
  };

  const handleViewDetails = (expenseId: string) => {
    setSelectedExpense(expenseId);
  };

  const downloadReport = () => {
    const reportData = {
      totalExpenses: totalExpenses,
      todayTotal: todayTotal,
      expenseCount: expenses.length,
      categories: EXPENSE_CATEGORIES.map(cat => ({
        category: cat,
        total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.totalPrice, 0),
        count: expenses.filter(e => e.category === cat).length
      }))
    };
    
    toast.success(`📊 খরচের রিপোর্ট ডাউনলোড হচ্ছে। মোট খরচ: ৳${totalExpenses}`);
    console.log('Expense Report:', reportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">খরচ ব্যবস্থাপনা</h1>
        <button
          onClick={() => {
            setEditingExpense(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bengali">নতুন খরচ</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট খরচ</p>
              <p className="text-2xl font-bold text-gray-900">৳{totalExpenses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের খরচ</p>
              <p className="text-2xl font-bold text-gray-900">৳{todayTotal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">#</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট আইটেম</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">গড় খরচ</p>
              <p className="text-2xl font-bold text-gray-900">
                ৳{expenses.length > 0 ? Math.round(totalExpenses / expenses.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">ক্যাটেগরি অনুযায়ী খরচ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EXPENSE_CATEGORIES.map(category => {
            const categoryExpenses = expenses.filter(e => e.category === category);
            const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.totalPrice, 0);
            return (
              <div key={category} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
                <h4 className="font-medium text-gray-800 font-bengali">{category}</h4>
                <p className="text-lg font-bold text-blue-600">৳{categoryTotal}</p>
                <p className="text-xs text-gray-500 font-bengali">{categoryExpenses.length} আইটেম</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="আইটেম বা ক্যাটেগরি খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">সব ক্যাটেগরি</option>
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button 
            onClick={downloadReport}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="font-bengali">রিপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ক্যাটেগরি
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  আইটেম
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  একক দাম
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  মোট দাম
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(expense.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                      <span className="text-sm font-medium text-gray-900 font-bengali">
                        {expense.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-bengali">{expense.item}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-500 font-bengali">{expense.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{expense.unitPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-red-600">৳{expense.totalPrice}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(expense.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(expense.id)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                        title="সম্পাদনা করুন"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    কোন খরচের রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          editExpenseId={editingExpense || undefined}
        />
      )}

      {/* Expense Details Modal */}
      {selectedExpense && (
        <ExpenseDetails
          expenseId={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
};

export default ExpenseManager;
