/**
 * CounselFlow Ultimate 5.1 - Advanced Risk Heatmap Component
 * Real-time risk visualization with drill-down capabilities
 * Enhanced from CounselFlow Ultimate V3 implementation
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Download,
  Maximize2,
  X,
  ChevronDown,
  Info
} from '../icons';

export interface RiskSeverityCounts {
  low: number;
  moderate: number;
  high: number;
  critical: number;
  highestSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface HeatmapCell {
  subsidiary: string;
  subsidiaryId: number;
  riskType: string;
  severityCounts: RiskSeverityCounts;
}

export interface HeatmapData {
  subsidiaries: Array<{ id: number; name: string }>;
  riskTypes: string[];
  heatmapData: HeatmapCell[];
}

interface RiskHeatmapProps {
  data?: HeatmapData;
  isLoading?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
  onExport?: () => void;
  className?: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: 'bg-blue-400 text-white border-blue-500',
  MEDIUM: 'bg-yellow-400 text-gray-900 border-yellow-500',
  HIGH: 'bg-orange-400 text-white border-orange-500',
  CRITICAL: 'bg-red-500 text-white border-red-600'
};

const SEVERITY_LABELS = [
  { label: 'Low', color: 'bg-blue-400', textColor: 'text-blue-600' },
  { label: 'Medium', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
  { label: 'High', color: 'bg-orange-400', textColor: 'text-orange-600' },
  { label: 'Critical', color: 'bg-red-500', textColor: 'text-red-600' }
];

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  data,
  isLoading = false,
  onCellClick,
  onExport,
  className = ''
}) => {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: HeatmapCell;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState({
    showOnlyCritical: false,
    selectedSubsidiaries: [] as number[],
    selectedRiskTypes: [] as string[]
  });

  // Mock data for demo if no data provided
  const mockData: HeatmapData = {
    subsidiaries: [
      { id: 1, name: 'Tech Corp US' },
      { id: 2, name: 'Tech Corp EU' },
      { id: 3, name: 'Tech Corp Asia' },
      { id: 4, name: 'Innovation Labs' }
    ],
    riskTypes: ['Regulatory', 'Financial', 'Operational', 'Cyber Security', 'Legal Compliance'],
    heatmapData: [
      {
        subsidiary: 'Tech Corp US',
        subsidiaryId: 1,
        riskType: 'Regulatory',
        severityCounts: { low: 2, moderate: 3, high: 1, critical: 0, highestSeverity: 'HIGH' }
      },
      {
        subsidiary: 'Tech Corp US',
        subsidiaryId: 1,
        riskType: 'Financial',
        severityCounts: { low: 1, moderate: 2, high: 2, critical: 1, highestSeverity: 'CRITICAL' }
      },
      {
        subsidiary: 'Tech Corp EU',
        subsidiaryId: 2,
        riskType: 'Regulatory',
        severityCounts: { low: 4, moderate: 2, high: 0, critical: 0, highestSeverity: 'MEDIUM' }
      },
      {
        subsidiary: 'Tech Corp EU',
        subsidiaryId: 2,
        riskType: 'Cyber Security',
        severityCounts: { low: 1, moderate: 1, high: 3, critical: 2, highestSeverity: 'CRITICAL' }
      },
      {
        subsidiary: 'Tech Corp Asia',
        subsidiaryId: 3,
        riskType: 'Operational',
        severityCounts: { low: 3, moderate: 4, high: 1, critical: 0, highestSeverity: 'MEDIUM' }
      },
      {
        subsidiary: 'Innovation Labs',
        subsidiaryId: 4,
        riskType: 'Legal Compliance',
        severityCounts: { low: 2, moderate: 1, high: 2, critical: 0, highestSeverity: 'HIGH' }
      }
    ]
  };

  const heatmapData = data || mockData;

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    let filtered = heatmapData.heatmapData;

    if (filters.showOnlyCritical) {
      filtered = filtered.filter(cell => cell.severityCounts.highestSeverity === 'CRITICAL');
    }

    if (filters.selectedSubsidiaries.length > 0) {
      filtered = filtered.filter(cell => filters.selectedSubsidiaries.includes(cell.subsidiaryId));
    }

    if (filters.selectedRiskTypes.length > 0) {
      filtered = filtered.filter(cell => filters.selectedRiskTypes.includes(cell.riskType));
    }

    return filtered;
  }, [heatmapData.heatmapData, filters]);

  // Get cell data for specific subsidiary and risk type
  const getCell = (subsidiary: { id: number; name: string }, riskType: string): HeatmapCell | undefined => {
    return filteredData.find(
      cell => cell.subsidiaryId === subsidiary.id && cell.riskType === riskType
    );
  };

  // Calculate total risk counts
  const totalRisks = useMemo(() => {
    return filteredData.reduce((acc, cell) => {
      acc.low += cell.severityCounts.low;
      acc.moderate += cell.severityCounts.moderate;
      acc.high += cell.severityCounts.high;
      acc.critical += cell.severityCounts.critical;
      return acc;
    }, { low: 0, moderate: 0, high: 0, critical: 0 });
  }, [filteredData]);

  const handleCellHover = (cell: HeatmapCell | null, event?: React.MouseEvent) => {
    setHoveredCell(cell);
    
    if (cell && event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        content: cell
      });
    } else {
      setTooltip(null);
    }
  };

  const handleCellClick = (cell: HeatmapCell) => {
    setSelectedCell(cell);
    onCellClick?.(cell);
  };

  const getTotalRisksForCell = (cell: HeatmapCell): number => {
    return cell.severityCounts.low + cell.severityCounts.moderate + 
           cell.severityCounts.high + cell.severityCounts.critical;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  const HeatmapContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-var(--color-text-primary)">
            Risk Heatmap Analysis
          </h2>
          <p className="text-var(--color-text-secondary) mt-1">
            Real-time risk distribution across subsidiaries and categories
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Filter}
            onClick={() => setFilters(prev => ({ 
              ...prev, 
              showOnlyCritical: !prev.showOnlyCritical 
            }))}
            className={filters.showOnlyCritical ? 'bg-red-50 border-red-200 text-red-700' : ''}
          >
            {filters.showOnlyCritical ? 'Show All' : 'Critical Only'}
          </Button>
          
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={onExport}
            >
              Export
            </Button>
          )}
          
          {!isFullscreen && (
            <Button
              variant="outline"
              size="sm"
              icon={Maximize2}
              onClick={() => setIsFullscreen(true)}
            >
              Fullscreen
            </Button>
          )}
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SEVERITY_LABELS.map((severity) => {
          const count = totalRisks[severity.label.toLowerCase() as keyof typeof totalRisks];
          const percentage = Object.values(totalRisks).reduce((sum, val) => sum + val, 0) > 0 
            ? (count / Object.values(totalRisks).reduce((sum, val) => sum + val, 0)) * 100 
            : 0;
          
          return (
            <motion.div
              key={severity.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${severity.textColor}`}>
                    {severity.label} Risk
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
                </div>
                <div className={`w-3 h-12 rounded ${severity.color}`}></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                Subsidiary
              </th>
              {heatmapData.riskTypes.map((riskType) => (
                <th
                  key={riskType}
                  className="px-4 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200 min-w-[120px]"
                >
                  <div className="flex flex-col items-center">
                    <span>{riskType}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {heatmapData.subsidiaries.map((subsidiary, rowIdx) => (
              <motion.tr
                key={subsidiary.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIdx * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="sticky left-0 bg-white px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="truncate max-w-[150px]" title={subsidiary.name}>
                      {subsidiary.name}
                    </span>
                  </div>
                </td>
                {heatmapData.riskTypes.map((riskType) => {
                  const cell = getCell(subsidiary, riskType);
                  const severity = cell?.severityCounts?.highestSeverity;
                  const totalRisksInCell = cell ? getTotalRisksForCell(cell) : 0;
                  
                  return (
                    <td key={riskType} className="px-4 py-4 border-b border-gray-100">
                      {cell ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            w-20 h-16 rounded-lg transition-all duration-200 flex flex-col items-center justify-center cursor-pointer
                            border-2 ${SEVERITY_COLORS[severity]} shadow-sm hover:shadow-md
                            ${hoveredCell === cell ? 'ring-2 ring-blue-300' : ''}
                            ${selectedCell === cell ? 'ring-2 ring-blue-500' : ''}
                          `}
                          onClick={() => handleCellClick(cell)}
                          onMouseEnter={(e) => handleCellHover(cell, e)}
                          onMouseLeave={() => handleCellHover(null)}
                        >
                          <span className="text-lg font-bold">
                            {totalRisksInCell}
                          </span>
                          <span className="text-xs opacity-80">
                            {severity?.toLowerCase()}
                          </span>
                        </motion.div>
                      ) : (
                        <div className="w-20 h-16 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No risks</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Risk Severity:</span>
          {SEVERITY_LABELS.map((severity) => (
            <div key={severity.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${severity.color} border border-gray-300`}></div>
              <span className="text-sm text-gray-600">{severity.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Regular view */}
      {!isFullscreen && (
        <Card className={`p-6 ${className}`}>
          <HeatmapContent />
        </Card>
      )}

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-[95vw] max-h-[95vh] overflow-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Risk Heatmap - Fullscreen View</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => setIsFullscreen(false)}
                />
              </div>
              <div className="p-6">
                <HeatmapContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
              <div className="text-sm font-semibold text-gray-900 mb-2">
                {tooltip.content.subsidiary} - {tooltip.content.riskType}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Critical:</span>
                  <span className="font-medium">{tooltip.content.severityCounts.critical}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-orange-600">High:</span>
                  <span className="font-medium">{tooltip.content.severityCounts.high}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-600">Medium:</span>
                  <span className="font-medium">{tooltip.content.severityCounts.moderate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-600">Low:</span>
                  <span className="font-medium">{tooltip.content.severityCounts.low}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Total Risks:</span>
                    <span>{getTotalRisksForCell(tooltip.content)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Highest Severity:</span>
                    <Badge variant={tooltip.content.severityCounts.highestSeverity === 'CRITICAL' ? 'destructive' : 
                                  tooltip.content.severityCounts.highestSeverity === 'HIGH' ? 'warning' :
                                  tooltip.content.severityCounts.highestSeverity === 'MEDIUM' ? 'info' : 'secondary'}>
                      {tooltip.content.severityCounts.highestSeverity}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Cell Details Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full shadow-2xl"
            >
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Risk Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => setSelectedCell(null)}
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Subsidiary</h4>
                  <p className="text-lg font-medium text-gray-900">{selectedCell.subsidiary}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Risk Category</h4>
                  <p className="text-lg font-medium text-gray-900">{selectedCell.riskType}</p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Risk Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'critical', label: 'Critical', color: 'bg-red-500', count: selectedCell.severityCounts.critical },
                      { key: 'high', label: 'High', color: 'bg-orange-400', count: selectedCell.severityCounts.high },
                      { key: 'moderate', label: 'Medium', color: 'bg-yellow-400', count: selectedCell.severityCounts.moderate },
                      { key: 'low', label: 'Low', color: 'bg-blue-400', count: selectedCell.severityCounts.low }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${item.color}`}></div>
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      // Navigate to detailed risk view
                      setSelectedCell(null);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedCell(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RiskHeatmap;