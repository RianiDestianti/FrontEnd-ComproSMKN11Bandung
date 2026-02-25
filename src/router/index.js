import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false }, // ✅ HAPUS hideForAuth
    },

    // PROFIL SEKOLAH
    {
      path: '/profil-sekolah',
      name: 'profil-sekolah',
      component: () => import('@/views/profil/ProfilSekolahView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/guru',
      name: 'guru',
      component: () => import('@/views/profil/GuruView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/siswa',
      name: 'siswa',
      component: () => import('@/views/profil/SiswaView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/tata-usaha',
      name: 'tata-usaha',
      component: () => import('@/views/profil/TataUsahaView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/kepala-sekolah',
      name: 'kepala-sekolah',
      component: () => import('@/views/profil/KepalaSekolahView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/struktur-organisasi',
      name: 'struktur-organisasi',
      component: () => import('@/views/profil/StrukturOrganisasiView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/fasilitas',
      name: 'fasilitas',
      component: () => import('@/views/profil/FasilitasView.vue'),
      meta: { requiresAuth: false },
    },

    // PROGRAM
    {
      path: '/program-keahlian',
      name: 'program-keahlian',
      component: () => import('@/views/program/ProgramKeahlianView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/konsentrasi-keahlian',
      name: 'konsentrasi-keahlian',
      component: () => import('@/views/program/KonsentrasiKeahlianView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/program-unggulan',
      name: 'program-unggulan',
      component: () => import('@/views/program/ProgramUnggulanView.vue'),
      meta: { requiresAuth: false },
    },

    // POJOK SISWA
    {
      path: '/pojok-siswa',
      name: 'pojok-siswa',
      component: () => import('@/views/siswa/PojokSiswaView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/prestasi',
      name: 'prestasi',
      component: () => import('@/views/prestasi/PrestasiView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/ekstrakurikuler',
      name: 'ekstrakurikuler',
      component: () => import('@/views/ekstrakurikuler/EkstrakurikulerView.vue'), // ✅ BENAR
      meta: { requiresAuth: false },
    },

    // AKADEMIK
    {
      path: '/kalender-akademik',
      name: 'kalender-akademik',
      component: () => import('@/views/akademik/KalenderAkademikView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/jadwal-pelajaran',
      name: 'jadwal-pelajaran',
      component: () => import('@/views/akademik/JadwalPelajaranView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/struktur-kurikulum',
      name: 'struktur-kurikulum',
      component: () => import('@/views/akademik/StrukturKurikulumView.vue'),
      meta: { requiresAuth: false },
    },

    // PKL
    {
      path: '/data-perusahaan',
      name: 'DataPerusahaan',
      component: () => import('@/views/pkl/DataPerusahaanPKLView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/data-pkl',
      name: 'DataPKL',
      component: () => import('@/views/pkl/DataPKLView.vue'),
      meta: { requiresAuth: false },
    },

    // BERITA & AGENDA
    {
      path: '/berita',
      name: 'berita',
      component: () => import('@/views/berita/BeritaView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/berita/:id',
      name: 'berita-detail',
      component: () => import('@/views/berita/BeritaDetailView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: () => import('@/views/agenda/AgendaView.vue'),
      meta: { requiresAuth: false },
    },

    // INFORMASI
    {
      path: '/informasi',
      name: 'informasi',
      component: () => import('@/views/informasi/InformasiView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/kontak',
      name: 'kontak',
      component: () => import('@/views/kontak/KontakView.vue'),
      meta: { requiresAuth: false },
    },

    // ============= ADMIN ROUTES (NESTED) =============
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'profil-sekolah/edit',
          name: 'edit-profil-sekolah',
          component: () => import('@/views/profil/EditProfilView.vue'),
        },

        // ============= PROFIL SEKOLAH =============
        {
          path: 'kepala-sekolah',
          name: 'admin-kepala-sekolah',
          component: () => import('@/views/admin/profil/KepalaSekolahAdminView.vue'),
        },
        {
          path: 'visi-misi',
          name: 'admin-visi-misi',
          component: () => import('@/views/admin/profil/VisiMisiAdminView.vue'),
        },
        {
          path: 'struktur-organisasi',
          name: 'admin-struktur-organisasi',
          component: () => import('@/views/admin/profil/StrukturOrganisasiAdminView.vue'),
        },

        // ============= DATA KEPEGAWAIAN =============
        {
          path: 'guru',
          name: 'admin-guru',
          component: () => import('@/views/admin/kepegawaian/GuruAdminView.vue'),
        },
        {
          path: 'tata-usaha',
          name: 'admin-tata-usaha',
          component: () => import('@/views/admin/kepegawaian/TataUsahaAdminView.vue'),
        },

        // ============= DATA SISWA =============
        {
          path: 'siswa',
          name: 'admin-siswa',
          component: () => import('@/views/admin/siswa/SiswaAdminView.vue'),
        },
        {
          path: 'kelas',
          name: 'admin-kelas',
          component: () => import('@/views/admin/siswa/KelasAdminView.vue'),
        },
        {
          path: 'pojok-siswa',
          name: 'admin-pojok-siswa',
          component: () => import('@/views/admin/siswa/PojokSiswaAdminView.vue'),
        },
        {
          path: 'ekstrakurikuler',
          name: 'admin-ekstrakurikuler',
          component: () => import('@/views/admin/siswa/EkstrakurikulerAdminView.vue'),
        },

        // ============= AKADEMIK =============
        {
          path: 'program-keahlian',
          name: 'admin-program-keahlian',
          component: () => import('@/views/admin/akademik/ProgramKeahlianAdminView.vue'),
        },
        {
          path: 'konsentrasi-keahlian',
          name: 'admin-konsentrasi-keahlian',
          component: () => import('@/views/admin/akademik/KonsentrasiKeahlianAdminView.vue'),
        },
        {
          path: 'mata-pelajaran',
          name: 'admin-mata-pelajaran',
          component: () => import('@/views/admin/akademik/MataPelajaranAdminView.vue'),
        },
        {
          path: 'jadwal-pelajaran',
          name: 'admin-jadwal-pelajaran',
          component: () => import('@/views/admin/akademik/JadwalPelajaranAdminView.vue'),
        },
        {
          path: 'struktur-kurikulum',
          name: 'admin-struktur-kurikulum',
          component: () => import('@/views/admin/akademik/StrukturKurikulumAdminView.vue'),
        },
        {
          path: 'kalender-akademik',
          name: 'admin-kalender-akademik',
          component: () => import('@/views/admin/akademik/KalenderAkademikAdminView.vue'),
        },

        // ============= PKL =============
        {
          path: 'perusahaan-pkl',
          name: 'admin-perusahaan-pkl',
          component: () => import('@/views/admin/pkl/PerusahaanPKLAdminView.vue'),
        },
        {
          path: 'pkl',
          name: 'admin-pkl',
          component: () => import('@/views/admin/pkl/PKLAdminView.vue'),
        },
        {
          path: 'laporan-pkl',
          name: 'admin-laporan-pkl',
          component: () => import('@/views/admin/pkl/LaporanPKLAdminView.vue'),
        },

        // ============= PUBLIKASI =============
        {
          path: 'berita',
          name: 'admin-berita',
          component: () => import('@/views/admin/publikasi/BeritaAdminView.vue'),
        },
        {
          path: 'kategori-berita',
          name: 'admin-kategori-berita',
          component: () => import('@/views/admin/publikasi/KategoriBeritaAdminView.vue'),
        },
        {
          path: 'agenda',
          name: 'admin-agenda',
          component: () => import('@/views/admin/publikasi/AgendaAdminView.vue'),
        },
        {
          path: 'informasi',
          name: 'admin-informasi',
          component: () => import('@/views/admin/publikasi/InformasiAdminView.vue'),
        },
        {
          path: 'kategori-informasi',
          name: 'admin-kategori-informasi',
          component: () => import('@/views/admin/publikasi/KategoriInformasiAdminView.vue'),
        },

        // ============= FASILITAS & PROGRAM =============
        {
          path: 'fasilitas',
          name: 'admin-fasilitas',
          component: () => import('@/views/admin/fasilitas/FasilitasAdminView.vue'),
        },
        {
          path: 'program-unggulan',
          name: 'admin-program-unggulan',
          component: () => import('@/views/admin/fasilitas/ProgramUnggulanAdminView.vue'),
        },
        {
          path: 'prestasi',
          name: 'admin-prestasi',
          component: () => import('@/views/admin/prestasi/PrestasiAdminView.vue'),
        },

        // ============= KOMUNIKASI =============
        {
          path: 'kontak',
          name: 'admin-kontak',
          component: () => import('@/views/admin/komunikasi/KontakAdminView.vue'),
        },
        {
          path: 'social-media',
          name: 'admin-social-media',
          component: () => import('@/views/admin/komunikasi/SocialMediaAdminView.vue'),
        },
        {
          path: 'testimoni',
          name: 'admin-testimoni',
          component: () => import('@/views/admin/komunikasi/TestimoniAdminView.vue'),
        },
        {
          path: 'instagram',
          name: 'admin-instagram',
          component: () => import('@/views/admin/komunikasi/InstagramAdminView.vue'),
        },

        // ============= PENGATURAN =============
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/pengaturan/UsersAdminView.vue'),
        },
        {
          path: 'pengaturan-website',
          name: 'admin-pengaturan-website',
          component: () => import('@/views/admin/pengaturan/PengaturanWebsiteAdminView.vue'),
        },
      ],
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // ✅ Debug log (bisa dihapus nanti)
  console.log('Route to:', to.name, to.path)
  console.log('isAuthenticated:', authStore.isAuthenticated)

  // 1. Jika sudah login dan coba akses login page, redirect ke dashboard
  if (to.name === 'login' && authStore.isAuthenticated) {
    const destination = authStore.isAdmin ? 'admin' : 'home'
    console.log('Already logged in, redirecting to:', destination)
    next({ name: destination })
    return
  }

  // 2. Jika route butuh auth
  if (to.meta.requiresAuth === true) {
    if (!authStore.isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // Fetch user jika belum ada
    if (!authStore.user) {
      await authStore.fetchUser()
    }

    // Cek admin access
    if (to.meta.requiresAdmin === true && !authStore.isAdmin) {
      console.log('Not admin, redirecting to home')
      next({ name: 'home' })
      return
    }
  }

  // 3. Lanjutkan
  console.log('Proceeding to route')
  next()
})

export default router
