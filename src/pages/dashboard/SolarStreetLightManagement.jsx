import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, Grid, Typography, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, InputAdornment
} from "@mui/material";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiPhoneCall, FiSend } from "react-icons/fi";
import { getData, postData, putData, deleteData } from "../../utils/http";
import { img_url } from "../../config/api_route";
import { toast } from "react-hot-toast";

const SolarStreetLightManagement = () => {
  const [lights, setLights] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    name: "",
    modelName: "",
    power: "",
    description: "",
    replacementPolicy: "",
    staticTags: [],
  });
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ minPower: "", maxPower: "" });

  // Fetch List
  const fetchLights = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${search}`;
      if (filters.minPower) queryParams += `&minPower=${filters.minPower}`;
      if (filters.maxPower) queryParams += `&maxPower=${filters.maxPower}`;
      const res = await getData(`/solar-street-lights?${queryParams}`);
      setLights(res.data || []);
      setPagination((prev) => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch lights");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  // Fetch Categories/Brands
  const fetchCategories = async () => { try { setCategories((await getData("/categories")).data); } catch {} };
  const fetchBrands = async () => { try { setBrands((await getData("/brands")).data); } catch {} };

  useEffect(() => { fetchLights(); fetchCategories(); fetchBrands(); }, [fetchLights]);

  // Table handlers
  const handleSearchChange = (e) => setSearch(e.target.value);
  const applySearch = () => { setPagination({ ...pagination, page: 0 }); fetchLights(); };
  const handleFilterChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const applyFilters = () => { setPagination({ ...pagination, page: 0 }); fetchLights(); };
  const resetFilters = () => {
    setFilters({ minPower: "", maxPower: "" });
    setSearch("");
    setPagination({ ...pagination, page: 0 });
    fetchLights();
  };
  const handlePageChange = (_, newPage) => setPagination((p) => ({ ...p, page: newPage }));
  const handleChangeRowsPerPage = (e) => setPagination((p) => ({ ...p, limit: parseInt(e.target.value, 10), page: 0 }));

  // Modal Form handlers
  const handleInputChange = (e) => setFormData((d) => ({ ...d, [e.target.name]: e.target.value }));
  const handleTagsInputChange = (e) => setTagsInput(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        category: item.category?._id || item.category || "",
        brand: item.brand?._id || item.brand || "",
        name: item.name || "",
        modelName: item.modelName || "",
        power: item.power || "",
        description: item.description || "",
        replacementPolicy: item.replacementPolicy || "",
        staticTags: item.staticTags || [],
      });
      setTagsInput((item.staticTags || []).join(", "));
      setIsEditing(true);
      setCurrentId(item._id);
      setImagePreview(item.image ? `${img_url}${item.image}` : "");
      setImageFile(null);
    } else {
      setFormData({
        category: "", brand: "", name: "", modelName: "", power: "", description: "", replacementPolicy: "", staticTags: [],
      });
      setTagsInput("");
      setIsEditing(false);
      setCurrentId(null);
      setImagePreview("");
      setImageFile(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanedTagsArray = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "staticTags") {
          formDataObj.append("staticTags", JSON.stringify(cleanedTagsArray));
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
      if (imageFile) formDataObj.append("image", imageFile);

      let response;
      if (isEditing) {
        response = await putData(`/solar-street-lights/${currentId}`, formDataObj);
        toast.success("Updated successfully");
      } else {
        response = await postData("/solar-street-lights", formDataObj);
        toast.success("Created successfully");
      }
      handleCloseModal();
      fetchLights();
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await deleteData(`/solar-street-lights/${id}`);
        toast.success("Deleted successfully");
        fetchLights();
      } catch (err) {
        toast.error(err?.response?.data?.message || "An error occurred");
      }
    }
  };

  // Actions: Quote / Callback
  const handleGetQuote = (id) => toast.success("Quote request sent for ID " + id);
  const handleRequestCallback = (id) => toast.success("Callback requested for ID " + id);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Solar Street Light Management
      </Typography>
      {/* Search + Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth label="Search Lights" variant="outlined" value={search}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={applySearch}><FiSearch /></IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField fullWidth label="Min Power (W)" name="minPower" type="number" value={filters.minPower} onChange={handleFilterChange} variant="outlined" size="small" />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField fullWidth label="Max Power (W)" name="maxPower" type="number" value={filters.maxPower} onChange={handleFilterChange} variant="outlined" size="small" />
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
      {/* Add Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<FiPlus />} onClick={() => handleOpenModal()}>
          Add New Solar Street Light
        </Button>
      </Box>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Power (W)</TableCell>
              <TableCell>Replacement Policy</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && lights.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Loading...</TableCell>
              </TableRow>
            ) : lights.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No lights found</TableCell>
              </TableRow>
            ) : (
              lights.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.image ? (
                      <img src={`${img_url}${item.image}`} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    ) : "No image"}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category?.name || "N/A"}</TableCell>
                  <TableCell>{item.brand?.name || "N/A"}</TableCell>
                  <TableCell>{item.modelName || "N/A"}</TableCell>
                  <TableCell>{item.power || "N/A"}</TableCell>
                  <TableCell>{item.replacementPolicy || "N/A"}</TableCell>
                  <TableCell>
                    {Array.isArray(item.staticTags) ? item.staticTags.join(", ") : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(item)} color="primary"><FiEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(item._id)} color="error"><FiTrash2 /></IconButton>
                    <IconButton onClick={() => handleGetQuote(item._id)} color="secondary"><FiSend title="Get Quote" /></IconButton>
                    <IconButton onClick={() => handleRequestCallback(item._id)} color="info"><FiPhoneCall title="Request Callback" /></IconButton>
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
        <DialogTitle>{isEditing ? "Edit Solar Street Light" : "Add New Solar Street Light"}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select name="category" value={formData.category} onChange={handleInputChange} label="Category">
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Brand</InputLabel>
                  <Select name="brand" value={formData.brand} onChange={handleInputChange} label="Brand">
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
                <TextField fullWidth label="Model Name" name="modelName" value={formData.modelName} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Power (Watt)" name="power" type="number" value={formData.power} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Replacement Policy" name="replacementPolicy" value={formData.replacementPolicy} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={2} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Tags (comma-separated)" name="staticTags"
                  value={tagsInput} onChange={handleTagsInputChange}
                  helperText="Enter tags separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 6, border: "1px solid #eee" }} />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SolarStreetLightManagement;
