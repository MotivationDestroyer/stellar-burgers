import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import type { ReactNode } from 'react';

type ProtectedRouteProps = { onlyUnAuth?: boolean; children?: ReactNode };

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const { isAuth, isInit } = useSelector((state) => state.user);
  const location = useLocation();
  if (!isInit) return <Preloader />;
  if (onlyUnAuth && isAuth)
    return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;
  if (!onlyUnAuth && !isAuth)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children ?? <Outlet />}</>;
};
