import React from 'react';
import { X, Wallet, Calendar, FileText, TrendingUp, TrendingDown, Edit, Home, Utensils, Truck, Store, CreditCard, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';

interface CashEntryDetailsProps {
  entryId: string;
  onClose: () => void;
  onEdit?: (entryId: string) => void;
}

const CashEntryDetails: React.FC<CashEntryDetailsProps> = ({ entryId, onClose, onEdit }) => {
  const { cashEntries } = useData();
  
  const entry = cashEntries.find(e => e.id === entryId);

  if (!entry) {
    return null;
  }

  const isIncome = entry.amount > 0;

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

  const sourceInfo = getSourceInfo(entry.source);
  const IconComponent = sourceInfo.icon;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(entryId);
    } else {
      // Default edit functionality - close this modal and open edit form
      onClose();
      // In a real implementation, this would trigger the parent component to open edit mode
      console.log('Edit entry:', entryId);
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
                ক্যাশ এন্ট্রির বিস্তারিত
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Amount */}
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncome ? '+' : ''}৳{entry.amount}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  isIncome 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isIncome ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="font-bengali">{isIncome ? 'আয়' : 'খরচ'}</span>
                </div>
              </div>

              {/* Source */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 font-bengali">
                    {sourceInfo.label}
                  </div>
                  <div className="text-sm text-gray-600 font-bengali">
                    সোর্স
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">তারিখ</div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(entry.date), 'dd MMMM yyyy')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">বিবরণ</div>
                    <div className="font-medium text-gray-900 font-bengali">
                      {entry.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">প্রভাব</div>
                    <div className={`font-medium ${
                      isIncome ? 'text-green-600' : 'text-red-600'
                    } font-bengali`}>
                      {isIncome ? 'ক্যাশ বৃদ্ধি' : 'ক্যাশ হ্রাস'}
                    </div>
                  </div>
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
              <button 
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 font-bengali"
              >
                <Edit className="w-4 h-4" />
                <span>সম্পাদনা করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashEntryDetails;