import { AppHeader, ProtectedRoute } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { ModalUI, Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details';
import { OrderInfo } from '@components/order-info';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchUser,
  hasStoredAuth,
  setUserInitialized,
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

type LocationState = { background?: Location };

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isLoading: isIngredientsLoading, error: ingredientsError } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    void dispatch(fetchIngredients());
    if (hasStoredAuth()) void dispatch(fetchUser());
    else dispatch(setUserInitialized(true));
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        isLoading={isIngredientsLoading}
        error={ingredientsError ? new Error(ingredientsError) : null}
      />
    </div>
  );
};
export default App;

const AppContent = ({ isLoading, error }: AppContentProps): React.JSX.Element => {
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const background = locationState?.background;
  const navigate = useNavigate();
  const handleClose = (): void => {
    void navigate(-1);
  };

  if (isLoading) return <Preloader />;
  if (error)
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error.message ?? 'неизвестная ошибка'}
      </p>
    );

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <ModalUI title="Детали ингредиента" onClose={handleClose}>
                <IngredientDetails />
              </ModalUI>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <ModalUI title="Информация о заказе" onClose={handleClose}>
                <OrderInfo />
              </ModalUI>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <ModalUI title="Информация о заказе" onClose={handleClose}>
                  <OrderInfo />
                </ModalUI>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
