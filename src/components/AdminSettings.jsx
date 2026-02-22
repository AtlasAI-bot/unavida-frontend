import React, { useState } from 'react';
import { Settings, Key, Bell, Database, Save, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [settings, setSettings] = useState({
    stripeMode: 'test',
    stripePubKey: 'pk_test_123456789',
    stripeSecKey: '****skipped****',
    pricing: {
      pharmacology1: 49.99,
      advanced: 49.99,
      premiumQuiz: 9.99
    },
    notifications: {
      emailNewEnrollment: true,
      emailPrintOrder: true,
      emailPaymentIssues: true,
      emailWeeklyReport: false
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings size={24} className="text-gray-700" />
            System Settings
          </h2>
          {unsavedChanges && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex gap-2 border-b border-gray-300">
        {[
          { id: 'payment', label: 'Payment Settings', icon: '💳' },
          { id: 'pricing', label: 'Pricing', icon: '💰' },
          { id: 'notifications', label: 'Notifications', icon: '🔔' },
          { id: 'logs', label: 'System Logs', icon: '📋' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Payment Settings Tab */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Stripe Configuration</h3>

            {/* Warning Banner */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-yellow-800">Currently in Test Mode</p>
                  <p className="text-sm text-yellow-700 mt-1">Test transactions will not process real payments. Switch to Live Mode only when ready for production.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stripe Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stripe Mode</label>
                <div className="flex gap-4">
                  {['test', 'live'].map(mode => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stripeMode"
                        value={mode}
                        checked={settings.stripeMode === mode}
                        onChange={(e) => {
                          setSettings(prev => ({ ...prev, stripeMode: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">{mode} Mode</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Publishable Key */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Key size={16} className="inline mr-2" />
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={settings.stripePubKey}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, stripePubKey: e.target.value }));
                    setUnsavedChanges(true);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 font-mono text-sm"
                />
              </div>

              {/* Secret Key */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Key size={16} className="inline mr-2" />
                  Secret Key
                </label>
                <input
                  type="password"
                  value={settings.stripeSecKey}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Secret keys are hidden for security</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">API Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                <p className="text-sm text-gray-700">Stripe API Connection</p>
                <span className="text-xs font-bold text-green-600">✓ Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                <p className="text-sm text-gray-700">Webhook Endpoint</p>
                <span className="text-xs font-bold text-green-600">✓ Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Course Pricing</h3>

          <div className="space-y-4">
            {[
              { key: 'pharmacology1', label: 'Pharmacology I (NUR1100)', hint: 'Standalone course price' },
              { key: 'advanced', label: 'Advanced Pharmacology (NUR2110)', hint: 'Standalone course price' },
              { key: 'premiumQuiz', label: 'Premium Quiz Bundle', hint: 'Add-on pricing' }
            ].map(item => (
              <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{item.label}</label>
                <p className="text-xs text-gray-500 mb-3">{item.hint}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-700">$</span>
                  <input
                    type="number"
                    value={settings.pricing[item.key]}
                    onChange={(e) => handleSettingChange('pricing', item.key, parseFloat(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200 bg-blue-50 p-4 rounded">
            <p className="text-sm font-semibold text-blue-900">💡 Pricing Tips</p>
            <ul className="text-xs text-blue-800 mt-2 space-y-1">
              <li>• Standalone courses typically range from $29.99 - $79.99</li>
              <li>• Bundle discounts can increase enrollment conversion by 15-25%</li>
              <li>• Consider regional market rates and competitor pricing</li>
            </ul>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Email Notification Settings</h3>

          <div className="space-y-4">
            {[
              { key: 'emailNewEnrollment', label: 'New Student Enrollment', description: 'Send alert when student enrolls in a course' },
              { key: 'emailPrintOrder', label: 'Print Order Updates', description: 'Notify about new print-on-demand orders' },
              { key: 'emailPaymentIssues', label: 'Payment Issues', description: 'Alert on failed payments or overdue accounts' },
              { key: 'emailWeeklyReport', label: 'Weekly Summary Report', description: 'Send weekly digest of platform metrics' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 cursor-pointer">{item.label}</label>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={() => handleToggle(item.key)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-all ${
                      settings.notifications[item.key] ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${
                      settings.notifications[item.key] ? 'translate-x-4' : ''
                    }`}></div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200 bg-blue-50 p-4 rounded">
            <p className="text-sm font-semibold text-blue-900">📧 Email Configuration</p>
            <p className="text-xs text-blue-800 mt-2">Emails are sent to: admin@unavida.education</p>
            <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2">Change email address →</button>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database size={20} className="text-gray-700" />
            System Logs
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[
              { time: '2024-02-19 14:32', action: 'Student enrolled', user: 'Sarah Johnson', status: 'success' },
              { time: '2024-02-19 14:28', action: 'Payment processed', user: 'System', status: 'success' },
              { time: '2024-02-19 14:15', action: 'Print order created', user: 'Michael Chen', status: 'success' },
              { time: '2024-02-19 14:12', action: 'Course content updated', user: 'Admin', status: 'success' },
              { time: '2024-02-19 14:05', action: 'Login attempt failed', user: 'Unknown', status: 'error' },
              { time: '2024-02-19 14:00', action: 'Weekly report generated', user: 'System', status: 'success' },
              { time: '2024-02-19 13:45', action: 'Student completed chapter', user: 'Emma Davis', status: 'success' },
              { time: '2024-02-19 13:30', action: 'Admin settings updated', user: 'Admin', status: 'success' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-all">
                <p className="text-xs text-gray-500 font-mono w-24 flex-shrink-0">{log.time}</p>
                <p className="text-sm text-gray-700 flex-1">{log.action}</p>
                <p className="text-xs text-gray-500">{log.user}</p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  log.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-all">
              Clear Old Logs
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-all">
              Export Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
