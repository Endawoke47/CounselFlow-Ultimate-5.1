import React, { useState } from 'react'
import { User, Bell, Shield, Database, Palette, Globe, Save, Mail, Phone, MapPin, Building, Key, Eye, EyeOff, Monitor, Moon, Sun, Smartphone, Calendar, Clock, FileText, AlertTriangle, CheckCircle, Download, Upload, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface NotificationSettings {
  email: boolean
  push: boolean
  matters: boolean
  contracts: boolean
  deadlines: boolean
  disputes: boolean
  documents: boolean
  clients: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  passwordExpiryDays: number
  sessionTimeout: number
  loginAlerts: boolean
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  barNumber: string
  jurisdiction: string
  firm: string
  title: string
  address: string
  avatar?: string
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@lawfirm.com',
    phone: '+1 (555) 123-4567',
    barNumber: 'BAR123456',
    jurisdiction: 'California',
    firm: 'Smith & Associates',
    title: 'Senior Partner',
    address: '123 Legal Street, San Francisco, CA 94105'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    matters: true,
    contracts: true,
    deadlines: true,
    disputes: false,
    documents: true,
    clients: false
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordExpiryDays: 90,
    sessionTimeout: 60,
    loginAlerts: true
  })

  const [appearance, setAppearance] = useState({
    theme: 'light',
    accentColor: 'teal',
    compactMode: false,
    showAvatars: true
  })

  const [system, setSystem] = useState({
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    autoSave: true,
    backupFrequency: 'daily'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal and professional information' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage your notification preferences' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Account security and authentication' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize the look and feel' },
    { id: 'system', label: 'System', icon: Globe, description: 'System preferences and settings' },
    { id: 'data', label: 'Data & Privacy', icon: Database, description: 'Data management and privacy controls' }
  ]

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: keyof SecuritySettings, value: boolean | number) => {
    setSecurity(prev => ({ ...prev, [field]: value }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-teal-200 hover:bg-teal-50">
                  <Upload className="h-4 w-4 text-teal-600" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-teal-900">{profile.firstName} {profile.lastName}</h3>
                <p className="text-teal-600">{profile.title} at {profile.firm}</p>
                <p className="text-sm text-teal-500">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">First Name</label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Last Name</label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Phone</label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Bar Number</label>
                <Input
                  value={profile.barNumber}
                  onChange={(e) => handleProfileChange('barNumber', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Jurisdiction</label>
                <Input
                  value={profile.jurisdiction}
                  onChange={(e) => handleProfileChange('jurisdiction', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Law Firm</label>
                <Input
                  value={profile.firm}
                  onChange={(e) => handleProfileChange('firm', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Title</label>
                <Input
                  value={profile.title}
                  onChange={(e) => handleProfileChange('title', e.target.value)}
                  className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Address</label>
              <Input
                value={profile.address}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
              />
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="font-medium text-teal-900">Notification Preferences</h3>
                  <p className="text-sm text-teal-600">Choose how you want to be notified about important updates</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Delivery Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-teal-500" />
                    <div>
                      <p className="font-medium text-teal-900">Email Notifications</p>
                      <p className="text-sm text-teal-600">Receive notifications via email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-teal-500" />
                    <div>
                      <p className="font-medium text-teal-900">Push Notifications</p>
                      <p className="text-sm text-teal-600">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Content Notifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries({
                  matters: 'Matter Updates',
                  contracts: 'Contract Changes',
                  deadlines: 'Upcoming Deadlines',
                  disputes: 'Dispute Activities',
                  documents: 'Document Changes',
                  clients: 'Client Communications'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-white border border-teal-200 rounded-xl">
                    <span className="text-teal-900">{label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof NotificationSettings]}
                      onChange={(e) => handleNotificationChange(key as keyof NotificationSettings, e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="font-medium text-teal-900">Security Settings</h3>
                  <p className="text-sm text-teal-600">Manage your account security and authentication preferences</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Password & Authentication</h4>
              <div className="space-y-3">
                <div className="p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-teal-900">Password</p>
                      <p className="text-sm text-teal-600">Last changed 30 days ago</p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setShowPasswordModal(true)}
                      className="border-teal-200 text-teal-700 hover:bg-teal-50"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>

                <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-teal-500" />
                    <div>
                      <p className="font-medium text-teal-900">Two-Factor Authentication</p>
                      <p className="text-sm text-teal-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.twoFactorEnabled}
                    onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-teal-500" />
                    <div>
                      <p className="font-medium text-teal-900">Login Alerts</p>
                      <p className="text-sm text-teal-600">Get notified of new sign-ins to your account</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={security.loginAlerts}
                    onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Session Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-2">Session Timeout (minutes)</label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={480}>8 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-600 mb-2">Password Expiry (days)</label>
                  <select
                    value={security.passwordExpiryDays}
                    onChange={(e) => handleSecurityChange('passwordExpiryDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="font-medium text-teal-900">Appearance Settings</h3>
                  <p className="text-sm text-teal-600">Customize the look and feel of your workspace</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'auto', label: 'Auto', icon: Monitor }
                ].map((theme) => (
                  <label
                    key={theme.id}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      appearance.theme === theme.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-teal-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <theme.icon className="h-8 w-8 text-teal-600 mb-2" />
                    <span className="text-sm font-medium text-teal-900">{theme.label}</span>
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={appearance.theme === theme.id}
                      onChange={(e) => setAppearance(prev => ({ ...prev, theme: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Accent Color</h4>
              <div className="grid grid-cols-6 gap-3">
                {[
                  { id: 'teal', color: 'bg-teal-500' },
                  { id: 'blue', color: 'bg-blue-500' },
                  { id: 'green', color: 'bg-green-500' },
                  { id: 'purple', color: 'bg-purple-500' },
                  { id: 'pink', color: 'bg-pink-500' },
                  { id: 'orange', color: 'bg-orange-500' }
                ].map((color) => (
                  <label
                    key={color.id}
                    className={`w-12 h-12 ${color.color} rounded-xl cursor-pointer border-4 transition-all ${
                      appearance.accentColor === color.id ? 'border-gray-800' : 'border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accentColor"
                      value={color.id}
                      checked={appearance.accentColor === color.id}
                      onChange={(e) => setAppearance(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                <div>
                  <p className="font-medium text-teal-900">Compact Mode</p>
                  <p className="text-sm text-teal-600">Reduce spacing for a more compact interface</p>
                </div>
                <input
                  type="checkbox"
                  checked={appearance.compactMode}
                  onChange={(e) => setAppearance(prev => ({ ...prev, compactMode: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                <div>
                  <p className="font-medium text-teal-900">Show Avatars</p>
                  <p className="text-sm text-teal-600">Display user avatars throughout the interface</p>
                </div>
                <input
                  type="checkbox"
                  checked={appearance.showAvatars}
                  onChange={(e) => setAppearance(prev => ({ ...prev, showAvatars: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                />
              </label>
            </div>
          </div>
        )

      case 'system':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="font-medium text-teal-900">System Preferences</h3>
                  <p className="text-sm text-teal-600">Configure language, time zone, and system behavior</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Language</label>
                <select
                  value={system.language}
                  onChange={(e) => setSystem(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Time Zone</label>
                <select
                  value={system.timezone}
                  onChange={(e) => setSystem(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Date Format</label>
                <select
                  value={system.dateFormat}
                  onChange={(e) => setSystem(prev => ({ ...prev, dateFormat: e.target.value }))}
                  className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                  <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-2">Time Format</label>
                <select
                  value={system.timeFormat}
                  onChange={(e) => setSystem(prev => ({ ...prev, timeFormat: e.target.value }))}
                  className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-white border border-teal-200 rounded-xl">
                <div>
                  <p className="font-medium text-teal-900">Auto-save</p>
                  <p className="text-sm text-teal-600">Automatically save changes as you work</p>
                </div>
                <input
                  type="checkbox"
                  checked={system.autoSave}
                  onChange={(e) => setSystem(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500"
                />
              </label>

              <div className="p-4 bg-white border border-teal-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-teal-900">Backup Frequency</p>
                    <p className="text-sm text-teal-600">How often to backup your data</p>
                  </div>
                </div>
                <select
                  value={system.backupFrequency}
                  onChange={(e) => setSystem(prev => ({ ...prev, backupFrequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="font-medium text-teal-900">Data & Privacy</h3>
                  <p className="text-sm text-teal-600">Manage your data, backups, and privacy settings</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Data Management</h4>
              <div className="space-y-3">
                <div className="p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-teal-900">Export Data</p>
                      <p className="text-sm text-teal-600">Download all your data in JSON format</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="border-teal-200 text-teal-700 hover:bg-teal-50 flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-white border border-teal-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-teal-900">Data Backup</p>
                      <p className="text-sm text-teal-600">Last backup: 2 hours ago</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="border-teal-200 text-teal-700 hover:bg-teal-50 flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Backup Now</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-teal-900">Privacy Controls</h4>
              <div className="space-y-3">
                <div className="p-4 bg-white border border-teal-200 rounded-xl">
                  <p className="font-medium text-teal-900 mb-2">Analytics & Usage Data</p>
                  <p className="text-sm text-teal-600 mb-3">Help improve CounselFlow by sharing anonymous usage data</p>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-teal-600 border-teal-300 rounded focus:ring-teal-500 mr-3"
                    />
                    <span className="text-sm text-teal-900">Share anonymous usage statistics</span>
                  </label>
                </div>

                <div className="p-4 bg-white border border-teal-200 rounded-xl">
                  <p className="font-medium text-teal-900 mb-2">Data Retention</p>
                  <p className="text-sm text-teal-600 mb-3">How long to keep your data after account deletion</p>
                  <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="immediate">Delete immediately</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-red-600">Danger Zone</h4>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(true)}
                    className="border-red-300 text-red-700 hover:bg-red-100 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Customize your workspace and manage account preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Tabs */}
          <motion.div 
            className="lg:w-80"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                        : 'text-teal-700 hover:bg-teal-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{tab.label}</p>
                      <p className={`text-xs ${activeTab === tab.id ? 'text-teal-100' : 'text-teal-500'}`}>
                        {tab.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-teal-200/50 shadow-lg">
              {renderTabContent()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Current Password</label>
              <Input type="password" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">New Password</label>
              <Input type="password" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Confirm New Password</label>
              <Input type="password" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                Update Password
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowPasswordModal(false)}
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900">Warning: This action cannot be undone</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Deleting your account will permanently remove all your data, including matters, clients, documents, and settings.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">
                Type "DELETE" to confirm
              </label>
              <Input 
                placeholder="DELETE" 
                className="border-red-200 focus:border-red-500 focus:ring-red-500/20" 
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
