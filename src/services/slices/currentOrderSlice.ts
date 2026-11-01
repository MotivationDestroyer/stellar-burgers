import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
type TCurrentOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};
const initialState: TCurrentOrderState = { order: null, isLoading: false, error: null };
export const fetchOrderByNumber = createAsyncThunk(
  'currentOrder/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return (
      response.orders.find((order) => order.number === number) ??
      response.orders[0] ??
      null
    );
  }
);
const currentOrderSlice = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});
export const { clearCurrentOrder } = currentOrderSlice.actions;
export default currentOrderSlice.reducer;
