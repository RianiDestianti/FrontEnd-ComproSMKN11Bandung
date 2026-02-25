<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-gray-600 mt-1">{{ pageDescription }}</p>
      </div>
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
        Tambah Konten
      </button>
    </div>

    <!-- Filter & Search -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Cari berdasarkan judul atau konten..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <select
        v-model="filterKategori"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Kategori</option>
        <option value="Artikel">Artikel</option>
        <option value="Puisi">Puisi</option>
        <option value="Cerpen">Cerpen</option>
        <option value="Karya Seni">Karya Seni</option>
        <option value="Video">Video</option>
      </select>
      <select
        v-model="filterStatus"
        @change="handleFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Semua Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="rejected">Rejected</option>
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
                Gambar
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Judul
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Penulis
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Views
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Komentar
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
            <tr v-if="pojokSiswaList.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                Tidak ada data pojok siswa
              </td>
            </tr>
            <tr v-for="item in pojokSiswaList" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  v-if="item.gambar"
                  :src="getImageUrl(item.gambar)"
                  :alt="item.judul"
                  class="h-16 w-16 rounded object-cover"
                />
                <div v-else class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ item.judul }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(item.created_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ item.kategori }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.siswa?.nama || 'Anonim' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.views || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.komentar_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    item.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button
                    @click="openModal('detail', item)"
                    class="text-gray-600 hover:text-gray-900"
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
                    @click="openModal('edit', item)"
                    class="text-blue-600 hover:text-blue-900"
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && pojokSiswaList.length > 0"
      class="mt-6 flex items-center justify-between"
    >
      <div class="text-sm text-gray-700">
        Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }} data
      </div>
      <div class="flex gap-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-2 border rounded-lg',
            page === pagination.current_page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
        </button>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="showModal && (modalMode === 'create' || modalMode === 'edit')"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ modalMode === 'create' ? 'Tambah' : 'Edit' }} Pojok Siswa
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

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <!-- Siswa -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Penulis (Siswa) </label>
            <div class="relative">
              <input
                v-model="siswaSearch"
                @focus="showSiswaDropdown = true"
                type="text"
                placeholder="Ketik nama atau NIS siswa..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autocomplete="off"
              />

              <!-- Dropdown List -->
              <div
                v-if="showSiswaDropdown && filteredSiswaList.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                <div
                  v-for="siswa in filteredSiswaList"
                  :key="siswa.id"
                  @click="selectSiswa(siswa)"
                  class="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div class="font-medium text-gray-900">{{ siswa.nama }}</div>
                  <div class="text-xs text-gray-500">
                    NIS: {{ siswa.nis }} - {{ siswa.kelas?.nama_kelas || '-' }}
                  </div>
                </div>
              </div>

              <!-- No Results -->
              <div
                v-if="showSiswaDropdown && siswaSearch && filteredSiswaList.length === 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500"
              >
                Siswa tidak ditemukan
              </div>

              <!-- Selected Siswa Display -->
              <div
                v-if="selectedSiswa"
                class="mt-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg"
              >
                <div>
                  <div class="text-sm font-medium text-blue-900">{{ selectedSiswa.nama }}</div>
                  <div class="text-xs text-blue-600">NIS: {{ selectedSiswa.nis }}</div>
                </div>
                <button @click="clearSiswa" type="button" class="text-red-500 hover:text-red-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500">Kosongkan jika penulis anonim</p>
          </div>

          <!-- Judul -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Judul <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.judul"
              type="text"
              required
              maxlength="200"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan judul konten"
            />
            <p v-if="errors.judul" class="mt-1 text-sm text-red-600">{{ errors.judul[0] }}</p>
          </div>

          <!-- Kategori -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Kategori <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.kategori"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Kategori</option>
              <option value="Artikel">Artikel</option>
              <option value="Puisi">Puisi</option>
              <option value="Cerpen">Cerpen</option>
              <option value="Karya Seni">Karya Seni</option>
              <option value="Video">Video</option>
            </select>
            <p v-if="errors.kategori" class="mt-1 text-sm text-red-600">{{ errors.kategori[0] }}</p>
          </div>

          <!-- Konten -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Konten <span class="text-red-500">*</span>
            </label>

            <!-- Toolbar -->
            <div class="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex gap-1 flex-wrap">
              <button
                type="button"
                @click="execCommand('bold')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Bold (Ctrl+B)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <text x="6" y="18" font-weight="bold" font-size="16">B</text>
                </svg>
                <strong class="text-sm">B</strong>
              </button>
              <button
                type="button"
                @click="execCommand('italic')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Italic (Ctrl+I)"
              >
                <em class="text-sm">I</em>
              </button>
              <button
                type="button"
                @click="execCommand('underline')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Underline (Ctrl+U)"
              >
                <u class="text-sm">U</u>
              </button>
              <div class="border-r border-gray-300 mx-1"></div>
              <button
                type="button"
                @click="execCommand('insertUnorderedList')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Bullet List"
              >
                <span class="text-sm">• List</span>
              </button>
              <button
                type="button"
                @click="execCommand('insertOrderedList')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Numbered List"
              >
                <span class="text-sm">1. List</span>
              </button>
              <div class="border-r border-gray-300 mx-1"></div>
              <button
                type="button"
                @click="execCommand('justifyLeft')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Align Left"
              >
                <span class="text-sm">≡</span>
              </button>
              <button
                type="button"
                @click="execCommand('justifyCenter')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Align Center"
              >
                <span class="text-sm">≣</span>
              </button>
              <button
                type="button"
                @click="execCommand('justifyRight')"
                class="p-2 hover:bg-gray-200 rounded"
                title="Align Right"
              >
                <span class="text-sm">≡</span>
              </button>
              <div class="border-r border-gray-300 mx-1"></div>
              <select
                @change="execCommand('formatBlock', $event.target.value)"
                class="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </div>

            <!-- Editor -->
            <div
              ref="editorRef"
              contenteditable="true"
              @input="updateKonten"
              @paste="handlePaste"
              class="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[300px] max-h-[500px] overflow-y-auto"
              style="outline: none"
            ></div>

            <p class="mt-1 text-sm text-gray-500">
              Gunakan toolbar di atas untuk memformat teks. Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U
              (Underline)
            </p>
            <p v-if="errors.konten" class="mt-1 text-sm text-red-600">{{ errors.konten[0] }}</p>
          </div>

          <!-- Gambar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
            <input
              type="file"
              @change="handleFileChange($event, 'gambar')"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="mt-1 text-sm text-gray-500">Format: JPG, PNG, GIF. Maksimal 2MB</p>
            <div v-if="form.gambar_preview || form.gambar" class="mt-2">
              <img
                :src="form.gambar_preview || getImageUrl(form.gambar)"
                alt="Preview"
                class="h-32 w-auto rounded border"
              />
            </div>
            <p v-if="errors.gambar" class="mt-1 text-sm text-red-600">{{ errors.gambar[0] }}</p>
          </div>

          <!-- File Attachment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">File Lampiran</label>
            <input
              type="file"
              @change="handleFileChange($event, 'file_attachment')"
              accept=".pdf,.doc,.docx,.zip,.rar"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="mt-1 text-sm text-gray-500">Format: PDF, DOC, DOCX, ZIP, RAR. Maksimal 5MB</p>
            <p v-if="form.file_attachment_name" class="mt-1 text-sm text-gray-600">
              File: {{ form.file_attachment_name }}
            </p>
            <p v-if="errors.file_attachment" class="mt-1 text-sm text-red-600">
              {{ errors.file_attachment[0] }}
            </p>
          </div>

          <!-- Bagian Komentar - TAMBAHKAN INI -->
          <div class="border-t pt-6 mt-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Komentar ({{ komentarList.length }})
            </h4>

            <!-- Loading Komentar -->
            <div v-if="loadingKomentar" class="text-center py-8 text-gray-500">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
              ></div>
              Memuat komentar...
            </div>

            <!-- Empty State -->
            <div v-else-if="komentarList.length === 0" class="text-center py-8 text-gray-500">
              <svg
                class="w-16 h-16 text-gray-300 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p>Belum ada komentar</p>
            </div>

            <!-- Daftar Komentar -->
            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="komentar in komentarList"
                :key="komentar.id"
                class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3 flex-1">
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    >
                      {{ getInitials(komentar.siswa?.nama || komentar.nama_komentar || 'AN') }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="font-semibold text-gray-900 text-sm">
                          {{ komentar.siswa?.nama || komentar.nama_komentar || 'Anonim' }}
                        </p>
                        <span class="text-xs text-gray-500">
                          {{ formatDate(komentar.created_at) }}
                        </span>
                      </div>
                      <p class="text-gray-700 text-sm whitespace-pre-wrap">
                        {{ komentar.isi_komentar }}
                      </p>
                    </div>
                  </div>

                  <!-- Tombol Hapus (Admin Only) -->
                  <button
                    @click="confirmDeleteKomentar(komentar)"
                    class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                    title="Hapus komentar"
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
                </div>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status[0] }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Detail -->
    <div
      v-if="showModal && modalMode === 'detail'"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Detail Pojok Siswa</h2>
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

          <div v-if="selectedItem" class="space-y-6">
            <!-- Header -->
            <div class="border-b pb-4">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedItem.judul }}</h3>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <span>{{ formatDate(selectedItem.created_at) }}</span>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ selectedItem.kategori }}
                </span>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    selectedItem.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : selectedItem.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ selectedItem.status }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {{ selectedItem.views || 0 }} views
                </span>
              </div>
              <div v-if="selectedItem.siswa" class="mt-2 text-sm text-gray-600">
                Oleh: <span class="font-semibold">{{ selectedItem.siswa.nama }}</span>
              </div>
            </div>

            <!-- Gambar -->
            <div v-if="selectedItem.gambar" class="flex justify-center">
              <img
                :src="getImageUrl(selectedItem.gambar)"
                :alt="selectedItem.judul"
                class="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <!-- Konten -->
            <div class="prose max-w-none">
              <div class="text-gray-700 leading-relaxed" v-html="selectedItem.konten"></div>
            </div>

            <!-- File Attachment -->
            <div v-if="selectedItem.file_attachment" class="border-t pt-4">
              <h4 class="font-semibold text-gray-900 mb-2">File Lampiran</h4>

              <a
                :href="getFileUrl(selectedItem.file_attachment)"
                target="_blank"
                class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download File
              </a>
            </div>

            <!-- Bagian Komentar -->
            <div class="border-t pt-6 mt-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Komentar ({{ komentarList.length }})
              </h4>

              <!-- Loading Komentar -->
              <div v-if="loadingKomentar" class="text-center py-8 text-gray-500">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                ></div>
                Memuat komentar...
              </div>

              <!-- Empty State -->
              <div v-else-if="komentarList.length === 0" class="text-center py-8 text-gray-500">
                <svg
                  class="w-16 h-16 text-gray-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>Belum ada komentar</p>
              </div>

              <!-- Daftar Komentar -->
              <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="komentar in komentarList"
                  :key="komentar.id"
                  class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3 flex-1">
                      <div
                        class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      >
                        {{ getInitials(komentar.siswa?.nama || komentar.nama_komentar || 'AN') }}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <p class="font-semibold text-gray-900 text-sm">
                            {{ komentar.siswa?.nama || komentar.nama_komentar || 'Anonim' }}
                          </p>
                          <span class="text-xs text-gray-500">
                            {{ formatDate(komentar.created_at) }}
                          </span>
                        </div>
                        <p class="text-gray-700 text-sm whitespace-pre-wrap">
                          {{ komentar.isi_komentar }}
                        </p>
                      </div>
                    </div>

                    <!-- Tombol Hapus -->
                    <button
                      @click="confirmDeleteKomentar(komentar)"
                      class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                      title="Hapus komentar"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Komentar Confirmation Modal -->
    <div
      v-if="showDeleteKomentarModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteKomentarModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Konfirmasi Hapus Komentar</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus komentar dari
          <strong>{{
            deleteKomentarItem?.siswa?.nama || deleteKomentarItem?.nama_komentar || 'Anonim'
          }}</strong
          >?
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDeleteKomentar"
            :disabled="deletingKomentar"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deletingKomentar ? 'Menghapus...' : 'Hapus' }}
          </button>
          <button
            @click="showDeleteKomentarModal = false"
            :disabled="deletingKomentar"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus pojok siswa <strong>{{ deleteItem?.judul }}</strong
          >?
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
          <button
            @click="showDeleteModal = false"
            :disabled="deleting"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import pojokSiswa from '@/api/pojokSiswa'

const pageTitle = 'Pojok Siswa'
const pageDescription = 'Kelola konten karya siswa'

// Refs
const editorRef = ref(null)

// State
const pojokSiswaList = ref([])
const siswaList = ref([])
const siswaSearch = ref('')
const loading = ref(false)
const showModal = ref(false)
const modalMode = ref('create')
const isSubmitting = ref(false)
const showDeleteModal = ref(false)
const deleteItem = ref(null)
const deleting = ref(false)
const selectedItem = ref(null)
const showSiswaDropdown = ref(false)
const selectedSiswa = ref(null)

// Filters
const searchQuery = ref('')
const filterKategori = ref('')
const filterStatus = ref('')
const filters = ref({
  search: '',
  kategori: '',
  status: '',
  page: 1,
  per_page: 10,
})

// Komentar State
const komentarList = ref([])
const loadingKomentar = ref(false)
const showDeleteKomentarModal = ref(false)
const deleteKomentarItem = ref(null)
const deletingKomentar = ref(false)

const filteredSiswaList = computed(() => {
  // Tambahkan ini
  if (!siswaSearch.value) return siswaList.value
  return siswaList.value.filter(
    (siswa) =>
      siswa.nama.toLowerCase().includes(siswaSearch.value.toLowerCase()) ||
      siswa.nis.toLowerCase().includes(siswaSearch.value.toLowerCase()),
  )
})

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

// Form
const form = ref({
  siswa_id: '',
  judul: '',
  kategori: '',
  konten: '',
  gambar: null,
  gambar_preview: null,
  file_attachment: null,
  file_attachment_name: '',
  status: 'draft',
})

const errors = ref({})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Computed
const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    pages.push(i)
  }

  if (current - delta > 2) {
    pages.unshift('...')
  }
  if (current + delta < last - 1) {
    pages.push('...')
  }

  pages.unshift(1)
  if (last > 1) {
    pages.push(last)
  }

  return pages.filter((p) => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

// Methods
let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.search = searchQuery.value
    filters.value.page = 1
    loadPojokSiswa()
  }, 500)
}

const handleFilter = () => {
  filters.value.kategori = filterKategori.value
  filters.value.status = filterStatus.value
  filters.value.page = 1
  loadPojokSiswa()
}

const loadPojokSiswa = async () => {
  try {
    loading.value = true
    console.log('Loading pojok siswa with filters:', filters.value)
    const response = await pojokSiswa.getAll(filters.value)
    console.log('API Response:', response.data)

    if (response.data.success) {
      pojokSiswaList.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
        from: response.data.data.from,
        to: response.data.data.to,
      }
      console.log('Loaded items:', pojokSiswaList.value.length)
    }
  } catch (err) {
    console.error('Error loading pojok siswa:', err)
    console.error('Error response:', err.response)
    showToast(err.response?.data?.message || 'Terjadi kesalahan saat memuat data', 'error')
  } finally {
    loading.value = false
  }
}

const loadFormData = async () => {
  try {
    const response = await pojokSiswa.getFormData()
    if (response.data.success) {
      siswaList.value = response.data.data.siswa
    }
  } catch (err) {
    console.error('Error loading form data:', err)
  }
}

const selectSiswa = (siswa) => {
  selectedSiswa.value = siswa
  form.value.siswa_id = siswa.id
  siswaSearch.value = siswa.nama
  showSiswaDropdown.value = false
}

const clearSiswa = () => {
  selectedSiswa.value = null
  form.value.siswa_id = ''
  siswaSearch.value = ''
}

// Close dropdown saat klik di luar
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    showSiswaDropdown.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  filters.value.page = page
  loadPojokSiswa()
}

const openModal = async (mode, item = null) => {
  modalMode.value = mode
  showModal.value = true
  if (mode === 'edit' && item) {
    form.value = {
      id: item.id,
      siswa_id: item.siswa_id || '',
      judul: item.judul,
      kategori: item.kategori,
      konten: item.konten,
      gambar: item.gambar,
      gambar_preview: null,
      file_attachment: item.file_attachment,
      file_attachment_name: item.file_attachment ? item.file_attachment.split('/').pop() : '',
      status: item.status,
    }

    // Set selected siswa untuk edit
    if (item.siswa) {
      selectedSiswa.value = item.siswa
      siswaSearch.value = item.siswa.nama
    } else {
      selectedSiswa.value = null
      siswaSearch.value = ''
    }

    setTimeout(() => setEditorContent(item.konten), 100)
  } else if (mode === 'detail' && item) {
    selectedItem.value = item
    if (item && item.id) {
      loadKomentar(item.id)
    }
  } else {
    resetForm()
    selectedSiswa.value = null // Tambahkan ini
    siswaSearch.value = '' // Tambahkan ini
    setTimeout(() => setEditorContent(''), 100)
  }
  errors.value = {}
  showModal.value = true

  if (mode === 'create' || mode === 'edit') {
    await loadFormData()
  }
}

const closeModal = () => {
  showModal.value = false
  modalMode.value = 'create'
  selectedItem.value = null
  selectedSiswa.value = null
  siswaSearch.value = ''
  showSiswaDropdown.value = false
  resetForm()

  // Reset komentar state
  komentarList.value = []
  loadingKomentar.value = false
}

const resetForm = () => {
  form.value = {
    siswa_id: '',
    judul: '',
    kategori: '',
    konten: '',
    gambar: null,
    gambar_preview: null,
    file_attachment: null,
    file_attachment_name: '',
    status: 'draft',
  }
  selectedSiswa.value = null // Tambahkan ini
  siswaSearch.value = '' // Tambahkan ini
}

const handleFileChange = (event, type) => {
  const file = event.target.files[0]
  if (!file) return

  if (type === 'gambar') {
    form.value.gambar = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.gambar_preview = e.target.result
    }
    reader.readAsDataURL(file)
  } else if (type === 'file_attachment') {
    form.value.file_attachment = file
    form.value.file_attachment_name = file.name
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}

    let response
    if (modalMode.value === 'create') {
      response = await pojokSiswa.create(form.value)
    } else {
      response = await pojokSiswa.update(form.value.id, form.value)
    }

    if (response.data.success) {
      closeModal()
      loadPojokSiswa()
      showToast(response.data.message, 'success')
    }
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
      showToast('Validasi gagal, periksa form Anda', 'error')
    } else {
      showToast(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data', 'error')
    }
    console.error('Error submitting form:', err)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (item) => {
  deleteItem.value = item
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    deleting.value = true
    const response = await pojokSiswa.delete(deleteItem.value.id)

    if (response.data.success) {
      showDeleteModal.value = false
      loadPojokSiswa()
      showToast(response.data.message, 'success')
    }
  } catch (err) {
    showToast(err.response?.data?.message || 'Terjadi kesalahan saat menghapus data', 'error')
    console.error('Error deleting:', err)
  } finally {
    deleting.value = false
  }
}

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${path}`
}

const getFileUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Komentar Methods
const loadKomentar = async (pojokSiswaId) => {
  try {
    loadingKomentar.value = true
    const response = await pojokSiswa.getKomentarPublic(pojokSiswaId)
    if (response.data.success) {
      komentarList.value = response.data.data
    }
  } catch (err) {
    console.error('Error loading komentar:', err)
    showToast('Gagal memuat komentar', 'error')
  } finally {
    loadingKomentar.value = false
  }
}

const confirmDeleteKomentar = (komentar) => {
  deleteKomentarItem.value = komentar
  showDeleteKomentarModal.value = true
}

const handleDeleteKomentar = async () => {
  try {
    deletingKomentar.value = true
    const response = await pojokSiswa.deleteKomentar(deleteKomentarItem.value.id)

    if (response.data.success) {
      showToast('Komentar berhasil dihapus', 'success')
      // Reload komentar
      await loadKomentar(selectedItem.value.id)
      showDeleteKomentarModal.value = false
      deleteKomentarItem.value = null
    }
  } catch (err) {
    console.error('Error deleting komentar:', err)
    showToast(err.response?.data?.message || 'Gagal menghapus komentar', 'error')
  } finally {
    deletingKomentar.value = false
  }
}

const getInitials = (name) => {
  if (!name) return 'AN'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Rich Text Editor Methods
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
}

const updateKonten = () => {
  if (editorRef.value) {
    form.value.konten = editorRef.value.innerHTML
  }
}

const handlePaste = (e) => {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

const setEditorContent = (content) => {
  if (editorRef.value) {
    editorRef.value.innerHTML = content || ''
    form.value.konten = content || ''
  }
}

// Lifecycle
onMounted(() => {
  loadPojokSiswa()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
