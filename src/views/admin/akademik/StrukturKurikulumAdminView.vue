<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Struktur Kurikulum</h1>
        <p class="text-gray-600 mt-1">Kelola struktur kurikulum berdasarkan konsentrasi keahlian</p>
      </div>
      <button
        @click="openCreateModal"
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
        Tambah Data
      </button>
    </div>

    <!-- Filter Section -->
    <div class="border-t border-gray-200 pt-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari mata pelajaran..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debounceSearch"
          />
        </div>

        <!-- Filter Konsentrasi Keahlian -->
        <div>
          <select
            v-model="filters.konsentrasi_keahlian_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="fetchData"
          >
            <option value="">Semua Konsentrasi</option>
            <option v-for="k in konsentrasiList" :key="k.id" :value="k.id">
              {{ k.nama_konsentrasi }}
            </option>
          </select>
        </div>

        <!-- Filter Tingkat -->
        <div>
          <select
            v-model="filters.tingkat"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="fetchData"
          >
            <option value="">Semua Tingkat</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        </div>

        <!-- Filter Semester -->
        <div>
          <select
            v-model="filters.semester"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="fetchData"
          >
            <option value="">Semua Semester</option>
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>
      </div>
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
              Konsentrasi Keahlian
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Mata Pelajaran
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tingkat
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Semester
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Jam/Minggu
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="strukturList.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
          </tr>
          <tr v-for="(item, index) in strukturList" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.konsentrasi_keahlian?.nama_konsentrasi || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.mata_pelajaran?.nama_mapel || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
              >
                Kelas {{ item.tingkat }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  item.semester === 'Ganjil'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800',
                ]"
              >
                {{ item.semester }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.jam_per_minggu }} Jam
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="openEditModal(item)"
                class="text-blue-600 hover:text-blue-900 mr-3"
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
                @click="confirmDelete(item)"
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Menampilkan {{ pagination.from }} sampai {{ pagination.to }} dari
        {{ pagination.total }} data
      </div>
      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-4 py-2 text-sm rounded-lg transition-colors',
            page === pagination.current_page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
          ]"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Struktur Kurikulum' : 'Tambah Struktur Kurikulum' }}
          </h3>
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
          <!-- Konsentrasi Keahlian -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Konsentrasi Keahlian <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.konsentrasi_keahlian_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.konsentrasi_keahlian_id }"
              required
            >
              <option value="">Pilih Konsentrasi Keahlian</option>
              <option v-for="k in konsentrasiList" :key="k.id" :value="k.id">
                {{ k.nama_konsentrasi }}
              </option>
            </select>
            <p v-if="errors.konsentrasi_keahlian_id" class="mt-1 text-sm text-red-600">
              {{ errors.konsentrasi_keahlian_id[0] }}
            </p>
          </div>

          <!-- Mata Pelajaran -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mata Pelajaran <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.mata_pelajaran_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.mata_pelajaran_id }"
              required
            >
              <option value="">Pilih Mata Pelajaran</option>
              <option v-for="m in mataPelajaranList" :key="m.id" :value="m.id">
                {{ m.nama_mapel }} ({{ m.kelompok }})
              </option>
            </select>
            <p v-if="errors.mata_pelajaran_id" class="mt-1 text-sm text-red-600">
              {{ errors.mata_pelajaran_id[0] }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Tingkat -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tingkat <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.tingkat"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.tingkat }"
                required
              >
                <option value="">Pilih Tingkat</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
              <p v-if="errors.tingkat" class="mt-1 text-sm text-red-600">
                {{ errors.tingkat[0] }}
              </p>
            </div>

            <!-- Semester -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Semester <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.semester"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.semester }"
                required
              >
                <option value="">Pilih Semester</option>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              <p v-if="errors.semester" class="mt-1 text-sm text-red-600">
                {{ errors.semester[0] }}
              </p>
            </div>
          </div>

          <!-- Jam Per Minggu -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Jam Per Minggu <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.jam_per_minggu"
              type="number"
              min="1"
              max="20"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.jam_per_minggu }"
              required
            />
            <p v-if="errors.jam_per_minggu" class="mt-1 text-sm text-red-600">
              {{ errors.jam_per_minggu[0] }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Hapus Struktur Kurikulum</h3>
          <p class="text-sm text-gray-500 mt-2">
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-center gap-3 mt-6">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              @click="deleteData"
              :disabled="submitting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {{ submitting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transition-all z-50',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
      ]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import strukturKurikulumService from '@/api/strukturKurikulum'

// State
const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const strukturList = ref([])
const konsentrasiList = ref([])
const mataPelajaranList = ref([])
const errors = ref({})
const toast = ref({ show: false, message: '', type: 'success' })

// Form data
const form = ref({
  konsentrasi_keahlian_id: '',
  mata_pelajaran_id: '',
  tingkat: '',
  semester: '',
  jam_per_minggu: '',
})

// Filters
const filters = ref({
  search: '',
  konsentrasi_keahlian_id: '',
  tingkat: '',
  semester: '',
})

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

// Item to delete
const itemToDelete = ref(null)

// Search debounce timer
let searchTimer = null

// Computed
const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page

  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(last)
    }
  }

  return pages
})

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      ...filters.value,
    }

    const response = await strukturKurikulumService.getAll(params)

    if (response.data.success) {
      strukturList.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to,
      }
    }
  } catch (error) {
    showToast('Gagal memuat data', 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchKonsentrasiKeahlian = async () => {
  try {
    const response = await strukturKurikulumService.getKonsentrasiKeahlian()
    if (response.data.success) {
      konsentrasiList.value = response.data.data.data || response.data.data
    }
  } catch (error) {
    console.error('Error fetching konsentrasi:', error)
  }
}

const fetchMataPelajaran = async () => {
  try {
    const response = await strukturKurikulumService.getMataPelajaran()
    if (response.data.success) {
      mataPelajaranList.value = response.data.data.data || response.data.data
    }
  } catch (error) {
    console.error('Error fetching mata pelajaran:', error)
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.current_page = 1
    fetchData()
  }, 500)
}

const changePage = (page) => {
  if (page !== '...' && page !== pagination.value.current_page) {
    pagination.value.current_page = page
    fetchData()
  }
}

const openCreateModal = () => {
  isEdit.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (item) => {
  isEdit.value = true
  form.value = {
    id: item.id,
    konsentrasi_keahlian_id: item.konsentrasi_keahlian_id,
    mata_pelajaran_id: item.mata_pelajaran_id,
    tingkat: item.tingkat,
    semester: item.semester,
    jam_per_minggu: item.jam_per_minggu,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    konsentrasi_keahlian_id: '',
    mata_pelajaran_id: '',
    tingkat: '',
    semester: '',
    jam_per_minggu: '',
  }
  errors.value = {}
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    let response
    if (isEdit.value) {
      response = await strukturKurikulumService.update(form.value.id, form.value)
    } else {
      response = await strukturKurikulumService.create(form.value)
    }

    if (response.data.success) {
      showToast(response.data.message, 'success')
      closeModal()
      fetchData()
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showToast(error.response?.data?.message || 'Terjadi kesalahan', 'error')
    }
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const deleteData = async () => {
  submitting.value = true
  try {
    const response = await strukturKurikulumService.delete(itemToDelete.value.id)

    if (response.data.success) {
      showToast(response.data.message, 'success')
      showDeleteModal.value = false
      fetchData()
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus data', 'error')
  } finally {
    submitting.value = false
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  fetchData()
  fetchKonsentrasiKeahlian()
  fetchMataPelajaran()
})
</script>
