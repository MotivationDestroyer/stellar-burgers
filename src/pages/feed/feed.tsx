import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);
  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };
  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);
  if (isLoading && orders.length === 0) return <Preloader />;
  if (error && orders.length === 0)
    return <p className="text text_type_main-default">{error}</p>;
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
