<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Kelola Kontak</h1>
      <p class="text-gray-600 mt-1">Kelola pesan kontak dari pengunjung website</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-blue-600 text-sm font-medium">Total Kontak</div>
        <div class="text-2xl font-bold text-blue-900 mt-1">{{ statistics.total }}</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-4">
        <div class="text-yellow-600 text-sm font-medium">Baru</div>
        <div class="text-2xl font-bold text-yellow-900 mt-1">{{ statistics.baru }}</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <div class="text-green-600 text-sm font-medium">Dibaca</div>
        <div class="text-2xl font-bold text-green-900 mt-1">{{ statistics.dibaca }}</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="text-purple-600 text-sm font-medium">Dibalas</div>
        <div class="text-2xl font-bold text-purple-900 mt-1">{{ statistics.dibalas }}</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama, email, subjek, atau pesan..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        />
      </div>
      <div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadKontaks"
        >
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="dibaca">Dibaca</option>
          <option value="dibalas">Dibalas</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama & Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subjek
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="px-6 py-4">
                <div class="text-gray-500">Memuat data...</div>
              </td>
            </tr>
            <tr v-else-if="kontaks.length === 0" class="text-center">
              <td colspan="5" class="px-6 py-4">
                <div class="text-gray-500">Tidak ada data kontak</div>
              </td>
            </tr>
            <tr v-else v-for="kontak in kontaks" :key="kontak.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ kontak.nama }}</div>
                <div class="text-sm text-gray-500">{{ kontak.email }}</div>
                <div v-if="kontak.no_telepon" class="text-sm text-gray-500">
                  {{ kontak.no_telepon }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ kontak.subjek }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(kontak.status)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ kontak.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(kontak.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-2">
                <button @click="viewDetail(kontak)" class="text-blue-600 hover:text-blue-900">
                  Lihat
                </button>
                <button @click="editKontak(kontak)" class="text-yellow-600 hover:text-yellow-900">
                  Edit
                </button>
                <button @click="deleteKontak(kontak.id)" class="text-red-600 hover:text-red-900">
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
        class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200"
      >
        <div class="text-sm text-gray-700">
          Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }} data
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Prev
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 border border-gray-300 rounded-md text-sm font-medium',
              page === pagination.current_page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Detail Kontak</h3>
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

        <div v-if="selectedKontak" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Nama</label>
            <p class="mt-1 text-gray-900">{{ selectedKontak.nama }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-gray-900">{{ selectedKontak.email }}</p>
          </div>
          <div v-if="selectedKontak.no_telepon">
            <label class="text-sm font-medium text-gray-700">No. Telepon</label>
            <p class="mt-1 text-gray-900">{{ selectedKontak.no_telepon }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Subjek</label>
            <p class="mt-1 text-gray-900">{{ selectedKontak.subjek }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Pesan</label>
            <p class="mt-1 text-gray-900 whitespace-pre-wrap">{{ selectedKontak.pesan }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1">
              <span
                :class="getStatusClass(selectedKontak.status)"
                class="px-2 py-1 text-xs font-semibold rounded-full"
              >
                {{ selectedKontak.status }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Tanggal Dikirim</label>
            <p class="mt-1 text-gray-900">{{ formatDate(selectedKontak.created_at) }}</p>
          </div>
        </div>

        <div class="mt-6 flex gap-2 justify-end">
          <button
            v-if="selectedKontak.status === 'baru'"
            @click="markAsRead(selectedKontak.id)"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Tandai Dibaca
          </button>
          <button
            v-if="selectedKontak.status !== 'dibalas'"
            @click="markAsReplied(selectedKontak.id)"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Tandai Dibalas
          </button>
          <button
            @click="closeDetail"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Edit Kontak</h3>
          <button @click="closeEdit" class="text-gray-400 hover:text-gray-600">
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

        <form @submit.prevent="updateKontak" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
            <input
              v-model="editForm.nama"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="editForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
            <input
              v-model="editForm.no_telepon"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subjek *</label>
            <input
              v-model="editForm.subjek"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pesan *</label>
            <textarea
              v-model="editForm.pesan"
              required
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="editForm.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="baru">Baru</option>
              <option value="dibaca">Dibaca</option>
              <option value="dibalas">Dibalas</option>
            </select>
          </div>

          <div class="flex gap-2 justify-end">
            <button
              type="button"
              @click="closeEdit"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import kontakService from '@/api/kontak.js'

// State
const kontaks = ref([])
const statistics = ref({
  total: 0,
  baru: 0,
  dibaca: 0,
  consbalas: 0,
})

const loading = ref(false)
const submitting = ref(false)
const search = ref('')
const statusFilter = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

// Modals
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedKontak = ref(null)
const editForm = ref({
  id: null,
  nama: '',
  email: '',
  no_telepon: '',
  subjek: '',
  pesan: '',
  status: 'baru',
})

// Search debounce
let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadKontaks()
  }, 500)
}

// Computed
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

// Methods
const loadKontaks = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: pagination.value.per_page,
      search: search.value,
      status: statusFilter.value,
    }

    const response = await kontakService.getAll(params)

    if (response.data.success) {
      kontaks.value = response.data.data.data
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
    console.error('Error loading kontaks:', error)
    alert('Gagal memuat data kontak: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const response = await kontakService.getStatistics()
    console.log('Statistics response:', response)

    if (response.data && response.data.success) {
      statistics.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
    console.error('Error details:', error.response)
    // Jangan tampilkan alert untuk statistics error, cukup log saja
    // Set default values jika gagal
    statistics.value = {
      total: 0,
      baru: 0,
      dibaca: 0,
      dibalas: 0,
    }
  }
}

const viewDetail = async (kontak) => {
  selectedKontak.value = kontak
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedKontak.value = null
}

const editKontak = (kontak) => {
  editForm.value = {
    id: kontak.id,
    nama: kontak.nama,
    email: kontak.email,
    no_telepon: kontak.no_telepon || '',
    subjek: kontak.subjek,
    pesan: kontak.pesan,
    status: kontak.status,
  }
  showEditModal.value = true
}

const closeEdit = () => {
  showEditModal.value = false
  editForm.value = {
    id: null,
    nama: '',
    email: '',
    no_telepon: '',
    subjek: '',
    pesan: '',
    status: 'baru',
  }
}

const updateKontak = async () => {
  try {
    submitting.value = true
    const response = await kontakService.update(editForm.value.id, editForm.value)

    if (response.data.success) {
      alert('✅ Kontak berhasil diperbarui')
      closeEdit()
      await loadKontaks(pagination.value.current_page)
      await loadStatistics()
    }
  } catch (error) {
    console.error('Error updating kontak:', error)
    alert('❌ ' + (error.response?.data?.message || 'Gagal memperbarui kontak'))
  } finally {
    submitting.value = false
  }
}

const deleteKontak = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
    return
  }

  try {
    const response = await kontakService.delete(id)

    if (response.data.success) {
      // Hapus dari array lokal untuk update UI langsung
      kontaks.value = kontaks.value.filter((k) => k.id !== id)

      // Update pagination total
      pagination.value.total = pagination.value.total - 1

      // Tampilkan notifikasi sukses
      alert('✅ Kontak berhasil dihapus!')

      // Reload data untuk sinkronisasi
      await loadStatistics()

      // Jika halaman current jadi kosong dan bukan halaman pertama, pindah ke halaman sebelumnya
      if (kontaks.value.length === 0 && pagination.value.current_page > 1) {
        loadKontaks(pagination.value.current_page - 1)
      } else {
        loadKontaks(pagination.value.current_page)
      }
    }
  } catch (error) {
    console.error('Error deleting kontak:', error)
    const errorMsg = error.response?.data?.message || error.message || 'Gagal menghapus kontak'
    alert('❌ ' + errorMsg)
  }
}

const markAsRead = async (id) => {
  try {
    const response = await kontakService.markAsRead(id)

    if (response.data.success) {
      alert('✅ Kontak ditandai sebagai dibaca')
      closeDetail()
      await loadKontaks(pagination.value.current_page)
      await loadStatistics()
    }
  } catch (error) {
    console.error('Error marking as read:', error)
    alert('❌ Gagal menandai kontak sebagai dibaca')
  }
}

const markAsReplied = async (id) => {
  try {
    const response = await kontakService.markAsReplied(id)

    if (response.data.success) {
      alert('✅ Kontak ditandai sebagai dibalas')
      closeDetail()
      await loadKontaks(pagination.value.current_page)
      await loadStatistics()
    }
  } catch (error) {
    console.error('Error marking as replied:', error)
    alert('❌ Gagal menandai kontak sebagai dibalas')
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadKontaks(page)
  }
}

const getStatusClass = (status) => {
  const classes = {
    baru: 'bg-yellow-100 text-yellow-800',
    dibaca: 'bg-green-100 text-green-800',
    dibalas: 'bg-purple-100 text-purple-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Lifecycle
onMounted(() => {
  loadKontaks()
  loadStatistics()
})
</script>
