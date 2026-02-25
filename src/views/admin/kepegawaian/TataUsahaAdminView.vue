<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Data Tata Usaha</h1>
        <p class="text-gray-600 mt-1">Kelola data staff tata usaha SMKN 11 Bandung</p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Tambah Staff
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="mb-4 flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau NIP..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="filterStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="non-aktif">Non-Aktif</option>
      </select>
      <select
        v-model="filterStatusKepegawaian"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Kepegawaian</option>
        <option value="PNS">PNS</option>
        <option value="Honor">Honor</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading...</div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Jenis Kelamin
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jabatan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status Kepegawaian
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in filteredTataUsaha" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div v-if="item.foto" class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  :src="getImageUrl(item.foto)"
                  :alt="item.nama"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.nip || '-' }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.nama }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.jabatan || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.bidang || '-' }}</td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.status_kepegawaian === 'PNS'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800',
                ]"
              >
                {{ item.status_kepegawaian }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-2">
                <button
                  @click="viewDetail(item)"
                  class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Detail"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="editItem(item)"
                  class="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Hapus"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredTataUsaha.length === 0" class="text-center py-8 text-gray-500">
        Belum ada data tata usaha
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ isEdit ? 'Edit' : 'Tambah' }} Data Tata Usaha
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                <input
                  v-model="formData.nip"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NIP"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama Lengkap <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.nama"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Foto</label>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Jenis Kelamin <span class="text-red-500">*</span></label
              >
              <select
                v-model="formData.jenis_kelamin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">- Pilih -</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                <input
                  v-model="formData.tempat_lahir"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tempat lahir"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input
                  v-model="formData.tanggal_lahir"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                v-model="formData.alamat"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alamat lengkap"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  v-model="formData.no_telepon"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08xx"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input
                  v-model="formData.jabatan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Staff Administrasi"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
                <input
                  v-model="formData.bidang"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Keuangan, Kepegawaian"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Kepegawaian <span class="text-red-500">*</span></label
                >
                <select
                  v-model="formData.status_kepegawaian"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">- Pilih -</option>
                  <option value="PNS">PNS</option>
                  <option value="Honor">Honor</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
                <input
                  v-model="formData.tanggal_masuk"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Status <span class="text-red-500">*</span></label
              >
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetailModal"
    >
      <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Data Tata Usaha</h2>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedItem" class="space-y-6">
            <div v-if="selectedItem.foto" class="flex justify-center">
              <img
                :src="getImageUrl(selectedItem.foto)"
                :alt="selectedItem.nama"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">NIP</label>
                <p class="text-gray-900">{{ selectedItem.nip || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                <p class="text-gray-900 font-medium">{{ selectedItem.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
                <p class="text-gray-900">
                  {{ selectedItem.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Tempat, Tanggal Lahir</label
                >
                <p class="text-gray-900">
                  {{ selectedItem.tempat_lahir || '-' }},
                  {{ formatDate(selectedItem.tanggal_lahir) }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                <p class="text-gray-900">{{ selectedItem.alamat || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">No. Telepon</label>
                <p class="text-gray-900">{{ selectedItem.no_telepon || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p class="text-gray-900">{{ selectedItem.email || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Jabatan</label>
                <p class="text-gray-900">{{ selectedItem.jabatan || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Bidang</label>
                <p class="text-gray-900">{{ selectedItem.bidang || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Status Kepegawaian</label
                >
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-medium',
                    selectedItem.status_kepegawaian === 'PNS'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800',
                  ]"
                >
                  {{ selectedItem.status_kepegawaian }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tanggal Masuk</label>
                <p class="text-gray-900">{{ formatDate(selectedItem.tanggal_masuk) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-medium',
                    selectedItem.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ selectedItem.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 pt-4 border-t">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import tataUsahaApi from '@/api/tataUsaha'

const tataUsaha = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const selectedItem = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const filterStatusKepegawaian = ref('')

const formData = ref({
  nip: '',
  nama: '',
  foto: null,
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat: '',
  no_telepon: '',
  email: '',
  jabatan: '',
  bidang: '',
  status_kepegawaian: '',
  tanggal_masuk: '',
  status: 'aktif',
})

const filteredTataUsaha = computed(() => {
  return tataUsaha.value.filter((item) => {
    const matchSearch =
      !searchQuery.value ||
      item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.nip && item.nip.includes(searchQuery.value))

    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchKepegawaian =
      !filterStatusKepegawaian.value || item.status_kepegawaian === filterStatusKepegawaian.value

    return matchSearch && matchStatus && matchKepegawaian
  })
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await tataUsahaApi.getAll()
    if (response.data.success) {
      tataUsaha.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data tata usaha')
  } finally {
    loading.value = false
  }
}

const getImageUrl = (foto) => {
  if (!foto) return ''
  if (foto.startsWith('http')) return foto
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'
  return `${baseUrl}/${foto}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const openModal = () => {
  isEdit.value = false
  selectedItem.value = null
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
}

const resetForm = () => {
  formData.value = {
    nip: '',
    nama: '',
    foto: null,
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    email: '',
    jabatan: '',
    bidang: '',
    status_kepegawaian: '',
    tanggal_masuk: '',
    status: 'aktif',
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.foto = file
  }
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const editItem = (item) => {
  isEdit.value = true
  selectedItem.value = item
  formData.value = {
    nip: item.nip || '',
    nama: item.nama,
    foto: null,
    jenis_kelamin: item.jenis_kelamin,
    tempat_lahir: item.tempat_lahir || '',
    tanggal_lahir: item.tanggal_lahir || '',
    alamat: item.alamat || '',
    no_telepon: item.no_telepon || '',
    email: item.email || '',
    jabatan: item.jabatan || '',
    bidang: item.bidang || '',
    status_kepegawaian: item.status_kepegawaian,
    tanggal_masuk: item.tanggal_masuk || '',
    status: item.status,
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    let response
    if (isEdit.value) {
      response = await tataUsahaApi.update(selectedItem.value.id, formData.value)
    } else {
      response = await tataUsahaApi.create(formData.value)
    }

    if (response.data.success) {
      alert(isEdit.value ? 'Data berhasil diupdate' : 'Data berhasil ditambahkan')
      closeModal()
      fetchData()
    }
  } catch (error) {
    console.error('Error saving data:', error)
    const errorMsg = error.response?.data?.message || error.message
    alert('Gagal menyimpan data: ' + errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

  try {
    const response = await tataUsahaApi.delete(id)
    if (response.data.success) {
      alert('Data berhasil dihapus')
      fetchData()
    }
  } catch (error) {
    console.error('Error deleting data:', error)
    alert('Gagal menghapus data')
  }
}
</script>
