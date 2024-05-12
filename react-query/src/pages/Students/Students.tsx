import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { deleteStudent, getStudentList } from 'apis/student.api'
import classNames from 'classnames'

import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useQueryString } from 'utils/util'

const LIMIT_PAGE = 10

export default function Students() {
  // const [studentList, setStudentList] = useState<StudentList>([])
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudentList(1, 10)
  //     .then((res) => {
  //       setStudentList(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1
  const { data, isFetching } = useQuery({
    queryKey: ['students', page], //cơ chế so sánh 2 object là dùng deep compare keys (dùng object nested cỡ nào cũng so sánh được)
    queryFn: () => getStudentList(page, LIMIT_PAGE),
    // staleTime: 60 * 1000,//thời gian data cũ
    gcTime: 5 * 1000, //cache time
    placeholderData: keepPreviousData
  }) //đây là query instance

  const totalStudentList = Number(data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentList / LIMIT_PAGE)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => deleteStudent(id)
  })

  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id)

    toast.success('Delete student success')
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div className='mt-6'>
        <Link
          to='/students/add'
          className='me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
        >
          Add Student
        </Link>
      </div>
      {isFetching && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!isFetching && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((student) => (
                  <tr
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        type='button'
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page - 1}`}
                      className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={index}>
                        <Link
                          className={classNames(
                            'border border-gray-300 py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                            { 'bg-gray-100 text-gray-700': isActive, 'bg-white text-gray-500': !isActive }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Next
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page + 1}`}
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
/**
 * staleTime (default 0 ms): Thời gian data được cho là đã cũ. Khi get data xong thì sau
 * một thời gian bạn quy định, thì data nó sẽ tự cũ, LƯU Ý CÁI stale trên dev tool nó hiển thị là data
 * của bạn stale và active
 * cacheTime (default 5*60*1000 ms tức là 5 phút) Thời gian data bị xóa ra khỏi bộ nhớ đệm
 * Có thể data đã cũ nhưng nó chưa bị xóa ra khỏi bộ nhớ đệm vì bạn set stale < cacheTime. Thường thì
 * người t sẽ set staleTime < cachetime
 * inactive : khi không còn component nào subrisce cả
 *
 *
 * nhưng state về khoảnh khắc của data
 * isLoading hoặc status === loading - query chưa có data
 * isError hoặc status === error - query lỗi cmnr
 * isSuccess hoặc status === success - query thành công và data có sẵn
 *
 * những state về data
 * error hoặc isError === true thì error sẽ xuất hiện
 * data hoặc isSuccess === true thì data sẽ xuất hiện
 *
 * ĐẶC BIỆT fetchStatus
 * isFetching hoặc fetchStatus === fetching - đang fetch api
 * isPause hoặc fetchStatus === pause - quert muốn fetch nhưng bị tạm dừng vì lý do nào đó
 * fetchStatus === idle - query ko làm gì cả
 *
 * quan tâm 2 thằng thôi
 * status và fetchStatus
 * status : đại diện cho thông tin data có hay không
 * fetchStatus cho thông tin queryFn có chạy hay không
 *
 * Cơ chế fetching :
 * Một data mà đã stale thì khi gọi lại query data đó, nó sẽ fetch lại api
 * Nếu không stale thì ko fetch lại api
 *
 * Một data mà bị xóa khỏi bộ nhớ nhưng đã stale thì nó sẽ trả về data catch và fetch
 * api ngầm, sau khi fetch xong nó sẽ update lại data đã cached và trả về data mới cho bạn
 *
 * Caching là một vòng đời của
 * Query instance có hoặc không cache data
 * Fetch ngầm(background fetching)
 * các inactive query
 * Xóa cache khỏi bộ nhớ(garbage collection)
 */
