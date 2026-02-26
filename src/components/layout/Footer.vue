<template>
  <footer class="bg-footer text-white mt-20" style="background:#0a1f3d;">
    <div class="container mx-auto px-6 md:px-12 xl:px-16 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12">
              <img src="/images/logo_11.png" alt="Logo SMKN 11 Bandung" class="w-full h-full object-contain" />
            </div>
            <div>
              <h3 class="text-xl font-bold leading-tight">SMKN 11 Bandung</h3>
              <p class="text-sm text-gray-300">Sekolah Pusat Keunggulan</p>
            </div>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed max-w-xs">
            Sekolah Menengah Kejuruan yang berfokus pada pengembangan kompetensi dan karakter siswa untuk menghadapi
            tantangan masa depan.
          </p>
          <div class="flex items-center gap-4 text-white/80">
            <a class="hover:text-white transition" aria-label="Facebook" href="#">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22 12.073C22 6.505 17.523 2 12 2S2 6.505 2 12.073c0 5.022 3.657 9.185 8.438 9.927v-7.028H7.898v-2.899h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.463h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.899h-2.33V22C18.343 21.258 22 17.095 22 12.073Z" />
              </svg>
            </a>
            <a class="hover:text-white transition" aria-label="TikTok" href="#">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21.59 8.24c-1.71.03-3.36-.56-4.66-1.67v7.29c0 3.77-3.43 6.8-7.38 5.99-2.48-.53-4.47-2.59-4.94-5.16-.83-4.72 3.21-8.77 7.93-7.93v2.7c-1.79-.52-3.65.77-3.65 2.63 0 1.52 1.23 2.75 2.75 2.75 1.52 0 2.75-1.23 2.75-2.75V2h2.55c.23 1.9 1.74 3.42 3.63 3.65v2.59Z" />
              </svg>
            </a>
            <a class="hover:text-white transition" aria-label="Instagram" href="#">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7Zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10Zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.505 4.505 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 9.5 12 2.503 2.503 0 0 1 12 9.5Zm4.75-.25a1 1 0 1 0-1-1 1 1 0 0 0 1 1Z" />
              </svg>
            </a>
            <a class="hover:text-white transition" aria-label="YouTube" href="#">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21.8 8.001a2.75 2.75 0 0 0-1.93-1.946C18.25 6 12 6 12 6s-6.25 0-7.87.055A2.75 2.75 0 0 0 2.2 8.001 28.77 28.77 0 0 0 2.15 12a28.77 28.77 0 0 0 .05 3.999 2.75 2.75 0 0 0 1.93 1.946C5.75 18 12 18 12 18s6.25 0 7.87-.055a2.75 2.75 0 0 0 1.93-1.946A28.77 28.77 0 0 0 21.85 12a28.77 28.77 0 0 0-.05-3.999ZM10 14.7V9.3l4.5 2.7Z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm text-gray-200">
            <li><router-link to="/" class="hover:text-white transition">Home</router-link></li>
            <li><router-link to="/profil-sekolah" class="hover:text-white transition">Profil Sekolah</router-link></li>
            <li><router-link to="/program-keahlian" class="hover:text-white transition">Program Keahlian</router-link></li>
            <li><router-link to="/berita" class="hover:text-white transition">Berita</router-link></li>
            <li><router-link to="/kontak" class="hover:text-white transition">Kontak</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-3 text-sm text-gray-200">
          <h3 class="text-lg font-bold mb-4">Kontak Kami</h3>
          <p class="flex items-start gap-3">
            <svg class="w-5 h-5 text-white mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <span>Jl. Budhi Cilember, Sukaraja, Cicendo, Bandung</span>
          </p>
          <p class="flex items-center gap-3">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
            </svg>
            <span>(022) 6652442</span>
          </p>
          <p class="flex items-center gap-3">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4.25-8 5-8-5V6l8 5 8-5v2.25Z" />
            </svg>
            <span>smkn11bdg@gmail.com</span>
          </p>
        </div>

        <!-- Map -->
        <div class="hidden md:block">
          <div class="w-full h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/10">
            <iframe
              title="Lokasi SMKN 11 Bandung"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.934894556262!2d107.5774866!3d-6.900885599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6375571c391%3A0xd0a43d0b2de2ac4!2sSMKN%2011%20Bandung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <hr class="border-white/20 my-8" />

      <div class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-300 gap-4">
        <p>&copy; {{ new Date().getFullYear() }} <span class="font-semibold">SMKN 11 Bandung.</span> All rights reserved.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white transition">Privacy Policy</a>
          <a href="#" class="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>
