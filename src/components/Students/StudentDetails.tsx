import React from 'react';
import { X, User, Phone, MapPin, Calendar, CreditCard, Edit, Camera, Mail } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';

interface StudentDetailsProps {
  studentId: string;
  onClose: () => void;
  onEdit?: (studentId: string) => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ studentId, onClose, onEdit }) => {
  const { students } = useData();
  
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return null;
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(studentId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                শিক্ষার্থীর বিস্তারিত তথ্য
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Photo and Basic Info */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                    {student.photo ? (
                      <img 
                        src={student.photo} 
                        alt={student.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-500" />
                    )}
                  </div>
                  {!student.photo && (
                    <div className="absolute bottom-2 right-2 bg-blue-100 rounded-full p-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>
                
                <h4 className="text-2xl font-bold text-gray-900 font-bengali">{student.name}</h4>
                <p className="text-gray-600 text-lg">রোল: {student.roll}</p>
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
                  student.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                } font-bengali`}>
                  {student.status === 'active' ? 'সক্রিয় শিক্ষার্থী' : 'নিষ্ক্রিয় শিক্ষার্থী'}
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 font-bengali mb-3">একাডেমিক তথ্য</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-bengali">ক্লাস:</span>
                    <div className="font-medium text-gray-900">{student.class}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bengali">সেকশন:</span>
                    <div className="font-medium text-gray-900">{student.section}</div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 font-bengali mb-3">আর্থিক তথ্য</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bengali">দৈনিক মিল চার্জ:</span>
                    <span className="font-bold text-green-600">৳{student.mealCharge}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bengali">বর্তমান ব্যালেন্স:</span>
                    <span className={`font-bold text-lg ${student.balance <= 300 ? 'text-red-600' : 'text-green-600'}`}>
                      ৳{student.balance}
                    </span>
                  </div>
                  {student.balance <= 300 && (
                    <div className="bg-red-100 border border-red-300 rounded p-2 text-red-700 text-sm font-bengali">
                      ⚠️ কম ব্যালেন্স! অভিভাবককে জানান।
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900 font-bengali">যোগাযোগের তথ্য</h5>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">অভিভাবকের নাম</div>
                    <div className="font-medium text-gray-900 font-bengali">{student.parentName}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">ফোন নম্বর</div>
                    <div className="font-medium text-gray-900">{student.parentPhone}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">ঠিকানা</div>
                    <div className="font-medium text-gray-900 font-bengali">{student.address}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">যোগদানের তারিখ</div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(student.createdAt), 'dd MMMM yyyy')}
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

export default StudentDetails;