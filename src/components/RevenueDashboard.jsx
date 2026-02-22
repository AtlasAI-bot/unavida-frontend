import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

const RevenueDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Mock revenue data
  const totalRevenue = 52340;
  const monthlyRevenue = 8500;
  const yearlyProjection = 102000;
  const growthRate = 8.2;

  const schoolRevenue = [
    { name: 'CompuMed Vocational', revenue: 28340, students: 156, courses: 3, percentage: 54 },
    { name: 'American Healthcare', revenue: 18200, students: 67, courses: 2, percentage: 35 },
    { name: 'Future Clients', revenue: 5800, students: 24, courses: 1, percentage: 11 }
  ];

  const revenueBreakdown = [
    { type: 'Per-Seat Licensing', amount: 35000, color: 'bg-blue-500', percentage: 67 },
    { type: 'Print-on-Demand', amount: 12340, color: 'bg-purple-500', percentage: 24 },
    { type: 'Premium Features', amount: 5000, color: 'bg-green-500', percentage: 9 }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 6200, orders: 12 },
    { month: 'Feb', revenue: 8500, orders: 18 },
    { month: 'Mar', revenue: 7800, orders: 15 },
    { month: 'Apr', revenue: 9200, orders: 21 },
    { month: 'May', revenue: 8900, orders: 20 },
    { month: 'Jun', revenue: 11740, orders: 32 }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h2>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-blue-600">${monthlyRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">+18% vs last month</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Annual Projection</p>
            <p className="text-3xl font-bold text-purple-600">${yearlyProjection.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Based on growth trends</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
            <p className="text-3xl font-bold text-orange-600">{growthRate}%</p>
            <p className="text-xs text-gray-500 mt-2">Month over month</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" />
            Monthly Revenue Trend
          </h3>
          
          <div className="h-64 flex items-end gap-2">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t hover:from-blue-600 hover:to-cyan-500 transition-all cursor-pointer group relative"
                  style={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    ${data.revenue.toLocaleString()}
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-600">{data.month}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-gray-600">Avg Monthly</p>
              <p className="text-lg font-bold text-blue-600">$8,703</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-gray-600">Peak Month</p>
              <p className="text-lg font-bold text-green-600">$11,740 (Jun)</p>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown Pie */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-purple-500" />
            Revenue Breakdown
          </h3>

          <div className="flex items-center justify-between">
            {/* Donut Chart */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {revenueBreakdown.map((item, idx) => {
                  const circumference = 2 * Math.PI * 40;
                  const offset = circumference - (item.percentage / 100) * circumference;
                  const startAngle = revenueBreakdown.slice(0, idx).reduce((sum, i) => sum + i.percentage, 0);
                  
                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={item.color.replace('bg-', '')}
                      strokeWidth="15"
                      strokeDasharray={`${(item.percentage / 100) * circumference} ${circumference}`}
                      strokeDashoffset={-offset}
                      className="transition-all"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 flex-1 ml-8">
              {revenueBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.type}</p>
                    <p className="text-xs text-gray-500">${item.amount.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* School Revenue Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          Revenue by School
        </h3>

        <div className="space-y-4">
          {schoolRevenue.map((school, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.students} students • {school.courses} courses</p>
                </div>
                <p className="text-2xl font-bold text-green-600">${school.revenue.toLocaleString()}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : 'bg-green-500'} transition-all`}
                  style={{ width: `${school.percentage}%` }}
                ></div>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">{school.percentage}% of total</p>
                <p className="text-sm font-semibold text-gray-900">${(school.revenue / school.students).toFixed(0)}/student</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg shadow-md p-6 border border-cyan-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Export Revenue Report</h3>
            <p className="text-gray-600 text-sm">Download detailed revenue analytics and school breakdowns</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all">
            <Download size={20} />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
