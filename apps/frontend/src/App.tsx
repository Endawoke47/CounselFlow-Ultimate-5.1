import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { AIProvider } from './contexts/AIContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoginPage } from './pages/LoginPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import { MattersPage } from './pages/MattersPage'
import { ContractsPage } from './pages/ContractsPage'
import { ClientsPage } from './pages/ClientsPage'
import { AIChatPage } from './pages/AIChatPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { DocumentAnalysisPage } from './pages/DocumentAnalysisPage'
import { SettingsPage } from './pages/SettingsPage'
import { ComponentShowcase } from './pages/ComponentShowcase'
import { IPManagementPage } from './pages/IPManagementPage'
import { CompliancePage } from './pages/CompliancePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { DisputesPage } from './pages/DisputesPage'
import { SpendAnalyticsPage } from './pages/SpendAnalyticsPage'
import { IntakePage } from './pages/IntakePage'
import { EntityManagementPage } from './pages/EntityManagementPage'
import { KnowledgeManagementPage } from './pages/KnowledgeManagementPage'
import { EntitiesPage } from './pages/EntitiesPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { ImprovementsDemo } from './pages/ImprovementsDemo'
import { DashboardSkeleton } from './components/ui/SkeletonLoader'
import { NetworkStatus } from './components/ui/ErrorDisplay'
import { ShortcutsModal, useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { logger } from './services/logger'

export function App() {
  const { user, isLoading } = useAuth()
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  // Handle global error logging
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    logger.error('Global application error', { error, errorInfo })
  }

  if (isLoading) {
    return (
      <ErrorBoundary onError={handleError}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <DashboardSkeleton />
        </div>
      </ErrorBoundary>
    )
  }

  if (!user) {
    return (
      <ErrorBoundary onError={handleError}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary onError={handleError}>
      <NetworkStatus />
      <AIProvider>
        <DashboardLayout>
          <ErrorBoundary onError={handleError}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ErrorBoundary onError={handleError}>
                  <Dashboard />
                </ErrorBoundary>
              } />
              <Route path="/matters" element={
                <ErrorBoundary onError={handleError}>
                  <MattersPage />
                </ErrorBoundary>
              } />
              <Route path="/contracts" element={
                <ErrorBoundary onError={handleError}>
                  <ContractsPage />
                </ErrorBoundary>
              } />
              <Route path="/ip-management" element={
                <ErrorBoundary onError={handleError}>
                  <IPManagementPage />
                </ErrorBoundary>
              } />
              <Route path="/compliance" element={
                <ErrorBoundary onError={handleError}>
                  <CompliancePage />
                </ErrorBoundary>
              } />
              <Route path="/privacy" element={
                <ErrorBoundary onError={handleError}>
                  <PrivacyPage />
                </ErrorBoundary>
              } />
              <Route path="/disputes" element={
                <ErrorBoundary onError={handleError}>
                  <DisputesPage />
                </ErrorBoundary>
              } />
              <Route path="/spend-analytics" element={
                <ErrorBoundary onError={handleError}>
                  <SpendAnalyticsPage />
                </ErrorBoundary>
              } />
              <Route path="/intake" element={
                <ErrorBoundary onError={handleError}>
                  <IntakePage />
                </ErrorBoundary>
              } />
              <Route path="/entity-management" element={
                <ErrorBoundary onError={handleError}>
                  <EntityManagementPage />
                </ErrorBoundary>
              } />
              <Route path="/knowledge" element={
                <ErrorBoundary onError={handleError}>
                  <KnowledgeManagementPage />
                </ErrorBoundary>
              } />
              <Route path="/entities" element={
                <ErrorBoundary onError={handleError}>
                  <EntitiesPage />
                </ErrorBoundary>
              } />
              <Route path="/knowledge-base" element={
                <ErrorBoundary onError={handleError}>
                  <KnowledgePage />
                </ErrorBoundary>
              } />
              <Route path="/clients" element={
                <ErrorBoundary onError={handleError}>
                  <ClientsPage />
                </ErrorBoundary>
              } />
              <Route path="/ai" element={
                <ErrorBoundary onError={handleError}>
                  <AIChatPage />
                </ErrorBoundary>
              } />
              <Route path="/documents" element={
                <ErrorBoundary onError={handleError}>
                  <DocumentsPage />
                </ErrorBoundary>
              } />
              <Route path="/document-analysis" element={
                <ErrorBoundary onError={handleError}>
                  <DocumentAnalysisPage />
                </ErrorBoundary>
              } />
              <Route path="/settings" element={
                <ErrorBoundary onError={handleError}>
                  <SettingsPage />
                </ErrorBoundary>
              } />
              <Route path="/showcase" element={
                <ErrorBoundary onError={handleError}>
                  <ComponentShowcase />
                </ErrorBoundary>
              } />
              <Route path="/improvements" element={
                <ErrorBoundary onError={handleError}>
                  <ImprovementsDemo />
                </ErrorBoundary>
              } />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </DashboardLayout>
      </AIProvider>
      <ShortcutsModal />
    </ErrorBoundary>
  )
}