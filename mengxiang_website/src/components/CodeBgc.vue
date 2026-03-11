<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const letter = "Mengxiang  Mengxiang  Mengxiang  Mengxiang  Mengxiang  Mengxiang".split('')

const props = defineProps({
  Color: {
    type: String,
    required: false,
    default: '',
  }
})

const bgc_timer = ref<number | null>(null)
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
const drops: number[] = []
const font_size = 10
const colors = ['#05FF00', '#00BFFF', '#FF4500', '#FFA500', '#C202C2'];
let color: string;

onMounted(() => {
  canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  color = !props.Color ? colors[Math.floor(Math.random() * colors.length)] : props.Color
  const columns = canvas.width / font_size;
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }
  bgc_timer.value = window.setInterval(draw_background, 34);
})
const draw_background = () => {
  if (ctx === null) return
  ctx.fillStyle = 'rgba(0,0,0,.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color
  for (let i = 0; i < drops.length; i++) {
    const text = letter[Math.floor(Math.random() * letter.length)]
    ctx.fillText(text, i * font_size, drops[i] * font_size);
    drops[i]++
    if (drops[i] * font_size > canvas.height && Math.random() > 0.95) {
      drops[i] = 0;
    }
  }
}
onBeforeUnmount(() => {
  if (bgc_timer.value !== null && bgc_timer.value !== undefined) {
    clearInterval(bgc_timer.value as number)
  }
})
</script>

<script lang="ts">
// 显式添加默认导出
export default {
  name: 'CodeB'
}
</script>

<template>
  <canvas id="myCanvas" class="canvas"></canvas>
</template>

<style scoped>
#myCanvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  display: block;
  z-index: 0;
}
</style>
