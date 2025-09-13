import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Camera, Users, UserCheck, Scan, RefreshCw, CheckCircle, AlertCircle, Eye, Copy, Share2, Smartphone, Monitor } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const QRAttendance: React.FC = () => {
  const { students, addAttendance, attendance } = useData();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [scanMode, setScanMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAttendance = attendance.filter(a => a.date === today);
  const qrAttendanceToday = todayAttendance.filter(a => a.method === 'qr');

  // Auto-refresh QR codes every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh || Object.keys(qrCodes).length === 0) return;

    const interval = setInterval(() => {
      generateQRCodes();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, qrCodes]);

  // Simulate QR scan detection
  useEffect(() => {
    if (!scanMode) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of scan
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        simulateQRScan(randomStudent);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [scanMode, students]);

  const generateQRCodes = async () => {
    if (selectedStudents.length === 0) {
      toast.error('প্রথমে শিক্ষার্থী নির্বাচন করুন');
      return;
    }

    setIsGenerating(true);
    const codes: Record<string, string> = {};
    
    try {
      for (const studentId of selectedStudents) {
        const student = students.find(s => s.id === studentId);
        if (!student) continue;

        const qrData = JSON.stringify({
          type: 'attendance',
          studentId: student.id,
          name: student.name,
          roll: student.roll,
          class: student.class,
          section: student.section,
          timestamp: Date.now(),
          date: today,
          schoolId: 'SCHOOL_001',
          validUntil: Date.now() + (24 * 60 * 60 * 1000) // Valid for 24 hours
        });
        
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1e40af',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });
        codes[student.id] = qrCodeDataURL;
      }
      
      setQrCodes(codes);
      toast.success(`${selectedStudents.length} টি QR কোড তৈরি হয়েছে`);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('QR কোড তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCodesPDF = async () => {
    if (Object.keys(qrCodes).length === 0) {
      toast.error('প্রথমে QR কোড তৈরি করুন');
      return;
    }

    try {
      const pdf = new jsPDF();
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.height;

      // Add title
      pdf.setFontSize(18);
      pdf.text('Student QR Codes for Attendance', 20, yPosition);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${format(new Date(), 'dd MMMM yyyy, HH:mm')}`, 20, yPosition + 10);
      yPosition += 30;

      for (const [studentId, qrCodeDataURL] of Object.entries(qrCodes)) {
        const student = students.find(s => s.id === studentId);
        if (!student) continue;

        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 20;
        }

        // Add student info
        pdf.setFontSize(14);
        pdf.text(`Name: ${student.name}`, 20, yPosition);
        pdf.text(`Roll: ${student.roll}`, 20, yPosition + 10);
        pdf.text(`Class: ${student.class} - ${student.section}`, 20, yPosition + 20);

        // Add QR code
        try {
          pdf.addImage(qrCodeDataURL, 'PNG', 20, yPosition + 25, 60, 60);
        } catch (error) {
          console.error('Error adding QR code to PDF:', error);
        }

        // Add instructions
        pdf.setFontSize(10);
        pdf.text('Scan this QR code to mark attendance', 90, yPosition + 40);
        pdf.text(`Valid until: ${format(new Date(Date.now() + 24*60*60*1000), 'dd/MM/yyyy HH:mm')}`, 90, yPosition + 50);

        yPosition += 100;
      }

      pdf.save(`student-qr-codes-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF সফলভাবে ডাউনলোড হয়েছে');
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast.error('PDF তৈরি করতে সমস্যা হয়েছে');
    }
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
      toast.info('সব শিক্ষার্থী বাতিল করা হয়েছে');
    } else {
      setSelectedStudents(students.map(s => s.id));
      toast.success(`${students.length} জন শিক্ষার্থী নির্বাচিত হয়েছে`);
    }
  };

  const simulateQRScan = (student: any) => {
    const scanData = {
      id: Date.now(),
      student: student.name,
      roll: student.roll,
      time: format(new Date(), 'HH:mm:ss'),
      status: 'success'
    };

    setRecentScans(prev => [scanData, ...prev.slice(0, 9)]);
    
    // Add attendance
    addAttendance({
      studentId: student.id,
      date: today,
      present: true,
      method: 'qr',
      timestamp: new Date().toISOString()
    });

    toast.success(`✅ ${student.name} এর উপস্থিতি QR স্ক্যানের মাধ্যমে নিবন্ধিত হয়েছে`);
  };

  const markAttendanceByQR = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      
      // Validate QR data
      if (data.type !== 'attendance' || !data.studentId) {
        toast.error('অবৈধ QR কোড');
        return;
      }

      // Check if QR is still valid
      if (data.validUntil && Date.now() > data.validUntil) {
        toast.error('QR কোডের মেয়াদ শেষ হয়ে গেছে');
        return;
      }

      // Check if already marked today
      const alreadyMarked = todayAttendance.find(a => a.studentId === data.studentId);
      if (alreadyMarked) {
        toast.warning(`${data.name} এর আজকের উপস্থিতি ইতিমধ্যে নিবন্ধিত আছে`);
        return;
      }

      addAttendance({
        studentId: data.studentId,
        date: today,
        present: true,
        method: 'qr',
        timestamp: new Date().toISOString()
      });

      const scanData = {
        id: Date.now(),
        student: data.name,
        roll: data.roll,
        time: format(new Date(), 'HH:mm:ss'),
        status: 'success'
      };

      setRecentScans(prev => [scanData, ...prev.slice(0, 9)]);
      toast.success(`✅ ${data.name} এর উপস্থিতি সফলভাবে নিবন্ধিত হয়েছে`);
    } catch (error) {
      console.error('QR scan error:', error);
      toast.error('QR কোড স্ক্যান করতে সমস্যা হয়েছে');
    }
  };

  const copyQRData = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const qrData = JSON.stringify({
      type: 'attendance',
      studentId: student.id,
      name: student.name,
      roll: student.roll,
      timestamp: Date.now()
    });

    navigator.clipboard.writeText(qrData);
    toast.success('QR ডাটা কপি হয়েছে');
  };

  const shareQRCode = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !qrCodes[studentId]) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${student.name} এর উপস্থিতি QR কোড`,
          text: `${student.name} (রোল: ${student.roll}) এর উপস্থিতির জন্য QR কোড`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      copyQRData(studentId);
    }
  };

  const startDemoScan = () => {
    if (students.length === 0) {
      toast.error('কোন শিক্ষার্থী নেই');
      return;
    }

    const randomStudent = students[Math.floor(Math.random() * students.length)];
    setTimeout(() => {
      simulateQRScan(randomStudent);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-bengali">QR কোড উপস্থিতি</h1>
          <p className="text-sm text-gray-600 font-bengali mt-1">
            QR কোড স্ক্যান করে দ্রুত উপস্থিতি নিবন্ধন করুন
          </p>
        </div>
        <div className="flex space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-bengali">অটো রিফ্রেশ</span>
          </label>
          <button
            onClick={() => setScanMode(!scanMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              scanMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="font-bengali">{scanMode ? 'স্ক্যান বন্ধ' : 'QR স্ক্যান'}</span>
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
              <p className="text-sm font-medium text-gray-600 font-bengali">আজকের QR উপস্থিতি</p>
              <p className="text-2xl font-bold text-green-600">{qrAttendanceToday.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <QrCode className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">তৈরি QR কোড</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(qrCodes).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Scan className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">সাম্প্রতিক স্ক্যান</p>
              <p className="text-2xl font-bold text-orange-600">{recentScans.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Generation */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 font-bengali">QR কোড তৈরি করুন</h3>
            <div className="flex space-x-3">
              <button
                onClick={selectAllStudents}
                className="text-blue-600 hover:text-blue-700 font-medium font-bengali"
              >
                {selectedStudents.length === students.length ? 'সব বাতিল' : 'সব নির্বাচন'}
              </button>
              <button
                onClick={generateQRCodes}
                disabled={selectedStudents.length === 0 || isGenerating}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span className="font-bengali">{isGenerating ? 'তৈরি হচ্ছে...' : 'QR তৈরি'}</span>
              </button>
              <button
                onClick={downloadQRCodesPDF}
                disabled={Object.keys(qrCodes).length === 0}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="font-bengali">PDF ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* Student Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-64 overflow-y-auto">
            {students.map(student => {
              const isSelected = selectedStudents.includes(student.id);
              const hasAttendance = todayAttendance.find(a => a.studentId === student.id);
              
              return (
                <div 
                  key={student.id} 
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  } ${hasAttendance ? 'opacity-50' : ''}`}
                  onClick={() => !hasAttendance && handleStudentSelection(student.id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleStudentSelection(student.id)}
                    disabled={!!hasAttendance}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 font-bengali">{student.name}</p>
                    <p className="text-xs text-gray-500">রোল: {student.roll} | {student.class}-{student.section}</p>
                    {hasAttendance && (
                      <p className="text-xs text-green-600 font-bengali">✓ উপস্থিত</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Generated QR Codes */}
          {Object.keys(qrCodes).length > 0 && (
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4 font-bengali">
                তৈরি করা QR কোড ({Object.keys(qrCodes).length} টি)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(qrCodes).map(([studentId, qrCodeDataURL]) => {
                  const student = students.find(s => s.id === studentId);
                  return (
                    <div key={studentId} className="text-center p-4 border rounded-lg bg-gray-50">
                      <img 
                        src={qrCodeDataURL} 
                        alt={`QR Code for ${student?.name}`} 
                        className="mx-auto mb-3 border-2 border-gray-200 rounded-lg" 
                      />
                      <p className="text-sm font-medium font-bengali">{student?.name}</p>
                      <p className="text-xs text-gray-500">রোল: {student?.roll}</p>
                      <p className="text-xs text-gray-500">{student?.class}-{student?.section}</p>
                      
                      <div className="flex justify-center space-x-2 mt-3">
                        <button
                          onClick={() => copyQRData(studentId)}
                          className="p-1 text-gray-600 hover:text-blue-600 rounded"
                          title="QR ডাটা কপি করুন"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => shareQRCode(studentId)}
                          className="p-1 text-gray-600 hover:text-green-600 rounded"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* QR Scanner */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">QR কোড স্ক্যানার</h3>
          
          <div className="text-center">
            <div className={`w-full h-48 rounded-lg mx-auto flex items-center justify-center mb-4 border-2 border-dashed transition-colors ${
              scanMode ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
            }`}>
              {scanMode ? (
                <div className="text-center">
                  <Scan className="w-12 h-12 text-green-600 mx-auto mb-2 animate-pulse" />
                  <p className="text-green-600 font-bengali">স্ক্যান করার জন্য প্রস্তুত</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-bengali">ক্যামেরা বন্ধ</p>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {scanMode ? (
                <div>
                  <button
                    onClick={() => setScanMode(false)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-bengali"
                  >
                    স্ক্যান বন্ধ করুন
                  </button>
                  <button
                    onClick={startDemoScan}
                    className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bengali"
                  >
                    ডেমো স্ক্যান
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setScanMode(true)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-bengali"
                >
                  স্ক্যান শুরু করুন
                </button>
              )}
              
              <p className="text-sm text-gray-600 font-bengali">
                {scanMode ? 'QR কোড ক্যামেরার সামনে ধরুন' : 'স্ক্যান করার জন্য ক্যামেরা চালু করুন'}
              </p>
            </div>
          </div>

          {/* Recent Scans */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3 font-bengali">সাম্প্রতিক স্ক্যান</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recentScans.length > 0 ? recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 font-bengali">{scan.student}</p>
                      <p className="text-xs text-gray-500">{scan.time}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-bengali">সফল</span>
                </div>
              )) : (
                <div className="text-center py-4">
                  <Monitor className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-bengali">কোন স্ক্যান নেই</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 font-bengali">ব্যবহারের নির্দেশনা</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 font-bengali mb-2">QR কোড তৈরি:</h4>
            <ol className="text-sm text-blue-600 space-y-1 font-bengali">
              <li>১. শিক্ষার্থী নির্বাচন করুন</li>
              <li>২. "QR তৈরি" বাটনে ক্লিক করুন</li>
              <li>৩. PDF ডাউনলোড করুন</li>
              <li>৪. প্রিন্ট করে বিতরণ করুন</li>
            </ol>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 font-bengali mb-2">উপস্থিতি নিবন্ধন:</h4>
            <ol className="text-sm text-blue-600 space-y-1 font-bengali">
              <li>১. "QR স্ক্যান" চালু করুন</li>
              <li>২. QR কোড ক্যামেরার সামনে ধরুন</li>
              <li>৩. স্বয়ংক্রিয় উপস্থিতি নিবন্ধন</li>
              <li>৪. নিশ্চিতকরণ বার্তা দেখুন</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRAttendance;