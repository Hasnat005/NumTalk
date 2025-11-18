export type AuthUser = {
  id: number;
  username: string;
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
