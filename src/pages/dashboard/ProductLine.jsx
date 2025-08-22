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

const ProductLineManagement = () => {
    const [productLines, setProductLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 10,
        total: 0
    });
    const [search, setSearch] = useState('');

    const fetchProductLines = useCallback(async () => {
        setLoading(true);
        try {
            let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
            if (search) queryParams += `&search=${search}`;

            const response = await getData(`/product-lines?${queryParams}`);
            setProductLines(response.productLines || []);

            if (response.pagination) {
                setPagination({
                    ...pagination,
                    page: response.pagination.page ? response.pagination.page - 1 : 0,
                    limit: response.pagination.limit || pagination.limit,
                    total: response.pagination.total || 0
                });
            } else {
                // If no pagination in response, assume all data is loaded
                setPagination({
                    ...pagination,
                    total: response.count || response.data?.length || 0
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch product lines');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search]);

    useEffect(() => {
        fetchProductLines();
    }, [fetchProductLines]);

    // Search handlers
    const handleSearchChange = (e) => setSearch(e.target.value);

    const applySearch = () => {
        setPagination({ ...pagination, page: 0 });
        fetchProductLines();
    };

    const resetFilters = () => {
        setSearch('');
        setPagination({ ...pagination, page: 0 });
        fetchProductLines();
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
    const handleOpenModal = (productLine = null) => {
        if (productLine) {
            setFormData({
                name: productLine.name || ''
            });
            setIsEditing(true);
            setCurrentId(productLine._id);
        } else {
            setFormData({
                name: ''
            });
            setIsEditing(false);
            setCurrentId(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({ name: '' });
        setIsEditing(false);
        setCurrentId(null);
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error('Product line name is required');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isEditing) {
                response = await putData(`/product-lines/${currentId}`, formData);
                toast.success('Product line updated successfully');
            } else {
                response = await postData('/product-lines', formData);
                toast.success('Product line created successfully');
            }

            handleCloseModal();
            fetchProductLines();
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Product Line Management
            </Typography>

            {/* Search Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search Product Lines"
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
                    <Grid item xs={12} md={6} container justifyContent="flex-end" spacing={1}>
                        <Grid item>
                            <Button variant="outlined" onClick={resetFilters}>
                                Reset
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={applySearch}>
                                Search
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
                    Add New Product Line
                </Button>
            </Box>

            {/* Product Lines Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Updated Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && productLines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : productLines?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No product lines found
                                </TableCell>
                            </TableRow>
                        ) : (
                            productLines?.map((productLine) => (
                                <TableRow key={productLine?._id}>
                                    <TableCell>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {productLine?.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {productLine?.createdAt
                                            ? new Date(productLine.createdAt).toLocaleDateString()
                                            : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {productLine?.updatedAt
                                            ? new Date(productLine.updatedAt).toLocaleDateString()
                                            : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpenModal(productLine)}
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
                    {isEditing ? 'Edit Product Line' : 'Add New Product Line'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Product Line Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product line name"
                                    helperText="Enter a unique name for the product line"
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

export default ProductLineManagement;
