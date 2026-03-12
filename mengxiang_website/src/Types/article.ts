export interface article {
  id: number
  account: string
  avatar: string
  title: string
  content: string
  like_num: number
  time: string
  image: string
  name: string
  gender?: string
}
export interface blog {
  id: number
  account: string
  avatar: string
  name: string
  title: string
  content: string
  like_num: number
  time: string
  introduction: string
  cate: string
  gender?: string
  number?: number
  colorBgc?: string
  icon?: string
}
export interface Comment {
  id: number
  account: string
  avatar: string
  name: string
  content: string
  time: string
}

export type like = {
  id: number
  user_id: string
  target_type: number
  target_id: number
  created_at: string
  is_canceled: number
}
