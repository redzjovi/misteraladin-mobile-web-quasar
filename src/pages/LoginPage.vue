<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-indigo">
      <q-toolbar>
        <q-btn flat round icon="close" @click="redirectToRef" />
        <q-toolbar-title>Log In</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <q-form class="q-gutter-md" @submit="submit">
          <q-input
            v-model="authLogin.$state.email"
            autocomplete="off"
            clearable
            hide-bottom-space
            label="Email *"
            lazy-rules
            stack-label
            type="email"
            :error="Boolean(authLogin.$state.emailError)"
            :error-message="authLogin.$state.emailError"
            :rules="[(val) => !!val || 'The email fields is required.']"
          />
          <q-input
            v-model="authLogin.$state.password"
            hide-bottom-space
            label="Password *"
            lazy-rules
            stack-label
            :error="Boolean(authLogin.$state.passwordError)"
            :error-message="authLogin.$state.passwordError"
            :rules="[(val) => !!val || 'The password fields is required.']"
            :type="
              authLogin.$state.passwordTypeIsPassword ? 'password' : 'text'
            "
          >
            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="
                  authLogin.$state.passwordTypeIsPassword
                    ? 'visibility_off'
                    : 'visibility'
                "
                @click="
                  authLogin.$state.passwordTypeIsPassword =
                    !authLogin.$state.passwordTypeIsPassword
                "
              >
              </q-icon>
            </template>
          </q-input>
          <div>
            <q-btn
              class="full-width"
              color="red"
              label="OK"
              type="submit"
              :loading="authLogin.$state.loading"
            />
          </div>
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import useAuthLogin from 'src/composables/useAuthLogin';
import useAuthUser from 'src/composables/useAuthUser';
import { useAuthStore } from 'src/stores/auth';
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const $q = useQuasar();
    const $route = useRoute();
    const $router = useRouter();

    const authLogin = useAuthLogin();
    const authStore = useAuthStore();
    const authUser = useAuthUser();

    const queryRef = $route.query.ref ? $route.query.ref.toString() : '/';

    const redirectToRef = () => {
      $router.replace({ path: queryRef });
    };
    const submit = () => {
      authLogin
        .submit()
        .then(() => {
          $q.notify({ message: 'Login success', type: 'positive' });
          redirectToRef();
        })
        .catch((e) => {
          $q.notify({ message: e.message, type: 'negative' });
        });
    };

    onMounted(async () => {
      await authUser.get();

      if (authStore.$state.user) {
        redirectToRef();
      }
    });

    return {
      authLogin,
      redirectToRef,
      submit,
    };
  },
});
</script>
