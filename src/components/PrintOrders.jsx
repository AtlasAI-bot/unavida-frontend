import React, { useState } from 'react';
import { Search, Calendar, Filter, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PrintOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mock print order data
  const orders = [
    {
      id: 1,
      orderNumber: '#1024',
      student: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@email.com',
      textbook: 'Pharmacology I',
      quantity: 2,
      price: '$89.98',
      status: 'shipped',
      date: '2024-02-10',
      trackingNumber: 'TRK123456789',
      shippedDate: '2024-02-12',
      estimatedDelivery: '2024-02-18'
    },
    {
      id: 2,
      orderNumber: '#1023',
      student: 'Michael Chen',
      studentEmail: 'michael.chen@email.com',
      textbook: 'Advanced Pharmacology',
      quantity: 1,
      price: '$49.99',
      status: 'processing',
      date: '2024-02-13',
      trackingNumber: null,
      shippedDate: null,
      estimatedDelivery: '2024-02-20'
    },
    {
      id: 3,
      orderNumber: '#1022',
      student: 'Emma Davis',
      studentEmail: 'emma.davis@email.com',
      textbook: 'Pharmacology I',
      quantity: 3,
      price: '$134.97',
      status: 'pending',
      date: '2024-02-14',
      trackingNumber: null,
      shippedDate: null,
      estimatedDelivery: '2024-02-25'
    },
    {
      id: 4,
      orderNumber: '#1021',
      student: 'James Wilson',
      studentEmail: 'james.wilson@email.com',
      textbook: 'Advanced Pharmacology',
      quantity: 1,
      price: '$49.99',
      status: 'delivered',
      date: '2024-02-05',
      trackingNumber: 'TRK987654321',
      shippedDate: '2024-02-07',
      estimatedDelivery: '2024-02-10',
      deliveredDate: '2024-02-09'
    },
    {
      id: 5,
      orderNumber: '#1020',
      student: 'Lisa Anderson',
      studentEmail: 'lisa.anderson@email.com',
      textbook: 'Pharmacology I',
      quantity: 2,
      price: '$89.98',
      status: 'shipped',
      date: '2024-02-08',
      trackingNumber: 'TRK456789123',
      shippedDate: '2024-02-10',
      estimatedDelivery: '2024-02-16'
    },
    {
      id: 6,
      orderNumber: '#1019',
      student: 'Robert Martinez',
      studentEmail: 'robert.martinez@email.com',
      textbook: 'Advanced Pharmacology',
      quantity: 1,
      price: '$49.99',
      status: 'processing',
      date: '2024-02-12',
      trackingNumber: null,
      shippedDate: null,
      estimatedDelivery: '2024-02-22'
    },
    {
      id: 7,
      orderNumber: '#1018',
      student: 'Jennifer Lee',
      studentEmail: 'jennifer.lee@email.com',
      textbook: 'Pharmacology I',
      quantity: 1,
      price: '$49.99',
      status: 'delivered',
      date: '2024-02-01',
      trackingNumber: 'TRK111222333',
      shippedDate: '2024-02-03',
      estimatedDelivery: '2024-02-08',
      deliveredDate: '2024-02-07'
    }
  ];

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.includes(searchTerm) ||
                         order.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-orange-500" size={20} />;
      case 'processing':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'shipped':
        return <Truck className="text-blue-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    console.log(`Update order ${orderId} to status ${newStatus}`);
    // TODO: Implement status update API call
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Print Order Management</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order #, student name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-orange-50 p-4 rounded">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-orange-600">1</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">2</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">2</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">2</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header - Clickable */}
            <div
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-cyan-500 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center">
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.student}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.textbook}</p>
                  <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                </div>
                <div className="text-right min-w-fit ml-4">
                  <p className="font-bold text-green-600">{order.price}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="bg-gray-50 p-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order Date</p>
                    <p className="text-sm text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Student Email</p>
                    <p className="text-sm text-gray-900">{order.studentEmail}</p>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Tracking #</p>
                      <p className="text-sm text-gray-900 font-mono">{order.trackingNumber}</p>
                    </div>
                  )}
                  {order.shippedDate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Shipped</p>
                      <p className="text-sm text-gray-900">{new Date(order.shippedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {order.deliveredDate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Delivered</p>
                      <p className="text-sm text-gray-900">{new Date(order.deliveredDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {order.estimatedDelivery && order.status !== 'delivered' && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Est. Delivery</p>
                      <p className="text-sm text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* Status Update Buttons */}
                {order.status !== 'delivered' && (
                  <div className="pt-4 border-t border-gray-300">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Update Status:</p>
                    <div className="flex gap-2 flex-wrap">
                      {statuses.filter(s => s !== 'all').map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(order.id, status)}
                          className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                            order.status === status
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintOrders;
