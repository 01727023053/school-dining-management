import React, { useState } from 'react';
import { Plus, Search, Users, Phone, MapPin, DollarSign, Edit, Eye, Trash2, Calculator } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import SupplierForm from './SupplierForm';
import SupplierDetails from './SupplierDetails';
import toast from 'react-hot-toast';

const SupplierManager: React.FC = () => {
  const { suppliers } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDue = suppliers.reduce((sum, s) => sum + s.totalDue, 0);
  const totalBill = suppliers.reduce((sum, s) => sum + s.todaysBill, 0);
  const totalDeposit = suppliers.reduce((sum, s) => sum + s.todaysDeposit, 0);

  const handleEdit = (supplierId: string) => {
    setEditingSupplier(supplierId);
    setShowForm(true);
    toast.success('সম্পাদনা মোড চালু হয়েছে');
  };

  const handleDelete = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (confirm(`আপনি কি নিশ্চিত যে "${supplier?.name}" কে মুছে ফেলতে চান?`)) {
      // In a real app, this would call a delete function
      toast.success('সরবরাহকারী মুছে ফেলা হয়েছে');
    }
  };

  const showTodaysAccount = () => {
    const todaysTransactions = suppliers.filter(s => s.todaysBill > 0 || s.todaysDeposit > 0);
    toast.success(`আজকের ${todaysTransactions.length} টি লেনদেন পাওয়া গেছে। মোট বিল: ৳${totalBill}, মোট জমা: ৳${totalDeposit}`);
  };

  const showDueList = () => {
    const dueSuppliers = suppliers.filter(s => s.totalDue > 0);
    if (dueSuppliers.length === 0) {
      toast.success('কোন সরবরাহকারীর বকেয়া নেই! 🎉');
    } else {
      toast(`⚠️ ${dueSuppliers.length} জন সরবরাহকারীর মোট ৳${dueSuppliers.reduce((sum, s) => sum + s.totalDue, 0)} টাকা বকেয়া আছে`);
    }
  };

  const generateMonthlyReport = () => {
    const reportData = {
      totalSuppliers: suppliers.length,
      totalDue: totalDue,
      totalBill: totalBill,
      totalDeposit: totalDeposit,
      netBalance: totalBill - totalDeposit
    };
    
    toast.success(`📊 মাসিক রিপোর্ট তৈরি হয়েছে: ${suppliers.length} সরবরাহকারী, ৳${totalDue} বকেয়া`);
    console.log('Monthly Report:', reportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">সরবরাহকারী ব্যবস্থাপনা</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bengali">নতুন সরবরাহকারী</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট সরবরাহকারী</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট বকেয়া</p>
              <p className="text-2xl font-bold text-red-600">৳{totalDue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Calculator className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের বিল</p>
              <p className="text-2xl font-bold text-orange-600">৳{totalBill}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের জমা</p>
              <p className="text-2xl font-bold text-green-600">৳{totalDeposit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">দ্রুত কাজ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={showTodaysAccount}
            className="bg-white rounded-lg p-4 border border-blue-200 hover:bg-blue-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-medium text-gray-800 font-bengali">আজকের হিসাব</h4>
              <p className="text-sm text-gray-600 font-bengali">সব সরবরাহকারীর আজকের হিসাব দেখুন</p>
            </div>
          </button>

          <button 
            onClick={showDueList}
            className="bg-white rounded-lg p-4 border border-orange-200 hover:bg-orange-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h4 className="font-medium text-gray-800 font-bengali">বকেয়া তালিকা</h4>
              <p className="text-sm text-gray-600 font-bengali">যাদের টাকা বকেয়া আছে</p>
            </div>
          </button>

          <button 
            onClick={generateMonthlyReport}
            className="bg-white rounded-lg p-4 border border-green-200 hover:bg-green-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-800 font-bengali">মাসিক রিপোর্ট</h4>
              <p className="text-sm text-gray-600 font-bengali">মাসিক লেনদেনের রিপোর্ট</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  সরবরাহকারী
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ফোন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ঠিকানা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  পূর্বের বকেয়া
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  আজকের বিল
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  আজকের জমা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  মোট বকেয়া
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {supplier.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 font-bengali">{supplier.name}</div>
                        <div className="text-sm text-gray-500">
                          শেষ আপডেট: {format(new Date(supplier.lastUpdated), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{supplier.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 font-bengali">{supplier.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      supplier.previousDue > 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ৳{supplier.previousDue}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-orange-600">
                      ৳{supplier.todaysBill}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      ৳{supplier.todaysDeposit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      supplier.totalDue > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ৳{supplier.totalDue}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedSupplier(supplier.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(supplier.id)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="সম্পাদনা করুন"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    কোন সরবরাহকারী পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* High Due Alert */}
      {suppliers.filter(s => s.totalDue > 10000).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 font-bengali">
                উচ্চ বকেয়া সতর্কতা
              </h3>
              <p className="text-red-700 font-bengali">
                {suppliers.filter(s => s.totalDue > 10000).length} জন সরবরাহকারীর বকেয়া ১০,০০০ টাকার বেশি।
              </p>
              <div className="mt-3 space-y-1">
                {suppliers.filter(s => s.totalDue > 10000).slice(0, 3).map(supplier => (
                  <div key={supplier.id} className="flex justify-between text-sm">
                    <span className="font-bengali">{supplier.name}</span>
                    <span className="font-semibold text-red-600">৳{supplier.totalDue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Form Modal */}
      {showForm && (
        <SupplierForm
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />
      )}

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <SupplierDetails
          supplierId={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
};

export default SupplierManager;