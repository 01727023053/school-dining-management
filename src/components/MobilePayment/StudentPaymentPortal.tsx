import React, { useState } from 'react';
import { CreditCard, Smartphone, QrCode, Copy, Share2, CheckCircle, AlertCircle, ArrowLeft, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentPaymentPortal: React.FC = () => {
  const { user } = useAuth();
  const { students, addPayment } = useData();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay'>('bkash');
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const studentData = students.find(s => s.name === user?.name);

  const paymentMethods = [
    {
      id: 'bkash',
      name: 'বিকাশ',
      number: '০১৩০ ৯৪ ১৯৪০',
      type: 'মার্চেন্ট',
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      icon: '📱'
    },
    {
      id: 'nagad',
      name: 'নগদ',
      number: '০১৩০৩ ৯৪১ ৯৪০',
      type: 'পার্সোনাল',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: '💳'
    },
    {
      id: 'rocket',
      name: 'রকেট',
      number: '০১৭১২৩৪৫৬৭৮',
      type: 'এজেন্ট',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: '🚀'
    },
    {
      id: 'upay',
      name: 'উপায়',
      number: '০১৮১২৩৪৫৬৭৮',
      type: 'পার্সোনাল',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: '💎'
    }
  ];

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  const handlePayment = async () => {
    if (!amount || amount < 50) {
      toast.error('সর্বনিম্ন ৫০ টাকা পেমেন্ট করুন');
      return;
    }

    if (!transactionId) {
      toast.error('ট্রানজেকশন ID প্রয়োজন');
      return;
    }

    if (!studentData) {
      toast.error('শিক্ষার্থীর তথ্য পাওয়া যায়নি');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      addPayment({
        studentId: studentData.id,
        amount: amount,
        method: selectedMethod,
        transactionId: transactionId,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });

      toast.success(`✅ পেমেন্ট সফল! ৳${amount} আপনার অ্যাকাউন্টে যোগ হয়েছে`);
      
      // Reset form
      setAmount(0);
      setTransactionId('');
    } catch (error) {
      toast.error('পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('নম্বর কপি হয়েছে!');
  };

  const callNumber = (number: string) => {
    window.open(`tel:${number}`);
    toast.success('কল করা হচ্ছে...');
  };

  const sendSMS = () => {
    if (!studentData) return;
    const message = `আমি ${studentData.name}, রোল: ${studentData.roll}। আমার মিল অ্যাকাউন্টে ৳${amount} টাকা পেমেন্ট করতে চাই।`;
    window.open(`sms:01712345678?body=${encodeURIComponent(message)}`);
    toast.success('SMS অ্যাপ খোলা হচ্ছে...');
  };

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-bengali">
            শিক্ষার্থীর তথ্য পাওয়া যায়নি
          </h2>
          <p className="text-gray-600 mb-6 font-bengali">
            আপনার অ্যাকাউন্টের সাথে কোন শিক্ষার্থীর তথ্য মিলছে না। অ্যাডমিনের সাথে যোগাযোগ করুন।
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bengali"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bengali">ড্যাশবোর্ডে ফিরে যান</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 font-bengali">💳 অনলাইন পেমেন্ট</h1>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {studentData.photo ? (
                <img src={studentData.photo} alt={studentData.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-2xl font-bold text-blue-600">{studentData.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-bengali">{studentData.name}</h2>
              <p className="text-gray-600">রোল: {studentData.roll} | ক্লাস: {studentData.class}-{studentData.section}</p>
              <p className={`text-lg font-bold ${studentData.balance <= 300 ? 'text-red-600' : 'text-green-600'}`}>
                বর্তমান ব্যালেন্স: ৳{studentData.balance}
              </p>
            </div>
          </div>

          {studentData.balance <= 300 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-red-800 font-bengali">
                  ⚠️ আপনার ব্যালেন্স কম! অবিলম্বে পেমেন্ট করুন।
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 font-bengali">পেমেন্ট করুন</h3>
            
            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-3">
                পেমেন্ট পরিমাণ (৳)
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[100, 200, 500, 1000, 2000, 5000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount)}
                    className={`py-2 px-3 rounded-lg border transition-colors font-bengali ${
                      amount === quickAmount 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    ৳{quickAmount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="50"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="অথবা কাস্টম পরিমাণ লিখুন (সর্বনিম্ন ৫০ টাকা)"
              />
            </div>

            {/* Payment Link Generator */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 font-bengali mb-3">🔗 পেমেন্ট লিংক তৈরি করুন</h4>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const paymentLink = `${window.location.origin}/student-payment?student=${studentData.id}&amount=${amount}&method=${selectedMethod}`;
                    navigator.clipboard.writeText(paymentLink);
                    toast.success('পেমেন্ট লিংক কপি হয়েছে!');
                  }}
                  disabled={!amount || amount < 50}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-bengali"
                >
                  📋 পেমেন্ট লিংক কপি করুন
                </button>
                
                <button
                  onClick={() => {
                    const shareText = `${studentData.name} এর জন্য ৳${amount} টাকা পেমেন্ট করুন\n${selectedMethodData?.name}: ${selectedMethodData?.number}\nপেমেন্ট লিংক: ${window.location.origin}/student-payment`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'পেমেন্ট লিংক',
                        text: shareText
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      toast.success('পেমেন্ট তথ্য কপি হয়েছে!');
                    }
                  }}
                  disabled={!amount || amount < 50}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-bengali"
                >
                  📤 পেমেন্ট তথ্য শেয়ার করুন
                </button>
              </div>
            </div>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-3">
                পেমেন্ট মেথড নির্বাচন করুন
              </label>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map(method => (
                  <label 
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? `${method.borderColor} ${method.bgColor}` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value as any)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 font-bengali">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.number}</div>
                        <div className="text-xs text-gray-500 font-bengali">{method.type}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => copyNumber(method.number)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          title="নম্বর কপি করুন"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => callNumber(method.number)}
                          className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                          title="কল করুন"
                        >
                          <Phone className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Selected Method Info */}
            {selectedMethodData && (
              <div className={`${selectedMethodData.bgColor} ${selectedMethodData.borderColor} border-2 rounded-lg p-4 mb-6`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 ${selectedMethodData.color} rounded-lg flex items-center justify-center text-white`}>
                    {selectedMethodData.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 font-bengali">
                      {selectedMethodData.name} - {selectedMethodData.number}
                    </p>
                    <p className="text-sm text-gray-600 font-bengali">
                      {selectedMethodData.type} অ্যাকাউন্ট
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <h4 className="font-medium text-gray-800 font-bengali mb-2">পেমেন্ট নির্দেশনা:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 font-bengali">
                    <li>১. উপরের নম্বরে Send Money করুন</li>
                    <li>২. রেফারেন্সে লিখুন: "{studentData.name} - {studentData.roll}"</li>
                    <li>৩. পেমেন্ট সম্পন্ন হলে ট্রানজেকশন ID নিচে দিন</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Transaction ID */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                ট্রানজেকশন ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="পেমেন্ট করার পর ট্রানজেকশন ID লিখুন"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || !amount || !transactionId || amount < 50}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bengali flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>প্রসেসিং...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>পেমেন্ট নিশ্চিত করুন</span>
                </>
              )}
            </button>

            {/* Help Button */}
            <button
              onClick={sendSMS}
              className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bengali flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>সাহায্যের জন্য SMS পাঠান</span>
            </button>
          </div>

          {/* Payment Guide */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">QR কোড পেমেন্ট</h3>
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mx-auto flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-bengali mb-4">
                  QR কোড স্ক্যান করে সরাসরি পেমেন্ট করুন
                </p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bengali">
                  QR কোড জেনারেট করুন
                </button>
              </div>
            </div>

            {/* Payment Guide */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">পেমেন্ট গাইড</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">১</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 font-bengali">পেমেন্ট মেথড নির্বাচন</h4>
                    <p className="text-sm text-gray-600 font-bengali">আপনার সুবিধামত মোবাইল ব্যাংকিং বেছে নিন</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">২</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 font-bengali">Send Money করুন</h4>
                    <p className="text-sm text-gray-600 font-bengali">প্রদত্ত নম্বরে টাকা পাঠান</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">৩</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 font-bengali">ট্রানজেকশন ID দিন</h4>
                    <p className="text-sm text-gray-600 font-bengali">পেমেন্ট সফল হলে ID এখানে লিখুন</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 font-bengali">সম্পন্ন!</h4>
                    <p className="text-sm text-gray-600 font-bengali">আপনার ব্যালেন্স আপডেট হবে</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">সাহায্য প্রয়োজন?</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 font-bengali">স্কুল অফিস</p>
                    <p className="text-sm text-gray-600">০১৭১২৩৪৫৬৭৮</p>
                  </div>
                  <button
                    onClick={() => callNumber('01712345678')}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 font-bengali">অভিভাবক</p>
                    <p className="text-sm text-gray-600">{studentData.parentPhone}</p>
                  </div>
                  <button
                    onClick={() => callNumber(studentData.parentPhone)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h4 className="font-medium text-yellow-800 font-bengali">গুরুত্বপূর্ণ তথ্য</h4>
              <p className="text-sm text-yellow-700 font-bengali mt-1">
                • পেমেন্ট করার পর অবশ্যই ট্রানজেকশন ID দিয়ে নিশ্চিত করুন
                • ভুল তথ্য দিলে পেমেন্ট বিলম্বিত হতে পারে
                • সমস্যা হলে স্কুল অফিসে যোগাযোগ করুন
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentPortal;