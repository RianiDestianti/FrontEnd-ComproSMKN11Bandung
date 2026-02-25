<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-800">📸 Instagram Kami</h2>
        <p class="text-gray-500 mt-2">
          Ikuti kami di
          <a
            href="https://www.instagram.com/info.smkn11bandung"
            target="_blank"
            class="text-pink-500 font-semibold hover:underline"
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
              <!-- Jika VIDEO -->
              <div
                v-if="post.tipe === 'video'"
                class="relative aspect-square overflow-hidden rounded-xl shadow bg-black"
              >
                <video
                  :src="post.link_video"
                  :poster="`http://localhost:8000/storage/${post.gambar}`"
                  controls
                  class="w-full h-full object-cover"
                ></video>
                <!-- Badge video -->
                <span
                  class="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full"
                >
                  🎥 Video
                </span>
              </div>

              <!-- Jika FOTO -->
              <a
                v-else
                :href="post.link_post"
                target="_blank"
                class="group relative block aspect-square overflow-hidden rounded-xl shadow"
              >
                <img
                  :src="`http://localhost:8000/storage/${post.gambar}`"
                  :alt="post.caption"
                  class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center"
                >
                  <div class="text-white text-center px-3">
                    <p class="text-2xl mb-2">📷</p>
                    <p class="text-xs line-clamp-3">{{ post.caption }}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Prev/Next -->
        <button
          @click="move(-1)"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-pink-50 text-xl"
        >
          ‹
        </button>
        <button
          @click="move(1)"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-pink-50 text-xl"
        >
          ›
        </button>

        <!-- Dots -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="i in totalPages"
            :key="i"
            @click="current = i - 1"
            :class="current === i - 1 ? 'bg-pink-500 w-4' : 'bg-gray-300 w-2.5'"
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
