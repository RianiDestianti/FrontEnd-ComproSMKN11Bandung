<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kelola Prestasi</h1>
        <p class="text-gray-600 mt-1">Kelola data prestasi siswa</p>
      </div>
      <button
        @click="openCreateModal"
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
        Tambah Prestasi
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-blue-600 text-sm font-medium">Total</div>
        <div class="text-2xl font-bold text-blue-900 mt-1">{{ statistics.total }}</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <div class="text-green-600 text-sm font-medium">Published</div>
        <div class="text-2xl font-bold text-green-900 mt-1">{{ statistics.published }}</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-4">
        <div class="text-yellow-600 text-sm font-medium">Draft</div>
        <div class="text-2xl font-bold text-yellow-900 mt-1">{{ statistics.draft }}</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="text-purple-600 text-sm font-medium">Nasional</div>
        <div class="text-2xl font-bold text-purple-900 mt-1">
          {{ statistics.by_tingkat?.nasional || 0 }}
        </div>
      </div>
      <div class="bg-red-50 rounded-lg p-4">
        <div class="text-red-600 text-sm font-medium">Internasional</div>
        <div class="text-2xl font-bold text-red-900 mt-1">
          {{ statistics.by_tingkat?.internasional || 0 }}
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Cari judul, nama siswa, pembimbing..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        />
      </div>
      <select
        v-model="kategoriFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        @change="loadPrestasi"
      >
        <option value="">Semua Kategori</option>
        <option value="akademik">Akademik</option>
        <option value="non-akademik">Non-Akademik</option>
        <option value="olahraga">Olahraga</option>
        <option value="seni">Seni</option>
        <option value="lainnya">Lainnya</option>
      </select>
      <select
        v-model="tingkatFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        @change="loadPrestasi"
      >
        <option value="">Semua Tingkat</option>
        <option value="sekolah">Sekolah</option>
        <option value="kecamatan">Kecamatan</option>
        <option value="kota">Kota</option>
        <option value="provinsi">Provinsi</option>
        <option value="nasional">Nasional</option>
        <option value="internasional">Internasional</option>
      </select>
      <select
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        @change="loadPrestasi"
      >
        <option value="">Semua Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>

    <!-- Table -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prestasi
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kategori
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tingkat
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="8" class="px-6 py-4">
                <div class="text-gray-500">Memuat data...</div>
              </td>
            </tr>
            <tr v-else-if="prestasi.length === 0" class="text-center">
              <td colspan="8" class="px-6 py-4">
                <div class="text-gray-500">Tidak ada data prestasi</div>
              </td>
            </tr>
            <tr v-else v-for="item in prestasi" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <img
                  v-if="item.foto"
                  :src="getImageUrl(item.foto)"
                  alt="Foto"
                  class="w-16 h-16 object-cover rounded"
                />
                <div v-else class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span class="text-gray-400 text-xs">No Image</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ item.judul }}</div>
                <div class="text-sm text-gray-500">{{ item.peringkat }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ item.nama_siswa }}</div>
                <div class="text-sm text-gray-500">{{ item.kelas }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getKategoriClass(item.kategori)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ item.kategori }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getTingkatClass(item.tingkat)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ item.tingkat }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(item.tanggal_prestasi) }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(item.status)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-2">
                <button @click="viewDetail(item)" class="text-blue-600 hover:text-blue-900">
                  Lihat
                </button>
                <button @click="editPrestasi(item)" class="text-yellow-600 hover:text-yellow-900">
                  Edit
                </button>
                <button @click="deletePrestasi(item.id)" class="text-red-600 hover:text-red-900">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.total > 0"
        class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t"
      >
        <div class="text-sm text-gray-700">
          Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }}
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Prev
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 border rounded-md text-sm',
              page === pagination.current_page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white mb-10"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">{{ isEdit ? 'Edit Prestasi' : 'Tambah Prestasi' }}</h3>
          <button @click="closeFormModal" class="text-gray-400 hover:text-gray-600">
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
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Prestasi *</label>
              <input
                v-model="form.judul"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                v-model="form.kategori"
                required
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori</option>
                <option value="akademik">Akademik</option>
                <option value="non-akademik">Non-Akademik</option>
                <option value="olahraga">Olahraga</option>
                <option value="seni">Seni</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tingkat *</label>
              <select
                v-model="form.tingkat"
                required
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Tingkat</option>
                <option value="sekolah">Sekolah</option>
                <option value="kecamatan">Kecamatan</option>
                <option value="kota">Kota</option>
                <option value="provinsi">Provinsi</option>
                <option value="nasional">Nasional</option>
                <option value="internasional">Internasional</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peringkat</label>
              <input
                v-model="form.peringkat"
                type="text"
                placeholder="Juara 1, 2, 3..."
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Prestasi *</label>
              <input
                v-model="form.tanggal_prestasi"
                type="date"
                required
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Siswa *</label>
              <input
                v-model="form.nama_siswa"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <input
                v-model="form.kelas"
                type="text"
                placeholder="XII IPA 1"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pembimbing</label>
              <input
                v-model="form.pembimbing"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Penyelenggara</label>
              <input
                v-model="form.penyelenggara"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                v-model="form.deskripsi"
                rows="3"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Foto/Sertifikat</label>
              <input
                @change="handleFileChange"
                type="file"
                accept="image/*"
                class="w-full px-3 py-2 border rounded-md"
              />
              <p class="text-xs text-gray-500 mt-1">Max 2MB (JPG, PNG)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                v-model="form.status"
                required
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div class="flex gap-2 justify-end pt-4">
            <button
              type="button"
              @click="closeFormModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Detail Prestasi</h3>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
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

        <div v-if="selectedPrestasi" class="space-y-4">
          <div v-if="selectedPrestasi.foto">
            <img
              :src="getImageUrl(selectedPrestasi.foto)"
              alt="Foto"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Judul</label>
              <p class="text-gray-900">{{ selectedPrestasi.judul }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Peringkat</label>
              <p class="text-gray-900">{{ selectedPrestasi.peringkat || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Kategori</label>
              <p>
                <span
                  :class="getKategoriClass(selectedPrestasi.kategori)"
                  class="px-2 py-1 text-xs rounded-full"
                  >{{ selectedPrestasi.kategori }}</span
                >
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tingkat</label>
              <p>
                <span
                  :class="getTingkatClass(selectedPrestasi.tingkat)"
                  class="px-2 py-1 text-xs rounded-full"
                  >{{ selectedPrestasi.tingkat }}</span
                >
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Nama Siswa</label>
              <p class="text-gray-900">{{ selectedPrestasi.nama_siswa }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Kelas</label>
              <p class="text-gray-900">{{ selectedPrestasi.kelas || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Pembimbing</label>
              <p class="text-gray-900">{{ selectedPrestasi.pembimbing || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Penyelenggara</label>
              <p class="text-gray-900">{{ selectedPrestasi.penyelenggara || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tanggal</label>
              <p class="text-gray-900">{{ formatDate(selectedPrestasi.tanggal_prestasi) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <p>
                <span
                  :class="getStatusClass(selectedPrestasi.status)"
                  class="px-2 py-1 text-xs rounded-full"
                  >{{ selectedPrestasi.status }}</span
                >
              </p>
            </div>
          </div>

          <div v-if="selectedPrestasi.deskripsi">
            <label class="text-sm font-medium text-gray-700">Deskripsi</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ selectedPrestasi.deskripsi }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="closeDetail"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Tutup
          </button>
        </div>
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import prestasiService from '@/api/prestasi.js'

const prestasi = ref([])
const statistics = ref({
  total: 0,
  published: 0,
  draft: 0,
  by_kategori: {},
  by_tingkat: {},
})
const loading = ref(false)
const submitting = ref(false)
const search = ref('')
const kategoriFilter = ref('')
const tingkatFilter = ref('')
const statusFilter = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

const showFormModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const selectedPrestasi = ref(null)
const form = ref({
  id: null,
  judul: '',
  kategori: '',
  tingkat: '',
  peringkat: '',
  nama_siswa: '',
  kelas: '',
  pembimbing: '',
  penyelenggara: '',
  tanggal_prestasi: '',
  deskripsi: '',
  foto: null,
  status: 'draft',
})

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadPrestasi()
  }, 500)
}

const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const loadPrestasi = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: pagination.value.per_page,
      search: search.value,
      kategori: kategoriFilter.value,
      tingkat: tingkatFilter.value,
      status: statusFilter.value,
    }

    const response = await prestasiService.getAll(params)

    if (response.data.success) {
      prestasi.value = response.data.data.data
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
    console.error('Error loading prestasi:', error)
    showToast('Gagal memuat data prestasi', 'error')
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const response = await prestasiService.getStatistics()
    console.log('Statistics response:', response.data)

    if (response.data && response.data.success) {
      statistics.value = response.data.data
      console.log('Statistics loaded:', statistics.value)
    } else {
      console.warn('Statistics response not successful:', response.data)
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)

    // Set default values
    statistics.value = {
      total: 0,
      published: 0,
      draft: 0,
      by_kategori: {},
      by_tingkat: {},
    }
  }
}

const openCreateModal = () => {
  isEdit.value = false
  resetForm()
  showFormModal.value = true
}

const editPrestasi = (item) => {
  isEdit.value = true
  form.value = {
    id: item.id,
    judul: item.judul,
    kategori: item.kategori,
    tingkat: item.tingkat,
    peringkat: item.peringkat || '',
    nama_siswa: item.nama_siswa,
    kelas: item.kelas || '',
    pembimbing: item.pembimbing || '',
    penyelenggara: item.penyelenggara || '',
    tanggal_prestasi: item.tanggal_prestasi ? item.tanggal_prestasi.substring(0, 10) : '',
    deskripsi: item.deskripsi || '',
    foto: null,
    status: item.status,
  }
  showFormModal.value = true
}

const viewDetail = (item) => {
  selectedPrestasi.value = item
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedPrestasi.value = null
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

const handleFileChange = (e) => {
  form.value.foto = e.target.files[0]
}

const submitForm = async () => {
  try {
    submitting.value = true

    if (isEdit.value) {
      const response = await prestasiService.update(form.value.id, form.value)
      if (response.data.success) {
        showToast('Prestasi berhasil diperbarui', 'success')
        closeFormModal()
        await loadPrestasi(pagination.value.current_page)
        await loadStatistics()
      }
    } else {
      const response = await prestasiService.create(form.value)
      if (response.data.success) {
        showToast('Prestasi berhasil ditambahkan', 'success')
        closeFormModal()
        await loadPrestasi(1)
        await loadStatistics()
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    showToast(error.response?.data?.message || 'Gagal menyimpan data', 'error')
  } finally {
    submitting.value = false
  }
}

const deletePrestasi = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return

  try {
    const response = await prestasiService.delete(id)
    if (response.data.success) {
      prestasi.value = prestasi.value.filter((p) => p.id !== id)
      pagination.value.total = pagination.value.total - 1
      showToast('Prestasi berhasil dihapus', 'success')
      await loadStatistics()
      if (prestasi.value.length === 0 && pagination.value.current_page > 1) {
        loadPrestasi(pagination.value.current_page - 1)
      }
    }
  } catch (error) {
    console.error('Error deleting prestasi:', error)
    showToast('Gagal menghapus prestasi', 'error')
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadPrestasi(page)
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    judul: '',
    kategori: '',
    tingkat: '',
    peringkat: '',
    nama_siswa: '',
    kelas: '',
    pembimbing: '',
    penyelenggara: '',
    tanggal_prestasi: '',
    deskripsi: '',
    foto: null,
    status: 'draft',
  }
}

const getImageUrl = (path) => {
  return `${import.meta.env.VITE_API_URL.replace('/api', '')}/storage/${path}`
}

const getKategoriClass = (kategori) => {
  const classes = {
    akademik: 'bg-blue-100 text-blue-800',
    'non-akademik': 'bg-green-100 text-green-800',
    olahraga: 'bg-yellow-100 text-yellow-800',
    seni: 'bg-purple-100 text-purple-800',
    lainnya: 'bg-gray-100 text-gray-800',
  }
  return classes[kategori] || 'bg-gray-100 text-gray-800'
}

const getTingkatClass = (tingkat) => {
  const classes = {
    sekolah: 'bg-gray-100 text-gray-800',
    kecamatan: 'bg-blue-100 text-blue-800',
    kota: 'bg-green-100 text-green-800',
    provinsi: 'bg-yellow-100 text-yellow-800',
    nasional: 'bg-purple-100 text-purple-800',
    internasional: 'bg-red-100 text-red-800',
  }
  return classes[tingkat] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

onMounted(() => {
  loadPrestasi()
  loadStatistics()
})
</script>
