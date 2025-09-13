import React, { useState } from 'react';
import { Plus, Search, CreditCard, Smartphone, Banknote, Eye, Filter, Download, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import PaymentForm from './PaymentForm';
import PaymentDetails from './PaymentDetails';
import toast from 'react-hot-toast';

const PaymentManager: React.FC = () => {
  const { students, payments, addPayment } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPayments = payments.filter(payment => {
    const student = students.find(s => s.id === payment.studentId);
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student?.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const todayPayments = payments.filter(p => p.date === format(new Date(), 'yyyy-MM-dd'));
  const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  // Mobile payment statistics
  const mobilePayments = payments.filter(p => ['bkash', 'nagad', 'rocket', 'upay'].includes(p.method));
  const mobilePaymentTotal = mobilePayments.reduce((sum, p) => sum + p.amount, 0);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bkash':
        return <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">bK</div>;
      case 'nagad':
        return <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">N</div>;
      case 'rocket':
        return <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div>;
      case 'upay':
        return <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">U</div>;
      case 'cash':
        return <Banknote className="w-6 h-6 text-green-600" />;
      case 'bank':
        return <CreditCard className="w-6 h-6 text-indigo-600" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'সম্পন্ন';
      case 'pending':
        return 'অপেক্ষমান';
      case 'failed':
        return 'ব্যর্থ';
      default:
        return status;
    }
  };

  const handleViewDetails = (paymentId: string) => {
    setSelectedPayment(paymentId);
    const payment = payments.find(p => p.id === paymentId);
    const student = students.find(s => s.id === payment?.studentId);
    toast.success(`${student?.name} এর পেমেন্ট বিস্তারিত দেখানো হচ্ছে`);
  };

  const handleAddNewPayment = () => {
    setShowForm(true);
    toast.success('নতুন পেমেন্ট ফর্ম খোলা হচ্ছে');
  };

  const downloadReport = () => {
    const reportData = {
      totalPayments: totalPayments,
      todayTotal: todayTotal,
      paymentCount: payments.length,
      pendingCount: pendingPayments,
      mobilePaymentTotal: mobilePaymentTotal,
      methods: {
        bkash: payments.filter(p => p.method === 'bkash').reduce((sum, p) => sum + p.amount, 0),
        nagad: payments.filter(p => p.method === 'nagad').reduce((sum, p) => sum + p.amount, 0),
        rocket: payments.filter(p => p.method === 'rocket').reduce((sum, p) => sum + p.amount, 0),
        upay: payments.filter(p => p.method === 'upay').reduce((sum, p) => sum + p.amount, 0),
        cash: payments.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
        bank: payments.filter(p => p.method === 'bank').reduce((sum, p) => sum + p.amount, 0)
      },
      filteredData: {
        count: filteredPayments.length,
        total: filteredPayments.reduce((sum, p) => sum + p.amount, 0)
      }
    };
    
    // Create a detailed report message
    const reportMessage = `📊 পেমেন্ট রিপোর্ট ডাউনলোড সম্পন্ন!
    
📈 সামগ্রিক তথ্য:
• মোট পেমেন্ট: ৳${totalPayments.toLocaleString()}
• আজকের পেমেন্ট: ৳${todayTotal.toLocaleString()}
• মোট লেনদেন: ${payments.length}টি
• অপেক্ষমান: ${pendingPayments}টি

💳 পেমেন্ট মেথড অনুযায়ী:
• বিকাশ: ৳${reportData.methods.bkash.toLocaleString()}
• নগদ: ৳${reportData.methods.nagad.toLocaleString()}
• রকেট: ৳${reportData.methods.rocket.toLocaleString()}
• উপায়: ৳${reportData.methods.upay.toLocaleString()}
• ক্যাশ: ৳${reportData.methods.cash.toLocaleString()}
• ব্যাংক: ৳${reportData.methods.bank.toLocaleString()}

📱 মোবাইল পেমেন্ট: ৳${mobilePaymentTotal.toLocaleString()}

🔍 ফিল্টার করা ডাটা:
• ${reportData.filteredData.count}টি লেনদেন
• মোট: ৳${reportData.filteredData.total.toLocaleString()}`;

    toast.success(reportMessage, {
      duration: 5000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
        maxWidth: '400px'
      }
    });
    
    console.log('Payment Report Downloaded:', reportData);
    
    // In a real application, this would generate and download a PDF/Excel file
    // For demo purposes, we're showing the data in console and toast
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">পেমেন্ট ব্যবস্থাপনা</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleAddNewPayment}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bengali">নতুন পেমেন্ট</span>
          </button>
          <button
            onClick={() => window.open('/mobile-payment', '_blank')}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 duration-200 shadow-md hover:shadow-lg"
          >
            <Smartphone className="w-4 h-4" />
            <span className="font-bengali">মোবাইল পেমেন্ট</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট পেমেন্ট</p>
              <p className="text-2xl font-bold text-gray-900">৳{totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">আজ</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের পেমেন্ট</p>
              <p className="text-2xl font-bold text-gray-900">৳{todayTotal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Smartphone className="w-8 h-8 text-pink-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোবাইল পেমেন্ট</p>
              <p className="text-2xl font-bold text-pink-600">৳{mobilePaymentTotal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-sm">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">অপেক্ষমান</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">#</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট লেনদেন</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">পেমেন্ট মেথড</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-pink-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                bK
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-bengali">বিকাশ মার্চেন্ট</h4>
                <p className="text-sm text-gray-600">০১৩০ ৯৪ ১৯৪০</p>
                <p className="text-xs text-pink-600 font-bengali">মার্চেন্ট অ্যাকাউন্ট</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                N
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-bengali">নগদ পার্সোনাল</h4>
                <p className="text-sm text-gray-600">০১৩০৩ ৯৪১ ৯৪০</p>
                <p className="text-xs text-orange-600 font-bengali">পার্সোনাল অ্যাকাউন্ট</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                R
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-bengali">রকেট এজেন্ট</h4>
                <p className="text-sm text-gray-600">০১৭১২৩৪৫৬৭৮</p>
                <p className="text-xs text-purple-600 font-bengali">এজেন্ট অ্যাকাউন্ট</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                U
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-bengali">উপায় পার্সোনাল</h4>
                <p className="text-sm text-gray-600">০১৮১২৩৪৫৬৭৮</p>
                <p className="text-xs text-blue-600 font-bengali">পার্সোনাল অ্যাকাউন্ট</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-bengali">ক্যাশ পেমেন্ট</h4>
                <p className="text-sm text-gray-600">নগদ টাকা</p>
                <p className="text-xs text-green-600 font-bengali">সরাসরি পেমেন্ট</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 font-bengali">ব্যাংক ট্রান্সফার</h4>
                <p className="text-sm text-gray-600">A/C: ১২৩৪৫৬৭৮৯০</p>
                <p className="text-xs text-indigo-600 font-bengali">ব্যাংক অ্যাকাউন্ট</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="নাম, রোল বা ট্রানজেকশন ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">সব মেথড</option>
            <option value="bkash">বিকাশ</option>
            <option value="nagad">নগদ</option>
            <option value="rocket">রকেট</option>
            <option value="upay">উপায়</option>
            <option value="cash">ক্যাশ</option>
            <option value="bank">ব্যাংক</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">সব স্ট্যাটাস</option>
            <option value="completed">সম্পন্ন</option>
            <option value="pending">অপেক্ষমান</option>
            <option value="failed">ব্যর্থ</option>
          </select>

          <button 
            onClick={downloadReport}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors transform hover:scale-105 duration-200 shadow-md hover:shadow-lg"
            title="পেমেন্ট রিপোর্ট ডাউনলোড করুন"
          >
            <Download className="w-4 h-4" />
            <span className="font-bengali font-medium">রিপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  শিক্ষার্থী
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  মেথড
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ট্রানজেকশন ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  স্ট্যাটাস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? filteredPayments.map((payment) => {
                const student = students.find(s => s.id === payment.studentId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(payment.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student?.name.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 font-bengali">
                            {student?.name || 'অজানা শিক্ষার্থী'}
                          </div>
                          <div className="text-sm text-gray-500">
                            রোল: {student?.roll || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-green-600">৳{payment.amount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="text-sm font-medium text-gray-900 capitalize font-bengali">
                          {payment.method === 'bkash' ? 'বিকাশ' : 
                           payment.method === 'nagad' ? 'নগদ' : 
                           payment.method === 'rocket' ? 'রকেট' :
                           payment.method === 'upay' ? 'উপায়' :
                           payment.method === 'cash' ? 'ক্যাশ' : 
                           payment.method === 'bank' ? 'ব্যাংক' : payment.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.transactionId || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)} font-bengali`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(payment.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    কোন পেমেন্ট রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <PaymentForm
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetails
          paymentId={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default PaymentManager;