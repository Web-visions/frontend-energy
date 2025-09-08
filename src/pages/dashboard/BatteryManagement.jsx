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
  InputAdornment,
  Chip,
  Tooltip
} from '@mui/material';
import { img_url } from '../../config/api_route';

const BatteryManagement = () => {
  const [batteries, setBatteries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [formData, setFormData] = useState({
    productLine: '',
    brand: '',
    category: '',
    name: '',
    description: '',
    features: [],
    nominalFilledWeight: '',
    batteryType: 'lead acid',
    AH: '',
    dimension: '',
    warranty: '',
    mrp: '',
    priceWithoutOldBattery: '',
    priceWithOldBattery: '',
    isFeatured: false,
    // multi-select fields are arrays
    manufacturer: [],
    vehicleModel: [],
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    batteryType: '',
    minAH: '',
    maxAH: '',
    minPrice: '',
    maxPrice: '',
    manufacturer: '',
    productLine: ''
  });

  const fetchBatteries = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;
      if (filters.batteryType) queryParams += `&batteryType=${filters.batteryType}`;
      if (filters.minAH) queryParams += `&minAH=${filters.minAH}`;
      if (filters.maxAH) queryParams += `&maxAH=${filters.maxAH}`;
      if (filters.minPrice) queryParams += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) queryParams += `&maxPrice=${filters.maxPrice}`;
      if (filters.manufacturer) queryParams += `&manufacturer=${filters.manufacturer}`;
      if (filters.productLine) queryParams += `&productLine=${filters.productLine}`;
      const response = await getData(`/batteries?${queryParams}`);
      setBatteries(response.batteries || []);
      setPagination(prev => ({
        ...prev,
        page: response.pagination?.page ? response.pagination.page - 1 : prev.page,
        limit: response.pagination?.limit || prev.limit,
        total: response.pagination?.total || prev.total
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch batteries');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  const fetchCategories = async () => {
    try {
      const response = await getData('/categories');
      setCategories(response.data || []);
    } catch { /* ignore */ }
  };

  const fetchBrands = async () => {
    try {
      const response = await getData('/brands');
      setBrands(response.data || []);
    } catch { /* ignore */ }
  };

  const fetchProductLines = async () => {
    try {
      const response = await getData('/product-lines');
      setProductLines(response.productLines || []);
    } catch { /* ignore */ }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await getData('/manufacturers');
      setManufacturers(response.manufacturers || []);
    } catch { /* ignore */ }
  };

  const fetchVehicleModels = async () => {
    try {
      const response = await getData('/vehicle-models');
      setVehicleModels(response.vehicleModels || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchBatteries();
    fetchCategories();
    fetchBrands();
    fetchProductLines();
    fetchManufacturers();
    fetchVehicleModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const applySearch = () => { setPagination(prev => ({ ...prev, page: 0 })); fetchBatteries(); };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const applyFilters = () => { setPagination(prev => ({ ...prev, page: 0 })); fetchBatteries(); };
  const resetFilters = () => {
    setFilters({ batteryType: '', minAH: '', maxAH: '', minPrice: '', maxPrice: '', manufacturer: '', productLine: '' });
    setSearch('');
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchBatteries();
  };
  const handlePageChange = (event, newPage) => setPagination(prev => ({ ...prev, page: newPage }));
  const handleChangeRowsPerPage = (event) => setPagination(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 0 }));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // multi-select handlers
  const handleManufacturerChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, manufacturer: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleVehicleModelChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, vehicleModel: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleFeaturesInputChange = (e) => setFeaturesInput(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (battery = null) => {
    if (battery) {
      setFormData({
        productLine: battery.productLine?._id || battery.productLine || '',
        brand: battery.brand?._id || battery.brand || '',
        category: battery.category?._id || battery.category || '',
        name: battery.name || '',
        description: battery.description || '',
        features: battery.features || [],
        nominalFilledWeight: battery.nominalFilledWeight || '',
        batteryType: battery.batteryType || 'lead acid',
        AH: battery.AH || '',
        dimension: battery.dimension || '',
        warranty: battery.warranty || '',
        mrp: battery.mrp || '',
        priceWithoutOldBattery: battery.priceWithoutOldBattery || '',
        priceWithOldBattery: battery.priceWithOldBattery || '',
        isFeatured: !!battery.isFeatured,
        // ensure arrays of ids for multi-selects
        manufacturer: (battery.manufacturer || []).map(m => m._id || m),
        vehicleModel: (battery.vehicleModel || []).map(v => v._id || v),
      });
      setFeaturesInput((battery.features || []).join(', '));
      setIsEditing(true);
      setCurrentId(battery._id);
      if (battery.image) setImagePreview(`${img_url}${battery.image}`); else setImagePreview('');
      setImageFile(null);
    } else {
      setFormData({
        productLine: '',
        brand: '',
        category: '',
        name: '',
        description: '',
        features: [],
        nominalFilledWeight: '',
        batteryType: 'lead acid',
        AH: '',
        dimension: '',
        warranty: '',
        mrp: '',
        priceWithoutOldBattery: '',
        priceWithOldBattery: '',
        isFeatured: false,
        manufacturer: [],
        vehicleModel: [],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanedFeaturesArray = featuresInput.split(',').map(f => f.trim()).filter(Boolean);
      const formDataObj = new FormData();

      // append every field manually so arrays become JSON strings when needed
      formDataObj.append('productLine', formData.productLine || '');
      formDataObj.append('brand', formData.brand || '');
      formDataObj.append('category', formData.category || '');
      formDataObj.append('name', formData.name || '');
      formDataObj.append('description', formData.description || '');
      formDataObj.append('features', JSON.stringify(cleanedFeaturesArray));
      formDataObj.append('nominalFilledWeight', formData.nominalFilledWeight || '');
      formDataObj.append('batteryType', formData.batteryType || '');
      formDataObj.append('AH', formData.AH || '');
      formDataObj.append('dimension', formData.dimension || '');
      formDataObj.append('warranty', formData.warranty || '');
      formDataObj.append('mrp', formData.mrp || '');
      formDataObj.append('priceWithoutOldBattery', formData.priceWithoutOldBattery || '');
      formDataObj.append('priceWithOldBattery', formData.priceWithOldBattery || '');
      formDataObj.append('isFeatured', String(formData.isFeatured));

      // manufacturer and vehicleModel as JSON arrays
      formDataObj.append('manufacturer', JSON.stringify(formData.manufacturer || []));
      formDataObj.append('vehicleModel', JSON.stringify(formData.vehicleModel || []));


      if (imageFile) formDataObj.append('image', imageFile);

      let response;
      if (isEditing) {
        response = await putData(`/batteries/${currentId}`, formDataObj);
        toast.success('Battery updated successfully');
      } else {
        response = await postData('/batteries', formDataObj);
        toast.success('Battery created successfully');
      }

      handleCloseModal();
      fetchBatteries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await putData(`/batteries/${id}/status`, { isActive: !currentStatus });
      toast.success(`Battery ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchBatteries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this battery?')) {
      try {
        await deleteData(`/batteries/${id}`);
        toast.success('Battery deleted successfully');
        fetchBatteries();
      } catch (err) {
        toast.error(err.response?.data?.message || 'An error occurred');
      }
    }
  };

  // helper to render placeholder for single selects (MenuItem value "")
  const ChoiceItem = ({ label = 'Choose...' }) => <em style={{ color: '#666' }}>{label}</em>;

  // helper for multi-select renderValue to show placeholder when none selected
  const multiSelectRender = (selected, mapSource, placeholder = 'Choose...') => {
    if (!selected || selected.length === 0) return <em style={{ color: '#666' }}>{placeholder}</em>;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => {
          const item = mapSource.find(m => m._id === value);
          return <Chip key={value} label={item?.name || value} size="small" />;
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Battery Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Batteries"
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
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Battery Type</InputLabel>
                  <Select
                    name="batteryType"
                    value={filters.batteryType}
                    onChange={handleFilterChange}
                    label="Battery Type"
                  >
                    <MenuItem value=""><ChoiceItem label="All Types" /></MenuItem>
                    <MenuItem value="li ion">Li-ion</MenuItem>
                    <MenuItem value="lead acid">Lead Acid</MenuItem>
                    <MenuItem value="smf">SMF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Product Line</InputLabel>
                  <Select
                    name="productLine"
                    value={filters.productLine}
                    onChange={handleFilterChange}
                    label="Product Line"
                  >
                    <MenuItem value=""><ChoiceItem label="All Product Lines" /></MenuItem>
                    {productLines?.map((pl) => (
                      <MenuItem key={pl._id} value={pl._id}>
                        {pl.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Manufacturer</InputLabel>
                  <Select
                    name="manufacturer"
                    value={filters.manufacturer}
                    onChange={handleFilterChange}
                    label="Manufacturer"
                  >
                    <MenuItem value=""><ChoiceItem label="All Manufacturers" /></MenuItem>
                    {manufacturers?.map((m) => (
                      <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={2}>
                <TextField fullWidth label="Min AH" name="minAH" type="number" value={filters.minAH} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField fullWidth label="Max AH" name="maxAH" type="number" value={filters.maxAH} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField fullWidth label="Min Price" name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={2}>
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

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          onClick={() => handleOpenModal()}
        >
          Add New Battery
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Product Line</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Vehicle Model</TableCell>
              <TableCell>Battery Type</TableCell>
              <TableCell>AH</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Warranty</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && batteries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center">Loading...</TableCell>
              </TableRow>
            ) : batteries?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center">No batteries found</TableCell>
              </TableRow>
            ) : (
              batteries?.map((battery) => (
                <TableRow key={battery?._id}>
                  <TableCell>
                    {battery.image ? (
                      <img src={`${img_url}${battery?.image}`} alt={battery.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    ) : 'No image'}
                  </TableCell>
                  <TableCell>{battery?.name}</TableCell>
                  <TableCell>{battery?.productLine?.name || 'N/A'}</TableCell>
                  <TableCell>{battery?.category?.name || 'N/A'}</TableCell>
                  <TableCell>{battery?.brand?.name || 'N/A'}</TableCell>
                 <TableCell>
  {Array.isArray(battery?.manufacturer) && battery.manufacturer.length > 0 ? (
    <>
      {battery.manufacturer.slice(0, 2).map((m, index) => (
        <span key={m._id || index}>
          {m.name || m}
          {index < Math.min(1, battery.manufacturer.length - 1) && ', '}
        </span>
      ))}

      {battery.manufacturer.length > 2 && (
        <Tooltip
          title={battery.manufacturer
            .slice(2)
            .map(m => m.name || m)
            .join(', ')}
          arrow
        >
          <span
            style={{
              color: '#6F13D3',
              fontWeight: '500',
              marginLeft: 4,
              cursor: 'pointer'
            }}
          >
            +{battery.manufacturer.length - 2}
          </span>
        </Tooltip>
      )}
    </>
  ) : (
    'N/A'
  )}
</TableCell>

<TableCell>
  {Array.isArray(battery?.vehicleModel) && battery.vehicleModel.length > 0 ? (
    <>
      {battery.vehicleModel.slice(0, 2).map((v, index) => (
        <span key={v._id || index}>
          {v.name || v}
          {index < Math.min(1, battery.vehicleModel.length - 1) && ', '}
        </span>
      ))}

      {battery.vehicleModel.length > 2 && (
        <Tooltip
          title={battery.vehicleModel
            .slice(2)
            .map(v => v.name || v)
            .join(', ')}
          arrow
        >
          <span
            style={{
              color: '#6F13D3',
              fontWeight: '500',
              marginLeft: 4,
              cursor: 'pointer'
            }}
          >
            +{battery.vehicleModel.length - 2}
          </span>
        </Tooltip>
      )}
    </>
  ) : (
    'N/A'
  )}
</TableCell>


                  <TableCell>{battery?.batteryType || 'N/A'}</TableCell>
                  <TableCell>{battery?.AH || 'N/A'}</TableCell>
                  <TableCell>₹{battery?.mrp || 'N/A'}</TableCell>
                  <TableCell>{battery?.warranty || 'N/A'}</TableCell>
                  <TableCell>{battery?.isFeatured ? '✔️' : '❌'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(battery)} color="primary"><FiEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(battery._id)} color="error"><FiTrash2 /></IconButton>
                    <IconButton onClick={() => handleToggleStatus(battery._id, battery.isActive)} color={battery.isActive ? "success" : "default"}>
                      {battery.isActive ? <FiToggleRight /> : <FiToggleLeft />}
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

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Battery' : 'Add New Battery'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Product Line</InputLabel>
                  <Select
                    name="productLine"
                    value={formData.productLine}
                    onChange={handleInputChange}
                    label="Product Line"
                  >
                    <MenuItem value=""><ChoiceItem label="Choose..." /></MenuItem>
                    {productLines?.map((pl) => (
                      <MenuItem key={pl._id} value={pl._id}>{pl.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value=""><ChoiceItem label="Choose..." /></MenuItem>
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
                    <MenuItem value=""><ChoiceItem label="Choose..." /></MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Manufacturer MULTISELECT */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Manufacturer</InputLabel>
                  <Select
                    multiple
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleManufacturerChange}
                    label="Manufacturer"
                    renderValue={(selected) => multiSelectRender(selected, manufacturers, 'Choose...')}
                  >
                    {manufacturers?.map((manufacturer) => (
                      <MenuItem key={manufacturer._id} value={manufacturer._id}>
                        {manufacturer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Vehicle Model MULTISELECT */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vehicle Model</InputLabel>
                  <Select
                    multiple
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleVehicleModelChange}
                    label="Vehicle Model"
                    renderValue={(selected) => multiSelectRender(selected, vehicleModels, 'Choose...')}
                  >
                    {vehicleModels?.map((model) => (
                      <MenuItem key={model._id} value={model._id}>
                        {model.name} ({model.manufacturer?.name})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nominal Filled Weight" name="nominalFilledWeight" value={formData.nominalFilledWeight} onChange={handleInputChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Battery Type</InputLabel>
                  <Select
                    name="batteryType"
                    value={formData.batteryType}
                    onChange={handleInputChange}
                    label="Battery Type"
                  >
                    <MenuItem value="li ion">Li-ion</MenuItem>
                    <MenuItem value="lead acid">Lead Acid</MenuItem>
                    <MenuItem value="smf">SMF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="AH (Ampere Hour)" name="AH" type="number" value={formData.AH} onChange={handleInputChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Dimension" name="dimension" value={formData.dimension} onChange={handleInputChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Warranty" name="warranty" value={formData.warranty} onChange={handleInputChange} helperText="e.g., 24 months-6 months" />
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
                  rows={3}
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

export default BatteryManagement;
