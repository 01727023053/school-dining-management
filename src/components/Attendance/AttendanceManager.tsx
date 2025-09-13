import React, { useState } from 'react';
import { Calendar, Users, UserCheck, Download } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AttendanceManager: React.FC = () => {
  const { students, attendance, addAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});

  const todayAttendance = attendance.filter(a => a.date === selectedDate);
  const attendanceMap = todayAttendance.reduce((acc, curr) => {
    acc[curr.studentId] = curr.present;
    return acc;
  }, {} as Record<string, boolean>);

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: present
    }));
  };

  const saveAttendance = () => {
    Object.entries(attendanceData).forEach(([studentId, present]) => {
      // Check if attendance already exists for this student and date
      const existingAttendance = todayAttendance.find(a => a.studentId === studentId);
      if (!existingAttendance) {
        addAttendance({
          studentId,
          date: selectedDate,
          present,
          method: 'manual',
          timestamp: new Date().toISOString()
        });
      }
    });
    
    toast.success('উপস্থিতি সংরক্ষিত হয়েছে');
    setAttendanceData({});
  };

  const presentCount = Object.values({ ...attendanceMap, ...attendanceData }).filter(Boolean).length;
  const totalStudents = students.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">উপস্থিতি ব্যবস্থাপনা</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>রিপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট শিক্ষার্থী</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">উপস্থিত</p>
              <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">%</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">উপস্থিতির হার</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')} এর উপস্থিতি
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  শিক্ষার্থী
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রোল
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ক্লাস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  উপস্থিতি
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  মিল চার্জ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const isPresent = attendanceData[student.id] !== undefined 
                  ? attendanceData[student.id] 
                  : attendanceMap[student.id] || false;

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.roll}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.class} - {student.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            checked={isPresent}
                            onChange={() => handleAttendanceChange(student.id, true)}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-green-600">উপস্থিত</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            checked={!isPresent}
                            onChange={() => handleAttendanceChange(student.id, false)}
                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-red-600">অনুপস্থিত</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ৳{student.mealCharge}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={saveAttendance}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            উপস্থিতি সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManager;