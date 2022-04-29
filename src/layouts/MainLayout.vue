<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-indigo">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen">
      <q-list>
        <q-item
          clickable
          exact
          v-if="!authStore.$state.user"
          v-ripple
          :to="{ name: 'login', query: { ref: currentUrl } }"
        >
          <q-item-section>
            <q-item-label>Log In</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          exact
          v-if="authStore.$state.user"
          v-ripple
          :to="{ name: 'my-profile', query: { ref: currentUrl } }"
        >
          <q-item-section>
            <q-item-label>{{ authStore.$state.user.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-if="authStore.$state.user" v-ripple @click="logout">
          <q-item-section>
            <q-item-label>Log Out</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import useAuthLogout from 'src/composables/useAuthLogout';
import useAuthUser from 'src/composables/useAuthUser';
import { useAuthStore } from 'src/stores/auth';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar();
    const $router = useRouter();

    const authLogout = useAuthLogout();
    const authUser = useAuthUser();
    const authStore = useAuthStore();

    const currentUrl = $router.currentRoute.value.fullPath;
    const leftDrawerOpen = ref(false);

    const logout = () => {
      $q.loading.show();
      leftDrawerOpen.value = false;
      authLogout
        .submit()
        .then(() => {
          $q.notify({ message: 'Logout success', type: 'positive' });
        })
        .finally(() => {
          $q.loading.hide();
        });
    };

    onMounted(() => {
      authUser.get();
    });

    return {
      authStore,
      currentUrl,
      leftDrawerOpen,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
