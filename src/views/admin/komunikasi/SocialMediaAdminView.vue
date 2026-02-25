<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
      <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
    </div>

    <!-- Filters & Actions -->
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-3 flex-1">
        <!-- Search -->
        <div class="relative flex-1 min-w-[250px]">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari platform, username, atau URL..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Status Filter -->
        <select
          v-model="filters.status"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadSocialMedia"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="non-aktif">Non-Aktif</option>
        </select>
      </div>

      <!-- Add Button -->
      <button
        @click="openModal('add')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Social Media
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ error }}
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
              Platform
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Username
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              URL
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Icon
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
          <tr v-if="socialMediaList.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              Tidak ada data social media
            </td>
          </tr>
          <tr v-for="(item, index) in socialMediaList" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ item.platform }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.username || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <a :href="item.url" target="_blank" class="text-blue-600 hover:underline">
                {{ truncateUrl(item.url) }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.icon || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  item.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ item.status === 'aktif' ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button
                  @click="openModal('edit', item)"
                  class="text-blue-600 hover:text-blue-900"
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
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && socialMediaList.length > 0"
      class="mt-6 flex items-center justify-between"
    >
      <div class="text-sm text-gray-700">
        Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }} data
      </div>
      <div class="flex gap-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-2 border rounded-lg',
            page === pagination.current_page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ modalMode === 'add' ? 'Tambah' : 'Edit' }} Social Media
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

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Platform -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Platform <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.platform"
              type="text"
              required
              maxlength="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Facebook, Instagram, Twitter"
            />
            <p v-if="errors.platform" class="mt-1 text-sm text-red-600">{{ errors.platform[0] }}</p>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              v-model="form.username"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="@username atau nama akun"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username[0] }}</p>
          </div>

          <!-- URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              v-model="form.url"
              type="url"
              placeholder="https://facebook.com/sekolah"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.url }"
            />
            <p v-if="errors.url" class="mt-1 text-sm text-red-600">
              {{ errors.url[0] }}
            </p>
          </div>

          <!-- Icon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <input
              v-model="form.icon"
              type="text"
              maxlength="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama icon atau class CSS"
            />
            <p v-if="errors.icon" class="mt-1 text-sm text-red-600">{{ errors.icon[0] }}</p>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-Aktif</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status[0] }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="submitting"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus social media <strong>{{ deleteItem?.platform }}</strong
          >?
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
          <button
            @click="showDeleteModal = false"
            :disabled="deleting"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
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
import { ref, computed, onMounted } from 'vue'
import socialMedia from '@/api/socialMedia'

const pageTitle = 'Social Media'
const pageDescription = 'Kelola link social media sekolah'

// State
const socialMediaList = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const modalMode = ref('add')
const submitting = ref(false)
const showDeleteModal = ref(false)
const deleteItem = ref(null)
const deleting = ref(false)

// Filters
const filters = ref({
  search: '',
  status: '',
  page: 1,
  per_page: 10,
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

// Form
const form = ref({
  platform: '',
  username: '',
  url: '',
  icon: '',
  status: 'aktif',
})

const errors = ref({})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

// Computed
const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    pages.push(i)
  }

  if (current - delta > 2) {
    pages.unshift('...')
  }
  if (current + delta < last - 1) {
    pages.push('...')
  }

  pages.unshift(1)
  if (last > 1) {
    pages.push(last)
  }

  return pages.filter((p) => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

// Methods
let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    loadSocialMedia()
  }, 500)
}

const loadSocialMedia = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('Fetching social media with filters:', filters.value)
    const response = await socialMedia.getAll(filters.value)
    console.log('API Response:', response.data)

    if (response.data.success) {
      socialMediaList.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to,
      }
    }
  } catch (err) {
    console.error('Full error object:', err)
    console.error('Error response:', err.response)
    console.error('Error message:', err.message)
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  loadSocialMedia()
}

const openModal = (mode, item = null) => {
  modalMode.value = mode
  if (mode === 'edit' && item) {
    form.value = {
      id: item.id,
      platform: item.platform,
      username: item.username,
      url: item.url, // PASTIKAN ini url bukan uri
      icon: item.icon,
      status: item.status,
    }
  } else {
    resetForm()
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
  errors.value = {}
}

const resetForm = () => {
  form.value = {
    platform: '',
    username: '',
    url: '',
    icon: '',
    status: 'aktif',
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    errors.value = {}

    console.log('Form data before submit:', form.value) // Tambahkan ini
    console.log('Has URL field?', 'url' in form.value) // Tambahkan ini
    console.log('URL value:', form.value.url)

    let response
    if (modalMode.value === 'add') {
      // console.log('Creating new social media...') // Tambahkan ini
      response = await socialMedia.create(form.value)
    } else {
      // console.log('Updating social media ID:', form.value.id) // Tambahkan ini
      response = await socialMedia.update(form.value.id, form.value)
    }

    console.log('Response received:', response.data) // Tambahkan ini

    if (response.data.success) {
      closeModal()
      loadSocialMedia()
      showToast(response.data.message, 'success')
    }
  } catch (err) {
    console.error('Full error object:', err) // Sudah ada
    console.error('Error response data:', JSON.stringify(err.response?.data, null, 2)) // Tambahkan ini

    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    } else {
      showToast(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data', 'error') // Ganti alert
    }
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (item) => {
  deleteItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    const response = await socialMedia.delete(deleteItem.value.id)

    if (response.data.success) {
      showDeleteModal.value = false
      loadSocialMedia()
      showToast(response.data.message, 'success') // Ganti alert
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Terjadi kesalahan saat menghapus data', 'error') // Ganti alert
    console.error('Error deleting social media:', err)
  } finally {
    deleting.value = false
  }
}

const truncateUrl = (url) => {
  return url.length > 40 ? url.substring(0, 40) + '...' : url
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  loadSocialMedia()
})
</script>
