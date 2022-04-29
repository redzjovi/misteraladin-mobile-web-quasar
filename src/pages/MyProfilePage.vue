<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-indigo">
      <q-toolbar>
        <q-btn flat round icon="arrow_back" @click="redirectToRef" />
        <q-toolbar-title>My Profile</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <pre>{{ authStore.$state.user }}</pre>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import useAuthUser from 'src/composables/useAuthUser';
import { useAuthStore } from 'src/stores/auth';
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'MyProfilePage',
  setup() {
    const $route = useRoute();
    const $router = useRouter();

    const authStore = useAuthStore();
    const authUser = useAuthUser();

    const queryRef = $route.query.ref ? $route.query.ref.toString() : '/';

    const redirectToRef = () => {
      $router.replace({ path: queryRef });
    };

    onMounted(async () => {
      await authUser.get();

      if (!authStore.$state.user) {
        $router.push({
          name: 'login',
          query: { ref: $router.currentRoute.value.fullPath },
        });
      }
    });

    return {
      authStore,
      redirectToRef,
    };
  },
});
</script>
