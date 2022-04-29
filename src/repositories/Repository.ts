export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = {
  token: string;
  user: User;
};

export type AuthLoginResponseError = {
  message: string;
  email?: string;
  password?: string;
};

export type AuthLogoutRequest = {
  token: string;
};

export type AuthLogoutResponse = {
  message?: string;
};

export type AuthUserRequest = {
  token: string;
};

export type AuthUserResponse = {
  user: User;
};

export type ResponseError = {
  message: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export interface Repository {
  authLogin(request: AuthLoginRequest): Promise<AuthLoginResponse>;
  authLogout(request: AuthLogoutRequest): Promise<AuthLogoutResponse>;
  authUser(request: AuthUserRequest): Promise<AuthUserResponse>;
}
