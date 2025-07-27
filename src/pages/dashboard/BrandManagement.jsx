import React, { useState, useEffect, useCallback } from 'react';
import { getData, postData, putData, deleteData } from '../../utils/http';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Grid, 
  InputAdornment,
  Chip,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  ToggleOn, 
  ToggleOff,
  Upload as UploadIcon
} from '@mui/icons-material';
import { img_url } from '../../config/api_route';

const BrandManagement = () => {
  // State variables
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Search state
  const [search, setSearch] = useState('');

  // Custom debounce function
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
      fetchBrands(1, pagination.limit, searchValue);
    }, 500),
    [pagination.limit]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  // Fetch brands with pagination and search
  const fetchBrands = async (page = 1, limit = 10, searchQuery = search) => {
    setLoading(true);
    try {
      const response = await getData(`/brands?page=${page}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`);
      setBrands(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        pages: response.pagination.pages
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch brands');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBrands(pagination.page, pagination.limit, search);
  }, []);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchBrands(newPage, pagination.limit, search);
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modal functions
  const openModal = (brand = null) => {
    if (brand) {
      setFormData({
        id: brand._id,
        name: brand.name,
        description: brand.description || ''
      });
      setIsEditing(true);
      setLogoPreview(img_url +""+brand.logo ?? "");
    } else {
      setFormData({
        id: null,
        name: '',
        description: ''
      });
      setIsEditing(false);
      setLogoPreview('');
      setLogoFile(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      id: null,
      name: '',
      description: ''
    });
    setIsEditing(false);
    setLogoPreview('');
    setLogoFile(null);
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Brand name is required');
      return;
    }
    
    if (!isEditing && !logoFile) {
      setError('Logo is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      if (formData.description) {
        formDataObj.append('description', formData.description);
      }
      
      // Append logo if selected
      if (logoFile) {
        formDataObj.append('logo', logoFile);
      }
      
      if (isEditing) {
        await putData(`/brands/${formData.id}`, formDataObj);
        setMessage('Brand updated successfully');
      } else {
        await postData('/brands', formDataObj);
        setMessage('Brand created successfully');
      }
      
      closeModal();
      fetchBrands(pagination.page, pagination.limit, search);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Toggle brand status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await putData(`/brands/${id}/status`, { isActive: !currentStatus });
      setMessage(`Brand ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchBrands(pagination.page, pagination.limit, search);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Delete brand
  const openDeleteConfirm = (brand) => {
    setBrandToDelete(brand);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setBrandToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    
    try {
      await deleteData(`/brands/${brandToDelete._id}`);
      setMessage('Brand deleted successfully');
      fetchBrands(pagination.page, pagination.limit, search);
      closeDeleteConfirm();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Brand Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          Add New Brand
        </Button>
      </Box>

      {/* Messages */}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search brands..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
        />
      </Paper>

      {/* Brands Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => {
console.log(img_url+brand.logo,"BRAND")
                return <TableRow key={brand._id}>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>
                    {brand?.logo ? (
                      <Avatar 
                        src={img_url+brand.logo} 
                        alt={brand.name}
                        sx={{ height :60 , width:50, objectFit: 'cover',width:"80%" }}
                        variant="rounded"
                      />
                    ) : (
                    // <>hi</>
                      <Chip label="No Logo" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {brand.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={brand.isActive ? 'Active' : 'Inactive'} 
                      color={brand.isActive ? 'success' : 'error'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="Edit">
                        <IconButton 
                          color="primary" 
                          onClick={() => openModal(brand)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
})
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={pagination.pages} 
            page={pagination.page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}

      {/* Add/Edit Brand Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brand Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!formData.name.trim()}
                helperText={!formData.name.trim() ? 'Brand name is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ p: 1.5 }}
              >
                {isEditing ? 'Change Logo' : 'Upload Logo *'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </Button>
              {!isEditing && !logoFile && (
                <Typography variant="caption" color="error">
                  Logo is required for new brands
                </Typography>
              )}
              {logoPreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} 
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !formData.name.trim() || (!isEditing && !logoFile)}
          >
            {loading ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

          
    </Box>
  );
};

export default BrandManagement;
