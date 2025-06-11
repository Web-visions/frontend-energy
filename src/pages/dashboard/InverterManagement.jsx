import React, { useState, useEffect, useCallback } from 'react';
import { getData, postData, putData, deleteData } from '../../utils/http';
import { FiSearch, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiPlus } from 'react-icons/fi';
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
import { img_url } from '../../config/api_route';

const InverterManagement = () => {
  const [inverters, setInverters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [formData, setFormData] = useState({
    brand: "",
    category: '',
    name: '',
    description: '',
    features: [],
    dimension: '',
    capacity: '',
    warranty: '',
    mrp: '',
    priceWithoutOldBattery: '',
    priceWithOldBattery: ''
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    minCapacity: '',
    maxCapacity: '',
    minPrice: '',
    maxPrice: ''
  });

  const fetchInverters = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${search}`;
      if (filters.minCapacity) queryParams += `&minCapacity=${filters.minCapacity}`;
      if (filters.maxCapacity) queryParams += `&maxCapacity=${filters.maxCapacity}`;
      if (filters.minPrice) queryParams += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) queryParams += `&maxPrice=${filters.maxPrice}`;
      const response = await getData(`/inverters?${queryParams}`);
      setInverters(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch inverters');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  const fetchCategories = async () => {
    try {
      const response = await getData('/categories');
      setCategories(response.data);
    } catch {}
  };
  const fetchBrands = async () => {
    try {
      const response = await getData('/brands');
      setBrands(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchInverters();
    fetchCategories();
    fetchBrands();
  }, [fetchInverters]);

  // Search/filter/pagination handlers unchanged...

  const handleSearchChange = (e) => setSearch(e.target.value);
  const applySearch = () => { setPagination({ ...pagination, page: 0 }); fetchInverters(); };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const applyFilters = () => { setPagination({ ...pagination, page: 0 }); fetchInverters(); };
  const resetFilters = () => {
    setFilters({ minCapacity: '', maxCapacity: '', minPrice: '', maxPrice: '' });
    setSearch('');
    setPagination({ ...pagination, page: 0 });
    fetchInverters();
  };
  const handlePageChange = (event, newPage) => setPagination({ ...pagination, page: newPage });
  const handleChangeRowsPerPage = (event) => setPagination({ ...pagination, limit: parseInt(event.target.value, 10), page: 0 });

  // Form Input Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  // Use a separate input for features as string
  const handleFeaturesInputChange = (e) => setFeaturesInput(e.target.value);

  // Image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Modal open/close
  const handleOpenModal = (inverter = null) => {
    if (inverter) {
      setFormData({
        brand: inverter.brand?._id || inverter.brand || "",
        category: inverter.category?._id || inverter.category || "",
        name: inverter.name,
        description: inverter.description || '',
        features: inverter.features || [],
        dimension: inverter.dimension || '',
        capacity: inverter.capacity || '',
        warranty: inverter.warranty || '',
        mrp: inverter.mrp || '',
        priceWithoutOldBattery: inverter.priceWithoutOldBattery || '',
        priceWithOldBattery: inverter.priceWithOldBattery || ''
      });
      setFeaturesInput((inverter.features || []).join(', '));
      setIsEditing(true);
      setCurrentId(inverter._id);
      if (inverter.image) setImagePreview(`${img_url}${inverter.image}`); else setImagePreview('');
      setImageFile(null);
    } else {
      setFormData({
        brand: "",
        category: '',
        name: '',
        description: '',
        features: [],
        dimension: '',
        capacity: '',
        warranty: '',
        mrp: '',
        priceWithoutOldBattery: '',
        priceWithOldBattery: ''
      });
      setFeaturesInput('');
      setIsEditing(false);
      setCurrentId(null);
      setImagePreview('');
      setImageFile(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // always trim and split features
      const cleanedFeaturesArray = featuresInput
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          formDataObj.append('features', JSON.stringify(cleanedFeaturesArray));
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
      if (imageFile) formDataObj.append('image', imageFile);

      let response;
      if (isEditing) {
        response = await putData(`/inverters/${currentId}`, formDataObj);
        toast.success('Inverter updated successfully');
      } else {
        response = await postData('/inverters', formDataObj);
        toast.success('Inverter created successfully');
      }

      handleCloseModal();
      fetchInverters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Status and delete unchanged
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await putData(`/inverters/${id}/status`, { isActive: !currentStatus });
      toast.success(`Inverter ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchInverters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inverter?')) {
      try {
        await deleteData(`/inverters/${id}`);
        toast.success('Inverter deleted successfully');
        fetchInverters();
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Inverter Management
      </Typography>
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Inverters"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={applySearch}><FiSearch /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Min Capacity" name="minCapacity" type="number" value={filters.minCapacity} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Max Capacity" name="maxCapacity" type="number" value={filters.maxCapacity} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Min Price" name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Max Price" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button variant="outlined" onClick={resetFilters}>Reset</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
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
          Add New Inverter
        </Button>
      </Box>

      {/* Inverters Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Warranty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && inverters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Loading...</TableCell>
              </TableRow>
            ) : inverters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No inverters found</TableCell>
              </TableRow>
            ) : (
              inverters.map((inverter) => (
                <TableRow key={inverter._id}>
                  <TableCell>
                    {inverter.image ? (
                      <img src={`${img_url}${inverter.image}`} alt={inverter.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    ) : 'No image'}
                  </TableCell>
                  <TableCell>{inverter.name}</TableCell>
                  <TableCell>{inverter.category?.name || 'N/A'}</TableCell>
                  <TableCell>{inverter.capacity || 'N/A'}</TableCell>
                  <TableCell>₹{inverter.mrp || 'N/A'}</TableCell>
                  <TableCell>{inverter.warranty || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(inverter)} color="primary"><FiEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(inverter._id)} color="error"><FiTrash2 /></IconButton>
                    <IconButton onClick={() => handleToggleStatus(inverter._id, inverter.isActive)} color={inverter.isActive ? "success" : "default"}>
                      {inverter.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Inverter' : 'Add New Inverter'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    label="Brand"
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Dimension" name="dimension" value={formData.dimension} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Warranty" name="warranty" value={formData.warranty} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="MRP" name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Price Without Old Battery" name="priceWithoutOldBattery" type="number" value={formData.priceWithoutOldBattery} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Price With Old Battery" name="priceWithOldBattery" type="number" value={formData.priceWithOldBattery} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Features (comma-separated)"
                  name="features"
                  value={featuresInput}
                  onChange={handleFeaturesInputChange}
                  helperText="Enter features separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 6, border: '1px solid #eee' }} />
                  </Box>
                )}
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

export default InverterManagement;
