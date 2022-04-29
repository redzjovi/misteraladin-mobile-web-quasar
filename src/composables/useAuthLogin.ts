import { Cookies } from 'quasar';
import MisterAladinRepository from 'src/repositories/MisterAladinRepository';
import {
  AuthLoginResponse,
  AuthLoginResponseError,
} from 'src/repositories/Repository';
import { useAuthStore } from 'src/stores/auth';
import { reactive, ref } from 'vue';

export default () => {
  const repository = new MisterAladinRepository();

  const authStore = useAuthStore();

  const $state = reactive({
    form: ref(null),
    email: ref(''),
    emailError: ref(''),
    loading: ref(false),
    password: ref(''),
    passwordError: ref(''),
    passwordTypeIsPassword: ref(true),
  });

  const submit = (): Promise<AuthLoginResponse> => {
    $state.loading = true;
    return new Promise((resolve, reject) => {
      repository
        .authLogin({
          email: $state.email,
          password: $state.password,
        })
        .then((r) => {
          Cookies.set('authToken', r.token);
          authStore.setUser(r.user);
          resolve(r);
        })
        .catch((e: AuthLoginResponseError) => {
          $state.emailError = String(e.email);
          $state.passwordError = String(e.password);
          reject(e);
        })
        .finally(() => {
          $state.loading = false;
        });
    });
  };

  return {
    $state,
    submit,
  };
};
