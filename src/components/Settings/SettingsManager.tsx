import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Palette, Globe, Save, RefreshCw, Download, Upload, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SettingsManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      schoolName: 'স্কুল ডাইনিং ম্যানেজমেন্ট সিস্টেম',
      address: 'ঢাকা, বাংলাদেশ',
      phone: '০১৭১২৩৪৫৬৭৮',
      email: 'admin@school.com',
      currency: 'BDT',
      timezone: 'Asia/Dhaka',
      language: 'bn'
    },
    notifications: {
      lowBalanceAlert: true,
      paymentNotification: true,
      attendanceReminder: true,
      expenseAlert: true,
      emailNotifications: false,
      smsNotifications: true,
      pushNotifications: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      requirePasswordChange: false
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      fontSize: 'medium',
      compactMode: false,
      showAnimations: true
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: 365,
      debugMode: false,
      maintenanceMode: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'general', label: 'সাধারণ', icon: Settings },
    { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { id: 'security', label: 'নিরাপত্তা', icon: Shield },
    { id: 'appearance', label: 'চেহারা', icon: Palette },
    { id: 'system', label: 'সিস্টেম', icon: Database }
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    localStorage.setItem('schoolSettings', JSON.stringify(settings));
    toast.success('সেটিংস সংরক্ষিত হয়েছে');
  };

  const resetSettings = () => {
    if (confirm('আপনি কি নিশ্চিত যে সব সেটিংস রিসেট করতে চান?')) {
      localStorage.removeItem('schoolSettings');
      toast.success('সেটিংস রিসেট হয়েছে');
      window.location.reload();
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'school-settings.json';
    link.click();
    toast.success('সেটিংস এক্সপোর্ট হয়েছে');
  };

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('পাসওয়ার্ড মিলছে না');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }
    // In a real app, this would call an API
    toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে');
    setNewPassword('');
    setConfirmPassword('');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            স্কুলের নাম
          </label>
          <input
            type="text"
            value={settings.general.schoolName}
            onChange={(e) => handleSettingChange('general', 'schoolName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            ইমেইল
          </label>
          <input
            type="email"
            value={settings.general.email}
            onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            ফোন নম্বর
          </label>
          <input
            type="tel"
            value={settings.general.phone}
            onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            মুদ্রা
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="BDT">বাংলাদেশী টাকা (৳)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
          ঠিকানা
        </label>
        <textarea
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 font-bengali mb-2">নোটিফিকেশন সেটিংস</h4>
        <p className="text-sm text-blue-600 font-bengali">
          আপনি কোন ধরনের নোটিফিকেশন পেতে চান তা নির্বাচন করুন
        </p>
      </div>

      <div className="space-y-4">
        {[
          { key: 'lowBalanceAlert', label: 'কম ব্যালেন্স সতর্কতা', desc: 'শিক্ষার্থীর ব্যালেন্স কম হলে সতর্কতা' },
          { key: 'paymentNotification', label: 'পেমেন্ট নোটিফিকেশন', desc: 'নতুন পেমেন্ট এলে জানান' },
          { key: 'attendanceReminder', label: 'উপস্থিতি রিমাইন্ডার', desc: 'উপস্থিতি নিতে ভুলে গেলে রিমাইন্ডার' },
          { key: 'expenseAlert', label: 'খরচ সতর্কতা', desc: 'বেশি খরচ হলে সতর্কতা' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900 font-bengali">{item.label}</h5>
              <p className="text-sm text-gray-600 font-bengali">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 font-bengali mb-4">নোটিফিকেশনের মাধ্যম</h4>
        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'ইমেইল নোটিফিকেশন' },
            { key: 'smsNotifications', label: 'SMS নোটিফিকেশন' },
            { key: 'pushNotifications', label: 'পুশ নোটিফিকেশন' }
          ].map(item => (
            <label key={item.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700 font-bengali">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-800 font-bengali mb-2">নিরাপত্তা সেটিংস</h4>
        <p className="text-sm text-red-600 font-bengali">
          আপনার অ্যাকাউন্টের নিরাপত্তা বাড়ানোর জন্য এই সেটিংস ব্যবহার করুন
        </p>
      </div>

      {/* Password Change */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 font-bengali mb-4">পাসওয়ার্ড পরিবর্তন</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
              নতুন পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="নতুন পাসওয়ার্ড লিখুন"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="পাসওয়ার্ড আবার লিখুন"
            />
          </div>

          <button
            onClick={changePassword}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bengali"
          >
            পাসওয়ার্ড পরিবর্তন করুন
          </button>
        </div>
      </div>

      {/* Security Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900 font-bengali">টু-ফ্যাক্টর অথেনটিকেশন</h5>
            <p className="text-sm text-gray-600 font-bengali">অতিরিক্ত নিরাপত্তার জন্য সক্রিয় করুন</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
              সেশন টাইমআউট (মিনিট)
            </label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
              লগইন চেষ্টার সীমা
            </label>
            <input
              type="number"
              value={settings.security.loginAttempts}
              onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-800 font-bengali mb-2">চেহারা ও থিম</h4>
        <p className="text-sm text-purple-600 font-bengali">
          আপনার পছন্দ অনুযায়ী সিস্টেমের চেহারা কাস্টমাইজ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            থিম
          </label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">হালকা</option>
            <option value="dark">গাঢ়</option>
            <option value="auto">অটো</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            ফন্ট সাইজ
          </label>
          <select
            value={settings.appearance.fontSize}
            onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">ছোট</option>
            <option value="medium">মাঝারি</option>
            <option value="large">বড়</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
            প্রাইমারি রঙ
          </label>
          <input
            type="color"
            value={settings.appearance.primaryColor}
            onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'compactMode', label: 'কমপ্যাক্ট মোড', desc: 'কম জায়গায় বেশি তথ্য দেখান' },
          { key: 'showAnimations', label: 'অ্যানিমেশন দেখান', desc: 'ইন্টারফেসে অ্যানিমেশন সক্রিয় করুন' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900 font-bengali">{item.label}</h5>
              <p className="text-sm text-gray-600 font-bengali">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance[item.key as keyof typeof settings.appearance] as boolean}
                onChange={(e) => handleSettingChange('appearance', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 font-bengali mb-2">সিস্টেম সেটিংস</h4>
        <p className="text-sm text-green-600 font-bengali">
          সিস্টেমের কর্মক্ষমতা ও ডাটা ব্যাকআপ সেটিংস
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900 font-bengali">অটো ব্যাকআপ</h5>
            <p className="text-sm text-gray-600 font-bengali">নিয়মিত ডাটা ব্যাকআপ নিন</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.system.autoBackup}
              onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
              ব্যাকআপের ফ্রিকোয়েন্সি
            </label>
            <select
              value={settings.system.backupFrequency}
              onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hourly">প্রতি ঘন্টায়</option>
              <option value="daily">প্রতিদিন</option>
              <option value="weekly">সাপ্তাহিক</option>
              <option value="monthly">মাসিক</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">
              ডাটা রিটেনশন (দিন)
            </label>
            <input
              type="number"
              value={settings.system.dataRetention}
              onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div>
            <h5 className="font-medium text-yellow-800 font-bengali">মেইনটেনেন্স মোড</h5>
            <p className="text-sm text-yellow-600 font-bengali">সিস্টেম আপডেটের জন্য সাময়িক বন্ধ</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
          </label>
        </div>
      </div>

      {/* System Actions */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 font-bengali mb-4">সিস্টেম অ্যাকশন</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportSettings}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="font-bengali">সেটিংস এক্সপোর্ট</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="font-bengali">ব্যাকআপ রিস্টোর</span>
          </button>

          <button
            onClick={resetSettings}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="font-bengali">রিসেট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">সেটিংস</h1>
        <div className="flex space-x-3">
          <button
            onClick={saveSettings}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="font-bengali">সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 font-bengali">{user?.name}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="text-sm text-blue-600 font-bengali capitalize">{user?.role} অ্যাকাউন্ট</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-bengali">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;