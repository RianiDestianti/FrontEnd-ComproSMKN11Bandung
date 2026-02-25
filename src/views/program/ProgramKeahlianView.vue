<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="relative bg-blue-600 text-white py-12 overflow-hidden">
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/images/bg_programkeahlian.png')"
      ></div>

      <!-- Overlay gradient yang lebih redup -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-700/40"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold">Program Keahlian</h1>
        <p class="mt-2">Program Keahlian yang tersedia di SMKN 11 Bandung</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat data...</p>
      </div>

      <!-- Program List -->
      <div
        v-else-if="programList.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="program in programList"
          :key="program.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
        >
          <!-- Gambar Program -->
          <div class="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
            <img
              v-if="program.gambar"
              :src="`http://localhost:8000/${program.gambar}`"
              :alt="program.nama_program"
              class="w-full h-full object-contain p-4"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-blue-600 text-6xl">📚</span>
            </div>

            <!-- Badge Kode Program -->
            <div v-if="program.kode_program" class="absolute top-4 right-4">
              <span
                class="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow-md"
              >
                {{ program.kode_program }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-3">
              {{ program.nama_program }}
            </h3>

            <p v-if="program.deskripsi" class="text-gray-600 mb-4 line-clamp-3">
              {{ stripHtml(program.deskripsi) }}
            </p>

            <!-- Status Badge -->
            <div class="flex items-center justify-between mt-4 pt-4 border-t">
              <span
                :class="
                  program.status === 'aktif'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                "
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ program.status === 'aktif' ? '✓ Aktif' : 'Non-Aktif' }}
              </span>

              <button
                @click="showDetail(program)"
                class="text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                Lihat Detail →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600 text-lg">Belum ada program keahlian tersedia.</p>
      </div>
    </div>

    <!-- Modal Detail (Optional) -->
    <div
      v-if="selectedProgram"
      @click="selectedProgram = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div @click.stop class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-gray-800">{{ selectedProgram.nama_program }}</h2>
            <button @click="selectedProgram = null" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">×</span>
            </button>
          </div>

          <img
            v-if="selectedProgram.gambar"
            :src="`http://localhost:8000/${selectedProgram.gambar}`"
            :alt="selectedProgram.nama_program"
            class="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div class="space-y-4">
            <div v-if="selectedProgram.kode_program">
              <p class="text-sm text-gray-600">Kode Program</p>
              <p class="font-semibold">{{ selectedProgram.kode_program }}</p>
            </div>

            <div v-if="selectedProgram.deskripsi">
              <p class="text-sm text-gray-600 mb-2">Deskripsi</p>
              <div class="prose max-w-none text-gray-700" v-html="selectedProgram.deskripsi"></div>
            </div>

            <div>
              <p class="text-sm text-gray-600">Status</p>
              <span
                :class="
                  selectedProgram.status === 'aktif'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                "
                class="inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1"
              >
                {{ selectedProgram.status === 'aktif' ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </div>
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

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const fetchProgramKeahlian = async () => {
  try {
    const response = await apiClient.get('/program-keahlian')
    programList.value = response.data.data.filter((p) => p.status === 'aktif')
  } catch (error) {
    console.error('Error fetching program keahlian:', error)
  } finally {
    loading.value = false
  }
}

const showDetail = (program) => {
  selectedProgram.value = program
}

onMounted(() => {
  fetchProgramKeahlian()
})
</script>
