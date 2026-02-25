<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
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
        Tambah Kategori
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Cari kategori..."
        class="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>

    <!-- Table -->
    <div v-else class="border border-gray-200 rounded-lg overflow-hidden">
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
              Icon
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nama Kategori
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Slug
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tanggal Dibuat
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="categories.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              Tidak ada data kategori
            </td>
          </tr>
          <tr v-for="(category, index) in categories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                v-if="category.icon"
                :src="getIconUrl(category.icon)"
                :alt="category.nama_kategori"
                class="h-10 w-10 rounded object-cover"
              />
              <div v-else class="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
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
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ category.nama_kategori }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ category.slug }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(category.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openModal('edit', category)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Edit
              </button>
              <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-900">
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ modalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori' }}
        </h2>

        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nama_kategori"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama kategori"
            />
            <p v-if="errors.nama_kategori" class="text-red-500 text-sm mt-1">
              {{ errors.nama_kategori[0] }}
            </p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"> Slug (opsional) </label>
            <input
              v-model="form.slug"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="akan di-generate otomatis jika kosong"
            />
            <p v-if="errors.slug" class="text-red-500 text-sm mt-1">
              {{ errors.slug[0] }}
            </p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"> Icon (opsional) </label>
            <input
              @change="handleFileChange"
              type="file"
              accept="image/*"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF, SVG. Max: 2MB</p>
            <p v-if="errors.icon" class="text-red-500 text-sm mt-1">
              {{ errors.icon[0] }}
            </p>

            <!-- Preview Icon -->
            <div v-if="iconPreview || (modalMode === 'edit' && form.icon_existing)" class="mt-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                :src="iconPreview || getIconUrl(form.icon_existing)"
                alt="Preview"
                class="h-20 w-20 rounded object-cover border border-gray-300"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 z-50 transition-all duration-300 transform"
      :class="toast.show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'"
    >
      <div
        class="px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-yellow-500 text-white': toast.type === 'warning',
        }"
      >
        <!-- Success Icon -->
        <svg
          v-if="toast.type === 'success'"
          class="w-6 h-6 flex-shrink-0"
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

        <!-- Error Icon -->
        <svg
          v-else-if="toast.type === 'error'"
          class="w-6 h-6 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        <!-- Warning Icon -->
        <svg
          v-else
          class="w-6 h-6 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import kategoriInformasiApi from '@/api/kategoriInformasi'

const pageTitle = 'Kategori Informasi'
const pageDescription = 'Kelola kategori informasi yang tersedia'

const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const modalMode = ref('create')
const searchQuery = ref('')
const iconPreview = ref(null)

const categories = ref([])
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
  nama_kategori: '',
  slug: '',
  icon: null,
  icon_existing: null,
})

const errors = reactive({})

// Fetch data
const fetchCategories = async (page = 1) => {
  loading.value = true
  try {
    const response = await kategoriInformasiApi.getAll({
      page,
      per_page: pagination.per_page,
      search: searchQuery.value,
    })

    if (response.data.success) {
      categories.value = response.data.data.data
      pagination.current_page = response.data.data.current_page
      pagination.total = response.data.data.total
      pagination.from = response.data.data.from || 0
      pagination.to = response.data.data.to || 0
      pagination.last_page = response.data.data.last_page
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    showToast('Gagal mengambil data kategori', 'error') // ✅ Ganti alert
  } finally {
    loading.value = false
  }
}

const toast = ref({
  show: false,
  message: '',
  type: 'success', // success, error, warning
})

// Search handler
let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchCategories(1)
  }, 500)
}

// Open modal
const openModal = (mode, category = null) => {
  modalMode.value = mode
  showModal.value = true

  if (mode === 'edit' && category) {
    form.id = category.id
    form.nama_kategori = category.nama_kategori
    form.slug = category.slug
    form.icon_existing = category.icon
  } else {
    resetForm()
  }
}

// Close modal
const closeModal = () => {
  showModal.value = false
  resetForm()
  iconPreview.value = null
}

// Reset form
const resetForm = () => {
  form.id = null
  form.nama_kategori = ''
  form.slug = ''
  form.icon = null
  form.icon_existing = null
  Object.keys(errors).forEach((key) => delete errors[key])
}

// Handle file change
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.icon = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      iconPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Submit form
const submitForm = async () => {
  submitting.value = true
  Object.keys(errors).forEach((key) => delete errors[key])

  try {
    const formData = {
      nama_kategori: form.nama_kategori,
      slug: form.slug,
      icon: form.icon,
    }

    let response
    if (modalMode.value === 'create') {
      response = await kategoriInformasiApi.create(formData)
    } else {
      response = await kategoriInformasiApi.update(form.id, formData)
    }

    if (response.data.success) {
      showToast(response.data.message, 'success')
      closeModal()
      fetchCategories(pagination.current_page)
    }
  } catch (error) {
    console.error('Submit error:', error)
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      showToast(error.response?.data?.message || 'Terjadi kesalahan', 'error')
    }
  } finally {
    submitting.value = false
  }
}

// Delete category
const deleteCategory = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    return
  }

  try {
    const response = await kategoriInformasiApi.delete(id)
    if (response.data.success) {
      showToast(response.data.message, 'success') // ✅ Ganti alert
      fetchCategories(pagination.current_page)
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus kategori', 'error') // ✅ Ganti alert
  }
}

// Change page
const changePage = (page) => {
  if (page >= 1 && page <= pagination.last_page) {
    fetchCategories(page)
  }
}

// Get icon URL
const getIconUrl = (iconPath) => {
  if (!iconPath) return ''
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${iconPath}`
}

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  fetchCategories()
})
</script>
