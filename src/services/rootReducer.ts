import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});
