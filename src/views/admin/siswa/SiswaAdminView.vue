<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen Siswa</h1>
        <p class="text-gray-600 mt-1">Kelola data siswa dan informasi akademik</p>
      </div>
      <!-- ✅ TAMBAHKAN wrapper div untuk grouping buttons -->
      <div class="flex gap-2">
        <button
          @click="showImportModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Import Data
        </button>
        <button
          @click="showImportFotoModal = true"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Import Foto
        </button>
        <button
          @click="openModal('create')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Siswa
        </button>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Cari berdasarkan nama, NIS, atau NISN..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <select
        v-model="filterStatus"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="alumni">Alumni</option>
        <option value="keluar">Keluar</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table -->
    <div v-else class="border-t border-gray-200 pt-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Foto
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                NIS
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jenis Kelamin
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kelas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="siswa in siswaList" :key="siswa.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="siswa.foto_url || '/default-avatar.png'"
                  :alt="siswa.nama"
                  class="h-10 w-10 rounded-full object-cover"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ siswa.nis }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ siswa.nama }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ siswa.kelas ? `${siswa.kelas.tingkat} ${siswa.kelas.nama_kelas}` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(siswa.status)"
                >
                  {{ siswa.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="openModal('detail', siswa)"
                  class="text-green-600 hover:text-green-900 transition-colors"
                >
                  Detail
                </button>
                <button
                  @click="openModal('edit', siswa)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(siswa)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="siswaList.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Belum ada data siswa</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-700">Tampilkan:</label>
        <select
          v-model="perPage"
          @change="changePerPage"
          class="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span class="text-sm text-gray-700"> dari {{ totalItems }} data </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div class="flex gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            v-show="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
            class="px-3 py-1 border rounded-lg transition-colors"
            :class="
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            "
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal && modalMode !== 'detail'"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ modalMode === 'create' ? 'Tambah Siswa Baru' : 'Edit Siswa' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Data Pribadi -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Pribadi</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">NIS *</label>
                  <input
                    v-model="form.nis"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">NISN</label>
                  <input
                    v-model="form.nisn"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                    v-model="form.nama"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Jenis Kelamin *</label
                  >
                  <select
                    v-model="form.jenis_kelamin"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                  <input
                    v-model="form.tempat_lahir"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                  <input
                    v-model="form.tanggal_lahir"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                  <input
                    @change="handleFotoChange"
                    type="file"
                    accept="image/*"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maks 2MB</p>
                </div>
              </div>
            </div>

            <!-- Kontak -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    v-model="form.alamat"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                  <input
                    v-model="form.no_telepon"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Data Orang Tua -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Orang Tua</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ayah</label>
                  <input
                    v-model="form.nama_ayah"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pekerjaan Ayah</label>
                  <input
                    v-model="form.pekerjaan_ayah"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ibu</label>
                  <input
                    v-model="form.nama_ibu"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pekerjaan Ibu</label>
                  <input
                    v-model="form.pekerjaan_ibu"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >No. Telepon Orang Tua</label
                  >
                  <input
                    v-model="form.no_telepon_ortu"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Data Akademik -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Akademik</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <select
                    v-model="form.kelas_id"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih Kelas</option>
                    <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
                      {{ kelas.nama_kelas }} - {{ kelas.konsentrasi_keahlian?.nama_konsentrasi }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Masuk</label>
                  <input
                    v-model="form.tahun_masuk"
                    type="number"
                    min="2000"
                    max="2100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    v-model="form.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="alumni">Alumni</option>
                    <option value="keluar">Keluar</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {{ errorMessage }}
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="showModal && modalMode === 'detail'"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Siswa</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div v-if="selectedSiswa" class="space-y-6">
            <div class="flex items-center gap-6">
              <img
                :src="selectedSiswa.foto_url || '/default-avatar.png'"
                :alt="selectedSiswa.nama"
                class="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <h3 class="text-2xl font-bold text-gray-900">{{ selectedSiswa.nama }}</h3>
                <p class="text-gray-600">{{ selectedSiswa.nis }}</p>
                <span
                  class="inline-block px-3 py-1 text-sm font-semibold rounded-full mt-2"
                  :class="getStatusClass(selectedSiswa.status)"
                >
                  {{ selectedSiswa.status }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Data Pribadi</h4>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm text-gray-500">NISN</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.nisn || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Jenis Kelamin</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Tempat, Tanggal Lahir</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.tempat_lahir || '-' }},
                      {{ selectedSiswa.tanggal_lahir || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Alamat</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.alamat || '-' }}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Kontak</h4>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm text-gray-500">No. Telepon</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.no_telepon || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Email</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.email || '-' }}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Data Orang Tua</h4>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm text-gray-500">Nama Ayah</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.nama_ayah || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Pekerjaan Ayah</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.pekerjaan_ayah || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Nama Ibu</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.nama_ibu || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Pekerjaan Ibu</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.pekerjaan_ibu || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">No. Telepon Orang Tua</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.no_telepon_ortu || '-' }}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Data Akademik</h4>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm text-gray-500">Kelas</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.kelas?.nama_kelas || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Konsentrasi Keahlian</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.kelas?.konsentrasi_keahlian?.nama_konsentrasi || '-' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm text-gray-500">Tahun Masuk</dt>
                    <dd class="text-sm font-medium text-gray-900">
                      {{ selectedSiswa.tahun_masuk || '-' }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus siswa <strong>{{ deleteTarget?.nama }}</strong
          >? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            @click="deleteSiswa"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Import Data Siswa</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Upload File Excel </label>
            <input
              @change="handleImportFile"
              type="file"
              accept=".xlsx,.xls"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Format: .xlsx atau .xls</p>
          </div>

          <button
            @click="downloadTemplate"
            class="w-full text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Template Excel
          </button>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showImportModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            @click="submitImport"
            :disabled="isSubmitting || !importFile"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Mengimport...' : 'Import' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Foto Modal -->
    <div
      v-if="showImportFotoModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Import Foto Siswa</h3>

        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Petunjuk Import Foto
            </h4>
            <ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Siapkan foto dalam format JPG atau PNG</li>
              <li>Nama file foto harus sesuai dengan <strong>NISN</strong> siswa</li>
              <li>Contoh: <code class="bg-blue-100 px-1 rounded">0051234567.jpg</code></li>
              <li>Kompres semua foto ke dalam file ZIP</li>
              <li>Upload file ZIP tersebut</li>
            </ul>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload File ZIP Foto
            </label>
            <input
              @change="handleImportFotoFile"
              type="file"
              accept=".zip"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p class="text-xs text-gray-500 mt-1">Format: .zip (Maks 50MB)</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showImportFotoModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            @click="submitImportFoto"
            :disabled="isSubmitting || !importFotoFile"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Mengimport...' : 'Import Foto' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 z-50 transition-all duration-300"
      :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      <div class="text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <svg
          v-if="toast.type === 'success'"
          class="w-6 h-6"
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
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import siswaApi from '@/api/siswa'

const loading = ref(false)
const siswaList = ref([])
const kelasList = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('create')
const isSubmitting = ref(false)
const errorMessage = ref('')
const deleteTarget = ref(null)
const selectedSiswa = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const currentPage = ref(1)
const perPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)
const showImportModal = ref(false)
const importFile = ref(null)
const importFotoFile = ref(null)
const showImportFotoModal = ref(false)
const importProgress = ref(0)

const form = ref({
  nis: '',
  nisn: '',
  nama: '',
  foto: null,
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat: '',
  no_telepon: '',
  email: '',
  nama_ayah: '',
  nama_ibu: '',
  pekerjaan_ayah: '',
  pekerjaan_ibu: '',
  no_telepon_ortu: '',
  kelas_id: '',
  tahun_masuk: '',
  status: 'aktif',
})

const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

onMounted(() => {
  fetchSiswa()
  fetchFormData()
})

const fetchSiswa = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
    }
    if (filterStatus.value) params.status = filterStatus.value
    if (searchQuery.value) params.search = searchQuery.value

    const response = await siswaApi.getAll(params)
    siswaList.value = response.data.data
    currentPage.value = response.data.current_page
    totalPages.value = response.data.last_page
    totalItems.value = response.data.total
    perPage.value = response.data.per_page
  } catch (error) {
    showToast('Gagal memuat data siswa', 'error')
    console.error('Error fetching siswa:', error)
  } finally {
    loading.value = false
  }
}

const fetchFormData = async () => {
  try {
    const response = await siswaApi.getFormData()
    kelasList.value = response.data.data.kelas
  } catch (error) {
    console.error('Error fetching form data:', error)
  }
}

const handleSearch = () => {
  fetchSiswa()
}

const handleFilter = () => {
  fetchSiswa()
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchSiswa()
  }
}

const changePerPage = () => {
  currentPage.value = 1
  fetchSiswa()
}

const handleFotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.foto = file
  }
}

const openModal = (mode, siswa = null) => {
  modalMode.value = mode
  errorMessage.value = ''

  if (mode === 'detail' && siswa) {
    selectedSiswa.value = siswa
  } else if (mode === 'edit' && siswa) {
    form.value = {
      id: siswa.id,
      nis: siswa.nis,
      nisn: siswa.nisn || '',
      nama: siswa.nama,
      foto: null,
      jenis_kelamin: siswa.jenis_kelamin,
      tempat_lahir: siswa.tempat_lahir || '',
      tanggal_lahir: siswa.tanggal_lahir ? formatDateForInput(siswa.tanggal_lahir) : '',
      alamat: siswa.alamat || '',
      no_telepon: siswa.no_telepon || '',
      email: siswa.email || '',
      nama_ayah: siswa.nama_ayah || '',
      nama_ibu: siswa.nama_ibu || '',
      pekerjaan_ayah: siswa.pekerjaan_ayah || '',
      pekerjaan_ibu: siswa.pekerjaan_ibu || '',
      no_telepon_ortu: siswa.no_telepon_ortu || '',
      kelas_id: siswa.kelas_id || '',
      tahun_masuk: siswa.tahun_masuk || '',
      status: siswa.status,
    }
  } else {
    form.value = {
      nis: '',
      nisn: '',
      nama: '',
      foto: null,
      jenis_kelamin: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      alamat: '',
      no_telepon: '',
      email: '',
      nama_ayah: '',
      nama_ibu: '',
      pekerjaan_ayah: '',
      pekerjaan_ibu: '',
      no_telepon_ortu: '',
      kelas_id: '',
      tahun_masuk: '',
      status: 'aktif',
    }
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSiswa.value = null
  form.value = {
    nis: '',
    nisn: '',
    nama: '',
    foto: null,
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    email: '',
    nama_ayah: '',
    nama_ibu: '',
    pekerjaan_ayah: '',
    pekerjaan_ibu: '',
    no_telepon_ortu: '',
    kelas_id: '',
    tahun_masuk: '',
    status: 'aktif',
  }
  errorMessage.value = ''
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (modalMode.value === 'create') {
      await siswaApi.create(form.value)
      showToast('Siswa berhasil ditambahkan', 'success')
    } else {
      await siswaApi.update(form.value.id, form.value)
      showToast('Siswa berhasil diupdate', 'success')
    }

    closeModal()
    fetchSiswa()
  } catch (error) {
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      errorMessage.value = errors.join(', ')
    } else {
      errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleImportFile = (event) => {
  importFile.value = event.target.files[0]
}

const downloadTemplate = async () => {
  try {
    const response = await siswaApi.downloadTemplate()
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'template_siswa.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    showToast('Gagal mengunduh template', 'error')
  }
}

const submitImport = async () => {
  if (!importFile.value) {
    showToast('Pilih file terlebih dahulu', 'error')
    return
  }

  isSubmitting.value = true
  try {
    await siswaApi.import(importFile.value)
    showToast('Data berhasil diimport', 'success')
    showImportModal.value = false
    importFile.value = null
    fetchSiswa()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal import data', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// ✅ Handler untuk file foto ZIP
const handleImportFotoFile = (event) => {
  importFotoFile.value = event.target.files[0]
  console.log('File dipilih:', importFotoFile.value) // Debug
}

// ✅ Submit import foto
const submitImportFoto = async () => {
  console.log('submitImportFoto dipanggil') // Debug

  if (!importFotoFile.value) {
    showToast('Pilih file ZIP terlebih dahulu', 'error')
    return
  }

  isSubmitting.value = true
  try {
    console.log('Memanggil API importFoto...') // Debug
    const response = await siswaApi.importFoto(importFotoFile.value)

    if (response.data.data.failed > 0) {
      showToast(response.data.message, 'success')
      if (response.data.data.errors.length > 0) {
        console.log('Import errors:', response.data.data.errors)
      }
    } else {
      showToast('Semua foto berhasil diimport', 'success')
    }

    showImportFotoModal.value = false
    importFotoFile.value = null
    fetchSiswa()
  } catch (error) {
    console.error('Error import foto:', error) // Debug
    showToast(error.response?.data?.message || 'Gagal import foto', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (siswa) => {
  deleteTarget.value = siswa
  showDeleteModal.value = true
}

const deleteSiswa = async () => {
  isSubmitting.value = true

  try {
    await siswaApi.delete(deleteTarget.value.id)
    showToast('Siswa berhasil dihapus', 'success')
    showDeleteModal.value = false
    deleteTarget.value = null
    fetchSiswa()
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus siswa', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    aktif: 'bg-green-100 text-green-800',
    alumni: 'bg-blue-100 text-blue-800',
    keluar: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  // Jika sudah format YYYY-MM-DD, return langsung
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }

  // Jika format lain, convert ke YYYY-MM-DD
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
</script>
