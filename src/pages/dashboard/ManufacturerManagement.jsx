import React, { useState, useEffect, useCallback } from 'react';
import { getData, postData, putData } from '../../utils/http';
import { FiSearch, FiEdit, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    InputAdornment
} from '@mui/material';

// Enum options for category
const CATEGORY_OPTIONS = [
    { value: '2-wheeler', label: '2-Wheeler' },
    { value: '4-wheeler', label: '4-Wheeler' },
    { value: 'truck', label: 'Truck' }
];

const ManufacturerManagement = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: ''
    });
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 10,
        total: 0
    });
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ category: '' });

    const fetchManufacturers = useCallback(async () => {
        setLoading(true);
        try {
            let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
            if (search) queryParams += `&search=${encodeURIComponent(search)}`;
            if (filters.category) queryParams += `&category=${filters.category}`;

            const response = await getData(`/manufacturers?${queryParams}`);
            setManufacturers(response.manufacturers || []);

            if (response.pagination) {
                setPagination(prev => ({
                    ...prev,
                    page: response.pagination.page ? response.pagination.page - 1 : 0,
                    limit: response.pagination.limit || prev.limit,
                    total: response.pagination.total || 0
                }));
            } else {
                setPagination(prev => ({
                    ...prev,
                    total: response.count || response.data?.length || 0
                }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch manufacturers');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, filters]);

    useEffect(() => {
        fetchManufacturers();
    }, [fetchManufacturers]);

    // Handlers
    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    const applyFilters = () => {
        setPagination(prev => ({ ...prev, page: 0 }));
        fetchManufacturers();
    };
    const resetFilters = () => {
        setSearch('');
        setFilters({ category: '' });
        setPagination(prev => ({ ...prev, page: 0 }));
        fetchManufacturers();
    };
    const handlePageChange = (event, newPage) => setPagination(prev => ({ ...prev, page: newPage }));
    const handleChangeRowsPerPage = (event) => setPagination(prev => ({
        ...prev,
        limit: parseInt(event.target.value, 10),
        page: 0
    }));
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleOpenModal = (manufacturer = null) => {
        if (manufacturer) {
            setFormData({
                name: manufacturer.name || '',
                category: manufacturer.category || ''
            });
            setIsEditing(true);
            setCurrentId(manufacturer._id);
        } else {
            setFormData({ name: '', category: '' });
            setIsEditing(false);
            setCurrentId(null);
        }
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({ name: '', category: '' });
        setIsEditing(false);
        setCurrentId(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Manufacturer name is required');
            return;
        }
        if (!formData.category) {
            toast.error('Category is required');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await putData(`/manufacturers/${currentId}`, formData);
                toast.success('Manufacturer updated successfully');
            } else {
                await postData('/manufacturers', formData);
                toast.success('Manufacturer created successfully');
            }
            handleCloseModal();
            fetchManufacturers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manufacturer Management
            </Typography>

            {/* Search & Filter Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search Manufacturers"
                            variant="outlined"
                            value={search}
                            onChange={handleSearchChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={applyFilters}>
                                            <FiSearch />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                            <Select
                                labelId="category-filter-label"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {CATEGORY_OPTIONS.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4} container justifyContent="flex-end" spacing={1}>
                        <Grid item>
                            <Button variant="outlined" onClick={resetFilters}>
                                Reset
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={applyFilters}>
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Action Button */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={() => handleOpenModal()}
                >
                    Add New Manufacturer
                </Button>
            </Box>

            {/* Manufacturers Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Updated Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && manufacturers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : manufacturers?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No manufacturers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            manufacturers.map(manufacturer => (
                                <TableRow key={manufacturer._id}>
                                    <TableCell>{manufacturer.name}</TableCell>
                                    <TableCell>{manufacturer.category || 'N/A'}</TableCell>
                                    <TableCell>
                                        {manufacturer.createdAt
                                            ? new Date(manufacturer.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {manufacturer.updatedAt
                                            ? new Date(manufacturer.updatedAt).toLocaleDateString()
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenModal(manufacturer)}
                                            color="primary"
                                            size="small"
                                        >
                                            <FiEdit />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={pagination.total}
                    rowsPerPage={pagination.limit}
                    page={pagination.page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? 'Edit Manufacturer' : 'Add New Manufacturer'}</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Manufacturer Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter manufacturer name"
                                    helperText="Enter a unique name for the manufacturer"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {CATEGORY_OPTIONS.map(opt => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManufacturerManagement;
