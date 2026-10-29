import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';
import { useSelector } from '../../services/store';
import type { TIngredientsCategoryProps } from './type';
import type { TConstructorState, TIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const burgerConstructor: TConstructorState = useSelector(
    (state) => state.burgerConstructor
  );
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: selectedIngredients } = burgerConstructor;
    const counters: Record<string, number> = {};
    selectedIngredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
