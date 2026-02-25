<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-16 relative overflow-hidden"
    >
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">🎨 Pojok Siswa</h1>
          <p class="text-xl text-blue-100">
            Karya dan Kreativitas Siswa - Tempat Berbagi Inspirasi
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Filter Section -->
      <div class="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <!-- Search -->
          <div class="flex-1 w-full md:max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Cari judul atau konten..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-3 top-3"
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
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="filterKategori = ''"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                filterKategori === ''
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              Semua
            </button>
            <button
              v-for="kategori in categories"
              :key="kategori"
              @click="filterKategori = kategori"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                filterKategori === kategori
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ kategori }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Memuat konten...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="pojokSiswaList.length === 0" class="text-center py-20">
        <svg
          class="w-24 h-24 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Belum Ada Konten</h3>
        <p class="text-gray-500">Belum ada karya siswa yang dipublikasikan</p>
      </div>

      <!-- Content Grid -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <article
            v-for="item in pojokSiswaList"
            :key="item.id"
            @click="openDetail(item)"
            class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
          >
            <!-- Image -->
            <div
              class="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden"
            >
              <img
                v-if="item.gambar"
                :src="getImageUrl(item.gambar)"
                :alt="item.judul"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg
                  class="w-20 h-20 text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <!-- Category Badge -->
              <div class="absolute top-3 right-3">
                <span
                  :class="getCategoryColor(item.kategori)"
                  class="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                >
                  {{ item.kategori }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <h3
                class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
              >
                {{ item.judul }}
              </h3>

              <p
                class="text-gray-600 text-sm mb-4 line-clamp-3"
                v-html="stripHtmlTags(item.konten)"
              ></p>

              <!-- Meta Info -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                  >
                    {{ getInitials(item.siswa?.nama || 'AN') }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ item.siswa?.nama || 'Anonim' }}
                    </p>
                    <p class="text-xs text-gray-500">{{ formatDate(item.created_at) }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-1 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span class="text-xs">{{ item.views || 0 }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="flex justify-center items-center gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Sebelumnya
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'w-10 h-10 rounded-lg font-medium transition-all',
                page === pagination.current_page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDetailModal && selectedItem"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeDetail"
        >
          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

            <!-- Modal -->
            <div
              class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <!-- Header with Image -->
              <div class="relative h-64 bg-gradient-to-br from-blue-500 to-indigo-600">
                <img
                  v-if="selectedItem.gambar"
                  :src="getImageUrl(selectedItem.gambar)"
                  :alt="selectedItem.judul"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <!-- Close Button -->
                <button
                  @click="closeDetail"
                  class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg"
                >
                  <svg
                    class="w-6 h-6 text-gray-700"
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
                </button>

                <!-- Category Badge -->
                <div class="absolute top-4 left-4">
                  <span
                    :class="getCategoryColor(selectedItem.kategori)"
                    class="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
                  >
                    {{ selectedItem.kategori }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="overflow-y-auto max-h-[calc(90vh-16rem)] p-8">
                <!-- Title -->
                <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ selectedItem.judul }}</h2>

                <!-- Meta -->
                <div class="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold"
                    >
                      {{ getInitials(selectedItem.siswa?.nama || 'AN') }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">
                        {{ selectedItem.siswa?.nama || 'Anonim' }}
                      </p>
                      <p class="text-sm text-gray-500">{{ formatDate(selectedItem.created_at) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-gray-600">
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
                    <span class="font-medium">{{ selectedItem.views || 0 }} views</span>
                  </div>
                </div>

                <!-- Article Content -->
                <div class="prose prose-lg max-w-none">
                  <div
                    class="text-gray-700 leading-relaxed article-content"
                    v-html="selectedItem.konten"
                  ></div>
                </div>

                <!-- Bagian Komentar -->
                <div class="border-t border-gray-200 pt-6 mt-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">
                    Komentar ({{ komentarList.length }})
                  </h3>

                  <!-- Form Komentar -->
                  <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <div class="mb-3">
                      <input
                        v-model="komentarForm.nama"
                        type="text"
                        placeholder="Nama Anda (opsional, kosongkan untuk anonim)"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div class="mb-3">
                      <textarea
                        v-model="komentarForm.isi"
                        placeholder="Tulis komentar Anda..."
                        rows="3"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    <button
                      @click="submitKomentar"
                      :disabled="!komentarForm.isi.trim() || submittingKomentar"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {{ submittingKomentar ? 'Mengirim...' : 'Kirim Komentar' }}
                    </button>
                  </div>

                  <!-- Daftar Komentar -->
                  <div class="space-y-4">
                    <div v-if="loadingKomentar" class="text-center py-8 text-gray-500">
                      Memuat komentar...
                    </div>
                    <div
                      v-else-if="komentarList.length === 0"
                      class="text-center py-8 text-gray-500"
                    >
                      Belum ada komentar. Jadilah yang pertama berkomentar!
                    </div>
                    <div
                      v-else
                      v-for="komentar in komentarList"
                      :key="komentar.id"
                      class="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                        >
                          {{ getInitials(komentar.siswa?.nama || komentar.nama_komentar || 'AN') }}
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-1">
                            <p class="font-semibold text-gray-900">
                              {{ komentar.siswa?.nama || komentar.nama_komentar || 'Anonim' }}
                            </p>
                            <span class="text-xs text-gray-500">
                              {{ formatDate(komentar.created_at) }}
                            </span>
                          </div>
                          <p class="text-gray-700 text-sm whitespace-pre-wrap">
                            {{ komentar.isi_komentar }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- File Attachment -->
                <div
                  v-if="selectedItem.file_attachment"
                  class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <svg
                      class="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-900">File Lampiran</p>
                      <p class="text-sm text-gray-600">
                        {{ getFileName(selectedItem.file_attachment) }}
                      </p>
                    </div>
                    <a
                      :href="getFileUrl(selectedItem.file_attachment)"
                      target="_blank"
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import pojokSiswa from '@/api/pojokSiswa' // Sesuaikan dengan path API service Anda

// State
const pojokSiswaList = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterKategori = ref('')
const selectedItem = ref(null)
const showDetailModal = ref(false)

const categories = ['Artikel', 'Puisi', 'Cerpen', 'Karya Seni', 'Video']

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 9,
  total: 0,
  from: 0,
  to: 0,
})

const komentarList = ref([])
const loadingKomentar = ref(false)
const submittingKomentar = ref(false)
const komentarForm = ref({
  nama: '',
  isi: '',
})

// Computed
const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2
  const pages = []

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    pages.push(i)
  }

  if (current - delta > 2) pages.unshift('...')
  if (current + delta < last - 1) pages.push('...')

  pages.unshift(1)
  if (last !== 1) pages.push(last)

  return pages.filter((page, index, self) => self.indexOf(page) === index)
})

// Methods
const loadPojokSiswa = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      status: 'published', // Hanya tampilkan yang published
      search: searchQuery.value,
      kategori: filterKategori.value,
    }

    const response = await pojokSiswa.getAllPublic(params)

    if (response.data.success) {
      pojokSiswaList.value = response.data.data.data
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
    console.error('Error loading pojok siswa:', err)
  } finally {
    loading.value = false
  }
}

const openDetail = async (item) => {
  selectedItem.value = item
  showDetailModal.value = true

  // Increment views
  try {
    await pojokSiswa.incrementViewsPublic(item.id)
    const index = pojokSiswaList.value.findIndex((p) => p.id === item.id)
    if (index !== -1) {
      pojokSiswaList.value[index].views = (pojokSiswaList.value[index].views || 0) + 1
    }
  } catch (err) {
    console.error('Error incrementing views:', err)
  }

  // Load komentar
  loadKomentar(item.id)
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedItem.value = null
  komentarList.value = []
  komentarForm.value.nama = ''
  komentarForm.value.isi = ''
}

const changePage = (page) => {
  if (page === '...' || page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  loadPojokSiswa()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadKomentar = async (pojokSiswaId) => {
  try {
    loadingKomentar.value = true
    const response = await pojokSiswa.getKomentarPublic(pojokSiswaId)
    if (response.data.success) {
      komentarList.value = response.data.data
    }
  } catch (err) {
    console.error('Error loading komentar:', err)
  } finally {
    loadingKomentar.value = false
  }
}

const submitKomentar = async () => {
  if (!komentarForm.value.isi.trim()) return

  try {
    submittingKomentar.value = true
    const data = {
      nama_komentar: komentarForm.value.nama.trim() || null,
      isi_komentar: komentarForm.value.isi.trim(),
    }

    const response = await pojokSiswa.addKomentarPublic(selectedItem.value.id, data)

    if (response.data.success) {
      // Reset form
      komentarForm.value.nama = ''
      komentarForm.value.isi = ''

      // Reload komentar
      await loadKomentar(selectedItem.value.id)

      // Optional: Tampilkan notifikasi sukses
      alert('Komentar berhasil ditambahkan!')
    }
  } catch (err) {
    console.error('Error submitting komentar:', err)
    alert('Gagal mengirim komentar. Silakan coba lagi.')
  } finally {
    submittingKomentar.value = false
  }
}

// Debounce search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.current_page = 1
    loadPojokSiswa()
  }, 500)
}

watch(filterKategori, () => {
  pagination.value.current_page = 1
  loadPojokSiswa()
})

// Helper functions
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${path}`
}

const getFileUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${path}`
}

const getFileName = (path) => {
  if (!path) return ''
  return path.split('/').pop()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const getInitials = (name) => {
  if (!name) return 'AN'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const getCategoryColor = (kategori) => {
  const colors = {
    Artikel: 'bg-blue-500 text-white',
    Puisi: 'bg-purple-500 text-white',
    Cerpen: 'bg-green-500 text-white',
    'Karya Seni': 'bg-pink-500 text-white',
    Video: 'bg-red-500 text-white',
  }
  return colors[kategori] || 'bg-gray-500 text-white'
}

const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Lifecycle
onMounted(() => {
  loadPojokSiswa()
})
</script>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}

/* Line Clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Prose Styling for Article Content */
.article-content {
  line-height: 1.8;
}

.article-content p {
  margin-bottom: 1em;
}

.article-content div {
  margin-bottom: 0.5em;
}

.article-content br {
  display: block;
  content: '';
  margin-top: 0.5em;
}

.article-content h1,
.article-content h2,
.article-content h3 {
  font-weight: bold;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.article-content ul,
.article-content ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.article-content li {
  margin-bottom: 0.5em;
}
</style>
