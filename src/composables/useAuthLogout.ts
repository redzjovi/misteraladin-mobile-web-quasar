import { Cookies } from 'quasar';
import MisterAladinRepository from 'src/repositories/MisterAladinRepository';
import {
  AuthLoginResponseError,
  AuthLogoutResponse,
} from 'src/repositories/Repository';
import { useAuthStore } from 'src/stores/auth';
import { reactive, ref } from 'vue';

export default () => {
  const repository = new MisterAladinRepository();

  const authStore = useAuthStore();

  const $state = reactive({
    loading: ref(false),
  });

  const submit = (): Promise<AuthLogoutResponse> => {
    $state.loading = true;
    return new Promise((resolve, reject) => {
      repository
        .authLogout({
          token: Cookies.get('authToken'),
        })
        .then((r) => {
          Cookies.remove('authToken');
          authStore.setUser(null);
          resolve(r);
        })
        .catch((e: AuthLoginResponseError) => {
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
