<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-800">⭐ Apa Kata Mereka?</h2>
        <p class="text-gray-500 mt-2">Testimoni dari warga sekolah kami</p>
      </div>

      <!-- Carousel -->
      <div v-if="testimonis.length > 0" class="relative">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${current * (100 / slidesPerView)}%)` }"
          >
            <div
              v-for="t in testimonis"
              :key="t.id"
              :style="{ minWidth: `${100 / slidesPerView}%` }"
              class="px-3"
            >
              <div class="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
                <!-- Rating -->
                <div class="flex mb-3">
                  <span
                    v-for="i in 5"
                    :key="i"
                    :class="i <= t.rating ? 'text-yellow-400' : 'text-gray-200'"
                    class="text-lg"
                    >★</span
                  >
                </div>
                <!-- Isi -->
                <p class="text-gray-600 text-sm leading-relaxed flex-1">"{{ t.isi }}"</p>
                <!-- Profil -->
                <div class="flex items-center mt-4 pt-4 border-t border-gray-100">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold"
                  >
                    {{ t.nama.charAt(0) }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-semibold text-gray-800">{{ t.nama }}</p>
                    <p v-if="t.jabatan" class="text-xs text-gray-500">{{ t.jabatan }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prev/Next -->
        <button
          @click="move(-1)"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-blue-50"
        >
          ‹
        </button>
        <button
          @click="move(1)"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-blue-50"
        >
          ›
        </button>

        <!-- Dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="i in totalPages"
            :key="i"
            @click="current = i - 1"
            :class="current === i - 1 ? 'bg-blue-600 w-4' : 'bg-gray-300 w-2.5'"
            class="h-2.5 rounded-full transition-all duration-300"
          ></button>
        </div>
      </div>

      <p v-else-if="!loading" class="text-center text-gray-400">Belum ada testimoni.</p>

      <!-- Form -->
      <div class="mt-16 bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">✏️ Tulis Testimoni</h3>

        <div
          v-if="successMsg"
          class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm"
        >
          {{ successMsg }}
        </div>

        <form @submit.prevent="submitTestimoni">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nama <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.nama"
              type="text"
              placeholder="Nama Anda"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p v-if="errors.nama" class="text-xs text-red-500 mt-1">{{ errors.nama[0] }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
            <input
              v-model="form.jabatan"
              type="text"
              placeholder="Contoh: Guru, Wali Murid (opsional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Testimoni <span class="text-red-500">*</span></label
            >
            <textarea
              v-model="form.isi"
              rows="4"
              placeholder="Ceritakan pengalaman Anda..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            ></textarea>
            <p v-if="errors.isi" class="text-xs text-red-500 mt-1">{{ errors.isi[0] }}</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Rating <span class="text-red-500">*</span></label
            >
            <div class="flex gap-1">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="form.rating = i"
                :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
                class="text-3xl hover:text-yellow-400 transition focus:outline-none"
              >
                ★
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition text-sm"
          >
            {{ submitting ? 'Mengirim...' : '📨 Kirim Testimoni' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import testimoniService from '@/api/testimoni'

const testimonis = ref([])
const loading = ref(true)
const current = ref(0)
const slidesPerView = ref(3)
const submitting = ref(false)
const successMsg = ref('')
const errors = ref({})

const form = ref({ nama: '', jabatan: '', isi: '', rating: 5 })

const totalPages = computed(() => Math.ceil(testimonis.value.length / slidesPerView.value))

function move(dir) {
  current.value = (current.value + dir + totalPages.value) % totalPages.value
}

function updateSlidesPerView() {
  slidesPerView.value = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
}

async function fetchTestimoni() {
  try {
    const res = await testimoniService.getAll()
    testimonis.value = res.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submitTestimoni() {
  submitting.value = true
  errors.value = {}
  successMsg.value = ''
  try {
    await testimoniService.create(form.value)
    successMsg.value = 'Terima kasih! Testimoni Anda sedang menunggu persetujuan.'
    form.value = { nama: '', jabatan: '', isi: '', rating: 5 }
  } catch (e) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors
    }
  } finally {
    submitting.value = false
  }
}

let autoplay
onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
  fetchTestimoni()
  autoplay = setInterval(() => move(1), 5000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView)
  clearInterval(autoplay)
})
</script>
