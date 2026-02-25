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
        Tambah Agenda
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Cari agenda..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <select
        v-model="filterStatus"
        @change="handleSearch"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="Akan Datang">Akan Datang</option>
        <option value="Berlangsung">Berlangsung</option>
        <option value="Selesai">Selesai</option>
        <option value="Dibatalkan">Dibatalkan</option>
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
              Gambar
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Judul
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tanggal
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Lokasi
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="agendaList.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">Tidak ada data agenda</td>
          </tr>
          <tr v-for="(agenda, index) in agendaList" :key="agenda.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                v-if="agenda.gambar"
                :src="getGambarUrl(agenda.gambar)"
                :alt="agenda.judul_kegiatan"
                class="h-12 w-12 rounded object-cover"
              />
              <div v-else class="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-gray-400"
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
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="font-medium text-gray-900">{{ agenda.judul_kegiatan }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ agenda.penyelenggara || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <div>{{ formatDate(agenda.tanggal_mulai) }}</div>
              <div v-if="agenda.tanggal_selesai" class="text-xs text-gray-500">
                s/d {{ formatDate(agenda.tanggal_selesai) }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ agenda.lokasi || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(agenda.status)"
                class="px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ agenda.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="openModal('edit', agenda)"
                class="text-blue-600 hover:text-blue-900 transition-colors"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(agenda)"
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
              {{ modalMode === 'create' ? 'Tambah Agenda Kegiatan' : 'Edit Agenda Kegiatan' }}
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan *</label>
              <input
                v-model="form.judul_kegiatan"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Rapat Koordinasi"
              />
              <p v-if="errors.judul_kegiatan" class="text-red-500 text-sm mt-1">
                {{ errors.judul_kegiatan[0] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <QuillEditor
                v-model:content="form.deskripsi"
                contentType="html"
                theme="snow"
                :toolbar="[
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ color: [] }, { background: [] }],
                  [{ script: 'sub' }, { script: 'super' }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ align: [] }],
                  ['link', 'image', 'video'],
                  ['blockquote', 'code-block'],
                  ['clean'],
                ]"
                placeholder="Deskripsi kegiatan..."
                class="bg-white"
                style="min-height: 200px"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                <input
                  v-model="form.tanggal_mulai"
                  type="datetime-local"
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
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.tanggal_selesai" class="text-red-500 text-sm mt-1">
                  {{ errors.tanggal_selesai[0] }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input
                v-model="form.lokasi"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Aula SMK"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Penyelenggara</label>
              <input
                v-model="form.penyelenggara"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: OSIS"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peserta</label>
              <textarea
                v-model="form.peserta"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Semua siswa kelas X"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Status</option>
                <option value="Akan Datang">Akan Datang</option>
                <option value="Berlangsung">Berlangsung</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
              <p v-if="errors.status" class="text-red-500 text-sm mt-1">
                {{ errors.status[0] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
              <input
                @change="handleFileChange"
                type="file"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Max: 2MB</p>
              <p v-if="errors.gambar" class="text-red-500 text-sm mt-1">
                {{ errors.gambar[0] }}
              </p>

              <!-- Preview Gambar -->
              <div
                v-if="gambarPreview || (modalMode === 'edit' && form.gambar_existing)"
                class="mt-3"
              >
                <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  :src="gambarPreview || getGambarUrl(form.gambar_existing)"
                  alt="Preview"
                  class="h-32 w-auto rounded border border-gray-300"
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
          Apakah Anda yakin ingin menghapus agenda
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
            @click="deleteAgenda"
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
import agendaApi from '@/api/agenda'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const pageTitle = 'Agenda Kegiatan'
const pageDescription = 'Kelola agenda dan jadwal kegiatan sekolah'

const loading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const errorMessage = ref('')
const deleteTarget = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const gambarPreview = ref(null)

const agendaList = ref([])
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
  judul_kegiatan: '',
  deskripsi: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  lokasi: '',
  penyelenggara: '',
  peserta: '',
  status: '',
  gambar: null,
  gambar_existing: null,
})

const errors = reactive({})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(() => {
  fetchAgenda()
})

const fetchAgenda = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: pagination.per_page,
    }

    if (searchQuery.value) params.search = searchQuery.value
    if (filterStatus.value) params.status = filterStatus.value

    const response = await agendaApi.getAll(params)

    if (response.data.success) {
      agendaList.value = response.data.data.data
      pagination.current_page = response.data.data.current_page
      pagination.total = response.data.data.total
      pagination.from = response.data.data.from || 0
      pagination.to = response.data.data.to || 0
      pagination.last_page = response.data.data.last_page
    }
  } catch (error) {
    showToast('Gagal memuat data agenda kegiatan', 'error')
    console.error('Error fetching agenda:', error)
  } finally {
    loading.value = false
  }
}

let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchAgenda(1)
  }, 500)
}

const openModal = (mode, agenda = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'edit' && agenda) {
    form.id = agenda.id
    form.judul_kegiatan = agenda.judul_kegiatan
    form.deskripsi = agenda.deskripsi || ''
    form.tanggal_mulai = formatDateTimeForInput(agenda.tanggal_mulai)
    form.tanggal_selesai = agenda.tanggal_selesai
      ? formatDateTimeForInput(agenda.tanggal_selesai)
      : ''
    form.lokasi = agenda.lokasi || ''
    form.penyelenggara = agenda.penyelenggara || ''
    form.peserta = agenda.peserta || ''
    form.status = agenda.status
    form.gambar_existing = agenda.gambar
  } else {
    resetForm()
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  gambarPreview.value = null
}

const resetForm = () => {
  form.id = null
  form.judul_kegiatan = ''
  form.deskripsi = ''
  form.tanggal_mulai = ''
  form.tanggal_selesai = ''
  form.lokasi = ''
  form.penyelenggara = ''
  form.peserta = ''
  form.status = ''
  form.gambar = null
  form.gambar_existing = null
  Object.keys(errors).forEach((key) => delete errors[key])
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.gambar = file

    const reader = new FileReader()
    reader.onload = (e) => {
      gambarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])

  try {
    const formData = {
      judul_kegiatan: form.judul_kegiatan,
      deskripsi: form.deskripsi,
      tanggal_mulai: form.tanggal_mulai,
      tanggal_selesai: form.tanggal_selesai,
      lokasi: form.lokasi,
      penyelenggara: form.penyelenggara,
      peserta: form.peserta,
      status: form.status,
      gambar: form.gambar,
    }

    let response
    if (modalMode.value === 'create') {
      response = await agendaApi.create(formData)
      showToast('Agenda kegiatan berhasil ditambahkan', 'success')
    } else {
      response = await agendaApi.update(form.id, formData)
      showToast('Agenda kegiatan berhasil diupdate', 'success')
    }

    closeModal()
    fetchAgenda(pagination.current_page)
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

const confirmDelete = (agenda) => {
  deleteTarget.value = agenda
  showDeleteModal.value = true
}

const deleteAgenda = async () => {
  isSubmitting.value = true

  try {
    await agendaApi.delete(deleteTarget.value.id)
    showToast('Agenda kegiatan berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchAgenda(pagination.current_page)
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus agenda kegiatan', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.last_page) {
    fetchAgenda(page)
  }
}

const getGambarUrl = (gambarPath) => {
  if (!gambarPath) return ''
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${gambarPath}`
}

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatDateTimeForInput = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const getStatusClass = (status) => {
  const classes = {
    'Akan Datang': 'bg-blue-100 text-blue-800',
    Berlangsung: 'bg-green-100 text-green-800',
    Selesai: 'bg-gray-100 text-gray-800',
    Dibatalkan: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style>
.ql-container {
  font-size: 14px;
}
.ql-editor {
  min-height: 200px;
}
.ql-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>
