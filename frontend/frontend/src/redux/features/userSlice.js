import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const addUser = createAsyncThunk(
  "auth/addUser",
  async ({ formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("auth/register", formValue);
      toast.success("User added Successfully");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/user`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const getUserByID = createAsyncThunk(
  "user/getUserByID",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/getUser/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData, toast, navigate }, { rejectWithValue }) => {
    try {
    
      const response = await API.post(`/updateUser/${id}`, { user: userData });
      toast.success("User Updated Successfully");
      return response.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Some Error");
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/deleteUser/${id}`);
      toast.success("User deleteded Successfully");
      navigate("#");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    userByID: [],
    error: "",
    loading: false,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: {
    [addUser.pending]: (state, action) => {
      state.loading = true;
    },
    [addUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users.push(action.payload.profile);
    },
    [addUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [getUserByID.pending]: (state, action) => {
      state.loading = true;
    },
    [getUserByID.fulfilled]: (state, action) => {
      state.loading = false;
      state.userByID = action.payload;
    },
    [getUserByID.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [updateUser.pending]: (state, action) => {
      state.loading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.users = state.users.map((item) =>
          item.CIN === id ? action.payload : item
        );
      }
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [deleteUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.users = state.users.filter((item) => item.CIN !== id);
      }
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
  },
});

export const { setError, setCurrentPage } = userSlice.actions;

export default userSlice.reducer;
