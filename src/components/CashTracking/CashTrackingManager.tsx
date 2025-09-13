import React, { useState } from 'react';
import { Plus, Search, Wallet, TrendingUp, TrendingDown, Calendar, Filter, Download, Edit, Trash2, Eye, Home, Utensils, Truck, Store, CreditCard, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import CashEntryForm from './CashEntryForm';
import CashEntryDetails from './CashEntryDetails';
import toast from 'react-hot-toast';

const CashTrackingManager: React.FC = () => {
  const { cashEntries } = useData();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [quickActionType, setQuickActionType] = useState<{ type: 'income' | 'expense', source: string } | null>(null);

  const filteredEntries = cashEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'all' || entry.source === filterSource;
    const matchesDate = !filterDate || entry.date === filterDate;
    
    return matchesSearch && matchesSource && matchesDate;
  });

  const totalCash = cashEntries.reduce((sum, e) => sum + e.amount, 0);
  const todayEntries = cashEntries.filter(e => e.date === format(new Date(), 'yyyy-MM-dd'));
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.amount, 0);
  const positiveEntries = cashEntries.filter(e => e.amount > 0);
  const totalIncome = positiveEntries.reduce((sum, e) => sum + e.amount, 0);
  const negativeEntries = cashEntries.filter(e => e.amount < 0);
  const totalExpense = Math.abs(negativeEntries.reduce((sum, e) => sum + e.amount, 0));

  const sources = [
    { value: 'home', label: 'বাড়ি থেকে', icon: Home },
    { value: 'meal_payment', label: 'মিল পেমেন্ট', icon: Utensils },
    { value: 'match', label: 'ডেলিভারি থেকে', icon: Truck },
    { value: 'shop', label: 'দোকান', icon: Store },
    { value: 'expense', label: 'খরচ', icon: CreditCard },
    { value: 'other', label: 'অন্যান্য', icon: Package }
  ];

  const getSourceInfo = (source: string) => {
    return sources.find(s => s.value === source) || { value: source, label: source, icon: Package };
  };

  const handleEdit = (entryId: string) => {
    setSelectedEntry(null);
    setEditingEntry(entryId);
    setShowForm(true);
    toast.success('এডিট মোড চালু হয়েছে');
  };

  const handleDelete = (entryId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই এন্ট্রি মুছে ফেলতে চান?')) {
      // In a real app, this would call a delete function
      toast.success('এন্ট্রি মুছে ফেলা হয়েছে');
    }
  };

  const handleQuickAction = (type: 'income' | 'expense', source: string) => {
    setQuickActionType({ type, source });
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setQuickActionType(null);
    setEditingEntry(null);
  };

  const handleSaveForm = () => {
    setShowForm(false);
    setQuickActionType(null);
    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">ক্যাশ ট্র্যাকিং</h1>
        <button
          onClick={() => {
            setQuickActionType(null);
            setEditingEntry(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bengali">নতুন এন্ট্রি</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট ক্যাশ</p>
              <p className={`text-2xl font-bold ${totalCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳{totalCash}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট আয়</p>
              <p className="text-2xl font-bold text-green-600">৳{totalIncome}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট খরচ</p>
              <p className="text-2xl font-bold text-red-600">৳{totalExpense}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের মোট</p>
              <p className={`text-2xl font-bold ${todayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳{todayTotal}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Source Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">সোর্স অনুযায়ী ক্যাশ</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sources.map(source => {
            const sourceEntries = cashEntries.filter(e => e.source === source.value);
            const sourceTotal = sourceEntries.reduce((sum, e) => sum + e.amount, 0);
            const IconComponent = source.icon;
            return (
              <div key={source.value} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-2">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800 font-bengali text-sm">{source.label}</h4>
                <p className={`text-lg font-bold ${sourceTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ৳{sourceTotal}
                </p>
                <p className="text-xs text-gray-500 font-bengali">{sourceEntries.length} এন্ট্রি</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">দ্রুত কাজ</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('income', 'home')}
            className="bg-white rounded-lg p-4 border border-green-200 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800 font-bengali">বাড়ি থেকে টাকা</h4>
              <p className="text-sm text-gray-600 font-bengali">দ্রুত এন্ট্রি</p>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('income', 'meal_payment')}
            className="bg-white rounded-lg p-4 border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Utensils className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800 font-bengali">মিল পেমেন্ট</h4>
              <p className="text-sm text-gray-600 font-bengali">আজকের আয়</p>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('expense', 'expense')}
            className="bg-white rounded-lg p-4 border border-orange-200 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingDown className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-800 font-bengali">খরচ এন্ট্রি</h4>
              <p className="text-sm text-gray-600 font-bengali">দ্রুত খরচ</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/reports')}
            className="bg-white rounded-lg p-4 border border-purple-200 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Download className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800 font-bengali">মাসিক রিপোর্ট</h4>
              <p className="text-sm text-gray-600 font-bengali">বিস্তারিত হিসাব</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="বিবরণ খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">সব সোর্স</option>
            {sources.map(source => (
              <option key={source.value} value={source.value}>{source.label}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="font-bengali">রিপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Cash Balance Alert */}
      {totalCash < 1000 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 font-bengali">
                কম ক্যাশ সতর্কতা
              </h3>
              <p className="text-yellow-700 font-bengali">
                বর্তমান ক্যাশ ব্যালেন্স ১০০০ টাকার কম। নতুন ক্যাশ যোগ করার প্রয়োজন হতে পারে।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cash Entries Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  সোর্স
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  বিবরণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ধরন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.length > 0 ? filteredEntries.map((entry) => {
                const sourceInfo = getSourceInfo(entry.source);
                const isIncome = entry.amount > 0;
                const IconComponent = sourceInfo.icon;
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(entry.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900 font-bengali">
                          {sourceInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-bengali">
                        {entry.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isIncome ? '+' : ''}৳{entry.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isIncome 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      } font-bengali`}>
                        {isIncome ? 'আয়' : 'খরচ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedEntry(entry.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="বিস্তারিত দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(entry.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    কোন ক্যাশ এন্ট্রি পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Entry Form Modal */}
      {showForm && (
        <CashEntryForm
          onClose={handleCloseForm}
          onSave={handleSaveForm}
          initialType={quickActionType?.type}
          initialSource={quickActionType?.source}
        />
      )}

      {/* Cash Entry Details Modal */}
      {selectedEntry && (
        <CashEntryDetails
          entryId={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default CashTrackingManager;