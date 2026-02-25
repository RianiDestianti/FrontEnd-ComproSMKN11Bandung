<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Data Kepala Sekolah</h1>
        <p class="text-gray-600 mt-1">Kelola data kepala sekolah SMKN 11 Bandung</p>
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
        Tambah Data
      </button>
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Pendidikan
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in kepalaSekolah" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.nama }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.nip }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.pendidikan_terakhir }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDate(item.periode_mulai) }} s/d {{ formatDate(item.periode_selesai) }}
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

      <div v-if="kepalaSekolah.length === 0" class="text-center py-8 text-gray-500">
        Belum ada data kepala sekolah
      </div>
    </div>

    <!-- Modal Form Tambah/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ isEdit ? 'Edit' : 'Tambah' }} Kepala Sekolah
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

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.nama"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <!-- NIP -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input
                v-model="formData.nip"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan NIP"
              />
            </div>

            <!-- Pendidikan Terakhir -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan Terakhir
              </label>
              <input
                v-model="formData.pendidikan_terakhir"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: S2 Pendidikan"
              />
            </div>

            <!-- Foto Upload -->
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

            <!-- Periode -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Periode Mulai </label>
                <input
                  v-model="formData.periode_mulai"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Periode Selesai
                </label>
                <input
                  v-model="formData.periode_selesai"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Sambutan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sambutan</label>
              <QuillEditor
                v-model:content="formData.sambutan"
                contentType="html"
                theme="snow"
                :toolbar="[
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ header: 1 }, { header: 2 }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ script: 'sub' }, { script: 'super' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ direction: 'rtl' }],
                  [{ size: ['small', false, 'large', 'huge'] }],
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ color: [] }, { background: [] }],
                  [{ font: [] }],
                  [{ align: [] }],
                  ['clean'],
                  ['link', 'image'],
                ]"
                placeholder="Tulis sambutan kepala sekolah"
                class="bg-white"
                style="min-height: 200px"
              />
            </div>

            <!-- Visi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Visi</label>
              <QuillEditor
                v-model:content="formData.visi"
                contentType="html"
                theme="snow"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ align: [] }],
                  ['clean'],
                ]"
                placeholder="Tulis visi sekolah"
                class="bg-white"
                style="min-height: 150px"
              />
            </div>

            <!-- Misi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Misi</label>
              <QuillEditor
                v-model:content="formData.misi"
                contentType="html"
                theme="snow"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ align: [] }],
                  ['clean'],
                ]"
                placeholder="Tulis misi sekolah (gunakan numbering/bullet)"
                class="bg-white"
                style="min-height: 200px"
              />
            </div>

            <!-- Status -->
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

            <!-- Form Actions -->
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
      <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Kepala Sekolah</h2>
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

          <!-- Detail Content -->
          <div v-if="selectedItem" class="space-y-6">
            <!-- Foto -->
            <div v-if="selectedItem.foto" class="flex justify-center">
              <img
                :src="getImageUrl(selectedItem.foto)"
                :alt="selectedItem.nama"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                <p class="text-gray-900 font-medium">{{ selectedItem.nama }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">NIP</label>
                <p class="text-gray-900">{{ selectedItem.nip || '-' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Pendidikan Terakhir
                </label>
                <p class="text-gray-900">{{ selectedItem.pendidikan_terakhir || '-' }}</p>
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

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">Periode Jabatan</label>
                <p class="text-gray-900">
                  {{ formatDate(selectedItem.periode_mulai) }} s/d
                  {{ formatDate(selectedItem.periode_selesai) }}
                </p>
              </div>
            </div>

            <!-- Sambutan -->
            <div v-if="selectedItem.sambutan" class="border-t pt-4">
              <label class="block text-sm font-medium text-gray-500 mb-2">Sambutan</label>
              <div class="prose max-w-none text-gray-900" v-html="selectedItem.sambutan"></div>
            </div>

            <!-- Visi -->
            <div v-if="selectedItem.visi" class="border-t pt-4">
              <label class="block text-sm font-medium text-gray-500 mb-2">Visi</label>
              <div class="prose max-w-none text-gray-900" v-html="selectedItem.visi"></div>
            </div>

            <!-- Misi -->
            <div v-if="selectedItem.misi" class="border-t pt-4">
              <label class="block text-sm font-medium text-gray-500 mb-2">Misi</label>
              <div class="prose max-w-none text-gray-900" v-html="selectedItem.misi"></div>
            </div>
          </div>

          <!-- Close Button -->
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

<style>
.ql-editor {
  min-height: 150px;
  max-height: 400px;
  overflow-y: auto;
}

.ql-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import kepalaSekolahApi from '@/api/kepalaSekolah'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const kepalaSekolah = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const selectedItem = ref(null)

const formData = ref({
  nama: '',
  nip: '',
  foto: null,
  pendidikan_terakhir: '',
  periode_mulai: '',
  periode_selesai: '',
  sambutan: '',
  visi: '',
  misi: '',
  status: 'aktif',
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await kepalaSekolahApi.getAll()

    if (response.data.success) {
      kepalaSekolah.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data kepala sekolah')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
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
    nama: '',
    nip: '',
    foto: null,
    pendidikan_terakhir: '',
    periode_mulai: '',
    periode_selesai: '',
    sambutan: '',
    visi: '',
    misi: '',
    status: 'aktif',
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.foto = file
  }
}

const getImageUrl = (foto) => {
  if (!foto) return ''
  if (foto.startsWith('http')) return foto

  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'
  const fullUrl = `${baseUrl}/${foto}`

  console.log('🖼️ Foto path:', foto)
  console.log('🌐 Full URL:', fullUrl)

  return fullUrl
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const editItem = (item) => {
  isEdit.value = true
  selectedItem.value = item
  formData.value = {
    nama: item.nama,
    nip: item.nip,
    foto: null,
    pendidikan_terakhir: item.pendidikan_terakhir,
    periode_mulai: item.periode_mulai,
    periode_selesai: item.periode_selesai,
    sambutan: item.sambutan || '',
    visi: item.visi || '',
    misi: item.misi || '',
    status: item.status,
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // 🔥 PERBAIKAN: Kirim langsung formData.value, BUKAN buat FormData baru
    let response
    if (isEdit.value) {
      response = await kepalaSekolahApi.update(selectedItem.value.id, formData.value)
    } else {
      response = await kepalaSekolahApi.create(formData.value)
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
    const response = await kepalaSekolahApi.delete(id)

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
