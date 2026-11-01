import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { updateUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const updateUserError = useSelector((state) => state.user.error ?? undefined);
  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });
  useEffect(() => {
    setFormValue({ name: user?.name ?? '', email: user?.email ?? '', password: '' });
  }, [user]);
  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    Boolean(formValue.password);
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const payload: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email,
    };
    if (formValue.password) payload.password = formValue.password;
    void dispatch(updateUser(payload))
      .unwrap()
      .then(() => setFormValue((current) => ({ ...current, password: '' })))
      .catch(() => undefined);
  };
  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({ name: user?.name ?? '', email: user?.email ?? '', password: '' });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
