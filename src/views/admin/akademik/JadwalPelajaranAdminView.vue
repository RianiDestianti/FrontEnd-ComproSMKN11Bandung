<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Jadwal Pelajaran</h1>
        <p class="text-gray-600 mt-1">Kelola jadwal pelajaran per kelas dan semester</p>
      </div>
      <button
        @click="openModal('create')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Jadwal
      </button>
    </div>

    <!-- Filter -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        v-model="filterKelas"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Kelas</option>
        <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
          {{ kelas.nama_kelas }}
        </option>
      </select>
      <select
        v-model="filterHari"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Hari</option>
        <option value="Senin">Senin</option>
        <option value="Selasa">Selasa</option>
        <option value="Rabu">Rabu</option>
        <option value="Kamis">Kamis</option>
        <option value="Jumat">Jumat</option>
      </select>
      <select
        v-model="filterSemester"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Semester</option>
        <option value="Ganjil">Ganjil</option>
        <option value="Genap">Genap</option>
      </select>
      <input
        v-model="filterTahunAjaran"
        @input="handleFilter"
        type="text"
        placeholder="Tahun Ajaran (2024/2025)"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table -->
    <div v-else class="border-t border-gray-200 pt-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kelas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hari
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jam
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mata Pelajaran
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Guru
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ruangan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Semester
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(jadwal, index) in jadwalList" :key="jadwal.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ jadwal.kelas ? `${jadwal.kelas.tingkat} ${jadwal.kelas.nama_kelas}` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getHariClass(jadwal.hari)"
                >
                  {{ jadwal.hari }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ jadwal.jam_mulai }} - {{ jadwal.jam_selesai }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ jadwal.mata_pelajaran?.nama_mapel || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ jadwal.guru?.nama || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ jadwal.ruangan || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getSemesterClass(jadwal.semester)"
                >
                  {{ jadwal.semester }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="openModal('edit', jadwal)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(jadwal)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="jadwalList.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                Belum ada data jadwal pelajaran
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ modalMode === 'create' ? 'Tambah Jadwal Pelajaran' : 'Edit Jadwal Pelajaran' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Kelas *</label>
                <input
                  v-model="searchKelas"
                  @input="filterKelasList"
                  @focus="showKelasDropdown = true"
                  @blur="hideKelasDropdown"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ketik nama kelas..."
                  autocomplete="off"
                  required
                />
                <div
                  v-if="showKelasDropdown && filteredKelasList.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="kelas in filteredKelasList"
                    :key="kelas.id"
                    @mousedown="selectKelas(kelas)"
                    class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div class="font-medium text-gray-900">{{ kelas.nama_kelas }}</div>
                    <div class="text-sm text-gray-500">Tingkat {{ kelas.tingkat }}</div>
                  </div>
                </div>
                <div
                  v-if="showKelasDropdown && searchKelas && filteredKelasList.length === 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 text-sm"
                >
                  Kelas tidak ditemukan
                </div>
              </div>

              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran *</label>
                <input
                  v-model="searchMapel"
                  @input="filterMapel"
                  @focus="showMapelDropdown = true"
                  @blur="hideMapelDropdown"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ketik nama mata pelajaran..."
                  autocomplete="off"
                  required
                />
                <div
                  v-if="showMapelDropdown && filteredMapelList.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="mapel in filteredMapelList"
                    :key="mapel.id"
                    @mousedown="selectMapel(mapel)"
                    class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div class="font-medium text-gray-900">{{ mapel.nama_mapel }}</div>
                    <div class="text-sm text-gray-500" v-if="mapel.kode_mapel">
                      Kode: {{ mapel.kode_mapel }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="showMapelDropdown && searchMapel && filteredMapelList.length === 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 text-sm"
                >
                  Mata pelajaran tidak ditemukan
                </div>
              </div>

              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Guru *</label>
                <input
                  v-model="searchGuru"
                  @input="filterGuru"
                  @focus="showGuruDropdown = true"
                  @blur="hideGuruDropdown"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ketik nama guru..."
                  autocomplete="off"
                  required
                />
                <div
                  v-if="showGuruDropdown && filteredGuruList.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="guru in filteredGuruList"
                    :key="guru.id"
                    @mousedown="selectGuru(guru)"
                    class="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div class="font-medium text-gray-900">{{ guru.nama }}</div>
                    <div class="text-sm text-gray-500" v-if="guru.nip">NIP: {{ guru.nip }}</div>
                  </div>
                </div>
                <div
                  v-if="showGuruDropdown && searchGuru && filteredGuruList.length === 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 text-sm"
                >
                  Guru tidak ditemukan
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hari *</label>
                <select
                  v-model="form.hari"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai *</label>
                <input
                  v-model="form.jam_mulai"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai *</label>
                <input
                  v-model="form.jam_selesai"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                <input
                  v-model="form.ruangan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: Lab Komputer 1"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                <select
                  v-model="form.semester"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Semester</option>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran *</label>
                <input
                  v-model="form.tahun_ajaran"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: 2024/2025"
                  required
                />
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {{ errorMessage }}
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus jadwal
          <strong>{{ deleteTarget?.mata_pelajaran?.nama_mapel }}</strong> pada hari
          <strong>{{ deleteTarget?.hari }}</strong
          >? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            @click="deleteJadwal"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 z-50 transition-all duration-300"
      :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      <div class="text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <svg
          v-if="toast.type === 'success'"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import jadwalPelajaranApi from '@/api/jadwalPelajaran'

const loading = ref(false)
const jadwalList = ref([])
const kelasList = ref([])
const mataPelajaranList = ref([])
const guruList = ref([])
const filteredKelasList = ref([])
const filteredMapelList = ref([])
const filteredGuruList = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const showKelasDropdown = ref(false)
const showMapelDropdown = ref(false)
const showGuruDropdown = ref(false)
const searchKelas = ref('')
const searchMapel = ref('')
const searchGuru = ref('')
const modalMode = ref('create')
const isSubmitting = ref(false)
const errorMessage = ref('')
const deleteTarget = ref(null)
const filterKelas = ref('')
const filterHari = ref('')
const filterSemester = ref('')
const filterTahunAjaran = ref('')

const form = ref({
  kelas_id: '',
  mata_pelajaran_id: '',
  guru_id: '',
  hari: '',
  jam_mulai: '',
  jam_selesai: '',
  ruangan: '',
  semester: '',
  tahun_ajaran: '',
})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(() => {
  fetchJadwal()
  fetchFormData()
})

const fetchJadwal = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterKelas.value) params.kelas_id = filterKelas.value
    if (filterHari.value) params.hari = filterHari.value
    if (filterSemester.value) params.semester = filterSemester.value
    if (filterTahunAjaran.value) params.tahun_ajaran = filterTahunAjaran.value

    const response = await jadwalPelajaranApi.getAll(params)
    jadwalList.value = response.data.data
  } catch (error) {
    showToast('Gagal memuat data jadwal pelajaran', 'error')
    console.error('Error fetching jadwal:', error)
  } finally {
    loading.value = false
  }
}

const fetchFormData = async () => {
  try {
    const response = await jadwalPelajaranApi.getFormData()
    kelasList.value = response.data.data.kelas
    mataPelajaranList.value = response.data.data.mata_pelajaran
    guruList.value = response.data.data.guru
    filteredKelasList.value = response.data.data.kelas
    filteredMapelList.value = response.data.data.mata_pelajaran
    filteredGuruList.value = response.data.data.guru
  } catch (error) {
    console.error('Error fetching form data:', error)
  }
}

const filterKelasList = () => {
  const search = searchKelas.value.toLowerCase()
  if (!search) {
    filteredKelasList.value = kelasList.value
  } else {
    filteredKelasList.value = kelasList.value.filter((kelas) =>
      kelas.nama_kelas.toLowerCase().includes(search),
    )
  }
  showKelasDropdown.value = true
}

const selectKelas = (kelas) => {
  form.value.kelas_id = kelas.id
  searchKelas.value = kelas.nama_kelas
  showKelasDropdown.value = false
}

const hideKelasDropdown = () => {
  setTimeout(() => {
    showKelasDropdown.value = false
  }, 200)
}

const filterMapel = () => {
  const search = searchMapel.value.toLowerCase()
  if (!search) {
    filteredMapelList.value = mataPelajaranList.value
  } else {
    filteredMapelList.value = mataPelajaranList.value.filter(
      (mapel) =>
        mapel.nama_mapel.toLowerCase().includes(search) ||
        (mapel.kode_mapel && mapel.kode_mapel.toLowerCase().includes(search)),
    )
  }
  showMapelDropdown.value = true
}

const selectMapel = (mapel) => {
  form.value.mata_pelajaran_id = mapel.id
  searchMapel.value = mapel.nama_mapel
  showMapelDropdown.value = false
}

const hideMapelDropdown = () => {
  setTimeout(() => {
    showMapelDropdown.value = false
  }, 200)
}

const filterGuru = () => {
  const search = searchGuru.value.toLowerCase()
  if (!search) {
    filteredGuruList.value = guruList.value
  } else {
    filteredGuruList.value = guruList.value.filter(
      (guru) =>
        guru.nama.toLowerCase().includes(search) ||
        (guru.nip && guru.nip.toLowerCase().includes(search)),
    )
  }
  showGuruDropdown.value = true
}

const selectGuru = (guru) => {
  form.value.guru_id = guru.id
  searchGuru.value = guru.nama
  showGuruDropdown.value = false
}

const hideGuruDropdown = () => {
  setTimeout(() => {
    showGuruDropdown.value = false
  }, 200)
}

const handleFilter = () => {
  fetchJadwal()
}

const openModal = (mode, jadwal = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'edit' && jadwal) {
    form.value = {
      id: jadwal.id,
      kelas_id: jadwal.kelas_id,
      mata_pelajaran_id: jadwal.mata_pelajaran_id,
      guru_id: jadwal.guru_id,
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai,
      ruangan: jadwal.ruangan || '',
      semester: jadwal.semester,
      tahun_ajaran: jadwal.tahun_ajaran,
    }
    // Set search text
    searchKelas.value = jadwal.kelas?.nama_kelas || ''
    searchMapel.value = jadwal.mata_pelajaran?.nama_mapel || ''
    searchGuru.value = jadwal.guru?.nama || ''
  } else {
    form.value = {
      kelas_id: '',
      mata_pelajaran_id: '',
      guru_id: '',
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      ruangan: '',
      semester: '',
      tahun_ajaran: '',
    }
    searchKelas.value = ''
    searchMapel.value = ''
    searchGuru.value = ''
  }

  filteredKelasList.value = kelasList.value
  filteredMapelList.value = mataPelajaranList.value
  filteredGuruList.value = guruList.value
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    kelas_id: '',
    mata_pelajaran_id: '',
    guru_id: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    ruangan: '',
    semester: '',
    tahun_ajaran: '',
  }
  searchKelas.value = ''
  searchMapel.value = ''
  searchGuru.value = ''
  errorMessage.value = ''
  showKelasDropdown.value = false
  showMapelDropdown.value = false
  showGuruDropdown.value = false
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (modalMode.value === 'create') {
      await jadwalPelajaranApi.create(form.value)
      showToast('Jadwal pelajaran berhasil ditambahkan', 'success')
    } else {
      await jadwalPelajaranApi.update(form.value.id, form.value)
      showToast('Jadwal pelajaran berhasil diupdate', 'success')
    }

    closeModal()
    fetchJadwal()
  } catch (error) {
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      errorMessage.value = errors.join(', ')
    } else {
      errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan'
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (jadwal) => {
  deleteTarget.value = jadwal
  showDeleteModal.value = true
}

const deleteJadwal = async () => {
  isSubmitting.value = true

  try {
    await jadwalPelajaranApi.delete(deleteTarget.value.id)
    showToast('Jadwal pelajaran berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchJadwal()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus jadwal pelajaran', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const getHariClass = (hari) => {
  const classes = {
    Senin: 'bg-blue-100 text-blue-800',
    Selasa: 'bg-green-100 text-green-800',
    Rabu: 'bg-yellow-100 text-yellow-800',
    Kamis: 'bg-purple-100 text-purple-800',
    Jumat: 'bg-pink-100 text-pink-800',
  }
  return classes[hari] || 'bg-gray-100 text-gray-800'
}

const getSemesterClass = (semester) => {
  return semester === 'Ganjil' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>
