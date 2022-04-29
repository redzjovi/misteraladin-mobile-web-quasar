import { isString } from '@vue/shared';
import { api } from 'src/boot/axios';
import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLoginResponseError,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthUserRequest,
  AuthUserResponse,
  Repository,
  ResponseError,
} from 'src/repositories/Repository';

type ApiMembersAuthLoginResponse = {
  token: string;
};

type ApiMembersAuthLoginResponseError = {
  errors:
    | string
    | {
        email: string[];
      };
};

type ApiMembersAuthCheckTokenResponse = {
  data: User;
};

type ApiMembersAuthCheckTokenResponseError = {
  errors: string;
};

type User = {
  id: number;
  email: string;
  full_name: string;
};

export default class MisterAladinRepository implements Repository {
  authLogin(request: AuthLoginRequest): Promise<AuthLoginResponse> {
    return new Promise<AuthLoginResponse>((resolve, reject) => {
      api
        .post('https://staging-m.misteralad.in/api/members/auth/login', request)
        .then((r) => {
          const apiMembersAuthLoginResponse: ApiMembersAuthLoginResponse =
            r.data;

          this.authUser({ token: apiMembersAuthLoginResponse.token })
            .then((authUserResponse) => {
              resolve({
                token: apiMembersAuthLoginResponse.token,
                user: authUserResponse.user,
              });
            })
            .catch((e: AuthLoginResponseError) => {
              reject({
                message: e.message,
              } as AuthLoginResponseError);
            });
        })
        .catch((e) => {
          const responseError: AuthLoginResponseError = {
            message: String(e),
          };

          if (e.response.data) {
            const apiMembersAuthLoginResponseError: ApiMembersAuthLoginResponseError =
              e.response.data;
            if (isString(apiMembersAuthLoginResponseError.errors)) {
              responseError.message = apiMembersAuthLoginResponseError.errors;
            } else if (
              apiMembersAuthLoginResponseError.errors instanceof Object
            ) {
              responseError.message =
                apiMembersAuthLoginResponseError.errors.email.join(', ');
              responseError.email =
                apiMembersAuthLoginResponseError.errors.email.join(', ');
            }
          }

          reject(responseError);
        });
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authLogout(_request: AuthLogoutRequest): Promise<AuthLogoutResponse> {
    return Promise.resolve({});
  }
  authUser(request: AuthUserRequest): Promise<AuthUserResponse> {
    return new Promise<AuthUserResponse>((resolve, reject) => {
      api
        .post('https://staging-m.misteralad.in/api/members/auth/check-token', {
          token: request.token,
        })
        .then((checkTokenResponse) => {
          const apiMembersAuthCheckTokenResponse: ApiMembersAuthCheckTokenResponse =
            checkTokenResponse.data;

          resolve({
            user: {
              id: String(apiMembersAuthCheckTokenResponse.data.id),
              email: apiMembersAuthCheckTokenResponse.data.email,
              name: apiMembersAuthCheckTokenResponse.data.full_name,
            },
          });
        })
        .catch((e) => {
          const responseError: ResponseError = {
            message: String(e),
          };

          if (e.response.data) {
            const apiMembersAuthCheckTokenResponseError: ApiMembersAuthCheckTokenResponseError =
              e.data;
            responseError.message =
              apiMembersAuthCheckTokenResponseError.errors;
          }

          reject(responseError);
        });
    });
  }
}
