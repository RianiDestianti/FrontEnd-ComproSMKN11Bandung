<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
        <p class="text-gray-600 mt-1">Kelola struktur organisasi sekolah</p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Tambah Jabatan
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading...</div>
    </div>

    <!-- Tree View / Hierarchical View -->
    <div v-else class="space-y-4">
      <!-- Root Level (Parent) -->
      <div v-for="item in rootItems" :key="item.id" class="border rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div v-if="item.foto" class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img
                :src="getImageUrl(item.foto)"
                :alt="item.nama"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ item.jabatan }}</h3>
              <p class="text-sm text-gray-600">{{ item.nama }}</p>
              <p v-if="item.nip" class="text-xs text-gray-500">NIP: {{ item.nip }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="viewDetail(item)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded"
              title="Detail"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
            <button
              @click="editItem(item)"
              class="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
              title="Edit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>
            <button
              @click="deleteItem(item.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded"
              title="Hapus"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Children Items -->
        <div
          v-if="getChildren(item.id).length > 0"
          class="ml-8 mt-4 space-y-3 border-l-2 border-gray-200 pl-4"
        >
          <div
            v-for="child in getChildren(item.id)"
            :key="child.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div v-if="child.foto" class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  :src="getImageUrl(child.foto)"
                  :alt="child.nama"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 text-sm">{{ child.jabatan }}</h4>
                <p class="text-sm text-gray-600">{{ child.nama }}</p>
                <p v-if="child.nip" class="text-xs text-gray-500">NIP: {{ child.nip }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="viewDetail(child)"
                class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Detail"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
              <button
                @click="editItem(child)"
                class="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button
                @click="deleteItem(child.id)"
                class="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Hapus"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="strukturOrganisasi.length === 0" class="text-center py-12 text-gray-500">
        Belum ada data struktur organisasi
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ isEdit ? 'Edit' : 'Tambah' }} Struktur Organisasi
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Jabatan <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.jabatan"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Kepala Sekolah"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nama <span class="text-red-500">*</span></label
              >
              <input
                v-model="formData.nama"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input
                v-model="formData.nip"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NIP"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Foto</label>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Level <span class="text-red-500">*</span></label
              >
              <select
                v-model.number="formData.level"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="1">Level 1 (Kepala Sekolah)</option>
                <option value="2">Level 2 (Wakil/Staff)</option>
                <option value="3">Level 3 (Kepala Program/Staf)</option>
                <option value="3">Level 4 (Koordinator)</option>
              </select>
            </div>

            <div v-if="formData.level > 1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Parent (Atasan)</label>
              <select
                v-model.number="formData.parent_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="null">- Pilih Atasan -</option>
                <option v-for="item in parentOptions" :key="item.id" :value="item.id">
                  {{ item.jabatan }} - {{ item.nama }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Urutan <span class="text-red-500">*</span></label
              >
              <input
                v-model.number="formData.urutan"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Urutan tampilan (semakin kecil semakin atas)</p>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetailModal"
    >
      <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Struktur Organisasi</h2>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedItem" class="space-y-6">
            <div v-if="selectedItem.foto" class="flex justify-center">
              <img
                :src="getImageUrl(selectedItem.foto)"
                :alt="selectedItem.nama"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Jabatan</label>
                <p class="text-gray-900 font-medium">{{ selectedItem.jabatan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nama</label>
                <p class="text-gray-900">{{ selectedItem.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">NIP</label>
                <p class="text-gray-900">{{ selectedItem.nip || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Level</label>
                <p class="text-gray-900">Level {{ selectedItem.level }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Urutan</label>
                <p class="text-gray-900">{{ selectedItem.urutan }}</p>
              </div>
              <div v-if="selectedItem.parent_id">
                <label class="block text-sm font-medium text-gray-500 mb-1">Atasan</label>
                <p class="text-gray-900">{{ getParentName(selectedItem.parent_id) }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 pt-4 border-t">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
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
import strukturOrganisasiApi from '@/api/strukturOrganisasi'

const strukturOrganisasi = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const selectedItem = ref(null)

const formData = ref({
  jabatan: '',
  nama: '',
  nip: '',
  foto: null,
  level: 1,
  parent_id: null,
  urutan: 0,
})

const rootItems = computed(() => {
  return strukturOrganisasi.value
    .filter((item) => !item.parent_id || item.parent_id === null)
    .sort((a, b) => a.urutan - b.urutan)
})

const parentOptions = computed(() => {
  return strukturOrganisasi.value
    .filter((item) => item.level < formData.value.level)
    .sort((a, b) => a.level - b.level || a.urutan - b.urutan)
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await strukturOrganisasiApi.getAll()
    if (response.data.success) {
      strukturOrganisasi.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data struktur organisasi')
  } finally {
    loading.value = false
  }
}

const getChildren = (parentId) => {
  return strukturOrganisasi.value
    .filter((item) => item.parent_id === parentId)
    .sort((a, b) => a.urutan - b.urutan)
}

const getParentName = (parentId) => {
  const parent = strukturOrganisasi.value.find((item) => item.id === parentId)
  return parent ? `${parent.jabatan} - ${parent.nama}` : '-'
}

const getImageUrl = (foto) => {
  if (!foto) return ''
  if (foto.startsWith('http')) return foto
  // Jika foto sudah berisi path lengkap 'uploads/...'
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'
  return `${baseUrl}/${foto}`
}

const openModal = () => {
  isEdit.value = false
  selectedItem.value = null
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
}

const resetForm = () => {
  formData.value = {
    jabatan: '',
    nama: '',
    nip: '',
    foto: null,
    level: 1,
    parent_id: null,
    urutan: 0,
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.foto = file
  }
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const editItem = (item) => {
  isEdit.value = true
  selectedItem.value = item
  formData.value = {
    jabatan: item.jabatan,
    nama: item.nama,
    nip: item.nip || '',
    foto: null,
    level: item.level,
    parent_id: item.parent_id,
    urutan: item.urutan,
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    let response
    if (isEdit.value) {
      response = await strukturOrganisasiApi.update(selectedItem.value.id, formData.value)
    } else {
      response = await strukturOrganisasiApi.create(formData.value)
    }

    if (response.data.success) {
      alert(isEdit.value ? 'Data berhasil diupdate' : 'Data berhasil ditambahkan')
      closeModal()
      fetchData()
    }
  } catch (error) {
    console.error('Error saving data:', error)
    const errorMsg = error.response?.data?.message || error.message
    alert('Gagal menyimpan data: ' + errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

  try {
    const response = await strukturOrganisasiApi.delete(id)
    if (response.data.success) {
      alert('Data berhasil dihapus')
      fetchData()
    }
  } catch (error) {
    console.error('Error deleting data:', error)
    alert('Gagal menghapus data')
  }
}
</script>
