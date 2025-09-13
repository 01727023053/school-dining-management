import React, { useState, useEffect } from 'react';
import { Fingerprint, Users, UserCheck, Wifi, WifiOff, Settings, Download, RefreshCw, Plus, Edit, Trash2, Monitor, MapPin } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import BiometricDeviceForm from './BiometricDeviceForm';
import toast from 'react-hot-toast';

interface BiometricScan {
  deviceId: string;
  fingerprintId: string;
  timestamp: string;
  quality: number;
}

const BiometricAttendance: React.FC = () => {
  const { students, addAttendance, attendance, biometricDevices, updateBiometricDevice, deleteBiometricDevice } = useData();
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<BiometricScan[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [showDeviceForm, setShowDeviceForm] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.present).length;

  // Set default selected device
  useEffect(() => {
    if (biometricDevices.length > 0 && !selectedDevice) {
      const connectedDevice = biometricDevices.find(d => d.status === 'connected');
      setSelectedDevice(connectedDevice?.id || biometricDevices[0].id);
    }
  }, [biometricDevices, selectedDevice]);

  // Simulate biometric device connection status updates
  useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(() => {
      biometricDevices.forEach(device => {
        if (device.isActive) {
          // Simulate random status changes (mostly stay connected)
          const randomStatus = Math.random();
          let newStatus: 'connected' | 'disconnected' | 'scanning' | 'error' = device.status;
          
          if (device.status === 'scanning') {
            // Don't change status while scanning
            return;
          }
          
          if (randomStatus > 0.95) {
            newStatus = 'disconnected';
          } else if (randomStatus > 0.9) {
            newStatus = 'error';
          } else {
            newStatus = 'connected';
          }

          if (newStatus !== device.status) {
            updateBiometricDevice(device.id, {
              status: newStatus,
              lastSync: new Date().toISOString()
            });
          }
        }
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [autoSync, biometricDevices, updateBiometricDevice]);

  // Simulate fingerprint scanning
  const startScanning = () => {
    const device = biometricDevices.find(d => d.id === selectedDevice);
    if (!device || device.status !== 'connected') {
      toast.error('ডিভাইস সংযুক্ত নেই বা নির্বাচিত নেই');
      return;
    }

    setIsScanning(true);
    updateBiometricDevice(selectedDevice, { status: 'scanning' });

    // Simulate scan after 3 seconds
    setTimeout(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const scan: BiometricScan = {
        deviceId: selectedDevice,
        fingerprintId: `FP_${randomStudent.id}`,
        timestamp: new Date().toISOString(),
        quality: Math.floor(Math.random() * 40) + 60 // 60-100% quality
      };

      setRecentScans(prev => [scan, ...prev.slice(0, 9)]);
      
      // Add attendance record
      addAttendance({
        studentId: randomStudent.id,
        date: today,
        present: true,
        method: 'biometric',
        timestamp: scan.timestamp
      });

      toast.success(`${randomStudent.name} এর উপস্থিতি নিবন্ধিত হয়েছে`);
      
      setIsScanning(false);
      updateBiometricDevice(selectedDevice, { status: 'connected' });
    }, 3000);
  };

  const stopScanning = () => {
    setIsScanning(false);
    updateBiometricDevice(selectedDevice, { status: 'connected' });
  };

  const syncDevice = (deviceId: string) => {
    updateBiometricDevice(deviceId, { 
      lastSync: new Date().toISOString(),
      status: 'connected'
    });
    toast.success('ডিভাইস সিঙ্ক সম্পন্ন হয়েছে');
  };

  const deleteDevice = (deviceId: string) => {
    const device = biometricDevices.find(d => d.id === deviceId);
    if (confirm(`আপনি কি নিশ্চিত যে "${device?.name}" ডিভাইসটি মুছে ফেলতে চান?`)) {
      deleteBiometricDevice(deviceId);
      if (selectedDevice === deviceId) {
        setSelectedDevice('');
      }
      toast.success('ডিভাইস মুছে ফেলা হয়েছে');
    }
  };

  const getStudentByFingerprint = (fingerprintId: string) => {
    const studentId = fingerprintId.replace('FP_', '');
    return students.find(s => s.id === studentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-500 bg-green-100';
      case 'scanning':
        return 'text-yellow-500 bg-yellow-100';
      case 'disconnected':
        return 'text-red-500 bg-red-100';
      case 'error':
        return 'text-orange-500 bg-orange-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'সংযুক্ত';
      case 'scanning':
        return 'স্ক্যান করছে';
      case 'disconnected':
        return 'বিচ্ছিন্ন';
      case 'error':
        return 'ত্রুটি';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">বায়োমেট্রিক হাজিরা</h1>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-bengali">অটো সিঙ্ক</span>
          </label>
          <button
            onClick={() => setShowDeviceForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bengali">নতুন ডিভাইস</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="font-bengali">রিপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট শিক্ষার্থী</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের উপস্থিতি</p>
              <p className="text-2xl font-bold text-gray-900">{presentToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Fingerprint className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের স্ক্যান</p>
              <p className="text-2xl font-bold text-gray-900">{recentScans.filter(s => s.timestamp.startsWith(today)).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Monitor className="w-8 h-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">সক্রিয় ডিভাইস</p>
              <p className="text-2xl font-bold text-gray-900">
                {biometricDevices.filter(d => d.status === 'connected').length}/{biometricDevices.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-bengali">বায়োমেট্রিক ডিভাইস</h3>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 font-bengali">
                {biometricDevices.length} টি ডিভাইস
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {biometricDevices.length > 0 ? biometricDevices.map(device => (
              <div key={device.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'connected' ? 'bg-green-500' : 
                      device.status === 'scanning' ? 'bg-yellow-500 animate-pulse' : 
                      device.status === 'error' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 font-bengali">{device.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)} font-bengali`}>
                          {getStatusText(device.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>🌐 {device.ip}:{device.port}</span>
                          {device.location && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {device.location}
                            </span>
                          )}
                        </div>
                        {device.model && <div>📱 {device.model}</div>}
                        {device.currentUsers !== undefined && device.maxUsers && (
                          <div>👥 {device.currentUsers}/{device.maxUsers} ব্যবহারকারী</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {device.status === 'connected' ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <button
                      onClick={() => syncDevice(device.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                      title="সিঙ্ক করুন"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDevice(device.id)}
                      className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  শেষ সিঙ্ক: {format(new Date(device.lastSync), 'HH:mm:ss')}
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bengali mb-4">কোন বায়োমেট্রিক ডিভাইস যোগ করা হয়নি</p>
                <button
                  onClick={() => setShowDeviceForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bengali"
                >
                  প্রথম ডিভাইস যোগ করুন
                </button>
              </div>
            )}
          </div>

          {biometricDevices.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                স্ক্যানিং ডিভাইস নির্বাচন করুন
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">নির্বাচন করুন</option>
                {biometricDevices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({getStatusText(device.status)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Scanning Interface */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">ফিঙ্গারপ্রিন্ট স্ক্যান</h3>
          
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isScanning ? 'bg-yellow-100 animate-pulse' : 'bg-gray-100'
            }`}>
              <Fingerprint className={`w-16 h-16 ${
                isScanning ? 'text-yellow-600' : 'text-gray-400'
              }`} />
            </div>
            
            <div className="space-y-3">
              {!isScanning ? (
                <button
                  onClick={startScanning}
                  disabled={!selectedDevice || !biometricDevices.find(d => d.id === selectedDevice)?.status || biometricDevices.find(d => d.id === selectedDevice)?.status !== 'connected'}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bengali"
                >
                  স্ক্যান শুরু করুন
                </button>
              ) : (
                <button
                  onClick={stopScanning}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-bengali"
                >
                  স্ক্যান বন্ধ করুন
                </button>
              )}
              
              <p className="text-sm text-gray-600 font-bengali">
                {isScanning ? 'আঙুল স্ক্যান করা হচ্ছে...' : 
                 selectedDevice ? 'স্ক্যান করার জন্য বোতাম চাপুন' : 
                 'প্রথমে একটি ডিভাইস নির্বাচন করুন'}
              </p>
              
              {selectedDevice && (
                <div className="text-xs text-gray-500 mt-2">
                  নির্বাচিত: {biometricDevices.find(d => d.id === selectedDevice)?.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 font-bengali">সাম্প্রতিক স্ক্যান</h3>
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
                  ডিভাইস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  গুণমান
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  স্ট্যাটাস
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentScans.length > 0 ? recentScans.map((scan, index) => {
                const student = getStudentByFingerprint(scan.fingerprintId);
                const device = biometricDevices.find(d => d.id === scan.deviceId);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(scan.timestamp), 'HH:mm:ss')}
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
                            {student?.name || 'অজানা'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student?.roll || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bengali">
                      {device?.name || 'অজানা ডিভাইস'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              scan.quality >= 80 ? 'bg-green-500' : 
                              scan.quality >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${scan.quality}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{scan.quality}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 font-bengali">
                        সফল
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    কোন স্ক্যান রেকর্ড নেই
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Form Modal */}
      {showDeviceForm && (
        <BiometricDeviceForm
          onClose={() => setShowDeviceForm(false)}
          onSave={() => setShowDeviceForm(false)}
        />
      )}
    </div>
  );
};

export default BiometricAttendance;