<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Jadwal Pelajaran</h1>
        <p class="mt-2">Jadwal pelajaran per kelas</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Kelas</label>
            <select
              v-model="selectedKelas"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              @change="filterData"
            >
              <option value="">-- Pilih Kelas --</option>
              <option v-for="kelas in formattedKelasList" :key="kelas.id" :value="kelas.id">
                {{ kelas.display_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              v-model="selectedSemester"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              @change="filterData"
            >
              <option value="">Semua Semester</option>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
            <input
              v-model="selectedTahunAjaran"
              type="text"
              placeholder="2024/2025"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              @input="filterData"
            />
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat jadwal...</p>
      </div>

      <!-- Jadwal Table -->
      <div
        v-else-if="selectedKelas && filteredJadwal.length > 0"
        class="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <tr>
                <th class="px-4 py-4 text-left font-semibold">Waktu</th>
                <th
                  v-for="hari in hariList"
                  :key="hari"
                  class="px-4 py-4 text-center font-semibold min-w-[200px]"
                >
                  {{ hari }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(slot, index) in timeSlots" :key="index" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 font-semibold text-gray-700 bg-gray-50">
                  {{ slot }}
                </td>
                <td v-for="hari in hariList" :key="hari" class="px-2 py-2 align-top">
                  <div
                    v-for="jadwal in getJadwalByHariAndTime(hari, slot)"
                    :key="jadwal.id"
                    class="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-lg p-3 mb-2 hover:shadow-md transition-shadow cursor-pointer"
                    @click="showDetail(jadwal)"
                  >
                    <p class="font-bold text-sm text-gray-800 mb-1">
                      {{ jadwal.mata_pelajaran?.nama_mapel }}
                    </p>
                    <p class="text-xs text-gray-600 mb-1">{{ jadwal.guru?.nama }}</p>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>{{ jadwal.jam_mulai }} - {{ jadwal.jam_selesai }}</span>
                      <span
                        v-if="jadwal.ruangan"
                        class="bg-blue-600 text-white px-2 py-0.5 rounded"
                        >{{ jadwal.ruangan }}</span
                      >
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="selectedKelas && filteredJadwal.length === 0"
        class="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <p class="text-gray-600">Belum ada jadwal untuk kelas ini.</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">Silakan pilih kelas terlebih dahulu.</p>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedJadwal"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div @click.stop class="bg-white rounded-xl max-w-md w-full">
        <div class="p-6">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-800">Detail Jadwal</h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">×</span>
            </button>
          </div>

          <!-- Content -->
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500">Mata Pelajaran</p>
              <p class="font-semibold text-gray-800">
                {{ selectedJadwal.mata_pelajaran?.nama_mapel }}
              </p>
              <p v-if="selectedJadwal.mata_pelajaran?.kode_mapel" class="text-xs text-gray-500">
                Kode: {{ selectedJadwal.mata_pelajaran.kode_mapel }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Guru Pengajar</p>
              <p class="font-semibold text-gray-800">{{ selectedJadwal.guru?.nama }}</p>
              <p v-if="selectedJadwal.guru?.nip" class="text-xs text-gray-500">
                NIP: {{ selectedJadwal.guru.nip }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Hari</p>
                <p class="font-semibold text-gray-800">{{ selectedJadwal.hari }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Waktu</p>
                <p class="font-semibold text-gray-800">
                  {{ selectedJadwal.jam_mulai }} - {{ selectedJadwal.jam_selesai }}
                </p>
              </div>
            </div>

            <div v-if="selectedJadwal.ruangan">
              <p class="text-sm text-gray-500">Ruangan</p>
              <p class="font-semibold text-gray-800">{{ selectedJadwal.ruangan }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Semester</p>
                <p class="font-semibold text-gray-800">{{ selectedJadwal.semester }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tahun Ajaran</p>
                <p class="font-semibold text-gray-800">{{ selectedJadwal.tahun_ajaran }}</p>
              </div>
            </div>
          </div>

          <!-- Close Button -->
          <div class="mt-6 pt-4 border-t">
            <button
              @click="closeModal"
              class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

const jadwalList = ref([])
const kelasList = ref([])
const loading = ref(true)
const selectedKelas = ref('')
const selectedSemester = ref('')
const selectedTahunAjaran = ref('')
const selectedJadwal = ref(null)

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
const timeSlots = ref([])

const fetchJadwal = async () => {
  try {
    const response = await apiClient.get('/jadwal-pelajaran')
    jadwalList.value = response.data.data || []
    generateTimeSlots()
  } catch (error) {
    console.error('Error fetching jadwal:', error)
  } finally {
    loading.value = false
  }
}

const fetchKelas = async () => {
  try {
    const response = await apiClient.get('/jadwal-pelajaran/form-data')
    kelasList.value = response.data.data.kelas || []
  } catch (error) {
    console.error('Error fetching kelas:', error)
  }
}

const formattedKelasList = computed(() => {
  return kelasList.value.map((k) => ({
    ...k,
    display_name: `${k.tingkat} ${k.nama_kelas}`,
  }))
})

const filteredJadwal = computed(() => {
  let result = jadwalList.value

  if (selectedKelas.value) {
    result = result.filter((j) => j.kelas_id == selectedKelas.value)
  }

  if (selectedSemester.value) {
    result = result.filter((j) => j.semester === selectedSemester.value)
  }

  if (selectedTahunAjaran.value) {
    result = result.filter((j) => j.tahun_ajaran.includes(selectedTahunAjaran.value))
  }

  return result
})

const generateTimeSlots = () => {
  const slots = new Set()
  jadwalList.value.forEach((j) => {
    slots.add(`${j.jam_mulai} - ${j.jam_selesai}`)
  })
  timeSlots.value = Array.from(slots).sort()
}

const getJadwalByHariAndTime = (hari, timeSlot) => {
  const [jamMulai, jamSelesai] = timeSlot.split(' - ')
  return filteredJadwal.value.filter(
    (j) => j.hari === hari && j.jam_mulai === jamMulai && j.jam_selesai === jamSelesai,
  )
}

const filterData = () => {
  // Trigger computed
}

const showDetail = (jadwal) => {
  selectedJadwal.value = jadwal
}

const closeModal = () => {
  selectedJadwal.value = null
}

onMounted(() => {
  fetchJadwal()
  fetchKelas()
})
</script>
