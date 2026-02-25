<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div
      class="relative bg-contain bg-center bg-no-repeat py-12 text-white"
      style="background-image: url('/images/bg_data_perusahaan_PKL_.png')"
    >
      <!-- Overlay gelap untuk keterbacaan text -->
      <div class="absolute inset-0 bg-black/50"></div>

      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold drop-shadow-lg">Data Perusahaan Praktek Kerja Lapangan</h1>
        <p class="mt-2 text-gray-100 drop-shadow">Informasi lengkap perusahaan mitra PKL</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Search & Filter Bar -->
      <div class="bg-white rounded-lg shadow-md p-5 mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="flex-1 relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Cari nama, bidang usaha, alamat, email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="fetchData"
            />
          </div>

          <!-- Filter Status -->
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            @change="fetchData"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="non-aktif">Non-Aktif</option>
          </select>

          <!-- Filter Provinsi -->
          <input
            v-model="filterProvinsi"
            type="text"
            placeholder="Provinsi"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="fetchData"
          />

          <!-- Filter Kota -->
          <input
            v-model="filterKota"
            type="text"
            placeholder="Kota"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="fetchData"
          />

          <!-- Reset -->
          <button
            v-if="search || filterStatus || filterProvinsi || filterKota"
            @click="resetFilter"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div
          class="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="mt-3 text-gray-500">Memuat data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600 font-medium">Gagal memuat data</p>
        <p class="text-red-500 text-sm mt-1">{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-3 px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          Coba Ulang
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="perusahaan.length === 0"
        class="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-14 w-14 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="mt-3 text-gray-500">Tidak ada data perusahaan yang ditemukan.</p>
      </div>

      <!-- Card Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in perusahaan"
          :key="item.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col"
          @click="openModal(item)"
        >
          <!-- Top accent bar (color based on status) -->
          <div
            :class="item.status === 'aktif' ? 'bg-green-500' : 'bg-gray-400'"
            class="h-1.5"
          ></div>

          <div class="p-5 flex flex-col flex-1">
            <!-- Nama & Status Badge -->
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-semibold text-gray-800 text-lg leading-tight">
                {{ item.nama_perusahaan }}
              </h3>
              <span
                :class="
                  item.status === 'aktif'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                "
                class="text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap capitalize"
              >
                {{ item.status }}
              </span>
            </div>

            <!-- Bidang Usaha -->
            <p v-if="item.bidang_usaha" class="text-sm text-blue-600 mt-1 font-medium">
              {{ item.bidang_usaha }}
            </p>

            <!-- Divider -->
            <hr class="my-3 border-gray-100" />

            <!-- Info singkat -->
            <div class="space-y-1.5 text-sm text-gray-600 flex-1">
              <div v-if="item.alamat" class="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="truncate"
                  >{{ item.alamat }}{{ item.kota ? `, ${item.kota}` : ''
                  }}{{ item.provinsi ? `, ${item.provinsi}` : '' }}</span
                >
              </div>
              <div v-if="item.no_telepon" class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{{ item.no_telepon }}</span>
              </div>
              <div v-if="item.email" class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span class="truncate">{{ item.email }}</span>
              </div>
            </div>

            <!-- Lihat Detail link -->
            <div class="mt-4 pt-3 border-t border-gray-100">
              <span class="text-sm text-blue-600 font-medium hover:text-blue-800 transition">
                Lihat Detail →
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Jumlah Data -->
      <p v-if="!loading && perusahaan.length > 0" class="mt-6 text-sm text-gray-400 text-center">
        Menampilkan {{ perusahaan.length }} perusahaan
      </p>
    </div>
  </div>

  <!-- Modal Detail -->
  <div
    v-if="selectedPerusahaan"
    class="fixed inset-0 z-50 flex items-center justify-center px-4"
    @click.self="closeModal"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
    >
      <!-- Modal Header -->
      <div class="bg-blue-600 text-white p-5 rounded-t-xl flex justify-between items-start">
        <div>
          <h2 class="text-lg font-bold">{{ selectedPerusahaan.nama_perusahaan }}</h2>
          <p v-if="selectedPerusahaan.bidang_usaha" class="text-blue-200 text-sm mt-0.5">
            {{ selectedPerusahaan.bidang_usaha }}
          </p>
        </div>
        <button @click="closeModal" class="text-blue-200 hover:text-white transition ml-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 space-y-4">
        <!-- Status -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">Status</span>
          <span
            :class="
              selectedPerusahaan.status === 'aktif'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            "
            class="text-xs font-semibold px-3 py-1 rounded-full capitalize"
          >
            {{ selectedPerusahaan.status }}
          </span>
        </div>

        <hr class="border-gray-100" />

        <!-- Detail Rows -->
        <div class="space-y-3">
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Alamat</span>
            <span class="text-sm text-gray-800 text-right">{{
              selectedPerusahaan.alamat || '—'
            }}</span>
          </div>
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Kota</span>
            <span class="text-sm text-gray-800 text-right">{{
              selectedPerusahaan.kota || '—'
            }}</span>
          </div>
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Provinsi</span>
            <span class="text-sm text-gray-800 text-right">{{
              selectedPerusahaan.provinsi || '—'
            }}</span>
          </div>
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">No. Telepon</span>
            <span class="text-sm text-gray-800 text-right">{{
              selectedPerusahaan.no_telepon || '—'
            }}</span>
          </div>
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Email</span>
            <span class="text-sm text-gray-800 text-right">{{
              selectedPerusahaan.email || '—'
            }}</span>
          </div>
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Contact Person</span>
            <span class="text-sm text-gray-800 text-right">{{
              selectedPerusahaan.contact_person || '—'
            }}</span>
          </div>
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Website</span>
            <a
              v-if="selectedPerusahaan.website"
              :href="selectedPerusahaan.website"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline text-sm text-right"
            >
              {{ selectedPerusahaan.website }}
            </a>
            <span v-else class="text-sm text-gray-400 italic">—</span>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Timestamps -->
        <div class="text-xs text-gray-400 space-y-0.5">
          <p>Ditambahkan: {{ formatDate(selectedPerusahaan.created_at) }}</p>
          <p>Diperbarui: {{ formatDate(selectedPerusahaan.updated_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axios'

// --- Reactive State ---
const perusahaan = ref([])
const loading = ref(true)
const error = ref(null)
const selectedPerusahaan = ref(null)

// Filter & Search
const search = ref('')
const filterStatus = ref('')
const filterProvinsi = ref('')
const filterKota = ref('')

// --- Fetch Data ---
async function fetchData() {
  loading.value = true
  error.value = null

  try {
    const params = {}
    if (search.value) params.search = search.value
    if (filterStatus.value) params.status = filterStatus.value
    if (filterProvinsi.value) params.provinsi = filterProvinsi.value
    if (filterKota.value) params.kota = filterKota.value

    const res = await apiClient.get('/perusahaan-pkl', { params })
    perusahaan.value = res.data.data
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Kesalahan tidak diketahui'
  } finally {
    loading.value = false
  }
}

// --- Reset Filter ---
function resetFilter() {
  search.value = ''
  filterStatus.value = ''
  filterProvinsi.value = ''
  filterKota.value = ''
  fetchData()
}

// --- Modal ---
function openModal(item) {
  selectedPerusahaan.value = item
}
function closeModal() {
  selectedPerusahaan.value = null
}

// --- Format Tanggal ---
function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// --- Lifecycle ---
onMounted(() => {
  fetchData()
})
</script>
