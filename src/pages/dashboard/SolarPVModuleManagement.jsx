import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  FormControl, InputLabel, Select, MenuItem, Grid, Typography, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, InputAdornment, Chip
} from "@mui/material";
import { FiSearch, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { getData, postData, putData, deleteData } from "../../utils/http";
import { img_url } from "../../config/api_route";
import { toast } from "react-hot-toast";

const SolarPVModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productLines, setProductLines] = useState([]); // <-- NEW
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // For uploading
  const [imagePreviews, setImagePreviews] = useState([]); // For preview
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    productLine: "", // <-- NEW
    name: "",
    description: "",
    modelName: "",
    sku: "",
    type: "",
    weight: "",
    dimension: "",
    manufacturer: "",
    packer: "",
    importer: "",
    replacementPolicy: "",
    staticTags: [],
    price: "",
    isFeatured: false,
  });
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 });
  const [search, setSearch] = useState("");

  // Fetch List
  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = `page=${pagination.page + 1}&limit=${pagination.limit}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;
      const response = await getData(`/solar-pv-modules?${queryParams}`);
      setModules(response.data || []);
      setPagination((prev) => ({
        ...prev,
        page: response.pagination?.page ? response.pagination.page - 1 : 0, // backend is 1-based, TablePagination is 0-based
        limit: response.pagination?.limit || prev.limit,
        total: response.total || 0
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch PV Modules");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  // Fetch Categories/Brands/ProductLines
  const fetchCategories = async () => { try { setCategories((await getData("/categories")).data); } catch { } };
  const fetchBrands = async () => { try { setBrands((await getData("/brands")).data); } catch { } };
  const fetchProductLines = async () => { // <-- NEW
    try {
      const response = await getData("/product-lines"); // change path if your API differs
      setProductLines(response.productLines || []);
    } catch { }
  };

  useEffect(() => { fetchModules(); fetchCategories(); fetchBrands(); fetchProductLines(); }, [fetchModules]);

  // Table handlers
  const handleSearchChange = (event) => setSearch(event.target.value);
  const applySearch = () => { setPagination({ ...pagination, page: 0 }); fetchModules(); };
  const resetFilters = () => { setSearch(""); setPagination({ ...pagination, page: 0 }); fetchModules(); };
  const handlePageChange = (_, newPage) => setPagination((p) => ({ ...p, page: newPage }));
  const handleChangeRowsPerPage = (event) => setPagination((p) => ({ ...p, limit: parseInt(event.target.value, 10), page: 0 }));

  // Modal Form handlers
  const handleInputChange = (event) =>
    setFormData((draft) => ({
      ...draft,
      [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
    }));
  const handleTagsInputChange = (event) => setTagsInput(event.target.value);

  // Multiple Images Upload
  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        category: item.category?._id || item.category || "",
        brand: item.brand?._id || item.brand || "",
        productLine: item.productLine?._id || item.productLine || "", // <-- NEW
        name: item.name || "",
        description: item.description || "",
        modelName: item.modelName || "",
        sku: item.sku || "",
        type: item.type || "",
        weight: item.weight || "",
        dimension: item.dimension || "",
        manufacturer: item.manufacturer || "",
        packer: item.packer || "",
        importer: item.importer || "",
        replacementPolicy: item.replacementPolicy || "",
        staticTags: item.staticTags || [],
        price: item.price || "",
        isFeatured: !!item.isFeatured,
      });
      setTagsInput((item.staticTags || []).join(", "));
      setIsEditing(true);
      setCurrentId(item._id);
      setImageFiles([]);
      setImagePreviews(item.images?.length ? item.images.map(img => `${img_url}${img}`) : []);
    } else {
      setFormData({
        category: "", brand: "", productLine: "", name: "", description: "",
        modelName: "", sku: "", type: "", weight: "", dimension: "",
        manufacturer: "", packer: "", importer: "", replacementPolicy: "",
        staticTags: [], price: "", isFeatured: false,
      });
      setTagsInput("");
      setIsEditing(false);
      setCurrentId(null);
      setImageFiles([]);
      setImagePreviews([]);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const cleanedTagsArray = tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
      const multipartFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "staticTags") {
          multipartFormData.append("staticTags", JSON.stringify(cleanedTagsArray));
        } else {
          multipartFormData.append(key, formData[key]);
        }
      });
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => multipartFormData.append("images", file));
      }

      if (isEditing) {
        await putData(`/solar-pv-modules/${currentId}`, multipartFormData);
        toast.success("Updated successfully");
      } else {
        await postData("/solar-pv-modules", multipartFormData);
        toast.success("Created successfully");
      }
      handleCloseModal();
      fetchModules();
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await deleteData(`/solar-pv-modules/${id}`);
        toast.success("Deleted successfully");
        fetchModules();
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Solar PV Module Management
      </Typography>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth label="Search PV Modules" variant="outlined" value={search}
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
          <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button variant="outlined" onClick={resetFilters}>Reset</Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<FiPlus />} onClick={() => handleOpenModal()}>
          Add New Solar PV Module
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Images</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Product Line</TableCell> {/* <-- NEW */}
              <TableCell>Model</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Dimension</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Packer</TableCell>
              <TableCell>Importer</TableCell>
              <TableCell>Replacement Policy</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={17} align="center">Loading...</TableCell>
              </TableRow>
            ) : modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={17} align="center">No PV Modules found</TableCell>
              </TableRow>
            ) : (
              modules.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {item.images?.length
                        ? item.images.map((img, idx) => (
                          <img key={idx} src={`${img_url}${img}`} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                        ))
                        : "No image"}
                    </Box>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category?.name || "N/A"}</TableCell>
                  <TableCell>{item.brand?.name || "N/A"}</TableCell>
                  <TableCell>{item.productLine?.name || "N/A"}</TableCell> {/* <-- NEW */}
                  <TableCell>{item.modelName || "N/A"}</TableCell>
                  <TableCell>{item.sku || "N/A"}</TableCell>
                  <TableCell>{item.type || "N/A"}</TableCell>
                  <TableCell>₹{item.price || "N/A"}</TableCell>
                  <TableCell>{item.dimension || "N/A"}</TableCell>
                  <TableCell>{item.weight || "N/A"}</TableCell>
                  <TableCell>{item.manufacturer || "N/A"}</TableCell>
                  <TableCell>{item.packer || "N/A"}</TableCell>
                  <TableCell>{item.importer || "N/A"}</TableCell>
                  <TableCell>{item.replacementPolicy || "N/A"}</TableCell>
                  <TableCell>
                    {Array.isArray(item.staticTags) ? item.staticTags.map((tag, idx) => (
                      <Chip size="small" label={tag} key={idx} sx={{ m: 0.25 }} />
                    )) : ""}
                  </TableCell>
                  <TableCell>{item.isFeatured ? '✔️' : '❌'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(item)} color="primary"><FiEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(item._id)} color="error"><FiTrash2 /></IconButton>
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
        <DialogTitle>{isEditing ? "Edit Solar PV Module" : "Add New Solar PV Module"}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select name="category" value={formData.category} onChange={handleInputChange} label="Category">
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
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

              {/* NEW: Product Line */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Product Line</InputLabel>
                  <Select name="productLine" value={formData.productLine} onChange={handleInputChange} label="Product Line">
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
                <TextField fullWidth label="Model Name" name="modelName" value={formData.modelName} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="SKU" name="sku" value={formData.sku} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select name="type" value={formData.type} onChange={handleInputChange} label="Type">
                    <MenuItem value="">Select type</MenuItem>
                    <MenuItem value="polycrystalline">Polycrystalline</MenuItem>
                    <MenuItem value="monocrystalline">Monocrystalline</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Weight (Kg)" name="weight" type="number" value={formData.weight} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Dimension" name="dimension" value={formData.dimension} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Packer" name="packer" value={formData.packer} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Importer" name="importer" value={formData.importer} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Replacement Policy" name="replacementPolicy" value={formData.replacementPolicy} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Description" name="description"
                  value={formData.description} onChange={handleInputChange} multiline rows={2}
                />
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
                  Upload Images
                  <input type="file" hidden accept="image/*" onChange={handleImagesChange} multiple />
                </Button>
                {imagePreviews.length > 0 && (
                  <Box mt={2} textAlign="center" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {imagePreviews.map((src, idx) => (
                      <img key={idx} src={src} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }} />
                    ))}
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
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SolarPVModuleManagement;
