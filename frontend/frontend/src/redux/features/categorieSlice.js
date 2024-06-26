import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getCategories = createAsyncThunk(
  "categorie/getAllCategorie",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/categories`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getCategorieByID = createAsyncThunk(
  "categorie/getCategorieByID",
  async (categorieId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getCategorie/${categorieId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createCategorie = createAsyncThunk(
  "categorie/createCategorie",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("/createCategories", formValue);
      toast.success("Categorie Added Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      toast.error(err.response.data?.message || "Some Backend error");
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateCategorie = createAsyncThunk(
  "categorie/updateCategorie",
  async ({ id, categorieData, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/updateCategorie/${id}`, categorieData);
      toast.success("Categorie Updated Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      toast.error(err.response.data?.message || "Some Backend error");
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteCategorie = createAsyncThunk(
  "categorie/deleteCategorie",
  async ({ id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/deleteCategorie/${id}`);
      toast.success("Categorie deleteded Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const categorieSlice = createSlice({
  name: "categorie",
  initialState: {
    categories: [],
    categorieByID: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [createCategorie.pending]: (state, action) => {
      state.loading = true;
    },
    [createCategorie.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload.data);
    },
    [createCategorie.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },

    [getCategories.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    [getCategories.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getCategorieByID.pending]: (state, action) => {
      state.loading = true;
    },
    [getCategorieByID.fulfilled]: (state, action) => {
      state.loading = false;
      state.categorieByID = action.payload;
    },
    [getCategorieByID.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [updateCategorie.pending]: (state, action) => {
      state.loading = true;
    },
    [updateCategorie.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.categories = state.categories.map((item) =>
          item.NomCat === id ? action.payload.categorie : item
        );
      }
    },
    [updateCategorie.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [deleteCategorie.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCategorie.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.categories = state.categories.filter(
          (item) => item.NomCat !== id
        );
      }
    },
    [deleteCategorie.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
  },
});

export const { setError } = categorieSlice.actions;

export default categorieSlice.reducer;
