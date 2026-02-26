<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-10 space-y-3">
        <span
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100"
        >
          📷 Instagram Kami
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900">Instagram Kami</h2>
        <p class="text-gray-600">
          Ikuti kami di
          <a
            href="https://www.instagram.com/info.smkn11bandung"
            target="_blank"
            class="text-blue-600 font-semibold hover:underline"
          >
            @smkn11bandung
          </a>
        </p>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-400">Memuat...</div>

      <div v-else-if="posts.length > 0" class="relative">
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${current * (100 / slidesPerView)}%)` }"
          >
            <div
              v-for="post in posts"
              :key="post.id"
              :style="{ minWidth: `${100 / slidesPerView}%` }"
              class="px-3"
            >
              <a
                :href="post.link_post"
                target="_blank"
                class="block relative aspect-square overflow-hidden rounded-3xl shadow-lg bg-gray-100"
              >
                <img
                  :src="`http://localhost:8000/storage/${post.gambar}`"
                  :alt="post.caption"
                  class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Prev/Next -->
        <button
          @click="move(-1)"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-blue-50 text-xl"
        >
          ‹
        </button>
        <button
          @click="move(1)"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-blue-50 text-xl"
        >
          ›
        </button>

        <!-- Dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="i in totalPages"
            :key="i"
            @click="current = i - 1"
            :class="current === i - 1 ? 'bg-blue-500 w-3.5' : 'bg-gray-300 w-2.5'"
            class="h-2.5 rounded-full transition-all duration-300"
          ></button>
        </div>
      </div>

      <p v-else class="text-center text-gray-400">Belum ada postingan.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import instagramService from '@/api/instagram'

const posts = ref([])
const loading = ref(true)
const current = ref(0)
const slidesPerView = ref(3)

const totalPages = computed(() => Math.ceil(posts.value.length / slidesPerView.value))

function move(dir) {
  current.value = (current.value + dir + totalPages.value) % totalPages.value
}

function updateSlidesPerView() {
  slidesPerView.value = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
}

let autoplay
onMounted(async () => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
  try {
    const res = await instagramService.getAll()
    posts.value = res.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
  autoplay = setInterval(() => move(1), 4000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView)
  clearInterval(autoplay)
})
</script>
