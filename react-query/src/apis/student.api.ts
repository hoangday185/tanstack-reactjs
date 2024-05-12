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
