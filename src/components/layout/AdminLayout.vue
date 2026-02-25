<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Sidebar -->
    <div
      class="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out z-30 overflow-y-auto"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 bg-gray-800">
        <router-link to="/" class="text-xl font-bold text-white"> SMKN 11 Admin </router-link>
        <button @click="sidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2 px-4 pb-6">
        <!-- Dashboard -->
        <router-link
          to="/admin"
          class="flex items-center px-4 py-2.5 mb-2 rounded-lg transition text-sm"
          :class="
            $route.path === '/admin'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          "
        >
          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          Dashboard
        </router-link>

        <!-- Profil Sekolah Dropdown -->
        <MenuDropdown
          title="Profil Sekolah"
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          :items="[
            { path: '/admin/profil-sekolah/edit', label: 'Data Sekolah' },
            { path: '/admin/kepala-sekolah', label: 'Kepala Sekolah' },
            { path: '/admin/visi-misi', label: 'Visi & Misi' },
            { path: '/admin/struktur-organisasi', label: 'Struktur Organisasi' },
          ]"
        />

        <!-- Data Kepegawaian Dropdown -->
        <MenuDropdown
          title="Data Kepegawaian"
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          :items="[
            { path: '/admin/guru', label: 'Data Guru' },
            { path: '/admin/tata-usaha', label: 'Tata Usaha' },
          ]"
        />

        <!-- Data Siswa Dropdown -->
        <MenuDropdown
          title="Data Siswa"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          :items="[
            { path: '/admin/siswa', label: 'Data Siswa' },
            { path: '/admin/kelas', label: 'Data Kelas' },
            { path: '/admin/pojok-siswa', label: 'Pojok Siswa' },
            { path: '/admin/prestasi', label: 'Prestasi' },
            { path: '/admin/ekstrakurikuler', label: 'Ekstrakurikuler' },
          ]"
        />

        <!-- Akademik Dropdown -->
        <MenuDropdown
          title="Akademik"
          icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          :items="[
            { path: '/admin/program-keahlian', label: 'Program Keahlian' },
            { path: '/admin/konsentrasi-keahlian', label: 'Konsentrasi Keahlian' },
            { path: '/admin/mata-pelajaran', label: 'Mata Pelajaran' },
            { path: '/admin/jadwal-pelajaran', label: 'Jadwal Pelajaran' },
            { path: '/admin/struktur-kurikulum', label: 'Struktur Kurikulum' },
            { path: '/admin/kalender-akademik', label: 'Kalender Akademik' },
          ]"
        />

        <!-- PKL Dropdown -->
        <MenuDropdown
          title="PKL"
          icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          :items="[
            { path: '/admin/perusahaan-pkl', label: 'Data Perusahaan' },
            { path: '/admin/pkl', label: 'Data PKL' },
            { path: '/admin/laporan-pkl', label: 'Laporan PKL' },
          ]"
        />

        <!-- Publikasi Dropdown -->
        <MenuDropdown
          title="Publikasi"
          icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          :items="[
            { path: '/admin/berita', label: 'Berita' },
            { path: '/admin/kategori-berita', label: 'Kategori Berita' },
            { path: '/admin/agenda', label: 'Agenda Kegiatan' },
            { path: '/admin/informasi', label: 'Informasi Umum' },
            { path: '/admin/kategori-informasi', label: 'Kategori Informasi' },
          ]"
        />

        <!-- Fasilitas & Program Dropdown -->
        <MenuDropdown
          title="Fasilitas & Program"
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          :items="[
            { path: '/admin/fasilitas', label: 'Data Fasilitas' },
            { path: '/admin/program-unggulan', label: 'Program Unggulan' },
          ]"
        />

        <!-- Komunikasi Dropdown -->
        <MenuDropdown
          title="Komunikasi"
          icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          :items="[
            { path: '/admin/kontak', label: 'Pesan Kontak' },
            { path: '/admin/social-media', label: 'Social Media' },
            { path: '/admin/testimoni', label: 'Testimonial' },
            { path: '/admin/instagram', label: 'Instagram Post' },
          ]"
        />

        <!-- Pengaturan Dropdown -->
        <MenuDropdown
          title="Pengaturan"
          icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          :items="[
            { path: '/admin/users', label: 'User Management' },
            { path: '/admin/pengaturan-website', label: 'Pengaturan Website' },
          ]"
        />

        <!-- Logout -->
        <div class="mt-6 pt-6 border-t border-gray-700">
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2.5 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition text-sm"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="lg:ml-64 transition-all duration-300">
      <!-- Top Header -->
      <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        <div class="flex items-center space-x-2 ml-auto">
          <div
            class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
          >
            {{ authStore.userName.charAt(0).toUpperCase() }}
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-gray-900">{{ authStore.userName }}</p>
            <p class="text-xs text-gray-500">{{ authStore.userRole }}</p>
          </div>
        </div>
      </header>

      <!-- Content Slot -->
      <main class="p-6">
        <router-view />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MenuDropdown from '@/components/admin/MenuDropdown.vue'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(true)

// Untuk auto-close dropdown lain
const dropdowns = ref([])

provide('registerDropdown', (closeFn) => {
  dropdowns.value.push(closeFn)
})

provide('closeOtherDropdowns', () => {
  dropdowns.value.forEach((closeFn) => closeFn())
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
