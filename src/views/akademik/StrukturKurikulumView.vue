<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Struktur Kurikulum</h1>
        <p class="mt-2">Struktur kurikulum pembelajaran</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Filter Konsentrasi -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Pilih Konsentrasi Keahlian</label
        >
        <select
          v-model="selectedKonsentrasi"
          class="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          @change="filterData"
        >
          <option value="">-- Pilih Konsentrasi Keahlian --</option>
          <option
            v-for="konsentrasi in konsentrasiList"
            :key="konsentrasi.id"
            :value="konsentrasi.id"
          >
            {{ konsentrasi.nama_konsentrasi }}
          </option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Memuat data...</p>
      </div>

      <!-- Struktur Kurikulum by Tingkat -->
      <div v-else-if="selectedKonsentrasi && filteredKurikulum.length > 0" class="space-y-8">
        <!-- Loop per Tingkat -->
        <div v-for="tingkat in ['X', 'XI', 'XII']" :key="tingkat">
          <div
            v-if="getByTingkat(tingkat).length > 0"
            class="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <!-- Header Tingkat -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <h2 class="text-2xl font-bold">Kelas {{ tingkat }}</h2>
            </div>

            <!-- Semester Ganjil & Genap -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <!-- Semester Ganjil -->
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
                  📚 Semester Ganjil
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="item in getBySemester(tingkat, 'Ganjil')"
                    :key="item.id"
                    class="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p class="font-semibold text-gray-800">
                          {{ item.mata_pelajaran?.nama_mapel || 'N/A' }}
                        </p>
                        <p
                          v-if="item.mata_pelajaran?.kode_mapel"
                          class="text-xs text-gray-500 mt-1"
                        >
                          Kode: {{ item.mata_pelajaran.kode_mapel }}
                        </p>
                      </div>
                      <span
                        class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold ml-3"
                      >
                        {{ item.jam_per_minggu }} JP
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="getBySemester(tingkat, 'Ganjil').length === 0"
                    class="text-center py-8 text-gray-400"
                  >
                    Belum ada mata pelajaran
                  </div>

                  <!-- Total JP -->
                  <div
                    v-if="getBySemester(tingkat, 'Ganjil').length > 0"
                    class="bg-blue-100 rounded-lg p-3 mt-4"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-blue-800">Total Jam Pelajaran</span>
                      <span class="bg-blue-600 text-white px-4 py-1 rounded-full font-bold">
                        {{ getTotalJP(tingkat, 'Ganjil') }} JP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Semester Genap -->
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-600">
                  📗 Semester Genap
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="item in getBySemester(tingkat, 'Genap')"
                    :key="item.id"
                    class="bg-gray-50 rounded-lg p-4 hover:bg-green-50 transition-colors"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p class="font-semibold text-gray-800">
                          {{ item.mata_pelajaran?.nama_mapel || 'N/A' }}
                        </p>
                        <p
                          v-if="item.mata_pelajaran?.kode_mapel"
                          class="text-xs text-gray-500 mt-1"
                        >
                          Kode: {{ item.mata_pelajaran.kode_mapel }}
                        </p>
                      </div>
                      <span
                        class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold ml-3"
                      >
                        {{ item.jam_per_minggu }} JP
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="getBySemester(tingkat, 'Genap').length === 0"
                    class="text-center py-8 text-gray-400"
                  >
                    Belum ada mata pelajaran
                  </div>

                  <!-- Total JP -->
                  <div
                    v-if="getBySemester(tingkat, 'Genap').length > 0"
                    class="bg-green-100 rounded-lg p-3 mt-4"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-green-800">Total Jam Pelajaran</span>
                      <span class="bg-green-600 text-white px-4 py-1 rounded-full font-bold">
                        {{ getTotalJP(tingkat, 'Genap') }} JP
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
      <div
        v-else-if="selectedKonsentrasi && filteredKurikulum.length === 0"
        class="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <p class="text-gray-600">Belum ada struktur kurikulum untuk konsentrasi ini.</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">Silakan pilih konsentrasi keahlian terlebih dahulu.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/api/axios'

const kurikulumList = ref([])
const konsentrasiList = ref([])
const loading = ref(true)
const selectedKonsentrasi = ref('')

const fetchKurikulum = async () => {
  try {
    const response = await apiClient.get('/struktur-kurikulum', {
      params: { per_page: 1000 },
    })
    kurikulumList.value = response.data.data.data || response.data.data || []
  } catch (error) {
    console.error('Error fetching kurikulum:', error)
  } finally {
    loading.value = false
  }
}

const fetchKonsentrasi = async () => {
  try {
    const response = await apiClient.get('/konsentrasi-keahlian')
    konsentrasiList.value = response.data.data.filter((k) => k.status === 'aktif')
  } catch (error) {
    console.error('Error fetching konsentrasi:', error)
  }
}

const filteredKurikulum = computed(() => {
  if (!selectedKonsentrasi.value) return []
  return kurikulumList.value.filter((k) => k.konsentrasi_keahlian_id == selectedKonsentrasi.value)
})

const getByTingkat = (tingkat) => {
  return filteredKurikulum.value.filter((k) => k.tingkat === tingkat)
}

const getBySemester = (tingkat, semester) => {
  return filteredKurikulum.value.filter((k) => k.tingkat === tingkat && k.semester === semester)
}

const getTotalJP = (tingkat, semester) => {
  return getBySemester(tingkat, semester).reduce((sum, item) => sum + (item.jam_per_minggu || 0), 0)
}

const filterData = () => {
  // Trigger computed
}

onMounted(() => {
  fetchKurikulum()
  fetchKonsentrasi()
})
</script>
