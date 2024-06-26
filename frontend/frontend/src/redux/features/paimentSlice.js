import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getPaiment = createAsyncThunk(
  "paiment/getAllPaiment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getPaiment`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getPaimentByID = createAsyncThunk(
  "paiment/getPaimentByID",
  async (paimentId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getPaiment/${paimentId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getPaimentByUser = createAsyncThunk(
  "paiment/getPaimentByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getPaimentByUser/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const createPaiment = createAsyncThunk(
  "paiment/createPaiment",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("/createPaiment", formValue);
      toast.success("Payment Added Successfully");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);
export const updatePaiment = createAsyncThunk(
  "paiment/updatePaiment",
  async ({ id, formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/updatePaiment/${id}`, formValue);
      toast.success("Payment Updated Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const payee = createAsyncThunk(
  "paiment/payee",
  async ({ id, formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/paiment/${id}`, formValue);
      toast.success("Payment made  Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deletePaiment = createAsyncThunk(
  "paiment/deletePaiment",
  async ({ id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/deletePaiment/${id}`);
      toast.success("Paiment deleteded Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const paimentlice = createSlice({
  name: "paiment",
  initialState: {
    paiment: [],
    paimentByID: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [createPaiment.pending]: (state, action) => {
      state.loading = true;
    },
    [createPaiment.fulfilled]: (state, action) => {
      state.loading = false;
      state.paiment.push(action.payload.data);
    },
    [createPaiment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },

    [getPaiment.pending]: (state, action) => {
      state.loading = true;
    },
    [getPaiment.fulfilled]: (state, action) => {
      state.loading = false;
      state.paiment = action.payload;
    },
    [getPaiment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getPaimentByID.pending]: (state, action) => {
      state.loading = true;
    },
    [getPaimentByID.fulfilled]: (state, action) => {
      state.loading = false;
      state.paimentByID = action.payload;
    },
    [getPaimentByID.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getPaimentByUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getPaimentByUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.paiment = action.payload;
    },
    [getPaimentByUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [updatePaiment.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePaiment.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.paiment = state.paiment.map((item) =>
          item.idpaiment === id ? action.payload.data : item
        );
      }
    },
    [updatePaiment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },

    [payee.pending]: (state, action) => {
      state.loading = true;
    },
    [payee.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.paiment = state.paiment.map((item) =>
          item.idpaiment === id ? action.payload.data : item
        );
      }
    },
    [payee.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [payee.pending]: (state, action) => {
      state.loading = true;
    },
    [deletePaiment.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.paiment = state.paiment.filter((item) => item.idpaiment !== id);
      }
    },
    [deletePaiment.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
  },
});

export const { setError } = paimentlice.actions;

export default paimentlice.reducer;
