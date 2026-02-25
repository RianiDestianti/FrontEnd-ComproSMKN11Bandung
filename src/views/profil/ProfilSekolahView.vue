<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-blue-600 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-center">
          {{ profil?.nama_sekolah || 'SMKN 11 Bandung' }}
        </h1>
        <p class="text-center mt-2 text-blue-100">
          {{ profil?.akreditasi ? `Akreditasi ${profil.akreditasi}` : '' }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="profilStore.loading" class="container mx-auto px-4 py-12">
      <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="profil" class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Logo & Info Dasar -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <!-- Logo -->
            <div v-if="profil.logo_url" class="flex-shrink-0">
              <img
                :src="profil.logo_url"
                :alt="profil.nama_sekolah"
                class="w-32 h-32 object-contain"
              />
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Informasi Sekolah</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">NPSN</p>
                  <p class="font-medium">{{ profil.npsn || '-' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">NSS</p>
                  <p class="font-medium">{{ profil.nss || '-' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Email</p>
                  <p class="font-medium">{{ profil.email || '-' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Telepon</p>
                  <p class="font-medium">{{ profil.no_telepon || '-' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Tahun Berdiri</p>
                  <p class="font-medium">
                    {{ profil.tahun_berdiri || '-' }} ({{ profil.umur_sekolah }})
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Website</p>
                  <a
                    v-if="profil.website"
                    :href="profil.website"
                    target="_blank"
                    class="font-medium text-blue-600 hover:underline"
                  >
                    {{ profil.website }}
                  </a>
                  <p v-else class="font-medium">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alamat -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Alamat</h3>
          <p class="text-gray-700">{{ profil.alamat }}</p>
          <p class="text-gray-700">
            {{ profil.kota }}, {{ profil.provinsi }} {{ profil.kode_pos }}
          </p>
        </div>

        <!-- Sejarah -->
        <div v-if="profil.sejarah" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Sejarah</h3>
          <div class="text-gray-700 prose max-w-none" v-html="profil.sejarah"></div>
        </div>

        <!-- Visi -->
        <div v-if="profil.visi" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Visi</h3>
          <div class="text-gray-700 prose max-w-none" v-html="profil.visi"></div>
        </div>

        <!-- Misi -->
        <div v-if="profil.misi" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Misi</h3>
          <div class="text-gray-700 prose max-w-none" v-html="profil.misi"></div>
        </div>

        <!-- Tujuan -->
        <div v-if="profil.tujuan" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Tujuan</h3>
          <div class="text-gray-700 prose max-w-none" v-html="profil.tujuan"></div>
        </div>

        <!-- Fasilitas Info -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-3">Fasilitas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600">Luas Tanah</p>
              <p class="font-medium">{{ profil.luas_tanah ? `${profil.luas_tanah} m²` : '-' }}</p>
            </div>
            <div>
              <p class="text-gray-600">Luas Bangunan</p>
              <p class="font-medium">
                {{ profil.luas_bangunan ? `${profil.luas_bangunan} m²` : '-' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto text-center">
        <p class="text-red-600 mb-4">{{ profilStore.error || 'Gagal memuat profil sekolah' }}</p>
        <button
          @click="loadProfil"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProfilStore } from '@/stores/profil'

const profilStore = useProfilStore()
const profil = computed(() => profilStore.profil)

const loadProfil = async () => {
  await profilStore.fetchProfil()
}

onMounted(() => {
  loadProfil()
})
</script>
