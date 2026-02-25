<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Kelola Ekstrakurikuler</h1>
      <p class="text-gray-600 mt-1">Kelola data ekstrakurikuler sekolah</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-blue-600 text-sm font-medium">Total Ekstrakurikuler</div>
        <div class="text-2xl font-bold text-blue-900 mt-1">{{ statistics.total }}</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <div class="text-green-600 text-sm font-medium">Aktif</div>
        <div class="text-2xl font-bold text-green-900 mt-1">{{ statistics.aktif }}</div>
      </div>
      <div class="bg-red-50 rounded-lg p-4">
        <div class="text-red-600 text-sm font-medium">Non-Aktif</div>
        <div class="text-2xl font-bold text-red-900 mt-1">{{ statistics.non_aktif }}</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="text-purple-600 text-sm font-medium">Total Anggota</div>
        <div class="text-2xl font-bold text-purple-900 mt-1">{{ statistics.total_anggota }}</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama ekstrakurikuler, kategori, atau pembina..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        />
      </div>
      <div>
        <select
          v-model="kategoriFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadEkstrakurikulers"
        >
          <option value="">Semua Kategori</option>
          <option value="Olahraga">Olahraga</option>
          <option value="Seni">Seni</option>
          <option value="Akademik">Akademik</option>
          <option value="Teknologi">Teknologi</option>
          <option value="Keagamaan">Keagamaan</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>
      <div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadEkstrakurikulers"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="non-aktif">Non-Aktif</option>
        </select>
      </div>
      <div>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah
        </button>
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
                Ekstrakurikuler
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pembina
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jadwal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Anggota
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
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="px-6 py-4">
                <div class="text-gray-500">Memuat data...</div>
              </td>
            </tr>
            <tr v-else-if="ekstrakurikulers.length === 0" class="text-center">
              <td colspan="7" class="px-6 py-4">
                <div class="text-gray-500">Tidak ada data ekstrakurikuler</div>
              </td>
            </tr>
            <tr v-else v-for="ekskul in ekstrakurikulers" :key="ekskul.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    v-if="ekskul.gambar_url"
                    class="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      :src="ekskul.gambar_url"
                      :alt="ekskul.nama_ekstrakurikuler"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ ekskul.nama_ekstrakurikuler }}
                    </div>
                    <div v-if="ekskul.tempat" class="text-sm text-gray-500">
                      📍 {{ ekskul.tempat }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="ekskul.kategori"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                >
                  {{ ekskul.kategori }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="ekskul.pembina" class="text-sm text-gray-900">
                  {{ ekskul.pembina }}
                </div>
                <div v-if="ekskul.no_telepon_pembina" class="text-sm text-gray-500">
                  📞 {{ ekskul.no_telepon_pembina }}
                </div>
                <span v-if="!ekskul.pembina" class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="ekskul.hari_latihan" class="text-sm text-gray-900">
                  {{ ekskul.hari_latihan }}
                </div>
                <div v-if="ekskul.jam_latihan" class="text-sm text-gray-500">
                  🕐 {{ ekskul.jam_latihan }}
                </div>
                <span v-if="!ekskul.hari_latihan && !ekskul.jam_latihan" class="text-gray-400"
                  >-</span
                >
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ ekskul.jumlah_anggota || 0 }} orang
              </td>
              <td class="px-6 py-4">
                <button
                  @click="toggleStatus(ekskul.id)"
                  :class="getStatusClass(ekskul.status)"
                  class="px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80"
                >
                  {{ ekskul.status }}
                </button>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-2">
                <button @click="viewDetail(ekskul)" class="text-blue-600 hover:text-blue-900">
                  Lihat
                </button>
                <button @click="editEkskul(ekskul)" class="text-yellow-600 hover:text-yellow-900">
                  Edit
                </button>
                <button @click="deleteEkskul(ekskul.id)" class="text-red-600 hover:text-red-900">
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
        class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Detail Ekstrakurikuler</h3>
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

        <div v-if="selectedEkskul" class="space-y-2">
          <!-- Image -->
          <div v-if="selectedEkskul.gambar_url" class="w-full h-64 rounded-lg overflow-hidden">
            <img
              :src="selectedEkskul.gambar_url"
              :alt="selectedEkskul.nama_ekstrakurikuler"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="text-sm font-medium text-gray-700">Nama Ekstrakurikuler</label>
              <p class="mt-1 text-gray-900">{{ selectedEkskul.nama_ekstrakurikuler }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Kategori</label>
              <p class="mt-1 text-gray-900">{{ selectedEkskul.kategori || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tempat</label>
              <p class="mt-1 text-gray-900">{{ selectedEkskul.tempat || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Hari Latihan</label>
              <p class="mt-1 text-gray-900">{{ selectedEkskul.hari_latihan || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Jam Latihan</label>
              <p class="mt-1 text-gray-900">{{ selectedEkskul.jam_latihan || '-' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Jumlah Anggota</label>
              <p class="mt-1 text-gray-900">{{ selectedEkskul.jumlah_anggota || 0 }} orang</p>
            </div>
          </div>

          <div
            v-if="selectedEkskul.deskripsi"
            class="mt-1 text-gray-900 text-justify prose max-w-none"
            v-html="selectedEkskul.deskripsi"
          ></div>
          <p v-else class="mt-1 text-gray-400">-</p>

          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Informasi Pembina</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label class="text-sm font-medium text-gray-700">Nama Pembina</label>
                <p class="mt-1 text-gray-900">{{ selectedEkskul.pembina || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">No. Telepon</label>
                <p class="mt-1 text-gray-900">{{ selectedEkskul.no_telepon_pembina || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-gray-900">{{ selectedEkskul.email_pembina || '-' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Status</label>
                <p class="mt-1">
                  <span
                    :class="getStatusClass(selectedEkskul.status)"
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ selectedEkskul.status }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="text-sm text-gray-500">
            <p>Dibuat: {{ formatDate(selectedEkskul.created_at) }}</p>
            <p>Diperbarui: {{ formatDate(selectedEkskul.updated_at) }}</p>
          </div>
        </div>

        <div class="mt-6 flex gap-2 justify-end">
          <button
            @click="closeDetail"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Tutup
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
          <h3 class="text-lg font-bold text-gray-900">
            {{ isEditMode ? 'Edit' : 'Tambah' }} Ekstrakurikuler
          </h3>
          <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
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
          <!-- Nama Ekstrakurikuler -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nama Ekstrakurikuler <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nama_ekstrakurikuler"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Paskibra, Basket, PMR"
            />
          </div>

          <!-- Kategori & Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                v-model="form.kategori"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kategori</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Seni">Seni</option>
                <option value="Akademik">Akademik</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Keagamaan">Keagamaan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <RichTextEditor v-model="form.deskripsi" />
          </div>

          <!-- Tempat & Jumlah Anggota -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tempat</label>
              <input
                v-model="form.tempat"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Lapangan, Ruang Musik"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Anggota</label>
              <input
                v-model.number="form.jumlah_anggota"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Jadwal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hari Latihan</label>
              <input
                v-model="form.hari_latihan"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Senin, Rabu, Jumat"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jam Latihan</label>
              <input
                v-model="form.jam_latihan"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: 15.00 - 17.00"
              />
            </div>
          </div>

          <!-- Informasi Pembina -->
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Informasi Pembina</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pembina</label>
                <input
                  v-model="form.pembina"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama pembina"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >No. Telepon Pembina</label
                  >
                  <input
                    v-model="form.no_telepon_pembina"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Pembina</label>
                  <input
                    v-model="form.email_pembina"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Gambar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
            <input
              type="file"
              @change="handleImageChange"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 2MB</p>

            <!-- Image Preview -->
            <div v-if="imagePreview" class="mt-3">
              <img
                :src="imagePreview"
                alt="Preview"
                class="h-40 w-auto rounded-lg object-cover border"
              />
              <button
                @click="removeImage"
                type="button"
                class="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Hapus Gambar
              </button>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-2 justify-end pt-4">
            <button
              type="button"
              @click="closeForm"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Menyimpan...' : isEditMode ? 'Update' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ekstrakurikulerService from '@/api/ekstrakurikulers'
import RichTextEditor from '@/components/RichTextEditor.vue'

// State
const loading = ref(false)
const submitting = ref(false)
const search = ref('')
const statusFilter = ref('')
const kategoriFilter = ref('')

const ekstrakurikulers = ref([])
const statistics = ref({
  total: 0,
  aktif: 0,
  non_aktif: 0,
  total_anggota: 0,
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

const showDetailModal = ref(false)
const showFormModal = ref(false)
const selectedEkskul = ref(null)
const isEditMode = ref(false)
const imagePreview = ref(null)

const form = ref({
  id: null,
  nama_ekstrakurikuler: '',
  kategori: '',
  deskripsi: '',
  tempat: '',
  hari_latihan: '',
  jam_latihan: '',
  pembina: '',
  no_telepon_pembina: '',
  email_pembina: '',
  jumlah_anggota: 0,
  gambar: null,
  status: 'aktif',
})

// Search debounce
let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadEkstrakurikulers()
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
const loadEkstrakurikulers = async (page = 1) => {
  try {
    loading.value = true
    const params = {
      page,
      per_page: pagination.value.per_page,
      search: search.value,
      status: statusFilter.value,
      kategori: kategoriFilter.value,
    }

    const response = await ekstrakurikulerService.getAll(params)

    if (response.data.success) {
      ekstrakurikulers.value = response.data.data.data
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
    console.error('Error loading ekstrakurikulers:', error)
    alert('Gagal memuat data ekstrakurikuler: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const response = await ekstrakurikulerService.getStatistics()

    if (response.data && response.data.success) {
      statistics.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading statistics:', error)
    statistics.value = {
      total: 0,
      aktif: 0,
      non_aktif: 0,
      total_anggota: 0,
    }
  }
}

const viewDetail = (ekskul) => {
  selectedEkskul.value = ekskul
  showDetailModal.value = true
}

const closeDetail = () => {
  showDetailModal.value = false
  selectedEkskul.value = null
}

const openCreateModal = () => {
  isEditMode.value = false
  resetForm()
  showFormModal.value = true
}

const editEkskul = (ekskul) => {
  isEditMode.value = true
  form.value = {
    id: ekskul.id,
    nama_ekstrakurikuler: ekskul.nama_ekstrakurikuler,
    kategori: ekskul.kategori || '',
    deskripsi: ekskul.deskripsi || '',
    tempat: ekskul.tempat || '',
    hari_latihan: ekskul.hari_latihan || '',
    jam_latihan: ekskul.jam_latihan || '',
    pembina: ekskul.pembina || '',
    no_telepon_pembina: ekskul.no_telepon_pembina || '',
    email_pembina: ekskul.email_pembina || '',
    jumlah_anggota: ekskul.jumlah_anggota || 0,
    gambar: null,
    status: ekskul.status,
  }

  // Set image preview if exists
  if (ekskul.gambar_url) {
    imagePreview.value = ekskul.gambar_url
  }

  showFormModal.value = true
}

const closeForm = () => {
  showFormModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    nama_ekstrakurikuler: '',
    kategori: '',
    deskripsi: '',
    tempat: '',
    hari_latihan: '',
    jam_latihan: '',
    pembina: '',
    no_telepon_pembina: '',
    email_pembina: '',
    jumlah_anggota: 0,
    gambar: null,
    status: 'aktif',
  }
  imagePreview.value = null
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 2MB')
      event.target.value = ''
      return
    }

    form.value.gambar = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  form.value.gambar = null
  imagePreview.value = null
  // Reset file input
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}

const submitForm = async () => {
  try {
    submitting.value = true

    let response
    if (isEditMode.value) {
      response = await ekstrakurikulerService.update(form.value.id, form.value)
    } else {
      response = await ekstrakurikulerService.create(form.value)
    }

    if (response.data.success) {
      alert(`✅ Ekstrakurikuler berhasil ${isEditMode.value ? 'diperbarui' : 'ditambahkan'}`)
      closeForm()
      await loadEkstrakurikulers(pagination.value.current_page)
      await loadStatistics()
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    const errorMessage =
      error.response?.data?.message || error.response?.data?.errors || 'Gagal menyimpan data'
    alert('❌ ' + JSON.stringify(errorMessage))
  } finally {
    submitting.value = false
  }
}

const deleteEkskul = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus ekstrakurikuler ini?')) {
    return
  }

  try {
    const response = await ekstrakurikulerService.delete(id)

    if (response.data.success) {
      ekstrakurikulers.value = ekstrakurikulers.value.filter((e) => e.id !== id)
      pagination.value.total = pagination.value.total - 1

      alert('✅ Ekstrakurikuler berhasil dihapus!')

      await loadStatistics()

      if (ekstrakurikulers.value.length === 0 && pagination.value.current_page > 1) {
        loadEkstrakurikulers(pagination.value.current_page - 1)
      } else {
        loadEkstrakurikulers(pagination.value.current_page)
      }
    }
  } catch (error) {
    console.error('Error deleting ekstrakurikuler:', error)
    const errorMsg =
      error.response?.data?.message || error.message || 'Gagal menghapus ekstrakurikuler'
    alert('❌ ' + errorMsg)
  }
}

const toggleStatus = async (id) => {
  try {
    const response = await ekstrakurikulerService.toggleStatus(id)

    if (response.data.success) {
      alert('✅ Status berhasil diubah')
      await loadEkstrakurikulers(pagination.value.current_page)
      await loadStatistics()
    }
  } catch (error) {
    console.error('Error toggling status:', error)
    alert('❌ Gagal mengubah status')
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    loadEkstrakurikulers(page)
  }
}

const getStatusClass = (status) => {
  const classes = {
    aktif: 'bg-green-100 text-green-800',
    'non-aktif': 'bg-red-100 text-red-800',
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
  loadEkstrakurikulers()
  loadStatistics()
})
</script>
