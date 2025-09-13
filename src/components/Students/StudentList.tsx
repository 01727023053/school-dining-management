import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, AlertCircle, Trash2, Phone, MapPin, Camera, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import StudentForm from './StudentForm';
import toast from 'react-hot-toast';

const StudentList: React.FC = () => {
  const { students } = useData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(studentId);
    toast.success(`${student?.name} এর বিস্তারিত তথ্য দেখানো হচ্ছে`);
  };

  const handleEdit = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setEditingStudent(studentId);
    setShowForm(true);
    toast.success(`${student?.name} এর তথ্য সম্পাদনা মোড চালু হয়েছে`);
  };

  const handleDelete = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (confirm(`আপনি কি নিশ্চিত যে "${student?.name}" কে মুছে ফেলতে চান?`)) {
      // In a real app, this would call a delete function
      toast.success(`"${student?.name}" এর তথ্য মুছে ফেলা হয়েছে`);
    }
  };

  const handleAddNewStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
    toast.success('নতুন শিক্ষার্থী যোগ করার ফর্ম খোলা হচ্ছে');
  };

  const callParent = (phone: string, studentName: string) => {
    toast.success(`${studentName} এর অভিভাবককে কল করা হচ্ছে: ${phone}`);
    // In a real app, this would integrate with phone system
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">শিক্ষার্থী ব্যবস্থাপনা</h1>
        <button
          onClick={handleAddNewStudent}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bengali">নতুন শিক্ষার্থী</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট শিক্ষার্থী</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">সক্রিয় শিক্ষার্থী</p>
              <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">কম ব্যালেন্স</p>
              <p className="text-2xl font-bold text-red-600">{students.filter(s => s.balance <= 300).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট ব্যালেন্স</p>
              <p className="text-2xl font-bold text-gray-900">৳{students.reduce((sum, s) => sum + s.balance, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="নাম বা রোল নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  শিক্ষার্থী
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  রোল
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ক্লাস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  মিল চার্জ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ব্যালেন্স
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 shadow-sm">
                        {student.photo ? (
                          <img 
                            src={student.photo} 
                            alt={student.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 font-bengali">{student.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {student.parentPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.roll}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.class} - {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{student.mealCharge}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        student.balance <= 300 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ৳{student.balance}
                      </span>
                      {student.balance <= 300 && (
                        <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    } font-bengali`}>
                      {student.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(student.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(student.id)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                        title="সম্পাদনা করুন"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => callParent(student.parentPhone, student.name)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="অভিভাবককে কল করুন"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <StudentForm
          onClose={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {(() => {
                  const student = students.find(s => s.id === selectedStudent);
                  if (!student) return null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                          শিক্ষার্থীর বিস্তারিত
                        </h3>
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                            {student.photo ? (
                              <img 
                                src={student.photo} 
                                alt={student.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-12 h-12 text-gray-500" />
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 font-bengali">{student.name}</h4>
                          <p className="text-gray-600">রোল: {student.roll}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bengali">ক্লাস:</span>
                            <span className="font-medium">{student.class} - {student.section}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bengali">অভিভাবক:</span>
                            <span className="font-medium font-bengali">{student.parentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bengali">ফোন:</span>
                            <span className="font-medium">{student.parentPhone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bengali">ঠিকানা:</span>
                            <span className="font-medium font-bengali">{student.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bengali">মিল চার্জ:</span>
                            <span className="font-medium">৳{student.mealCharge}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bengali">ব্যালেন্স:</span>
                            <span className={`font-bold ${student.balance <= 300 ? 'text-red-600' : 'text-green-600'}`}>
                              ৳{student.balance}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="px-4 py-2 bg-gray-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700 font-bengali"
                        >
                          বন্ধ করুন
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStudent(null);
                            handleEdit(student.id);
                          }}
                          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 font-bengali"
                        >
                          সম্পাদনা করুন
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;