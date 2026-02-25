<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Fasilitas Sekolah</h1>
        <p class="text-gray-600 mt-1">Kelola data fasilitas dan galeri foto</p>
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
        Tambah Fasilitas
      </button>
    </div>

    <!-- Filter Section -->
    <div class="border-t border-gray-200 pt-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari fasilitas..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debounceSearch"
          />
        </div>

        <!-- Filter Kategori -->
        <div>
          <input
            v-model="filters.kategori"
            type="text"
            placeholder="Filter kategori..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debounceSearch"
          />
        </div>

        <!-- Filter Kondisi -->
        <div>
          <select
            v-model="filters.kondisi"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="fetchData"
          >
            <option value="">Semua Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="fasilitasList.length === 0" class="col-span-full text-center py-12 text-gray-500">
        Tidak ada data fasilitas
      </div>

      <div
        v-for="item in fasilitasList"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Image -->
        <div class="relative h-48 bg-gray-200">
          <img
            v-if="item.gambar_url"
            :src="item.gambar_url"
            :alt="item.nama_fasilitas"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <!-- Badge Galeri -->
          <div
            v-if="item.galeri_fasilitas && item.galeri_fasilitas.length > 0"
            class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
          >
            <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ item.galeri_fasilitas.length }}
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.nama_fasilitas }}</h3>

          <div class="space-y-2 mb-4">
            <div v-if="item.kategori" class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {{ item.kategori }}
            </div>

            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
              Jumlah: {{ item.jumlah }}
            </div>

            <div class="flex items-center text-sm">
              <span :class="getKondisiClass(item.kondisi)">
                {{ item.kondisi }}
              </span>
            </div>
          </div>

          <p v-if="item.deskripsi" class="text-sm text-gray-600 mb-4 line-clamp-2">
            {{ item.deskripsi }}
          </p>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="openDetailModal(item)"
              class="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded hover:bg-green-100 text-sm font-medium transition-colors"
            >
              Detail
            </button>
            <button
              @click="openEditModal(item)"
              class="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(item)"
              class="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 text-sm font-medium transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white my-10"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas' }}
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
          <!-- Nama Fasilitas -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nama Fasilitas <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nama_fasilitas"
              type="text"
              placeholder="Contoh: Laboratorium Komputer"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.nama_fasilitas }"
              required
            />
            <p v-if="errors.nama_fasilitas" class="mt-1 text-sm text-red-600">
              {{ errors.nama_fasilitas[0] }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Kategori -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Kategori </label>
              <input
                v-model="form.kategori"
                type="text"
                placeholder="Contoh: Laboratorium"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Jumlah -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Jumlah </label>
              <input
                v-model.number="form.jumlah"
                type="number"
                min="1"
                placeholder="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Kondisi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Kondisi <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.kondisi"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.kondisi }"
              required
            >
              <option value="">Pilih Kondisi</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
            <p v-if="errors.kondisi" class="mt-1 text-sm text-red-600">
              {{ errors.kondisi[0] }}
            </p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Deskripsi </label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              placeholder="Deskripsi fasilitas (opsional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- Gambar Utama -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Gambar Utama </label>
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/jpeg,image/jpg,image/png"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-xs text-gray-500">Format: JPG, PNG. Maksimal 2MB</p>

            <!-- Preview Gambar -->
            <div v-if="imagePreview || (isEdit && form.gambar_url)" class="mt-2">
              <img
                :src="imagePreview || form.gambar_url"
                class="h-32 object-cover rounded"
                alt="Preview"
              />
            </div>
          </div>

          <!-- Galeri Foto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Galeri Foto (Multiple)
            </label>
            <input
              type="file"
              @change="handleGaleriUpload"
              accept="image/jpeg,image/jpg,image/png"
              multiple
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="mt-1 text-xs text-gray-500">
              Upload beberapa foto sekaligus. Format: JPG, PNG
            </p>

            <!-- Preview Galeri -->
            <div v-if="galeriPreviews.length > 0" class="mt-2 grid grid-cols-4 gap-2">
              <div v-for="(preview, index) in galeriPreviews" :key="index" class="relative">
                <img :src="preview" class="h-20 w-full object-cover rounded" alt="Preview galeri" />
                <button
                  type="button"
                  @click="removeGaleriPreview(index)"
                  class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Existing Galeri (Edit Mode) -->
            <div v-if="isEdit && existingGaleri.length > 0" class="mt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Foto yang sudah ada:</p>
              <div class="grid grid-cols-4 gap-2">
                <div v-for="galeri in existingGaleri" :key="galeri.id" class="relative">
                  <img
                    :src="galeri.gambar_url"
                    class="h-20 w-full object-cover rounded"
                    :alt="galeri.keterangan"
                  />
                  <button
                    type="button"
                    @click="confirmDeleteGaleri(galeri)"
                    class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-4 border-t">
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

    <!-- Modal Detail -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white my-10"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">Detail Fasilitas</h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
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

        <div v-if="selectedItem" class="space-y-6">
          <!-- Main Image -->
          <div
            v-if="selectedItem.gambar"
            class="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"
          >
            <img
              :src="selectedItem.gambar_url"
              :alt="selectedItem.nama_fasilitas"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Nama Fasilitas</h4>
              <p class="mt-1 text-base font-semibold">{{ selectedItem.nama_fasilitas }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Kategori</h4>
              <p class="mt-1 text-base">{{ selectedItem.kategori || '-' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Jumlah</h4>
              <p class="mt-1 text-base">{{ selectedItem.jumlah }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Kondisi</h4>
              <p class="mt-1">
                <span :class="getKondisiClass(selectedItem.kondisi)">{{
                  selectedItem.kondisi
                }}</span>
              </p>
            </div>
          </div>

          <!-- Deskripsi -->
          <div v-if="selectedItem.deskripsi">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Deskripsi</h4>
            <p class="text-sm text-gray-700">{{ selectedItem.deskripsi }}</p>
          </div>

          <!-- Galeri -->
          <div v-if="selectedItem.galeri_fasilitas && selectedItem.galeri_fasilitas.length > 0">
            <h4 class="text-sm font-medium text-gray-500 mb-3">
              Galeri Foto ({{ selectedItem.galeri_fasilitas.length }})
            </h4>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="galeri in selectedItem.galeri_fasilitas"
                :key="galeri.id"
                class="relative group"
              >
                <img
                  :src="galeri.gambar_url"
                  class="w-full h-32 object-cover rounded cursor-pointer"
                  :alt="galeri.keterangan"
                />
                <p v-if="galeri.keterangan" class="text-xs text-gray-600 mt-1">
                  {{ galeri.keterangan }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6 pt-4 border-t">
          <button
            @click="showDetailModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
        </div>
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
          <h3 class="text-lg font-medium text-gray-900 mt-4">Hapus Fasilitas</h3>
          <p class="text-sm text-gray-500 mt-2">
            Apakah Anda yakin ingin menghapus fasilitas ini beserta semua galeri foto? Tindakan ini
            tidak dapat dibatalkan.
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
import { ref, onMounted } from 'vue'
import fasilitasService from '@/api/fasilitas'

// State
const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const fasilitasList = ref([])
const selectedItem = ref(null)
const errors = ref({})
const toast = ref({ show: false, message: '', type: 'success' })

// Form data
const form = ref({
  nama_fasilitas: '',
  kategori: '',
  deskripsi: '',
  jumlah: 1,
  kondisi: '',
  gambar: null,
  gambar_url: '',
  galeri: [],
  keterangan_galeri: [],
})

// Filters
const filters = ref({
  search: '',
  kategori: '',
  kondisi: '',
})

// Image previews
const imagePreview = ref('')
const galeriPreviews = ref([])
const existingGaleri = ref([])

// Item to delete
const itemToDelete = ref(null)
const galeriToDelete = ref(null)

// Search debounce timer
let searchTimer = null

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    const response = await fasilitasService.getAll(filters.value)

    if (response.data.success) {
      fasilitasList.value = response.data.data
    }
  } catch (error) {
    showToast('Gagal memuat data', 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchData()
  }, 500)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.gambar = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleGaleriUpload = (event) => {
  const files = Array.from(event.target.files)
  form.value.galeri = files

  galeriPreviews.value = []
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      galeriPreviews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeGaleriPreview = (index) => {
  galeriPreviews.value.splice(index, 1)
  const newGaleri = Array.from(form.value.galeri)
  newGaleri.splice(index, 1)
  form.value.galeri = newGaleri
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
    nama_fasilitas: item.nama_fasilitas,
    kategori: item.kategori || '',
    deskripsi: item.deskripsi || '',
    jumlah: item.jumlah || 1,
    kondisi: item.kondisi,
    gambar: null,
    gambar_url: item.gambar_url || '', // ✅ Gunakan gambar_url dari backend
    galeri: [],
    keterangan_galeri: [],
  }
  existingGaleri.value = item.galeri_fasilitas || []
  imagePreview.value = ''
  galeriPreviews.value = []
  showModal.value = true
}

const openDetailModal = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    nama_fasilitas: '',
    kategori: '',
    deskripsi: '',
    jumlah: 1,
    kondisi: '',
    gambar: null,
    gambar_url: '',
    galeri: [],
    keterangan_galeri: [],
  }
  imagePreview.value = ''
  galeriPreviews.value = []
  existingGaleri.value = []
  errors.value = {}
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    let response
    if (isEdit.value) {
      response = await fasilitasService.update(form.value.id, form.value)
    } else {
      response = await fasilitasService.create(form.value)
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
    const response = await fasilitasService.delete(itemToDelete.value.id)

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

const confirmDeleteGaleri = (galeri) => {
  galeriToDelete.value = galeri
  if (confirm('Hapus foto ini dari galeri?')) {
    deleteGaleri()
  }
}

const deleteGaleri = async () => {
  try {
    const response = await fasilitasService.deleteGaleri(galeriToDelete.value.id)

    if (response.data.success) {
      showToast(response.data.message, 'success')
      // Remove from existing galeri
      existingGaleri.value = existingGaleri.value.filter((g) => g.id !== galeriToDelete.value.id)
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus foto galeri', 'error')
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const getImageUrl = (filename) => {
  // Tidak perlu lagi, backend sudah kirim gambar_url
  return filename
}

const getGaleriUrl = (filename) => {
  return filename
}

const getKondisiClass = (kondisi) => {
  const classes = {
    Baik: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    'Rusak Ringan':
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
    'Rusak Berat':
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
  }
  return (
    classes[kondisi] ||
    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  )
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
