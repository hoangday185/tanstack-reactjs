import { Student, StudentList } from 'types/student.type'
import http from 'utils/http'

export const getStudentList = (page: number | string, limit: number | string) => {
  return http.get<StudentList>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
}

export const addStudent = (student: Omit<Student, 'id'>) => {
  return http.post<Student>('students', student)
}

export const getStudent = (id: number | string) => http.get<Student>(`students/${id}`)

export const updateStudent = (id: number | string, student: Student) => http.put<Student>(`students/${id}`, student)

export const deleteStudent = (id: number | string) => http.delete<{}>(`students/${id}`)
