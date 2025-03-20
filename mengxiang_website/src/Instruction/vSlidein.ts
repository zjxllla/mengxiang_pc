import type { Directive } from 'vue'

// 定义WeakMap的类型，键为HTMLElement，值为Animation
const map = new WeakMap<HTMLElement, Animation>()

// 创建IntersectionObserver实例
const ob = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement
      const animation = map.get(el)
      if (entry.isIntersecting) {
        if (animation && animation.playState === 'paused') {
          animation.play()
        }
      } else {
        if (animation) {
          animation.pause()
          animation.currentTime = 0
        }
      }
    }
  },
  {
    threshold: 0.2,
    rootMargin: '100px 0px',
  },
)

// 导出Vue自定义指令
const vSlidein: Directive = {
  mounted(el: HTMLElement) {
    // 设置初始样式
    el.style.opacity = '0'
    el.style.transform = 'translateY(50px)'
    // 清理已存在的动画实例
    if (map.has(el)) {
      const oldAnimation = map.get(el)
      if (oldAnimation) {
        oldAnimation.cancel()
        map.delete(el)
      }
    }

    const animation = el.animate(
      [
        {
          opacity: 0,
          transform: 'translateY(50px)',
        },
        {
          opacity: 1,
          transform: 'translateY(0)',
        },
      ],
      {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'both',
      } as KeyframeAnimationOptions,
    )
    animation.pause()
    map.set(el, animation)
    ob.observe(el)
  },
}

export default vSlidein
