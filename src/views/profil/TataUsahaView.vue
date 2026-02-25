<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-2">Tata Usaha</h1>
        <p class="text-green-100 text-lg">Tenaga Administrasi SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- LIST VIEW -->
      <div v-if="viewMode === 'list'">
        <!-- Filter -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama tata usaha..."
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              @input="filterTataUsaha"
            />
            <select
              v-model="filterJabatan"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              @change="filterTataUsaha"
            >
              <option value="">Semua Jabatan</option>
              <option v-for="jabatan in jabatanList" :key="jabatan" :value="jabatan">
                {{ jabatan }}
              </option>
            </select>
            <select
              v-model="filterStatus"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              @change="filterTataUsaha"
            >
              <option value="">Semua Status</option>
              <option value="PNS">PNS</option>
              <option value="Honor">Honor</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"
          ></div>
          <p class="mt-4 text-gray-600">Memuat data tata usaha...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-600">{{ error }}</p>
          <button
            @click="fetchTataUsaha"
            class="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Tata Usaha Grid - 5 Kolom seperti Guru -->
        <div
          v-else-if="paginatedTataUsaha.length > 0"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          <div
            v-for="item in paginatedTataUsaha"
            :key="item.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Foto -->
            <div class="relative aspect-square bg-gradient-to-br from-green-100 to-green-50">
              <img
                v-if="item.foto"
                :src="`http://localhost:8000/${item.foto}`"
                :alt="item.nama"
                class="w-full h-full object-contain p-4"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-6xl">{{ item.jenis_kelamin === 'L' ? '👨‍💼' : '👩‍💼' }}</span>
              </div>

              <!-- Status Badge -->
              <div class="absolute top-2 right-2">
                <span
                  class="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md"
                >
                  {{ item.status_kepegawaian }}
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-4">
              <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[40px]">
                {{ item.nama }}
              </h3>
              <p v-if="item.nip" class="text-xs text-gray-500 mb-2">NIP: {{ item.nip }}</p>

              <div class="space-y-1 mb-3 min-h-[60px]">
                <p v-if="item.jabatan" class="text-xs text-green-600 font-semibold line-clamp-2">
                  {{ item.jabatan }}
                </p>
                <p v-if="item.bidang" class="text-xs text-gray-600 line-clamp-1">
                  {{ item.bidang }}
                </p>
              </div>

              <button
                @click="showDetail(item)"
                class="w-full py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Lihat Detail
              </button>
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p class="text-gray-600 text-lg">Tidak ada data tata usaha ditemukan</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-600 hover:text-white'
            "
            class="px-4 py-2 border border-green-600 text-green-600 rounded-lg transition-colors"
          >
            « Prev
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="
              currentPage === page
                ? 'bg-green-600 text-white'
                : 'text-green-600 hover:bg-green-600 hover:text-white'
            "
            class="px-4 py-2 border border-green-600 rounded-lg transition-colors"
          >
            {{ page }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-600 hover:text-white'
            "
            class="px-4 py-2 border border-green-600 text-green-600 rounded-lg transition-colors"
          >
            Next »
          </button>
        </div>

        <!-- Info Pagination -->
        <div v-if="filteredTataUsaha.length > 0" class="text-center mt-4 text-sm text-gray-600">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredTataUsaha.length) }} dari
          {{ filteredTataUsaha.length }} tata usaha
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="viewMode === 'detail' && selectedItem">
        <!-- Tombol Kembali -->
        <button
          @click="backToList"
          class="mb-6 flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Daftar Tata Usaha
        </button>

        <div class="bg-white rounded-xl shadow-md p-8">
          <!-- Header -->
          <h2 class="text-3xl font-bold text-gray-800 mb-6">Profil Tata Usaha</h2>

          <!-- Foto & Info Utama -->
          <div class="flex flex-col md:flex-row gap-8 mb-8">
            <div class="md:w-1/3">
              <div
                class="relative h-80 bg-gradient-to-br from-green-100 to-green-50 rounded-lg overflow-hidden"
              >
                <img
                  v-if="selectedItem.foto"
                  :src="`http://localhost:8000/${selectedItem.foto}`"
                  :alt="selectedItem.nama"
                  class="w-full h-full object-contain p-4"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-8xl">{{
                    selectedItem.jenis_kelamin === 'L' ? '👨‍💼' : '👩‍💼'
                  }}</span>
                </div>
              </div>
            </div>

            <div class="md:w-2/3 space-y-4">
              <div>
                <h3 class="text-2xl font-bold text-gray-800">{{ selectedItem.nama }}</h3>
                <p v-if="selectedItem.nip" class="text-gray-500">NIP: {{ selectedItem.nip }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Status Kepegawaian</p>
                  <p class="font-semibold text-green-600">{{ selectedItem.status_kepegawaian }}</p>
                </div>
                <div v-if="selectedItem.jabatan">
                  <p class="text-gray-500">Jabatan</p>
                  <p class="font-semibold">{{ selectedItem.jabatan }}</p>
                </div>
                <div v-if="selectedItem.bidang">
                  <p class="text-gray-500">Bidang</p>
                  <p class="font-semibold">{{ selectedItem.bidang }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Status</p>
                  <span
                    :class="
                      selectedItem.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ selectedItem.status === 'aktif' ? 'Aktif' : 'Non-Aktif' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Detail -->
          <div class="border-t pt-6 space-y-6">
            <div>
              <h4 class="font-bold text-gray-800 text-lg mb-4">Informasi Pribadi</h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Jenis Kelamin</p>
                  <p class="font-semibold">
                    {{ selectedItem.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                  </p>
                </div>

                <div v-if="selectedItem.email">
                  <p class="text-gray-500">Email</p>
                  <p class="font-semibold">{{ selectedItem.email }}</p>
                </div>

                <div v-if="selectedItem.tanggal_masuk">
                  <p class="text-gray-500">Tanggal Masuk</p>
                  <p class="font-semibold">{{ formatDate(selectedItem.tanggal_masuk) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'

const tataUsahaList = ref([])
const loading = ref(true)
const error = ref(null)
const selectedItem = ref(null)
const viewMode = ref('list')
const searchQuery = ref('')
const filterJabatan = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const fetchTataUsaha = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiClient.get('/tata-usaha')
    if (response.data.success) {
      tataUsahaList.value = response.data.data
        .filter((item) => item.status === 'aktif')
        .sort((a, b) => a.nama.localeCompare(b.nama))
    } else {
      error.value = 'Gagal memuat data tata usaha'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat memuat data'
    console.error('Error fetching tata usaha:', err)
  } finally {
    loading.value = false
  }
}

const jabatanList = computed(() => {
  const jabatan = [...new Set(tataUsahaList.value.map((item) => item.jabatan).filter(Boolean))]
  return jabatan.sort()
})

const filteredTataUsaha = computed(() => {
  let result = tataUsahaList.value

  if (searchQuery.value) {
    result = result.filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (filterJabatan.value) {
    result = result.filter(
      (item) =>
        item.jabatan && item.jabatan.toLowerCase().includes(filterJabatan.value.toLowerCase()),
    )
  }

  if (filterStatus.value) {
    result = result.filter((item) => item.status_kepegawaian === filterStatus.value)
  }

  return result
})

const paginatedTataUsaha = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTataUsaha.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTataUsaha.value.length / itemsPerPage.value)
})

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

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const filterTataUsaha = () => {
  currentPage.value = 1
}

const showDetail = (item) => {
  selectedItem.value = item
  viewMode.value = 'detail'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const backToList = () => {
  selectedItem.value = null
  viewMode.value = 'list'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(() => {
  fetchTataUsaha()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
