<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Ctx2D = CanvasRenderingContext2D

const props = defineProps({
  num: {
    type: Number,
    default: 120
  },
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: Ctx2D | null = null

let w = 0
let h = 0
let rafId: number | null = null

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number

  constructor() {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = Math.random() * 2
  }

  move() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > w) this.vx *= -1
    if (this.y < 0 || this.y > h) this.vy *= -1
  }

  draw() {
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  }
}

let particles: Particle[] = []

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  w = canvas.width = window.innerWidth
  h = canvas.height = window.innerHeight
}

function init() {
  particles = []
  for (let i = 0; i < props.num; i++) particles.push(new Particle())
}

function connect() {
  if (!ctx) return
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 120) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 120})`
        ctx.lineWidth = 0.5
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}

function animate() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)

  for (const p of particles) {
    p.move()
    p.draw()
  }
  connect()

  rafId = window.requestAnimationFrame(animate)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  resize()
  init()
  animate()

  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  rafId = null
  ctx = null
})
</script>

<script lang="ts">
export default {
  name: 'StarBgc'
}
</script>

<template>
  <canvas ref="canvasRef" id="star"></canvas>
</template>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  display: block;
  z-index: 0;
  background: #212121;
}
</style>
