<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Konsentrasi Keahlian</h1>
        <p class="text-gray-600 mt-1">Kelola data konsentrasi keahlian SMKN 11 Bandung</p>
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
        Tambah Konsentrasi
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="mb-4 flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama konsentrasi atau kode..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="filterProgram"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Program</option>
        <option v-for="program in programKeahlianList" :key="program.id" :value="program.id">
          {{ program.nama_program }}
        </option>
      </select>
      <select
        v-model="filterStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="non-aktif">Non-Aktif</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading...</div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Nama Konsentrasi
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Program Keahlian
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Deskripsi
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in filteredData" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div v-if="item.gambar" class="w-16 h-16 rounded overflow-hidden bg-gray-200">
                <img
                  :src="getImageUrl(item.gambar)"
                  :alt="item.nama_konsentrasi"
                  class="w-full h-full object-cover"
                />
              </div>
              <div v-else class="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                <svg
                  class="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.kode_konsentrasi || '-' }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.nama_konsentrasi }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ item.program_keahlian?.nama_program || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="max-w-xs truncate">{{ item.deskripsi || '-' }}</div>
            </td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-2">
                <button
                  @click="viewDetail(item)"
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
                  @click="editItem(item)"
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
                  @click="deleteItem(item.id)"
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
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredData.length === 0" class="text-center py-8 text-gray-500">
        Belum ada data konsentrasi keahlian
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
              {{ isEdit ? 'Edit' : 'Tambah' }} Konsentrasi Keahlian
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Program Keahlian <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.program_keahlian_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">- Pilih Program Keahlian -</option>
                <option
                  v-for="program in programKeahlianList"
                  :key="program.id"
                  :value="program.id"
                >
                  {{ program.nama_program }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Kode Konsentrasi </label>
              <input
                v-model="formData.kode_konsentrasi"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: PPLG, AKL, BDP"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Konsentrasi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nama_konsentrasi"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama konsentrasi keahlian"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <QuillEditor
                v-model:content="formData.deskripsi"
                contentType="html"
                theme="snow"
                :toolbar="[
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ header: [1, 2, 3, false] }],
                  [{ align: [] }],
                  ['clean'],
                ]"
                placeholder="Deskripsi konsentrasi keahlian"
                class="bg-white"
                style="min-height: 150px"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kompetensi</label>
              <QuillEditor
                v-model:content="formData.kompetensi"
                contentType="html"
                theme="snow"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ align: [] }],
                  ['clean'],
                ]"
                placeholder="Kompetensi yang diajarkan"
                class="bg-white"
                style="min-height: 150px"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prospek Kerja</label>
              <QuillEditor
                v-model:content="formData.prospek_kerja"
                contentType="html"
                theme="snow"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ align: [] }],
                  ['clean'],
                ]"
                placeholder="Prospek kerja lulusan"
                class="bg-white"
                style="min-height: 150px"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
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
            <h2 class="text-xl font-bold text-gray-900">Detail Konsentrasi Keahlian</h2>
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
            <div v-if="selectedItem.gambar" class="flex justify-center">
              <img
                :src="getImageUrl(selectedItem.gambar)"
                :alt="selectedItem.nama_konsentrasi"
                class="w-64 h-64 rounded-lg object-cover border-4 border-gray-200"
              />
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Program Keahlian</label>
                <p class="text-gray-900 font-medium">
                  {{ selectedItem.program_keahlian?.nama_program || '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Kode Konsentrasi</label>
                <p class="text-gray-900">{{ selectedItem.kode_konsentrasi || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nama Konsentrasi</label>
                <p class="text-gray-900 font-medium">{{ selectedItem.nama_konsentrasi }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Deskripsi</label>
                <div
                  class="text-gray-900 prose max-w-none"
                  v-html="selectedItem.deskripsi || '-'"
                ></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Kompetensi</label>
                <div
                  class="text-gray-900 prose max-w-none"
                  v-html="selectedItem.kompetensi || '-'"
                ></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Prospek Kerja</label>
                <div
                  class="text-gray-900 prose max-w-none"
                  v-html="selectedItem.prospek_kerja || '-'"
                ></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-medium',
                    selectedItem.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ selectedItem.status }}
                </span>
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
import konsentrasiKeahlianApi from '@/api/konsentrasiKeahlian'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const data = ref([])
const programKeahlianList = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const selectedItem = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const filterProgram = ref('')

const formData = ref({
  program_keahlian_id: '',
  kode_konsentrasi: '',
  nama_konsentrasi: '',
  deskripsi: '',
  kompetensi: '',
  prospek_kerja: '',
  gambar: null,
  status: 'aktif',
})

const filteredData = computed(() => {
  return data.value.filter((item) => {
    const matchSearch =
      !searchQuery.value ||
      item.nama_konsentrasi.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.kode_konsentrasi &&
        item.kode_konsentrasi.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchStatus = !filterStatus.value || item.status === filterStatus.value

    const matchProgram =
      !filterProgram.value || item.program_keahlian_id === parseInt(filterProgram.value)

    return matchSearch && matchStatus && matchProgram
  })
})

onMounted(() => {
  fetchData()
  fetchProgramKeahlian()
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await konsentrasiKeahlianApi.getAll()
    if (response.data.success) {
      data.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data konsentrasi keahlian')
  } finally {
    loading.value = false
  }
}

const fetchProgramKeahlian = async () => {
  try {
    const response = await konsentrasiKeahlianApi.getProgramKeahlianList()
    if (response.data.success) {
      programKeahlianList.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching program keahlian:', error)
  }
}

const getImageUrl = (gambar) => {
  if (!gambar) return ''
  if (gambar.startsWith('http')) return gambar
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'
  return gambar.startsWith('/') ? `${baseUrl}${gambar}` : `${baseUrl}/${gambar}`
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
    program_keahlian_id: '',
    kode_konsentrasi: '',
    nama_konsentrasi: '',
    deskripsi: '',
    kompetensi: '',
    prospek_kerja: '',
    gambar: null,
    status: 'aktif',
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.gambar = file
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
    program_keahlian_id: item.program_keahlian_id,
    kode_konsentrasi: item.kode_konsentrasi || '',
    nama_konsentrasi: item.nama_konsentrasi,
    deskripsi: item.deskripsi || '',
    kompetensi: item.kompetensi || '',
    prospek_kerja: item.prospek_kerja || '',
    gambar: null,
    status: item.status,
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    let response
    if (isEdit.value) {
      response = await konsentrasiKeahlianApi.update(selectedItem.value.id, formData.value)
    } else {
      response = await konsentrasiKeahlianApi.create(formData.value)
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
    const response = await konsentrasiKeahlianApi.delete(id)
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
