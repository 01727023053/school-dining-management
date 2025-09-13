import React from 'react';
import { Users, UserCheck, CreditCard, AlertTriangle, Wallet, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { students, attendance, payments, cashEntries } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.present).length;
  const totalStudents = students.length;
  const lowBalanceStudents = students.filter(s => s.balance <= 300);
  const totalCash = cashEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const todayPayments = payments.filter(p => p.date === today);
  const todayPaymentTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  // Handle stat card clicks
  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'students':
        navigate('/students');
        toast.success('শিক্ষার্থী পেজে নিয়ে যাওয়া হচ্ছে');
        break;
      case 'attendance':
        navigate('/attendance');
        toast.success('উপস্থিতি পেজে নিয়ে যাওয়া হচ্ছে');
        break;
      case 'payments':
        navigate('/payments');
        toast.success('পেমেন্ট পেজে নিয়ে যাওয়া হচ্ছে');
        break;
      case 'cash':
        navigate('/cash-tracking');
        toast.success('ক্যাশ ট্র্যাকিং পেজে নিয়ে যাওয়া হচ্ছে');
        break;
      case 'lowBalance':
        navigate('/students');
        toast(`${lowBalanceStudents.length} জন শিক্ষার্থীর ব্যালেন্স কম`);
        break;
      default:
        toast.info('এই ফিচার শীঘ্রই আসছে');
    }
  };

  const stats = [
    {
      title: 'মোট শিক্ষার্থী',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      type: 'students'
    },
    {
      title: 'আজকের উপস্থিতি',
      value: `${presentToday}/${totalStudents}`,
      icon: UserCheck,
      color: 'bg-green-500',
      type: 'attendance'
    },
    {
      title: 'আজকের পেমেন্ট',
      value: `৳${todayPaymentTotal}`,
      icon: CreditCard,
      color: 'bg-purple-500',
      type: 'payments'
    },
    {
      title: 'মোট ক্যাশ',
      value: `৳${totalCash}`,
      icon: Wallet,
      color: 'bg-indigo-500',
      type: 'cash'
    },
    {
      title: 'কম ব্যালেন্স',
      value: lowBalanceStudents.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      type: 'lowBalance'
    }
  ];

  if (user?.role === 'student') {
    const studentData = students.find(s => s.name === user.name);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 font-bengali">আমার ড্যাশবোর্ড</h1>
          <div className="text-sm text-gray-600 font-bengali">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </div>
        </div>

        {/* Quick Payment Button */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-bengali mb-2">💳 দ্রুত পেমেন্ট</h2>
              <p className="text-green-100 font-bengali">মোবাইল ব্যাংকিং দিয়ে সহজেই পেমেন্ট করুন</p>
            </div>
            <button
              onClick={() => navigate('/student-payment')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-md font-bengali"
            >
              এখনই পেমেন্ট করুন →
            </button>
          </div>
        </div>
        {/* Student Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {studentData?.photo ? (
                <img 
                  src={studentData.photo} 
                  alt={studentData.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-bengali">{user.name}</h3>
              <p className="text-sm text-gray-600 font-bengali">শিক্ষার্থী অ্যাকাউন্ট</p>
              {studentData && (
                <p className="text-sm text-blue-600 font-bengali">
                  রোল: {studentData.roll} | ক্লাস: {studentData.class}-{studentData.section}
                </p>
              )}
            </div>
          </div>
        </div>

        {studentData ? (
          <>
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-blue-800 font-bengali">বর্তমান ব্যালেন্স</h3>
                    <p className={`text-3xl font-bold ${studentData.balance <= 300 ? 'text-red-600' : 'text-blue-600'}`}>
                      ৳{studentData.balance}
                    </p>
                    {studentData.balance <= 300 && (
                      <p className="text-sm text-red-600 font-bengali mt-1">⚠️ কম ব্যালেন্স!</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <CreditCard className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800 font-bengali">দৈনিক মিল চার্জ</h3>
                    <p className="text-3xl font-bold text-green-600">৳{studentData.mealCharge}</p>
                    <p className="text-sm text-gray-600 font-bengali">প্রতিদিন কাটা হয়</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <UserCheck className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-purple-800 font-bengali">স্ট্যাটাস</h3>
                    <p className={`text-2xl font-bold font-bengali ${studentData.balance > 300 ? 'text-green-600' : 'text-red-600'}`}>
                      {studentData.balance > 300 ? 'সক্রিয় ✓' : 'কম ব্যালেন্স ⚠️'}
                    </p>
                    <p className="text-sm text-gray-600 font-bengali">
                      {studentData.balance > 300 ? 'মিল চালু আছে' : 'টাকা জমা দিন'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <UserCheck className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-800 font-bengali">মোট উপস্থিত</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {attendance.filter(a => a.studentId === studentData.id && a.present).length} দিন
                    </p>
                    <p className="text-sm text-gray-600 font-bengali">সর্বমোট উপস্থিতি</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg">✗</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800 font-bengali">মোট অনুপস্থিত</h3>
                    <p className="text-3xl font-bold text-red-600">
                      {attendance.filter(a => a.studentId === studentData.id && !a.present).length} দিন
                    </p>
                    <p className="text-sm text-gray-600 font-bengali">সর্বমোট অনুপস্থিতি</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Alert */}
            {studentData.balance <= 300 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800 font-bengali">
                      ব্যালেন্স কম সতর্কতা
                    </h3>
                    <p className="text-red-700 font-bengali mt-2">
                      আপনার ব্যালেন্স কম হয়ে গেছে। অভিভাবককে জানিয়ে টাকা জমা দিন।
                    </p>
                    <button
                      onClick={() => navigate('/student-payment')}
                      className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 font-bengali font-bold shadow-lg"
                    >
                      🚀 এখনই পেমেন্ট করুন
                    </button>
                    <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
                      <h4 className="font-medium text-gray-800 font-bengali mb-2">অভিভাবকের তথ্য:</h4>
                      <p className="text-gray-700 font-bengali">নাম: {studentData.parentName}</p>
                      <p className="text-gray-700">ফোন: {studentData.parentPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Payment Options */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">💳 মোবাইল পেমেন্ট অপশন</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/student-payment')}
                  className="bg-pink-500 text-white p-4 rounded-lg hover:bg-pink-600 transition-all transform hover:scale-105 shadow-md"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="font-bold font-bengali">বিকাশ</h4>
                    <p className="text-xs text-pink-100 font-bengali">মার্চেন্ট</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/student-payment')}
                  className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <h4 className="font-bold font-bengali">নগদ</h4>
                    <p className="text-xs text-orange-100 font-bengali">পার্সোনাল</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/student-payment')}
                  className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105 shadow-md"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="font-bold font-bengali">রকেট</h4>
                    <p className="text-xs text-purple-100 font-bengali">এজেন্ট</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/student-payment')}
                  className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💎</div>
                    <h4 className="font-bold font-bengali">উপায়</h4>
                    <p className="text-xs text-blue-100 font-bengali">পার্সোনাল</p>
                  </div>
                </button>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">উপস্থিতির সারসংক্ষেপ</h3>
                <div className="space-y-4">
                  {/* Attendance Rate */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {attendance.filter(a => a.studentId === studentData.id).length > 0 
                        ? Math.round((attendance.filter(a => a.studentId === studentData.id && a.present).length / 
                          attendance.filter(a => a.studentId === studentData.id).length) * 100)
                        : 0}%
                    </div>
                    <p className="text-sm text-gray-600 font-bengali">উপস্থিতির হার</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${attendance.filter(a => a.studentId === studentData.id).length > 0 
                          ? (attendance.filter(a => a.studentId === studentData.id && a.present).length / 
                            attendance.filter(a => a.studentId === studentData.id).length) * 100
                          : 0}%` 
                      }}
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">
                        {attendance.filter(a => a.studentId === studentData.id && a.present).length}
                      </div>
                      <div className="text-xs text-green-700 font-bengali">উপস্থিত দিন</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-red-600">
                        {attendance.filter(a => a.studentId === studentData.id && !a.present).length}
                      </div>
                      <div className="text-xs text-red-700 font-bengali">অনুপস্থিত দিন</div>
                    </div>
                  </div>
                  
                  {/* This Month Stats */}
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600 font-bengali mb-2">এই মাসের উপস্থিতি:</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-bengali">
                        ✓ {attendance.filter(a => 
                          a.studentId === studentData.id && 
                          a.present && 
                          new Date(a.date).getMonth() === new Date().getMonth()
                        ).length} দিন
                      </span>
                      <span className="text-red-600 font-bengali">
                        ✗ {attendance.filter(a => 
                          a.studentId === studentData.id && 
                          !a.present && 
                          new Date(a.date).getMonth() === new Date().getMonth()
                        ).length} দিন
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Attendance */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">আমার উপস্থিতি</h3>
                <div className="space-y-3">
                  {attendance
                    .filter(a => a.studentId === studentData.id)
                    .slice(0, 5)
                    .map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${record.present ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-sm font-bengali">
                            {format(new Date(record.date), 'dd MMMM yyyy')}
                          </span>
                        </div>
                        <span className={`text-sm font-semibold font-bengali ${
                          record.present ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {record.present ? 'উপস্থিত' : 'অনুপস্থিত'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* My Payments */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">আমার পেমেন্ট</h3>
                <div className="space-y-3">
                  {payments
                    .filter(p => p.studentId === studentData.id)
                    .slice(0, 5)
                    .map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bengali">
                            {format(new Date(payment.date), 'dd MMMM yyyy')}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">৳{payment.amount}</span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => navigate('/student-payment')}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-bengali"
                >
                  নতুন পেমেন্ট করুন
                </button>
              </div>
            </div>

            {/* Balance Calculation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 font-bengali">ব্যালেন্স হিসাব</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-bengali">মোট জমা</p>
                  <p className="text-xl font-bold text-green-600">
                    ৳{payments.filter(p => p.studentId === studentData.id).reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-bengali">মোট খরচ</p>
                  <p className="text-xl font-bold text-red-600">
                    ৳{attendance.filter(a => a.studentId === studentData.id && a.present).length * studentData.mealCharge}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-bengali">বর্তমান ব্যালেন্স</p>
                  <p className={`text-xl font-bold ${studentData.balance <= 300 ? 'text-red-600' : 'text-blue-600'}`}>
                    ৳{studentData.balance}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-bengali">শিক্ষার্থীর তথ্য পাওয়া যায়নি</h3>
            <p className="text-gray-600 font-bengali">
              আপনার অ্যাকাউন্টের সাথে কোন শিক্ষার্থীর তথ্য মিলছে না। অ্যাডমিনের সাথে যোগাযোগ করুন।
            </p>
          </div>
        )}
      </div>
    );
      {/* Student Payment Portal */}
      {user?.role === 'student' && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">💳 অনলাইন পেমেন্ট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-800 font-bengali mb-2">মোবাইল ব্যাংকিং</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-bengali">বিকাশ মার্চেন্ট:</span>
                  <span className="font-mono">০১৩০ ৯৪ ১৯৪০</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bengali">নগদ পার্সোনাল:</span>
                  <span className="font-mono">০১৩০৩ ৯৪১ ৯৪০</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bengali">রকেট এজেন্ট:</span>
                  <span className="font-mono">০১৭১২৩৪৫৬৭৮</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/mobile-payment')}
                className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bengali"
              >
                অনলাইন পেমেন্ট করুন
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-800 font-bengali mb-2">পেমেন্ট গাইড</h4>
              <ol className="text-sm text-gray-600 space-y-1 font-bengali">
                <li>১. উপরের নম্বরে Send Money করুন</li>
                <li>২. আপনার নাম ও রোল নম্বর রেফারেন্সে লিখুন</li>
                <li>৩. ট্রানজেকশন ID সংরক্ষণ করুন</li>
                <li>৪. স্কুলে জানিয়ে দিন</li>
              </ol>
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 font-bengali">
                💡 টিপস: পেমেন্টের পর অবশ্যই ট্রানজেকশন ID স্কুলে জানাবেন
              </div>
            </div>
          </div>
        </div>
      )}

  }

  // For non-student users, show admin/supervisor dashboard
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">ড্যাশবোর্ড</h1>
        <div className="text-sm text-gray-600 font-bengali">
          {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </div>
      </div>

      {/* Stats Grid - Now with working buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={() => handleStatClick(stat.type)}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer group text-left"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-bengali group-hover:text-gray-800 transition-colors">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {stat.value}
                </p>
              </div>
            </div>
            
            {/* Hover indicator */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="text-xs text-blue-600 font-bengali">
                👆 ক্লিক করে বিস্তারিত দেখুন
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Low Balance Alert */}
      {lowBalanceStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="ml-2 text-lg font-semibold text-red-800 font-bengali">
              কম ব্যালেন্স সতর্কতা
            </h3>
          </div>
          <p className="mt-2 text-red-700 font-bengali">
            {lowBalanceStudents.length} জন শিক্ষার্থীর ব্যালেন্স ৩০০ টাকার কম।
          </p>
          <div className="mt-3 space-y-1">
            {lowBalanceStudents.slice(0, 5).map(student => (
              <div key={student.id} className="flex justify-between text-sm">
                <span className="font-bengali">{student.name} ({student.roll})</span>
                <span className="font-semibold">৳{student.balance}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleStatClick('lowBalance')}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-bengali"
          >
            সব দেখুন
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-bengali">আজকের উপস্থিতি</h3>
            <button
              onClick={() => handleStatClick('attendance')}
              className="text-blue-600 hover:text-blue-800 text-sm font-bengali"
            >
              সব দেখুন →
            </button>
          </div>
          {todayAttendance.length > 0 ? (
            <div className="space-y-3">
              {todayAttendance.slice(0, 5).map(record => {
                const student = students.find(s => s.id === record.studentId);
                return (
                  <div key={record.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${record.present ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="ml-3 text-sm font-bengali">{student?.name || 'অজানা শিক্ষার্থী'}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-bengali">{record.method}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 font-bengali">আজকের কোন উপস্থিতি রেকর্ড নেই</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-bengali">আজকের পেমেন্ট</h3>
            <button
              onClick={() => handleStatClick('payments')}
              className="text-blue-600 hover:text-blue-800 text-sm font-bengali"
            >
              সব দেখুন →
            </button>
          </div>
          {todayPayments.length > 0 ? (
            <div className="space-y-3">
              {todayPayments.slice(0, 5).map(payment => {
                const student = students.find(s => s.id === payment.studentId);
                return (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="ml-3 text-sm font-bengali">{student?.name || 'অজানা শিক্ষার্থী'}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">৳{payment.amount}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 font-bengali">আজকের কোন পেমেন্ট রেকর্ড নেই</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">দ্রুত কাজ</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/students')}
            className="bg-white rounded-lg p-4 border border-blue-200 hover:bg-blue-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-medium text-gray-800 font-bengali">নতুন শিক্ষার্থী</h4>
              <p className="text-sm text-gray-600 font-bengali">শিক্ষার্থী যোগ করুন</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="bg-white rounded-lg p-4 border border-green-200 hover:bg-green-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-medium text-gray-800 font-bengali">উপস্থিতি নিন</h4>
              <p className="text-sm text-gray-600 font-bengali">আজকের হাজিরা</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/payments')}
            className="bg-white rounded-lg p-4 border border-purple-200 hover:bg-purple-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">💳</div>
              <h4 className="font-medium text-gray-800 font-bengali">পেমেন্ট নিন</h4>
              <p className="text-sm text-gray-600 font-bengali">নতুন পেমেন্ট</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="bg-white rounded-lg p-4 border border-orange-200 hover:bg-orange-50 transition-colors transform hover:scale-105 duration-200"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-800 font-bengali">রিপোর্ট দেখুন</h4>
              <p className="text-sm text-gray-600 font-bengali">বিস্তারিত হিসাব</p>
            </div>
          </button>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="ml-2 text-lg font-semibold text-blue-800 font-bengali">
            ডেমো ডাটা
          </h3>
        </div>
        <p className="mt-2 text-blue-700 font-bengali">
          বর্তমানে সিস্টেমে {totalStudents} জন শিক্ষার্থীর ডেমো ডাটা রয়েছে। নতুন শিক্ষার্থী যোগ করতে "শিক্ষার্থী" মেনুতে যান।
        </p>
        <button
          onClick={() => navigate('/students')}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bengali"
        >
          শিক্ষার্থী পেজে যান
        </button>
      </div>
    </div>
  );
};

export default Dashboard;