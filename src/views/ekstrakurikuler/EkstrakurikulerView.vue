<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-blue-800 text-white py-16 overflow-hidden">
      <!-- Background Image dengan Overlay -->
      <div class="absolute inset-0">
        <img src="/images/bg_ekskul.png" alt="Banner Prestasi" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Ekstrakurikuler</h1>
        <p class="text-lg md:text-xl text-blue-100">Kegiatan Ekstrakurikuler di SMKN 11 Bandung</p>
      </div>
    </section>

    <!-- Filter Section -->
    <section class="bg-gray-50 py-6 border-b">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <!-- Search -->
          <div class="flex-1 min-w-[250px]">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari ekstrakurikuler..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                class="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Filter Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectedCategory = 'semua'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                selectedCategory === 'semua'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              Semua
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Ekstrakurikuler Grid -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600">Memuat data ekstrakurikuler...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredEkskul.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-4 text-xl font-medium text-gray-900">
            Tidak ada ekstrakurikuler ditemukan
          </h3>
          <p class="mt-2 text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
        </div>

        <!-- Ekstrakurikuler Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="ekskul in filteredEkskul"
            :key="ekskul.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Image -->
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img
                v-if="ekskul.gambar_url"
                :src="ekskul.gambar_url"
                :alt="ekskul.nama_ekstrakurikuler"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                <span class="text-gray-400 text-sm">Tidak ada gambar</span>
              </div>
              <!-- Badge Status -->
              <div class="absolute top-3 right-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    ekskul.status === 'aktif'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white',
                  ]"
                >
                  {{ ekskul.status === 'aktif' ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </div>
              <!-- Badge Kategori -->
              <div class="absolute top-3 left-3">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                  {{ ekskul.kategori }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <!-- Title -->
              <h3 class="font-bold text-xl text-gray-800 mb-2">
                {{ ekskul.nama_ekstrakurikuler }}
              </h3>

              <!-- Description -->
              <p class="text-gray-600 text-justify text-sm mb-4 line-clamp-3">
                {{ ekskul.deskripsi ? ekskul.deskripsi.replace(/<[^>]*>/g, '') : '' }}
              </p>

              <!-- Info Grid -->
              <div class="space-y-2 mb-4">
                <!-- Tempat -->
                <div class="flex items-start text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{{ ekskul.tempat || 'Belum ditentukan' }}</span>
                </div>

                <!-- Jadwal -->
                <div class="flex items-start text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {{ ekskul.hari_latihan || 'Belum ditentukan' }}
                    {{ ekskul.jam_latihan ? `, ${ekskul.jam_latihan}` : '' }}
                  </span>
                </div>

                <!-- Pembina -->
                <div v-if="ekskul.pembina" class="flex items-start text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div><span class="font-medium">Pembina:</span> {{ ekskul.pembina }}</div>
                </div>
              </div>

              <!-- Footer Info -->
              <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                    />
                  </svg>
                  <span>{{ ekskul.jumlah_anggota || 0 }} Anggota</span>
                </div>
                <div class="flex items-center gap-3">
                  <!-- Tombol Detail -->
                  <button
                    @click="openDetail(ekskul)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Detail
                  </button>
                  <!-- Contact Button -->
                  <a
                    v-if="ekskul.no_telepon_pembina || ekskul.email_pembina"
                    :href="getContactLink(ekskul)"
                    target="_blank"
                    class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Kontak
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Detail Ekstrakurikuler -->
    <div
      v-if="showDetail"
      class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      @click.self="closeDetail"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header Modal -->
        <div class="relative">
          <!-- Gambar Header -->
          <div class="h-56 bg-gray-200 rounded-t-2xl overflow-hidden">
            <img
              v-if="selectedEkskul?.gambar_url"
              :src="selectedEkskul.gambar_url"
              :alt="selectedEkskul.nama_ekstrakurikuler"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center"
            >
              <svg class="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <!-- Overlay badges -->
            <div class="absolute top-4 left-4 flex gap-2">
              <span
                v-if="selectedEkskul?.kategori"
                class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow"
              >
                {{ selectedEkskul.kategori }}
              </span>
              <span
                :class="selectedEkskul?.status === 'aktif' ? 'bg-green-500' : 'bg-gray-500'"
                class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow"
              >
                {{ selectedEkskul?.status === 'aktif' ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </div>
            <!-- Tombol Tutup -->
            <button
              @click="closeDetail"
              class="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 shadow transition"
            >
              <svg
                class="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body Modal -->
        <div class="p-6 space-y-5">
          <!-- Nama -->
          <h2 class="text-2xl font-bold text-gray-900">
            {{ selectedEkskul?.nama_ekstrakurikuler }}
          </h2>

          <!-- Info Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <span class="font-medium text-gray-700 block">Tempat</span>
                {{ selectedEkskul?.tempat || 'Belum ditentukan' }}
              </div>
            </div>
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <span class="font-medium text-gray-700 block">Jadwal</span>
                {{ selectedEkskul?.hari_latihan || 'Belum ditentukan' }}
                {{ selectedEkskul?.jam_latihan ? `, ${selectedEkskul.jam_latihan}` : '' }}
              </div>
            </div>
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
                />
              </svg>
              <div>
                <span class="font-medium text-gray-700 block">Jumlah Anggota</span>
                {{ selectedEkskul?.jumlah_anggota || 0 }} orang
              </div>
            </div>
            <div
              v-if="selectedEkskul?.pembina"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div>
                <span class="font-medium text-gray-700 block">Pembina</span>
                {{ selectedEkskul.pembina }}
              </div>
            </div>
            <div
              v-if="selectedEkskul?.no_telepon_pembina"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <span class="font-medium text-gray-700 block">No. Telepon</span>
                {{ selectedEkskul.no_telepon_pembina }}
              </div>
            </div>
            <div
              v-if="selectedEkskul?.email_pembina"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <span class="font-medium text-gray-700 block">Email Pembina</span>
                {{ selectedEkskul.email_pembina }}
              </div>
            </div>
          </div>

          <!-- Deskripsi -->
          <div v-if="selectedEkskul?.deskripsi" class="border-t pt-4">
            <h3 class="font-semibold text-gray-700 mb-2">Deskripsi</h3>
            <div
              class="prose prose-sm max-w-none text-gray-600 text-justify"
              v-html="selectedEkskul.deskripsi"
            ></div>
          </div>

          <!-- Footer Modal -->
          <div class="border-t pt-4 flex justify-between items-center">
            <a
              v-if="selectedEkskul?.no_telepon_pembina || selectedEkskul?.email_pembina"
              :href="getContactLink(selectedEkskul)"
              target="_blank"
              class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Hubungi Pembina
            </a>
            <button
              @click="closeDetail"
              class="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 ml-auto"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'

const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('semua')
const ekskulList = ref([])
const showDetail = ref(false)
const selectedEkskul = ref(null)

// Get unique categories from data
const categories = computed(() => {
  const cats = new Set(ekskulList.value.map((e) => e.kategori).filter(Boolean))
  return Array.from(cats).sort()
})

// Computed untuk filter ekstrakurikuler
const filteredEkskul = computed(() => {
  let result = ekskulList.value

  // Filter hanya yang aktif
  result = result.filter((e) => e.status === 'aktif')

  // Filter by category
  if (selectedCategory.value !== 'semua') {
    result = result.filter((e) => e.kategori === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (e) =>
        e.nama_ekstrakurikuler.toLowerCase().includes(query) ||
        (e.deskripsi && e.deskripsi.toLowerCase().includes(query)) ||
        (e.pembina && e.pembina.toLowerCase().includes(query)) ||
        (e.kategori && e.kategori.toLowerCase().includes(query)),
    )
  }

  return result
})

const openDetail = (ekskul) => {
  selectedEkskul.value = ekskul
  showDetail.value = true
  document.body.style.overflow = 'hidden'
}

const closeDetail = () => {
  showDetail.value = false
  selectedEkskul.value = null
  document.body.style.overflow = ''
}

// Get image URL dari backend
const getImageUrl = (gambar) => {
  if (!gambar) {
    return '/img/default-ekskul.jpg'
  }
  if (gambar.startsWith('http://') || gambar.startsWith('https://')) {
    return gambar
  }
  return `http://localhost:8000/storage/${gambar}`
}

// Handle image error - fallback ke default image
const handleImageError = (event) => {
  event.target.src = '/img/default-ekskul.jpg'
}

// Get contact link (WhatsApp or Email)
const getContactLink = (ekskul) => {
  if (ekskul.no_telepon_pembina) {
    // Format nomor WhatsApp (hapus karakter non-digit)
    const phone = ekskul.no_telepon_pembina.replace(/\D/g, '')
    // Jika nomor mulai dengan 0, ganti dengan 62
    const waPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone
    return `https://wa.me/${waPhone}?text=Halo, saya ingin bertanya tentang ${ekskul.nama_ekstrakurikuler}`
  } else if (ekskul.email_pembina) {
    return `mailto:${ekskul.email_pembina}?subject=Informasi ${ekskul.nama_ekstrakurikuler}`
  }
  return '#'
}

// Fetch data ekstrakurikuler dari API
const fetchEkstrakurikuler = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/ekstrakurikulers', {
      params: {
        status: 'aktif',
        per_page: 100,
      },
    })

    console.log('Response:', response.data) // Debug

    // Ambil data dari response (sesuaikan dengan struktur backend)
    let data = []

    if (response.data.data) {
      // Jika ada pagination
      data = response.data.data.data || response.data.data
    } else if (response.data.ekstrakurikulers) {
      data = response.data.ekstrakurikulers
    } else if (Array.isArray(response.data)) {
      data = response.data
    }

    console.log('Data:', data) // Debug

    ekskulList.value = Array.isArray(data) ? data : []
    loading.value = false
  } catch (error) {
    console.error('Error fetching ekstrakurikuler:', error)

    // Fallback data dummy
    ekskulList.value = [
      {
        id: 1,
        nama_ekstrakurikuler: 'Paskibra',
        kategori: 'Bela Negara',
        deskripsi:
          'Pasukan Pengibar Bendera Pusaka adalah ekstrakurikuler yang melatih kedisiplinan dan jiwa patriotisme siswa.',
        tempat: 'Lapangan Upacara',
        hari_latihan: 'Senin & Rabu',
        jam_latihan: '15:00 - 17:00',
        pembina: 'Bapak Suherman, S.Pd',
        no_telepon_pembina: '081234567890',
        email_pembina: null,
        jumlah_anggota: 40,
        gambar: null,
        status: 'aktif',
      },
      // ... data dummy lainnya
    ]

    loading.value = false
  }
}

onMounted(() => {
  fetchEkstrakurikuler()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
