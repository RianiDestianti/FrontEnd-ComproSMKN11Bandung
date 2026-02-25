<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="relative bg-blue-600 text-white py-12 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute inset-0"
          style="background-image: url('/images/bg_kalender.png'); background-size: cover"
        ></div>
      </div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-700/40"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold">Kalender Akademik</h1>
        <p class="mt-2">Jadwal Kegiatan Akademik SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filter Tahun -->
          <select
            v-model="filterTahun"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterData"
          >
            <option value="">Semua Tahun</option>
            <option v-for="tahun in tahunList" :key="tahun" :value="tahun">
              {{ tahun }}
            </option>
          </select>

          <!-- Filter Bulan -->
          <select
            v-model="filterBulan"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterData"
          >
            <option value="">Semua Bulan</option>
            <option v-for="(nama, index) in namaBulan" :key="index" :value="index + 1">
              {{ nama }}
            </option>
          </select>

          <!-- Search -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kegiatan..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @input="filterData"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat kalender akademik...</p>
      </div>

      <!-- Timeline View -->
      <div v-else-if="groupedEvents && Object.keys(groupedEvents).length > 0" class="space-y-8">
        <!-- Group by Month -->
        <div v-for="(events, monthKey) in groupedEvents" :key="monthKey">
          <!-- Month Header -->
          <div class="flex items-center mb-6">
            <div class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md">
              <h2 class="text-xl font-bold">{{ getMonthName(monthKey) }}</h2>
            </div>
            <div class="flex-1 h-1 bg-blue-200 ml-4"></div>
          </div>

          <!-- Events in Month -->
          <div class="space-y-4 ml-4">
            <div
              v-for="event in events"
              :key="event.id"
              class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div class="flex">
                <!-- Date Badge -->
                <div
                  class="bg-blue-600 text-white p-4 flex flex-col items-center justify-center min-w-[80px]"
                >
                  <div class="text-3xl font-bold">{{ formatDay(event.tanggal_mulai) }}</div>
                  <div class="text-xs uppercase">{{ formatMonthShort(event.tanggal_mulai) }}</div>
                </div>

                <!-- Event Content -->
                <div class="flex-1 p-4">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">{{ event.judul_kegiatan }}</h3>

                  <div class="space-y-1 text-sm text-gray-600">
                    <!-- Tahun Ajaran & Jenis -->
                    <div class="flex items-center gap-4 mb-2">
                      <span
                        v-if="event.tahun_ajaran"
                        class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold"
                      >
                        {{ event.tahun_ajaran }}
                      </span>
                      <span
                        v-if="event.jenis_kegiatan"
                        class="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-semibold"
                      >
                        {{ event.jenis_kegiatan }}
                      </span>
                    </div>

                    <!-- Tanggal -->
                    <div class="flex items-center">
                      <span class="text-blue-600 mr-2">📅</span>
                      <span>
                        {{ formatDate(event.tanggal_mulai) }}
                        <span
                          v-if="
                            event.tanggal_selesai && event.tanggal_selesai !== event.tanggal_mulai
                          "
                        >
                          - {{ formatDate(event.tanggal_selesai) }}
                        </span>
                      </span>
                    </div>

                    <!-- Deskripsi -->
                    <div v-if="event.deskripsi" class="flex items-start mt-2">
                      <span class="text-blue-600 mr-2">📝</span>
                      <span class="flex-1">{{ event.deskripsi }}</span>
                    </div>

                    <!-- Status Badge -->
                    <div class="mt-2">
                      <span
                        :class="{
                          'bg-green-100 text-green-800': isUpcoming(event.tanggal_mulai),
                          'bg-blue-100 text-blue-800': isOngoing(
                            event.tanggal_mulai,
                            event.tanggal_selesai,
                          ),
                          'bg-gray-100 text-gray-800': isPast(
                            event.tanggal_selesai || event.tanggal_mulai,
                          ),
                        }"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ getStatusText(event.tanggal_mulai, event.tanggal_selesai) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <div class="text-6xl mb-4">📅</div>
        <p class="text-gray-600 text-lg">Belum ada kegiatan untuk periode yang dipilih</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'

const kalenderList = ref([])
const loading = ref(true)
const filterTahun = ref('')
const filterBulan = ref('')
const searchQuery = ref('')

const namaBulan = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const fetchKalender = async () => {
  try {
    const response = await apiClient.get('/kalender-akademik')
    console.log('Kalender data:', response.data)

    // Response dari Laravel pagination: response.data.data.data
    // response.data = {success: true, message: '...', data: {current_page, data: [], ...}}
    const paginatedData = response.data.data

    // Ambil array dari pagination
    const dataArray = paginatedData.data || []

    console.log('Parsed data array:', dataArray)
    console.log('Is array?', Array.isArray(dataArray))
    console.log('Data length:', dataArray?.length)

    if (dataArray && dataArray.length > 0) {
      console.log('Sample data:', dataArray[0])
    }

    kalenderList.value = Array.isArray(dataArray)
      ? dataArray.sort((a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai))
      : []

    console.log('kalenderList.value:', kalenderList.value)
  } catch (error) {
    console.error('Error fetching kalender:', error)
    console.error('Error response:', error.response)
  } finally {
    loading.value = false
  }
}

// Get unique years from data
const tahunList = computed(() => {
  const years = kalenderList.value
    .map((k) => new Date(k.tanggal_mulai).getFullYear())
    .filter(Boolean)
  return [...new Set(years)].sort((a, b) => b - a)
})

// Filtered data
const filteredKalender = computed(() => {
  let result = kalenderList.value

  if (searchQuery.value) {
    result = result.filter(
      (k) =>
        k.judul_kegiatan.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (k.deskripsi && k.deskripsi.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (k.jenis_kegiatan &&
          k.jenis_kegiatan.toLowerCase().includes(searchQuery.value.toLowerCase())),
    )
  }

  if (filterTahun.value) {
    result = result.filter((k) => {
      const year = new Date(k.tanggal_mulai).getFullYear()
      return year === parseInt(filterTahun.value)
    })
  }

  if (filterBulan.value) {
    result = result.filter((k) => {
      const month = new Date(k.tanggal_mulai).getMonth() + 1
      return month === parseInt(filterBulan.value)
    })
  }

  return result
})

// Group events by month-year
const groupedEvents = computed(() => {
  const groups = {}

  filteredKalender.value.forEach((event) => {
    const date = new Date(event.tanggal_mulai)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!groups[monthKey]) {
      groups[monthKey] = []
    }
    groups[monthKey].push(event)
  })

  return groups
})

const filterData = () => {
  // Trigger reactivity
}

const getMonthName = (monthKey) => {
  const [year, month] = monthKey.split('-')
  return `${namaBulan[parseInt(month) - 1]} ${year}`
}

const formatDay = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getDate()
}

const formatMonthShort = (dateString) => {
  if (!dateString) return ''
  const month = new Date(dateString).getMonth()
  return namaBulan[month].substring(0, 3)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const day = date.getDate()
  const month = namaBulan[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const isUpcoming = (startDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  return start > today
}

const isOngoing = (startDate, endDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  if (!endDate) return start.getTime() === today.getTime()

  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  return start <= today && end >= today
}

const isPast = (endDate) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  return end < today
}

const getStatusText = (startDate, endDate) => {
  if (isOngoing(startDate, endDate)) return 'Sedang Berlangsung'
  if (isUpcoming(startDate)) return 'Akan Datang'
  return 'Selesai'
}

onMounted(() => {
  fetchKalender()
})
</script>
