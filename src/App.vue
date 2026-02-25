<template>
  <div id="app">
    <Navbar v-if="!route.path.startsWith('/admin')" />
    
    <main>
      <RouterView />
    </main>
    
    <Footer v-if="!route.path.startsWith('/admin')" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()

const isAuthPage = computed(() => {
  return route.name === 'login'
})
</script>

<style>
@import './assets/main.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, sans-serif;
}

main {
  flex: 1;
}
</style>