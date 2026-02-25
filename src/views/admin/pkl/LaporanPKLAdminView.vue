<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
      <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
    </div>

    <!-- Content Area -->
    <div class="border-t border-gray-200 pt-6">
      <p class="text-gray-500">Halaman ini sedang dalam pengembangan.</p>
    </div>
  </div>
</template>

<script setup>
// Sesuaikan pageTitle dan pageDescription untuk setiap halaman
const pageTitle = 'Judul Halaman'
const pageDescription = 'Deskripsi singkat halaman'
</script>