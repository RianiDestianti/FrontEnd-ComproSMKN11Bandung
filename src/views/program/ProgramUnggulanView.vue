<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Program Unggulan</h1>
        <p class="mt-2">Program Unggulan SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat data...</p>
      </div>

      <!-- Program Grid -->
      <div
        v-else-if="programList.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="program in programList"
          :key="program.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
          @click="showDetail(program)"
        >
          <!-- Gambar -->
          <div
            class="relative h-56 bg-gradient-to-br from-purple-500 to-purple-700 overflow-hidden"
          >
            <img
              v-if="program.gambar"
              :src="`http://localhost:8000/storage/${program.gambar}`"
              :alt="program.nama_program"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-white text-6xl">🏆</span>
            </div>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
              {{ program.nama_program }}
            </h3>

            <p v-if="program.deskripsi" class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ stripHtml(program.deskripsi) }}
            </p>

            <!-- Button -->
            <button
              class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">Belum ada program unggulan tersedia.</p>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedProgram"
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
            <h2 class="text-3xl font-bold text-gray-800 flex-1">
              {{ selectedProgram.nama_program }}
            </h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 ml-4">
              <span class="text-3xl">×</span>
            </button>
          </div>

          <!-- Gambar -->
          <img
            v-if="selectedProgram.gambar"
            :src="`http://localhost:8000/storage/${selectedProgram.gambar}`"
            :alt="selectedProgram.nama_program"
            class="w-full h-80 object-cover rounded-lg mb-6"
          />

          <!-- Tabs -->
          <div class="border-b mb-6">
            <div class="flex gap-4">
              <button
                @click="activeTab = 'deskripsi'"
                :class="
                  activeTab === 'deskripsi'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600'
                "
                class="px-4 py-2 font-semibold transition-colors"
              >
                Deskripsi
              </button>
              <button
                @click="activeTab = 'tujuan'"
                :class="
                  activeTab === 'tujuan'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600'
                "
                class="px-4 py-2 font-semibold transition-colors"
              >
                Tujuan
              </button>
              <button
                @click="activeTab = 'sasaran'"
                :class="
                  activeTab === 'sasaran'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600'
                "
                class="px-4 py-2 font-semibold transition-colors"
              >
                Sasaran
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="prose max-w-none">
            <!-- Deskripsi -->
            <div v-show="activeTab === 'deskripsi'">
              <div
                v-if="selectedProgram.deskripsi"
                class="text-gray-700"
                v-html="selectedProgram.deskripsi"
              ></div>
              <p v-else class="text-gray-500 italic">Belum ada deskripsi</p>
            </div>

            <!-- Tujuan -->
            <div v-show="activeTab === 'tujuan'">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Tujuan Program</h3>
              <div
                v-if="selectedProgram.tujuan"
                class="text-gray-700"
                v-html="selectedProgram.tujuan"
              ></div>
              <p v-else class="text-gray-500 italic">Belum ada tujuan</p>
            </div>

            <!-- Sasaran -->
            <div v-show="activeTab === 'sasaran'">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Sasaran Program</h3>
              <div
                v-if="selectedProgram.sasaran"
                class="text-gray-700"
                v-html="selectedProgram.sasaran"
              ></div>
              <p v-else class="text-gray-500 italic">Belum ada sasaran</p>
            </div>
          </div>

          <!-- Close Button -->
          <div class="flex justify-end mt-8 pt-6 border-t">
            <button
              @click="closeModal"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
import { ref, onMounted } from 'vue'
import apiClient from '@/api/axios'

const programList = ref([])
const loading = ref(true)
const selectedProgram = ref(null)
const activeTab = ref('deskripsi')

const fetchProgramUnggulan = async () => {
  try {
    const response = await apiClient.get('/program-unggulan', {
      params: { status: 'aktif' },
    })
    programList.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching program unggulan:', error)
  } finally {
    loading.value = false
  }
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const showDetail = (program) => {
  selectedProgram.value = program
  activeTab.value = 'deskripsi'
}

const closeModal = () => {
  selectedProgram.value = null
}

onMounted(() => {
  fetchProgramUnggulan()
})
</script>
