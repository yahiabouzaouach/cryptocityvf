import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getFrais = createAsyncThunk(
  "frais/getAllFrais",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/frais`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getFraisByID = createAsyncThunk(
  "frais/getFraisByID",
  async (fraisId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getFrais/${fraisId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createFrais = createAsyncThunk(
  "frais/createFrais",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("/createFrais", formValue);
      toast.success("Frais Added Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateFrais = createAsyncThunk(
  "frais/updateFrais",
  async ({ id, formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/updateFrais/${id}`, formValue);
      toast.success("revenues Updated Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteFrais = createAsyncThunk(
  "frais/deleteFrais",
  async ({ id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/deleteFrais/${id}`);
      toast.success("revenues deleteded Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const fraislice = createSlice({
  name: "frais",
  initialState: {
    frais: [],
    fraisByID: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [createFrais.pending]: (state, action) => {
      state.loading = true;
    },
    [createFrais.fulfilled]: (state, action) => {
      state.loading = false;
      state.frais.push(action.payload.data);
    },
    [createFrais.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },

    [getFrais.pending]: (state, action) => {
      state.loading = true;
    },
    [getFrais.fulfilled]: (state, action) => {
      state.loading = false;
      state.frais = action.payload;
    },
    [getFrais.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getFraisByID.pending]: (state, action) => {
      state.loading = true;
    },
    [getFraisByID.fulfilled]: (state, action) => {
      state.loading = false;
      state.fraisByID = action.payload;
    },
    [getFraisByID.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [updateFrais.pending]: (state, action) => {
      state.loading = true;
    },
    [updateFrais.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.frais = state.frais.map((item) =>
          item.Nom === id ? action.payload.data : item
        );
      }
    },
    [updateFrais.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [deleteFrais.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteFrais.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.frais = state.frais.filter((item) => item.Nom !== id);
      }
    },
    [deleteFrais.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
  },
});

export const { setError } = fraislice.actions;

export default fraislice.reducer;
