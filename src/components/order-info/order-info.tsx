import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  clearCurrentOrder,
} from '../../services/slices/currentOrderSlice';
import { useDispatch, useSelector } from '../../services/store';
import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number: numberParam } = useParams<{ number: string }>();
  const number = Number(numberParam);
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const feedOrder = useSelector((state) =>
    state.feed.orders.find((order) => order.number === number)
  );
  const historyOrder = useSelector((state) =>
    state.orders.orders.find((order) => order.number === number)
  );
  const {
    order: fetchedOrder,
    isLoading,
    error,
  } = useSelector((state) => state.currentOrder);
  const requestedNumber = useRef<number | null>(null);
  const orderData: TOrder | null =
    feedOrder ?? historyOrder ?? (fetchedOrder?.number === number ? fetchedOrder : null);

  useEffect(() => {
    if (number !== requestedNumber.current) requestedNumber.current = null;
    if (
      Number.isFinite(number) &&
      number > 0 &&
      !feedOrder &&
      !historyOrder &&
      fetchedOrder?.number !== number &&
      requestedNumber.current !== number
    ) {
      requestedNumber.current = number;
      void dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, number, feedOrder, historyOrder, fetchedOrder?.number]);

  useEffect(
    () => () => {
      dispatch(clearCurrentOrder());
    },
    [dispatch]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const ingredientsInfo: Record<string, TIngredient & { count: number }> = {};
    orderData.ingredients.forEach((id) => {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        if (ingredientsInfo[id]) ingredientsInfo[id].count += 1;
        else ingredientsInfo[id] = { ...ingredient, count: 1 };
      }
    });
    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );
    return { ...orderData, ingredientsInfo, date: new Date(orderData.createdAt), total };
  }, [orderData, ingredients]);

  if (isLoading || (!orderInfo && !error)) return <Preloader />;
  if (error) return <p className="text text_type_main-default">{error}</p>;
  if (!orderInfo) return <p className="text text_type_main-default">Заказ не найден</p>;
  return <OrderInfoUI orderInfo={orderInfo} />;
};
