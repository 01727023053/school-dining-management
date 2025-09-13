import React, { useState } from 'react';
import { X, Wifi, MapPin, Monitor, Hash, Users, Settings } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface BiometricDeviceFormProps {
  onClose: () => void;
  onSave: () => void;
}

const BiometricDeviceForm: React.FC<BiometricDeviceFormProps> = ({ onClose, onSave }) => {
  const { addBiometricDevice } = useData();
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: 4370,
    model: '',
    location: '',
    maxUsers: 1000,
    serialNumber: '',
    firmwareVersion: ''
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const deviceModels = [
    'ZKTeco K50-A',
    'ZKTeco F18',
    'ZKTeco K40',
    'ZKTeco F22',
    'ZKTeco U160',
    'ZKTeco MA300',
    'ZKTeco SpeedFace-V5L',
    'Hikvision DS-K1T201',
    'Suprema BioEntry W2',
    'অন্যান্য'
  ];

  const commonLocations = [
    'প্রধান গেট',
    'ডাইনিং হল',
    'অফিস রুম',
    'ক্লাসরুম',
    'লাইব্রেরি',
    'ল্যাবরেটরি',
    'শিক্ষক কক্ষ',
    'অন্যান্য'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ip || !formData.location) {
      toast.error('সব প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(formData.ip)) {
      toast.error('সঠিক IP ঠিকানা লিখুন (যেমন: 192.168.1.100)');
      return;
    }

    if (formData.port < 1 || formData.port > 65535) {
      toast.error('পোর্ট নম্বর ১ থেকে ৬৫৫৩৫ এর মধ্যে হতে হবে');
      return;
    }

    addBiometricDevice({
      name: formData.name,
      ip: formData.ip,
      port: formData.port,
      model: formData.model || undefined,
      location: formData.location,
      maxUsers: formData.maxUsers,
      serialNumber: formData.serialNumber || undefined,
      firmwareVersion: formData.firmwareVersion || undefined
    });
    
    toast.success(`"${formData.name}" ডিভাইস সফলভাবে যোগ করা হয়েছে`);
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'port' || name === 'maxUsers' ? Number(value) : value
    }));
  };

  const testConnection = async () => {
    if (!formData.ip || !formData.port) {
      toast.error('IP ঠিকানা এবং পোর্ট নম্বর লিখুন');
      return;
    }

    setIsTestingConnection(true);
    
    // Simulate connection test
    setTimeout(() => {
      const isConnected = Math.random() > 0.3; // 70% success rate for demo
      
      if (isConnected) {
        toast.success(`✅ ${formData.ip}:${formData.port} এ সফলভাবে সংযোগ স্থাপিত হয়েছে`);
      } else {
        toast.error(`❌ ${formData.ip}:${formData.port} এ সংযোগ স্থাপন করতে ব্যর্থ। ডিভাইস চালু আছে কিনা এবং নেটওয়ার্ক সেটিংস ঠিক আছে কিনা পরীক্ষা করুন।`);
      }
      
      setIsTestingConnection(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                নতুন বায়োমেট্রিক ডিভাইস যোগ করুন
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 font-bengali mb-3 flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  মৌলিক তথ্য
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      ডিভাইসের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="যেমন: Main Gate Scanner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      অবস্থান <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">নির্বাচন করুন</option>
                      {commonLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      ডিভাইস মডেল
                    </label>
                    <select
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">নির্বাচন করুন</option>
                      {deviceModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      সর্বোচ্চ ব্যবহারকারী
                    </label>
                    <input
                      type="number"
                      name="maxUsers"
                      value={formData.maxUsers}
                      onChange={handleChange}
                      min="100"
                      max="10000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Network Configuration */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 font-bengali mb-3 flex items-center">
                  <Wifi className="w-5 h-5 mr-2" />
                  নেটওয়ার্ক কনফিগারেশন
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      IP ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ip"
                      value={formData.ip}
                      onChange={handleChange}
                      required
                      pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="192.168.1.100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      পোর্ট নম্বর
                    </label>
                    <input
                      type="number"
                      name="port"
                      value={formData.port}
                      onChange={handleChange}
                      min="1"
                      max="65535"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={testConnection}
                    disabled={isTestingConnection || !formData.ip}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wifi className={`w-4 h-4 ${isTestingConnection ? 'animate-pulse' : ''}`} />
                    <span className="font-bengali">
                      {isTestingConnection ? 'সংযোগ পরীক্ষা করা হচ্ছে...' : 'সংযোগ পরীক্ষা করুন'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Device Details */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 font-bengali mb-3 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  ডিভাইসের বিস্তারিত (ঐচ্ছিক)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      সিরিয়াল নম্বর
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="যেমন: ZKT001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
                      ফার্মওয়্যার ভার্সন
                    </label>
                    <input
                      type="text"
                      name="firmwareVersion"
                      value={formData.firmwareVersion}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="যেমন: 6.60.1.85"
                    />
                  </div>
                </div>
              </div>

              {/* Connection Preview */}
              {formData.ip && formData.port && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 font-bengali mb-2">সংযোগের তথ্য</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📍 <strong>অবস্থান:</strong> {formData.location || 'নির্ধারিত নয়'}</div>
                    <div>🌐 <strong>নেটওয়ার্ক:</strong> {formData.ip}:{formData.port}</div>
                    <div>👥 <strong>ক্ষমতা:</strong> {formData.maxUsers} ব্যবহারকারী</div>
                    {formData.model && <div>📱 <strong>মডেল:</strong> {formData.model}</div>}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 font-bengali transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 font-bengali transition-colors"
                >
                  ডিভাইস যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricDeviceForm;