<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section dengan Background Image Slider -->
    <section
      class="relative text-white py-40 overflow-hidden"
      @mouseenter="stopHeroSlider"
      @mouseleave="startHeroSlider"
    >
      <!-- Background Images Slider -->
      <div class="absolute inset-0">
        <div
          v-for="(image, index) in heroImages"
          :key="index"
          class="absolute inset-0 transition-opacity duration-1000"
          :class="currentHeroSlide === index ? 'opacity-100' : 'opacity-0'"
          :style="{
            backgroundImage: `url('${image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        ></div>
      </div>

      <!-- Overlay gelap untuk meningkatkan keterbacaan teks -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/75 to-indigo-900/80"
      ></div>

      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <!-- Konten Hero - Diperkecil dan ditarik ke atas -->
        <div class="max-w-4xl mx-auto text-center mb-8">
          <div
            class="inline-block mb-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
          >
            🏆 Sekolah Pusat Keunggulan
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400"
            >
              Website Resmi SMKN 11 Bandung
            </span>
          </h1>
          <p class="text-lg md:text-xl mb-6 text-blue-100 font-light">
            Berkarakter Tangguh, Unggul Berkompetisi
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link
              to="/profil-sekolah"
              class="group inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-sm"
            >
              Pelajari Lebih Lanjut
              <svg
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </router-link>
            <router-link
              to="/program-keahlian"
              class="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              Lihat Program Keahlian
            </router-link>
          </div>
        </div>
      </div>

      <!-- Slider Controls -->
      <div v-if="heroImages.length > 1" class="absolute bottom-2 left-0 right-0 z-20">
        <div class="container mx-auto px-4">
          <div class="flex justify-center gap-3">
            <button
              v-for="(image, index) in heroImages"
              :key="index"
              @click="goToHeroSlide(index)"
              :class="
                currentHeroSlide === index ? 'bg-white w-10' : 'bg-white/50 w-3 hover:bg-white/70'
              "
              class="h-3 rounded-full transition-all duration-300"
            ></button>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="heroImages.length > 1"
        @click="prevHeroSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 hover:scale-110 z-20"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        v-if="heroImages.length > 1"
        @click="nextHeroSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 hover:scale-110 z-20"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Wave Divider -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>

    <!-- CARDS PRESTASI - DI DALAM HERO SECTION -->
    <section class="relative -mt-20 pb-10 z-30">
      <div class="max-w-6xl mx-auto mt-16">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div
            v-for="prestasi in prestasiList"
            :key="prestasi.id"
            class="relative rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            :style="{
              backgroundImage: 'url(/images/bg_card_prestasi.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <!-- Overlay gelap agar text tetap terbaca -->
            <div
              class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 rounded-xl"
            ></div>

            <!-- Content dengan z-index agar di atas overlay -->
            <div class="relative z-10">
              <!-- Icon -->
              <div
                class="flex items-center justify-center w-10 h-10 rounded-lg mb-2 mx-auto"
                :class="getBgGradient(prestasi.tingkat)"
              >
                <span class="text-xl">{{ getIcon(prestasi.peringkat) }}</span>
              </div>

              <!-- Peringkat/Juara -->
              <div class="text-center mb-2">
                <span class="text-xs font-bold text-white">Juara {{ prestasi.peringkat }}</span>
              </div>

              <!-- Nama Siswa -->
              <h3 class="text-xs font-bold text-yellow-300 mb-1 text-center line-clamp-1">
                {{ prestasi.nama_siswa }}
              </h3>

              <!-- Judul Prestasi -->
              <p class="text-xs text-white mb-2 text-center line-clamp-2 min-h-[2rem]">
                {{ prestasi.judul }}
              </p>

              <!-- Badge & Tahun -->
              <div class="flex items-center justify-center gap-1 text-xs">
                <span
                  class="px-2 py-0.5 rounded-full font-semibold"
                  :class="getBadgeColor(prestasi.tingkat)"
                >
                  {{ prestasi.tingkat }}
                </span>
                <span class="text-gray-200">{{ formatYear(prestasi.tanggal_prestasi) }}</span>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loadingPrestasi" class="col-span-5 text-center py-4">
            <div
              class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sambutan Kepala Sekolah -->
    <section
      v-if="kepalaSekolah && kepalaSekolah.sambutan"
      class="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
          >
            💬 Sambutan
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900">Sambutan Kepala Sekolah</h2>
        </div>

        <div class="max-w-6xl mx-auto">
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <!-- Foto & Info Kepala Sekolah -->
              <div
                class="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col items-center justify-center text-white"
              >
                <div class="relative mb-6">
                  <div
                    class="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30"
                  ></div>
                  <img
                    v-if="kepalaSekolah.foto"
                    :src="`http://localhost:8000/${kepalaSekolah.foto}`"
                    :alt="kepalaSekolah.nama"
                    class="relative w-48 h-48 object-cover rounded-full border-4 border-white shadow-2xl"
                  />
                  <div
                    v-else
                    class="relative w-48 h-48 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl"
                  >
                    <span class="text-7xl">👤</span>
                  </div>
                </div>

                <div class="text-center">
                  <h3 class="text-2xl font-bold mb-2">{{ kepalaSekolah.nama }}</h3>
                  <p v-if="kepalaSekolah.nip" class="text-blue-100 text-sm mb-2">
                    NIP: {{ kepalaSekolah.nip }}
                  </p>
                  <div
                    v-if="kepalaSekolah.pendidikan_terakhir"
                    class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg"
                  >
                    <p class="text-sm font-semibold">{{ kepalaSekolah.pendidikan_terakhir }}</p>
                  </div>
                </div>
              </div>

              <!-- Sambutan -->
              <div class="lg:col-span-2 p-8 md:p-12">
                <div class="flex items-start">
                  <span class="text-6xl text-blue-600 leading-none mr-4 opacity-30">"</span>
                  <div class="flex-1">
                    <div
                      v-if="kepalaSekolah.sambutan"
                      class="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                      v-html="kepalaSekolah.sambutan"
                    ></div>
                  </div>
                  <span class="text-6xl text-blue-600 leading-none ml-4 opacity-30 self-end"
                    >"</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tentang SMKN 11 Bandung -->
    <section class="py-20 bg-white relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <span
              class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
            >
              🏫 Profil Sekolah
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tentang SMKN 11 Bandung
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <p class="text-gray-700 leading-relaxed text-lg">
                SMK Negeri 11 Bandung merupakan salah satu Lembaga Pendidikan Menengah Kejuruan di
                Kota Bandung, Jawa Barat. SMKN 11 Bandung dipercaya pada tahun 2021 menjadi salah
                satu sekolah menengah kejuruan di Indonesia yang menjadi
                <span class="font-bold text-blue-700">Sekolah Pusat Keunggulan</span> di bidang
                Hospitality jurusan Manajemen Perkantoran dan Layanan Bisnis.
              </p>
              <p class="text-gray-700 leading-relaxed text-lg">
                Selain itu SMKN 11 Bandung menjadi salah satu dari 35 sekolah di Jawa Barat yang
                menjadi sekolah
                <span class="font-bold text-blue-700"
                  >Badan Layanan Usaha Daerah Provinsi Jawa Barat</span
                >.
              </p>
              <p class="text-gray-700 leading-relaxed text-lg">
                Program-program unggulan seperti
                <span class="font-semibold"
                  >Sekolah Pencetak Wirausaha, Teaching Factory, Inkubasi Start Up, Roots Indonesia
                  - Let's Fight Bullying</span
                >
                dan masih banyak lagi program untuk memajukan sumber daya manusia termasuk Siswa,
                Guru dan Tenaga Kependidikan.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div
                class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform"
              >
                <div class="text-5xl mb-3">🎓</div>
                <div class="text-3xl font-bold mb-1">2021</div>
                <div class="text-sm text-blue-100">Sekolah Pusat Keunggulan</div>
              </div>
              <div
                class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform"
              >
                <div class="text-5xl mb-3">🏢</div>
                <div class="text-3xl font-bold mb-1">35</div>
                <div class="text-sm text-indigo-100">Sekolah BLUD Jawa Barat</div>
              </div>
              <div
                class="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform"
              >
                <div class="text-5xl mb-3">💼</div>
                <div class="text-3xl font-bold mb-1">100%</div>
                <div class="text-sm text-purple-100">Link & Match Industri</div>
              </div>
              <div
                class="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:scale-105 transition-transform"
              >
                <div class="text-5xl mb-3">🏆</div>
                <div class="text-3xl font-bold mb-1">A</div>
                <div class="text-sm text-yellow-100">Akreditasi Sekolah</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Profil Sekolah - Tambahkan section ini setelah section "Tentang SMKN 11 Bandung" -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <!-- Decorative Elements -->
      <div
        class="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <span
            class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
          >
            🎬 Video Profil
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Profil SMKN 11 Bandung</h2>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Lihat lebih dekat fasilitas, program unggulan, dan kegiatan siswa di SMKN 11 Bandung
          </p>
        </div>

        <!-- Link YouTube -->
        <div class="max-w-5xl mx-auto">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <!-- Aspect Ratio Container 16:9 -->
            <div class="relative w-full" style="padding-bottom: 56.25%">
              <iframe
                class="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/ONWUEFy4wjE?si=6bQn9l0EDmsjKiUJ"
                title="Video Profil SMKN 11 Bandung"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Optional: Video Description -->
          <div class="mt-8 text-center">
            <p class="text-gray-600">
              Saksikan perjalanan dan prestasi SMKN 11 Bandung dalam mencetak generasi unggul dan
              berkarakter
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Program Keahlian -->
    <section
      class="py-20 relative overflow-hidden"
      style="
        background-image: url('/images/bg_programkeahlian.png');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
      "
    >
      <!-- Overlay untuk meningkatkan keterbacaan -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/95 via-gray-50/90 to-white/95"></div>

      <!-- Decorative overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
          >
            📚 Program Kami
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Program Keahlian</h2>
          <p class="text-gray-600 text-lg">
            Pilihan program keahlian yang sesuai dengan minat dan bakat Anda
          </p>
        </div>

        <div
          v-if="programKeahlian.length > 0"
          class="relative px-12 max-w-7xl mx-auto"
          @mouseenter="stopAutoSlidePK"
          @mouseleave="startAutoSlidePK"
        >
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-700 ease-in-out"
              :style="{ transform: `translateX(-${currentSlidePK * 100}%)` }"
            >
              <div
                v-for="slideIndex in totalSlidesPK"
                :key="slideIndex"
                class="w-full flex-shrink-0 px-2"
              >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div
                    v-for="(program, index) in programKeahlian.slice(
                      (slideIndex - 1) * slidesPerViewPK,
                      slideIndex * slidesPerViewPK,
                    )"
                    :key="`${slideIndex}-${index}`"
                    class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  >
                    <div
                      class="relative h-56 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 overflow-hidden"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      ></div>
                      <img
                        v-if="program.gambar"
                        :src="`http://localhost:8000/${program.gambar}`"
                        :alt="program.nama_program"
                        class="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <span class="text-blue-600 text-6xl">📚</span>
                      </div>
                    </div>

                    <div class="p-6">
                      <h3
                        class="text-xl font-bold mb-3 line-clamp-2 min-h-[56px] text-gray-900 group-hover:text-blue-700 transition-colors"
                      >
                        {{ program.nama_program }}
                      </h3>
                      <p class="text-gray-600 text-sm line-clamp-3 mb-4">
                        {{ stripHtml(program.deskripsi) }}
                      </p>
                      <div
                        class="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700"
                      >
                        <span>Pelajari lebih lanjut</span>
                        <svg
                          class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    v-for="emptyIndex in Math.max(
                      0,
                      slidesPerViewPK -
                        programKeahlian.slice(
                          (slideIndex - 1) * slidesPerViewPK,
                          slideIndex * slidesPerViewPK,
                        ).length,
                    )"
                    :key="`empty-${slideIndex}-${emptyIndex}`"
                    class="invisible"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="totalSlidesPK > 1"
            @click="prevSlidePK"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            v-if="totalSlidesPK > 1"
            @click="nextSlidePK"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div v-if="totalSlidesPK > 1" class="flex justify-center gap-3 mt-8">
            <button
              v-for="index in totalSlidesPK"
              :key="index"
              @click="goToSlidePK(index - 1)"
              :class="
                currentSlidePK === index - 1
                  ? 'bg-blue-600 w-10'
                  : 'bg-gray-300 w-3 hover:bg-gray-400'
              "
              class="h-3 rounded-full transition-all duration-300"
            ></button>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/program-keahlian"
            class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Lihat Semua Program
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Tenaga Pendidik -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
          >
            👨‍🏫 Tim Pengajar
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tenaga Pendidik</h2>
          <p class="text-gray-600 text-lg">
            Guru-guru berkualitas dan berpengalaman di SMKN 11 Bandung
          </p>
        </div>

        <div
          v-if="guruList.length > 0"
          class="relative px-12 max-w-7xl mx-auto"
          @mouseenter="stopAutoSlide"
          @mouseleave="startAutoSlide"
        >
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-700 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div
                v-for="slideIndex in totalSlides"
                :key="slideIndex"
                class="w-full flex-shrink-0 px-2"
              >
                <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div
                    v-for="(guru, index) in guruList.slice(
                      (slideIndex - 1) * slidesPerView,
                      slideIndex * slidesPerView,
                    )"
                    :key="`${slideIndex}-${index}`"
                    class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  >
                    <div
                      class="relative aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      ></div>
                      <img
                        v-if="guru.foto"
                        :src="`http://localhost:8000/${guru.foto}`"
                        :alt="guru.nama"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300"
                      >
                        <span class="text-5xl">{{ guru.jenis_kelamin === 'L' ? '👨‍🏫' : '👩‍🏫' }}</span>
                      </div>
                    </div>

                    <div class="p-4 text-center">
                      <h3
                        class="font-bold text-sm text-gray-800 line-clamp-2 mb-2 min-h-[40px] group-hover:text-blue-700 transition-colors"
                        :title="guru.nama"
                      >
                        {{ guru.nama }}
                      </h3>
                      <p
                        v-if="guru.mata_pelajaran"
                        class="text-xs text-blue-600 font-semibold line-clamp-1"
                      >
                        {{ guru.mata_pelajaran }}
                      </p>
                    </div>
                  </div>

                  <div
                    v-for="emptyIndex in Math.max(
                      0,
                      slidesPerView -
                        guruList.slice((slideIndex - 1) * slidesPerView, slideIndex * slidesPerView)
                          .length,
                    )"
                    :key="`empty-${slideIndex}-${emptyIndex}`"
                    class="invisible"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="totalSlides > 1"
            @click="prevSlide"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            v-if="totalSlides > 1"
            @click="nextSlide"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div v-if="totalSlides > 1" class="flex justify-center gap-3 mt-8">
            <button
              v-for="index in totalSlides"
              :key="index"
              @click="goToSlide(index - 1)"
              :class="
                currentSlide === index - 1
                  ? 'bg-blue-600 w-10'
                  : 'bg-gray-300 w-3 hover:bg-gray-400'
              "
              class="h-3 rounded-full transition-all duration-300"
            ></button>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/guru"
            class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Lihat Semua Guru
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
          >
            ⭐ Keunggulan Kami
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mengapa Memilih SMKN 11?
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
          >
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
            <h3
              class="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors"
            >
              Pendidikan Berkualitas
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Kurikulum modern yang sesuai dengan kebutuhan industri dan perkembangan teknologi
              terkini
            </p>
          </div>

          <div
            class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
          >
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">💼</div>
            <h3
              class="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors"
            >
              Link & Match Industri
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Kerjasama dengan berbagai perusahaan untuk PKL, magang, dan peluang karir setelah
              lulus
            </p>
          </div>

          <div
            class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
          >
            <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">🏆</div>
            <h3
              class="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors"
            >
              Prestasi Gemilang
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Siswa kami berprestasi di tingkat regional, nasional, hingga internasional
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Berita Terbaru -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span
            class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4"
          >
            📰 Informasi Terkini
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Berita Terbaru</h2>
          <p class="text-gray-600 text-lg">
            Ikuti perkembangan dan kegiatan terbaru di SMKN 11 Bandung
          </p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="text-gray-500 mt-4">Memuat berita...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div
            v-for="berita in beritaTerbaru"
            :key="berita.id"
            class="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
          >
            <div class="relative h-56 overflow-hidden bg-gray-100">
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"
              ></div>
              <img
                v-if="berita.gambar_utama"
                :src="`${$apiBaseUrl || 'http://localhost:8000'}/storage/${berita.gambar_utama}`"
                :alt="berita.judul"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError($event, berita)"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200"
              >
                <span class="text-6xl">📰</span>
              </div>
              <span
                class="absolute top-4 left-4 z-20 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full"
              >
                {{ berita.kategori?.nama || 'Umum' }}
              </span>
            </div>

            <div class="p-6">
              <h3
                class="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-700 transition-colors min-h-[56px]"
              >
                {{ berita.judul }}
              </h3>
              <p class="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                {{ stripHtml(berita.ringkasan || berita.konten || berita.deskripsi || '') }}
              </p>
              <router-link
                :to="`/berita/${berita.id}`"
                class="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                Baca Selengkapnya
                <svg
                  class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/berita"
            class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Lihat Semua Berita
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section Maps Lokasi Sekolah -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-8">Lokasi Sekolah</h2>
        <div class="maps-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0006691417184!2d107.55575517401701!3d-6.890521767425584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6bd6aaaaaab%3A0xf843088e2b5bf838!2sSMK%20Negeri%2011%20Bandung!5e0!3m2!1sen!2sid!4v1771165596634!5m2!1sen!2sid"
            width="100%"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div class="text-center mt-6">
          <a
            href="https://www.google.com/maps/dir//-6.890303,107.558319"
            target="_blank"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Buka di Google Maps
          </a>
        </div>
      </div>
    </section>

    <InstagramSection />
    <TestimoniSection />

    <!-- Call to Action -->
    <section
      class="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden"
    >
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Siap Bergabung dengan SMKN 11 Bandung?
          </h2>
          <p class="text-xl text-blue-100 mb-10 leading-relaxed">
            Wujudkan masa depan cemerlang Anda bersama kami. Dapatkan pendidikan berkualitas dengan
            fasilitas modern dan tenaga pengajar profesional.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              href="https://spmb.jabarprov.go.id"
              target="_blank"
              class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Daftar Sekarang
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </router-link>
            <router-link
              to="/kontak"
              class="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Hubungi Kami
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.prose :deep(p) {
  margin-bottom: 0.75rem;
  text-align: justify;
  line-height: 1.7;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 1rem;
}

.prose :deep(ol) {
  list-style-type: decimal;
}

.prose :deep(ul) {
  list-style-type: disc;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
  text-align: justify;
  display: list-item;
}

.prose :deep(li p) {
  display: inline;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import TestimoniSection from '@/components/home/TestimoniSection.vue'
import InstagramSection from '@/components/home/InstagramSection.vue'
import apiClient from '@/api/axios'

const beritaTerbaru = ref([])
const kepalaSekolah = ref(null)
const loading = ref(true)
const programKeahlian = ref([])
const guruList = ref([])

const prestasiList = ref([])
const loadingPrestasi = ref(true)

// Slider Guru
const currentSlide = ref(0)
const slidesPerView = 5
let sliderInterval = null

// Slider Program Keahlian
const currentSlidePK = ref(0)
const slidesPerViewPK = 3
let sliderIntervalPK = null

// Slider Hero Background
const heroImages = ref(['/images/IMG_0157.jpeg', '/images/HGN2025_1.jpg', '/images/HGN2025_2.jpg'])
const currentHeroSlide = ref(0)
const heroTimer = ref(null)

const handleImageError = (event, berita) => {
  console.error('Gambar gagal dimuat:', berita.gambar_utama)
  console.log('Full URL:', event.target.src)
  event.target.src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia'
}

const fetchPrestasi = async () => {
  try {
    loadingPrestasi.value = true
    const response = await apiClient.get('/prestasi', {
      params: {
        limit: 5,
        status: 'published',
      },
    })

    const data = response.data.data?.data || response.data.data || []
    prestasiList.value = data.slice(0, 5)

    // Debug: lihat path foto
    console.log('Data prestasi:', prestasiList.value)
    prestasiList.value.forEach((p) => {
      console.log('Foto path:', p.foto)
    })
  } catch (error) {
    console.error('Error fetching prestasi:', error)
    prestasiList.value = []
  } finally {
    loadingPrestasi.value = false
  }
}

const getBgGradient = (tingkat) => {
  const gradients = {
    Internasional: 'bg-gradient-to-br from-purple-500 to-pink-600',
    Nasional: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    Provinsi: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    Kota: 'bg-gradient-to-br from-green-500 to-emerald-600',
    Kecamatan: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  }
  return gradients[tingkat] || 'bg-gradient-to-br from-gray-400 to-gray-600'
}

const getBadgeColor = (tingkat) => {
  const colors = {
    Internasional: 'bg-purple-100 text-purple-700',
    Nasional: 'bg-yellow-100 text-yellow-800',
    Provinsi: 'bg-blue-100 text-blue-700',
    Kota: 'bg-green-100 text-green-700',
    Kecamatan: 'bg-indigo-100 text-indigo-700',
  }
  return colors[tingkat] || 'bg-gray-100 text-gray-700'
}

const getIcon = (peringkat) => {
  if (!peringkat) return '🎖️'
  const p = peringkat.toLowerCase()
  if (p.includes('1') || p.includes('pertama')) return '🏆'
  if (p.includes('2') || p.includes('kedua')) return '🥈'
  if (p.includes('3') || p.includes('ketiga')) return '🥉'
  return '🎖️'
}

const stripHtml = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const formatYear = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

const fetchBeritaTerbaru = async () => {
  try {
    const response = await apiClient.get('/berita', {
      params: { limit: 3 },
    })
    beritaTerbaru.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching berita:', error)
  } finally {
    loading.value = false
  }
}

const fetchKepalaSekolah = async () => {
  try {
    const response = await apiClient.get('/kepala-sekolah/active')
    kepalaSekolah.value = response.data.data
  } catch (error) {
    console.error('Error fetching kepala sekolah:', error)
  }
}

const fetchProgramKeahlian = async () => {
  try {
    const response = await apiClient.get('/program-keahlian')
    programKeahlian.value = response.data.data.filter((p) => p.status === 'aktif')
  } catch (error) {
    console.error('Error fetching program keahlian:', error)
  }
}

const fetchGuru = async () => {
  try {
    const response = await apiClient.get('/guru')
    guruList.value = response.data.data
      .filter((g) => g.status === 'aktif')
      .sort((a, b) => a.nama.localeCompare(b.nama))
  } catch (error) {
    console.error('Error fetching guru:', error)
  }
}

// ===== HERO SLIDER FUNCTIONS =====
const nextHeroSlide = () => {
  currentHeroSlide.value = (currentHeroSlide.value + 1) % heroImages.value.length
}

const prevHeroSlide = () => {
  currentHeroSlide.value =
    currentHeroSlide.value === 0 ? heroImages.value.length - 1 : currentHeroSlide.value - 1
}

const goToHeroSlide = (index) => {
  currentHeroSlide.value = index
}

const startHeroAutoSlide = () => {
  if (heroTimer.value) {
    clearInterval(heroTimer.value)
  }
  heroTimer.value = setInterval(() => {
    nextHeroSlide()
  }, 5000)
}

const stopHeroAutoSlide = () => {
  if (heroTimer.value) {
    clearInterval(heroTimer.value)
    heroTimer.value = null
  }
}

// ===== SLIDER GURU FUNCTIONS =====
const totalSlides = computed(() => {
  return Math.ceil(guruList.value.length / slidesPerView)
})

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const startAutoSlide = () => {
  sliderInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoSlide = () => {
  if (sliderInterval) {
    clearInterval(sliderInterval)
  }
}

watch(guruList, (newVal) => {
  if (newVal.length > 0) {
    startAutoSlide()
  }
})

// ===== SLIDER PROGRAM KEAHLIAN FUNCTIONS =====
const totalSlidesPK = computed(() => {
  return Math.ceil(programKeahlian.value.length / slidesPerViewPK)
})

const nextSlidePK = () => {
  currentSlidePK.value = (currentSlidePK.value + 1) % totalSlidesPK.value
}

const prevSlidePK = () => {
  currentSlidePK.value =
    currentSlidePK.value === 0 ? totalSlidesPK.value - 1 : currentSlidePK.value - 1
}

const goToSlidePK = (index) => {
  currentSlidePK.value = index
}

const startAutoSlidePK = () => {
  sliderIntervalPK = setInterval(() => {
    nextSlidePK()
  }, 5000)
}

const stopAutoSlidePK = () => {
  if (sliderIntervalPK) {
    clearInterval(sliderIntervalPK)
  }
}

watch(programKeahlian, (newVal) => {
  if (newVal.length > 0) {
    startAutoSlidePK()
  }
})

onMounted(() => {
  fetchBeritaTerbaru()
  fetchKepalaSekolah()
  fetchProgramKeahlian()
  fetchGuru()
  fetchPrestasi()

  // Start hero slider
  if (heroImages.value.length > 1) {
    startHeroAutoSlide()
  }
})

onUnmounted(() => {
  stopAutoSlide()
  stopAutoSlidePK()
  stopHeroAutoSlide()
})
</script>
