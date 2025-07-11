import React, { useEffect, useState, useRef } from 'react';
import { getData } from '../../utils/http';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box
} from '@mui/material';

const BulkOrderManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const debounceRef = useRef();

    const fetchLeads = async (pageNum = 0, limitNum = 10, searchVal = '') => {
        setLoading(true);
        try {
            const res = await getData(`/bulk-orders`, { page: pageNum + 1, limit: limitNum, search: searchVal });
            setLeads(res.data || []);
            setTotal(res.total || 0);
        } catch (err) {
            setError('Failed to fetch bulk orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads(page, rowsPerPage, search);
    }, [page, rowsPerPage, search]);

    // Debounce search input
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearch(searchInput);
            setPage(0);
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [searchInput]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Bulk Order Inquiries</h1>
            <Box mb={2}>
                <TextField
                    label="Search by name, email, or phone"
                    variant="outlined"
                    size="small"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    style={{ maxWidth: 320 }}
                />
            </Box>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leads.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} align="center">No bulk orders found.</TableCell></TableRow>
                                ) : leads.map(lead => (
                                    <TableRow key={lead._id}>
                                        <TableCell>{lead.name}</TableCell>
                                        <TableCell>{lead.email}</TableCell>
                                        <TableCell>{lead.phone}</TableCell>
                                        <TableCell>
                                            {lead.message.length > 40 ? (
                                                <>
                                                    {lead.message.slice(0, 40)}...{' '}
                                                    <Button size="small" onClick={() => setSelectedMessage(lead.message)}>View</Button>
                                                </>
                                            ) : lead.message}
                                        </TableCell>
                                        <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
            <Dialog open={!!selectedMessage} onClose={() => setSelectedMessage(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Full Message</DialogTitle>
                <DialogContent>
                    <div className="whitespace-pre-line break-words text-gray-800">{selectedMessage}</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedMessage(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BulkOrderManagement; 