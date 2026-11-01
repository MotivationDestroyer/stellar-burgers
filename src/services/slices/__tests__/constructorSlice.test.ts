import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  resetOrder,
  createOrder,
} from '../constructorSlice';

import type { TConstructorIngredient, TOrder } from '../../../utils/types';

describe('constructorSlice reducer', () => {
  const bun: TConstructorIngredient = {
    _id: 'bun-1',
    id: 'bun-id',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png',
  };

  const main1: TConstructorIngredient = {
    _id: 'main-1',
    id: 'main-id-1',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png',
  };

  const main2: TConstructorIngredient = {
    ...main1,
    _id: 'main-2',
    id: 'main-id-2',
    name: 'Сыр',
  };

  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null,
  };

  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(result).toEqual(initialState);
  });

  test('должен обрабатывать addIngredient для булки', () => {
    const result = constructorReducer(initialState, addIngredient(bun));

    expect(result.bun).toEqual(bun);
    expect(result.ingredients).toEqual([]);
  });

  test('должен обрабатывать addIngredient для начинки', () => {
    const result = constructorReducer(initialState, addIngredient(main1));

    expect(result.ingredients).toEqual([main1]);
    expect(result.bun).toBeNull();
  });

  test('должен обрабатывать removeIngredient', () => {
    const state = {
      ...initialState,
      ingredients: [main1, main2],
    };

    const result = constructorReducer(state, removeIngredient(main1.id));

    expect(result.ingredients).toEqual([main2]);
  });

  test('должен обрабатывать moveIngredient', () => {
    const state = {
      ...initialState,
      ingredients: [main1, main2],
    };

    const result = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(result.ingredients).toEqual([main2, main1]);
  });

  test('должен обрабатывать clearConstructor', () => {
    const state = {
      ...initialState,
      bun,
      ingredients: [main1],
    };

    const result = constructorReducer(state, clearConstructor());

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });

  test('должен обрабатывать resetOrder', () => {
    const order: TOrder = {
      _id: 'order-1',
      status: 'done',
      name: 'Бургер',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 12345,
      ingredients: ['bun-1'],
    };

    const state = {
      ...initialState,
      orderModalData: order,
      error: 'Ошибка',
    };

    const result = constructorReducer(state, resetOrder());

    expect(result.orderModalData).toBeNull();
    expect(result.error).toBeNull();
  });

  test('должен обрабатывать createOrder.pending', () => {
    const result = constructorReducer(
      initialState,
      createOrder.pending('request-id', ['bun-1'])
    );

    expect(result.orderRequest).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен обрабатывать createOrder.fulfilled', () => {
    const order: TOrder = {
      _id: 'order-1',
      status: 'done',
      name: 'Бургер',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 12345,
      ingredients: ['bun-1', 'main-1'],
    };

    const state = {
      ...initialState,
      bun,
      ingredients: [main1],
    };

    const result = constructorReducer(
      state,
      createOrder.fulfilled({ order, name: 'Бургер' }, 'request-id', ['bun-1'])
    );

    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toEqual(order);
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });

  test('должен обрабатывать createOrder.rejected', () => {
    const result = constructorReducer(
      initialState,
      createOrder.rejected(new Error('Ошибка оформления'), 'request-id', ['bun-1'])
    );

    expect(result.orderRequest).toBe(false);
    expect(result.error).toBe('Ошибка оформления');
  });
});
