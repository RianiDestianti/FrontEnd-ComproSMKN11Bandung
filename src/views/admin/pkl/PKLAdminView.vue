<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Praktek Kerja Lapangan (PKL)</h1>
        <p class="text-gray-600 mt-1">Kelola data PKL siswa</p>
      </div>
      <button
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah PKL
      </button>
    </div>

    <!-- Filter Section -->
    <div class="border-t border-gray-200 pt-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari siswa atau perusahaan..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debounceSearch"
          />
        </div>

        <!-- Filter Perusahaan -->
        <div>
          <select
            v-model="filters.perusahaan_pkl_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="fetchData"
          >
            <option value="">Semua Perusahaan</option>
            <option v-for="p in perusahaanList" :key="p.id" :value="p.id">
              {{ p.nama_perusahaan }}
            </option>
          </select>
        </div>

        <!-- Filter Status -->
        <div>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="fetchData"
          >
            <option value="">Semua Status</option>
            <option value="Berlangsung">Berlangsung</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              No
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Siswa
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Perusahaan
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Periode
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Posisi
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pembimbing
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nilai
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="pklList.length === 0">
            <td colspan="9" class="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
          </tr>
          <tr v-for="(item, index) in pklList" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ item.siswa?.nama || '-' }}</div>
              <div class="text-sm text-gray-500">{{ item.siswa?.nis || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ item.perusahaan_pkl?.nama_perusahaan || '-' }}
              </div>
              <div class="text-sm text-gray-500">{{ item.perusahaan_pkl?.kota || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>{{ formatDate(item.tanggal_mulai) }}</div>
              <div class="text-gray-500">s/d {{ formatDate(item.tanggal_selesai) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ item.posisi || '-' }}</div>
              <div class="text-sm text-gray-500">{{ item.divisi || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ item.pembimbing_sekolah?.nama || '-' }}</div>
              <div class="text-sm text-gray-500">{{ item.pembimbing_industri || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(item.status)">
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.nilai ? item.nilai : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="openDetailModal(item)"
                class="text-green-600 hover:text-green-900 mr-3"
                title="Detail"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="openEditModal(item)"
                class="text-blue-600 hover:text-blue-900 mr-3"
                title="Edit"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="confirmDelete(item)"
                class="text-red-600 hover:text-red-900"
                title="Hapus"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white my-10"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Data PKL' : 'Tambah Data PKL' }}
          </h3>
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

        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Siswa -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Siswa <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="searchSiswa"
                  @focus="showSiswaDropdown = true"
                  @input="showSiswaDropdown = true"
                  type="text"
                  placeholder="Ketik untuk mencari siswa..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.siswa_id }"
                  required
                />
                <button
                  v-if="form.siswa_id"
                  @click="clearSiswa"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div
                  v-if="showSiswaDropdown && filteredSiswaList.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="siswa in filteredSiswaList"
                    :key="siswa.id"
                    @click="selectSiswa(siswa)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <div class="font-medium text-gray-900">{{ siswa.nama }}</div>
                    <div class="text-sm text-gray-500">{{ siswa.nis }}</div>
                  </div>
                </div>
              </div>
              <p v-if="errors.siswa_id" class="mt-1 text-sm text-red-600">
                {{ errors.siswa_id[0] }}
              </p>
            </div>

            <!-- Perusahaan PKL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Perusahaan PKL <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="searchPerusahaan"
                  @focus="showPerusahaanDropdown = true"
                  @input="showPerusahaanDropdown = true"
                  type="text"
                  placeholder="Ketik untuk mencari perusahaan..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.perusahaan_pkl_id }"
                  required
                />
                <button
                  v-if="form.perusahaan_pkl_id"
                  @click="clearPerusahaan"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div
                  v-if="showPerusahaanDropdown && filteredPerusahaanList.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="perusahaan in filteredPerusahaanList"
                    :key="perusahaan.id"
                    @click="selectPerusahaan(perusahaan)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <div class="font-medium text-gray-900">{{ perusahaan.nama_perusahaan }}</div>
                    <div class="text-sm text-gray-500">{{ perusahaan.kota }}</div>
                  </div>
                </div>
              </div>
              <p v-if="errors.perusahaan_pkl_id" class="mt-1 text-sm text-red-600">
                {{ errors.perusahaan_pkl_id[0] }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Tanggal Mulai -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.tanggal_mulai"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.tanggal_mulai }"
                required
              />
              <p v-if="errors.tanggal_mulai" class="mt-1 text-sm text-red-600">
                {{ errors.tanggal_mulai[0] }}
              </p>
            </div>

            <!-- Tanggal Selesai -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.tanggal_selesai"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.tanggal_selesai }"
                required
              />
              <p v-if="errors.tanggal_selesai" class="mt-1 text-sm text-red-600">
                {{ errors.tanggal_selesai[0] }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Posisi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Posisi </label>
              <input
                v-model="form.posisi"
                type="text"
                placeholder="Contoh: Staff IT"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Divisi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Divisi </label>
              <input
                v-model="form.divisi"
                type="text"
                placeholder="Contoh: IT & Development"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Pembimbing Sekolah -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pembimbing Sekolah
              </label>
              <div class="relative">
                <input
                  v-model="searchGuru"
                  @focus="showGuruDropdown = true"
                  @input="showGuruDropdown = true"
                  type="text"
                  placeholder="Ketik untuk mencari guru..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  v-if="form.pembimbing_sekolah_id"
                  @click="clearGuru"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div
                  v-if="showGuruDropdown && filteredGuruList.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="guru in filteredGuruList"
                    :key="guru.id"
                    @click="selectGuru(guru)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <div class="font-medium text-gray-900">{{ guru.nama }}</div>
                    <div class="text-sm text-gray-500">{{ guru.nip }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pembimbing Industri -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pembimbing Industri
              </label>
              <input
                v-model="form.pembimbing_industri"
                type="text"
                placeholder="Nama pembimbing dari perusahaan"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- No Telepon Industri -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon Pembimbing Industri
              </label>
              <input
                v-model="form.no_telepon_industri"
                type="text"
                placeholder="08xxxxxxxxxx"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Nilai -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Nilai (0-100) </label>
              <input
                v-model.number="form.nilai"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Nilai akhir PKL"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.nilai }"
              />
              <p v-if="errors.nilai" class="mt-1 text-sm text-red-600">
                {{ errors.nilai[0] }}
              </p>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.status }"
              required
            >
              <option value="">Pilih Status</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">
              {{ errors.status[0] }}
            </p>
          </div>

          <!-- Catatan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Catatan </label>
            <textarea
              v-model="form.catatan"
              rows="3"
              placeholder="Catatan tambahan (opsional)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white my-10"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">Detail PKL</h3>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
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

        <div v-if="selectedItem" class="space-y-4">
          <!-- Informasi Siswa -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Informasi Siswa</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">Nama:</span>
                <p class="font-medium">{{ selectedItem.siswa?.nama || '-' }}</p>
              </div>
              <div>
                <span class="text-gray-600">NIS:</span>
                <p class="font-medium">{{ selectedItem.siswa?.nis || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Informasi Perusahaan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Informasi Perusahaan</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">Nama Perusahaan:</span>
                <p class="font-medium">{{ selectedItem.perusahaan_pkl?.nama_perusahaan || '-' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Kota:</span>
                <p class="font-medium">{{ selectedItem.perusahaan_pkl?.kota || '-' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Posisi:</span>
                <p class="font-medium">{{ selectedItem.posisi || '-' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Divisi:</span>
                <p class="font-medium">{{ selectedItem.divisi || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Informasi Periode -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Periode PKL</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">Tanggal Mulai:</span>
                <p class="font-medium">{{ formatDate(selectedItem.tanggal_mulai) }}</p>
              </div>
              <div>
                <span class="text-gray-600">Tanggal Selesai:</span>
                <p class="font-medium">{{ formatDate(selectedItem.tanggal_selesai) }}</p>
              </div>
              <div>
                <span class="text-gray-600">Status:</span>
                <p>
                  <span :class="getStatusClass(selectedItem.status)">{{
                    selectedItem.status
                  }}</span>
                </p>
              </div>
              <div>
                <span class="text-gray-600">Nilai:</span>
                <p class="font-medium">{{ selectedItem.nilai || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Informasi Pembimbing -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">Pembimbing</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">Pembimbing Sekolah:</span>
                <p class="font-medium">{{ selectedItem.pembimbing_sekolah?.nama || '-' }}</p>
              </div>
              <div>
                <span class="text-gray-600">Pembimbing Industri:</span>
                <p class="font-medium">{{ selectedItem.pembimbing_industri || '-' }}</p>
              </div>
              <div v-if="selectedItem.no_telepon_industri" class="col-span-2">
                <span class="text-gray-600">No. Telepon Industri:</span>
                <p class="font-medium">{{ selectedItem.no_telepon_industri }}</p>
              </div>
            </div>
          </div>

          <!-- Catatan -->
          <div v-if="selectedItem.catatan" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Catatan</h4>
            <p class="text-sm text-gray-700">{{ selectedItem.catatan }}</p>
          </div>
        </div>

        <div class="flex justify-end mt-6 pt-4 border-t">
          <button
            @click="showDetailModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Hapus Data PKL</h3>
          <p class="text-sm text-gray-500 mt-2">
            Apakah Anda yakin ingin menghapus data PKL ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-center gap-3 mt-6">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              @click="deleteData"
              :disabled="submitting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {{ submitting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transition-all z-50',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
      ]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import pklService from '@/api/pkl'

// State
const loading = ref(false)
const submitting = ref(false)
const showModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const pklList = ref([])
const siswaList = ref([])
const perusahaanList = ref([])
const guruList = ref([])
const selectedItem = ref(null)
const errors = ref({})
const toast = ref({ show: false, message: '', type: 'success' })

// Form data
const form = ref({
  siswa_id: '',
  perusahaan_pkl_id: '',
  pembimbing_sekolah_id: '',
  pembimbing_industri: '',
  no_telepon_industri: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  posisi: '',
  divisi: '',
  nilai: '',
  catatan: '',
  status: '',
})

// Filters
const filters = ref({
  search: '',
  perusahaan_pkl_id: '',
  status: '',
})

// Searchable select
const searchSiswa = ref('')
const searchPerusahaan = ref('')
const searchGuru = ref('')
const showSiswaDropdown = ref(false)
const showPerusahaanDropdown = ref(false)
const showGuruDropdown = ref(false)

// Item to delete
const itemToDelete = ref(null)

// Search debounce timer
let searchTimer = null

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    const response = await pklService.getAll(filters.value)

    if (response.data.success) {
      pklList.value = response.data.data
    }
  } catch (error) {
    showToast('Gagal memuat data', 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchFormData = async () => {
  try {
    const response = await pklService.getFormData()

    if (response.data.success) {
      siswaList.value = response.data.data.siswa
      perusahaanList.value = response.data.data.perusahaan
      guruList.value = response.data.data.guru
    }
  } catch (error) {
    console.error('Error fetching form data:', error)
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchData()
  }, 500)
}

// Computed untuk filtered lists
const filteredSiswaList = computed(() => {
  if (!searchSiswa.value) return siswaList.value
  const search = searchSiswa.value.toLowerCase()
  return siswaList.value.filter(
    (s) => s.nama.toLowerCase().includes(search) || s.nis.toLowerCase().includes(search),
  )
})

const filteredPerusahaanList = computed(() => {
  if (!searchPerusahaan.value) return perusahaanList.value
  const search = searchPerusahaan.value.toLowerCase()
  return perusahaanList.value.filter(
    (p) =>
      p.nama_perusahaan.toLowerCase().includes(search) ||
      (p.kota && p.kota.toLowerCase().includes(search)),
  )
})

const filteredGuruList = computed(() => {
  if (!searchGuru.value) return guruList.value
  const search = searchGuru.value.toLowerCase()
  return guruList.value.filter(
    (g) => g.nama.toLowerCase().includes(search) || (g.nip && g.nip.toLowerCase().includes(search)),
  )
})

// Get selected names
const selectedSiswaName = computed(() => {
  if (!form.value.siswa_id) return ''
  const siswa = siswaList.value.find((s) => s.id === form.value.siswa_id)
  return siswa ? `${siswa.nama} - ${siswa.nis}` : ''
})

const selectedPerusahaanName = computed(() => {
  if (!form.value.perusahaan_pkl_id) return ''
  const perusahaan = perusahaanList.value.find((p) => p.id === form.value.perusahaan_pkl_id)
  return perusahaan ? `${perusahaan.nama_perusahaan} - ${perusahaan.kota}` : ''
})

const selectedGuruName = computed(() => {
  if (!form.value.pembimbing_sekolah_id) return ''
  const guru = guruList.value.find((g) => g.id === form.value.pembimbing_sekolah_id)
  return guru ? `${guru.nama} - ${guru.nip}` : ''
})

const selectSiswa = (siswa) => {
  form.value.siswa_id = siswa.id
  searchSiswa.value = `${siswa.nama} - ${siswa.nis}`
  showSiswaDropdown.value = false
}

const selectPerusahaan = (perusahaan) => {
  form.value.perusahaan_pkl_id = perusahaan.id
  searchPerusahaan.value = `${perusahaan.nama_perusahaan} - ${perusahaan.kota}`
  showPerusahaanDropdown.value = false
}

const selectGuru = (guru) => {
  form.value.pembimbing_sekolah_id = guru.id
  searchGuru.value = `${guru.nama} - ${guru.nip}`
  showGuruDropdown.value = false
}

const clearSiswa = () => {
  form.value.siswa_id = ''
  searchSiswa.value = ''
}

const clearPerusahaan = () => {
  form.value.perusahaan_pkl_id = ''
  searchPerusahaan.value = ''
}

const clearGuru = () => {
  form.value.pembimbing_sekolah_id = ''
  searchGuru.value = ''
}

const openCreateModal = () => {
  isEdit.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (item) => {
  isEdit.value = true
  form.value = {
    id: item.id,
    siswa_id: item.siswa_id,
    perusahaan_pkl_id: item.perusahaan_pkl_id,
    pembimbing_sekolah_id: item.pembimbing_sekolah_id || '',
    pembimbing_industri: item.pembimbing_industri || '',
    no_telepon_industri: item.no_telepon_industri || '',
    tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split(' ')[0] : '',
    tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split(' ')[0] : '',
    posisi: item.posisi || '',
    divisi: item.divisi || '',
    nilai: item.nilai || '',
    catatan: item.catatan || '',
    status: item.status,
  }
  // Set search values untuk edit
  if (item.siswa) {
    searchSiswa.value = `${item.siswa.nama} - ${item.siswa.nis}`
  }
  if (item.perusahaan_pkl) {
    searchPerusahaan.value = `${item.perusahaan_pkl.nama_perusahaan} - ${item.perusahaan_pkl.kota}`
  }
  if (item.pembimbing_sekolah) {
    searchGuru.value = `${item.pembimbing_sekolah.nama} - ${item.pembimbing_sekolah.nip}`
  }
  showModal.value = true
}

const openDetailModal = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    siswa_id: '',
    perusahaan_pkl_id: '',
    pembimbing_sekolah_id: '',
    pembimbing_industri: '',
    no_telepon_industri: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    posisi: '',
    divisi: '',
    nilai: '',
    catatan: '',
    status: '',
  }
  searchSiswa.value = ''
  searchPerusahaan.value = ''
  searchGuru.value = ''
  errors.value = {}
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    let response
    if (isEdit.value) {
      response = await pklService.update(form.value.id, form.value)
    } else {
      response = await pklService.create(form.value)
    }

    if (response.data.success) {
      showToast(response.data.message, 'success')
      closeModal()
      fetchData()
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      showToast(error.response?.data?.message || 'Terjadi kesalahan', 'error')
    }
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const deleteData = async () => {
  submitting.value = true
  try {
    const response = await pklService.delete(itemToDelete.value.id)

    if (response.data.success) {
      showToast(response.data.message, 'success')
      showDeleteModal.value = false
      fetchData()
    }
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus data', 'error')
  } finally {
    submitting.value = false
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ]
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const getStatusClass = (status) => {
  const classes = {
    Berlangsung:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800',
    Selesai:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
    Dibatalkan:
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800',
  }
  return (
    classes[status] ||
    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  )
}

// Lifecycle
onMounted(() => {
  fetchData()
  fetchFormData()
})
</script>
