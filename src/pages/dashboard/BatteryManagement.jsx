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
  Chip
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
  const [compatibleManufacturersInput, setCompatibleManufacturersInput] = useState([]);
  const [compatibleModelsInput, setCompatibleModelsInput] = useState([]);
  const [formData, setFormData] = useState({
    productLine: '',
    brand: '',
    category: '',
    subcategory: '',
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
    manufacturer: '',
    vehicleModel: '',
    compatibleManufacturers: [],
    compatibleModels: []
  });
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    batteryType: '',
    subcategory: '',
    minAH: '',
    maxAH: '',
    minPrice: '',
    maxPrice: '',
    manufacturer: '',
    productLine: ''
  });

  const subcategoryOptions = [
    { value: 'truck_battery', label: 'Truck Battery' },
    { value: '2_wheeler_battery', label: '2 Wheeler Battery' },
    { value: 'solar_battery', label: 'Solar Battery' },
    { value: 'genset_battery', label: 'Genset Battery' },
    { value: 'four_wheeler_battery', label: 'Four Wheeler Battery' }
  ];

  const fetchBatteries = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${search}`;
      if (filters.batteryType) queryParams += `&batteryType=${filters.batteryType}`;
      if (filters.subcategory) queryParams += `&subcategory=${filters.subcategory}`;
      if (filters.minAH) queryParams += `&minAH=${filters.minAH}`;
      if (filters.maxAH) queryParams += `&maxAH=${filters.maxAH}`;
      if (filters.minPrice) queryParams += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice) queryParams += `&maxPrice=${filters.maxPrice}`;
      if (filters.manufacturer) queryParams += `&manufacturer=${filters.manufacturer}`;
      if (filters.productLine) queryParams += `&productLine=${filters.productLine}`;
      const response = await getData(`/batteries?${queryParams}`);
      setBatteries(response.batteries || []);
      setPagination({
        ...pagination,
        page: response.pagination.page ? response.pagination.page - 1 : 0,
        limit: response.pagination.limit || pagination.limit,
        total: response.pagination.total || 0
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch batteries');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  const fetchCategories = async () => {
    try {
      const response = await getData('/categories');
      setCategories(response.data);
    } catch { }
  };

  const fetchBrands = async () => {
    try {
      const response = await getData('/brands');
      setBrands(response.data);
    } catch { }
  };

  const fetchProductLines = async () => {
    try {
      const response = await getData('/product-lines');
      setProductLines(response.productLines);
    } catch { }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await getData('/manufacturers');
      setManufacturers(response.manufacturers || []);
    } catch { }
  };

  const fetchVehicleModels = async () => {
    try {
      const response = await getData('/vehicle-models');
      setVehicleModels(response.vehicleModels || []);
    } catch { }
  };

  useEffect(() => {
    fetchBatteries();
    fetchCategories();
    fetchBrands();
    fetchProductLines();
    fetchManufacturers();
    fetchVehicleModels();
  }, [fetchBatteries]);

  const formatSubcategoryDisplay = (subcategory) => {
    const option = subcategoryOptions.find(opt => opt.value === subcategory);
    return option ? option.label : subcategory;
  };

  const handleSearchChange = (e) => setSearch(e.target.value);
  const applySearch = () => { setPagination({ ...pagination, page: 0 }); fetchBatteries(); };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const applyFilters = () => { setPagination({ ...pagination, page: 0 }); fetchBatteries(); };
  const resetFilters = () => {
    setFilters({ batteryType: '', subcategory: '', minAH: '', maxAH: '', minPrice: '', maxPrice: '', manufacturer: '', productLine: '' });
    setSearch('');
    setPagination({ ...pagination, page: 0 });
    fetchBatteries();
  };
  const handlePageChange = (event, newPage) => setPagination({ ...pagination, page: newPage });
  const handleChangeRowsPerPage = (event) => setPagination({ ...pagination, limit: parseInt(event.target.value, 10), page: 0 });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFeaturesInputChange = (e) => setFeaturesInput(e.target.value);

  const handleCompatibleManufacturersChange = (event) => {
    const { value } = event.target;
    setCompatibleManufacturersInput(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCompatibleModelsChange = (event) => {
    const { value } = event.target;
    setCompatibleModelsInput(typeof value === 'string' ? value.split(',') : value);
  };

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
        subcategory: battery.subcategory || '',
        name: battery.name,
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
        manufacturer: battery.manufacturer?._id || battery.manufacturer || '',
        vehicleModel: battery.vehicleModel?._id || battery.vehicleModel || '',
        compatibleManufacturers: battery.compatibleManufacturers || [],
        compatibleModels: battery.compatibleModels || []
      });
      setFeaturesInput((battery.features || []).join(', '));
      setCompatibleManufacturersInput(battery.compatibleManufacturers?.map(m => m._id || m) || []);
      setCompatibleModelsInput(battery.compatibleModels?.map(m => m._id || m) || []);
      setIsEditing(true);
      setCurrentId(battery._id);
      if (battery.image) setImagePreview(`${img_url}${battery.image}`); else setImagePreview('');
      setImageFile(null);
    } else {
      setFormData({
        productLine: '',
        brand: '',
        category: '',
        subcategory: '',
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
        manufacturer: '',
        vehicleModel: '',
        compatibleManufacturers: [],
        compatibleModels: []
      });
      setFeaturesInput('');
      setCompatibleManufacturersInput([]);
      setCompatibleModelsInput([]);
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
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          formDataObj.append('features', JSON.stringify(cleanedFeaturesArray));
        } else if (key === 'compatibleManufacturers') {
          formDataObj.append('compatibleManufacturers', JSON.stringify(compatibleManufacturersInput));
        } else if (key === 'compatibleModels') {
          formDataObj.append('compatibleModels', JSON.stringify(compatibleModelsInput));
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
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
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="li ion">Li-ion</MenuItem>
                    <MenuItem value="lead acid">Lead Acid</MenuItem>
                    <MenuItem value="smf">SMF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    name="subcategory"
                    value={filters.subcategory}
                    onChange={handleFilterChange}
                    label="Subcategory"
                  >
                    <MenuItem value="">All Subcategories</MenuItem>
                    {subcategoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
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
                    <MenuItem value="">All Product Lines</MenuItem>
                    {productLines?.map((productLine) => (
                      <MenuItem key={productLine._id} value={productLine._id}>
                        {productLine.name}
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
                    <MenuItem value="">All Manufacturers</MenuItem>
                    {manufacturers?.map((manufacturer) => (
                      <MenuItem key={manufacturer._id} value={manufacturer._id}>
                        {manufacturer.name}
                      </MenuItem>
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
              <TableCell>Subcategory</TableCell>
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
                  <TableCell>{formatSubcategoryDisplay(battery?.subcategory || "N/A")}</TableCell>
                  <TableCell>{battery?.brand?.name || 'N/A'}</TableCell>
                  <TableCell>{battery?.manufacturer?.name || 'N/A'}</TableCell>
                  <TableCell>{battery?.vehicleModel?.name || 'N/A'}</TableCell>
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
                    <MenuItem value="">Select Product Line</MenuItem>
                    {productLines?.map((productLine) => (
                      <MenuItem key={productLine._id} value={productLine._id}>{productLine.name}</MenuItem>
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
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    label="Subcategory"
                  >
                    {subcategoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
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
                <FormControl fullWidth>
                  <InputLabel>Manufacturer</InputLabel>
                  <Select
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    label="Manufacturer"
                  >
                    <MenuItem value="">Select Manufacturer</MenuItem>
                    {manufacturers?.map((manufacturer) => (
                      <MenuItem key={manufacturer._id} value={manufacturer._id}>{manufacturer.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vehicle Model</InputLabel>
                  <Select
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    label="Vehicle Model"
                  >
                    <MenuItem value="">Select Vehicle Model</MenuItem>
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Compatible Manufacturers</InputLabel>
                  <Select
                    multiple
                    name="compatibleManufacturers"
                    value={compatibleManufacturersInput}
                    onChange={handleCompatibleManufacturersChange}
                    label="Compatible Manufacturers"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const manufacturer = manufacturers.find(m => m._id === value);
                          return <Chip key={value} label={manufacturer?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {manufacturers?.map((manufacturer) => (
                      <MenuItem key={manufacturer._id} value={manufacturer._id}>
                        {manufacturer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Compatible Models</InputLabel>
                  <Select
                    multiple
                    name="compatibleModels"
                    value={compatibleModelsInput}
                    onChange={handleCompatibleModelsChange}
                    label="Compatible Models"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const model = vehicleModels.find(m => m._id === value);
                          return <Chip key={value} label={model?.name || value} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {vehicleModels?.map((model) => (
                      <MenuItem key={model._id} value={model._id}>
                        {model.name} ({model.manufacturer?.name})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
