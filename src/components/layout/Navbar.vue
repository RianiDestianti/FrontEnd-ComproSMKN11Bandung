<template>
  <!-- Top Bar: Social Media Icons -->
  <div
    class="bg-[#0667d3] text-white"
    :class="isHome ? 'absolute top-0 left-0 right-0 z-50' : ''"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-end h-8 gap-3">
        <a
          v-for="sosmed in socialMediaList"
          :key="sosmed.id"
          :href="sosmed.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-200 hover:text-white transition-colors duration-200"
          :aria-label="sosmed.platform"
        >
          <!-- Instagram -->
          <svg
            v-if="sosmed.icon === 'instagram'"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
            />
          </svg>
          <!-- YouTube -->
          <svg
            v-else-if="sosmed.icon === 'youtube'"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </svg>
          <!-- Facebook -->
          <svg
            v-else-if="sosmed.icon === 'facebook'"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          <!-- Twitter / X -->
          <svg
            v-else-if="sosmed.icon === 'twitter'"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
          <!-- TikTok -->
          <svg
            v-else-if="sosmed.icon === 'tiktok'"
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.27 6.27 0 00-6.27 6.27 6.27 6.27 0 006.27 6.27 6.27 6.27 0 006.27-6.27V8.94a8.16 8.16 0 004.84 1.58V7.12a4.82 4.82 0 01-1-.43z"
            />
          </svg>
          <!-- Fallback: ikon generik kalau icon tidak dikenali -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>

  <nav :class="navClasses">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-2 md:gap-3 group pl-3 md:pl-5">
          <div class="relative w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden transition-all duration-300">
            <img
              src="/images/logo_11.png"
              alt="Logo SMKN 11 Bandung"
              class="w-full h-full object-contain"
            />
          </div>
          <router-link to="/" class="flex flex-col leading-tight">
            <span
              class="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all"
            >
              SMKN 11 Bandung
            </span>
            <span class="text-xs text-gray-600 font-medium tracking-wide"
              >Sekolah Pusat Keunggulan</span
            >
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-6">
          <router-link
            to="/"
            class="relative font-medium transition-colors duration-200 group px-1"
            :class="linkBaseClass"
          >
            <span class="relative z-10">Home</span>
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
            ></span>
          </router-link>

          <!-- Profil Sekolah Mega Menu -->
          <div class="relative" @mouseenter="showMenu('profil')" @mouseleave="hideMenu('profil')">
            <button
              class="relative font-medium flex items-center transition-colors duration-200 group px-1"
              :class="linkBaseClass"
            >
              <span class="relative z-10">Profil Sekolah</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-y-0.5"
                :class="{ 'rotate-180': desktopMenus.profil }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
              ></span>
            </button>
            <div
              v-show="desktopMenus.profil"
              class="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100 animate-fadeIn"
            >
              <router-link
                @click="desktopMenus.profil = false"
                to="/profil-sekolah"
                class="group block px-5 py-3 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-200"
                  >
                    <span class="text-xl group-hover:scale-110 transition-transform">🏫</span>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 group-hover:text-blue-600">
                      Profil Sekolah
                    </div>
                    <div class="text-xs text-gray-500">Visi, Misi & Sejarah</div>
                  </div>
                </div>
              </router-link>
              <router-link
                @click="desktopMenus.profil = false"
                to="/kepala-sekolah"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200"
                :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">👨‍💼</span>
                <span class="font-medium">Kepala Sekolah</span>
              </router-link>
              <router-link
                @click="desktopMenus.profil = false"
                to="/guru"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200"
                :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">👨‍🏫</span>
                <span class="font-medium">Data Guru</span>
              </router-link>
              <router-link
                @click="desktopMenus.profil = false"
                to="/siswa"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200"
                :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">🎓</span>
                <span class="font-medium">Data Siswa</span>
              </router-link>
              <router-link
                @click="desktopMenus.profil = false"
                to="/tata-usaha"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200"
                :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">📋</span>
                <span class="font-medium">Tata Usaha</span>
              </router-link>
              <router-link
                @click="desktopMenus.profil = false"
                to="/struktur-organisasi"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200"
                :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">🏢</span>
                <span class="font-medium">Struktur Organisasi</span>
              </router-link>
              <router-link
                @click="desktopMenus.profil = false"
                to="/fasilitas"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200"
                :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">🏗️</span>
                <span class="font-medium">Fasilitas</span>
              </router-link>
            </div>
          </div>

          <!-- Program Mega Menu -->
          <div class="relative" @mouseenter="showMenu('program')" @mouseleave="hideMenu('program')">
            <button
              class="relative text-gray-700 font-medium hover:text-blue-600 flex items-center transition-colors duration-200 group px-1"
            >
              <span class="relative z-10">Program</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-y-0.5"
                :class="{ 'rotate-180': desktopMenus.program }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
              ></span>
            </button>
            <div
              v-show="desktopMenus.program"
              class="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100 animate-fadeIn"
            >
              <router-link
                @click="desktopMenus.program = false"
                to="/program-keahlian"
                class="group block px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-200"
                  >
                    <span class="text-xl group-hover:scale-110 transition-transform">📚</span>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 group-hover:text-blue-600">
                      Program Keahlian
                    </div>
                    <div class="text-xs text-gray-500">Jurusan yang tersedia</div>
                  </div>
                </div>
              </router-link>
              <router-link
                @click="desktopMenus.program = false"
                to="/konsentrasi-keahlian"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">🎯</span>
                <span class="font-medium">Konsentrasi Keahlian</span>
              </router-link>
              <router-link
                @click="desktopMenus.program = false"
                to="/program-unggulan"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">⭐</span>
                <span class="font-medium">Program Unggulan</span>
              </router-link>
            </div>
          </div>

          <!-- Akademik Mega Menu -->
          <div
            class="relative"
            @mouseenter="showMenu('akademik')"
            @mouseleave="hideMenu('akademik')"
          >
            <button
              class="relative text-gray-700 font-medium hover:text-blue-600 flex items-center transition-colors duration-200 group px-1"
            >
              <span class="relative z-10">Akademik</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-y-0.5"
                :class="{ 'rotate-180': desktopMenus.akademik }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
              ></span>
            </button>
            <div
              v-show="desktopMenus.akademik"
              class="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100 animate-fadeIn"
            >
              <router-link
                @click="desktopMenus.akademik = false"
                to="/kalender-akademik"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">📅</span>
                <span class="font-medium">Kalender Akademik</span>
              </router-link>
              <router-link
                @click="desktopMenus.akademik = false"
                to="/jadwal-pelajaran"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">⏰</span>
                <span class="font-medium">Jadwal Pelajaran</span>
              </router-link>
              <router-link
                @click="desktopMenus.akademik = false"
                to="/struktur-kurikulum"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">📖</span>
                <span class="font-medium">Struktur Kurikulum</span>
              </router-link>
            </div>
          </div>

          <!-- PKL Mega Menu -->
          <div class="relative" @mouseenter="showMenu('pkl')" @mouseleave="hideMenu('pkl')">
            <button
              class="relative text-gray-700 font-medium hover:text-blue-600 flex items-center transition-colors duration-200 group px-1"
            >
              <span class="relative z-10">PKL</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-y-0.5"
                :class="{ 'rotate-180': desktopMenus.pkl }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
              ></span>
            </button>
            <div
              v-show="desktopMenus.pkl"
              class="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100 animate-fadeIn"
            >
              <router-link
                @click="desktopMenus.pkl = false"
                to="/data-perusahaan"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">🏢</span>
                <span class="font-medium">Data Perusahaan</span>
              </router-link>
              <router-link
                @click="desktopMenus.pkl = false"
                to="/data-pkl"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">👨‍🎓</span>
                <span class="font-medium">Data PKL</span>
              </router-link>
            </div>
          </div>

          <!-- Pojok Siswa Dropdown -->
          <div
            class="relative group"
            @mouseenter="showMenu('pojokSiswa')"
            @mouseleave="hideMenu('pojokSiswa')"
          >
            <button
              class="relative text-gray-700 font-medium hover:text-blue-600 flex items-center transition-colors duration-200 group px-1"
            >
              <span class="relative z-10">Pojok Siswa</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-y-0.5"
                :class="{ 'rotate-180': desktopMenus.pojokSiswa }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
              ></span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-show="desktopMenus.pojokSiswa"
              class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50"
              @mouseenter="showMenu('pojokSiswa')"
              @mouseleave="hideMenu('pojokSiswa')"
            >
              <router-link
                to="/pojok-siswa"
                class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >Karya Siswa</router-link
              >
              <router-link
                to="/prestasi"
                class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >Prestasi</router-link
              >
              <router-link
                to="/ekstrakurikuler"
                class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >Ekstrakurikuler</router-link
              >
            </div>
          </div>

          <!-- Info Mega Menu -->
          <div
            class="relative"
            @mouseenter="showMenu('informasi')"
            @mouseleave="hideMenu('informasi')"
          >
            <button
              class="relative text-gray-700 font-medium hover:text-blue-600 flex items-center transition-colors duration-200 group px-1"
            >
              <span class="relative z-10">Informasi</span>
              <svg
                class="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-y-0.5"
                :class="{ 'rotate-180': desktopMenus.informasi }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"
              ></span>
            </button>
            <div
              v-show="desktopMenus.informasi"
              class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100 animate-fadeIn"
            >
              <router-link
                @click="desktopMenus.informasi = false"
                to="/berita"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">📰</span>
                <span class="font-medium">Berita</span>
              </router-link>
              <router-link
                @click="desktopMenus.informasi = false"
                to="/agenda"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">📌</span>
                <span class="font-medium">Agenda Kegiatan</span>
              </router-link>
              <router-link
                @click="desktopMenus.informasi = false"
                to="/informasi"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">ℹ️</span>
                <span class="font-medium">Informasi Umum</span>
              </router-link>
              <router-link
                @click="desktopMenus.informasi = false"
                to="/kontak"
                class="group flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">📞</span>
                <span class="font-medium">Kontak</span>
              </router-link>
            </div>
          </div>

          <!-- Admin Menu (if logged in as admin) -->
          <div
            v-if="authStore.isAdmin"
            class="relative"
            @mouseenter="showMenu('admin')"
            @mouseleave="hideMenu('admin')"
          >
            <button class="text-gray-700 hover:text-blue-600 flex items-center transition">
              Admin
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div
              v-show="desktopMenus.admin"
              class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-50"
            >
              <router-link
                to="/admin"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >Dashboard</router-link
              >
              <router-link
                to="/admin/profil-sekolah/edit"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >Edit Profil Sekolah</router-link
              >
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-blue-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- User Menu Desktop -->
        <div class="hidden lg:flex items-center">
          <div
            v-if="authStore.isAuthenticated"
            class="relative"
            @mouseenter="showMenu('user')"
            @mouseleave="hideMenu('user')"
          >
            <button
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
            >
              <div
                class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm"
              >
                {{ authStore.userName.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm">{{ authStore.userName }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div
              v-show="desktopMenus.user"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 z-50"
            >
              <div class="px-4 py-2 text-sm border-b border-gray-100">
                <p class="font-medium text-gray-900">{{ authStore.userName }}</p>
                <p class="text-xs text-gray-500">{{ authStore.userRole }}</p>
              </div>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
          <!-- <router-link
            @click="desktopMenus.admin = false"
            v-else
            to="/login"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Login
          </router-link> -->
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200">
      <div class="px-4 py-3 space-y-2">
        <router-link
          @click="mobileMenuOpen = false"
          to="/"
          class="block py-2 transition"
          :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-blue-600'"
          >Home</router-link
        >

        <!-- Mobile Profil Sekolah -->
        <div>
          <button
            @click="toggleMobileMenu('profil')"
            class="w-full flex justify-between items-center py-2"
            :class="isHome ? 'text-white' : 'text-gray-700'"
          >
            <span>Profil Sekolah</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': mobileMenus.profil }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="mobileMenus.profil" class="pl-4 space-y-2 mt-2">
            <router-link
              @click="mobileMenuOpen = false"
              to="/profil-sekolah"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Profil Sekolah</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/kepala-sekolah"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Kepala Sekolah</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/guru"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Data Guru</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/siswa"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Data Siswa</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/tata-usaha"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Tata Usaha</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/struktur-organisasi"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Struktur Organisasi</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/fasilitas"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Fasilitas</router-link
            >
          </div>
        </div>

        <!-- Mobile Program -->
        <div>
          <button
            @click="toggleMobileMenu('program')"
            class="w-full flex justify-between items-center py-2"
            :class="isHome ? 'text-white' : 'text-gray-700'"
          >
            <span>Program</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': mobileMenus.program }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="mobileMenus.program" class="pl-4 space-y-2 mt-2">
            <router-link
              @click="mobileMenuOpen = false"
              to="/program-keahlian"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Program Keahlian</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/konsentrasi-keahlian"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Konsentrasi Keahlian</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/program-unggulan"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Program Unggulan</router-link
            >
          </div>
        </div>

        <!-- Mobile Akademik -->
        <div>
          <button
            @click="toggleMobileMenu('akademik')"
            class="w-full flex justify-between items-center py-2"
            :class="isHome ? 'text-white' : 'text-gray-700'"
          >
            <span>Akademik</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': mobileMenus.akademik }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="mobileMenus.akademik" class="pl-4 space-y-2 mt-2">
            <router-link
              @click="mobileMenuOpen = false"
              to="/kalender-akademik"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Kalender Akademik</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/jadwal-pelajaran"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Jadwal Pelajaran</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/struktur-kurikulum"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Struktur Kurikulum</router-link
            >
          </div>
        </div>

        <router-link
          @click="mobileMenuOpen = false"
          to="/pkl"
          class="block py-2 transition"
          :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-blue-600'"
          >PKL</router-link
        >
        <!-- Pojok Siswa Mobile -->
        <div>
          <button
            @click="toggleMobileMenu('pojokSiswa')"
            class="flex items-center justify-between w-full py-2 transition"
            :class="isHome ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-blue-600'"
          >
            <span>Pojok Siswa</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': mobileMenus.pojokSiswa }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Submenu Mobile -->
          <div v-show="mobileMenus.pojokSiswa" class="pl-4 space-y-1">
            <router-link
              @click="mobileMenuOpen = false"
              to="/pojok-siswa"
              class="block py-2 text-gray-600 hover:text-blue-600 transition"
              >Karya Siswa</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/prestasi"
              class="block py-2 text-gray-600 hover:text-blue-600 transition"
              >Prestasi</router-link
            >
          </div>
        </div>

        <!-- Mobile Informasi -->
        <div>
          <button
            @click="toggleMobileMenu('informasi')"
            class="w-full flex justify-between items-center py-2"
            :class="isHome ? 'text-white' : 'text-gray-700'"
          >
            <span>Informasi</span>
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': mobileMenus.informasi }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="mobileMenus.informasi" class="pl-4 space-y-2 mt-2">
            <router-link
              @click="mobileMenuOpen = false"
              to="/berita"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Berita</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/agenda"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Agenda Kegiatan</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/informasi"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Informasi Umum</router-link
            >
            <router-link
              @click="mobileMenuOpen = false"
              to="/kontak"
              class="block py-1 text-sm text-gray-600 hover:text-blue-600"
              >Kontak</router-link
            >
          </div>
        </div>

        <!-- Mobile User Menu -->
        <div v-if="authStore.isAuthenticated" class="pt-3 border-t border-gray-200">
          <div class="px-3 py-2 bg-gray-50 rounded">
            <p class="text-sm font-medium text-gray-900">{{ authStore.userName }}</p>
            <p class="text-xs text-gray-500">{{ authStore.userRole }}</p>
          </div>
          <button
            @click="handleLogout"
            class="w-full mt-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded transition"
          >
            Logout
          </button>
        </div>

        <router-link
          v-else
          @click="mobileMenuOpen = false"
          to="/login"
          class="block mt-3 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Force white text on hero overlay */
.nav-home :deep(a),
.nav-home :deep(button),
.nav-home :deep(span) {
  color: #ffffff !important;
}

.nav-home :deep(.hover\:text-blue-600:hover),
.nav-home :deep(.hover\:text-gray-700:hover) {
  color: #e0e7ff !important;
}
</style>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isHome = computed(() => route.path === '/')
const linkBaseClass = computed(() =>
  isHome.value ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-blue-600',
)
const navClasses = computed(() =>
  isHome.value
    ? 'nav-home absolute left-0 right-0 top-8 z-40 bg-transparent text-white'
    : 'sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-white/95',
)

// --- Social Media ---
const socialMediaList = ref([])
const fetchSocialMedia = async () => {
  try {
    const res = await apiClient.get('/social-media')
    console.log('Response social media:', res.data)
    const data = res.data.data.data || []
    socialMediaList.value = data.filter((item) => item && item.status === 'aktif')
  } catch (e) {
    console.error('Gagal mengambil data social media:', e)
    socialMediaList.value = []
  }
}

onMounted(() => {
  fetchSocialMedia()
})

const mobileMenuOpen = ref(false)

const mobileMenus = reactive({
  profil: false,
  program: false,
  akademik: false,
  pkl: false, // ← TAMBAHKAN INI
  pojokSiswa: false, // ← TAMBAHKAN INI
  informasi: false,
})

// Desktop dropdown state dengan delay
const desktopMenus = reactive({
  profil: false,
  program: false,
  akademik: false,
  pkl: false, // ← TAMBAHKAN INI
  pojokSiswa: false, // ← TAMBAHKAN INI
  informasi: false,
  admin: false,
  user: false,
})

let closeTimeout = null

const showMenu = (menu) => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  // Tutup semua menu lain
  Object.keys(desktopMenus).forEach((key) => {
    if (key !== menu) desktopMenus[key] = false
  })
  desktopMenus[menu] = true
}

const hideMenu = (menu) => {
  closeTimeout = setTimeout(() => {
    desktopMenus[menu] = false
  }, 200)
}

const toggleMobileMenu = (menu) => {
  mobileMenus[menu] = !mobileMenus[menu]
}

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await authStore.logout()
  router.push('/login')
}
</script>
