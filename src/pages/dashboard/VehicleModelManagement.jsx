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

const VehicleModelManagement = () => {
    const [vehicleModels, setVehicleModels] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        manufacturer: ''
    });
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 10,
        total: 0
    });
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        manufacturer: ''
    });

    const fetchVehicleModels = useCallback(async () => {
        setLoading(true);
        try {
            let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
            if (search) queryParams += `&search=${search}`;
            if (filters.manufacturer) queryParams += `&manufacturer=${filters.manufacturer}`;

            const response = await getData(`/vehicle-models?${queryParams}`);
            setVehicleModels(response.vehicleModels || []);

            if (response.pagination) {
                setPagination({
                    ...pagination,
                    page: response.pagination.page ? response.pagination.page - 1 : 0,
                    limit: response.pagination.limit || pagination.limit,
                    total: response.pagination.total || 0
                });
            } else {
                setPagination({
                    ...pagination,
                    total: response.count || response.data?.length || 0
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch vehicle models');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, filters]);

    const fetchManufacturers = async () => {
        try {
            const response = await getData('/manufacturers');
            setManufacturers(response.manufacturers || []);
        } catch (err) {
            toast.error('Failed to fetch manufacturers');
        }
    };

    useEffect(() => {
        fetchVehicleModels();
        fetchManufacturers();
    }, [fetchVehicleModels]);

    // Search/filter handlers
    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applySearch = () => {
        setPagination({ ...pagination, page: 0 });
        fetchVehicleModels();
    };

    const applyFilters = () => {
        setPagination({ ...pagination, page: 0 });
        fetchVehicleModels();
    };

    const resetFilters = () => {
        setSearch('');
        setFilters({ manufacturer: '' });
        setPagination({ ...pagination, page: 0 });
        fetchVehicleModels();
    };

    // Pagination handlers
    const handlePageChange = (event, newPage) => {
        setPagination({ ...pagination, page: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setPagination({
            ...pagination,
            limit: parseInt(event.target.value, 10),
            page: 0
        });
    };

    // Form Input Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Modal open/close
    const handleOpenModal = (vehicleModel = null) => {
        if (vehicleModel) {
            setFormData({
                name: vehicleModel.name || '',
                manufacturer: vehicleModel.manufacturer?._id || vehicleModel.manufacturer || ''
            });
            setIsEditing(true);
            setCurrentId(vehicleModel._id);
        } else {
            setFormData({
                name: '',
                manufacturer: ''
            });
            setIsEditing(false);
            setCurrentId(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({ name: '', manufacturer: '' });
        setIsEditing(false);
        setCurrentId(null);
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error('Vehicle model name is required');
            return;
        }

        if (!formData.manufacturer) {
            toast.error('Manufacturer is required');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isEditing) {
                response = await putData(`/vehicle-models/${currentId}`, formData);
                toast.success('Vehicle model updated successfully');
            } else {
                response = await postData('/vehicle-models', formData);
                toast.success('Vehicle model created successfully');
            }

            handleCloseModal();
            fetchVehicleModels();
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Vehicle Model Management
            </Typography>

            {/* Search and Filter Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search Vehicle Models"
                            variant="outlined"
                            value={search}
                            onChange={handleSearchChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={applySearch}>
                                            <FiSearch />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Manufacturer</InputLabel>
                            <Select
                                name="manufacturer"
                                value={filters.manufacturer}
                                onChange={handleFilterChange}
                                label="Filter by Manufacturer"
                            >
                                <MenuItem value="">All Manufacturers</MenuItem>
                                {manufacturers.map((manufacturer) => (
                                    <MenuItem key={manufacturer._id} value={manufacturer._id}>
                                        {manufacturer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2} container justifyContent="flex-end" spacing={1}>
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
                    Add New Vehicle Model
                </Button>
            </Box>

            {/* Vehicle Models Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Model Name</TableCell>
                            <TableCell>Manufacturer</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Updated Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && vehicleModels.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : vehicleModels?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No vehicle models found
                                </TableCell>
                            </TableRow>
                        ) : (
                            vehicleModels?.map((vehicleModel) => (
                                <TableRow key={vehicleModel?._id}>
                                    <TableCell>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {vehicleModel?.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {vehicleModel?.manufacturer?.name || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {vehicleModel?.createdAt
                                            ? new Date(vehicleModel.createdAt).toLocaleDateString()
                                            : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {vehicleModel?.updatedAt
                                            ? new Date(vehicleModel.updatedAt).toLocaleDateString()
                                            : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenModal(vehicleModel)}
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
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isEditing ? 'Edit Vehicle Model' : 'Add New Vehicle Model'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Manufacturer</InputLabel>
                                    <Select
                                        name="manufacturer"
                                        value={formData.manufacturer}
                                        onChange={handleInputChange}
                                        label="Manufacturer"
                                    >
                                        {manufacturers.map((manufacturer) => (
                                            <MenuItem key={manufacturer._id} value={manufacturer._id}>
                                                {manufacturer.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Vehicle Model Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter vehicle model name"
                                    helperText="Enter a unique name for the vehicle model"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleModelManagement;
