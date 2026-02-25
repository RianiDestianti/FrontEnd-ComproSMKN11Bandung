<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Testimoni</h1>
        <p class="text-gray-500 text-sm mt-1">Kelola testimoni yang masuk dari pengguna</p>
      </div>
    </div>

    <!-- Alert -->
    <div
      v-if="alertMsg"
      :class="
        alertType === 'success'
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-700'
      "
      class="mb-6 p-4 border rounded-lg flex items-center text-sm"
    >
      {{ alertMsg }}
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="filterStatus = tab.value"
        :class="
          filterStatus === tab.value
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        "
        class="px-4 py-2 rounded-lg text-sm font-medium border transition"
      >
        {{ tab.label }}
        <span
          class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
          :class="filterStatus === tab.value ? 'bg-white/20' : 'bg-gray-100'"
        >
          {{ countByStatus(tab.value) }}
        </span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="text-center py-16 text-gray-400">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"
        ></div>
        <p>Memuat data...</p>
      </div>

      <div v-else-if="filteredTestimonis.length === 0" class="text-center py-16 text-gray-400">
        <p class="text-4xl mb-3">💬</p>
        <p>Tidak ada testimoni</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Pengirim
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Testimoni
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(t, index) in filteredTestimonis" :key="t.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm"
                >
                  {{ t.nama.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ t.nama }}</p>
                  <p v-if="t.jabatan" class="text-xs text-gray-500">{{ t.jabatan }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
              <p class="line-clamp-2">{{ t.isi }}</p>
            </td>
            <td class="px-6 py-4">
              <div class="flex">
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="i <= t.rating ? 'text-yellow-400' : 'text-gray-200'"
                  class="text-sm"
                  >★</span
                >
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="
                  t.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                "
                class="px-2 py-1 rounded-full text-xs font-semibold"
              >
                {{ t.status === 'published' ? 'Published' : 'Pending' }}
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-gray-500">{{ formatDate(t.created_at) }}</td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <!-- Publish / Unpublish -->
                <button
                  v-if="t.status === 'pending'"
                  @click="updateStatus(t, 'published')"
                  title="Publish"
                  class="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition text-xs font-medium"
                >
                  ✓ Publish
                </button>
                <button
                  v-else
                  @click="updateStatus(t, 'pending')"
                  title="Unpublish"
                  class="p-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition text-xs font-medium"
                >
                  ↩ Unpublish
                </button>
                <!-- Hapus -->
                <button
                  @click="confirmDelete(t)"
                  class="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition text-xs font-medium"
                >
                  🗑
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Testimoni?</h3>
        <p class="text-gray-500 text-sm mb-6">
          Testimoni dari <strong>{{ selectedItem?.nama }}</strong> akan dihapus permanen.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
          >
            Batal
          </button>
          <button
            @click="deleteTestimoni"
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
import { ref, computed, onMounted } from 'vue'
import testimoniService from '@/api/testimoni.js'

const testimonis = ref([])
const loading = ref(true)
const processing = ref(false)
const filterStatus = ref('all')
const alertMsg = ref('')
const alertType = ref('success')
const showDeleteModal = ref(false)
const selectedItem = ref(null)

const tabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Published', value: 'published' },
]

const filteredTestimonis = computed(() => {
  if (filterStatus.value === 'all') return testimonis.value
  return testimonis.value.filter((t) => t.status === filterStatus.value)
})

const countByStatus = (status) => {
  if (status === 'all') return testimonis.value.length
  return testimonis.value.filter((t) => t.status === status).length
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const showAlert = (msg, type = 'success') => {
  alertMsg.value = msg
  alertType.value = type
  setTimeout(() => (alertMsg.value = ''), 3000)
}

const fetchTestimonis = async () => {
  try {
    const res = await testimoniService.adminGetAll()
    testimonis.value = res.data.data
  } catch (e) {
    showAlert('Gagal memuat data testimoni', 'error')
  } finally {
    loading.value = false
  }
}

const updateStatus = async (item, status) => {
  try {
    await testimoniService.updateStatus(item.id, status)
    item.status = status
    showAlert(`Testimoni berhasil di-${status === 'published' ? 'publish' : 'unpublish'}`)
  } catch (e) {
    showAlert('Gagal mengubah status', 'error')
  }
}

const confirmDelete = (item) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const deleteTestimoni = async () => {
  processing.value = true
  try {
    await testimoniService.delete(selectedItem.value.id)
    testimonis.value = testimonis.value.filter((t) => t.id !== selectedItem.value.id)
    showAlert('Testimoni berhasil dihapus')
    showDeleteModal.value = false
  } catch (e) {
    showAlert('Gagal menghapus testimoni', 'error')
  } finally {
    processing.value = false
  }
}

onMounted(() => fetchTestimonis())
</script>
