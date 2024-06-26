// PartenaireSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getPartenaireByID = createAsyncThunk(
  "partenaire/getPartenaireByID",
  async (partenaireId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/partenaire/${partenaireId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getAllPartenaires = createAsyncThunk(
  "partenaire/getAllPartenaires",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/partenaires");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createPartenaire = createAsyncThunk(
  "partenaire/createPartenaire",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("/createpartenaires", formValue);
      toast.success("Partenaire Added Successfully");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const updatePartenaire = createAsyncThunk(
  "partenaire/updatePatenaire",
  async ({ id, formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/updatepartenaires/${id}`, formValue);
      toast.success("Partenaire Updated Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deletePartenaire = createAsyncThunk(
  "partenaire/deletePatenaire",
  async ({ id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/deletepartenaires/${id}`);
      toast.success("Partenaire deleted Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const partenaireSlice = createSlice({
  name: "partenaire",
  initialState: {
    partenaires: [],
    partenaireByID: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: {
    [createPartenaire.pending]: (state, action) => {
      state.loading = true;
    },
    [createPartenaire.fulfilled]: (state, action) => {
      state.loading = false;
      state.partenaires.push(action.payload.data);
    },
    [getAllPartenaires.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllPartenaires.fulfilled]: (state, action) => {
      state.loading = false;
      state.partenaires = action.payload;
    },
    [updatePartenaire.pending]: (state, action) => {
      state.loading = true;
    },
    [updatePartenaire.fulfilled]: (state, action) => {
      state.loading = false;
      state.partenaires = state.partenaires.map((partenaire) =>
        partenaire.id === action.payload.data.id
          ? { ...partenaire, ...action.payload.data }
          : partenaire
      );
    },
    [deletePartenaire.pending]: (state, action) => {
      state.loading = true;
    },
    [deletePartenaire.fulfilled]: (state, action) => {
      state.loading = false;
      state.partenaires = state.partenaires.filter(
        (partenaire) => partenaire.id !== action.payload.data.id
      );
    },
    [getPartenaireByID.pending]: (state, action) => {
      state.loading = true;
    },
    [getPartenaireByID.fulfilled]: (state, action) => {
      state.loading = false;
      state.partenaireByID = action.payload;
    },
  },
});

export const { setError } = partenaireSlice.actions;

export default partenaireSlice.reducer;
