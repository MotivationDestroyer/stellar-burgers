import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addIngredient } from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

import type { TBurgerIngredientProps } from './type';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleAdd = (): void => {
    const constructorIngredient: TConstructorIngredient = {
      ...ingredient,
      id: crypto.randomUUID(),
    };

    dispatch(addIngredient(constructorIngredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
