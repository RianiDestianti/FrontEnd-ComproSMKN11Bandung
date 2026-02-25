<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Agenda Kegiatan</h1>
        <p class="mt-2">Jadwal kegiatan sekolah</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-wrap gap-3">
          <button
            @click="filterStatus = ''"
            :class="filterStatus === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Semua
          </button>
          <button
            @click="filterStatus = 'Akan Datang'"
            :class="
              filterStatus === 'Akan Datang'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            "
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            📅 Akan Datang
          </button>
          <button
            @click="filterStatus = 'Berlangsung'"
            :class="
              filterStatus === 'Berlangsung'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            "
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            ⏳ Berlangsung
          </button>
          <button
            @click="filterStatus = 'Selesai'"
            :class="
              filterStatus === 'Selesai' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'
            "
            class="px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            ✓ Selesai
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat agenda...</p>
      </div>

      <!-- Timeline Agenda -->
      <div v-else-if="filteredAgenda.length > 0" class="relative">
        <!-- Vertical Line -->
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>

        <div class="space-y-8">
          <div v-for="agenda in filteredAgenda" :key="agenda.id" class="relative">
            <!-- Timeline Dot -->
            <div
              class="absolute left-6 w-5 h-5 rounded-full hidden md:block"
              :class="{
                'bg-blue-600': agenda.status === 'Akan Datang',
                'bg-green-600': agenda.status === 'Berlangsung',
                'bg-gray-400': agenda.status === 'Selesai',
                'bg-red-600': agenda.status === 'Dibatalkan',
              }"
            ></div>

            <!-- Card -->
            <div
              class="md:ml-16 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
              @click="showDetail(agenda)"
            >
              <div class="md:flex">
                <!-- Gambar -->
                <div class="md:w-1/3 h-56 md:h-auto bg-gradient-to-br from-blue-500 to-blue-700">
                  <img
                    v-if="agenda.gambar"
                    :src="`http://localhost:8000/storage/${agenda.gambar}`"
                    :alt="agenda.judul_kegiatan"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-white text-6xl">📅</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="md:w-2/3 p-6">
                  <!-- Status Badge -->
                  <span
                    :class="{
                      'bg-blue-100 text-blue-700': agenda.status === 'Akan Datang',
                      'bg-green-100 text-green-700': agenda.status === 'Berlangsung',
                      'bg-gray-100 text-gray-700': agenda.status === 'Selesai',
                      'bg-red-100 text-red-700': agenda.status === 'Dibatalkan',
                    }"
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                  >
                    {{ agenda.status }}
                  </span>

                  <h3 class="text-2xl font-bold text-gray-800 mb-3">
                    {{ agenda.judul_kegiatan }}
                  </h3>

                  <!-- Info -->
                  <div class="space-y-2 text-sm text-gray-600 mb-4">
                    <div class="flex items-center gap-2">
                      <span class="text-blue-600">📅</span>
                      <span
                        >{{ formatDate(agenda.tanggal_mulai) }}
                        <span v-if="agenda.tanggal_selesai">
                          - {{ formatDate(agenda.tanggal_selesai) }}</span
                        >
                      </span>
                    </div>
                    <div v-if="agenda.lokasi" class="flex items-center gap-2">
                      <span class="text-blue-600">📍</span>
                      <span>{{ agenda.lokasi }}</span>
                    </div>
                    <div v-if="agenda.penyelenggara" class="flex items-center gap-2">
                      <span class="text-blue-600">👥</span>
                      <span>{{ agenda.penyelenggara }}</span>
                    </div>
                  </div>

                  <p v-if="agenda.deskripsi" class="text-gray-600 line-clamp-2 mb-4">
                    {{ stripHtml(agenda.deskripsi) }}
                  </p>

                  <button class="text-blue-600 font-semibold hover:underline">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">
          Tidak ada agenda {{ filterStatus ? filterStatus.toLowerCase() : '' }} saat ini.
        </p>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedAgenda"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div
        @click.stop
        class="bg-white rounded-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-8">
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex-1">
              <span
                :class="{
                  'bg-blue-100 text-blue-700': selectedAgenda.status === 'Akan Datang',
                  'bg-green-100 text-green-700': selectedAgenda.status === 'Berlangsung',
                  'bg-gray-100 text-gray-700': selectedAgenda.status === 'Selesai',
                  'bg-red-100 text-red-700': selectedAgenda.status === 'Dibatalkan',
                }"
                class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
              >
                {{ selectedAgenda.status }}
              </span>
              <h2 class="text-3xl font-bold text-gray-800">{{ selectedAgenda.judul_kegiatan }}</h2>
            </div>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 ml-4">
              <span class="text-3xl">×</span>
            </button>
          </div>

          <!-- Gambar -->
          <img
            v-if="selectedAgenda.gambar"
            :src="`http://localhost:8000/storage/${selectedAgenda.gambar}`"
            :alt="selectedAgenda.judul_kegiatan"
            class="w-full h-80 object-cover rounded-lg mb-6"
          />

          <!-- Info Detail -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500 mb-1">Tanggal Mulai</p>
              <p class="font-semibold text-gray-800">
                {{ formatDateFull(selectedAgenda.tanggal_mulai) }}
              </p>
            </div>
            <div v-if="selectedAgenda.tanggal_selesai">
              <p class="text-sm text-gray-500 mb-1">Tanggal Selesai</p>
              <p class="font-semibold text-gray-800">
                {{ formatDateFull(selectedAgenda.tanggal_selesai) }}
              </p>
            </div>
            <div v-if="selectedAgenda.lokasi">
              <p class="text-sm text-gray-500 mb-1">Lokasi</p>
              <p class="font-semibold text-gray-800">{{ selectedAgenda.lokasi }}</p>
            </div>
            <div v-if="selectedAgenda.penyelenggara">
              <p class="text-sm text-gray-500 mb-1">Penyelenggara</p>
              <p class="font-semibold text-gray-800">{{ selectedAgenda.penyelenggara }}</p>
            </div>
          </div>

          <!-- Deskripsi -->
          <div v-if="selectedAgenda.deskripsi" class="mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-3">Deskripsi</h3>
            <div class="prose max-w-none text-gray-700" v-html="selectedAgenda.deskripsi"></div>
          </div>

          <!-- Peserta -->
          <div v-if="selectedAgenda.peserta" class="mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-3">Peserta</h3>
            <div class="prose max-w-none text-gray-700" v-html="selectedAgenda.peserta"></div>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end pt-6 border-t">
            <button
              @click="closeModal"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'

const agendaList = ref([])
const loading = ref(true)
const selectedAgenda = ref(null)
const filterStatus = ref('')

const fetchAgenda = async () => {
  try {
    const response = await apiClient.get('/agenda-kegiatan', {
      params: { per_page: 100 },
    })
    agendaList.value = response.data.data.data || response.data.data || []
  } catch (error) {
    console.error('Error fetching agenda:', error)
  } finally {
    loading.value = false
  }
}

const filteredAgenda = computed(() => {
  if (!filterStatus.value) {
    return agendaList.value
  }
  return agendaList.value.filter((a) => a.status === filterStatus.value)
})

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatDateFull = (dateString) => {
  if (!dateString) return ''
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const showDetail = (agenda) => {
  selectedAgenda.value = agenda
}

const closeModal = () => {
  selectedAgenda.value = null
}

onMounted(() => {
  fetchAgenda()
})
</script>
