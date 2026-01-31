import { AxiosError, isAxiosError } from "axios";

export const throwError = (error: unknown) => {
  if (!isAxiosError(error)) {
    throw new AxiosError('Oops! Something went wrong.')
  }

  throw new AxiosError(
    error?.response?.data?.message,
    error?.status?.toString(),
    error?.config,
    error?.request,
    error?.response?.data
  );
};

export type ValidationError = {
  message: string;
  errors: {
    [field: string]: string[];
  };
}

export type Error = {
  response?: ValidationError;
};
