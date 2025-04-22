<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, watch, watchEffect } from 'vue'
// @ts-expect-error 暂时忽略类型检查，因为 @wangeditor/editor-for-vue 的类型声明文件存在问题
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'

// 声明属性
const prop = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '70vh',
  },
  IsTreeHole: {
    type: Boolean,
    default: true,
  },
  backgroundColor: {
    type: String,
    default: '#d3d8dd',
  },
})
// 声明事件
const emits = defineEmits<{ (e: "update:modelValue", value: string): void }>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>书写文本</p>')
watchEffect(() => {
  valueHtml.value = prop.modelValue
})
watch(valueHtml, (newValue) => {
  emits('update:modelValue', newValue)
})

const toolbarConfig = {
  excludeKeys: [
    'group-video', // 排除视频相关
    'group-more-style', // 排除更多样式
    ...(prop.IsTreeHole ? ['codeBlock'] : []), // 根据IsTreeHole动态排除
    ...(prop.IsTreeHole ? ['insertTable'] : []), // 根据IsTreeHole动态排除
    ...(prop.IsTreeHole ? ['group-justify'] : []), // 根据IsTreeHole动态排除
    ...(prop.IsTreeHole ? ['group-indent'] : []), // 根据IsTreeHole动态排除
    'divider', // 排除分割线
    'emotion', // 排除表情
    'insertLink', // 排除链接
    'todo', // 排除待办
    'blockquote', // 排除引用
    'headerSelect', // 排除标题选择
    'fontFamily', // 排除字体
    'bulletedList', // 排除无序列表
    'numberedList', // 排除有序列表
    'insertFormula', // 排除公式
    'fullScreen', // 排除全屏
    'undo', // 排除撤销
    'redo', // 排除重做
    'clearStyle', // 排除清除格式
    'bgColor', // 排除背景色按钮
    'color',   // 排除文字颜色按钮
    'insertImage', // 排除插入图片
  ]
}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: { // 上传图片的配置
      server: 'http://localhost:8080/wang/image',  // 上传图片的网址
      fieldName: 'file', // 上传文件的名称
      maxNumberOfFiles: prop.IsTreeHole ? 1 : 10, // 最多上传 10 张图片
    }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>
<template>
  <div id="editor-container" style="border: 1px solid #ccc; display: flex; flex-direction: column;"
    :style="{ height: prop.height }">
    <Toolbar style="border-bottom: 1px solid #ccc;" :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor style="flex: 1; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
      @onCreated="handleCreated" />
  </div>
</template>

<style>
#editor-container .w-e-text-container {
  background-color: v-bind('prop.backgroundColor') !important;
  border-top: 1px solid #ddd !important;
}

#editor-container .w-e-toolbar {
  background-color: v-bind('prop.backgroundColor') !important;
}

.w-e-text-container pre code {
  background-color: #eee !important;
  padding: 1rem !important;
  font-family: "Helvetica Neue",
    Helvetica,
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "微软雅黑",
    Arial,
    sans-serif !important;
  color: inherit !important;
  border-radius: 10px !important;
}
</style>
