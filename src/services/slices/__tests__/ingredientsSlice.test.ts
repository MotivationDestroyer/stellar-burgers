import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

import type { TIngredient } from '../../../utils/types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient-1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image.png',
      image_large: 'image-large.png',
      image_mobile: 'image-mobile.png',
    },
  ];

  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(result).toEqual(initialState);
  });

  test('должен обрабатывать fetchIngredients.pending', () => {
    const result = ingredientsReducer(undefined, fetchIngredients.pending('request-id'));

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const result = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, 'request-id')
    );

    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null,
    });
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const result = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(
        { message: 'Ошибка загрузки ингредиентов' },
        'request-id'
      )
    );

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов',
    });
  });
});
