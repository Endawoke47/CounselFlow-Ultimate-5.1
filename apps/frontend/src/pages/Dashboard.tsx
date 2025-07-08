import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui/UIComponents';
import { Chart } from '../components/ui/Chart';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, trend, icon }) => {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted-gray';
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  
  return (
    <Card hover className="group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-gray">{title}</p>
          <p className="text-2xl font-bold text-dark-navy mt-1">{value}</p>
          <p className={`text-sm mt-1 ${trendColor} flex items-center`}>
            <span className="mr-1">{trendIcon}</span>
            {change}
          </p>
        </div>
        <div className="text-3xl opacity-60 group-hover:opacity-80 transition-opacity">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const QuickAccessCard: React.FC<{ title: string; description: string; icon: string; path: string; color: string }> = 
({ title, description, icon, path, color }) => (
  <Link to={path}>
    <Card hover className="group h-full">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-dark-navy group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-gray mt-1">{description}</p>
        </div>
      </div>
    </Card>
  </Link>
);

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);

  const handlePeriodChange = (period: string) => {
    if (period === selectedPeriod) return;
    
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => {
      setSelectedPeriod(period);
      setIsLoading(false);
    }, 300);
  };

  const handleAIInsightsClick = () => {
    setAiInsightsLoading(true);
    setShowAIInsights(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setAiInsightsLoading(false);
    }, 2000);
  };

  // Dynamic data based on selected period
  const getDataForPeriod = (period: string) => {
    const dataMapping = {
      '7d': {
        kpiData: [
          {
            title: 'Active Matters',
            value: '32',
            change: '+8% from last week',
            trend: 'up' as const,
            icon: '📁'
          },
          {
            title: 'Revenue (7d)',
            value: '$240K',
            change: '+15% from last week',
            trend: 'up' as const,
            icon: '💰'
          },
          {
            title: 'Pending Reviews',
            value: '12',
            change: '-3% from last week',
            trend: 'down' as const,
            icon: '⏳'
          },
          {
            title: 'Client Satisfaction',
            value: '96%',
            change: '+2% from last week',
            trend: 'up' as const,
            icon: '⭐'
          }
        ],
        chartData: [
          { name: 'Mon', revenue: 32000, matters: 3 },
          { name: 'Tue', revenue: 45000, matters: 5 },
          { name: 'Wed', revenue: 38000, matters: 4 },
          { name: 'Thu', revenue: 42000, matters: 6 },
          { name: 'Fri', revenue: 48000, matters: 7 },
          { name: 'Sat', revenue: 35000, matters: 4 },
          { name: 'Sun', revenue: 50000, matters: 8 }
        ],
        successRate: 89,
        period: 'week'
      },
      '30d': {
        kpiData: [
          {
            title: 'Active Matters',
            value: '127',
            change: '+12% from last month',
            trend: 'up' as const,
            icon: '📁'
          },
          {
            title: 'Revenue (30d)',
            value: '$1.2M',
            change: '+18% from last month',
            trend: 'up' as const,
            icon: '💰'
          },
          {
            title: 'Pending Reviews',
            value: '23',
            change: '-8% from last month',
            trend: 'down' as const,
            icon: '⏳'
          },
          {
            title: 'Client Satisfaction',
            value: '94%',
            change: 'No change',
            trend: 'stable' as const,
            icon: '⭐'
          }
        ],
        chartData: [
          { name: 'Week 1', revenue: 280000, matters: 18 },
          { name: 'Week 2', revenue: 320000, matters: 22 },
          { name: 'Week 3', revenue: 300000, matters: 20 },
          { name: 'Week 4', revenue: 350000, matters: 28 }
        ],
        successRate: 87,
        period: 'month'
      },
      '90d': {
        kpiData: [
          {
            title: 'Active Matters',
            value: '348',
            change: '+25% from last quarter',
            trend: 'up' as const,
            icon: '📁'
          },
          {
            title: 'Revenue (90d)',
            value: '$4.2M',
            change: '+22% from last quarter',
            trend: 'up' as const,
            icon: '💰'
          },
          {
            title: 'Pending Reviews',
            value: '67',
            change: '-12% from last quarter',
            trend: 'down' as const,
            icon: '⏳'
          },
          {
            title: 'Client Satisfaction',
            value: '92%',
            change: '+3% from last quarter',
            trend: 'up' as const,
            icon: '⭐'
          }
        ],
        chartData: [
          { name: 'Month 1', revenue: 1200000, matters: 85 },
          { name: 'Month 2', revenue: 1400000, matters: 98 },
          { name: 'Month 3', revenue: 1600000, matters: 115 }
        ],
        successRate: 91,
        period: 'quarter'
      }
    };
    return dataMapping[period as keyof typeof dataMapping] || dataMapping['7d'];
  };

  const currentData = getDataForPeriod(selectedPeriod);
  const kpiData = currentData.kpiData;

  const quickAccessItems = [
    {
      title: 'Create New Matter',
      description: 'Start a new legal matter',
      icon: '📁',
      path: '/matters',
      color: 'bg-primary'
    },
    {
      title: 'Draft Contract',
      description: 'AI-powered contract generation',
      icon: '📄',
      path: '/contracts',
      color: 'bg-accent-purple'
    },
    {
      title: 'Add Client',
      description: 'Register new client',
      icon: '👥',
      path: '/clients',
      color: 'bg-success'
    },
    {
      title: 'Legal Research',
      description: 'AI-assisted research',
      icon: '🔍',
      path: '/ai',
      color: 'bg-info'
    },
    {
      title: 'Upload Document',
      description: 'Add to document library',
      icon: '📋',
      path: '/documents',
      color: 'bg-warning'
    },
    {
      title: 'Compliance Check',
      description: 'Review compliance status',
      icon: '🔒',
      path: '/compliance',
      color: 'bg-danger'
    }
  ];

  // Dynamic recent activity based on period
  const getRecentActivityForPeriod = (period: string) => {
    const activities = {
      '7d': [
        {
          type: 'matter',
          title: 'Updated TechCorp Acquisition',
          time: '2 hours ago',
          user: 'Sarah Chen',
          status: 'in-progress'
        },
        {
          type: 'contract',
          title: 'Reviewed SaaS Agreement',
          time: '4 hours ago',
          user: 'Mike Johnson',
          status: 'completed'
        },
        {
          type: 'client',
          title: 'New client onboarded',
          time: '1 day ago',
          user: 'Lisa Wang',
          status: 'completed'
        },
        {
          type: 'document',
          title: 'Patent filing submitted',
          time: '2 days ago',
          user: 'David Lee',
          status: 'pending'
        }
      ],
      '30d': [
        {
          type: 'matter',
          title: 'Completed merger due diligence',
          time: '3 days ago',
          user: 'Sarah Chen',
          status: 'completed'
        },
        {
          type: 'contract',
          title: 'Enterprise agreement signed',
          time: '1 week ago',
          user: 'Mike Johnson',
          status: 'completed'
        },
        {
          type: 'client',
          title: 'Fortune 500 client acquired',
          time: '2 weeks ago',
          user: 'Lisa Wang',
          status: 'completed'
        },
        {
          type: 'document',
          title: 'IP portfolio analysis completed',
          time: '3 weeks ago',
          user: 'David Lee',
          status: 'completed'
        }
      ],
      '90d': [
        {
          type: 'matter',
          title: 'Major litigation settled',
          time: '1 month ago',
          user: 'Sarah Chen',
          status: 'completed'
        },
        {
          type: 'contract',
          title: 'Multi-year partnership agreement',
          time: '6 weeks ago',
          user: 'Mike Johnson',
          status: 'completed'
        },
        {
          type: 'client',
          title: 'International expansion client',
          time: '2 months ago',
          user: 'Lisa Wang',
          status: 'completed'
        },
        {
          type: 'document',
          title: 'Regulatory compliance audit',
          time: '2.5 months ago',
          user: 'David Lee',
          status: 'completed'
        }
      ]
    };
    return activities[period as keyof typeof activities] || activities['7d'];
  };

  const recentActivity = getRecentActivityForPeriod(selectedPeriod);

  const upcomingDeadlines = [
    {
      title: 'TechCorp Due Diligence',
      date: 'Tomorrow',
      priority: 'high',
      type: 'review'
    },
    {
      title: 'Patent Application Filing',
      date: 'Dec 15',
      priority: 'medium',
      type: 'filing'
    },
    {
      title: 'Contract Renewal Review',
      date: 'Dec 18',
      priority: 'low',
      type: 'review'
    }
  ];

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-lg p-4">
            <svg className="animate-spin h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-dark-navy">Updating dashboard...</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Welcome back! Here's what's happening at your firm 
              <span className="font-semibold text-teal-700"> 
                ({selectedPeriod === '7d' ? 'Last 7 days' : selectedPeriod === '30d' ? 'Last 30 days' : 'Last 90 days'})
              </span>
            </p>
          </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-muted-gray p-1 shadow-sm">
            {[
              { key: '7d', label: '7d', desc: 'Last week' },
              { key: '30d', label: '30d', desc: 'Last month' },
              { key: '90d', label: '90d', desc: 'Last quarter' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => handlePeriodChange(period.key)}
                disabled={isLoading}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-200 disabled:opacity-50 ${
                  selectedPeriod === period.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-gray hover:text-dark-navy hover:bg-light-gray'
                }`}
                title={period.desc}
              >
                {isLoading && selectedPeriod === period.key ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs">...</span>
                  </div>
                ) : (
                  period.label
                )}
              </button>
            ))}
          </div>
          <Button 
            variant="ai" 
            icon="✨" 
            iconPosition="left"
            onClick={handleAIInsightsClick}
            disabled={aiInsightsLoading}
          >
            {aiInsightsLoading ? 'Analyzing...' : 'AI Insights'}
          </Button>
        </div>
        </div>

      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div 
            key={`${selectedPeriod}-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dark-navy">Revenue & Matters Trend</h3>
            <div className="flex items-center space-x-4">
              <Badge variant="ai">AI Generated</Badge>
              <div className="text-xs text-muted-gray capitalize">Last {currentData.period}</div>
            </div>
          </div>
          <div className="mb-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-gray">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-purple rounded-full"></div>
              <span className="text-muted-gray">New Matters</span>
            </div>
          </div>
          <div className="h-80">
            <Chart
              type="combo"
              data={currentData.chartData}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-dark-navy mb-6">Success Rate Gauge</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#D0D4D9"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#3C7B75"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - currentData.successRate / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-dark-navy">{currentData.successRate}%</div>
                  <div className="text-sm text-muted-gray">Success Rate</div>
                  <div className="text-xs text-muted-gray mt-1 capitalize">This {currentData.period}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-2xl font-bold text-dark-navy mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessItems.map((item, index) => (
            <QuickAccessCard key={index} {...item} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-dark-navy mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-light-gray transition-colors">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {activity.type === 'matter' ? '📁' : 
                     activity.type === 'contract' ? '📄' :
                     activity.type === 'client' ? '👥' : '📋'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-dark-navy">{activity.title}</p>
                  <p className="text-sm text-muted-gray">{activity.user} • {activity.time}</p>
                </div>
                <Badge 
                  variant={activity.status === 'completed' ? 'success' : 
                          activity.status === 'in-progress' ? 'primary' : 'warning'}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-dark-navy mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-light-gray transition-colors">
                <div>
                  <p className="font-medium text-dark-navy">{deadline.title}</p>
                  <p className="text-sm text-muted-gray">{deadline.date}</p>
                </div>
                <Badge 
                  variant={deadline.priority === 'high' ? 'danger' : 
                          deadline.priority === 'medium' ? 'warning' : 'info'}
                >
                  {deadline.priority}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="ghost" className="w-full">
              View All Deadlines
            </Button>
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
            <span className="text-white">✨</span>
          </div>
          <h3 className="text-lg font-semibold text-dark-navy">AI Recommendations</h3>
          <div className="text-xs text-muted-gray capitalize">Based on {currentData.period} data</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(() => {
            const recommendations = {
              '7d': [
                {
                  title: 'Daily Productivity Boost',
                  description: 'Your team completed 15% more tasks this week. Keep the momentum!',
                  action: 'View Details',
                  variant: 'primary' as const
                },
                {
                  title: 'Quick Client Check-in',
                  description: '3 clients need immediate follow-up based on recent activities',
                  action: 'Contact Now',
                  variant: 'secondary' as const
                },
                {
                  title: 'Document Review Alert',
                  description: '5 urgent documents need your attention before EOD',
                  action: 'Review',
                  variant: 'ai' as const
                }
              ],
              '30d': [
                {
                  title: 'Contract Review Optimization',
                  description: 'Identified 8 contracts that need review within next 7 days',
                  action: 'Review Now',
                  variant: 'primary' as const
                },
                {
                  title: 'Client Retention Focus',
                  description: '12 clients require follow-up based on 30-day engagement patterns',
                  action: 'Schedule Calls',
                  variant: 'secondary' as const
                },
                {
                  title: 'Revenue Optimization',
                  description: 'AI suggests focusing on 3 high-value client segments this month',
                  action: 'Analyze',
                  variant: 'ai' as const
                }
              ],
              '90d': [
                {
                  title: 'Strategic Planning Insight',
                  description: 'Quarterly trends show 25% growth opportunity in IP law',
                  action: 'View Strategy',
                  variant: 'primary' as const
                },
                {
                  title: 'Long-term Client Health',
                  description: 'Quarterly analysis reveals 8 at-risk client relationships',
                  action: 'Create Plan',
                  variant: 'secondary' as const
                },
                {
                  title: 'Performance Analytics',
                  description: 'AI detected patterns for 30% efficiency improvement',
                  action: 'Deep Dive',
                  variant: 'ai' as const
                }
              ]
            };
            
            const currentRecommendations = recommendations[selectedPeriod as keyof typeof recommendations] || recommendations['7d'];
            
            return currentRecommendations.map((rec, index) => (
              <div key={`${selectedPeriod}-rec-${index}`} className="p-4 bg-light-gray rounded-lg animate-fade-in">
                <h4 className="font-medium text-dark-navy mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-gray mb-3">{rec.description}</p>
                <Button size="sm" variant={rec.variant}>{rec.action}</Button>
              </div>
            ));
          })()}
        </div>
      </Card>

      {/* AI Insights Modal */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🧠</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Legal Insights</h2>
                    <p className="text-purple-100">Powered by CounselFlow AI Engine</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {aiInsightsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium text-gray-700">Analyzing your legal data...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Risk Analysis */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">⚠️</span>
                      <h3 className="text-lg font-semibold text-red-800">Risk Analysis</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-red-700">Contract Renewal Risk (TechCorp)</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">HIGH</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-700">Compliance Gap (Privacy Policy)</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">MEDIUM</span>
                      </div>
                      <p className="text-sm text-red-600 mt-2">
                        💡 <strong>Recommendation:</strong> Schedule client meeting within 7 days to discuss renewal terms.
                      </p>
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">🚀</span>
                      <h3 className="text-lg font-semibold text-green-800">Growth Opportunities</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Cross-sell IP Services to 3 clients</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">$45K potential</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Upsell Corporate Advisory</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">$28K potential</span>
                      </div>
                      <p className="text-sm text-green-600 mt-2">
                        💡 <strong>Insight:</strong> Clients in fintech sector show 85% acceptance rate for IP services.
                      </p>
                    </div>
                  </div>

                  {/* Efficiency Analysis */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">⚡</span>
                      <h3 className="text-lg font-semibold text-blue-800">Efficiency Insights</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Document Review Automation</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">30% time save</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Template Usage Optimization</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">12 hrs/week</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">
                        💡 <strong>Suggestion:</strong> Implement AI contract review for routine NDAs and service agreements.
                      </p>
                    </div>
                  </div>

                  {/* Market Intelligence */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">📊</span>
                      <h3 className="text-lg font-semibold text-purple-800">Market Intelligence</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="text-purple-700">
                        <p><strong>Industry Trend:</strong> M&A activity in your practice areas up 23% this quarter</p>
                      </div>
                      <div className="text-purple-700">
                        <p><strong>Competitive Intel:</strong> 3 competitors raised rates by 8-12% recently</p>
                      </div>
                      <div className="text-purple-700">
                        <p><strong>Regulatory Update:</strong> New data privacy laws affect 67% of your client base</p>
                      </div>
                      <p className="text-sm text-purple-600 mt-2">
                        💡 <strong>Action Item:</strong> Consider rate adjustment and proactive client advisory on regulatory changes.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <Button variant="ai" onClick={() => alert('Detailed report feature coming soon!')}>
                      📋 Generate Full Report
                    </Button>
                    <Button variant="primary" onClick={() => alert('Calendar integration coming soon!')}>
                      📅 Schedule Follow-ups
                    </Button>
                    <Button variant="secondary" onClick={() => alert('Email insights feature coming soon!')}>
                      📧 Email Insights
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
