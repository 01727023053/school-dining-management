import React from 'react';
import { X, ShoppingCart, Calendar, User, Package, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';

interface ExpenseDetailsProps {
  expenseId: string;
  onClose: () => void;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ expenseId, onClose }) => {
  const { expenses, suppliers } = useData();
  
  const expense = expenses.find(e => e.id === expenseId);
  const supplier = expense?.supplierId ? suppliers.find(s => s.id === expense.supplierId) : null;

  if (!expense) {
    return null;
  }

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
                খরচের বিস্তারিত
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Total Amount */}
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ৳{expense.totalPrice}
                </div>
                <div className="text-sm text-gray-600 font-bengali">
                  {expense.quantity} × ৳{expense.unitPrice} = ৳{expense.totalPrice}
                </div>
              </div>

              {/* Category and Item */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">{getCategoryIcon(expense.category)}</div>
                <div>
                  <div className="font-medium text-gray-900 font-bengali">
                    {expense.item}
                  </div>
                  <div className="text-sm text-gray-600 font-bengali">
                    {expense.category}
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
                      {format(new Date(expense.date), 'dd MMMM yyyy')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">পরিমাণ</div>
                    <div className="font-medium text-gray-900">
                      {expense.quantity}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">একক দাম</div>
                    <div className="font-medium text-gray-900">
                      ৳{expense.unitPrice}
                    </div>
                  </div>
                </div>

                {supplier && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 font-bengali">সরবরাহকারী</div>
                      <div className="font-medium text-gray-900 font-bengali">
                        {supplier.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {supplier.phone}
                      </div>
                    </div>
                  </div>
                )}

                {expense.description && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500 font-bengali">বিবরণ</div>
                      <div className="font-medium text-gray-900 font-bengali">
                        {expense.description}
                      </div>
                    </div>
                  </div>
                )}
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

export default ExpenseDetails;