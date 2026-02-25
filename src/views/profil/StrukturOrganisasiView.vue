<template>
  <div class="min-h-screen bg-gray-50 relative">
    <!-- Header -->
    <div class="relative bg-blue-600 text-white py-12 overflow-hidden">
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/images/bg_struktur.png')"
      ></div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-blue-700/40"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <h1 class="text-3xl font-bold">Struktur Organisasi</h1>
        <p class="mt-2">Kelola struktur organisasi sekolah</p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <p class="text-gray-600">Memuat struktur organisasi...</p>
      </div>

      <!-- Organizational Chart -->
      <div v-else class="bg-white rounded-lg shadow-md p-8">
        <!-- Root Level (Kepala Sekolah) -->
        <div v-for="root in rootNodes" :key="root.id" class="mb-8">
          <!-- Kepala Sekolah Card -->
          <div class="flex justify-center mb-8">
            <div
              class="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl shadow-xl p-6 max-w-sm w-full"
            >
              <div class="flex items-center gap-4">
                <div class="relative">
                  <img
                    v-if="root.foto"
                    :src="`http://localhost:8000/${root.foto}`"
                    :alt="root.nama"
                    class="w-20 h-20 rounded-full object-contain bg-white p-1 border-4 border-white shadow-lg"
                  />
                  <div
                    v-else
                    class="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl border-4 border-white shadow-lg"
                  >
                    👤
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-lg">{{ root.jabatan }}</h3>
                  <p class="text-blue-100 font-semibold">{{ root.nama }}</p>
                  <p v-if="root.nip" class="text-xs text-blue-200">NIP: {{ root.nip }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Level 2 - Wakil Kepala Sekolah -->
          <div v-if="getChildren(root.id).length > 0" class="relative">
            <!-- Connector Line -->
            <div class="absolute left-1/2 top-0 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 relative">
              <!-- Horizontal Line -->
              <div class="absolute left-0 right-0 top-0 h-0.5 bg-gray-300" style="top: -2rem"></div>

              <div v-for="(child, index) in getChildren(root.id)" :key="child.id" class="relative">
                <!-- Vertical Connector -->
                <div class="absolute left-1/2 -top-8 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>

                <!-- Wakil Card -->
                <div
                  class="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg shadow-lg p-4 h-full"
                >
                  <div class="flex flex-col items-center text-center">
                    <div class="relative mb-3">
                      <img
                        v-if="child.foto"
                        :src="`http://localhost:8000/${child.foto}`"
                        :alt="child.nama"
                        class="w-16 h-16 rounded-full object-contain bg-white p-1 border-3 border-white shadow-md"
                      />
                      <div
                        v-else
                        class="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl border-3 border-white shadow-md"
                      >
                        👤
                      </div>
                    </div>
                    <h4 class="font-bold text-sm mb-1">{{ child.jabatan }}</h4>
                    <p class="text-xs text-green-100 font-semibold">{{ child.nama }}</p>
                    <p v-if="child.nip" class="text-xs text-green-200 mt-1">{{ child.nip }}</p>
                  </div>

                  <!-- Level 3 - Kepala Program Keahlian -->
                  <div
                    v-if="getChildren(child.id).length > 0"
                    class="mt-4 pt-4 border-t border-green-400"
                  >
                    <div class="space-y-2">
                      <div
                        v-for="grandChild in getChildren(child.id)"
                        :key="grandChild.id"
                        class="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all cursor-pointer"
                        @click.stop="showDetail(grandChild)"
                      >
                        <div class="flex items-center gap-2">
                          <img
                            v-if="grandChild.foto"
                            :src="`http://localhost:8000/${grandChild.foto}`"
                            :alt="grandChild.nama"
                            class="w-10 h-10 rounded-full object-contain bg-white p-0.5"
                          />
                          <div
                            v-else
                            class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg"
                          >
                            👤
                          </div>
                          <div class="flex-1 text-left">
                            <p class="font-bold text-xs">{{ grandChild.jabatan }}</p>
                            <p class="text-xs">{{ grandChild.nama }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="rootNodes.length === 0" class="text-center py-12">
          <p class="text-gray-500">Belum ada data struktur organisasi</p>
        </div>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="selectedItem"
      @click="selectedItem = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div @click.stop class="bg-white rounded-xl max-w-md w-full">
        <div class="p-6">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-800">Detail Jabatan</h3>
            <button @click="selectedItem = null" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">×</span>
            </button>
          </div>

          <!-- Content -->
          <div class="text-center">
            <div class="mb-4">
              <img
                v-if="selectedItem.foto"
                :src="`http://localhost:8000/${selectedItem.foto}`"
                :alt="selectedItem.nama"
                class="w-32 h-32 rounded-full object-contain bg-gray-100 p-2 mx-auto border-4 border-blue-100"
              />
              <div
                v-else
                class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl mx-auto"
              >
                👤
              </div>
            </div>

            <h4 class="text-lg font-bold text-blue-600 mb-2">{{ selectedItem.jabatan }}</h4>
            <p class="text-xl font-semibold text-gray-800 mb-1">{{ selectedItem.nama }}</p>
            <p v-if="selectedItem.nip" class="text-sm text-gray-600">NIP: {{ selectedItem.nip }}</p>

            <div class="mt-4 pt-4 border-t">
              <div class="text-sm text-gray-500">
                <p>Level: {{ selectedItem.level }}</p>
                <p>Urutan: {{ selectedItem.urutan }}</p>
              </div>
            </div>
          </div>

          <!-- Close Button -->
          <div class="mt-6">
            <button
              @click="selectedItem = null"
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

const strukturList = ref([])
const loading = ref(true)
const selectedItem = ref(null)

const fetchStrukturOrganisasi = async () => {
  try {
    const response = await apiClient.get('/struktur-organisasi')
    strukturList.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching struktur organisasi:', error)
  } finally {
    loading.value = false
  }
}

// Get root nodes (level 1 - Kepala Sekolah)
const rootNodes = computed(() => {
  return strukturList.value.filter((item) => item.level === 1)
})

// Get children by parent_id
const getChildren = (parentId) => {
  return strukturList.value
    .filter((item) => item.parent_id === parentId)
    .sort((a, b) => a.urutan - b.urutan)
}

const showDetail = (item) => {
  console.log('Show detail clicked:', item) // Untuk debugging
  selectedItem.value = item
}

onMounted(() => {
  fetchStrukturOrganisasi()
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
