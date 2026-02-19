import styled from '@emotion/styled'
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Card, Checkbox, Flex, Heading, Text } from "@radix-ui/themes";
import { TextField } from '../common/components/TextField';
import { useLogin } from '../common/hooks/useLogin';

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
  const [passwordInputType] = useState('password');

  const navigate = useNavigate();

  const { handleSubmit, register, control } = useForm({
    defaultValues: initialData
  });

  const { handleLogin } = useLogin({
    onSuccess: () => {
      navigate('/');
      setErrors(null);
    },
    onError: (response) => {
      setErrors(response.data.errors)
    },
  });

  const onSubmit = useCallback(async (data: LoginRequest) => {
    handleLogin(data);
  }, [handleLogin]);

  return (
    <Wrapper>
      <Card asChild size="4" style={{ maxWidth: '350px', width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading as="h3" size="6" trim="start" mb="5">
            Sign in
          </Heading>

          <Box mb="3">
            <Flex mb="1" justify="between">
              <Text
                as="label"
                htmlFor="example-email-field"
                size="2"
                weight="bold"
              >
                Email
              </Text>
              {!!errors?.email && <Text size="1">Required</Text>}
            </Flex>
            <TextField
              {...register('email')}
              placeholder="Enter your email"
              id="example-email-field"
            />
          </Box>

          <Box mb="3" position="relative">
            <Flex align="baseline" justify="between" mb="1">
              <Text
                as="label"
                size="2"
                weight="bold"
                htmlFor="example-password-field"
              >
                Password
              </Text>
              {!!errors?.password && <Text size="1">Required</Text>}
            </Flex>
            <TextField
              {...register('password')}
              placeholder="Enter your password"
              id="example-password-field"
              type={passwordInputType as 'password' | 'text'}
            />
          </Box>

          {!window.store && (
            <Flex align="center" gap="2" mb="1">
              <Controller 
                control={control}
                name="remember"
                render={({ field }) => (
                  <>
                    <Checkbox name="remember" id="remember" checked={field.value} onCheckedChange={field.onChange} /> <label htmlFor="remember">Remember me</label>
                  </>
                )} 
              />
            </Flex>
          )}

          <Flex mt="3" justify="end" gap="3">
            <Button type="submit">Sign in</Button>
          </Flex>
        </form>
      </Card>
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
