<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Instagram</h1>
        <p class="text-gray-500 text-sm mt-1">
          Kelola postingan Instagram yang ditampilkan di website
        </p>
      </div>
      <button
        @click="openModal()"
        class="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
      >
        + Tambah Post
      </button>
    </div>

    <!-- Alert -->
    <div
      v-if="alertMsg"
      :class="
        alertType === 'success'
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-700'
      "
      class="mb-6 p-4 border rounded-lg text-sm"
    >
      {{ alertMsg }}
    </div>

    <!-- Grid Posts -->
    <div v-if="loading" class="text-center py-16 text-gray-400">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-3"
      ></div>
      <p>Memuat data...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">📸</p>
      <p>Belum ada postingan Instagram</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Gambar -->
        <div class="relative aspect-square">
          <img
            :src="`http://localhost:8000/storage/${post.gambar}`"
            :alt="post.caption"
            class="w-full h-full object-cover"
          />
          <!-- Badge status -->
          <span
            :class="post.is_active ? 'bg-green-500' : 'bg-gray-400'"
            class="absolute top-2 right-2 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ post.is_active ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>
        <!-- Info -->
        <div class="p-3">
          <p class="text-xs text-gray-600 line-clamp-2 min-h-[2rem]">
            {{ post.caption || '-' }}
          </p>
          <p class="text-xs text-pink-500 mt-1 truncate">
            <a :href="post.link_post" target="_blank">🔗 Lihat di Instagram</a>
          </p>
          <!-- Aksi -->
          <div class="flex gap-2 mt-3">
            <button
              @click="toggleStatus(post)"
              :class="
                post.is_active
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              "
              class="flex-1 py-1.5 rounded-lg text-xs font-medium transition"
            >
              {{ post.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
            </button>
            <button
              @click="openModal(post)"
              class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs transition"
            >
              ✏️
            </button>
            <button
              @click="confirmDelete(post)"
              class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs transition"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl overflow-y-auto max-h-[90vh]"
      >
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          {{ editMode ? 'Edit Post' : 'Tambah Post Instagram' }}
        </h3>

        <form @submit.prevent="submitForm">
          <!-- Preview Gambar -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ form.tipe === 'video' ? 'Thumbnail Video' : 'Gambar' }}
              <span class="text-red-500">*</span>
            </label>
            <div v-if="previewImage" class="mb-2 aspect-square w-32 rounded-lg overflow-hidden">
              <img :src="previewImage" class="w-full h-full object-cover" />
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              :required="!editMode"
              class="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
            <p v-if="errors.gambar" class="text-xs text-red-500 mt-1">{{ errors.gambar[0] }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipe Konten <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.tipe"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
            >
              <option value="foto">📷 Foto</option>
              <option value="video">🎥 Video</option>
            </select>
          </div>

          <!-- Link Video — tampil hanya jika tipe video -->
          <div v-if="form.tipe === 'video'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Link Video (mp4/drive) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.link_video"
              type="url"
              placeholder="https://drive.google.com/..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
            />
            <p class="text-xs text-gray-400 mt-1">Gunakan Google Drive / link langsung .mp4</p>
            <p v-if="errors.link_video" class="text-xs text-red-500 mt-1">
              {{ errors.link_video[0] }}
            </p>
          </div>

          <!-- Link Post -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Link Post Instagram <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.link_post"
              type="url"
              placeholder="https://www.instagram.com/p/..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
            />
            <p v-if="errors.link_post" class="text-xs text-red-500 mt-1">
              {{ errors.link_post[0] }}
            </p>
          </div>

          <!-- Caption -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <textarea
              v-model="form.caption"
              rows="3"
              placeholder="Caption postingan (opsional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
            ></textarea>
            <p v-if="errors.caption" class="text-xs text-red-500 mt-1">{{ errors.caption[0] }}</p>
          </div>

          <!-- Status -->
          <div class="mb-6 flex items-center gap-2">
            <input type="checkbox" id="is_active" v-model="form.is_active" class="rounded" />
            <label for="is_active" class="text-sm text-gray-700">Tampilkan di website</label>
          </div>

          <div class="flex gap-3 justify-end">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="processing"
              class="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
            >
              {{ processing ? 'Menyimpan...' : editMode ? 'Simpan Perubahan' : 'Tambah Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Post?</h3>
        <p class="text-gray-500 text-sm mb-6">Post ini akan dihapus permanen dari website.</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
          >
            Batal
          </button>
          <button
            @click="deletePost"
            :disabled="processing"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm transition"
          >
            {{ processing ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import instagramService from '@/api/instagram'

const posts = ref([])
const loading = ref(true)
const processing = ref(false)
const alertMsg = ref('')
const alertType = ref('success')
const showModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
const selectedItem = ref(null)
const previewImage = ref(null)
const errors = ref({})

const form = ref({
  caption: '',
  link_post: '',
  tipe: 'foto',
  link_video: '',
  is_active: true,
  gambar: null,
})

const showAlert = (msg, type = 'success') => {
  alertMsg.value = msg
  alertType.value = type
  setTimeout(() => (alertMsg.value = ''), 3000)
}

const fetchPosts = async () => {
  try {
    const res = await instagramService.adminGetAll()
    posts.value = res.data.data
  } catch (e) {
    showAlert('Gagal memuat data', 'error')
  } finally {
    loading.value = false
  }
}

const openModal = (post = null) => {
  errors.value = {}
  if (post) {
    editMode.value = true
    selectedItem.value = post
    form.value = {
      caption: post.caption || '',
      link_post: post.link_post,
      tipe: post.tipe || 'foto',
      link_video: post.link_video || '',
      is_active: post.is_active,
      gambar: null,
    }
    previewImage.value = `http://localhost:8000/storage/${post.gambar}`
  } else {
    editMode.value = false
    selectedItem.value = null
    form.value = { caption: '', link_post: '', is_active: true, gambar: null }
    previewImage.value = null
  }
  showModal.value = true
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.gambar = file
  previewImage.value = URL.createObjectURL(file)
}

const submitForm = async () => {
  processing.value = true
  errors.value = {}

  const formData = new FormData()
  formData.append('caption', form.value.caption)
  formData.append('link_post', form.value.link_post)
  formData.append('tipe', form.value.tipe)
  formData.append('is_active', form.value.is_active ? 1 : 0)
  if (form.value.gambar) formData.append('gambar', form.value.gambar)
  if (form.value.link_video) formData.append('link_video', form.value.link_video)

  try {
    if (editMode.value) {
      await instagramService.update(selectedItem.value.id, formData)
      showAlert('Post berhasil diperbarui')
    } else {
      await instagramService.create(formData)
      showAlert('Post berhasil ditambahkan')
    }
    showModal.value = false // ← ini yang menutup form
    await fetchPosts() // ← pakai await agar data fresh sebelum render
  } catch (e) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors
    } else {
      showAlert('Gagal menyimpan data', 'error')
    }
  } finally {
    processing.value = false
  }
}

const toggleStatus = async (post) => {
  try {
    await instagramService.toggleStatus(post.id)
    post.is_active = !post.is_active
    showAlert('Status berhasil diperbarui')
  } catch (e) {
    showAlert('Gagal mengubah status', 'error')
  }
}

const confirmDelete = (post) => {
  selectedItem.value = post
  showDeleteModal.value = true
}

const deletePost = async () => {
  processing.value = true
  try {
    await instagramService.delete(selectedItem.value.id)
    posts.value = posts.value.filter((p) => p.id !== selectedItem.value.id)
    showAlert('Post berhasil dihapus')
    showDeleteModal.value = false
  } catch (e) {
    showAlert('Gagal menghapus post', 'error')
  } finally {
    processing.value = false
  }
}

onMounted(() => fetchPosts())
</script>
