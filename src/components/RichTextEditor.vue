<template>
  <div
    class="rich-editor border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500"
  >
    <!-- Toolbar -->
    <div class="toolbar flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
      <!-- Bold -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('bold') }"
        class="toolbar-btn"
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      <!-- Italic -->
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('italic') }"
        class="toolbar-btn"
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <!-- Underline -->
      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('underline') }"
        class="toolbar-btn"
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <div class="w-px bg-gray-300 mx-1"></div>

      <!-- Heading 1 -->
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('heading', { level: 1 }) }"
        class="toolbar-btn text-xs font-bold"
        title="Heading 1"
      >
        H1
      </button>

      <!-- Heading 2 -->
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('heading', { level: 2 }) }"
        class="toolbar-btn text-xs font-bold"
        title="Heading 2"
      >
        H2
      </button>

      <!-- Heading 3 -->
      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('heading', { level: 3 }) }"
        class="toolbar-btn text-xs font-bold"
        title="Heading 3"
      >
        H3
      </button>

      <div class="w-px bg-gray-300 mx-1"></div>

      <!-- Bullet List -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('bulletList') }"
        class="toolbar-btn"
        title="Bullet List"
      >
        &#8226;&#8212;
      </button>

      <!-- Ordered List -->
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('orderedList') }"
        class="toolbar-btn"
        title="Ordered List"
      >
        1&#8212;
      </button>

      <div class="w-px bg-gray-300 mx-1"></div>

      <!-- Align Left -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive({ textAlign: 'left' }) }"
        class="toolbar-btn"
        title="Align Left"
      >
        &#8676;
      </button>

      <!-- Align Center -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive({ textAlign: 'center' }) }"
        class="toolbar-btn"
        title="Align Center"
      >
        &#8596;
      </button>

      <!-- Align Right -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive({ textAlign: 'right' }) }"
        class="toolbar-btn"
        title="Align Right"
      >
        &#8677;
      </button>

      <div class="w-px bg-gray-300 mx-1"></div>

      <!-- Blockquote -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-blue-100 text-blue-700': editor?.isActive('blockquote') }"
        class="toolbar-btn"
        title="Blockquote"
      >
        &#10077;
      </button>

      <!-- Clear formatting -->
      <button
        type="button"
        @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
        class="toolbar-btn"
        title="Clear Formatting"
      >
        &#10006;
      </button>

      <!-- Undo -->
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        class="toolbar-btn"
        title="Undo (Ctrl+Z)"
      >
        ↩
      </button>

      <!-- Redo -->
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        class="toolbar-btn"
        title="Redo (Ctrl+Y)"
      >
        ↪
      </button>
    </div>

    <!-- Editor Content -->
    <editor-content
      :editor="editor"
      class="prose max-w-none p-3 min-h-[150px] focus:outline-none"
    />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] })],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Sync ketika nilai dari luar berubah (misal saat edit data)
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val || '', false)
    }
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.toolbar-btn {
  @apply px-2 py-1 rounded text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer min-w-[28px] text-center;
}

/* Styling konten editor agar mirip Word */
.ProseMirror {
  outline: none;
  min-height: 150px;
}
.ProseMirror h1 {
  @apply text-2xl font-bold mb-2;
}
.ProseMirror h2 {
  @apply text-xl font-bold mb-2;
}
.ProseMirror h3 {
  @apply text-lg font-bold mb-2;
}
.ProseMirror p {
  @apply mb-2;
}
.ProseMirror ul {
  @apply list-disc list-inside mb-2;
}
.ProseMirror ol {
  @apply list-decimal list-inside mb-2;
}
.ProseMirror blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-2;
}
</style>
