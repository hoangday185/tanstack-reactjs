export type Student = {
  id: number
  first_name: string
  last_name: string
  email: string
  gender: string
  country: string
  avatar: string
  btc_address: string
}

export type StudentList = Pick<Student, 'id' | 'email' | 'avatar' | 'last_name'>[]
