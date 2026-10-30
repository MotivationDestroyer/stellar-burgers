import { combineReducers } from '@reduxjs/toolkit';
import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import currentOrderReducer from './slices/currentOrderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  feed: feedReducer,
  orders: ordersReducer,
  currentOrder: currentOrderReducer,
});
