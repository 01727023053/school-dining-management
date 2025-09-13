import React from 'react';
import { X, User, Phone, MapPin, DollarSign, Calendar, Calculator } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';

interface SupplierDetailsProps {
  supplierId: string;
  onClose: () => void;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplierId, onClose }) => {
  const { suppliers } = useData();
  
  const supplier = suppliers.find(s => s.id === supplierId);

  if (!supplier) {
    return null;
  }

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
                সরবরাহকারীর বিস্তারিত
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Total Due */}
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  supplier.totalDue > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ৳{supplier.totalDue}
                </div>
                <div className="text-sm text-gray-600 font-bengali">
                  {supplier.totalDue > 0 ? 'মোট বকেয়া' : 'কোন বকেয়া নেই'}
                </div>
              </div>

              {/* Supplier Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">
                      {supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 font-bengali text-lg">
                      {supplier.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">ফোন নম্বর</div>
                    <div className="font-medium text-gray-900">
                      {supplier.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">ঠিকানা</div>
                    <div className="font-medium text-gray-900 font-bengali">
                      {supplier.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">শেষ আপডেট</div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(supplier.lastUpdated), 'dd MMMM yyyy, HH:mm')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3 font-bengali">আর্থিক বিবরণ</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-bengali">পূর্বের বকেয়া</span>
                    <span className={`font-medium ${
                      supplier.previousDue > 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ৳{supplier.previousDue}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-bengali">আজকের বিল</span>
                    <span className="font-medium text-orange-600">
                      ৳{supplier.todaysBill}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-bengali">আজকের জমা</span>
                    <span className="font-medium text-green-600">
                      ৳{supplier.todaysDeposit}
                    </span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 font-bengali">মোট বকেয়া</span>
                      <span className={`text-lg font-bold ${
                        supplier.totalDue > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ৳{supplier.totalDue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation Formula */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 font-bengali">হিসাব</span>
                </div>
                <div className="text-xs text-blue-700 font-bengali">
                  পূর্বের বকেয়া (৳{supplier.previousDue}) + আজকের বিল (৳{supplier.todaysBill}) - আজকের জমা (৳{supplier.todaysDeposit}) = ৳{supplier.totalDue}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700 font-bengali"
              >
                বন্ধ করুন
              </button>
              <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 font-bengali">
                সম্পাদনা করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;