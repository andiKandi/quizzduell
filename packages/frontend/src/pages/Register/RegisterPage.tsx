import React, { useState, ChangeEvent, useContext } from 'react';
import { Button } from '../../components/Input/Button';
import { Input } from '../../components/Input/Input';
import { RegisterMask, RegisterMaskHolder, LogoHolder } from './components/RegisterMask';
import { Logo } from '../../components/Logo';
import { authContext, RegisterOptions } from '../../contexts/AuthenticationContext';
import { UnauthenticatedLayout } from '../../components/UnauthenticatedLayout';
import { StyledLink } from '../../components/Input/Link';

export const RegisterPage = () => {
  const auth = useContext(authContext);
  const [values, setValues] = useState<RegisterOptions>({
    email: '',
    name: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      await auth.actions.register(values);
    } catch (e) {
      setFormError(e.message);
    }
  };
  return (
    <UnauthenticatedLayout>
      <RegisterMaskHolder>
        <form onSubmit={onSubmitForm}>
          <RegisterMask>
            <LogoHolder>
              <Logo />
            </LogoHolder>
            <p style={{ color: '#000', textAlign: 'center' }}>{formError}</p>
            <Input name="name" type="text" label="Name" onChange={fieldDidChange} required />
            <Input name="email" type="email" label="Email" onChange={fieldDidChange} required />
            <Input name="password" label="Password" type="password" onChange={fieldDidChange} required />
            <Button type="submit">Register</Button>
            <StyledLink to="/login">Back to Login</StyledLink>
          </RegisterMask>
        </form>
      </RegisterMaskHolder>
    </UnauthenticatedLayout>
  );
};
