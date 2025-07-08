import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Textarea } from '../ui/Textarea';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  Eye,
  Shield,
  TrendingUp,
  Clock,
  User,
  MessageSquare,
  Download,
  Share,
  ChevronDown,
  ChevronUp
} from '../icons';
import { ContractReviewSession } from '../../types/contracts';

interface ContractReviewInterfaceProps {
  contractId: string;
  documentId: string;
  documentContent: string;
  onClose: () => void;
  onReviewComplete: (review: ContractReviewSession) => void;
  className?: string;
}

interface ReviewTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badgeCount?: number;
  badgeVariant?: 'success' | 'warning' | 'destructive' | 'info';
}

const ContractReviewInterface: React.FC<ContractReviewInterfaceProps> = ({
  contractId,
  documentId,
  documentContent,
  onClose,
  onReviewComplete,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewSession, setReviewSession] = useState<ContractReviewSession | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [humanReviewNotes, setHumanReviewNotes] = useState('');

  const tabs: ReviewTab[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { 
      id: 'risks', 
      label: 'Risk Analysis', 
      icon: AlertTriangle,
      badgeCount: reviewSession?.analysis?.riskAssessment?.factors?.length || 0,
      badgeVariant: 'destructive'
    },
    { 
      id: 'compliance', 
      label: 'Compliance', 
      icon: Shield,
      badgeCount: reviewSession?.analysis?.complianceCheck?.filter(c => c.status === 'non_compliant').length || 0,
      badgeVariant: 'warning'
    },
    { 
      id: 'clauses', 
      label: 'Clause Analysis', 
      icon: FileText,
      badgeCount: reviewSession?.analysis?.clauseAnalysis?.filter(c => c.priority === 'high').length || 0,
      badgeVariant: 'info'
    },
    { 
      id: 'market', 
      label: 'Market Comparison', 
      icon: TrendingUp,
      badgeCount: reviewSession?.analysis?.marketComparison?.filter(m => m.assessment === 'unfavorable').length || 0,
      badgeVariant: 'warning'
    },
    { id: 'collaboration', label: 'Collaboration', icon: MessageSquare }
  ];

  useEffect(() => {
    initiateReview();
  }, [contractId, documentId]);

  const initiateReview = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate AI review process
      await new Promise(resolve => setTimeout(resolve, 4000));

      const mockReviewSession: ContractReviewSession = {
        id: `review_${Date.now()}`,
        contractId,
        documentId,
        reviewType: 'initial_review',
        scope: {
          analyzeRisk: true,
          checkCompliance: true,
          marketComparison: true,
          clauseAnalysis: true,
          financialAnalysis: true
        },
        analysis: {
          overallScore: 72,
          riskAssessment: {
            level: 'medium',
            factors: [
              {
                category: 'legal',
                risk: 'Liability limitation clause is weak',
                severity: 'high',
                mitigation: 'Add comprehensive liability cap with specific exclusions'
              },
              {
                category: 'financial',
                risk: 'Payment terms favor counterparty',
                severity: 'medium',
                mitigation: 'Negotiate for shorter payment terms or early payment discounts'
              },
              {
                category: 'operational',
                risk: 'Termination clause lacks adequate notice period',
                severity: 'medium',
                mitigation: 'Increase notice period to 60 days minimum'
              }
            ]
          },
          clauseAnalysis: [
            {
              clause: 'Liability Limitation',
              location: 'Section 8.2',
              analysis: 'Current liability cap is set too low and excludes important protections',
              recommendation: 'Increase liability cap to $500K and add exclusions for gross negligence',
              priority: 'high'
            },
            {
              clause: 'Intellectual Property',
              location: 'Section 6.1',
              analysis: 'IP ownership terms are ambiguous regarding derivative works',
              recommendation: 'Clarify ownership of derivative works and improvements',
              priority: 'high'
            },
            {
              clause: 'Termination',
              location: 'Section 10.1',
              analysis: 'Termination rights are asymmetric, favoring the counterparty',
              recommendation: 'Add equivalent termination rights for both parties',
              priority: 'medium'
            }
          ],
          complianceCheck: [
            {
              regulation: 'GDPR',
              status: 'compliant',
              details: 'Data processing clauses include adequate GDPR protections',
              action_required: undefined
            },
            {
              regulation: 'SOX Compliance',
              status: 'non_compliant',
              details: 'Missing required financial reporting obligations',
              action_required: 'Add Section 409 compliance reporting requirements'
            },
            {
              regulation: 'Export Control (ITAR)',
              status: 'unclear',
              details: 'No mention of export control compliance for technical data',
              action_required: 'Add export control compliance clause if applicable'
            }
          ],
          marketComparison: [
            {
              aspect: 'Payment Terms',
              ourPosition: 'Net 45 days',
              marketStandard: 'Net 30 days',
              assessment: 'unfavorable',
              recommendation: 'Negotiate to Net 30 or add early payment discount'
            },
            {
              aspect: 'Warranty Period',
              ourPosition: '2 years',
              marketStandard: '1 year',
              assessment: 'unfavorable',
              recommendation: 'Reduce warranty period to 1 year with option to purchase extended warranty'
            },
            {
              aspect: 'Liability Cap',
              ourPosition: '$100K',
              marketStandard: '$500K',
              assessment: 'favorable',
              recommendation: 'Current position is favorable, maintain if possible'
            }
          ]
        },
        status: 'completed',
        progress: 100,
        processingStarted: new Date(Date.now() - 240000), // 4 minutes ago
        processingCompleted: new Date(),
        humanReview: {
          assigned_to: ['current_user'],
          status: 'pending',
          findings: [],
          finalDecision: undefined
        },
        createdAt: new Date(Date.now() - 240000),
        updatedAt: new Date(),
        createdBy: 'current_user'
      };

      setReviewSession(mockReviewSession);
    } catch (error) {
      console.error('Review analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleHumanReviewSubmit = () => {
    if (reviewSession && humanReviewNotes.trim()) {
      const updatedSession = {
        ...reviewSession,
        humanReview: {
          ...reviewSession.humanReview,
          findings: [
            ...(reviewSession.humanReview?.findings || []),
            {
              reviewer: 'current_user',
              category: 'general',
              finding: humanReviewNotes,
              severity: 'info' as const,
              recommendation: 'Review and incorporate feedback',
              timestamp: new Date()
            }
          ],
          status: 'completed' as const
        }
      };

      setReviewSession(updatedSession);
      setHumanReviewNotes('');
    }
  };

  const handleReviewComplete = (decision: 'approve' | 'approve_with_conditions' | 'reject' | 'needs_revision') => {
    if (reviewSession) {
      const completedSession = {
        ...reviewSession,
        humanReview: {
          ...reviewSession.humanReview,
          finalDecision: decision,
          status: 'completed' as const
        }
      };

      onReviewComplete(completedSession);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`fixed inset-0 z-50 flex bg-gray-50 ${className}`}>
      {/* Document Panel */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Contract Document</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" icon={Download}>
                Download
              </Button>
              <Button variant="outline" size="sm" icon={Share}>
                Share
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap text-gray-700">
              {documentContent}
            </pre>
          </div>
        </div>
      </div>

      {/* Review Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Brain className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Contract Review</h2>
                <p className="text-sm text-gray-600">
                  {isAnalyzing ? 'Analyzing contract...' : 'Review completed'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Contract</h3>
              <p className="text-gray-600">Our AI is reviewing the contract for risks, compliance, and optimization opportunities...</p>
            </div>
          </div>
        )}

        {/* Review Results */}
        {reviewSession && !isAnalyzing && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white">
              <div className="flex space-x-1 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                        <Badge variant={tab.badgeVariant} size="sm">
                          {tab.badgeCount}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Overall Assessment</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`text-2xl font-bold ${getScoreColor(reviewSession.analysis.overallScore)}`}>
                              {reviewSession.analysis.overallScore}
                            </span>
                            <span className="text-gray-500 text-sm">/100</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                            <Badge variant={
                              reviewSession.analysis.riskAssessment.level === 'high' ? 'destructive' :
                              reviewSession.analysis.riskAssessment.level === 'medium' ? 'warning' : 'success'
                            }>
                              {reviewSession.analysis.riskAssessment.level.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                            <p className="text-sm font-medium text-gray-900">
                              {reviewSession.processingCompleted && reviewSession.processingStarted
                                ? `${Math.round((reviewSession.processingCompleted.getTime() - reviewSession.processingStarted.getTime()) / 1000)}s`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Quick Summary</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-700">
                              {reviewSession.analysis.riskAssessment.factors.length} risk factors identified
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">
                              {reviewSession.analysis.complianceCheck.filter(c => c.status === 'non_compliant').length} compliance issues
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-700">
                              {reviewSession.analysis.clauseAnalysis.filter(c => c.priority === 'high').length} high-priority clause recommendations
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'risks' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                        <div className="space-y-3">
                          {reviewSession.analysis.riskAssessment.factors.map((factor, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" size="sm">
                                    {factor.category}
                                  </Badge>
                                  <Badge variant={
                                    factor.severity === 'high' ? 'destructive' :
                                    factor.severity === 'medium' ? 'warning' : 'secondary'
                                  } size="sm">
                                    {factor.severity}
                                  </Badge>
                                </div>
                              </div>
                              <h5 className="font-medium text-gray-900 mb-1">{factor.risk}</h5>
                              <p className="text-sm text-gray-600 mb-2">{factor.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'compliance' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Compliance Check</h4>
                        <div className="space-y-3">
                          {reviewSession.analysis.complianceCheck.map((check, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{check.regulation}</h5>
                                <Badge variant={
                                  check.status === 'compliant' ? 'success' :
                                  check.status === 'non_compliant' ? 'destructive' :
                                  check.status === 'unclear' ? 'warning' : 'secondary'
                                }>
                                  {check.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{check.details}</p>
                              {check.action_required && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                  <p className="text-sm text-yellow-800">
                                    <strong>Action Required:</strong> {check.action_required}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'clauses' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Clause Analysis</h4>
                        <div className="space-y-3">
                          {reviewSession.analysis.clauseAnalysis.map((clause, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-gray-900">{clause.clause}</h5>
                                  <Badge variant="outline" size="sm">
                                    {clause.location}
                                  </Badge>
                                </div>
                                <Badge variant={
                                  clause.priority === 'high' ? 'destructive' :
                                  clause.priority === 'medium' ? 'warning' : 'secondary'
                                }>
                                  {clause.priority} priority
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{clause.analysis}</p>
                              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-sm text-blue-800">
                                  <strong>Recommendation:</strong> {clause.recommendation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'market' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Market Comparison</h4>
                        <div className="space-y-3">
                          {reviewSession.analysis.marketComparison?.map((comparison, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{comparison.aspect}</h5>
                                <Badge variant={
                                  comparison.assessment === 'favorable' ? 'success' :
                                  comparison.assessment === 'market' ? 'secondary' : 'warning'
                                }>
                                  {comparison.assessment}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                  <p className="text-xs text-gray-500">Our Position</p>
                                  <p className="text-sm font-medium text-gray-900">{comparison.ourPosition}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Market Standard</p>
                                  <p className="text-sm font-medium text-gray-900">{comparison.marketStandard}</p>
                                </div>
                              </div>
                              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                <p className="text-sm text-purple-800">
                                  <strong>Recommendation:</strong> {comparison.recommendation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'collaboration' && (
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Human Review</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Add Review Notes
                            </label>
                            <Textarea
                              placeholder="Enter your review notes, concerns, or recommendations..."
                              value={humanReviewNotes}
                              onChange={(e) => setHumanReviewNotes(e.target.value)}
                              rows={4}
                            />
                            <div className="mt-2 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleHumanReviewSubmit}
                                disabled={!humanReviewNotes.trim()}
                              >
                                Add Note
                              </Button>
                            </div>
                          </div>

                          {reviewSession.humanReview?.findings && reviewSession.humanReview.findings.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Review Findings</h5>
                              <div className="space-y-2">
                                {reviewSession.humanReview.findings.map((finding, index) => (
                                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-start justify-between mb-1">
                                      <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900">{finding.reviewer}</span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        {finding.timestamp.toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{finding.finding}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Decision Actions */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Review completed {reviewSession.processingCompleted?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewComplete('needs_revision')}
                  >
                    Needs Revision
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewComplete('approve_with_conditions')}
                  >
                    Approve with Conditions
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReviewComplete('approve')}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContractReviewInterface;