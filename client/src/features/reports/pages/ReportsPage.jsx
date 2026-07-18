import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { useToast } from '../../../services/notifications/useToast';

export const ReportsPage = () => {
  const toast = useToast();
  const [startDate, setStartDate] = useState('2026-07-18');
  const [endDate, setEndDate] = useState('2026-07-18');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.show(`Sales report exported successfully for period ${startDate} to ${endDate}!`, 'success');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">Export sales details, analyze inventory consumption and costing</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            isLoading={isExporting}
            onClick={handleExport}
          >
            Export Day-End Sales (PDF)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Hour Chart */}
        <Card title="Sales by Hour" subtitle="Gross billing volume grouped by service hours">
          <div className="relative w-full h-52 mt-2 bg-white rounded-lg p-2 border border-gray-50 flex items-center justify-center">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#e5e7eb" strokeWidth="1" />

              {/* Area Under Curve */}
              <path
                d="M 40 130 Q 100 90, 140 100 T 240 50 T 340 110 T 440 30 L 440 130 Z"
                fill="url(#salesGrad)"
              />

              {/* Chart Line */}
              <path
                d="M 40 130 Q 100 90, 140 100 T 240 50 T 340 110 T 440 30"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="100" cy="108" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="180" cy="80" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="280" cy="65" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="380" cy="85" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="440" cy="30" r="4" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="40" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">12 PM</text>
              <text x="120" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">2 PM</text>
              <text x="200" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">4 PM</text>
              <text x="280" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">6 PM</text>
              <text x="360" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">8 PM</text>
              <text x="440" y="145" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">10 PM</text>

              {/* Y Axis Labels */}
              <text x="32" y="133" fill="#9ca3af" fontSize="9" textAnchor="end" fontFamily="monospace">₹0</text>
              <text x="32" y="103" fill="#9ca3af" fontSize="9" textAnchor="end" fontFamily="monospace">₹10K</text>
              <text x="32" y="63" fill="#9ca3af" fontSize="9" textAnchor="end" fontFamily="monospace">₹25K</text>
              <text x="32" y="23" fill="#9ca3af" fontSize="9" textAnchor="end" fontFamily="monospace">₹50K</text>
            </svg>
          </div>
        </Card>

        {/* Food Cost Breakdown */}
        <Card title="Food Cost Breakdown" subtitle="Raw ingredient cost versus item menu retail price">
          <div className="relative w-full h-52 mt-2 bg-white rounded-lg p-3 border border-gray-50 flex flex-col justify-between">
            {/* Chart Rows */}
            {[
              { name: 'Paneer Tikka', price: 240, cost: 90 },
              { name: 'Dal Makhani', price: 190, cost: 65 },
              { name: 'Chicken Kebab', price: 290, cost: 110 },
              { name: 'Masala Chaas', price: 30, cost: 8 }
            ].map((item, idx) => {
              const maxVal = 300;
              const priceWidth = (item.price / maxVal) * 100;
              const costWidth = (item.cost / maxVal) * 100;
              
              return (
                <div key={idx} className="flex flex-col gap-1 w-full text-xs">
                  <div className="flex justify-between font-medium text-gray-700">
                    <span>{item.name}</span>
                    <span className="font-mono text-[10px]">Price: ₹{item.price} | Cost: ₹{item.cost}</span>
                  </div>
                  <div className="w-full h-3.5 bg-gray-100 rounded-md overflow-hidden relative flex items-center">
                    {/* Menu Price Bar */}
                    <div
                      style={{ width: `${priceWidth}%` }}
                      className="h-full bg-orange-500 rounded-md transition-all duration-500"
                    />
                    {/* Cost Bar Overlay */}
                    <div
                      style={{ width: `${costWidth}%` }}
                      className="h-full bg-orange-800 rounded-l-md absolute left-0 top-0 transition-all duration-500 opacity-80"
                    />
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="flex gap-4 justify-end text-[10px] text-gray-500 font-semibold border-t border-gray-100 pt-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded bg-orange-500 block" />
                <span>Menu Price</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded bg-orange-800 opacity-80 block" />
                <span>Raw Material Cost</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
