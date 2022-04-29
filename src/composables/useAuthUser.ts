import { Cookies } from 'quasar';
import MisterAladinRepository from 'src/repositories/MisterAladinRepository';
import { AuthUserResponse, ResponseError } from 'src/repositories/Repository';
import { useAuthStore } from 'src/stores/auth';
import { reactive, ref } from 'vue';

export default () => {
  const repository = new MisterAladinRepository();

  const authStore = useAuthStore();

  const $state = reactive({
    loading: ref(false),
  });

  const get = (): Promise<AuthUserResponse> => {
    $state.loading = true;
    return new Promise((resolve, reject) => {
      const token = Cookies.get('authToken');
      if (!token) {
        return;
      }

      repository
        .authUser({
          token: Cookies.get('authToken'),
        })
        .then((r) => {
          authStore.setUser(r.user);
          resolve(r);
        })
        .catch((e: ResponseError) => {
          reject(e);
        })
        .finally(() => {
          $state.loading = false;
        });
    });
  };

  return {
    $state,
    get,
  };
};
