<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
        <p class="text-gray-600 mt-1">Kelola data kelas, konsentrasi keahlian, dan wali kelas</p>
      </div>
      <button
        @click="openModal('create')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Kelas
      </button>
    </div>

    <!-- Filter -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        v-model="filterTingkat"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Tingkat</option>
        <option value="X">X</option>
        <option value="XI">XI</option>
        <option value="XII">XII</option>
      </select>

      <select
        v-model="filterKonsentrasi"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Konsentrasi Keahlian</option>
        <option
          v-for="konsentrasi in konsentrasiList"
          :key="konsentrasi.id"
          :value="konsentrasi.id"
        >
          {{ konsentrasi.nama_konsentrasi }}
        </option>
      </select>

      <input
        v-model="filterTahunAjaran"
        @input="handleSearchDebounce"
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
                Nama Kelas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tingkat
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Konsentrasi Keahlian
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Wali Kelas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tahun Ajaran
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(kelas, index) in kelasList" :key="kelas.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ kelas.nama_kelas }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getTingkatClass(kelas.tingkat)"
                >
                  {{ kelas.tingkat }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ kelas.konsentrasi_keahlian?.nama_konsentrasi || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ kelas.wali_kelas?.nama || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ kelas.tahun_ajaran || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="openModal('edit', kelas)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(kelas)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="kelasList.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Belum ada data kelas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ modalMode === 'create' ? 'Tambah Kelas Baru' : 'Edit Kelas' }}
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kelas *</label>
              <input
                v-model="form.nama_kelas"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: RPL 1"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tingkat *</label>
              <select
                v-model="form.tingkat"
                @change="onTingkatChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Tingkat</option>
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ form.tingkat === 'X' ? 'Program Keahlian' : 'Konsentrasi Keahlian' }} *
              </label>
              <select
                v-model="form.konsentrasi_keahlian_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :disabled="!form.tingkat"
                required
              >
                <option value="">
                  {{
                    form.tingkat
                      ? form.tingkat === 'X'
                        ? 'Pilih Program Keahlian'
                        : 'Pilih Konsentrasi Keahlian'
                      : 'Pilih Tingkat Terlebih Dahulu'
                  }}
                </option>
                <option v-for="item in filteredJurusanList" :key="item.id" :value="item.id">
                  {{ item.nama_konsentrasi || item.nama_program }}
                </option>
              </select>
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Wali Kelas</label>
              <input
                v-model="searchGuru"
                @input="filterGuru"
                @focus="showGuruDropdown = true"
                @blur="hideGuruDropdown"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ketik nama atau NIP guru..."
                autocomplete="off"
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
                  <div class="text-sm text-gray-500">NIP: {{ guru.nip }}</div>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
              <input
                v-model="form.tahun_ajaran"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: 2024/2025"
              />
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
          Apakah Anda yakin ingin menghapus kelas <strong>{{ deleteTarget?.nama_kelas }}</strong
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
            @click="deleteKelas"
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
import kelasApi from '@/api/kelas'

const loading = ref(false)
const kelasList = ref([])
const konsentrasiList = ref([])
const programList = ref([])
const filteredJurusanList = ref([])
const guruList = ref([])
const filteredGuruList = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const showGuruDropdown = ref(false)
const searchGuru = ref('')
const modalMode = ref('create')
const isSubmitting = ref(false)
const errorMessage = ref('')
const deleteTarget = ref(null)
const filterTingkat = ref('')
const filterKonsentrasi = ref('')
const filterTahunAjaran = ref('')
const searchQuery = ref('')
const searchDebounceTimer = ref(null)

const form = ref({
  nama_kelas: '',
  tingkat: '',
  konsentrasi_keahlian_id: '',
  wali_kelas_id: '',
  tahun_ajaran: '',
})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(() => {
  fetchKelas()
  fetchFormData()
})

const fetchKelas = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchQuery.value) params.search = searchQuery.value

    const response = await kelasApi.getAll(params)
    kelasList.value = response.data.data
  } catch (error) {
    showToast('Gagal memuat data kelas', 'error')
    console.error('Error fetching kelas:', error)
  } finally {
    loading.value = false
  }
}

const handleSearchDebounce = () => {
  // Clear previous timer
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }

  // Set new timer for 500ms
  searchDebounceTimer.value = setTimeout(() => {
    fetchKelas()
  }, 500)
}

const fetchFormData = async () => {
  try {
    const response = await kelasApi.getFormData()
    konsentrasiList.value = response.data.data.konsentrasi_keahlian
    programList.value = response.data.data.program_keahlian || []
    guruList.value = response.data.data.guru
    filteredGuruList.value = response.data.data.guru
  } catch (error) {
    console.error('Error fetching form data:', error)
  }
}

const onTingkatChange = () => {
  // Reset konsentrasi_keahlian_id saat tingkat berubah
  form.value.konsentrasi_keahlian_id = ''

  // Filter jurusan berdasarkan tingkat
  if (form.value.tingkat === 'X') {
    filteredJurusanList.value = programList.value
  } else if (form.value.tingkat === 'XI' || form.value.tingkat === 'XII') {
    filteredJurusanList.value = konsentrasiList.value
  } else {
    filteredJurusanList.value = []
  }
}

const filterGuru = () => {
  const search = searchGuru.value.toLowerCase()
  if (!search) {
    filteredGuruList.value = guruList.value
  } else {
    filteredGuruList.value = guruList.value.filter(
      (guru) => guru.nama.toLowerCase().includes(search) || guru.nip.toLowerCase().includes(search),
    )
  }
  showGuruDropdown.value = true
}

const selectGuru = (guru) => {
  form.value.wali_kelas_id = guru.id
  searchGuru.value = `${guru.nama} (${guru.nip})`
  showGuruDropdown.value = false
}

const hideGuruDropdown = () => {
  setTimeout(() => {
    showGuruDropdown.value = false
  }, 200)
}

const handleFilter = () => {
  fetchKelas()
}

const openModal = (mode, kelas = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'edit' && kelas) {
    form.value = {
      id: kelas.id,
      nama_kelas: kelas.nama_kelas,
      tingkat: kelas.tingkat,
      konsentrasi_keahlian_id: kelas.konsentrasi_keahlian_id,
      wali_kelas_id: kelas.wali_kelas_id || '',
      tahun_ajaran: kelas.tahun_ajaran || '',
    }
    // Set search guru text jika ada wali kelas
    if (kelas.wali_kelas) {
      searchGuru.value = `${kelas.wali_kelas.nama} (${kelas.wali_kelas.nip})`
    } else {
      searchGuru.value = ''
    }
    // Set filtered jurusan based on tingkat
    if (kelas.tingkat === 'X') {
      filteredJurusanList.value = programList.value
    } else {
      filteredJurusanList.value = konsentrasiList.value
    }
  } else {
    form.value = {
      nama_kelas: '',
      tingkat: '',
      konsentrasi_keahlian_id: '',
      wali_kelas_id: '',
      tahun_ajaran: '',
    }
    searchGuru.value = ''
    filteredJurusanList.value = []
  }

  filteredGuruList.value = guruList.value
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nama_kelas: '',
    tingkat: '',
    konsentrasi_keahlian_id: '',
    wali_kelas_id: '',
    tahun_ajaran: '',
  }
  searchGuru.value = ''
  errorMessage.value = ''
  showGuruDropdown.value = false
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (modalMode.value === 'create') {
      await kelasApi.create(form.value)
      showToast('Kelas berhasil ditambahkan', 'success')
    } else {
      await kelasApi.update(form.value.id, form.value)
      showToast('Kelas berhasil diupdate', 'success')
    }

    closeModal()
    fetchKelas()
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

const confirmDelete = (kelas) => {
  deleteTarget.value = kelas
  showDeleteModal.value = true
}

const deleteKelas = async () => {
  isSubmitting.value = true

  try {
    await kelasApi.delete(deleteTarget.value.id)
    showToast('Kelas berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchKelas()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus kelas', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const getTingkatClass = (tingkat) => {
  const classes = {
    X: 'bg-blue-100 text-blue-800',
    XI: 'bg-green-100 text-green-800',
    XII: 'bg-purple-100 text-purple-800',
  }
  return classes[tingkat] || 'bg-gray-100 text-gray-800'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>
