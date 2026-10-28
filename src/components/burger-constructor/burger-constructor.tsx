import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';

import { createOrder, resetOrder } from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );

  const constructorItems = { bun, ingredients };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [bun, ingredients]
  );

  const onOrderClick = (): void => {
    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id,
    ];

    void dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = (): void => {
    dispatch(resetOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
