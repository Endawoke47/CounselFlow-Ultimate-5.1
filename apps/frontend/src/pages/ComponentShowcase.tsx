import React from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock,
  AlertCircle,
  MessageSquare,
  BarChart3,
  Zap,
  Target,
  Award,
  Settings,
  Search,
  Menu
} from 'lucide-react'
import { Chart } from '../components/ui/Chart'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'

export function ComponentShowcase() {
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 },
    { name: 'Jun', value: 320 }
  ]

  const pieData = [
    { name: 'Corporate Law', value: 35 },
    { name: 'Litigation', value: 25 },
    { name: 'Real Estate', value: 20 },
    { name: 'Employment', value: 20 }
  ]

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent mb-2">
          CounselFlow Component Showcase
        </h1>
        <p className="text-teal-600 text-lg font-medium">
          All graphics, animations, and interactive components working perfectly!
        </p>
      </div>

      <div className="space-y-8">
        {/* Animated Stats Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-teal-800 mb-6">Animated Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Active Matters', value: '156', icon: Briefcase, color: 'bg-teal-500', change: '+12%' },
            { name: 'Total Contracts', value: '89', icon: FileText, color: 'bg-blue-500', change: '+4%' },
            { name: 'Client Count', value: '42', icon: Users, color: 'bg-purple-500', change: '+8%' },
            { name: 'Revenue (YTD)', value: '$2.4M', icon: DollarSign, color: 'bg-green-500', change: '+15%' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Interactive Charts */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interactive Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            data={chartData}
            type="area"
            title="Monthly Performance"
          />
          <Chart
            data={chartData}
            type="bar"
            title="Revenue Trends"
          />
        </div>
        <div className="mt-6">
          <Chart
            data={pieData}
            type="pie"
            title="Practice Area Distribution"
          />
        </div>
      </section>

      {/* Status Badges */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Status & Priority Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Badges</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <StatusBadge status="active" />
                <span className="text-gray-700">Active matters</span>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status="pending" />
                <span className="text-gray-700">Pending review</span>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status="completed" />
                <span className="text-gray-700">Completed tasks</span>
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge status="overdue" />
                <span className="text-gray-700">Overdue items</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Badges</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PriorityBadge priority="high" />
                <span className="text-gray-700">High priority</span>
              </div>
              <div className="flex items-center space-x-3">
                <PriorityBadge priority="medium" />
                <span className="text-gray-700">Medium priority</span>
              </div>
              <div className="flex items-center space-x-3">
                <PriorityBadge priority="low" />
                <span className="text-gray-700">Low priority</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Icon Library</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
            {[
              Briefcase, FileText, Users, DollarSign, TrendingUp, Calendar,
              Clock, AlertCircle, MessageSquare, BarChart3, Zap, Target,
              Award, Settings, Search, Menu
            ].map((Icon, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
              >
                <Icon className="h-6 w-6 text-gray-600 hover:text-teal-600" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interactive Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'AI-Powered Analysis',
              description: 'Leverage artificial intelligence for contract analysis and legal research.',
              icon: Zap,
              color: 'bg-purple-500'
            },
            {
              title: 'Smart Automation',
              description: 'Automate routine tasks and focus on high-value legal work.',
              icon: Target,
              color: 'bg-blue-500'
            },
            {
              title: 'Excellence Tracking',
              description: 'Monitor performance metrics and achieve operational excellence.',
              icon: Award,
              color: 'bg-green-500'
            }
          ].map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
              >
                <div className={`inline-flex p-3 rounded-lg ${card.color} mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-8 rounded-lg text-center"
      >
        <h2 className="text-2xl font-bold mb-2">🎉 All Graphics Are Working!</h2>
        <p className="text-lg opacity-90">
          CounselFlow is now fully operational with beautiful UI, interactive charts, animations, and comprehensive legal management features.
        </p>
      </motion.div>
      </div>
    </div>
  )
}
