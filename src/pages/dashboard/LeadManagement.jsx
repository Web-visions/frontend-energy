import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash, FiDownload, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getData, postData, putData, deleteData } from '../../utils/http';

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [filters, setFilters] = useState({
        status: 'all',
        projectType: 'all',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    useEffect(() => {
        fetchLeads();
        fetchStats();
    }, [pagination.page, filters]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            });

            const data = await getData(`/leads?${params}`);
            setLeads(data.docs || []);
            setPagination(prev => ({
                ...prev,
                total: data.totalDocs,
                totalPages: data.totalPages
            }));
        } catch (error) {
            toast.error('Error fetching leads');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await getData('/leads/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleStatusUpdate = async (leadId, newStatus) => {
        try {
            await putData(`/leads/${leadId}`, { status: newStatus });
            toast.success('Lead status updated successfully');
            fetchLeads();
            fetchStats();
        } catch (error) {
            toast.error('Error updating lead status');
        }
    };

    const handleDeleteLead = async (leadId) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;

        try {
            await deleteData(`/leads/${leadId}`);
            toast.success('Lead deleted successfully');
            fetchLeads();
            fetchStats();
        } catch (error) {
            toast.error('Error deleting lead');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            qualified: 'bg-green-100 text-green-800',
            converted: 'bg-purple-100 text-purple-800',
            lost: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getProjectTypeLabel = (type) => {
        const labels = {
            'off-grid-lead': 'Off Grid',
            'on-grid-lead': 'On Grid',
            'hybrid-lead': 'Hybrid'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Lead Management</h1>
                <p className="text-gray-600">Manage solar project leads and inquiries</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiPlus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalLeads || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiPlus className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">New Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.newLeads || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <FiPlus className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Contacted</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.statusStats?.find(s => s._id === 'contacted')?.count || 0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FiPlus className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Converted</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.statusStats?.find(s => s._id === 'converted')?.count || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name, contact, email..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                            <select
                                value={filters.projectType}
                                onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008246] focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="off-grid-lead">Off Grid</option>
                                <option value="on-grid-lead">On Grid</option>
                                <option value="hybrid-lead">Hybrid</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ status: 'all', projectType: 'all', search: '' })}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Leads</h3>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008246] mx-auto"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lead Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Project Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                                    <div className="text-sm text-gray-500">{lead.contact}</div>
                                                    {lead.email && (
                                                        <div className="text-sm text-gray-500">{lead.email}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getProjectTypeLabel(lead.projectType)}
                                                    </div>
                                                    {lead.loadInKW && (
                                                        <div className="text-sm text-gray-500">Load: {lead.loadInKW}</div>
                                                    )}
                                                    {lead.backupTime && (
                                                        <div className="text-sm text-gray-500">Backup: {lead.backupTime}</div>
                                                    )}
                                                    {lead.rooftopSpace && (
                                                        <div className="text-sm text-gray-500">Space: {lead.rooftopSpace}</div>
                                                    )}
                                                    {lead.sanctionLoad && (
                                                        <div className="text-sm text-gray-500">Sanction: {lead.sanctionLoad}</div>
                                                    )}
                                                    {lead.investmentAmount && (
                                                        <div className="text-sm text-gray-500">Budget: {lead.investmentAmount}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                                                    className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(lead.status)}`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="qualified">Qualified</option>
                                                    <option value="converted">Converted</option>
                                                    <option value="lost">Lost</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(lead.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteLead(lead._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FiTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                        {pagination.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LeadManagement; 