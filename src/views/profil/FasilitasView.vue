<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-2">Fasilitas</h1>
        <p class="text-blue-100 text-lg">Fasilitas SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- LIST VIEW -->
      <div v-if="viewMode === 'list'">
        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama fasilitas..."
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              @input="filterFasilitas"
            />

            <!-- Filter Kategori -->
            <select
              v-model="filterKategori"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              @change="filterFasilitas"
            >
              <option value="">Semua Kategori</option>
              <option v-for="kat in kategoriList" :key="kat" :value="kat">{{ kat }}</option>
            </select>

            <!-- Filter Kondisi -->
            <select
              v-model="filterKondisi"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              @change="filterFasilitas"
            >
              <option value="">Semua Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="mt-4 text-gray-600">Memuat data fasilitas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-600">{{ error }}</p>
          <button
            @click="fetchFasilitas"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Fasilitas Grid -->
        <div
          v-else-if="paginatedFasilitas.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="item in paginatedFasilitas"
            :key="item.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            @click="openModal(item)"
          >
            <!-- Image -->
            <div class="relative h-56 bg-gray-200">
              <img
                v-if="item.gambar"
                :src="`http://localhost:8000/storage/${item.gambar}`"
                :alt="item.nama_fasilitas"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg
                  class="w-20 h-20 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <!-- Kondisi Badge -->
              <div class="absolute top-4 right-4">
                <span
                  :class="getBadgeClass(item.kondisi)"
                  class="px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                >
                  {{ item.kondisi }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
                {{ item.nama_fasilitas }}
              </h3>

              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  v-if="item.kategori"
                  class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {{ item.kategori }}
                </span>
                <span v-if="item.jumlah" class="text-sm text-blue-600 font-medium">
                  Jumlah: {{ item.jumlah }}
                </span>
              </div>

              <p class="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[60px]">
                {{ item.deskripsi || 'Tidak ada deskripsi' }}
              </p>

              <div class="flex items-center justify-between pt-3 border-t">
                <span class="text-sm text-gray-500">
                  {{ item.galeri_fasilitas?.length || 0 }} Foto
                </span>
                <span class="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Lihat Detail →
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
          <svg
            class="w-20 h-20 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-gray-600 text-lg">Tidak ada fasilitas ditemukan</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600 hover:text-white'
            "
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg transition-colors"
          >
            « Prev
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 hover:bg-blue-600 hover:text-white'
            "
            class="px-4 py-2 border border-blue-600 rounded-lg transition-colors"
          >
            {{ page }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600 hover:text-white'
            "
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg transition-colors"
          >
            Next »
          </button>
        </div>

        <!-- Info Pagination -->
        <div v-if="filteredFasilitas.length > 0" class="text-center mt-4 text-sm text-gray-600">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredFasilitas.length) }} dari
          {{ filteredFasilitas.length }} fasilitas
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="viewMode === 'detail' && selectedItem">
        <!-- Tombol Kembali -->
        <button
          @click="closeModal"
          class="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Daftar Fasilitas
        </button>

        <div class="bg-white rounded-lg shadow-md p-8">
          <!-- Header -->
          <h2 class="text-3xl font-bold text-gray-800 mb-6">{{ selectedItem.nama_fasilitas }}</h2>

          <!-- Main Image -->
          <div class="mb-8">
            <div class="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                v-if="selectedItem.gambar"
                :src="`http://localhost:8000/storage/${selectedItem.gambar}`"
                :alt="selectedItem.nama_fasilitas"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg
                  class="w-32 h-32 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Kategori</p>
              <p class="font-semibold">{{ selectedItem.kategori || '-' }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Kondisi</p>
              <span
                :class="getBadgeClass(selectedItem.kondisi)"
                class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ selectedItem.kondisi }}
              </span>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Jumlah</p>
              <p class="font-semibold">{{ selectedItem.jumlah || '-' }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Total Galeri</p>
              <p class="font-semibold">{{ selectedItem.galeri_fasilitas?.length || 0 }} Foto</p>
            </div>
          </div>

          <!-- Deskripsi -->
          <div class="mb-8 border-t pt-6">
            <h3 class="font-semibold text-xl mb-3">Deskripsi</h3>
            <p class="text-gray-700 leading-relaxed">
              {{ selectedItem.deskripsi || 'Tidak ada deskripsi' }}
            </p>
          </div>

          <!-- Galeri -->
          <div v-if="selectedItem.galeri_fasilitas && selectedItem.galeri_fasilitas.length > 0">
            <h3 class="font-semibold text-xl mb-4">Galeri Foto</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="galeri in selectedItem.galeri_fasilitas"
                :key="galeri.id"
                class="relative group cursor-pointer"
                @click="openImageModal(`http://localhost:8000/storage/${galeri.gambar}`)"
              >
                <img
                  :src="`http://localhost:8000/storage/${galeri.gambar}`"
                  :alt="galeri.keterangan || 'Galeri'"
                  class="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div
      v-if="viewingImage"
      @click="viewingImage = null"
      class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[60] p-4"
    >
      <img :src="viewingImage" class="max-w-full max-h-full object-contain" @click.stop />
      <button
        @click="viewingImage = null"
        class="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'

const fasilitasList = ref([])
const loading = ref(true)
const error = ref(null)
const selectedItem = ref(null)
const viewingImage = ref(null)
const searchQuery = ref('')
const filterKategori = ref('')
const filterKondisi = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const viewMode = ref('list')

// Fetch data dari API
const fetchFasilitas = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiClient.get('/fasilitas')
    if (response.data.success) {
      fasilitasList.value = response.data.data.sort((a, b) =>
        a.nama_fasilitas.localeCompare(b.nama_fasilitas),
      )
    } else {
      error.value = 'Gagal memuat data fasilitas'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat memuat data'
    console.error('Error fetching fasilitas:', err)
  } finally {
    loading.value = false
  }
}

// Get unique categories
const kategoriList = computed(() => {
  const kategori = [...new Set(fasilitasList.value.map((f) => f.kategori).filter(Boolean))]
  return kategori.sort()
})

// Filtered fasilitas
const filteredFasilitas = computed(() => {
  let result = fasilitasList.value

  if (searchQuery.value) {
    result = result.filter(
      (item) =>
        item.nama_fasilitas.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.deskripsi?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (filterKategori.value) {
    result = result.filter((item) => item.kategori === filterKategori.value)
  }

  if (filterKondisi.value) {
    result = result.filter((item) => item.kondisi === filterKondisi.value)
  }

  return result
})

// Paginated fasilitas
const paginatedFasilitas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredFasilitas.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredFasilitas.value.length / itemsPerPage.value)
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Filter handler
const filterFasilitas = () => {
  currentPage.value = 1
}

// Get badge color class based on kondisi
const getBadgeClass = (kondisi) => {
  switch (kondisi) {
    case 'Baik':
      return 'bg-green-100 text-green-800'
    case 'Rusak Ringan':
      return 'bg-yellow-100 text-yellow-800'
    case 'Rusak Berat':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Modal functions
const openModal = (item) => {
  selectedItem.value = item
  viewMode.value = 'detail'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closeModal = () => {
  selectedItem.value = null
  viewMode.value = 'list'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openImageModal = (imageUrl) => {
  viewingImage.value = imageUrl
}

onMounted(() => {
  fetchFasilitas()
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
