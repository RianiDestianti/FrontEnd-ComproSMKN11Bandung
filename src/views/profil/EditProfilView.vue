<template>
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Edit Profil Sekolah</h1>
          <p class="text-gray-600 mt-1">Perbarui informasi sekolah</p>
        </div>

        <!-- Alert -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-6">
          
          <!-- Nama Sekolah -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nama Sekolah *
            </label>
            <input
              v-model="form.nama_sekolah"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- NPSN & NSS -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NPSN</label>
              <input v-model="form.npsn" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NSS</label>
              <input v-model="form.nss" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <!-- Alamat -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea v-model="form.alamat" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <!-- Kota, Provinsi, Kode Pos -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kota</label>
              <input v-model="form.kota" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <input v-model="form.provinsi" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
              <input v-model="form.kode_pos" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <!-- Email, Telepon, Website -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
              <input v-model="form.no_telepon" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input v-model="form.website" type="url" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <!-- Sejarah -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sejarah</label>
            <QuillEditor 
              v-model:content="form.sejarah"
              contentType="html"
              theme="snow"
              :toolbar="toolbarOptions"
              style="min-height: 250px;"
            />
          </div>

          <!-- Visi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Visi</label>
            <QuillEditor 
              v-model:content="form.visi"
              contentType="html"
              theme="snow"
              :toolbar="toolbarOptions"
              style="min-height: 200px;"
            />
          </div>

          <!-- Misi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Misi</label>
            <QuillEditor 
              v-model:content="form.misi"
              contentType="html"
              theme="snow"
              :toolbar="toolbarOptions"
              style="min-height: 250px;"
            />
          </div>

          <!-- Tujuan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
            <QuillEditor 
              v-model:content="form.tujuan"
              contentType="html"
              theme="snow"
              :toolbar="toolbarOptions"
              style="min-height: 200px;"
            />
          </div>

          <!-- Logo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo Sekolah</label>
            <input 
              type="file" 
              @change="handleFileChange"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max: 2MB)</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="profilStore.loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ profilStore.loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
            <button
              type="button"
              @click="$router.push('/admin')"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>

        </form>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfilStore } from '@/stores/profil'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const profilStore = useProfilStore()

const form = reactive({
  nama_sekolah: '',
  npsn: '',
  nss: '',
  alamat: '',
  kota: '',
  provinsi: '',
  kode_pos: '',
  no_telepon: '',
  email: '',
  website: '',
  visi: '',
  misi: '',
  tujuan: '',
  sejarah: ''
})

const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'align': [] }],
  [{ 'color': [] }, { 'background': [] }],
  ['link'],
  ['clean']
]

const logoFile = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const handleFileChange = (event) => {
  logoFile.value = event.target.files[0]
}

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  let result

  // Jika ada file upload
  if (logoFile.value) {
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (form[key]) formData.append(key, form[key])
    })
    formData.append('logo', logoFile.value)
    
    result = await profilStore.updateProfilWithFile(profilStore.profil.id, formData)
  } else {
    result = await profilStore.updateProfil(profilStore.profil.id, form)
  }

  console.log('Result from API:', result) // ← Tambahkan ini untuk debug

  if (result && result.success) {
    successMessage.value = 'Profil sekolah berhasil diupdate!'
    setTimeout(() => {
      router.push('/admin')
    }, 2000)
  } else {
    errorMessage.value = result?.message || 'Gagal mengupdate profil sekolah'
    console.error('Error:', result) // ← Debug error juga
  }
}

onMounted(async () => {
  await profilStore.fetchProfil()
  if (profilStore.profil) {
    Object.keys(form).forEach(key => {
      form[key] = profilStore.profil[key] || ''
    })
  }
})
</script>