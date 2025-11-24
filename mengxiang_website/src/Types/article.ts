export interface article {
  id: number
  account: ''
  avatar: ''
  title: ''
  content: ''
  like_num: 0
  time: ''
  image: ''
  name: ''
}
export interface blog {
  id: number
  account: ''
  avatar: ''
  name: ''
  title: ''
  content: ''
  like_num: 0
  time: ''
  introduction: ''
  cate: ''
}
export interface Comment {
  id: number
  account: ''
  avatar: ''
  name: ''
  content: ''
  time: ''
}

export type like = {
  id: number
  user_id: string
  target_type: number
  target_id: number
  created_at: string
  is_canceled: number
}
