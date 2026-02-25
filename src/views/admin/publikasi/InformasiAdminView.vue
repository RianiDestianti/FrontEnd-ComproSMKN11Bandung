<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Informasi Umum</h1>
        <p class="text-gray-600 mt-1">Kelola informasi dan pengumuman sekolah</p>
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
        Tambah Informasi
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Cari informasi..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <select
        v-model="filterKategori"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Kategori</option>
        <option v-for="kat in kategoriList" :key="kat.id" :value="kat.id">
          {{ kat.nama_kategori }}
        </option>
      </select>
      <select
        v-model="filterPrioritas"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Prioritas</option>
        <option value="Urgent">Urgent</option>
        <option value="Tinggi">Tinggi</option>
        <option value="Sedang">Sedang</option>
        <option value="Rendah">Rendah</option>
      </select>
      <select
        v-model="filterStatus"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="non-aktif">Non-Aktif</option>
      </select>
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
                Judul
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prioritas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Periode
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="info in informasiList" :key="info.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ info.judul }}</div>
                <div class="text-sm text-gray-500 line-clamp-1">{{ stripHtml(info.konten) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ info.kategori_informasi?.nama_kategori || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getPrioritasClass(info.prioritas)"
                >
                  {{ info.prioritas }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ formatDate(info.tanggal_mulai) || '-' }}</div>
                <div class="text-xs text-gray-500">
                  s/d {{ formatDate(info.tanggal_akhir) || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(info.status)"
                >
                  {{ info.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="openModal('detail', info)"
                  class="text-green-600 hover:text-green-900 transition-colors"
                >
                  Detail
                </button>
                <button
                  @click="openModal('edit', info)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(info)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="informasiList.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Belum ada data informasi umum
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal && modalMode !== 'detail'"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ modalMode === 'create' ? 'Tambah Informasi' : 'Edit Informasi' }}
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
            <!-- Grid untuk field Judul, Kategori, Prioritas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                <input
                  v-model="form.judul"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  v-model="form.kategori_informasi_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  <option v-for="kat in kategoriList" :key="kat.id" :value="kat.id">
                    {{ kat.nama_kategori }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prioritas *</label>
                <select
                  v-model="form.prioritas"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Prioritas</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Rendah">Rendah</option>
                </select>
              </div>
            </div>

            <!-- Konten Editor (outside grid) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Konten *</label>
              <div
                ref="editorContainer"
                class="quill-editor border border-gray-300 rounded-lg bg-white"
              ></div>
              <input type="hidden" v-model="form.konten" required />
            </div>

            <!-- Grid untuk File, Status, Tanggal -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">File Lampiran</label>
                <input
                  @change="handleFileChange"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">Format: PDF, DOC, XLS, JPG, PNG. Maks 5MB</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-Aktif</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  v-model="form.tanggal_mulai"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                <input
                  v-model="form.tanggal_akhir"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

    <!-- Modal Detail -->
    <div
      v-if="showModal && modalMode === 'detail'"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Informasi</h2>
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

          <div v-if="selectedInfo" class="space-y-4">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedInfo.judul }}</h3>
              <div class="flex flex-wrap items-center gap-3 mt-2">
                <span
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                  :class="getPrioritasClass(selectedInfo.prioritas)"
                >
                  {{ selectedInfo.prioritas }}
                </span>
                <span
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                  :class="getStatusClass(selectedInfo.status)"
                >
                  {{ selectedInfo.status }}
                </span>
                <span class="text-sm text-gray-600">
                  {{ selectedInfo.kategori_informasi?.nama_kategori || 'Tanpa Kategori' }}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="prose max-w-none" v-html="selectedInfo.konten"></div>
            </div>

            <div v-if="selectedInfo.file_lampiran_url" class="border-t border-gray-200 pt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">File Lampiran:</p>
              <a
                :href="selectedInfo.file_lampiran_url"
                target="_blank"
                class="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download File
              </a>
            </div>

            <div class="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Tanggal Mulai</p>
                <p class="font-medium">{{ formatDate(selectedInfo.tanggal_mulai) || '-' }}</p>
              </div>
              <div>
                <p class="text-gray-500">Tanggal Akhir</p>
                <p class="font-medium">{{ formatDate(selectedInfo.tanggal_akhir) || '-' }}</p>
              </div>
            </div>
          </div>
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
          Apakah Anda yakin ingin menghapus informasi <strong>{{ deleteTarget?.judul }}</strong
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
            @click="deleteInformasi"
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
import { ref, onMounted, nextTick } from 'vue'
import informasiApi from '@/api/informasi'

// Load Quill
let Quill = null
let quillEditor = null

const loadQuill = () => {
  return new Promise((resolve, reject) => {
    if (window.Quill) {
      Quill = window.Quill
      resolve()
      return
    }

    const link = document.createElement('link')
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'
    script.onload = () => {
      Quill = window.Quill
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const editorContainer = ref(null)
const loading = ref(false)
const informasiList = ref([])
const kategoriList = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const isSubmitting = ref(false)
const errorMessage = ref('')
const deleteTarget = ref(null)
const selectedInfo = ref(null)
const searchQuery = ref('')
const filterKategori = ref('')
const filterPrioritas = ref('')
const filterStatus = ref('')

const form = ref({
  kategori_informasi_id: '',
  judul: '',
  konten: '',
  file_lampiran: null,
  prioritas: 'Sedang',
  tanggal_mulai: '',
  tanggal_akhir: '',
  status: 'aktif',
})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(async () => {
  await loadQuill()
  fetchInformasi()
  fetchFormData()
})

const fetchInformasi = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterKategori.value) params.kategori_informasi_id = filterKategori.value
    if (filterPrioritas.value) params.prioritas = filterPrioritas.value
    if (filterStatus.value) params.status = filterStatus.value
    if (searchQuery.value) params.search = searchQuery.value

    const response = await informasiApi.getAll(params)
    informasiList.value = response.data.data
  } catch (error) {
    showToast('Gagal memuat data informasi', 'error')
    console.error('Error fetching informasi:', error)
  } finally {
    loading.value = false
  }
}

const fetchFormData = async () => {
  try {
    const response = await informasiApi.getFormData()
    kategoriList.value = response.data.data.kategori
  } catch (error) {
    console.error('Error fetching form data:', error)
  }
}

const handleSearch = () => {
  fetchInformasi()
}

const handleFilter = () => {
  fetchInformasi()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file_lampiran = file
  }
}

const openModal = async (mode, info = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'detail' && info) {
    selectedInfo.value = info
  } else if (mode === 'edit' && info) {
    form.value = {
      id: info.id,
      kategori_informasi_id: info.kategori_informasi_id || '',
      judul: info.judul,
      konten: info.konten,
      file_lampiran: null,
      prioritas: info.prioritas,
      tanggal_mulai: formatDateForInput(info.tanggal_mulai),
      tanggal_akhir: formatDateForInput(info.tanggal_akhir),
      status: info.status,
    }
  } else {
    form.value = {
      kategori_informasi_id: '',
      judul: '',
      konten: '',
      file_lampiran: null,
      prioritas: 'Sedang',
      tanggal_mulai: '',
      tanggal_akhir: '',
      status: 'aktif',
    }
  }

  showModal.value = true

  if (mode !== 'detail') {
    await nextTick()
    initQuillEditor()
  }
}

const initQuillEditor = () => {
  if (!editorContainer.value || !Quill) return

  if (quillEditor) {
    quillEditor = null
    editorContainer.value.innerHTML = ''
  }

  quillEditor = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    },
    placeholder: 'Tulis konten informasi di sini...',
  })

  if (form.value.konten) {
    quillEditor.root.innerHTML = form.value.konten
  }

  quillEditor.on('text-change', () => {
    form.value.konten = quillEditor.root.innerHTML
  })
}

const closeModal = () => {
  showModal.value = false
  selectedInfo.value = null

  if (quillEditor) {
    quillEditor = null
    if (editorContainer.value) {
      editorContainer.value.innerHTML = ''
    }
  }

  form.value = {
    kategori_informasi_id: '',
    judul: '',
    konten: '',
    file_lampiran: null,
    prioritas: 'Sedang',
    tanggal_mulai: '',
    tanggal_akhir: '',
    status: 'aktif',
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (modalMode.value === 'create') {
      await informasiApi.create(form.value)
      showToast('Informasi berhasil ditambahkan', 'success')
    } else {
      await informasiApi.update(form.value.id, form.value)
      showToast('Informasi berhasil diupdate', 'success')
    }

    closeModal()
    fetchInformasi()
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

const confirmDelete = (info) => {
  deleteTarget.value = info
  showDeleteModal.value = true
}

const deleteInformasi = async () => {
  isSubmitting.value = true

  try {
    await informasiApi.delete(deleteTarget.value.id)
    showToast('Informasi berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchInformasi()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus informasi', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const getPrioritasClass = (prioritas) => {
  const classes = {
    Urgent: 'bg-red-100 text-red-800',
    Tinggi: 'bg-orange-100 text-orange-800',
    Sedang: 'bg-yellow-100 text-yellow-800',
    Rendah: 'bg-green-100 text-green-800',
  }
  return classes[prioritas] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  return status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const formatDateForInput = (date) => {
  if (!date) return ''
  // Ambil hanya bagian tanggal (YYYY-MM-DD) dari datetime
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
/* Quill Editor Styling */
.quill-editor :deep(.ql-container) {
  min-height: 300px;
  font-size: 14px;
  font-family: inherit;
}

.quill-editor :deep(.ql-editor) {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.quill-editor :deep(.ql-toolbar) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #d1d5db;
}

.quill-editor :deep(.ql-container) {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

/* Fix grid overlap */
.quill-editor {
  grid-column: 1 / -1 !important;
}

.grid > div {
  min-height: fit-content;
}

/* Fix line-clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
