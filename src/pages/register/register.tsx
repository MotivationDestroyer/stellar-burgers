import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector((state) => state.user.error ?? undefined);
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        void navigate('/', { replace: true });
      })
      .catch(() => undefined);
  };
  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
