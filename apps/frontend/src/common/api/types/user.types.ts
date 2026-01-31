export type UserModel = {
  id: number;
  name: string | null;
  email: string | null;
  email_verified_at: string | null;
  roles: { name: string }[];
  created_at: string;
  updated_at: string;
};
