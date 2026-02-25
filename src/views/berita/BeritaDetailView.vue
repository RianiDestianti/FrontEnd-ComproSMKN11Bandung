<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Detail Berita</h1>
        <p class="mt-2">SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600">Memuat berita...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-red-600">{{ error }}</p>
        <router-link to="/berita" class="text-blue-600 hover:underline mt-4 inline-block">
          ← Kembali ke Daftar Berita
        </router-link>
      </div>

      <!-- Berita Detail -->
      <div v-else-if="berita" class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Gambar Utama -->
        <img
          v-if="berita.gambar_utama"
          :src="`http://localhost:8000/storage/${berita.gambar_utama}`"
          :alt="berita.judul"
          class="w-full h-96 object-cover"
        />

        <!-- Content -->
        <div class="p-8">
          <!-- Kategori & Tanggal & Views -->
          <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span
              v-if="berita.kategoriBerita"
              class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold"
            >
              {{ berita.kategoriBerita.nama_kategori }}
            </span>
            <span>
              <i class="fas fa-calendar"></i>
              {{ formatDate(berita.published_at || berita.created_at) }}
            </span>
            <span v-if="berita.penulis">
              <i class="fas fa-user"></i>
              {{ berita.penulis }}
            </span>
            <span>
              <i class="fas fa-eye"></i>
              {{ berita.views || 0 }} views
            </span>
          </div>

          <!-- Judul -->
          <h1 class="text-3xl font-bold mb-4">{{ berita.judul }}</h1>

          <!-- Ringkasan -->
          <p
            v-if="berita.ringkasan"
            class="text-lg text-gray-700 italic mb-6 border-l-4 border-blue-600 pl-4"
          >
            {{ berita.ringkasan }}
          </p>

          <!-- Konten -->
          <div class="prose max-w-none" v-html="berita.konten"></div>

          <!-- Tags -->
          <div v-if="berita.tags" class="mt-8 pt-6 border-t">
            <p class="text-sm text-gray-600 mb-2">Tags:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in berita.tags.split(',')"
                :key="tag"
                class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {{ tag.trim() }}
              </span>
            </div>
          </div>

          <!-- Back Button -->
          <div class="mt-8 pt-6 border-t">
            <router-link
              to="/berita"
              class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Kembali ke Daftar Berita
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/api/axios'

const route = useRoute()
const berita = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchBerita = async () => {
  try {
    loading.value = true
    const response = await apiClient.get(`/berita/${route.params.id}`)

    console.log('Berita loaded:', response.data)

    if (response.data.success) {
      berita.value = response.data.data

      // Track view hanya jika belum pernah dibaca
      await trackView()
    }
  } catch (err) {
    console.error('Error fetching berita:', err)
    error.value = 'Berita tidak ditemukan'
  } finally {
    loading.value = false
  }
}

const trackView = async () => {
  if (!berita.value) {
    console.log('Berita value is null, skipping trackView')
    return
  }

  const viewedKey = `berita_viewed_${berita.value.id}`
  const hasViewed = localStorage.getItem(viewedKey)

  console.log('Check viewed:', {
    beritaId: berita.value.id,
    hasViewed: hasViewed,
    currentViews: berita.value.views,
  })

  // Jika belum pernah view, increment views
  if (!hasViewed) {
    try {
      console.log('Incrementing views for berita:', berita.value.id)

      // Buat request tanpa auth token untuk increment views
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${API_URL}/berita/${berita.value.id}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      const data = await response.json()

      console.log('Increment views response:', data)

      if (data.success) {
        // Update views di data lokal
        berita.value.views = data.data.views
        // Tandai sudah dibaca dengan timestamp
        localStorage.setItem(viewedKey, Date.now())

        console.log('Views updated to:', berita.value.views)
      }
    } catch (err) {
      console.error('Error increment views:', err)
    }
  } else {
    console.log('Already viewed, skipping increment')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Optional: Clean old view records (lebih dari 30 hari)
const cleanOldViewRecords = () => {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('berita_viewed_')) {
      const timestamp = parseInt(localStorage.getItem(key))
      if (timestamp < thirtyDaysAgo) {
        localStorage.removeItem(key)
      }
    }
  })
}

onMounted(() => {
  fetchBerita()
  cleanOldViewRecords()
})
</script>
