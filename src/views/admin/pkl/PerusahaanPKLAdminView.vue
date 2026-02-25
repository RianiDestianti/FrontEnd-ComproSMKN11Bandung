<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
      <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="mb-6 flex flex-wrap gap-3">
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
        Tambah Perusahaan
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
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        v-model="search"
        @input="fetchPerusahaan"
        type="text"
        placeholder="Cari perusahaan..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <select
        v-model="filterStatus"
        @change="fetchPerusahaan"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="non-aktif">Non-Aktif</option>
      </select>

      <input
        v-model="filterKota"
        @input="fetchPerusahaan"
        type="text"
        placeholder="Filter berdasarkan kota..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <input
        v-model="filterProvinsi"
        @input="fetchPerusahaan"
        type="text"
        placeholder="Filter berdasarkan provinsi..."
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
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
              Nama Perusahaan
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Bidang Usaha
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Kota
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Provinsi
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Telepon
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
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
          <tr v-if="perusahaanList.length === 0">
            <td colspan="9" class="px-6 py-4 text-center text-gray-500">
              Tidak ada data perusahaan
            </td>
          </tr>
          <tr
            v-for="(perusahaan, index) in perusahaanList"
            :key="perusahaan.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ perusahaan.nama_perusahaan }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ perusahaan.bidang_usaha || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ perusahaan.kota || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ perusahaan.provinsi || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ perusahaan.no_telepon || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ perusahaan.email || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  perusahaan.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ perusahaan.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="viewDetail(perusahaan)"
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
                  @click="openEditModal(perusahaan)"
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
                  @click="confirmDelete(perusahaan)"
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            {{ isEdit ? 'Edit Perusahaan PKL' : 'Tambah Perusahaan PKL' }}
          </h2>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Perusahaan <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nama_perusahaan"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bidang Usaha</label>
              <input
                v-model="formData.bidang_usaha"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                v-model="formData.alamat"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                <input
                  v-model="formData.kota"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                <input
                  v-model="formData.provinsi"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  v-model="formData.no_telepon"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                v-model="formData.contact_person"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                v-model="formData.website"
                type="url"
                placeholder="https://example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Detail Perusahaan PKL</h2>
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

          <div v-if="selectedPerusahaan" class="space-y-3">
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Nama Perusahaan:</span>
              <span class="col-span-2 text-gray-900">{{ selectedPerusahaan.nama_perusahaan }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Bidang Usaha:</span>
              <span class="col-span-2 text-gray-900">{{
                selectedPerusahaan.bidang_usaha || '-'
              }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Alamat:</span>
              <span class="col-span-2 text-gray-900">{{ selectedPerusahaan.alamat || '-' }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Kota:</span>
              <span class="col-span-2 text-gray-900">{{ selectedPerusahaan.kota || '-' }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Provinsi:</span>
              <span class="col-span-2 text-gray-900">{{ selectedPerusahaan.provinsi || '-' }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">No. Telepon:</span>
              <span class="col-span-2 text-gray-900">{{
                selectedPerusahaan.no_telepon || '-'
              }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Email:</span>
              <span class="col-span-2 text-gray-900">{{ selectedPerusahaan.email || '-' }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Contact Person:</span>
              <span class="col-span-2 text-gray-900">{{
                selectedPerusahaan.contact_person || '-'
              }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Website:</span>
              <span class="col-span-2 text-gray-900">
                <a
                  v-if="selectedPerusahaan.website"
                  :href="selectedPerusahaan.website"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  {{ selectedPerusahaan.website }}
                </a>
                <span v-else>-</span>
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 border-b pb-2">
              <span class="font-medium text-gray-700">Status:</span>
              <span class="col-span-2">
                <span
                  :class="
                    selectedPerusahaan.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ selectedPerusahaan.status }}
                </span>
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
          <h2 class="text-xl font-bold text-gray-900 mb-4">Import Data Perusahaan PKL</h2>

          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Format data yang diharapkan (JSON Array):</p>
            <pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
[
  {
    "nama_perusahaan": "PT Example",
    "bidang_usaha": "Teknologi",
    "alamat": "Jl. Example No. 123",
    "kota": "Bandung",
    "provinsi": "Jawa Barat",
    "no_telepon": "022-1234567",
    "email": "info@example.com",
    "contact_person": "John Doe",
    "website": "https://example.com",
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
import { ref, onMounted } from 'vue'
import perusahaanPKLApi from '@/api/perusahaanPKL'

const pageTitle = 'Data Perusahaan PKL'
const pageDescription = 'Kelola data perusahaan tempat siswa melaksanakan Praktik Kerja Lapangan'

const perusahaanList = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDetailModal = ref(false)
const showImportModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const selectedPerusahaan = ref(null)
const importData = ref('')

const search = ref('')
const filterStatus = ref('')
const filterKota = ref('')
const filterProvinsi = ref('')

const formData = ref({
  nama_perusahaan: '',
  bidang_usaha: '',
  alamat: '',
  kota: '',
  provinsi: '',
  no_telepon: '',
  email: '',
  contact_person: '',
  website: '',
  status: 'aktif',
})

const resetForm = () => {
  formData.value = {
    nama_perusahaan: '',
    bidang_usaha: '',
    alamat: '',
    kota: '',
    provinsi: '',
    no_telepon: '',
    email: '',
    contact_person: '',
    website: '',
    status: 'aktif',
  }
}

const fetchPerusahaan = async () => {
  loading.value = true
  try {
    const params = {}
    if (search.value) params.search = search.value
    if (filterStatus.value) params.status = filterStatus.value
    if (filterKota.value) params.kota = filterKota.value
    if (filterProvinsi.value) params.provinsi = filterProvinsi.value

    const response = await perusahaanPKLApi.getAll(params)
    if (response.data.success) {
      perusahaanList.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data perusahaan PKL')
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEdit.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (perusahaan) => {
  isEdit.value = true
  selectedPerusahaan.value = perusahaan
  formData.value = { ...perusahaan }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  selectedPerusahaan.value = null
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value) {
      await perusahaanPKLApi.update(selectedPerusahaan.value.id, formData.value)
      alert('Data perusahaan PKL berhasil diupdate')
    } else {
      await perusahaanPKLApi.create(formData.value)
      alert('Data perusahaan PKL berhasil ditambahkan')
    }
    closeModal()
    fetchPerusahaan()
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Gagal menyimpan data: ' + (error.response?.data?.message || error.message))
  } finally {
    submitting.value = false
  }
}

const viewDetail = (perusahaan) => {
  selectedPerusahaan.value = perusahaan
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedPerusahaan.value = null
}

const confirmDelete = async (perusahaan) => {
  if (confirm(`Apakah Anda yakin ingin menghapus perusahaan "${perusahaan.nama_perusahaan}"?`)) {
    try {
      await perusahaanPKLApi.delete(perusahaan.id)
      alert('Data perusahaan PKL berhasil dihapus')
      fetchPerusahaan()
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
    const response = await perusahaanPKLApi.import(data)

    if (response.data.success) {
      alert(response.data.message)
      closeImportModal()
      fetchPerusahaan()
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
  fetchPerusahaan()
})
</script>
