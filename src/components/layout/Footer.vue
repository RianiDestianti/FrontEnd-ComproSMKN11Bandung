<template>
  <footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-4 py-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        <!-- About -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-2xl">11</span>
            </div>
            <div>
              <h3 class="text-xl font-bold">SMKN 11 Bandung</h3>
              <p class="text-sm text-gray-400">Sekolah Pusat Keunggulan</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed mb-4">
            Sekolah Menengah Kejuruan yang berfokus pada pengembangan kompetensi dan karakter siswa untuk menghadapi tantangan masa depan.
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
              <span>📘</span>
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
              <span>📷</span>
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
              <span>🐦</span>
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
              <span>▶️</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-blue-600 rounded"></span>
            Quick Links
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-200">
                <span class="text-blue-600">›</span> Home
              </router-link>
            </li>
            <li>
              <router-link to="/profil-sekolah" class="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-200">
                <span class="text-blue-600">›</span> Profil Sekolah
              </router-link>
            </li>
            <li>
              <router-link to="/program-keahlian" class="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-200">
                <span class="text-blue-600">›</span> Program Keahlian
              </router-link>
            </li>
            <li>
              <router-link to="/berita" class="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-200">
                <span class="text-blue-600">›</span> Berita
              </router-link>
            </li>
            <li>
              <router-link to="/kontak" class="text-gray-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-200">
                <span class="text-blue-600">›</span> Kontak
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-blue-600 rounded"></span>
            Kontak Kami
          </h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-3 text-gray-400 group hover:text-white transition-colors">
              <span class="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">📍</span>
              <span>Jl. Budhi Cilember, Sukaraja, Cicendo, Bandung</span>
            </li>
            <li class="flex items-center gap-3 text-gray-400 group hover:text-white transition-colors">
              <span class="text-xl group-hover:scale-110 transition-transform">📞</span>
              <span>(022) 6652442</span>
            </li>
            <li class="flex items-center gap-3 text-gray-400 group hover:text-white transition-colors">
              <span class="text-xl group-hover:scale-110 transition-transform">✉️</span>
              <span>smkn11bdg@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-700 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-400">
            &copy; {{ new Date().getFullYear() }} <span class="text-white font-semibold">SMKN 11 Bandung</span>. All rights reserved.
          </p>
          <div class="flex gap-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>