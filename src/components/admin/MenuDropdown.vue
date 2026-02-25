<template>
  <div class="mb-2" @mouseenter="openDropdown" @mouseleave="handleMouseLeave">
    <!-- Dropdown Button -->
    <button 
      @click="toggleDropdown"
      class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
      :class="{ 'bg-gray-800 text-white': isOpen || isActiveParent }"
    >
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon"></path>
        </svg>
        <span>{{ title }}</span>
      </div>
      <svg 
        class="w-3.5 h-3.5 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown Menu Items -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="isOpen" class="ml-4 mt-1 space-y-1 overflow-hidden">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-1.5 rounded-lg text-xs transition"
          :class="$route.path === item.path 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
        >
          <span class="w-1 h-1 rounded-full bg-current mr-2.5"></span>
          {{ item.label }}
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

const route = useRoute()
const isOpen = ref(false)
const isHovering = ref(false)

// Inject untuk komunikasi antar dropdown
const closeOtherDropdowns = inject('closeOtherDropdowns', null)
const registerDropdown = inject('registerDropdown', null)

// Register dropdown ini
if (registerDropdown) {
  registerDropdown(() => {
    isOpen.value = false
  })
}

// Check if any child route is active
const isActiveParent = computed(() => {
  return props.items.some(item => route.path === item.path)
})

// Buka dropdown saat hover
const openDropdown = () => {
  isHovering.value = true
  if (closeOtherDropdowns) {
    closeOtherDropdowns()
  }
  isOpen.value = true
}

// Handle mouse leave dengan delay
const handleMouseLeave = () => {
  isHovering.value = false
  // Jika bukan menu aktif, tutup setelah mouse keluar
  if (!isActiveParent.value) {
    setTimeout(() => {
      if (!isHovering.value) {
        isOpen.value = false
      }
    }, 200)
  }
}

// Toggle dropdown dan tutup yang lain (untuk click)
const toggleDropdown = () => {
  const willOpen = !isOpen.value
  if (willOpen && closeOtherDropdowns) {
    closeOtherDropdowns()
  }
  isOpen.value = willOpen
}

// Auto-open dropdown if child route is active
watch(() => route.path, () => {
  if (isActiveParent.value) {
    isOpen.value = true
  }
}, { immediate: true })
</script>