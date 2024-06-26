import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getCaisse = createAsyncThunk(
  "caisse/getCaisse",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/caisses`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const caisseSlice = createSlice({
  name: "caisse",
  initialState: {
    caisse: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [getCaisse.pending]: (state, action) => {
      state.loading = true;
    },
    [getCaisse.fulfilled]: (state, action) => {
      state.loading = false;
      state.caisse = action.payload;
    },
    [getCaisse.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
  },
});

export const { setError } = caisseSlice.actions;

export default caisseSlice.reducer;
