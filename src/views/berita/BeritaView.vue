<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Berita</h1>
        <p class="mt-2">Berita terkini SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter & Search -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari berita..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @input="searchBerita"
          />
          <select
            v-model="selectedKategori"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterBerita"
          >
            <option value="">Semua Kategori</option>
            <option v-for="kategori in kategoris" :key="kategori.id" :value="kategori.id">
              {{ kategori.nama_kategori }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600">Memuat berita...</p>
      </div>

      <!-- Berita List -->
      <div v-else-if="beritaList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="berita in beritaList"
          :key="berita.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            v-if="berita.gambar_utama"
            :src="`http://localhost:8000/storage/${berita.gambar_utama}`"
            :alt="berita.judul"
            class="w-full h-48 object-cover"
          />
          <div v-else class="w-full h-48 bg-gray-300 flex items-center justify-center">
            <span class="text-gray-500">Tidak ada gambar</span>
          </div>

          <div class="p-6">
            <span v-if="berita.kategoriBerita" class="text-sm text-blue-600 font-semibold">
              {{ berita.kategoriBerita.nama_kategori }}
            </span>
            <h3 class="text-xl font-bold mt-2 mb-3 line-clamp-2">
              {{ berita.judul }}
            </h3>
            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ berita.ringkasan || stripHtml(berita.konten).substring(0, 150) + '...' }}
            </p>
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{{ formatDate(berita.published_at || berita.created_at) }}</span>
              <span v-if="berita.penulis">{{ berita.penulis }}</span>
            </div>
            <router-link
              :to="`/berita/${berita.id}`"
              class="text-blue-600 font-semibold hover:underline"
            >
              Baca Selengkapnya →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600">Tidak ada berita tersedia.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axios'

const beritaList = ref([])
const kategoris = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedKategori = ref('')

const fetchBerita = async () => {
  try {
    loading.value = true
    const params = {}

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (selectedKategori.value) {
      params.kategori_berita_id = selectedKategori.value
    }

    const response = await apiClient.get('/berita', { params })
    beritaList.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching berita:', error)
  } finally {
    loading.value = false
  }
}

const fetchKategori = async () => {
  try {
    const response = await apiClient.get('/kategori-berita')
    kategoris.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching kategori:', error)
  }
}

const searchBerita = () => {
  fetchBerita()
}

const filterBerita = () => {
  fetchBerita()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

onMounted(() => {
  fetchBerita()
  fetchKategori()
})
</script>
