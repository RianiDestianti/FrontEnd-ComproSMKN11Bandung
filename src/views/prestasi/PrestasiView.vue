<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-blue-800 text-white py-16 overflow-hidden">
      <!-- Background Image dengan Overlay -->
      <div class="absolute inset-0">
        <img
          src="/images/ilustrasi_prestasi.png"
          alt="Banner Prestasi"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Prestasi Siswa</h1>
        <p class="text-lg md:text-xl text-blue-100">
          Kebanggaan SMKN 11 Bandung dalam berbagai kompetisi
        </p>
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
                placeholder="Cari prestasi..."
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
              @click="selectedCategory = 'akademik'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                selectedCategory === 'akademik'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              Akademik
            </button>
            <button
              @click="selectedCategory = 'non-akademik'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition',
                selectedCategory === 'non-akademik'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              Non-Akademik
            </button>
          </div>
          <!-- Filter Tingkat -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectedLevel = 'semua'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition text-sm',
                selectedLevel === 'semua'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              Semua Tingkat
            </button>
            <button
              @click="selectedLevel = 'nasional'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition text-sm',
                selectedLevel === 'nasional'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              Nasional
            </button>
            <button
              @click="selectedLevel = 'provinsi'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition text-sm',
                selectedLevel === 'provinsi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100',
              ]"
            >
              Provinsi
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Prestasi Grid -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600">Memuat data prestasi...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredPrestasi.length === 0" class="text-center py-12">
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
          <h3 class="mt-4 text-xl font-medium text-gray-900">Tidak ada prestasi ditemukan</h3>
          <p class="mt-2 text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
        </div>

        <!-- Prestasi Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="prestasi in filteredPrestasi"
            :key="prestasi.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Image -->
            <div class="relative h-48 bg-gray-200 overflow-hidden">
              <img
                :src="getFotoUrl(prestasi.foto)"
                :alt="prestasi.judul"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
              <!-- Badge Kategori -->
              <div class="absolute top-3 right-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    prestasi.kategori === 'akademik'
                      ? 'bg-green-500 text-white'
                      : prestasi.kategori === 'olahraga'
                        ? 'bg-blue-500 text-white'
                        : prestasi.kategori === 'seni'
                          ? 'bg-purple-500 text-white'
                          : 'bg-orange-500 text-white',
                  ]"
                >
                  {{ formatKategori(prestasi.kategori) }}
                </span>
              </div>
              <!-- Badge Tingkat -->
              <div class="absolute top-3 left-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    prestasi.tingkat === 'internasional' || prestasi.tingkat === 'nasional'
                      ? 'bg-red-500 text-white'
                      : prestasi.tingkat === 'provinsi'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500 text-white',
                  ]"
                >
                  {{ formatTingkat(prestasi.tingkat) }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <!-- Title -->
              <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {{ prestasi.judul }}
              </h3>

              <!-- Info -->
              <div class="space-y-2 mb-3">
                <!-- Peringkat -->
                <div v-if="prestasi.peringkat" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="font-medium">{{ prestasi.peringkat }}</span>
                </div>

                <!-- Penyelenggara -->
                <div v-if="prestasi.penyelenggara" class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span class="truncate">{{ prestasi.penyelenggara }}</span>
                </div>

                <!-- Tanggal -->
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{{ formatTanggal(prestasi.tanggal_prestasi) }}</span>
                </div>
              </div>

              <!-- Description -->
              <p v-if="prestasi.deskripsi" class="text-gray-600 text-sm line-clamp-3 mb-4">
                {{ prestasi.deskripsi }}
              </p>

              <!-- Student Info -->
              <div class="pt-3 border-t border-gray-100">
                <p class="text-sm text-gray-700">
                  <span class="font-medium">Siswa:</span> {{ prestasi.nama_siswa }}
                  <span v-if="prestasi.kelas" class="text-gray-500"> ({{ prestasi.kelas }})</span>
                </p>
                <p v-if="prestasi.pembimbing" class="text-sm text-gray-600 mt-1">
                  <span class="font-medium">Pembimbing:</span> {{ prestasi.pembimbing }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination (jika diperlukan nanti) -->
        <!-- <div class="mt-8 flex justify-center">
          <nav class="flex space-x-2">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">2</button>
            <button class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">3</button>
          </nav>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import prestasiApi from '@/api/prestasi' // Sesuaikan path dengan struktur project Anda

const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('semua')
const selectedLevel = ref('semua') // Tambahan untuk filter tingkat
const prestasiList = ref([])

// Computed untuk filter prestasi
const filteredPrestasi = computed(() => {
  let result = prestasiList.value

  // Filter by category
  if (selectedCategory.value !== 'semua') {
    result = result.filter((p) => p.kategori === selectedCategory.value)
  }

  // Filter by level
  if (selectedLevel.value !== 'semua') {
    result = result.filter((p) => p.tingkat === selectedLevel.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.judul.toLowerCase().includes(query) ||
        p.nama_siswa.toLowerCase().includes(query) ||
        (p.kelas && p.kelas.toLowerCase().includes(query)) ||
        (p.pembimbing && p.pembimbing.toLowerCase().includes(query)) ||
        (p.penyelenggara && p.penyelenggara.toLowerCase().includes(query)),
    )
  }

  return result
})

// Fetch data prestasi dari API
const fetchPrestasi = async () => {
  loading.value = true
  try {
    const response = await prestasiApi.getAll({
      status: 'published', // Hanya ambil yang published
      sort_by: 'tanggal_prestasi',
      sort_order: 'desc',
      per_page: 100, // Ambil banyak data untuk ditampilkan
    })

    if (response.data.success) {
      prestasiList.value = response.data.data.data // data.data.data karena ada pagination
    }
  } catch (error) {
    console.error('Error fetching prestasi:', error)
  } finally {
    loading.value = false
  }
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/img/default-prestasi.jpg'
}

// Format tanggal ke bahasa Indonesia
const formatTanggal = (tanggal) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(tanggal).toLocaleDateString('id-ID', options)
}

// Get foto URL
const getFotoUrl = (foto) => {
  if (!foto) return '/img/default-prestasi.jpg'
  // Sesuaikan dengan base URL Laravel Anda
  return `${import.meta.env.VITE_API_URL.replace('/api', '')}/storage/${foto}`
}

// Format kategori untuk display
const formatKategori = (kategori) => {
  const kategoriMap = {
    akademik: 'Akademik',
    'non-akademik': 'Non-Akademik',
    olahraga: 'Olahraga',
    seni: 'Seni',
    lainnya: 'Lainnya',
  }
  return kategoriMap[kategori] || kategori
}

// Format tingkat untuk display
const formatTingkat = (tingkat) => {
  const tingkatMap = {
    sekolah: 'Sekolah',
    kecamatan: 'Kecamatan',
    kota: 'Kota',
    provinsi: 'Provinsi',
    nasional: 'Nasional',
    internasional: 'Internasional',
  }
  return tingkatMap[tingkat] || tingkat
}

onMounted(() => {
  fetchPrestasi()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
