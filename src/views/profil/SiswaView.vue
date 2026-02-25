<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="relative bg-blue-600 text-white py-12 overflow-hidden">
      <!-- Background Image (opsional, sesuaikan dengan ketersediaan gambar) -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/images/bg_datasiswa.png')"
      ></div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-700/40"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold">Data Siswa</h1>
        <p class="mt-2">Peserta Didik SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama/NIS siswa..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @input="filterSiswa"
          />
          <select
            v-model="filterKelas"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterSiswa"
          >
            <option value="">Semua Kelas</option>
            <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
              {{ kelas.nama }}
            </option>
          </select>
          <select
            v-model="filterJurusan"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterSiswa"
          >
            <option value="">Semua Jurusan</option>
            <option v-for="jurusan in jurusanList" :key="jurusan" :value="jurusan">
              {{ jurusan }}
            </option>
          </select>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterSiswa"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="alumni">Alumni</option>
            <option value="keluar">Keluar</option>
          </select>
          <select
            v-model="itemsPerPage"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="changeItemsPerPage"
          >
            <option :value="10">10 per halaman</option>
            <option :value="20">20 per halaman</option>
            <option :value="50">50 per halaman</option>
            <option :value="100">100 per halaman</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat data siswa...</p>
      </div>

      <!-- Siswa Grid - 5 KOLOM seperti Guru -->
      <div
        v-else-if="paginatedSiswa.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="siswa in paginatedSiswa"
          :key="siswa.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Foto -->
          <div class="relative aspect-square bg-gradient-to-br from-blue-100 to-blue-50">
            <img
              v-if="siswa.foto"
              :src="siswa.foto_url || `http://192.168.3.239:800/storage/${siswa.foto}`"
              :alt="siswa.nama"
              class="w-full h-full object-contain p-4"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-6xl">{{ siswa.jenis_kelamin === 'L' ? '👨‍🎓' : '👩‍🎓' }}</span>
            </div>

            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                :class="{
                  'bg-green-600': siswa.status === 'aktif',
                  'bg-blue-600': siswa.status === 'alumni',
                  'bg-red-600': siswa.status === 'keluar',
                }"
                class="text-white px-2 py-1 rounded-full text-xs font-bold shadow-md capitalize"
              >
                {{ siswa.status }}
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[40px]">
              {{ siswa.nama }}
            </h3>
            <p v-if="siswa.nis" class="text-xs text-gray-500 mb-2">NIS: {{ siswa.nis }}</p>

            <div class="space-y-1 mb-3 min-h-[60px]">
              <p
                v-if="siswa.kelas?.nama || siswa.kelas_nama"
                class="text-xs text-blue-600 font-semibold line-clamp-1"
              >
                {{ siswa.kelas?.nama || siswa.kelas_nama }}
              </p>
              <p
                v-if="siswa.konsentrasi_keahlian?.nama || siswa.jurusan"
                class="text-xs text-gray-600 line-clamp-2"
              >
                {{ siswa.konsentrasi_keahlian?.nama || siswa.jurusan }}
              </p>
            </div>

            <button
              @click="showDetail(siswa)"
              class="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">Tidak ada data siswa ditemukan.</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalRecords > 0" class="text-center mt-4 text-sm text-gray-600">
        Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, totalRecords) }}
        dari {{ totalRecords }} siswa
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedSiswa"
      @click="selectedSiswa = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div @click.stop class="bg-white rounded-xl max-w-2xl w-full my-8">
        <div class="p-6">
          <!-- Header Modal -->
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold text-gray-800">Profil Siswa</h2>
            <button
              @click="selectedSiswa = null"
              class="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <!-- Foto & Info Utama -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <div class="md:w-1/4">
              <div
                class="relative w-32 h-48 mx-auto bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg overflow-hidden"
              >
                <img
                  v-if="selectedSiswa.foto"
                  :src="
                    selectedSiswa.foto_url || `http://localhost:8000/storage/${selectedSiswa.foto}`
                  "
                  :alt="selectedSiswa.nama"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-5xl">{{
                    selectedSiswa.jenis_kelamin === 'L' ? '👨‍🎓' : '👩‍🎓'
                  }}</span>
                </div>
              </div>
            </div>

            <div class="md:w-3/4 space-y-2">
              <div>
                <h3 class="text-lg font-bold text-gray-800">{{ selectedSiswa.nama }}</h3>
                <p v-if="selectedSiswa.nis" class="text-xs text-gray-500">
                  NIS: {{ selectedSiswa.nis }}
                </p>
                <p v-if="selectedSiswa.nisn" class="text-xs text-gray-500">
                  NISN: {{ selectedSiswa.nisn }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p class="text-gray-500 text-xs">Status</p>
                  <p
                    :class="{
                      'text-green-600': selectedSiswa.status === 'aktif',
                      'text-blue-600': selectedSiswa.status === 'alumni',
                      'text-yellow-600': selectedSiswa.status === 'keluar',
                    }"
                    class="font-semibold capitalize"
                  >
                    {{ selectedSiswa.status }}
                  </p>
                </div>
                <div v-if="selectedSiswa.kelas?.nama || selectedSiswa.kelas_nama">
                  <p class="text-gray-500 text-xs">Kelas</p>
                  <p class="font-semibold">
                    {{ selectedSiswa.kelas?.nama || selectedSiswa.kelas_nama }}
                  </p>
                </div>
                <div
                  v-if="selectedSiswa.konsentrasi_keahlian?.nama || selectedSiswa.jurusan"
                  class="col-span-2"
                >
                  <p class="text-gray-500 text-xs">Jurusan</p>
                  <p class="font-semibold">
                    {{ selectedSiswa.konsentrasi_keahlian?.nama || selectedSiswa.jurusan }}
                  </p>
                </div>
                <div v-if="selectedSiswa.tahun_masuk">
                  <p class="text-gray-500 text-xs">Tahun Masuk</p>
                  <p class="font-semibold">{{ selectedSiswa.tahun_masuk }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Detail -->
          <div class="border-t pt-4 space-y-3">
            <h4 class="font-bold text-gray-800 text-sm">Informasi Pribadi</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <p class="text-gray-500 text-xs">Jenis Kelamin</p>
                <p class="font-semibold">
                  {{ selectedSiswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </p>
              </div>

              <div v-if="selectedSiswa.tempat_lahir">
                <p class="text-gray-500 text-xs">Tempat Lahir</p>
                <p class="font-semibold">{{ selectedSiswa.tempat_lahir }}</p>
              </div>

              <div v-if="selectedSiswa.tanggal_lahir">
                <p class="text-gray-500 text-xs">Tanggal Lahir</p>
                <p class="font-semibold">{{ formatDate(selectedSiswa.tanggal_lahir) }}</p>
              </div>

              <div v-if="selectedSiswa.agama">
                <p class="text-gray-500 text-xs">Agama</p>
                <p class="font-semibold capitalize">{{ selectedSiswa.agama }}</p>
              </div>

              <div v-if="selectedSiswa.email">
                <p class="text-gray-500 text-xs">Email</p>
                <p class="font-semibold">{{ selectedSiswa.email }}</p>
              </div>
            </div>

            <!-- Informasi Orang Tua (jika ada) -->
            <div
              v-if="selectedSiswa.nama_ayah || selectedSiswa.nama_ibu"
              class="border-t pt-3 space-y-2"
            >
              <h4 class="font-bold text-gray-800 text-sm">Informasi Orang Tua</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div v-if="selectedSiswa.nama_ayah">
                  <p class="text-gray-500 text-xs">Nama Ayah</p>
                  <p class="font-semibold">{{ selectedSiswa.nama_ayah }}</p>
                </div>
                <div v-if="selectedSiswa.pekerjaan_ayah">
                  <p class="text-gray-500 text-xs">Pekerjaan Ayah</p>
                  <p class="font-semibold">{{ selectedSiswa.pekerjaan_ayah }}</p>
                </div>
                <div v-if="selectedSiswa.nama_ibu">
                  <p class="text-gray-500 text-xs">Nama Ibu</p>
                  <p class="font-semibold">{{ selectedSiswa.nama_ibu }}</p>
                </div>
                <div v-if="selectedSiswa.pekerjaan_ibu">
                  <p class="text-gray-500 text-xs">Pekerjaan Ibu</p>
                  <p class="font-semibold">{{ selectedSiswa.pekerjaan_ibu }}</p>
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

const siswaList = ref([])
const loading = ref(true)
const selectedSiswa = ref(null)
const searchQuery = ref('')
const filterKelas = ref('')
const filterJurusan = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const allKelasList = ref([])
const allJurusanList = ref([])
const totalPages = ref(1) // ✅ Hanya satu deklarasi
const totalRecords = ref(0)

const fetchSiswa = async () => {
  try {
    loading.value = true

    const params = {
      status: 'aktif',
      per_page: itemsPerPage.value,
      page: currentPage.value,
    }

    // ✅ Kirim kelas_id bukan kelas_nama
    if (filterKelas.value) {
      params.kelas_id = filterKelas.value
    }

    if (filterJurusan.value) {
      params.konsentrasi_keahlian_id = filterJurusan.value
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    console.log('Fetching siswa with params:', params)

    const response = await apiClient.get('/siswa', { params })
    console.log('Siswa response:', response.data)

    siswaList.value = response.data.data || []
    totalPages.value = response.data.last_page || 1
    totalRecords.value = response.data.total || 0
  } catch (error) {
    console.error('Error fetching siswa:', error)
    console.error('Error details:', error.response?.data)
  } finally {
    loading.value = false
  }
}

const fetchFormData = async () => {
  try {
    const response = await apiClient.get('/siswa', {
      params: {
        per_page: 1000,
        status: '',
      },
    })

    const siswaData = response.data.data || []

    // ✅ Simpan sebagai object dengan id dan nama
    const kelasMap = new Map()
    const jurusanMap = new Map()

    siswaData.forEach((s) => {
      if (s.kelas_id && s.kelas_nama) {
        kelasMap.set(s.kelas_id, {
          id: s.kelas_id,
          nama: s.kelas_nama.trim(),
        })
      }
      if (s.jurusan) {
        // Untuk jurusan, kita ekstrak dari relasi jika ada
        const jurusanId = s.kelas?.konsentrasi_keahlian_id
        if (jurusanId) {
          jurusanMap.set(jurusanId, {
            id: jurusanId,
            nama: s.jurusan.trim(),
          })
        }
      }
    })

    allKelasList.value = Array.from(kelasMap.values()).sort((a, b) => a.nama.localeCompare(b.nama))
    allJurusanList.value = Array.from(jurusanMap.values()).sort((a, b) =>
      a.nama.localeCompare(b.nama),
    )

    console.log('Kelas list:', allKelasList.value)
    console.log('Jurusan list:', allJurusanList.value)
  } catch (error) {
    console.error('Error fetching form data:', error)
  }
}

const kelasList = computed(() => allKelasList.value)
const jurusanList = computed(() => allJurusanList.value)

// ✅ Untuk pagination info saja
const filteredSiswa = computed(() => {
  return { length: totalRecords.value }
})

// ✅ Langsung return data dari backend (sudah dipaginate)
const paginatedSiswa = computed(() => {
  return siswaList.value
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
    fetchSiswa() // ✅ Fetch data baru
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const changeItemsPerPage = () => {
  currentPage.value = 1
  fetchSiswa() // ✅ Fetch ulang
}

const filterSiswa = () => {
  currentPage.value = 1
  fetchSiswa()
}

const showDetail = (siswa) => {
  selectedSiswa.value = siswa
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

onMounted(() => {
  fetchFormData()
  fetchSiswa()
})
</script>
