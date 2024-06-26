import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getDepense = createAsyncThunk(
  "depense/getAllDepense",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/depenses`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getDepenseByID = createAsyncThunk(
  "depense/getDepenseByID",
  async (depenseId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getDepense/${depenseId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createDepense = createAsyncThunk(
  "depense/createDepense",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("/createDepense", formValue);
      toast.success("Depense Added Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateDepense = createAsyncThunk(
  "depense/updateDepense",
  async ({ id, formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/updateDepense/${id}`, formValue);
      toast.success("Depense Updated Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteDepense = createAsyncThunk(
  "depense/deleteDepense",
  async ({ id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/deleteDepense/${id}`);
      toast.success("Depense deleteded Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const depenseSlice = createSlice({
  name: "depense",
  initialState: {
    depenses: [],
    depenseByID: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [createDepense.pending]: (state, action) => {
      state.loading = true;
    },
    [createDepense.fulfilled]: (state, action) => {
      state.loading = false;
      state.depenses.push(action.payload.data);
    },
    [createDepense.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },

    [getDepense.pending]: (state, action) => {
      state.loading = true;
    },
    [getDepense.fulfilled]: (state, action) => {
      state.loading = false;
      state.depenses = action.payload;
    },
    [getDepense.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getDepenseByID.pending]: (state, action) => {
      state.loading = true;
    },
    [getDepenseByID.fulfilled]: (state, action) => {
      state.loading = false;
      state.depenseByID = action.payload;
    },
    [getDepenseByID.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [updateDepense.pending]: (state, action) => {
      state.loading = true;
    },
    [updateDepense.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.depenses = state.depenses.map((item) =>
          item.iddepense === id ? action.payload : item
        );
      }
    },
    [updateDepense.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [deleteDepense.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteDepense.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.depenses = state.depenses.filter((item) => item.iddepense !== id);
      }
    },
    [deleteDepense.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
  },
});

export const { setError } = depenseSlice.actions;

export default depenseSlice.reducer;
