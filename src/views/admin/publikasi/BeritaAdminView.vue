<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
        <p class="text-gray-600 mt-1">Kelola berita dan artikel sekolah</p>
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
        Tambah Berita
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Cari berdasarkan judul, ringkasan, atau penulis..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
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
        v-model="filterStatus"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
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
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Penulis
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Views
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
            <tr v-for="berita in beritaList" :key="berita.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="berita.gambar_utama_url || '/default-news.jpg'"
                  :alt="berita.judul"
                  class="h-16 w-24 object-cover rounded"
                />
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ berita.judul }}</div>
                <div class="text-sm text-gray-500 line-clamp-2">{{ berita.ringkasan }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ berita.kategori_berita?.nama_kategori || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ berita.penulis || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ berita.views || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(berita.status)"
                >
                  {{ berita.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="openModal('detail', berita)"
                  class="text-green-600 hover:text-green-900 transition-colors"
                >
                  Detail
                </button>
                <button
                  @click="openModal('edit', berita)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(berita)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="beritaList.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Belum ada data berita</td>
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
              {{ modalMode === 'create' ? 'Tambah Berita Baru' : 'Edit Berita' }}
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
            <!-- Field Judul -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Berita *</label>
              <input
                v-model="form.judul"
                @input="generateSlug"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan judul berita..."
                required
              />
            </div>

            <!-- Field Slug -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                readonly
              />
            </div>

            <!-- Field Kategori dan Penulis (Grid 2 kolom) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  v-model="form.kategori_berita_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  <option v-for="kat in kategoriList" :key="kat.id" :value="kat.id">
                    {{ kat.nama_kategori }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                <input
                  v-model="form.penulis"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama penulis"
                />
              </div>
            </div>

            <!-- Field Ringkasan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
              <textarea
                v-model="form.ringkasan"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ringkasan singkat berita..."
              ></textarea>
            </div>

            <!-- Field Konten Berita -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Konten Berita *</label>
              <div
                ref="editorContainer"
                class="quill-editor border border-gray-300 rounded-lg bg-white"
              ></div>
              <input type="hidden" v-model="form.konten" required />
              <p class="text-xs text-gray-500 mt-1">Gunakan toolbar untuk memformat teks</p>
            </div>

            <!-- Field Gambar Utama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Utama</label>
              <input
                @change="handleGambarChange"
                type="file"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, WEBP. Maks 2MB</p>
            </div>

            <!-- Field Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                v-model="form.tags"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <!-- Field Status dan Tanggal Publikasi (Grid 2 kolom) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tanggal Publikasi</label
                >
                <input
                  v-model="form.published_at"
                  type="datetime-local"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {{ errorMessage }}
            </div>

            <!-- Button Actions -->
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
            <h2 class="text-xl font-bold text-gray-900">Detail Berita</h2>
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

          <div v-if="selectedBerita" class="space-y-4">
            <img
              v-if="selectedBerita.gambar_utama_url"
              :src="selectedBerita.gambar_utama_url"
              :alt="selectedBerita.judul"
              class="w-full h-64 object-cover rounded-lg"
            />

            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedBerita.judul }}</h3>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{{ selectedBerita.kategori_berita?.nama_kategori || 'Tanpa Kategori' }}</span>
                <span>•</span>
                <span>{{ selectedBerita.penulis || 'Anonim' }}</span>
                <span>•</span>
                <span>{{ selectedBerita.views || 0 }} views</span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <p class="text-gray-600 italic">{{ selectedBerita.ringkasan }}</p>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <div class="prose max-w-none" v-html="selectedBerita.konten"></div>
            </div>

            <div v-if="selectedBerita.tags" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in selectedBerita.tags.split(',')"
                :key="index"
                class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {{ tag.trim() }}
              </span>
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
          Apakah Anda yakin ingin menghapus berita <strong>{{ deleteTarget?.judul }}</strong
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
            @click="deleteBerita"
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
import beritaApi from '@/api/berita'
import apiClient from '@/api/axios'

// Load Quill from CDN
let Quill = null
let quillEditor = null

const loadQuill = () => {
  return new Promise((resolve, reject) => {
    if (window.Quill) {
      Quill = window.Quill
      resolve()
      return
    }

    // Load CSS
    const link = document.createElement('link')
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Load JS
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
const beritaList = ref([])
const kategoriList = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const isSubmitting = ref(false)
const errorMessage = ref('')
const deleteTarget = ref(null)
const selectedBerita = ref(null)
const searchQuery = ref('')
const filterKategori = ref('')
const filterStatus = ref('')

const form = ref({
  kategori_berita_id: '',
  judul: '',
  slug: '',
  ringkasan: '',
  konten: '',
  gambar_utama: null,
  penulis: '',
  tags: '',
  status: 'draft',
  published_at: '',
})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(async () => {
  await loadQuill()
  fetchBerita()
  fetchFormData()
})

const fetchBerita = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterKategori.value) params.kategori_berita_id = filterKategori.value
    if (filterStatus.value) params.status = filterStatus.value
    if (searchQuery.value) params.search = searchQuery.value

    const response = await beritaApi.getAll(params)
    beritaList.value = response.data.data
  } catch (error) {
    showToast('Gagal memuat data berita', 'error')
    console.error('Error fetching berita:', error)
  } finally {
    loading.value = false
  }
}

const fetchFormData = async () => {
  try {
    // Coba ambil dari endpoint kategori-berita
    const response = await apiClient.get('/kategori-berita')

    console.log('Full response:', response)
    console.log('Response data:', response.data)

    // Cek berbagai kemungkinan struktur response
    if (response.data) {
      // Kemungkinan 1: { success: true, data: [...] }
      if (response.data.success && response.data.data) {
        kategoriList.value = response.data.data
        console.log('Kategori loaded (success + data):', kategoriList.value)
      }
      // Kemungkinan 2: { data: [...] }
      else if (response.data.data && Array.isArray(response.data.data)) {
        kategoriList.value = response.data.data
        console.log('Kategori loaded (data array):', kategoriList.value)
      }
      // Kemungkinan 3: langsung array [...]
      else if (Array.isArray(response.data)) {
        kategoriList.value = response.data
        console.log('Kategori loaded (direct array):', kategoriList.value)
      }
      // Jika tidak ada yang cocok, tampilkan structure
      else {
        console.error('Unknown response structure:', response.data)
        showToast('Format response kategori tidak dikenali', 'error')
      }
    }
  } catch (error) {
    console.error('Error fetching kategori:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)

    // Jika error 401 (unauthorized), coba endpoint lain
    if (error.response?.status === 401) {
      console.log('Trying alternative endpoint...')
      try {
        // Coba dengan beritaApi.getFormData() yang original
        const altResponse = await beritaApi.getFormData()
        console.log('Alternative response:', altResponse.data)

        if (altResponse.data.success && altResponse.data.data.kategori) {
          kategoriList.value = altResponse.data.data.kategori
          console.log('Kategori loaded from alternative:', kategoriList.value)
          return // Sukses, keluar dari fungsi
        }
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError)
      }
    }

    showToast('Gagal memuat kategori berita', 'error')
  }
}

const handleSearch = () => {
  fetchBerita()
}

const handleFilter = () => {
  fetchBerita()
}

const generateSlug = () => {
  if (form.value.judul) {
    form.value.slug = form.value.judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}

const handleGambarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.gambar_utama = file
  }
}

const openModal = async (mode, berita = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'detail' && berita) {
    selectedBerita.value = berita
  } else if (mode === 'edit' && berita) {
    // Format tanggal untuk datetime-local input (YYYY-MM-DDTHH:MM)
    let formattedDate = ''
    if (berita.published_at) {
      // Hapus detik dan konversi spasi menjadi 'T'
      formattedDate = berita.published_at.substring(0, 16).replace(' ', 'T')
    }

    form.value = {
      id: berita.id,
      kategori_berita_id: berita.kategori_berita_id || '',
      judul: berita.judul,
      slug: berita.slug,
      ringkasan: berita.ringkasan || '',
      konten: berita.konten,
      gambar_utama: null,
      penulis: berita.penulis || '',
      tags: berita.tags || '',
      status: berita.status,
      published_at: formattedDate,
    }
  } else {
    form.value = {
      kategori_berita_id: '',
      judul: '',
      slug: '',
      ringkasan: '',
      konten: '',
      gambar_utama: null,
      penulis: '',
      tags: '',
      status: 'draft',
      published_at: '',
    }
  }

  showModal.value = true

  // Initialize Quill editor after modal is shown
  if (mode !== 'detail') {
    await nextTick()
    initQuillEditor()
  }
}

const initQuillEditor = () => {
  if (!editorContainer.value || !Quill) return

  // Destroy existing editor if any
  if (quillEditor) {
    quillEditor = null
    editorContainer.value.innerHTML = ''
  }

  // Create new editor
  quillEditor = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
    placeholder: 'Tulis konten berita lengkap di sini...',
  })

  // Set initial content
  if (form.value.konten) {
    quillEditor.root.innerHTML = form.value.konten
  }

  // Update form when content changes
  quillEditor.on('text-change', () => {
    form.value.konten = quillEditor.root.innerHTML
  })
}

const closeModal = () => {
  showModal.value = false
  selectedBerita.value = null

  // Destroy Quill editor
  if (quillEditor) {
    quillEditor = null
    if (editorContainer.value) {
      editorContainer.value.innerHTML = ''
    }
  }

  form.value = {
    kategori_berita_id: '',
    judul: '',
    slug: '',
    ringkasan: '',
    konten: '',
    gambar_utama: null,
    penulis: '',
    tags: '',
    status: 'draft',
    published_at: '',
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (modalMode.value === 'create') {
      await beritaApi.create(form.value)
      showToast('Berita berhasil ditambahkan', 'success')
    } else {
      await beritaApi.update(form.value.id, form.value)
      showToast('Berita berhasil diupdate', 'success')
    }

    closeModal()
    fetchBerita()
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

const confirmDelete = (berita) => {
  deleteTarget.value = berita
  showDeleteModal.value = true
}

const deleteBerita = async () => {
  isSubmitting.value = true

  try {
    await beritaApi.delete(deleteTarget.value.id)
    showToast('Berita berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchBerita()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus berita', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
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
