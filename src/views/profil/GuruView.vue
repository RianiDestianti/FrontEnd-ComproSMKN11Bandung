<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="relative bg-blue-600 text-white py-12 overflow-hidden">
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/images/bg_dataguru.png')"
      ></div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-700/40"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold">Data Guru</h1>
        <p class="mt-2">Tenaga Pendidik SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama guru..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @input="filterGuru"
          />
          <select
            v-model="filterJabatan"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterGuru"
          >
            <option value="">Semua Jabatan</option>
            <option v-for="jabatan in jabatanList" :key="jabatan" :value="jabatan">
              {{ jabatan }}
            </option>
          </select>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterGuru"
          >
            <option value="">Semua Status</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="Honor">Honor</option>
            <option value="GTY">GTY</option>
            <option value="GTT">GTT</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat data guru...</p>
      </div>

      <!-- Guru Grid - KONSISTEN 5 KOLOM -->
      <div
        v-else-if="paginatedGuru.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="guru in paginatedGuru"
          :key="guru.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Foto -->
          <div class="relative aspect-square bg-gradient-to-br from-blue-100 to-blue-50">
            <div class="photo-container" v-if="guru.foto">
              <img
                :src="`http://localhost:8000/${guru.foto}`"
                :alt="guru.nama"
                class="w-full h-full object-contain p-4 guru-photo"
                @contextmenu.prevent
                draggable="false"
                ref="guruPhoto"
              />
              <div class="photo-overlay"></div>
              <div class="watermark" :data-name="guru.nama">
                <span class="watermark-text">{{ guru.nama }}</span>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2 text-center">
              ⚠️ Foto dilindungi hak cipta. Penggunaan tanpa izin dapat dikenakan sanksi.
            </p>

            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md"
              >
                {{ guru.status_kepegawaian }}
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[40px]">
              {{ guru.nama }}
            </h3>
            <p v-if="guru.nip" class="text-xs text-gray-500 mb-2">NIP: {{ guru.nip }}</p>

            <div class="space-y-1 mb-3 min-h-[60px]">
              <p
                v-if="guru.mata_pelajaran"
                class="text-xs text-blue-600 font-semibold line-clamp-2"
              >
                {{ guru.mata_pelajaran }}
              </p>
              <p v-if="guru.jabatan" class="text-xs text-gray-600 line-clamp-1">
                {{ guru.jabatan }}
              </p>
            </div>

            <button
              @click="showDetail(guru)"
              class="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">Tidak ada data guru ditemukan.</p>
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
      <div v-if="filteredGuru.length > 0" class="text-center mt-4 text-sm text-gray-600">
        Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, filteredGuru.length) }}
        dari {{ filteredGuru.length }} guru
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedGuru"
      @click="selectedGuru = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div @click.stop class="bg-white rounded-xl max-w-2xl w-full my-8">
        <div class="p-8">
          <!-- Header Modal -->
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Profil Guru</h2>
            <button
              @click="selectedGuru = null"
              class="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <!-- Foto & Info Utama -->
          <div class="flex flex-col md:flex-row gap-6 mb-6">
            <div class="md:w-1/3">
              <div
                class="relative h-64 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg overflow-hidden"
              >
                <img
                  v-if="selectedGuru.foto"
                  :src="`http://localhost:8000/${selectedGuru.foto}`"
                  :alt="selectedGuru.nama"
                  class="w-full h-full object-contain p-3"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-7xl">{{
                    selectedGuru.jenis_kelamin === 'L' ? '👨‍🏫' : '👩‍🏫'
                  }}</span>
                </div>
              </div>
            </div>

            <div class="md:w-2/3 space-y-3">
              <div>
                <h3 class="text-xl font-bold text-gray-800">{{ selectedGuru.nama }}</h3>
                <p v-if="selectedGuru.nip" class="text-sm text-gray-500">
                  NIP: {{ selectedGuru.nip }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p class="text-gray-500">Status Kepegawaian</p>
                  <p class="font-semibold text-blue-600">{{ selectedGuru.status_kepegawaian }}</p>
                </div>
                <div v-if="selectedGuru.jabatan">
                  <p class="text-gray-500">Jabatan</p>
                  <p class="font-semibold">{{ selectedGuru.jabatan }}</p>
                </div>
                <div v-if="selectedGuru.mata_pelajaran">
                  <p class="text-gray-500">Mata Pelajaran</p>
                  <p class="font-semibold">{{ selectedGuru.mata_pelajaran }}</p>
                </div>
                <div v-if="selectedGuru.pendidikan_terakhir">
                  <p class="text-gray-500">Pendidikan</p>
                  <p class="font-semibold">{{ selectedGuru.pendidikan_terakhir }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Detail -->
          <div class="border-t pt-6 space-y-4">
            <h4 class="font-bold text-gray-800">Informasi Pribadi</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Jenis Kelamin</p>
                <p class="font-semibold">
                  {{ selectedGuru.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </p>
              </div>

              <div v-if="selectedGuru.email">
                <p class="text-gray-500">Email</p>
                <p class="font-semibold">{{ selectedGuru.email }}</p>
              </div>

              <div v-if="selectedGuru.tanggal_masuk" class="md:col-span-2">
                <p class="text-gray-500">Tanggal Masuk</p>
                <p class="font-semibold">{{ formatDate(selectedGuru.tanggal_masuk) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import apiClient from '@/api/axios'

const guruList = ref([])
const loading = ref(true)
const selectedGuru = ref(null)
const searchQuery = ref('')
const filterJabatan = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const fetchGuru = async () => {
  try {
    const response = await apiClient.get('/guru')
    guruList.value = response.data.data
      .filter((g) => g.status === 'aktif')
      .sort((a, b) => a.nama.localeCompare(b.nama))
  } catch (error) {
    console.error('Error fetching guru:', error)
  } finally {
    loading.value = false
  }
}

const jabatanList = computed(() => {
  const jabatan = [...new Set(guruList.value.map((g) => g.jabatan).filter(Boolean))]
  return jabatan.sort()
})

const filteredGuru = computed(() => {
  let result = guruList.value

  if (searchQuery.value) {
    result = result.filter((g) => g.nama.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  if (filterJabatan.value) {
    result = result.filter(
      (g) => g.jabatan && g.jabatan.toLowerCase().includes(filterJabatan.value.toLowerCase()),
    )
  }

  if (filterStatus.value) {
    result = result.filter((g) => g.status_kepegawaian === filterStatus.value)
  }

  return result
})

const paginatedGuru = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGuru.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredGuru.value.length / itemsPerPage.value)
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

const handleVisibilityChange = () => {
  const photos = document.querySelectorAll('.guru-photo')
  if (document.hidden) {
    // User minimize/switch window - blur foto
    photos.forEach((img) => {
      img.style.filter = 'blur(20px)'
      img.style.transition = 'filter 0.1s'
    })
  } else {
    // User kembali - hapus blur
    setTimeout(() => {
      photos.forEach((img) => {
        img.style.filter = 'blur(0)'
      })
    }, 200)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const filterGuru = () => {
  currentPage.value = 1
}

const showDetail = (guru) => {
  selectedGuru.value = guru
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(() => {
  // Aktifkan blur detection
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (
      e.keyCode == 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode == 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.keyCode == 85)
    ) {
      // Ctrl+U
      e.preventDefault()
      return false
    }
  })
  fetchGuru()
})

onUnmounted(() => {
  // Cleanup event listener
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
/* Proteksi gambar guru */
.photo-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.guru-photo {
  user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  max-width: 300px;
  max-height: 300px;
  transition: filter 0.3s ease;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: default;
}

.watermark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 15;
}

.watermark::before {
  content: attr(data-name);
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.6);
  text-shadow:
    3px 3px 8px rgba(0, 0, 0, 0.9),
    -2px -2px 6px rgba(0, 0, 0, 0.7);
  transform: rotate(-25deg);
  white-space: nowrap;
}

.watermark::after {
  content: '© SMKN 11 Bandung';
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  /* font-weight: bold; */
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.9);
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
}

.watermark-text {
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.5);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  transform: rotate(-25deg);
}

.photo-background {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  padding: 1rem;
}
</style>
