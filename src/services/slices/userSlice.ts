import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '../../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import type { TUser } from '../../utils/types';

type TUserState = {
  user: TUser | null;
  isAuth: boolean;
  isInit: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuth: false,
  isInit: false,
  isLoading: false,
  error: null,
};

type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

const saveTokens = (data: TAuthResponse): void => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  saveTokens(response);
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } finally {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuth = false;
      state.isInit = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isInit = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось войти';
        state.isInit = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isInit = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось зарегистрироваться';
        state.isInit = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isInit = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
        state.isInit = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось обновить данные';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.isInit = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.isAuth = false;
        state.isInit = true;
        state.isLoading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setUserInitialized, clearUser } = userSlice.actions;
export const hasStoredAuth = (): boolean =>
  Boolean(getCookie('accessToken') || localStorage.getItem('refreshToken'));
export default userSlice.reducer;
