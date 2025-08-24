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
import { no_image } from '../../assets';

const InverterManagement = () => {
  const [inverters, setInverters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productLines, setProductLines] = useState([]); // <-- NEW
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
    productLine: '', // <-- NEW
    name: '',
    description: '',
    features: [],
    dimension: '',
    capacity: '',
    warranty: '',
    mrp: '',
    sellingPrice: '',
    isFeatured: false,
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
    // you can add productLine filter later if needed
  });

  const fetchInverters = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;
      if (filters.minCapacity) queryParams += `&minCapacity=${filters.minCapacity}`;
      if (filters.maxCapacity) queryParams += `&maxCapacity=${filters.maxCapacity}`;
      if (filters.minPrice) queryParams += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) queryParams += `&maxPrice=${filters.maxPrice}`;
      // if you later add a productLine filter UI, do:
      // if (filters.productLine) queryParams += `&productLine=${filters.productLine}`;

      const response = await getData(`/inverters?${queryParams}`);
      setInverters(response.data);
      setPagination(prev => ({
        ...prev,
        page: response.pagination.page - 1, // backend is 1-based, TablePagination is 0-based
        limit: response.pagination.limit,
        total: response.total
      }));
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
    } catch { /* no-op */ }
  };

  const fetchBrands = async () => {
    try {
      const response = await getData('/brands');
      setBrands(response.data);
    } catch { /* no-op */ }
  };

  const fetchProductLines = async () => { // <-- NEW
    try {
      // adjust endpoint if yours differs, e.g., '/product-lines' or '/productlines'
      const response = await getData('/product-lines');
      setProductLines(response.productLines || []);
    } catch {
      // do not block UI on failure; keep going
    }
  };

  useEffect(() => {
    fetchInverters();
    fetchCategories();
    fetchBrands();
    fetchProductLines(); // <-- NEW
  }, [fetchInverters]);

  // Search / filter / pagination handlers
  const handleSearchChange = (event) => setSearch(event.target.value);
  const applySearch = () => { setPagination({ ...pagination, page: 0 }); fetchInverters(); };
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
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
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleFeaturesInputChange = (event) => setFeaturesInput(event.target.value);

  // Image handler
  const handleImageChange = (event) => {
    const file = event.target.files[0];
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
        productLine: inverter.productLine?._id || inverter.productLine || "", // <-- NEW
        name: inverter.name,
        description: inverter.description || '',
        features: inverter.features || [],
        dimension: inverter.dimension || '',
        capacity: inverter.capacity || '',
        warranty: inverter.warranty || '',
        mrp: inverter.mrp || '',
        sellingPrice: inverter.sellingPrice || '',
        isFeatured: !!inverter.isFeatured,
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
        productLine: '', // <-- NEW
        name: '',
        description: '',
        features: [],
        dimension: '',
        capacity: '',
        warranty: '',
        mrp: '',
        sellingPrice: '',
        isFeatured: false,
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const cleanedFeaturesArray = featuresInput
        .split(',')
        .map(feature => feature.trim())
        .filter(Boolean);

      const multipartFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          multipartFormData.append('features', JSON.stringify(cleanedFeaturesArray));
        } else {
          multipartFormData.append(key, formData[key]);
        }
      });
      if (imageFile) multipartFormData.append('image', imageFile);

      if (isEditing) {
        await putData(`/inverters/${currentId}`, multipartFormData);
        toast.success('Inverter updated successfully');
      } else {
        await postData('/inverters', multipartFormData);
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

  // Status and delete
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
              <TableCell>Brand</TableCell>
              <TableCell>Product Line</TableCell> {/* <-- NEW */}
              <TableCell>Capacity</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Warranty</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && inverters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">Loading...</TableCell>
              </TableRow>
            ) : inverters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">No inverters found</TableCell>
              </TableRow>
            ) : (
              inverters.map((inverter) => (
                <TableRow key={inverter._id}>
                  <TableCell>
                    {inverter?.image ? (
                      <img
                        src={`${img_url}${inverter.image}`}
                        alt={inverter.name}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = no_image; }}
                      />
                    ) : (
                      <img src={no_image} alt="no image found" style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }} />
                    )}
                  </TableCell>
                  <TableCell>{inverter.name}</TableCell>
                  <TableCell>{inverter.category?.name || 'N/A'}</TableCell>
                  <TableCell>{inverter.brand?.name || 'N/A'}</TableCell>
                  <TableCell>{inverter.productLine?.name || 'N/A'}</TableCell> {/* <-- NEW */}
                  <TableCell>{inverter.capacity || 'N/A'}</TableCell>
                  <TableCell>₹{inverter.mrp || 'N/A'}</TableCell>
                  <TableCell>{inverter.warranty || 'N/A'}</TableCell>
                  <TableCell>{inverter.isFeatured ? '✔️' : '❌'}</TableCell>
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

              {/* NEW: Product Line */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Product Line</InputLabel>
                  <Select
                    name="productLine"
                    value={formData.productLine}
                    onChange={handleInputChange}
                    label="Product Line"
                  >
                    {productLines.map((line) => (
                      <MenuItem key={line._id} value={line._id}>{line.name}</MenuItem>
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
                <TextField fullWidth label="Selling Price" name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleInputChange} />
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Box display="flex" alignItems="center" mt={2}>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      id="isFeatured"
                      style={{ marginRight: 8 }}
                    />
                    <label htmlFor="isFeatured">Featured Product</label>
                  </Box>
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

export default InverterManagement;
