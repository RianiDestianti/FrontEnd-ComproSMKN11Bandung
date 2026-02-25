<template>
  <!-- Welcome Section -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
    <p class="text-gray-600 mt-1">Selamat datang di panel admin SMKN 11 Bandung</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Card 1 -->
    <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Siswa</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">1,234</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </div>
      </div>
      <p class="text-xs text-green-600 mt-2">↑ 5% dari bulan lalu</p>
    </div>

    <!-- Card 2 -->
    <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Guru</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">87</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2">Tetap dari bulan lalu</p>
    </div>

    <!-- Card 3 -->
    <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Berita</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">45</p>
        </div>
        <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
        </div>
      </div>
      <p class="text-xs text-green-600 mt-2">↑ 3 berita baru</p>
    </div>

    <!-- Card 4 -->
    <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Agenda Bulan Ini</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">12</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      <p class="text-xs text-blue-600 mt-2">4 kegiatan minggu ini</p>
    </div>
  </div>

  <!-- Recent Activity & Quick Actions -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Recent Activity -->
    <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-3 pb-4 border-b border-gray-100">
          <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Berita baru dipublikasikan</p>
            <p class="text-xs text-gray-500 mt-1">Pentas Seni Tahun Ajaran 2024/2025</p>
            <p class="text-xs text-gray-400 mt-1">2 jam yang lalu</p>
          </div>
        </div>
        <div class="flex items-start space-x-3 pb-4 border-b border-gray-100">
          <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Data guru diperbarui</p>
            <p class="text-xs text-gray-500 mt-1">5 data guru berhasil diupdate</p>
            <p class="text-xs text-gray-400 mt-1">5 jam yang lalu</p>
          </div>
        </div>
        <div class="flex items-start space-x-3 pb-4">
          <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Agenda ditambahkan</p>
            <p class="text-xs text-gray-500 mt-1">Ujian Tengah Semester</p>
            <p class="text-xs text-gray-400 mt-1">1 hari yang lalu</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
      <div class="space-y-3">
        <router-link to="/admin/profil-sekolah/edit" class="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
          <span class="text-sm font-medium text-blue-900">Edit Profil Sekolah</span>
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
        <router-link to="/admin/berita" class="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition">
          <span class="text-sm font-medium text-green-900">Tambah Berita</span>
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
        <router-link to="/admin/agenda" class="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
          <span class="text-sm font-medium text-purple-900">Buat Agenda</span>
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
        <router-link to="/admin/fasilitas" class="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition">
          <span class="text-sm font-medium text-yellow-900">Kelola Galeri</span>
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Tidak perlu import AdminLayout karena sudah di parent route
</script>