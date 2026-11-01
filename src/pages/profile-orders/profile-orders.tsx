import { useEffect } from 'react';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { fetchOrders } from '../../services/slices/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);
  if (isLoading && orders.length === 0) return <Preloader />;
  if (error && orders.length === 0)
    return <p className="text text_type_main-default">{error}</p>;
  return <ProfileOrdersUI orders={orders} />;
};
