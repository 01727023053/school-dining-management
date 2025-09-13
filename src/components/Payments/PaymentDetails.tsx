import React from 'react';
import { X, CreditCard, Calendar, User, Hash, FileText, Smartphone, Banknote } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';

interface PaymentDetailsProps {
  paymentId: string;
  onClose: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentId, onClose }) => {
  const { payments, students } = useData();
  
  const payment = payments.find(p => p.id === paymentId);
  const student = payment ? students.find(s => s.id === payment.studentId) : null;

  if (!payment) {
    return null;
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bkash':
        return <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">bK</div>;
      case 'nagad':
        return <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">N</div>;
      case 'rocket':
        return <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">R</div>;
      case 'upay':
        return <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">U</div>;
      case 'cash':
        return <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Banknote className="w-5 h-5 text-green-600" /></div>;
      case 'bank':
        return <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center"><CreditCard className="w-5 h-5 text-indigo-600" /></div>;
      default:
        return <CreditCard className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getMethodText = (method: string) => {
    switch (method) {
      case 'bkash':
        return 'বিকাশ';
      case 'nagad':
        return 'নগদ';
      case 'rocket':
        return 'রকেট';
      case 'upay':
        return 'উপায়';
      case 'cash':
        return 'ক্যাশ';
      case 'bank':
        return 'ব্যাংক ট্রান্সফার';
      default:
        return method;
    }
  };

  const getMethodDetails = (method: string) => {
    switch (method) {
      case 'bkash':
        return '০১৩০ ৯৪ ১৯ৄ০ (মার্চেন্ট)';
      case 'nagad':
        return '০১৩০৩ ৯৪১ ৯৪০ (পার্সোনাল)';
      case 'rocket':
        return '০১৭১২৩৪৫৬৭৮ (এজেন্ট)';
      case 'upay':
        return '০১৮১২৩৪৫৬৭৮ (পার্সোনাল)';
      case 'bank':
        return 'A/C: ১২৩৪৫৬৭৮৯০';
      case 'cash':
        return 'নগদ টাকা';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                পেমেন্ট বিস্তারিত
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Payment Amount */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ৳{payment.amount}
                </div>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(payment.status)} font-bengali`}>
                  {getStatusText(payment.status)}
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                {getPaymentMethodIcon(payment.method)}
                <div>
                  <div className="font-medium text-gray-900 font-bengali">
                    {getMethodText(payment.method)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getMethodDetails(payment.method)}
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">শিক্ষার্থী</div>
                    <div className="font-medium text-gray-900 font-bengali">
                      {student?.name || 'অজানা শিক্ষার্থী'}
                    </div>
                    {student && (
                      <div className="text-sm text-gray-600">
                        রোল: {student.roll} | ক্লাস: {student.class}-{student.section}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">তারিখ</div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(payment.date), 'dd MMMM yyyy')}
                    </div>
                  </div>
                </div>

                {payment.transactionId && (
                  <div className="flex items-center space-x-3">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 font-bengali">
                        {payment.method === 'bank' ? 'রেফারেন্স নম্বর' : 'ট্রানজেকশন ID'}
                      </div>
                      <div className="font-medium text-gray-900 font-mono">
                        {payment.transactionId}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Balance */}
              {student && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800 font-bengali">
                      বর্তমান ব্যালেন্স
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      ৳{student.balance}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method Benefits */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 font-bengali mb-2">পেমেন্ট সুবিধা</h4>
                <div className="text-sm text-green-700 space-y-1">
                  {payment.method === 'bkash' && (
                    <>
                      <div>✓ ২৪/৭ সেবা উপলব্ধ</div>
                      <div>✓ তাৎক্ষণিক পেমেন্ট</div>
                      <div>✓ নিরাপদ ও সুরক্ষিত</div>
                    </>
                  )}
                  {payment.method === 'nagad' && (
                    <>
                      <div>✓ কম চার্জে পেমেন্ট</div>
                      <div>✓ দ্রুত লেনদেন</div>
                      <div>✓ সহজ ব্যবহার</div>
                    </>
                  )}
                  {payment.method === 'rocket' && (
                    <>
                      <div>✓ ব্যাংক গ্রেড নিরাপত্তা</div>
                      <div>✓ এজেন্ট নেটওয়ার্ক</div>
                      <div>✓ বিশ্বস্ত সেবা</div>
                    </>
                  )}
                  {payment.method === 'upay' && (
                    <>
                      <div>✓ ইউনাইটেড কমার্শিয়াল ব্যাংক</div>
                      <div>✓ নিরাপদ লেনদেন</div>
                      <div>✓ সহজ পেমেন্ট</div>
                    </>
                  )}
                  {payment.method === 'cash' && (
                    <>
                      <div>✓ তাৎক্ষণিক পেমেন্ট</div>
                      <div>✓ কোন অতিরিক্ত চার্জ নেই</div>
                      <div>✓ সরাসরি হস্তান্তর</div>
                    </>
                  )}
                  {payment.method === 'bank' && (
                    <>
                      <div>✓ ব্যাংক গ্রেড নিরাপত্তা</div>
                      <div>✓ বড় অঙ্কের পেমেন্ট</div>
                      <div>✓ অফিসিয়াল রেকর্ড</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700 font-bengali"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;