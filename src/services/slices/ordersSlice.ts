import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
type TOrdersState = { orders: TOrder[]; isLoading: boolean; error: string | null };
const initialState: TOrdersState = { orders: [], isLoading: false, error: null };
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () =>
  getOrdersApi()
);
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить историю заказов';
      });
  },
});
export default ordersSlice.reducer;
