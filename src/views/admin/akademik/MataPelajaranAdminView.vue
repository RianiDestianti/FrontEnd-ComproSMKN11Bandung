<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Mata Pelajaran</h1>
        <p class="text-gray-600 mt-1">Kelola data mata pelajaran berdasarkan kelompok</p>
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
        Tambah Mata Pelajaran
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Cari berdasarkan nama atau kode mata pelajaran..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <select
        v-model="filterKelompok"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Kelompok</option>
        <option value="A">Kelompok A</option>
        <option value="B">Kelompok B</option>
        <option value="C">Kelompok C</option>
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
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kode Mapel
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Mata Pelajaran
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kelompok
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(mapel, index) in mataPelajaranList"
              :key="mapel.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ mapel.kode_mapel || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ mapel.nama_mapel }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getKelompokClass(mapel.kelompok)"
                >
                  Kelompok {{ mapel.kelompok }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="openModal('edit', mapel)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(mapel)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="mataPelajaranList.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                Belum ada data mata pelajaran
              </td>
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
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ modalMode === 'create' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran' }}
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
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Kode Mata Pelajaran</label
              >
              <input
                v-model="form.kode_mapel"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: MAT"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nama Mata Pelajaran *</label
              >
              <input
                v-model="form.nama_mapel"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Matematika"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kelompok *</label>
              <select
                v-model="form.kelompok"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih Kelompok</option>
                <option value="A">Kelompok A (Umum)</option>
                <option value="B">Kelompok B (Umum)</option>
                <option value="C">Kelompok C (Peminatan)</option>
              </select>
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
          Apakah Anda yakin ingin menghapus mata pelajaran
          <strong>{{ deleteTarget?.nama_mapel }}</strong
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
            @click="deleteMataPelajaran"
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
import mataPelajaranApi from '@/api/mataPelajaran'

const loading = ref(false)
const mataPelajaranList = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const isSubmitting = ref(false)
const errorMessage = ref('')
const deleteTarget = ref(null)
const searchQuery = ref('')
const filterKelompok = ref('')

const form = ref({
  kode_mapel: '',
  nama_mapel: '',
  kelompok: '',
})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(() => {
  fetchMataPelajaran()
})

const fetchMataPelajaran = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterKelompok.value) params.kelompok = filterKelompok.value
    if (searchQuery.value) params.search = searchQuery.value

    const response = await mataPelajaranApi.getAll(params)
    mataPelajaranList.value = response.data.data
  } catch (error) {
    showToast('Gagal memuat data mata pelajaran', 'error')
    console.error('Error fetching mata pelajaran:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchMataPelajaran()
}

const handleFilter = () => {
  fetchMataPelajaran()
}

const openModal = (mode, mapel = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'edit' && mapel) {
    form.value = {
      id: mapel.id,
      kode_mapel: mapel.kode_mapel || '',
      nama_mapel: mapel.nama_mapel,
      kelompok: mapel.kelompok,
    }
  } else {
    form.value = {
      kode_mapel: '',
      nama_mapel: '',
      kelompok: '',
    }
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    kode_mapel: '',
    nama_mapel: '',
    kelompok: '',
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (modalMode.value === 'create') {
      await mataPelajaranApi.create(form.value)
      showToast('Mata pelajaran berhasil ditambahkan', 'success')
    } else {
      await mataPelajaranApi.update(form.value.id, form.value)
      showToast('Mata pelajaran berhasil diupdate', 'success')
    }

    closeModal()
    fetchMataPelajaran()
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

const confirmDelete = (mapel) => {
  deleteTarget.value = mapel
  showDeleteModal.value = true
}

const deleteMataPelajaran = async () => {
  isSubmitting.value = true

  try {
    await mataPelajaranApi.delete(deleteTarget.value.id)
    showToast('Mata pelajaran berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchMataPelajaran()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus mata pelajaran', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const getKelompokClass = (kelompok) => {
  const classes = {
    A: 'bg-blue-100 text-blue-800',
    B: 'bg-green-100 text-green-800',
    C: 'bg-purple-100 text-purple-800',
  }
  return classes[kelompok] || 'bg-gray-100 text-gray-800'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>
