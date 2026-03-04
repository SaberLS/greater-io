import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Divider } from 'primereact/divider'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'
import { FormEventHandler, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useLoginMutation } from '../../store/api'
import { setCredentials } from '../../store/slices'

export function Login({
  onLogin,
}: {
  onLogin: (values: {
    username: string
    password: string
    remember: boolean
  }) => void
}) {
  const toast = useRef(null)

  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    try {
      const response = await login({ username, password }).unwrap()

      dispatch(
        setCredentials({
          token: response.token,
          user: response.user,
          expiresAt: response.expiresAt,
        })
      )

      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Toast ref={toast} />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-semibold">Sign in to your account</h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your dashboard
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          <div className="mt-5 p-fluid">
            <FloatLabel>
              <InputText
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your username"
                className="w-full"
                tabIndex={1}
              />
              <label htmlFor="username">Username</label>
            </FloatLabel>
          </div>

          <div className="my-5 p-fluid">
            <FloatLabel>
              <Password
                inputId="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                feedback={false}
                tabIndex={2}
                toggleMask
                className=" font-bold"
                pt={{
                  // TODO: icon is to low for some reason, should be centered somehow but not with margin
                  hideIcon: {
                    className: 'font-bold !mt-[-8px]',
                  },
                  showIcon: {
                    className: 'font-bold !mt-[-8px]',
                  },
                }}
              />
              <label htmlFor="password">Password</label>
            </FloatLabel>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Checkbox
                inputId="remember"
                checked={remember}
                onChange={e => setRemember(Boolean(e.checked))}
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>

            <a
              href="#"
              className="text-sm text-primary-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            label={'Sign in'}
            icon={'pi pi-sign-in'}
            className="w-full mb-3"
          />

          <Divider />

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{' '}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline"
              >
                Create one
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
