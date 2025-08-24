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

const UPSManagement = () => {
  const [upsList, setUpsList] = useState([]);
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
    type: '',
    outputPowerWattage: '',
    inputVoltage: '',
    outputVoltage: '',
    inputFreq: '',
    outputFreq: '',
    dimension: '',
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
    minWattage: '',
    maxWattage: '',
    minPrice: '',
    maxPrice: ''
  });

  const fetchUps = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;
      if (filters.minWattage) queryParams += `&minWattage=${filters.minWattage}`;
      if (filters.maxWattage) queryParams += `&maxWattage=${filters.maxWattage}`;
      if (filters.minPrice) queryParams += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) queryParams += `&maxPrice=${filters.maxPrice}`;
      const response = await getData(`/ups?${queryParams}`);
      setUpsList(response.data);
      setPagination({
        ...pagination,
        page: response.pagination.page - 1, // backend is 1-based, TablePagination is 0-based
        limit: response.pagination.limit,
        total: response.total
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch UPS');
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
      // Adjust endpoint name if yours differs (e.g., '/productlines')
      const response = await getData('/product-lines');
      setProductLines(response.productLines || []);
    } catch { /* no-op */ }
  };

  useEffect(() => {
    fetchUps();
    fetchCategories();
    fetchBrands();
    fetchProductLines(); // <-- NEW
  }, [fetchUps]);

  const handleSearchChange = (event) => setSearch(event.target.value);
  const applySearch = () => { setPagination({ ...pagination, page: 0 }); fetchUps(); };
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const applyFilters = () => { setPagination({ ...pagination, page: 0 }); fetchUps(); };
  const resetFilters = () => {
    setFilters({ minWattage: '', maxWattage: '', minPrice: '', maxPrice: '' });
    setSearch('');
    setPagination({ ...pagination, page: 0 });
    fetchUps();
  };
  const handlePageChange = (event, newPage) => setPagination({ ...pagination, page: newPage });
  const handleChangeRowsPerPage = (event) => setPagination({ ...pagination, limit: parseInt(event.target.value, 10), page: 0 });

  // Form Input Handlers
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleFeaturesInputChange = (event) => setFeaturesInput(event.target.value);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (ups = null) => {
    if (ups) {
      setFormData({
        brand: ups.brand?._id || ups.brand || "",
        category: ups.category?._id || ups.category || "",
        productLine: ups.productLine?._id || ups.productLine || "", // <-- NEW
        name: ups.name,
        description: ups.description || '',
        features: ups.features || [],
        type: ups.type || '',
        outputPowerWattage: ups.outputPowerWattage || '',
        inputVoltage: ups.inputVoltage || '',
        outputVoltage: ups.outputVoltage || '',
        inputFreq: ups.inputFreq || '',
        outputFreq: ups.outputFreq || '',
        dimension: ups.dimension || '',
        warranty: ups.warranty || '',
        mrp: ups.mrp || '',
        sellingPrice: ups.sellingPrice || '',
        isFeatured: !!ups.isFeatured,
      });
      setFeaturesInput((ups.features || []).join(', '));
      setIsEditing(true);
      setCurrentId(ups._id);
      if (ups.image) setImagePreview(`${img_url}${ups.image}`); else setImagePreview('');
      setImageFile(null);
    } else {
      setFormData({
        brand: "",
        category: '',
        productLine: '', // <-- NEW
        name: '',
        description: '',
        features: [],
        type: '',
        outputPowerWattage: '',
        inputVoltage: '',
        outputVoltage: '',
        inputFreq: '',
        outputFreq: '',
        dimension: '',
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
        await putData(`/ups/${currentId}`, multipartFormData);
        toast.success('UPS updated successfully');
      } else {
        await postData('/ups', multipartFormData);
        toast.success('UPS created successfully');
      }

      handleCloseModal();
      fetchUps();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Status and delete (assuming isActive exists; otherwise remove this)
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await putData(`/ups/${id}/status`, { isActive: !currentStatus });
      toast.success(`UPS ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUps();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this UPS?')) {
      try {
        await deleteData(`/ups/${id}`);
        toast.success('UPS deleted successfully');
        fetchUps();
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        UPS Management
      </Typography>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search UPS"
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
                <TextField fullWidth label="Min Wattage" name="minWattage" type="number" value={filters.minWattage} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth label="Max Wattage" name="maxWattage" type="number" value={filters.maxWattage} onChange={handleFilterChange} variant="outlined" size="small" />
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
          Add New UPS
        </Button>
      </Box>

      {/* UPS Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Product Line</TableCell> {/* <-- NEW */}
              <TableCell>Wattage</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Warranty</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && upsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">Loading...</TableCell>
              </TableRow>
            ) : upsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">No UPS found</TableCell>
              </TableRow>
            ) : (
              upsList.map((upsItem) => (
                <TableRow key={upsItem._id}>
                  <TableCell>
                    {upsItem.image ? (
                      <img
                        src={`${img_url}${upsItem.image}`}
                        alt={upsItem.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : 'No image'}
                  </TableCell>
                  <TableCell>{upsItem.name}</TableCell>
                  <TableCell>{upsItem.category?.name || 'N/A'}</TableCell>
                  <TableCell>{upsItem.brand?.name || 'N/A'}</TableCell>
                  <TableCell>{upsItem.productLine?.name || 'N/A'}</TableCell> {/* <-- NEW */}
                  <TableCell>{upsItem.outputPowerWattage || 'N/A'} W</TableCell>
                  <TableCell>{upsItem.type || 'N/A'}</TableCell>
                  <TableCell>₹{upsItem.mrp || 'N/A'}</TableCell>
                  <TableCell>₹{upsItem.sellingPrice || 'N/A'}</TableCell>
                  <TableCell>{upsItem.warranty || 'N/A'}</TableCell>
                  <TableCell>{upsItem.isFeatured ? '✔️' : '❌'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(upsItem)} color="primary"><FiEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(upsItem._id)} color="error"><FiTrash2 /></IconButton>
                    {/* If you have isActive in your model */}
                    {/* <IconButton onClick={() => handleToggleStatus(upsItem._id, upsItem.isActive)} color={upsItem.isActive ? "success" : "default"}>
                      {upsItem.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                    </IconButton> */}
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
        <DialogTitle>{isEditing ? 'Edit UPS' : 'Add New UPS'}</DialogTitle>
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
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Type"
                  >
                    <MenuItem value="Online UPS">Online UPS</MenuItem>
                    <MenuItem value="Offline UPS / Line Interactive UPS">Offline UPS / Line Interactive UPS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Output Power (Watt)" name="outputPowerWattage" type="number" value={formData.outputPowerWattage} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Input Voltage (V)" name="inputVoltage" type="number" value={formData.inputVoltage} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Output Voltage (V)" name="outputVoltage" type="number" value={formData.outputVoltage} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Input Frequency (Hz)" name="inputFreq" type="number" value={formData.inputFreq} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Output Frequency (Hz)" name="outputFreq" type="number" value={formData.outputFreq} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Dimension" name="dimension" value={formData.dimension} onChange={handleInputChange} />
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

export default UPSManagement;
