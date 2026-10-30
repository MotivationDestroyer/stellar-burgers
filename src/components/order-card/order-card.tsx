import { OrderCardUI } from '@ui';
import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import type { OrderCardProps } from './type';
import type { TIngredient } from '@utils-types';

const maxIngredients = 6;
export const OrderCard = memo(function OrderCard({
  order,
}: OrderCardProps): React.JSX.Element | null {
  const location = useLocation();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], id: string) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (ingredient) acc.push(ingredient);
        return acc;
      },
      []
    );
    const total = ingredientsInfo.reduce((sum, item) => sum + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains = Math.max(ingredientsInfo.length - maxIngredients, 0);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt),
    };
  }, [order, ingredients]);
  if (!orderInfo) return null;
  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
