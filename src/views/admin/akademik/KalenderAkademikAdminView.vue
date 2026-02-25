<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
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
        Tambah Kalender
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Cari kegiatan..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <select
        v-model="filterTahunAjaran"
        @change="handleSearch"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Tahun Ajaran</option>
        <option value="2024/2025">2024/2025</option>
        <option value="2025/2026">2025/2026</option>
        <option value="2026/2027">2026/2027</option>
      </select>
      <select
        v-model="filterJenis"
        @change="handleSearch"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Jenis</option>
        <option value="Pembelajaran">Pembelajaran</option>
        <option value="Ujian">Ujian</option>
        <option value="Libur">Libur</option>
        <option value="Ekstrakurikuler">Ekstrakurikuler</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
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
              Tahun Ajaran
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Judul Kegiatan
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tanggal
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Jenis
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="kalenderList.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              Tidak ada data kalender akademik
            </td>
          </tr>
          <tr v-for="(item, index) in kalenderList" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.tahun_ajaran }}
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="font-medium text-gray-900">{{ item.judul_kegiatan }}</div>
              <div v-if="item.deskripsi" class="text-gray-500 text-xs mt-1 line-clamp-2">
                {{ item.deskripsi }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <div>{{ formatDate(item.tanggal_mulai) }}</div>
              <div v-if="item.tanggal_selesai" class="text-xs text-gray-500">
                s/d {{ formatDate(item.tanggal_selesai) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getJenisBadgeClass(item.jenis_kegiatan)"
                class="px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ item.jenis_kegiatan }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="openModal('edit', item)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(item)"
                class="text-red-600 hover:text-red-900 transition-colors"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-4 flex justify-between items-center">
      <p class="text-sm text-gray-700">
        Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }} data
      </p>
      <div class="flex gap-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Selanjutnya
        </button>
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
              {{ modalMode === 'create' ? 'Tambah Kalender Akademik' : 'Edit Kalender Akademik' }}
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran *</label>
                <input
                  v-model="form.tahun_ajaran"
                  type="text"
                  required
                  placeholder="2024/2025"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.tahun_ajaran" class="text-red-500 text-sm mt-1">
                  {{ errors.tahun_ajaran[0] }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kegiatan *</label>
                <select
                  v-model="form.jenis_kegiatan"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="Pembelajaran">Pembelajaran</option>
                  <option value="Ujian">Ujian</option>
                  <option value="Libur">Libur</option>
                  <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                </select>
                <p v-if="errors.jenis_kegiatan" class="text-red-500 text-sm mt-1">
                  {{ errors.jenis_kegiatan[0] }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan *</label>
              <input
                v-model="form.judul_kegiatan"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: UTS Semester Ganjil"
              />
              <p v-if="errors.judul_kegiatan" class="text-red-500 text-sm mt-1">
                {{ errors.judul_kegiatan[0] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                v-model="form.deskripsi"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Deskripsi kegiatan..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                <input
                  v-model="form.tanggal_mulai"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.tanggal_mulai" class="text-red-500 text-sm mt-1">
                  {{ errors.tanggal_mulai[0] }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input
                  v-model="form.tanggal_selesai"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.tanggal_selesai" class="text-red-500 text-sm mt-1">
                  {{ errors.tanggal_selesai[0] }}
                </p>
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
          Apakah Anda yakin ingin menghapus kegiatan
          <strong>{{ deleteTarget?.judul_kegiatan }}</strong
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
            @click="deleteKalender"
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
import { ref, reactive, onMounted } from 'vue'
import kalenderAkademikApi from '@/api/kalenderAkademik'

const pageTitle = 'Kalender Akademik'
const pageDescription = 'Kelola kalender akademik dan jadwal kegiatan sekolah'

const loading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const errorMessage = ref('')
const deleteTarget = ref(null)
const searchQuery = ref('')
const filterTahunAjaran = ref('')
const filterJenis = ref('')

const kalenderList = ref([])
const pagination = reactive({
  current_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
  last_page: 1,
})

const form = reactive({
  id: null,
  tahun_ajaran: '',
  judul_kegiatan: '',
  deskripsi: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  jenis_kegiatan: '',
})

const errors = reactive({})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(() => {
  fetchKalender()
})

const fetchKalender = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: pagination.per_page,
    }

    if (searchQuery.value) params.search = searchQuery.value
    if (filterTahunAjaran.value) params.tahun_ajaran = filterTahunAjaran.value
    if (filterJenis.value) params.jenis_kegiatan = filterJenis.value

    const response = await kalenderAkademikApi.getAll(params)

    if (response.data.success) {
      kalenderList.value = response.data.data.data
      pagination.current_page = response.data.data.current_page
      pagination.total = response.data.data.total
      pagination.from = response.data.data.from || 0
      pagination.to = response.data.data.to || 0
      pagination.last_page = response.data.data.last_page
    }
  } catch (error) {
    showToast('Gagal memuat data kalender akademik', 'error')
    console.error('Error fetching kalender:', error)
  } finally {
    loading.value = false
  }
}

let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchKalender(1)
  }, 500)
}

const openModal = (mode, item = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'edit' && item) {
    form.id = item.id
    form.tahun_ajaran = item.tahun_ajaran
    form.judul_kegiatan = item.judul_kegiatan
    form.deskripsi = item.deskripsi || ''
    form.tanggal_mulai = formatDateForInput(item.tanggal_mulai)
    form.tanggal_selesai = item.tanggal_selesai ? formatDateForInput(item.tanggal_selesai) : ''
    form.jenis_kegiatan = item.jenis_kegiatan
  } else {
    resetForm()
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.id = null
  form.tahun_ajaran = ''
  form.judul_kegiatan = ''
  form.deskripsi = ''
  form.tanggal_mulai = ''
  form.tanggal_selesai = ''
  form.jenis_kegiatan = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])

  try {
    let response
    if (modalMode.value === 'create') {
      response = await kalenderAkademikApi.create(form)
      showToast('Kalender akademik berhasil ditambahkan', 'success')
    } else {
      response = await kalenderAkademikApi.update(form.id, form)
      showToast('Kalender akademik berhasil diupdate', 'success')
    }

    closeModal()
    fetchKalender(pagination.current_page)
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan'
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (item) => {
  deleteTarget.value = item
  showDeleteModal.value = true
}

const deleteKalender = async () => {
  isSubmitting.value = true

  try {
    await kalenderAkademikApi.delete(deleteTarget.value.id)
    showToast('Kalender akademik berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchKalender(pagination.current_page)
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus kalender akademik', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.last_page) {
    fetchKalender(page)
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getJenisBadgeClass = (jenis) => {
  const classes = {
    Pembelajaran: 'bg-blue-100 text-blue-800',
    Ujian: 'bg-red-100 text-red-800',
    Libur: 'bg-green-100 text-green-800',
    Ekstrakurikuler: 'bg-purple-100 text-purple-800',
  }
  return classes[jenis] || 'bg-gray-100 text-gray-800'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>
