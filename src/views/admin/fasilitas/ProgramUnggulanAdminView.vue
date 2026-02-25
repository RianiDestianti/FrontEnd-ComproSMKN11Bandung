<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
      <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="mb-6 flex justify-end flex-wrap gap-3">
      <button
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Program
      </button>

      <button
        @click="openImportModal"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Import Data
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        v-model="search"
        @input="fetchPrograms"
        type="text"
        placeholder="Cari program unggulan..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <select
        v-model="filterStatus"
        @change="fetchPrograms"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="non-aktif">Non-Aktif</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="text-gray-600 mt-2">Memuat data...</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto border border-gray-200 rounded-lg">
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
              Nama Program
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Deskripsi
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
          <tr v-if="programList.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Tidak ada data program unggulan
            </td>
          </tr>
          <tr v-for="(program, index) in programList" :key="program.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                v-if="program.gambar"
                :src="getImageUrl(program.gambar)"
                alt="Gambar Program"
                class="h-16 w-16 object-cover rounded-lg"
              />
              <div v-else class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  class="w-8 h-8 text-gray-400"
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
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ program.nama_program }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="max-w-xs truncate" v-html="program.deskripsi || '-'"></div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  program.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ program.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="viewDetail(program)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Lihat Detail"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  @click="openEditModal(program)"
                  class="text-green-600 hover:text-green-900"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(program)"
                  class="text-red-600 hover:text-red-900"
                  title="Hapus"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            {{ isEdit ? 'Edit Program Unggulan' : 'Tambah Program Unggulan' }}
          </h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Program <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nama_program"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <div ref="deskripsiEditor" class="border border-gray-300 rounded-lg"></div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
              <div ref="tujuanEditor" class="border border-gray-300 rounded-lg"></div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sasaran</label>
              <div ref="sasaranEditor" class="border border-gray-300 rounded-lg"></div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Program</label>
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG, GIF. Maksimal 2MB</p>

              <!-- Preview gambar -->
              <div v-if="imagePreview || (isEdit && selectedProgram?.gambar)" class="mt-3">
                <img
                  :src="imagePreview || getImageUrl(selectedProgram.gambar)"
                  alt="Preview"
                  class="h-32 w-32 object-cover rounded-lg border"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-gray-400"
              >
                {{ submitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetailModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Detail Program Unggulan</h2>
            <button @click="closeDetailModal" class="text-gray-500 hover:text-gray-700">
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

          <div v-if="selectedProgram" class="space-y-4">
            <!-- Gambar -->
            <div v-if="selectedProgram.gambar" class="flex justify-center mb-4">
              <img
                :src="getImageUrl(selectedProgram.gambar)"
                alt="Gambar Program"
                class="max-h-64 object-cover rounded-lg border shadow-md"
              />
            </div>

            <div
              class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200"
            >
              <span class="font-semibold text-blue-900 block mb-2">📌 Nama Program</span>
              <p class="text-gray-900 text-lg font-medium">{{ selectedProgram.nama_program }}</p>
            </div>

            <div
              class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
            >
              <span class="font-semibold text-green-900 block mb-2">📝 Deskripsi</span>
              <div
                class="text-gray-900 prose prose-sm max-w-none"
                v-html="selectedProgram.deskripsi || '-'"
              ></div>
            </div>

            <div
              class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
            >
              <span class="font-semibold text-purple-900 block mb-2">🎯 Tujuan</span>
              <div
                class="text-gray-900 prose prose-sm max-w-none"
                v-html="selectedProgram.tujuan || '-'"
              ></div>
            </div>

            <div
              class="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200"
            >
              <span class="font-semibold text-orange-900 block mb-2">👥 Sasaran</span>
              <div
                class="text-gray-900 prose prose-sm max-w-none"
                v-html="selectedProgram.sasaran || '-'"
              ></div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <span class="font-semibold text-gray-700 block mb-2">⚡ Status</span>
              <span
                :class="
                  selectedProgram.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-3 py-1 text-sm font-semibold rounded-full"
              >
                {{ selectedProgram.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeImportModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-xl w-full">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Import Data Program Unggulan</h2>

          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Format data yang diharapkan (JSON Array):</p>
            <pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
[
  {
    "nama_program": "Program Tahfidz",
    "deskripsi": "Program menghafal Al-Quran",
    "tujuan": "Mencetak hafidz/hafidzah",
    "sasaran": "Semua siswa",
    "status": "aktif"
  }
]</pre
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Data JSON</label>
            <textarea
              v-model="importData"
              rows="6"
              placeholder="Paste JSON array disini..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeImportModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              @click="submitImport"
              :disabled="submitting"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:bg-gray-400"
            >
              {{ submitting ? 'Mengimport...' : 'Import' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import programUnggulanApi from '@/api/programUnggulan'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.snow.css'

const pageTitle = 'Program Unggulan'
const pageDescription = 'Kelola data program unggulan sekolah'

const programList = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDetailModal = ref(false)
const showImportModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const selectedProgram = ref(null)
const importData = ref('')
const imagePreview = ref(null)

const search = ref('')
const filterStatus = ref('')

const deskripsiEditor = ref(null)
const tujuanEditor = ref(null)
const sasaranEditor = ref(null)

let quillDeskripsi = null
let quillTujuan = null
let quillSasaran = null

const formData = ref({
  nama_program: '',
  deskripsi: '',
  tujuan: '',
  sasaran: '',
  gambar: null,
  status: 'aktif',
})

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getImageUrl = (path) => {
  if (!path) return null
  return `${API_BASE_URL}/storage/${path}`
}

const initQuillEditors = () => {
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ]

  if (deskripsiEditor.value && !quillDeskripsi) {
    quillDeskripsi = new Quill(deskripsiEditor.value, {
      theme: 'snow',
      modules: { toolbar: toolbarOptions },
      placeholder: 'Tulis deskripsi program...',
    })
  }

  if (tujuanEditor.value && !quillTujuan) {
    quillTujuan = new Quill(tujuanEditor.value, {
      theme: 'snow',
      modules: { toolbar: toolbarOptions },
      placeholder: 'Tulis tujuan program...',
    })
  }

  if (sasaranEditor.value && !quillSasaran) {
    quillSasaran = new Quill(sasaranEditor.value, {
      theme: 'snow',
      modules: { toolbar: toolbarOptions },
      placeholder: 'Tulis sasaran program...',
    })
  }
}

const resetForm = () => {
  formData.value = {
    nama_program: '',
    deskripsi: '',
    tujuan: '',
    sasaran: '',
    gambar: null,
    status: 'aktif',
  }
  imagePreview.value = null

  if (quillDeskripsi) quillDeskripsi.setText('')
  if (quillTujuan) quillTujuan.setText('')
  if (quillSasaran) quillSasaran.setText('')
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.gambar = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const fetchPrograms = async () => {
  loading.value = true
  try {
    const params = {}
    if (search.value) params.search = search.value
    if (filterStatus.value) params.status = filterStatus.value

    const response = await programUnggulanApi.getAll(params)

    if (response.data.success) {
      programList.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data program unggulan')
  } finally {
    loading.value = false
  }
}

const openAddModal = async () => {
  isEdit.value = false
  resetForm()
  showModal.value = true

  await nextTick()
  initQuillEditors()
}

const openEditModal = async (program) => {
  isEdit.value = true
  selectedProgram.value = program
  formData.value = {
    nama_program: program.nama_program,
    deskripsi: program.deskripsi,
    tujuan: program.tujuan,
    sasaran: program.sasaran,
    gambar: null,
    status: program.status,
  }
  imagePreview.value = null
  showModal.value = true

  await nextTick()
  initQuillEditors()

  if (quillDeskripsi && program.deskripsi) {
    quillDeskripsi.root.innerHTML = program.deskripsi
  }
  if (quillTujuan && program.tujuan) {
    quillTujuan.root.innerHTML = program.tujuan
  }
  if (quillSasaran && program.sasaran) {
    quillSasaran.root.innerHTML = program.sasaran
  }
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  selectedProgram.value = null

  quillDeskripsi = null
  quillTujuan = null
  quillSasaran = null
}

const submitForm = async () => {
  // Get HTML content from Quill editors
  if (quillDeskripsi) {
    formData.value.deskripsi = quillDeskripsi.root.innerHTML
  }
  if (quillTujuan) {
    formData.value.tujuan = quillTujuan.root.innerHTML
  }
  if (quillSasaran) {
    formData.value.sasaran = quillSasaran.root.innerHTML
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      await programUnggulanApi.update(selectedProgram.value.id, formData.value)
      alert('Data program unggulan berhasil diupdate')
    } else {
      await programUnggulanApi.create(formData.value)
      alert('Data program unggulan berhasil ditambahkan')
    }
    closeModal()
    fetchPrograms()
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Gagal menyimpan data: ' + (error.response?.data?.message || error.message))
  } finally {
    submitting.value = false
  }
}

const viewDetail = (program) => {
  selectedProgram.value = program
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedProgram.value = null
}

const confirmDelete = async (program) => {
  if (confirm(`Apakah Anda yakin ingin menghapus program "${program.nama_program}"?`)) {
    try {
      await programUnggulanApi.delete(program.id)
      alert('Data program unggulan berhasil dihapus')
      fetchPrograms()
    } catch (error) {
      console.error('Error deleting data:', error)
      alert('Gagal menghapus data: ' + (error.response?.data?.message || error.message))
    }
  }
}

const openImportModal = () => {
  importData.value = ''
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
  importData.value = ''
}

const submitImport = async () => {
  try {
    const data = JSON.parse(importData.value)
    if (!Array.isArray(data)) {
      alert('Data harus berupa array JSON')
      return
    }

    submitting.value = true
    const response = await programUnggulanApi.import(data)

    if (response.data.success) {
      alert(response.data.message)
      closeImportModal()
      fetchPrograms()
    }
  } catch (error) {
    console.error('Error importing data:', error)
    if (error instanceof SyntaxError) {
      alert('Format JSON tidak valid')
    } else {
      alert('Gagal mengimport data: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchPrograms()
})
</script>
