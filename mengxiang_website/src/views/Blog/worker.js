onmessage = (e) => {
  const listMap = new Map()
  const colors = [
    '#E7F0FD',
    '	#E8F5E9',
    '#FFE4E1',
    '#F0E6FF',
    '#FFF3E0',
    '#E8F5E9',
    '#EDE7F6',
    '#E1F5FE',
    '#FFF9F0',
  ]
  const icons = [
    'icon-emoji-really',
    'icon-emoji-blink-right',
    'icon-emoji-blink-left',
    'icon-emoji-talking-angry',
    'icon-emoji-satisfied',
    'icon-emoji-look-down',
    'icon-emoji-puzzled',
    'icon-emoji-surprise',
    'icon-emoji-talking-happy',
  ]
  let cates = []
  const message = e.data
  const list = message.sort((a, b) => -(new Date(a.time).getTime() - new Date(b.time).getTime()))
  for (let i = 0; i < list.length; i++) {
    list[i].number = i + 1
    list[i].colorBgc = colors[list[i].title.charCodeAt(0) % colors.length]
    list[i].icon = icons[list[i].title.charCodeAt(0) % icons.length]
    if (list[i].cate.includes(',')) list[i].cate = list[i].cate.split(',')
    else if (list[i].cate.includes('，')) list[i].cate = list[i].cate.split('，')
    else list[i].cate = [list[i].cate]
    const time = list[i].time.slice(0, 4)
    if (!listMap.has(time)) {
      listMap.set(time, [list[i]])
    } else {
      listMap.get(time).push(list[i])
    }
  }
  list.forEach((item) => {
    cates = cates.concat(item.cate)
  })
  cates = [...new Set(cates)]
  postMessage({ listMap, cates })
}
