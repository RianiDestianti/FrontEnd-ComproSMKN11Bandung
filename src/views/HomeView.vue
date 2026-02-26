<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section dengan Background Image Slider -->
    <section
      class="relative min-h-screen flex items-center text-white overflow-hidden pb-20 pt-32"
      @mouseenter="stopHeroAutoSlide"
      @mouseleave="startHeroAutoSlide"
    >
      <!-- Background Images Slider -->
      <div class="absolute inset-0">
        <div
          v-for="(image, index) in heroImages"
          :key="index"
          class="absolute inset-0 transition-opacity duration-1000 will-change-[opacity]"
          :class="currentHeroSlide === index ? 'opacity-100' : 'opacity-0'"
          :style="{
            backgroundImage: `url('${image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        ></div>
      </div>

      <!-- Overlay untuk keterbacaan -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl lg:max-w-4xl space-y-4 mx-auto text-center">
          <div
            class="inline-flex items-center gap-2 bg-white/18 px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide shadow-[0_6px_18px_-12px_rgba(0,0,0,0.45)] mx-auto"
          >
            <span>SEKOLAH PUSAT KEUNGGULAN</span>
            <span class="text-white/80">&#8226;</span>
            <span class="text-white/95">Bandung</span>
          </div>

          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
            SMKN 11 Bandung
          </h1>

          <p class="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed mx-auto">
            SMKN 11 Bandung dipercaya pada tahun 2021 menjadi salah satu sekolah menengah kejuruan di
            Indonesia yang menjadi Sekolah Pusat Keunggulan di bidang Hospitality jurusan Manajemen
            Perkantoran dan Layanan Bisnis.
          </p>

          <div class="flex flex-wrap gap-3 pt-3 justify-center">
            <router-link
              to="/profil-sekolah"
              class="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#0f5ad0] font-semibold shadow-[0_18px_32px_-18px_rgba(15,90,208,0.9)] hover:bg-[#0c4ec0] transition duration-300"
            >
              Pelajari Lebih Lanjut
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>

            <router-link
              to="/program-keahlian"
              class="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-[#0f5ad0] border border-white/80 font-semibold shadow-[0_16px_28px_-18px_rgba(0,0,0,0.35)] hover:bg-white/90 transition duration-300"
            >
              Lihat Program Keahlian
            </router-link>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="heroImages.length > 1"
        @click="prevHeroSlide"
        class="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/90 text-slate-700 hover:text-blue-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="heroImages.length > 1"
        @click="nextHeroSlide"
        class="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/90 text-slate-700 hover:text-blue-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>

    <!-- CARDS PRESTASI - DI DALAM HERO SECTION -->
    <section class="relative -mt-20 sm:-mt-24 pb-12 z-30">
      <div class="max-w-6xl mx-auto px-4">
        <div
          class="relative bg-white border border-gray-100 shadow-[0_22px_55px_-30px_rgba(0,0,0,0.45)] rounded-3xl px-3 sm:px-6 py-5 overflow-hidden"
        >
          <!-- Arrows -->
          <button
            v-if="prestasiList.length > 0"
            @click="scrollPrestasi('prev')"
            class="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-200 items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-if="prestasiList.length > 0"
            @click="scrollPrestasi('next')"
            class="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-200 items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div v-if="loadingPrestasi" class="flex justify-center py-6">
            <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
          </div>

          <div
            v-else-if="prestasiList.length === 0"
            class="flex items-center justify-center py-6 text-gray-600 text-sm"
          >
            Belum ada data prestasi yang dipublikasikan.
          </div>

          <div
            v-else
            ref="prestasiScroller"
            class="flex gap-0 overflow-x-auto scroll-smooth hide-scrollbar py-1 pr-2 divide-x divide-blue-300"
          >
            <div
              v-for="prestasi in prestasiList"
              :key="prestasi.id"
              class="min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] flex items-center gap-4 px-5 py-4 bg-white"
            >
              <div class="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 shadow-inner flex items-center justify-center">
                <img
                  v-if="getPrestasiFoto(prestasi)"
                  :src="getPrestasiFoto(prestasi)"
                  :alt="prestasi.nama_siswa"
                  class="w-full h-full object-cover"
                  @error="handlePrestasiImageError"
                />
                <div v-else class="w-full h-full"></div>
              </div>

              <div class="flex flex-col gap-1">
                <h3 class="text-sm sm:text-base font-bold text-[#1f4bb6] leading-tight">
                  {{ prestasi.nama_siswa }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-700 leading-snug">
                  {{ prestasi.judul || `Juara ${prestasi.peringkat}` }}
                </p>
                <div class="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                  <span class="px-3 py-1 rounded-full bg-[#e7f0ff] text-[#3170f6] font-semibold">
                    {{ prestasi.tingkat }}
                  </span>
                  <span class="font-semibold text-gray-800">{{ formatYear(prestasi.tanggal_prestasi) }}</span>
                  <span class="text-gray-400">&#8226;</span>
                  <span class="font-semibold text-blue-700">{{ prestasi.peringkat }}</span>
                </div>
              </div>
            </div>
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
    <section class="py-20 bg-white">
      <div class="container mx-auto px-6 md:px-10">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <span
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4 border border-blue-100"
            >
              🏫 Profil Sekolah
            </span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tentang SMKN 11 Bandung
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <div class="space-y-6 text-lg leading-relaxed text-gray-800">
              <p>
                SMK Negeri 11 Bandung merupakan salah satu Lembaga Pendidikan Menengah Kejuruan di
                Kota Bandung, Jawa Barat. SMKN 11 Bandung dipercaya pada tahun 2021 menjadi salah
                satu sekolah menengah kejuruan di Indonesia yang menjadi
                <span class="font-semibold text-blue-700">Sekolah Pusat Keunggulan</span> di bidang
                Hospitality jurusan Manajemen Perkantoran dan Layanan Bisnis.
              </p>
              <p>
                Selain itu SMKN 11 Bandung menjadi salah satu dari 35 sekolah di Jawa Barat yang
                menjadi sekolah
                <span class="font-semibold text-blue-700">Badan Layanan Usaha Daerah Provinsi Jawa Barat</span>.
              </p>
              <p>
                Program-program unggulan seperti <span class="font-semibold">Sekolah Pencetak Wirausaha, Teaching Factory, Inkubasi Start Up, Roots Indonesia - Let's Fight Bullying</span> dan masih banyak lagi program untuk memajukan sumber daya manusia termasuk Siswa, Guru dan Tenaga Kependidikan.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="about-card">
                <div class="about-icon">
                  <img src="/icons/graduate.png" alt="Pusat Keunggulan" class="w-10 h-10 object-contain" />
                </div>
                <div class="about-number">2021</div>
                <div class="about-label">Pusat Keunggulan</div>
              </div>
              <div class="about-card">
                <div class="about-icon">
                  <img src="/icons/circus.png" alt="Sekolah BLUD" class="w-10 h-10 object-contain" />
                </div>
                <div class="about-number">35</div>
                <div class="about-label">Sekolah BLUD Jawa Barat</div>
              </div>
              <div class="about-card">
                <div class="about-icon">
                  <img src="/icons/backpack.png" alt="Akreditasi" class="w-10 h-10 object-contain" />
                </div>
                <div class="about-number">A</div>
                <div class="about-label">Akreditasi Sekolah</div>
              </div>
              <div class="about-card">
                <div class="about-icon">
                  <img src="/icons/winner.png" alt="Link & Match Industri" class="w-10 h-10 object-contain" />
                </div>
                <div class="about-number">100%</div>
                <div class="about-label">Link & Match Industri</div>
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
            <div class="feature-icon">
              <img src="/icons/bookmark.png" alt="Pendidikan Berkualitas" class="w-12 h-12 object-contain" />
            </div>
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
            <div class="feature-icon">
              <img src="/icons/job.png" alt="Link & Match Industri" class="w-12 h-12 object-contain" />
            </div>
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
            <div class="feature-icon">
              <img src="/icons/win.png" alt="Prestasi Gemilang" class="w-12 h-12 object-contain" />
            </div>
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

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div
            v-for="berita in beritaTerbaru"
            :key="berita.id"
            class="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="relative h-80 bg-gray-200">
              <img
                v-if="berita.gambar_utama"
                :src="`${$apiBaseUrl || 'http://localhost:8000'}/storage/${berita.gambar_utama}`"
                :alt="berita.judul"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                @error="handleImageError($event, berita)"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-4xl text-blue-700 font-bold"
              >
                📰
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#0f5ad0]/65 via-[#0f5ad0]/35 to-transparent transition-opacity duration-300 group-hover:from-[#0f5ad0]/50 group-hover:via-[#0f5ad0]/25"
              ></div>
              <div class="absolute bottom-5 left-5 right-5 z-20 space-y-2 text-white">
                <h3 class="text-lg md:text-xl font-bold leading-tight line-clamp-2">
                  {{ berita.judul }}
                </h3>
                <p class="text-sm text-white/90 line-clamp-2">
                  {{ stripHtml(berita.ringkasan || berita.konten || berita.deskripsi || '') }}
                </p>
                <router-link
                  :to="`/berita/${berita.id}`"
                  class="inline-flex items-center text-white font-semibold text-sm px-4 py-2 bg-[#0f5ad0] rounded-full shadow-md hover:bg-[#0c4ec0] transition"
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
    <section class="py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900">
            Siap Bergabung dengan SMKN 11 Bandung?
          </h2>
          <p class="text-gray-600 text-lg leading-relaxed">
            Wujudkan masa depan cemerlang Anda bersama kami. Dapatkan pendidikan berkualitas dengan
            fasilitas modern dan tenaga pengajar profesional.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://spmb.jabarprov.go.id"
              target="_blank"
              class="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#0f5ad0] text-white font-semibold shadow-md hover:bg-[#0c4ec0] transition"
            >
              Daftar Sekarang →
            </a>
            <router-link
              to="/kontak"
              class="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-[#0f5ad0] text-[#0f5ad0] font-semibold hover:bg-[#0f5ad0]/10 transition"
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

.about-card {
  @apply bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-6 flex flex-col gap-2;
}

.about-icon {
  @apply w-12 h-12 flex items-center justify-center;
}

.about-number {
  @apply text-2xl font-bold text-gray-900 leading-tight;
}

.about-label {
  @apply text-sm text-gray-600 leading-snug;
}

.feature-icon {
  @apply w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 shadow-sm;
}

.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
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
const prestasiScroller = ref(null)

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

const getBadgeColor = () => 'bg-[#e8f0ff] text-[#3f70d0]'

const getPrestasiFoto = (prestasi) => {
  if (prestasi?.foto) {
    if (prestasi.foto.startsWith('http')) return prestasi.foto
    return `http://localhost:8000/${prestasi.foto}`
  }
  return ''
}

const handlePrestasiImageError = (event) => {
  event.target.style.display = 'none'
}

const scrollPrestasi = (direction = 'next') => {
  const scroller = prestasiScroller.value
  if (!scroller) return

  const firstCard = scroller.firstElementChild
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 260
  const gapStyle = getComputedStyle(scroller)
  const gap =
    parseFloat(gapStyle.columnGap || gapStyle.gap || 16) || 16

  scroller.scrollBy({
    left: direction === 'next' ? cardWidth + gap : -(cardWidth + gap),
    behavior: 'smooth',
  })
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
