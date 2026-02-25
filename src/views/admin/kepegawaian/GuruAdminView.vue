<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Data Guru</h1>
          <p class="text-gray-600 mt-1">Kelola data guru SMKN 11 Bandung</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="downloadTemplate"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Template
          </button>
          <button
            @click="openImportModal"
            class="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            Import
          </button>
          <button
            @click="openModal()"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Tambah Guru
          </button>
        </div>
      </div>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 flex gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau NIP..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="filterStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="non-aktif">Non-Aktif</option>
      </select>
      <select
        v-model="filterStatusKepegawaian"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Semua Kepegawaian</option>
        <option value="PNS">PNS</option>
        <option value="PPPK">PPPK</option>
        <option value="Honor">Honor</option>
        <option value="GTY">GTY</option>
        <option value="GTT">GTT</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading...</div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Jenis Kelamin
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Mata Pelajaran
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status Kepegawaian
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in filteredGuru" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
            <td class="px-6 py-4">
              <div v-if="item.foto" class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  :src="getImageUrl(item.foto)"
                  :alt="item.nama"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.nip || '-' }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.nama }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.mata_pelajaran || '-' }}</td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.status_kepegawaian === 'PNS'
                    ? 'bg-green-100 text-green-800'
                    : item.status_kepegawaian === 'Honor'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ item.status_kepegawaian }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-2">
                <button
                  @click="viewDetail(item)"
                  class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Detail"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="editItem(item)"
                  class="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Hapus"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredGuru.length === 0" class="text-center py-8 text-gray-500">
        Belum ada data guru
      </div>
    </div>

    <!-- Modal Form -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ isEdit ? 'Edit' : 'Tambah' }} Data Guru
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                <input
                  v-model="formData.nip"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="NIP"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama Lengkap <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.nama"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Foto</label>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 2MB)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Jenis Kelamin <span class="text-red-500">*</span></label
              >
              <select
                v-model="formData.jenis_kelamin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">- Pilih -</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                <input
                  v-model="formData.tempat_lahir"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tempat lahir"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input
                  v-model="formData.tanggal_lahir"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                v-model="formData.alamat"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alamat lengkap"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  v-model="formData.no_telepon"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08xx"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Pendidikan Terakhir</label
                >
                <input
                  v-model="formData.pendidikan_terakhir"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="S1 / S2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input
                  v-model="formData.mata_pelajaran"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Matematika, Bahasa Indonesia"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input
                  v-model="formData.jabatan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Guru / Wali Kelas"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Kepegawaian <span class="text-red-500">*</span></label
                >
                <select
                  v-model="formData.status_kepegawaian"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">- Pilih -</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="Honor">Honor</option>
                  <option value="GTY">GTY</option>
                  <option value="GTT">GTT</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
              <input
                v-model="formData.tanggal_masuk"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Status <span class="text-red-500">*</span></label
              >
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetailModal"
    >
      <div class="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Data Guru</h2>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedItem" class="space-y-6">
            <div v-if="selectedItem.foto" class="flex justify-center">
              <img
                :src="getImageUrl(selectedItem.foto)"
                :alt="selectedItem.nama"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">NIP</label>
                <p class="text-gray-900">{{ selectedItem.nip || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Nama Lengkap</label>
                <p class="text-gray-900 font-medium">{{ selectedItem.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
                <p class="text-gray-900">
                  {{ selectedItem.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Tempat, Tanggal Lahir</label
                >
                <p class="text-gray-900">
                  {{ selectedItem.tempat_lahir || '-' }},
                  {{ formatDate(selectedItem.tanggal_lahir) }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                <p class="text-gray-900">{{ selectedItem.alamat || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">No. Telepon</label>
                <p class="text-gray-900">{{ selectedItem.no_telepon || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p class="text-gray-900">{{ selectedItem.email || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Pendidikan Terakhir</label
                >
                <p class="text-gray-900">{{ selectedItem.pendidikan_terakhir || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Mata Pelajaran</label>
                <p class="text-gray-900">{{ selectedItem.mata_pelajaran || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Jabatan</label>
                <p class="text-gray-900">{{ selectedItem.jabatan || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1"
                  >Status Kepegawaian</label
                >
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-medium',
                    selectedItem.status_kepegawaian === 'PNS'
                      ? 'bg-green-100 text-green-800'
                      : selectedItem.status_kepegawaian === 'Honor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ selectedItem.status_kepegawaian }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tanggal Masuk</label>
                <p class="text-gray-900">{{ formatDate(selectedItem.tanggal_masuk) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-medium',
                    selectedItem.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ selectedItem.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 pt-4 border-t">
            <button
              @click="closeDetailModal"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Import -->
  <div
    v-if="showImportModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeImportModal"
  >
    <div class="bg-white rounded-lg w-full max-w-md">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Import Data Guru</h2>
          <button @click="closeImportModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex gap-2">
              <svg
                class="w-5 h-5 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div class="text-sm text-blue-800">
                <p class="font-medium mb-1">Panduan Import:</p>
                <ol class="list-decimal list-inside space-y-1">
                  <li>Download template Excel terlebih dahulu</li>
                  <li>Isi data guru sesuai format template</li>
                  <li>Upload file yang sudah diisi</li>
                  <li>Format file: .xlsx atau .xls</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Pilih File Excel </label>
            <input
              ref="importFileInput"
              type="file"
              @change="handleImportFile"
              accept=".xlsx,.xls"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">
              File: {{ importFile?.name || 'Belum ada file dipilih' }}
            </p>
          </div>

          <div v-if="importProgress" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Progress</span>
              <span class="font-medium text-gray-900">{{ importProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-orange-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: importProgress + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeImportModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              @click="handleImport"
              :disabled="!importFile || isImporting"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isImporting ? 'Mengimport...' : 'Import Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import guruApi from '@/api/guru'
import * as XLSX from 'xlsx'

const guru = ref([])
const loading = ref(true)
const showModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const isSubmitting = ref(false)
const selectedItem = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const filterStatusKepegawaian = ref('')

const showImportModal = ref(false)
const importFile = ref(null)
const importFileInput = ref(null)
const isImporting = ref(false)
const importProgress = ref(0)

// Tambahkan fungsi-fungsi ini
const openImportModal = () => {
  showImportModal.value = true
  importFile.value = null
  importProgress.value = 0
}

const closeImportModal = () => {
  showImportModal.value = false
  importFile.value = null
  importProgress.value = 0
  if (importFileInput.value) {
    importFileInput.value.value = ''
  }
}

const handleImportFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (!validTypes.includes(file.type)) {
      alert('Format file tidak valid. Gunakan file .xlsx atau .xls')
      event.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      // Max 5MB
      alert('Ukuran file terlalu besar. Maksimal 5MB')
      event.target.value = ''
      return
    }
    importFile.value = file
  }
}

const formatExcelDate = (excelDate) => {
  if (!excelDate) return ''

  // Jika sudah format string tanggal
  if (typeof excelDate === 'string') {
    // Cek apakah sudah format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
      return excelDate
    }
    // Coba parse format lain
    const date = new Date(excelDate)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return excelDate
  }

  // Jika format Excel serial number
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000)
    return date.toISOString().split('T')[0]
  }

  return ''
}

const handleImport = async () => {
  if (!importFile.value) {
    alert('Pilih file terlebih dahulu')
    return
  }

  try {
    isImporting.value = true
    importProgress.value = 10

    // Baca file Excel
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        importProgress.value = 30

        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        // Ambil sheet pertama
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert ke JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        console.log('Raw Excel Data:', jsonData) // Debug

        // Hapus header (baris pertama)
        const headers = jsonData[0]
        const rows = jsonData.slice(1)

        console.log('Headers:', headers) // Debug
        console.log('Rows:', rows) // Debug

        importProgress.value = 50

        // Validasi dan transform data
        const importData = rows
          .filter((row) => row.length > 0 && row[1]) // Pastikan ada nama
          .map((row, index) => {
            // Sanitasi dan validasi data
            const rowData = {
              nip: row[0] ? String(row[0]).trim() : '',
              nama: row[1] ? String(row[1]).trim() : '',
              jenis_kelamin: row[2] ? String(row[2]).trim().toUpperCase() : 'L',
              tempat_lahir: row[3] ? String(row[3]).trim() : '',
              tanggal_lahir: row[4] ? formatExcelDate(row[4]) : '',
              alamat: row[5] ? String(row[5]).trim() : '',
              no_telepon: row[6] ? String(row[6]).trim() : '',
              email: row[7] ? String(row[7]).trim() : '',
              pendidikan_terakhir: row[8] ? String(row[8]).trim() : '',
              mata_pelajaran: row[9] ? String(row[9]).trim() : '',
              jabatan: row[10] ? String(row[10]).trim() : '',
              status_kepegawaian: row[11] ? String(row[11]).trim() : 'PPPK',
              tanggal_masuk: row[12] ? formatExcelDate(row[12]) : '',
              status: row[13] ? String(row[13]).trim().toLowerCase() : 'aktif',
            }

            // Validasi dan set default values
            if (!rowData.nama) rowData.nama = 'Tanpa Nama'
            if (!rowData.jenis_kelamin || !['L', 'P'].includes(rowData.jenis_kelamin)) {
              rowData.jenis_kelamin = 'L'
            }
            if (
              !rowData.status_kepegawaian ||
              !['PNS', 'PPPK', 'Honor', 'GTY', 'GTT'].includes(rowData.status_kepegawaian)
            ) {
              rowData.status_kepegawaian = 'GTT'
            }
            if (!rowData.status || !['aktif', 'non-aktif'].includes(rowData.status)) {
              rowData.status = 'aktif'
            }

            return rowData
          })

        console.log('Import Data:', importData) // Debug

        if (importData.length === 0) {
          throw new Error('Tidak ada data valid untuk diimport')
        }

        // Validasi data sebelum kirim
        const invalidRows = []
        importData.forEach((item, index) => {
          const errors = []
          if (!item.nama) errors.push('Nama kosong')
          if (!item.jenis_kelamin || !['L', 'P'].includes(item.jenis_kelamin)) {
            errors.push('Jenis kelamin harus L atau P')
          }
          if (
            !item.status_kepegawaian ||
            !['PNS', 'PPPK', 'Honor', 'GTY', 'GTT'].includes(item.status_kepegawaian)
          ) {
            errors.push('Status kepegawaian tidak valid')
          }
          if (!item.status || !['aktif', 'non-aktif'].includes(item.status)) {
            errors.push('Status harus aktif atau non-aktif')
          }

          if (errors.length > 0) {
            invalidRows.push(`Baris ${index + 2}: ${errors.join(', ')}`)
          }
        })

        if (invalidRows.length > 0) {
          throw new Error('Data tidak valid:\n' + invalidRows.slice(0, 5).join('\n'))
        }

        importProgress.value = 70

        console.log('Sending data to API:', {
          count: importData.length,
          sample: importData[0],
        }) // Debug

        // Kirim data ke backend
        const response = await guruApi.import(importData)
        importProgress.value = 100

        if (response.data.success) {
          const result = response.data.data
          let message = `Import berhasil!\n\n`
          message += `✓ Total data: ${importData.length}\n`
          message += `✓ Berhasil: ${result.success || importData.length} data\n`
          if (result.failed > 0) {
            message += `✗ Gagal: ${result.failed} data\n`
          }
          if (result.errors && result.errors.length > 0) {
            message += `\nDetail error:\n`
            result.errors.slice(0, 5).forEach((err, idx) => {
              message += `${idx + 1}. ${err.message}\n`
            })
            if (result.errors.length > 5) {
              message += `... dan ${result.errors.length - 5} error lainnya`
            }
          }

          alert(message)
          closeImportModal()
          fetchData()
        }
      } catch (error) {
        console.error('Error processing Excel:', error)
        console.error('Error response:', error.response?.data) // Debug

        let errorMsg = 'Gagal memproses file Excel: ' + error.message
        if (error.response?.data?.errors) {
          errorMsg += '\n\nDetail validasi:\n'
          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
            errorMsg += `- ${key}: ${messages.join(', ')}\n`
          })
        }

        alert(errorMsg)
      } finally {
        isImporting.value = false
        importProgress.value = 0
      }
    }

    reader.onerror = () => {
      alert('Gagal membaca file')
      isImporting.value = false
      importProgress.value = 0
    }

    reader.readAsArrayBuffer(importFile.value)
  } catch (error) {
    console.error('Error importing data:', error)
    alert('Gagal mengimport data: ' + error.message)
    isImporting.value = false
    importProgress.value = 0
  }
}

const downloadTemplate = () => {
  try {
    // Data untuk worksheet
    const headers = [
      'NIP',
      'Nama Lengkap*',
      'Jenis Kelamin*',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Alamat',
      'No. Telepon',
      'Email',
      'Pendidikan Terakhir',
      'Mata Pelajaran',
      'Jabatan',
      'Status Kepegawaian*',
      'Tanggal Masuk',
      'Status*',
    ]

    const examples = [
      [
        '198001012006041001',
        'Ahmad Subagja',
        'L',
        'Bandung',
        '1980-01-01',
        'Jl. Contoh No. 123 Bandung',
        '081234567890',
        'ahmad@example.com',
        'S1 Pendidikan Matematika',
        'Matematika',
        'Guru Mata Pelajaran',
        'PNS',
        '2006-04-01',
        'aktif',
      ],
      [
        '198505152010072001',
        'Siti Nurhaliza',
        'P',
        'Jakarta',
        '1985-05-15',
        'Jl. Contoh No. 456 Jakarta',
        '082345678901',
        'siti@example.com',
        'S1 Pendidikan Bahasa Indonesia',
        'Bahasa Indonesia',
        'Guru Mata Pelajaran',
        'Honor',
        '2010-07-01',
        'aktif',
      ],
      [
        '',
        'Budi Santoso',
        'L',
        'Cimahi',
        '1990-03-20',
        'Jl. Contoh No. 789 Cimahi',
        '083456789012',
        'budi@example.com',
        'S1 Teknik Informatika',
        'Pemrograman Web',
        'Guru Produktif',
        'GTT',
        '2015-08-01',
        'aktif',
      ],
    ]

    // Gabungkan header dan data
    const data = [headers, ...examples]

    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(data)

    // Set column widths
    const colWidths = [
      { wch: 20 }, // NIP
      { wch: 25 }, // Nama
      { wch: 15 }, // Jenis Kelamin
      { wch: 15 }, // Tempat Lahir
      { wch: 15 }, // Tanggal Lahir
      { wch: 35 }, // Alamat
      { wch: 15 }, // No Telepon
      { wch: 25 }, // Email
      { wch: 25 }, // Pendidikan
      { wch: 20 }, // Mata Pelajaran
      { wch: 20 }, // Jabatan
      { wch: 20 }, // Status Kepegawaian
      { wch: 15 }, // Tanggal Masuk
      { wch: 12 }, // Status
    ]
    ws['!cols'] = colWidths

    // Buat workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template Guru')

    // Generate dan download
    XLSX.writeFile(wb, 'template_import_guru.xlsx')

    // Tampilkan instruksi
    setTimeout(() => {
      alert(
        '✓ Template Excel berhasil didownload!\n\n' +
          'PETUNJUK PENGISIAN:\n' +
          '━━━━━━━━━━━━━━━━━━━━━━\n' +
          '• Kolom dengan tanda (*) WAJIB diisi\n' +
          '• Jenis Kelamin: L (Laki-laki) atau P (Perempuan)\n' +
          '• Status Kepegawaian: PNS, PPPK, Honor, GTY, atau GTT\n' +
          '• Status: aktif atau non-aktif\n' +
          '• Format Tanggal: YYYY-MM-DD (contoh: 1980-01-01)\n' +
          '• Simpan file dalam format .xlsx saat upload\n\n' +
          'Baris 2-4 adalah contoh data yang bisa dihapus.',
      )
    }, 100)
  } catch (error) {
    console.error('Error creating template:', error)
    alert('Gagal membuat template: ' + error.message)
  }
}

const formData = ref({
  nip: '',
  nama: '',
  foto: null,
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat: '',
  no_telepon: '',
  email: '',
  pendidikan_terakhir: '',
  mata_pelajaran: '',
  jabatan: '',
  status_kepegawaian: '',
  tanggal_masuk: '',
  status: 'aktif',
})

const filteredGuru = computed(() => {
  return guru.value.filter((item) => {
    const matchSearch =
      !searchQuery.value ||
      item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.nip && item.nip.includes(searchQuery.value))

    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchKepegawaian =
      !filterStatusKepegawaian.value || item.status_kepegawaian === filterStatusKepegawaian.value

    return matchSearch && matchStatus && matchKepegawaian
  })
})

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    loading.value = true
    const response = await guruApi.getAll()
    if (response.data.success) {
      guru.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('Gagal memuat data guru')
  } finally {
    loading.value = false
  }
}

const getImageUrl = (foto) => {
  if (!foto) return ''
  if (foto.startsWith('http')) return foto
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'
  return `${baseUrl}/${foto}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

const openModal = () => {
  isEdit.value = false
  selectedItem.value = null
  resetForm()
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
}

const resetForm = () => {
  formData.value = {
    nip: '',
    nama: '',
    foto: null,
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: '',
    email: '',
    pendidikan_terakhir: '',
    mata_pelajaran: '',
    jabatan: '',
    status_kepegawaian: '',
    tanggal_masuk: '',
    status: 'aktif',
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.foto = file
  }
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const editItem = (item) => {
  isEdit.value = true
  selectedItem.value = item
  formData.value = {
    nip: item.nip || '',
    nama: item.nama,
    foto: null,
    jenis_kelamin: item.jenis_kelamin,
    tempat_lahir: item.tempat_lahir || '',
    tanggal_lahir: item.tanggal_lahir || '',
    alamat: item.alamat || '',
    no_telepon: item.no_telepon || '',
    email: item.email || '',
    pendidikan_terakhir: item.pendidikan_terakhir || '',
    mata_pelajaran: item.mata_pelajaran || '',
    jabatan: item.jabatan || '',
    status_kepegawaian: item.status_kepegawaian,
    tanggal_masuk: item.tanggal_masuk || '',
    status: item.status,
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    let response
    if (isEdit.value) {
      response = await guruApi.update(selectedItem.value.id, formData.value)
    } else {
      response = await guruApi.create(formData.value)
    }

    if (response.data.success) {
      alert(isEdit.value ? 'Data berhasil diupdate' : 'Data berhasil ditambahkan')
      closeModal()
      fetchData()
    }
  } catch (error) {
    console.error('Error saving data:', error)
    const errorMsg = error.response?.data?.message || error.message
    alert('Gagal menyimpan data: ' + errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

const deleteItem = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

  try {
    const response = await guruApi.delete(id)
    if (response.data.success) {
      alert('Data berhasil dihapus')
      fetchData()
    }
  } catch (error) {
    console.error('Error deleting data:', error)
    alert('Gagal menghapus data')
  }
}
</script>
