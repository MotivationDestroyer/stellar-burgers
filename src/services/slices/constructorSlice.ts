import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';

import type {
  TConstructorIngredient,
  TConstructorState,
  TOrder,
} from '../../utils/types';

type TConstructorStore = TConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TConstructorStore = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredients: string[]) => orderBurgerApi(ingredients),
  {
    condition: (_, { getState }) =>
      (getState() as { user: { isAuth: boolean } }).user.isAuth,
  }
);

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;

      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length ||
        from === to
      ) {
        return;
      }

      const [ingredient] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, ingredient);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    resetOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  resetOrder,
} = constructorSlice.actions;

export default constructorSlice.reducer;
