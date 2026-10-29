import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

type LocationState = { from?: { pathname?: string } };
export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector((state) => state.user.error ?? undefined);
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = (location.state as LocationState | null)?.from?.pathname ?? '/';
        void navigate(from, { replace: true });
      })
      .catch(() => undefined);
  };
  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
