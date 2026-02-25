<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Kontak</h1>
        <p class="mt-2">Hubungi kami untuk informasi lebih lanjut</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <!-- Success Message -->
        <div v-if="showSuccess" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p class="font-semibold text-green-800">Pesan Berhasil Dikirim!</p>
              <p class="text-sm text-green-700">
                Terima kasih telah menghubungi kami. Pesan Anda akan segera kami proses.
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Formulir Kontak</h2>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Honeypot (anti-bot) - hidden field -->
            <input
              v-model="form.website"
              type="text"
              name="website"
              style="display: none"
              tabindex="-1"
              autocomplete="off"
            />

            <!-- Nama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nama"
                type="text"
                required
                maxlength="100"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.nama }"
                placeholder="Masukkan nama lengkap Anda"
              />
              <p v-if="errors.nama" class="mt-1 text-sm text-red-600">{{ errors.nama[0] }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                maxlength="100"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.email }"
                placeholder="contoh@email.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
            </div>

            <!-- No. Telepon -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon <span class="text-gray-400">(Opsional)</span>
              </label>
              <input
                v-model="form.no_telepon"
                type="tel"
                maxlength="20"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.no_telepon }"
                placeholder="08xxxxxxxxxx"
                @input="validatePhone"
              />
              <p v-if="errors.no_telepon" class="mt-1 text-sm text-red-600">
                {{ errors.no_telepon[0] }}
              </p>
            </div>

            <!-- Subjek -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Subjek <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.subjek"
                type="text"
                required
                maxlength="200"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.subjek }"
                placeholder="Perihal pesan Anda"
              />
              <p v-if="errors.subjek" class="mt-1 text-sm text-red-600">{{ errors.subjek[0] }}</p>
            </div>

            <!-- Pesan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pesan <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.pesan"
                rows="8"
                required
                maxlength="5000"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                :class="{ 'border-red-500': errors.pesan }"
                placeholder="Tulis pesan Anda di sini..."
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">{{ pesanLength }}/5000 karakter</p>
              <p v-if="errors.pesan" class="mt-1 text-sm text-red-600">{{ errors.pesan[0] }}</p>
            </div>

            <!-- Rate Limit Warning -->
            <div
              v-if="rateLimitWarning"
              class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg"
            >
              <p class="text-sm text-yellow-800">
                ⚠️ Anda dapat mengirim pesan lagi dalam {{ rateLimitTimer }} detik.
              </p>
            </div>

            <!-- Submit Button -->
            <div class="flex items-center justify-between pt-4">
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                :disabled="submitting || rateLimitWarning"
                class="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="submitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ submitting ? 'Mengirim...' : 'Kirim Pesan' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Info Box -->
        <div class="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 class="font-semibold text-blue-900 mb-2">📧 Informasi</h3>
          <p class="text-sm text-blue-800">
            Pesan Anda akan divalidasi terlebih dahulu oleh admin sebelum mendapat tanggapan. Kami
            akan berusaha merespons dalam waktu 1-2 hari kerja.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import kontakService from '@/api/kontak.js'

// Form data
const form = ref({
  nama: '',
  email: '',
  no_telepon: '',
  subjek: '',
  pesan: '',
  website: '', // Honeypot field
})

// States
const submitting = ref(false)
const showSuccess = ref(false)
const errors = ref({})

// Rate limiting
const rateLimitWarning = ref(false)
const rateLimitTimer = ref(60)
let rateLimitInterval = null

// Computed
const pesanLength = computed(() => {
  return form.value.pesan.length
})

const validatePhone = () => {
  const phone = form.value.no_telepon
  if (phone && !/^[0-9+\-\s()]*$/.test(phone)) {
    form.value.no_telepon = phone.replace(/[^0-9+\-\s()]/g, '')
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Validate nama
  if (!form.value.nama.trim()) {
    errors.value.nama = ['Nama harus diisi']
    isValid = false
  } else if (form.value.nama.length > 100) {
    errors.value.nama = ['Nama maksimal 100 karakter']
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = ['Email harus diisi']
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = ['Format email tidak valid']
    isValid = false
  }

  // Validate subjek
  if (!form.value.subjek.trim()) {
    errors.value.subjek = ['Subjek harus diisi']
    isValid = false
  } else if (form.value.subjek.length > 200) {
    errors.value.subjek = ['Subjek maksimal 200 karakter']
    isValid = false
  }

  // Validate pesan
  if (!form.value.pesan.trim()) {
    errors.value.pesan = ['Pesan harus diisi']
    isValid = false
  } else if (form.value.pesan.trim().length < 10) {
    errors.value.pesan = ['Pesan minimal 10 karakter']
    isValid = false
  } else if (form.value.pesan.length > 5000) {
    errors.value.pesan = ['Pesan maksimal 5000 karakter']
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  // Check honeypot (anti-bot)
  if (form.value.website) {
    console.warn('Bot detected')
    return
  }

  // Validate
  if (!validateForm()) {
    return
  }

  // Check rate limit
  const lastSubmit = localStorage.getItem('lastContactSubmit')
  if (lastSubmit) {
    const timeDiff = Date.now() - parseInt(lastSubmit)
    if (timeDiff < 30000) {
      startRateLimitTimer(30 - Math.floor(timeDiff / 1000))
      return
    }
  }

  try {
    submitting.value = true
    errors.value = {}

    const data = {
      nama: form.value.nama.trim(),
      email: form.value.email.trim().toLowerCase(),
      no_telepon: form.value.no_telepon.trim() || null,
      subjek: form.value.subjek.trim(),
      pesan: form.value.pesan.trim(),
    }

    console.log('Sending data:', data)

    const response = await kontakService.create(data)

    console.log('Full Response:', response)
    console.log('Response Data:', response.data)

    // Cek response dari axios
    if (response.data && response.data.success) {
      console.log('Success! Showing notification...')

      // Reset form dulu
      resetForm()

      // Tampilkan success message
      showSuccess.value = true

      // Save timestamp untuk rate limiting
      localStorage.setItem('lastContactSubmit', Date.now().toString())

      // Scroll ke atas untuk lihat notifikasi
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Auto hide setelah 10 detik
      setTimeout(() => {
        showSuccess.value = false
      }, 10000)
    } else {
      throw new Error('Response tidak valid')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    console.error('Error response:', error.response)

    // Handle validation errors dari Laravel
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      // Handle general errors
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.'
      alert(errorMsg)
    }
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    nama: '',
    email: '',
    no_telepon: '',
    subjek: '',
    pesan: '',
    website: '',
  }

  errors.value = {}
}

const startRateLimitTimer = (seconds) => {
  rateLimitWarning.value = true
  rateLimitTimer.value = seconds

  rateLimitInterval = setInterval(() => {
    rateLimitTimer.value--
    if (rateLimitTimer.value <= 0) {
      clearInterval(rateLimitInterval)
      rateLimitWarning.value = false
    }
  }, 1000)
}

// Lifecycle
onMounted(() => {
  // Check if rate limit is active on mount
  const lastSubmit = localStorage.getItem('lastContactSubmit')
  if (lastSubmit) {
    const timeDiff = Date.now() - parseInt(lastSubmit)
    if (timeDiff < 30000) {
      startRateLimitTimer(30 - Math.floor(timeDiff / 1000))
    }
  }
})

onUnmounted(() => {
  if (rateLimitInterval) {
    clearInterval(rateLimitInterval)
  }
})
</script>
