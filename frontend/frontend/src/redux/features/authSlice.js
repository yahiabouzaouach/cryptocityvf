import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("auth/login", formValue);
      window.location = "/dashboard";
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const register = createAsyncThunk(
  "auth/register",
  async ({ formValue, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.post("auth/register", formValue);
      navigate("/auth/login");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const password = createAsyncThunk(
  "auth/password",
  async ({ formValue, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("auth/password", formValue);
      toast.success("Check your email inbox");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const Resetpassword = createAsyncThunk(
  "auth/Resetpassword",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const url = new URL(window.location.href);
      const email = url.pathname.split("/").pop();
      const response = await API.post(`auth/Resetpassword/${email}`, formValue);
      toast.success("Password changed successfully");
      navigate("/auth/login");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("me");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
    isAuthenticated: !!localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [password.pending]: (state) => {
      state.loading = true;
    },
    [password.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [password.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Some Backend Error";
    },
    [loadUser.pending]: (state) => {
      state.loading = true;
    },
    [loadUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    [loadUser.rejected]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { setError, setAuthenticated } = authSlice.actions;

export default authSlice.reducer;
