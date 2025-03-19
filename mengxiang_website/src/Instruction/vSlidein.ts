import type { Directive } from 'vue'

// 定义WeakMap的类型，键为HTMLElement，值为Animation
const map = new WeakMap<HTMLElement, Animation>()

// 创建IntersectionObserver实例
const ob = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const animation = map.get(entry.target as HTMLElement)
      if (animation) {
        animation.play()
      }
      ob.unobserve(entry.target)
    }
  }
})

// 判断元素是否在视口下方
function isBlowViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top > window.innerHeight
}

// 定义动画选项的接口
interface AnimationOptions {
  duration: number
  easing: string
  fill: FillMode
}

// 导出Vue自定义指令
const vSlidein: Directive = {
  mounted(el: HTMLElement) {
    if (!isBlowViewport(el)) {
      return
    }
    // 设置初始样式
    el.style.opacity = '0.5'
    el.style.transform = 'translateY(100px)'
    const animation = el.animate(
      [
        {
          transform: 'translateY(100px)',
          opacity: 0.5,
        },
        {
          transform: 'translateY(0)',
          opacity: 1,
        },
      ] as Keyframe[],
      {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards',
      } as AnimationOptions,
    )
    animation.pause()
    map.set(el, animation)
    ob.observe(el)
  },
}

export default vSlidein
