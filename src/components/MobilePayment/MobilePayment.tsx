import React, { useState, useEffect } from 'react';
import { Smartphone, CreditCard, QrCode, Phone, MessageSquare, CheckCircle, AlertCircle, Clock, RefreshCw, Bell, Download, Eye, Copy, Share2, Zap, Shield, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MobilePayment: React.FC = () => {
  const { students, addPayment, payments } = useData();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter mobile payments from today
  const todayMobilePayments = payments.filter(p => 
    p.date === format(new Date(), 'yyyy-MM-dd') && 
    ['bkash', 'nagad', 'rocket', 'upay'].includes(p.method)
  );

  const paymentMethods = [
    {
      id: 'bkash',
      name: 'বিকাশ',
      icon: '📱',
      color: 'bg-pink-500',
      borderColor: 'border-pink-200',
      bgColor: 'bg-pink-50',
      number: '০১৩০ ৯৪ ১৯৪০',
      type: 'মার্চেন্ট',
      charge: '১.৮৫%',
      features: ['২৪/৭ সেবা', 'তাৎক্ষণিক পেমেন্ট', 'নিরাপদ ও সুরক্ষিত']
    },
    {
      id: 'nagad',
      name: 'নগদ',
      icon: '💳',
      color: 'bg-orange-500',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
      number: '০১৩০৩ ৯৪১ ৯৪০',
      type: 'পার্সোনাল',
      charge: '১.৪৯%',
      features: ['কম চার্জ', 'দ্রুত লেনদেন', 'সহজ ব্যবহার']
    },
    {
      id: 'rocket',
      name: 'রকেট',
      icon: '🚀',
      color: 'bg-purple-500',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      number: '০১৭১২৩৪৫৬৭৮',
      type: 'এজেন্ট',
      charge: '১.৮০%',
      features: ['ব্যাংক গ্রেড নিরাপত্তা', 'এজেন্ট নেটওয়ার্ক', 'বিশ্বস্ত সেবা']
    },
    {
      id: 'upay',
      name: 'উপায়',
      icon: '💎',
      color: 'bg-blue-500',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      number: '০১৮১২৩৪৫৬৭৮',
      type: 'পার্সোনাল',
      charge: '১.৯৯%',
      features: ['UCB ব্যাংক', 'নিরাপদ লেনদেন', 'সহজ পেমেন্ট']
    }
  ];

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  // Calculate statistics
  const totalMobilePayments = todayMobilePayments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = todayMobilePayments.filter(p => p.status === 'completed').length;
  const pendingPayments = todayMobilePayments.filter(p => p.status === 'pending').length;

  useEffect(() => {
    // Simulate real-time payment updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const randomAmount = [100, 200, 300, 500, 1000][Math.floor(Math.random() * 5)];
        const randomMethod = ['bkash', 'nagad', 'rocket', 'upay'][Math.floor(Math.random() * 4)];
        
        setPaymentHistory(prev => [{
          id: Date.now(),
          student: randomStudent.name,
          amount: randomAmount,
          method: randomMethod,
          time: format(new Date(), 'HH:mm:ss'),
          status: 'completed'
        }, ...prev.slice(0, 4)]);
        
        if (showNotifications) {
          toast.success(`নতুন পেমেন্ট: ${randomStudent.name} - ৳${randomAmount}`);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [students, showNotifications]);

  const handlePayment = async () => {
    if (!selectedStudent || !amount || !transactionId) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }

    if (amount < 10) {
      toast.error('সর্বনিম্ন পেমেন্ট ১০ টাকা');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing with realistic steps
      toast.loading('পেমেন্ট যাচাই করা হচ্ছে...', { duration: 1000 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.loading('ট্রানজেকশন প্রসেসিং...', { duration: 1000 });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate occasional failures
      if (Math.random() > 0.9) {
        throw new Error('Network timeout');
      }

      addPayment({
        studentId: selectedStudent,
        amount: amount,
        method: paymentMethod,
        transactionId: transactionId,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });

      const student = students.find(s => s.id === selectedStudent);
      const charge = Math.round(amount * parseFloat(selectedMethod?.charge?.replace('%', '') || '0') / 100);
      
      toast.success(
        `✅ পেমেন্ট সফল!\n${student?.name}\n৳${amount} (চার্জ: ৳${charge})\n${selectedMethod?.name}`,
        { duration: 5000 }
      );
      
      // Add to real-time history
      setPaymentHistory(prev => [{
        id: Date.now(),
        student: student?.name || 'Unknown',
        amount: amount,
        method: paymentMethod,
        time: format(new Date(), 'HH:mm:ss'),
        status: 'completed'
      }, ...prev.slice(0, 4)]);
      
      // Reset form
      setSelectedStudent('');
      setAmount(0);
      setTransactionId('');
      setShowQR(false);
    } catch (error) {
      toast.error('পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateQR = () => {
    if (!selectedStudent || !amount) {
      toast.error('শিক্ষার্থী এবং পরিমাণ নির্বাচন করুন');
      return;
    }
    setShowQR(true);
    toast.success('QR কোড তৈরি হয়েছে');
  };

  const sendSMS = () => {
    if (!selectedStudent || !amount) {
      toast.error('শিক্ষার্থী এবং পরিমাণ নির্বাচন করুন');
      return;
    }
    
    const student = students.find(s => s.id === selectedStudent);
    toast.success(`📱 SMS পাঠানো হয়েছে\n${student?.parentName}\n${student?.parentPhone}\n"আপনার সন্তানের জন্য ৳${amount} টাকা পেমেন্ট করুন"`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('কপি হয়েছে!');
  };

  const sharePaymentLink = () => {
    const student = students.find(s => s.id === selectedStudent);
    const shareText = `${student?.name} এর জন্য ৳${amount} টাকা পেমেন্ট করুন\n${selectedMethod?.name}: ${selectedMethod?.number}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'পেমেন্ট লিংক',
        text: shareText
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-bengali">মোবাইল পেমেন্ট</h1>
          <p className="text-sm text-gray-600 font-bengali mt-1">
            দ্রুত ও নিরাপদ মোবাইল ব্যাংকিং পেমেন্ট
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showNotifications 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="font-bengali">
              {showNotifications ? 'নোটিফিকেশন চালু' : 'নোটিফিকেশন বন্ধ'}
            </span>
          </button>
          <button
            onClick={generateQR}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span className="font-bengali">QR তৈরি করুন</span>
          </button>
          <button
            onClick={sendSMS}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-bengali">SMS পাঠান</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Smartphone className="w-8 h-8" />
            <div className="ml-4">
              <p className="text-blue-100 font-bengali">আজকের মোট</p>
              <p className="text-2xl font-bold">৳{totalMobilePayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8" />
            <div className="ml-4">
              <p className="text-green-100 font-bengali">সফল পেমেন্ট</p>
              <p className="text-2xl font-bold">{successfulPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Clock className="w-8 h-8" />
            <div className="ml-4">
              <p className="text-yellow-100 font-bengali">অপেক্ষমান</p>
              <p className="text-2xl font-bold">{pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Star className="w-8 h-8" />
            <div className="ml-4">
              <p className="text-purple-100 font-bengali">সফলতার হার</p>
              <p className="text-2xl font-bold">
                {todayMobilePayments.length > 0 
                  ? Math.round((successfulPayments / todayMobilePayments.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 font-bengali">নতুন পেমেন্ট</h3>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-bengali">SSL সুরক্ষিত</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                শিক্ষার্থী নির্বাচন করুন *
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">নির্বাচন করুন</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - রোল: {student.roll} (ব্যালেন্স: ৳{student.balance})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount with Quick Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                পরিমাণ (৳) *
              </label>
              <div className="space-y-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="10"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="পেমেন্টের পরিমাণ লিখুন (সর্বনিম্ন ১০ টাকা)"
                />
                <div className="flex flex-wrap gap-2">
                  {[100, 200, 500, 1000, 2000].map(quickAmount => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bengali"
                    >
                      ৳{quickAmount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-3">
                পেমেন্ট মেথড *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <label 
                    key={method.id} 
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:shadow-md transition-all ${
                      paymentMethod === method.id 
                        ? `${method.borderColor} ${method.bgColor} shadow-md` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center text-white text-lg shadow-sm`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 font-bengali">{method.name}</div>
                        <div className="text-sm text-gray-600">
                          {method.number}
                        </div>
                        <div className="text-xs text-gray-500 font-bengali">
                          চার্জ: {method.charge} | {method.type}
                        </div>
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Selected Method Details */}
            {selectedMethod && (
              <div className={`${selectedMethod.bgColor} ${selectedMethod.borderColor} border-2 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${selectedMethod.color} rounded-lg flex items-center justify-center text-white`}>
                      {selectedMethod.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 font-bengali">
                        {selectedMethod.name} - {selectedMethod.number}
                      </p>
                      <p className="text-sm text-gray-600 font-bengali">
                        {selectedMethod.type} | চার্জ: {selectedMethod.charge}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(selectedMethod.number)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      title="নম্বর কপি করুন"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={sharePaymentLink}
                      className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      title="শেয়ার করুন"
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-bengali font-medium">
                    ✨ বিশেষ সুবিধা:
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {selectedMethod.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-green-500" />
                        <span className="text-sm text-gray-600 font-bengali">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {amount > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-lg border">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-bengali">পেমেন্ট:</span>
                      <span className="font-medium">৳{amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-bengali">চার্জ:</span>
                      <span className="font-medium">৳{Math.round(amount * parseFloat(selectedMethod.charge.replace('%', '')) / 100)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
                      <span className="text-gray-800 font-bengali">মোট:</span>
                      <span className="text-blue-600">৳{amount + Math.round(amount * parseFloat(selectedMethod.charge.replace('%', '')) / 100)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                ট্রানজেকশন ID *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="পেমেন্ট করার পর ট্রানজেকশন ID লিখুন"
              />
              <p className="text-xs text-gray-500 mt-1 font-bengali">
                💡 টিপস: ট্রানজেকশন ID সাধারণত ১০-১৫ অক্ষরের হয়ে থাকে
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedStudent || !amount || !transactionId || amount < 10}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bengali flex items-center justify-center space-x-2 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>প্রসেসিং...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>পেমেন্ট সম্পন্ন করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* QR Code Display */}
          {showQR && selectedStudent && amount > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">QR কোড পেমেন্ট</h3>
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mx-auto flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-bengali mb-2">
                  QR কোড স্ক্যান করে পেমেন্ট করুন
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-bengali">
                    পরিমাণ: ৳{amount} | মেথড: {selectedMethod?.name}
                  </p>
                  <p className="text-xs text-blue-600 font-bengali mt-1">
                    {students.find(s => s.id === selectedStudent)?.name}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(`Payment: ৳${amount} for ${students.find(s => s.id === selectedStudent)?.name}`)}
                  className="mt-3 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Download className="w-4 h-4" />
                  <span className="font-bengali">QR ডাউনলোড</span>
                </button>
              </div>
            </div>
          )}

          {/* Real-time Payment History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-bengali">লাইভ পেমেন্ট</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-bengali">লাইভ</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {paymentHistory.length > 0 ? paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 font-bengali">{payment.student}</p>
                      <p className="text-xs text-gray-500">{payment.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">৳{payment.amount}</p>
                    <p className="text-xs text-gray-500 font-bengali capitalize">{payment.method}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-bengali">নতুন পেমেন্টের অপেক্ষায়...</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">পেমেন্ট গাইড</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">১</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 font-bengali">শিক্ষার্থী নির্বাচন</h4>
                  <p className="text-sm text-gray-600 font-bengali">যার জন্য পেমেন্ট করবেন তাকে বেছে নিন</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">২</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 font-bengali">পেমেন্ট মেথড</h4>
                  <p className="text-sm text-gray-600 font-bengali">সুবিধাজনক মেথড নির্বাচন করুন</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">৩</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 font-bengali">টাকা পাঠান</h4>
                  <p className="text-sm text-gray-600 font-bengali">দেওয়া নম্বরে Send Money করুন</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">৪</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 font-bengali">নিশ্চিত করুন</h4>
                  <p className="text-sm text-gray-600 font-bengali">ট্রানজেকশন ID দিয়ে সম্পন্ন করুন</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-bengali">
                ⚠️ <strong>গুরুত্বপূর্ণ:</strong> ট্রানজেকশন ID সঠিকভাবে লিখুন। ভুল ID দিলে পেমেন্ট ব্যর্থ হতে পারে।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Mobile Payments Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 font-bengali">আজকের মোবাইল পেমেন্ট</h3>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="font-bengali">রিপোর্ট ডাউনলোড</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  সময়
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
              {todayMobilePayments.length > 0 ? todayMobilePayments.slice(0, 10).map((payment) => {
                const student = students.find(s => s.id === payment.studentId);
                const method = paymentMethods.find(m => m.id === payment.method);
                
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(), 'HH:mm:ss')}
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
                        <div className={`w-6 h-6 ${method?.color} rounded flex items-center justify-center text-white text-xs`}>
                          {method?.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-900 font-bengali">
                          {method?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 font-mono">
                          {payment.transactionId || '-'}
                        </span>
                        {payment.transactionId && (
                          <button
                            onClick={() => copyToClipboard(payment.transactionId!)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-bengali ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'completed' ? 'সফল' : 
                         payment.status === 'pending' ? 'অপেক্ষমান' : 'ব্যর্থ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    আজকের কোন মোবাইল পেমেন্ট রেকর্ড নেই
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MobilePayment;