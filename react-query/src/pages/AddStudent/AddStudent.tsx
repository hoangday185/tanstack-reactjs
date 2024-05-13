import { useMatch, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'apis/student.api'
import { Student } from 'types/student.type'
import { useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'utils/util'
import { toast } from 'react-toastify'
type FormStateType = Omit<Student, 'id'> | Student

type FormError =
  | {
      [key in keyof FormStateType]: string
    }
  | null

const initForm: FormStateType = {
  first_name: '',
  last_name: '',
  gender: 'other',
  email: '',
  avatar: '',
  country: '',
  btc_address: ''
}

export default function AddStudent() {
  const [form, setForm] = useState<FormStateType>(initForm)
  const addMatch = useMatch('/students/add')
  const isAddMode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()
  // const { mutate, error, data, reset } = useMutation({
  //   mutationFn: (body: FormStateType) => {
  //     //handle data here
  //     return addStudent(body)
  //   }
  // })

  const addMutationStudent = useMutation({
    mutationFn: (body: FormStateType) => addStudent(body)
  })

  const getStudentById = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined,
    staleTime: 1000 * 10
  })

  useEffect(() => {
    if (getStudentById.data) {
      setForm(getStudentById.data.data)
    }
  }, [getStudentById.data])

  const updateStudentMutation = useMutation({
    mutationFn: (_) => updateStudent(id as string, form as Student),
    onSuccess: (data) => {
      queryClient.setQueryData(['student', id], data)
    }
  })

  const errorForm: FormError = useMemo(() => {
    const error = isAddMode ? addMutationStudent.error : updateStudentMutation.error
    if (isAxiosError<{ error: FormError }>(error) && error.response?.status === 422) {
      return error.response?.data.error //error chính là data
    }
    return null
  }, [addMutationStudent.error, updateStudentMutation.error, isAddMode])

  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [name]: event.target.value }))
    if (addMutationStudent.data || addMutationStudent.error) {
      addMutationStudent.reset() //ko nhận và ko return về gì cả
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // try {
    //   if (isAddMode) {
    //     mutateUpdate()
    //   } else {
    //     await mutateAsync(form) //thằng này return về promise
    //   }
    //   setForm(initForm)
    // } catch (error) {
    //   console.log(error)
    // } nhớ xài cùng async
    //mutate là async func nhưng méo phải promise
    if (isAddMode) {
      addMutationStudent.mutate(form, {
        onSuccess: (_) => {
          setForm(initForm)
          toast.success('Add student successfully')
        }
      })
    } else {
      updateStudentMutation.mutate(undefined, {
        onSuccess: (_) => {
          toast.success('Update student successfully')
        }
      })

      // ,
      // {
      //   onSuccess: () => {
      //     setForm(initForm)
      //   }
      // } cách 1
      //    ,{
      //   onError: (error) => {
      //     console.log(error)
      //   }
      // } có thể xài error như vậy
    }
  }

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add' : 'Update'} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
            placeholder=' '
            required
            value={form.email}
            onChange={handleChange('email')}
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
          >
            Email address
          </label>
          {errorForm && (
            <p className='mt-2 text-sm text-red-600'>
              <span className='font-medium'>Lỗi! {errorForm.email}</span>
            </p>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  value='Male'
                  checked={form.gender === 'Male'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  value='Female'
                  checked={form.gender === 'Female'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  value='Other'
                  checked={form.gender === 'Other'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
            placeholder=' '
            required
            value={form.country}
            onChange={handleChange('country')}
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              id='first_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={form.first_name}
              onChange={handleChange('first_name')}
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={form.last_name}
              onChange={handleChange('last_name')}
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={form.avatar}
              onChange={handleChange('avatar')}
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
              placeholder=' '
              required
              value={form.btc_address}
              onChange={handleChange('btc_address')}
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
        >
          {isAddMode ? 'Add' : 'Update'}
        </button>
      </form>
    </div>
  )
}
