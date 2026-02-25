<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="relative bg-blue-600 text-white py-12 overflow-hidden">
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style="background-image: url('/images/bg_konsentrasi_keahlian.png'); background-size: 90%"
      ></div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-700/40"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold">Konsentrasi Keahlian</h1>
        <p class="mt-2">Konsentrasi Keahlian yang tersedia di SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex gap-4">
          <select
            v-model="filterProgram"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            @change="filterData"
          >
            <option value="">Semua Program Keahlian</option>
            <option v-for="program in programList" :key="program.id" :value="program.id">
              {{ program.nama_program }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat data...</p>
      </div>

      <!-- Konsentrasi Grid -->
      <div
        v-else-if="filteredKonsentrasi.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="item in filteredKonsentrasi"
          :key="item.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          @click="showDetail(item)"
        >
          <!-- Gambar -->
          <div class="relative h-56 bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden">
            <img
              v-if="item.gambar"
              :src="`http://localhost:8000/${item.gambar}`"
              :alt="item.nama_konsentrasi"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-white text-6xl">🎓</span>
            </div>

            <!-- Badge Kode -->
            <div v-if="item.kode_konsentrasi" class="absolute top-4 right-4">
              <span
                class="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-md"
              >
                {{ item.kode_konsentrasi }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Program Keahlian -->
            <span
              v-if="item.program_keahlian"
              class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            >
              {{ item.program_keahlian.nama_program }}
            </span>

            <h3 class="text-xl font-bold text-gray-800 mb-3">
              {{ item.nama_konsentrasi }}
            </h3>

            <p v-if="item.deskripsi" class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ stripHtml(item.deskripsi) }}
            </p>

            <!-- Button -->
            <button
              class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">Tidak ada konsentrasi keahlian tersedia.</p>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedItem"
      @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div
        @click.stop
        class="bg-white rounded-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-8">
          <!-- Header Modal -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex-1">
              <span
                v-if="selectedItem.program_keahlian"
                class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-2"
              >
                {{ selectedItem.program_keahlian.nama_program }}
              </span>
              <h2 class="text-3xl font-bold text-gray-800">{{ selectedItem.nama_konsentrasi }}</h2>
              <p v-if="selectedItem.kode_konsentrasi" class="text-sm text-gray-500 mt-1">
                Kode: {{ selectedItem.kode_konsentrasi }}
              </p>
            </div>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 ml-4">
              <span class="text-3xl">×</span>
            </button>
          </div>

          <!-- Gambar -->
          <img
            v-if="selectedItem.gambar"
            :src="`http://localhost:8000/${selectedItem.gambar}`"
            :alt="selectedItem.nama_konsentrasi"
            class="w-full h-80 object-cover rounded-lg mb-6"
          />

          <!-- Tabs -->
          <div class="border-b mb-6">
            <div class="flex gap-4">
              <button
                @click="activeTab = 'deskripsi'"
                :class="
                  activeTab === 'deskripsi'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                "
                class="px-4 py-2 font-semibold transition-colors"
              >
                Deskripsi
              </button>
              <button
                @click="activeTab = 'kompetensi'"
                :class="
                  activeTab === 'kompetensi'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                "
                class="px-4 py-2 font-semibold transition-colors"
              >
                Kompetensi
              </button>
              <button
                @click="activeTab = 'prospek'"
                :class="
                  activeTab === 'prospek'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                "
                class="px-4 py-2 font-semibold transition-colors"
              >
                Prospek Kerja
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="prose max-w-none">
            <!-- Deskripsi -->
            <div v-show="activeTab === 'deskripsi'" v-if="selectedItem.deskripsi">
              <div class="text-gray-700" v-html="selectedItem.deskripsi"></div>
            </div>

            <!-- Kompetensi -->
            <div v-show="activeTab === 'kompetensi'" v-if="selectedItem.kompetensi">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Kompetensi yang Dipelajari</h3>
              <div class="text-gray-700" v-html="selectedItem.kompetensi"></div>
            </div>

            <!-- Prospek Kerja -->
            <div v-show="activeTab === 'prospek'" v-if="selectedItem.prospek_kerja">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Prospek Kerja</h3>
              <div class="text-gray-700" v-html="selectedItem.prospek_kerja"></div>
            </div>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end mt-8 pt-6 border-t">
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

const konsentrasiList = ref([])
const programList = ref([])
const loading = ref(true)
const selectedItem = ref(null)
const filterProgram = ref('')
const activeTab = ref('deskripsi')

const fetchKonsentrasi = async () => {
  try {
    const response = await apiClient.get('/konsentrasi-keahlian')
    konsentrasiList.value = response.data.data.filter((k) => k.status === 'aktif')
  } catch (error) {
    console.error('Error fetching konsentrasi:', error)
  } finally {
    loading.value = false
  }
}

const fetchProgram = async () => {
  try {
    const response = await apiClient.get('/program-keahlian')
    programList.value = response.data.data.filter((p) => p.status === 'aktif')
  } catch (error) {
    console.error('Error fetching program:', error)
  }
}

const filteredKonsentrasi = computed(() => {
  if (!filterProgram.value) {
    return konsentrasiList.value
  }
  return konsentrasiList.value.filter((k) => k.program_keahlian_id == filterProgram.value)
})

const filterData = () => {
  // Trigger computed
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const showDetail = (item) => {
  selectedItem.value = item
  activeTab.value = 'deskripsi'
}

const closeModal = () => {
  selectedItem.value = null
}

onMounted(() => {
  fetchKonsentrasi()
  fetchProgram()
})
</script>
