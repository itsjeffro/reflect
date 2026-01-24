import styled from '@emotion/styled'
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { setCookie } from "../common/utils/cookie";
import { useAuth } from "../common/context/auth/useAuth";
import { Button, Checkbox } from "@radix-ui/themes";
import { httpClient } from "../common/utils/httpClient";
import { TextField } from '../common/components/TextField';

type LoginRequest = { email?: string | null, password?: string | null, remember: boolean };

type Error = {
  email: string;
  password: string;
}

const initialData: LoginRequest = {
  email: null,
  password: null,
  remember: false,
};

function Login() {
  const [errors, setErrors] = useState<Error | null>(null);
  const [passwordInputType, setPasswordInputType] = useState('password');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    control,
  } = useForm({
    defaultValues: initialData
  });

  const handleInputTypeChange = useCallback(() => {
    console.log('test')
    setPasswordInputType((prevState) => {
      return prevState === 'password' ? 'text' : 'password';
    })
  }, [setPasswordInputType])

  const onSubmit = async (data: LoginRequest) => {

    const { remember, ...rest } = data;
    await httpClient
      .post('/sanctum/token', {
        ...rest,
        device_name: 'demo',
      })
      .then((response) => {
        const token = response.data;

        setCookie('token', token, remember ? 30 : 1);
        setToken(token);
        setErrors(null);
        navigate('/');
      })
      .catch((errors) => setErrors(errors.response.data.errors))
  }



  return (
    <Wrapper>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2>Login</h2>
          </div>

          <FormBase>
            <TextField
              error={!!errors?.email}
              errorMessage={errors?.email ? errors['email'] : null}
              id="email"
              label="Email"
              {...register('email')}
            />

            <TextField
              error={!!errors?.password}
              errorMessage={errors?.password ? errors['password'] : null}
              type={passwordInputType}
              id="password"
              label="Password"
              endAdornment={
                <>
                  {passwordInputType === 'password' && <Button size="1" onClick={handleInputTypeChange}>View</Button>}
                  {passwordInputType === 'text' && <Button size="1" onClick={handleInputTypeChange}>Hide</Button>}
                </>
              }
              {...register('password')}
            />

            <div>
              <Controller
                control={control}
                name="remember"
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    id="remember"
                    checked={!!value}
                    onChange={onChange}
                  />
                )}
              />

              <Button type="submit">Login</Button>
            </div>
          </FormBase>
        </form>
      </div>
    </Wrapper>
  )
}

export default Login;

const Wrapper = styled.div({
  background: 'var(--bg-100)',
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
});

const FormBase = styled.div({
  display: 'flex',
  flexDirection: 'column',
})
