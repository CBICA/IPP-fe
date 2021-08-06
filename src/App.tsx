import React, { useEffect, useState } from 'react';
import axios from 'axios'
import categories from './IPP-Experiment_Defintions/categories.json'
import apps from './IPP-Experiment_Defintions/apps.json'
import signupFields from './config/signupFields.json'
import './App.css';

function App() {
  const loginHandler = (e) => {
    e.preventDefault()
    axios({
      url: apiUrl + '/users/auth',
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: new FormData(e.target)
    })
      .then((resp) => {
        if (resp.data.token) {
          localStorage.setItem("token", resp.data.token)
          setToken(resp.data.token)
          setLogin(true)
        } else {
          setErrorMessage(resp.data.error)
        }
      })
      .catch(resp => console.error(resp))
  }
  const signupHandler = (e) => {
    e.preventDefault()
    // check that password = confirm password
    if (e.target.querySelector('[name="password"]').value !== e.target.querySelector('[name="confirm-password"]').value) {
      e.target.querySelector('[name="confirm-password"]').setCustomValidity("Passwords don't match")
    }
    e.target.reportValidity()
    if (!e.target.checkValidity()) {
      return
    }
    axios({
      url: apiUrl + '/users/new',
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: new FormData(e.target)
    })
      .then((resp) => {
        if (resp.data) {
          // need to be approved first
          // setLogin(true)
          // setToken(resp.data.token)
          // localStorage.setItem("token", resp.data.token)
          alert("Account created, please wait for approval")
          setSignup(false)
        } else {
          console.error(resp.data.error)
        }
      })
      .catch(resp => console.error(resp))
  }

  const appHandler = (e) => {
    e.preventDefault()
    axios({
      url: apiUrl + '/experiments/new',
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: new FormData(e.target)
    })
      .then((resp) => {
        if (resp.data) {
          fetchExperiments()
          setPage('experiments')
        } else {
          setToken('')
          setLogin(false)
          localStorage.removeItem("token")
        }
      })
      .catch(resp => console.error(resp))
  }

  const [apiUrl, setApiUrl] = useState(localStorage.getItem('api_url') || '');
  const [loggedIn, setLogin] = useState(localStorage.getItem('token') !== null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [signup, setSignup] = useState(false);
  const [page, setPage] = useState('apps');
  const [currentApp, setApp] = useState('');
  const [experiments, setExperiments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState({groups: []});

  // fetch experiments
  const fetchExperiments = () => {
    if (!token) {
      return
    }
    axios.get(`${apiUrl}/experiments`, { params: { token: token } }).then(response => {
      if (response.data.hasOwnProperty('experiments')) {
        setExperiments(response.data.experiments)
      } else {
        setToken('')
        setLogin(false)
        localStorage.removeItem("token")
      }
    }).catch(error => {
      console.error(error)
    })
  }
  useEffect(fetchExperiments, [token, apiUrl])

  const fetchUser = () => {
    if (!token) {
      return
    }
    axios.get(`${apiUrl}/users/groups`, { params: { token: token } }).then(response => {
      if (response.data.hasOwnProperty('groups')) {
        setUser({
          groups: response.data.groups
        })
      } else {
        setToken('')
        setLogin(false)
        localStorage.removeItem("token")
      }
    }).catch(error => {
      console.error(error)
    })
  }
  useEffect(fetchUser, [token, apiUrl])

  if (!apiUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Enter a backend server URL
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={(e) => {
            e.preventDefault()
            let url: string = e.target[0].value
            setApiUrl(url)
            localStorage.setItem('api_url', url)
          }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="api_url" className="sr-only">Email address</label>
                <input id="api_url" name="api_url" type="text" required className="appearance-none relative block w-full px-3 pt-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="API URL" />
              </div>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
            </div>
          </form>
        </div>
      </div>

    )
  }
  // https://emailregex.com
  const validEmail = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            {/* <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" /> */}
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              {(signup) ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-center text-sm">
              Or <button onClick={() => setSignup(!signup)} className="font-medium text-indigo-600 hover:text-indigo-500"> {(signup) ? 'sign into' : 'create'} an account</button>
            </p>
          </div>
          <div className={"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative " + (errorMessage === '' ? 'hidden' : '')} role="alert">
            <strong className="font-bold">Heads up!</strong>
            <span style={{ textTransform: 'capitalize' }} className="block sm:inline ml-2">{errorMessage}</span>
            <button type="button" onClick={() => setErrorMessage('')}>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </button>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={signup ? signupHandler : loginHandler}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required pattern={validEmail} onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid email')} className={"appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 " + (signup ? 'rounded-md' : 'rounded-t-md') + " focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"} placeholder="Email address" />
              </div>
              <div className={signup ? 'mt-2' : ''}>
                <label htmlFor="password" className="sr-only">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required minLength={6} className={"appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 " + (signup ? 'rounded-md mb-2' : 'rounded-b-md') + " focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"} placeholder="Password" />
              </div>
              {(signup) ?
                <div className="mt-2">
                  <label htmlFor="confirm-password" className="sr-only">Confirm password</label>
                  <input name="confirm-password" id="confirm-password" type="password" required={true} minLength={6} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Confirm password" />
                </div> : ''}
              {(signup) ?
                signupFields.map(field => {
                  switch (field.type) {
                    case 'textarea':
                      return (
                        <div className="mt-2">
                          <label htmlFor={field.id} className="sr-only">{field.name}</label>
                          <textarea name={'setting-' + field.id} id={field.id} required={field.required} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={field.name}></textarea>
                        </div>)

                    default:
                      return (
                        <div className="mt-2">
                          <label htmlFor={field.id} className="sr-only">{field.name}</label>
                          <input name={'setting-' + field.id} id={field.id} type={field.type} required={field.required} pattern={field.pattern} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none rounded-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder={field.name} />
                        </div>)
                  }
                })
                : ''}

            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div> */}
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {/* Heroicon name: solid/lock-closed */}
                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Sign {(signup) ? 'up' : 'in'}
              </button>
            </div>
          </form>
        </div>
      </div>

    )
  }

  return (
    <div className="md:flex flex-col md:flex-row md:min-h-screen w-full">
      <div className="flex flex-col w-auto py-4 px-2">



        <div className="artboard artboard-demo bg-base-200">
          <ul className="menu py-4 shadow-lg bg-base-100 rounded-box w-full overflow-visible">
            <li className="menu-title">
              <span>
                Image Processing Portal Apps
              </span>
            </li>
            {Object.keys(categories).map((cat, i) => {
              // console.log(categories[cat]?.groups)
              // let user_has_group = user.groups !== undefined
              // if (user_has_group) {
              //   user_has_group = user.groups.some(x => categories[cat].groups.includes(x))
              // }
              if (!categories[cat].hasOwnProperty('groups') || (user.hasOwnProperty('groups') && user.groups.some(x => categories[cat].groups.includes(x)))) { // || user_has_group
                  return (
                    <li className="hover-bordered dropdown dropdown-right dropdown-hover">
                      <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 mr-2 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                        </svg>
                        {categories[cat].label}
                      </a>
                      <ol className="shadow menu dropdown-content bg-base-100 w-full pl-0">
                        <li>
                          {categories[cat].apps.map((app: string) => (
                            <a href="#" onClick={() => { setApp(app) }} className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">{app}</a>
                          ))}
                        </li>
                      </ol>

                    </li>
                  )
              }
            }
            )}
          </ul>
        </div>


      </div>


      <div className="flex flex-col w-full py-4 px-2">

        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
          <div className="flex-1 px-2 mx-2">
            <span className="text-lg font-bold">
              Image Processing Portal
            </span>
          </div>
          <div className="flex-none hidden px-2 mx-2 lg:flex">
            <div className="flex items-stretch">
              <a onClick={() => setPage('apps')} className="btn btn-ghost btn-sm rounded-btn">
                <svg className="inline-block w-5 mr-2 stroke-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path strokeWidth={0.1} d="M7.33335 9.83342H1.50002C1.27901 9.83342 1.06704 9.92121 0.910765 10.0775C0.754484 10.2338 0.666687 10.4457 0.666687 10.6667V16.5001C0.666687 16.7211 0.754484 16.9331 0.910765 17.0893C1.06704 17.2456 1.27901 17.3334 1.50002 17.3334H7.33335C7.55437 17.3334 7.76633 17.2456 7.92261 17.0893C8.07889 16.9331 8.16669 16.7211 8.16669 16.5001V10.6667C8.16669 10.4457 8.07889 10.2338 7.92261 10.0775C7.76633 9.92121 7.55437 9.83342 7.33335 9.83342ZM6.50002 15.6667H2.33335V11.5001H6.50002V15.6667ZM16.5 0.666748H10.6667C10.4457 0.666748 10.2337 0.754545 10.0774 0.910826C9.92115 1.06711 9.83335 1.27907 9.83335 1.50008V7.33342C9.83335 7.55443 9.92115 7.76639 10.0774 7.92267C10.2337 8.07895 10.4457 8.16675 10.6667 8.16675H16.5C16.721 8.16675 16.933 8.07895 17.0893 7.92267C17.2456 7.76639 17.3334 7.55443 17.3334 7.33342V1.50008C17.3334 1.27907 17.2456 1.06711 17.0893 0.910826C16.933 0.754545 16.721 0.666748 16.5 0.666748ZM15.6667 6.50008H11.5V2.33341H15.6667V6.50008ZM16.5 9.83342H10.6667C10.4457 9.83342 10.2337 9.92121 10.0774 10.0775C9.92115 10.2338 9.83335 10.4457 9.83335 10.6667V16.5001C9.83335 16.7211 9.92115 16.9331 10.0774 17.0893C10.2337 17.2456 10.4457 17.3334 10.6667 17.3334H16.5C16.721 17.3334 16.933 17.2456 17.0893 17.0893C17.2456 16.9331 17.3334 16.7211 17.3334 16.5001V10.6667C17.3334 10.4457 17.2456 10.2338 17.0893 10.0775C16.933 9.92121 16.721 9.83342 16.5 9.83342ZM15.6667 15.6667H11.5V11.5001H15.6667V15.6667ZM7.33335 0.666748H1.50002C1.27901 0.666748 1.06704 0.754545 0.910765 0.910826C0.754484 1.06711 0.666687 1.27907 0.666687 1.50008V7.33342C0.666687 7.55443 0.754484 7.76639 0.910765 7.92267C1.06704 8.07895 1.27901 8.16675 1.50002 8.16675H7.33335C7.55437 8.16675 7.76633 8.07895 7.92261 7.92267C8.07889 7.76639 8.16669 7.55443 8.16669 7.33342V1.50008C8.16669 1.27907 8.07889 1.06711 7.92261 0.910826C7.76633 0.754545 7.55437 0.666748 7.33335 0.666748ZM6.50002 6.50008H2.33335V2.33341H6.50002V6.50008Z" fill="currentColor"></path>
                </svg>
                Apps

              </a>
              <a onClick={() => setPage('experiments')} className="btn btn-ghost btn-sm rounded-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
                Experiments

              </a>
            </div>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-52">
                {/* <li>
                  <a>Item 1</a>
                </li> */}
                <li>
                  <form action="#">
                    <label className="inline-flex items-center">
                      <input type="checkbox" />
                      <span className="ml-2">Email notifications</span>
                    </label>
                  </form>
                </li>
                <li>
                  <form action="#">
                    <label className="inline-flex items-center">
                      <input type="checkbox" />
                      <span className="ml-2">Slack notifications</span>
                    </label>
                  </form>
                </li>
                <li>
                  <form action="#">
                    <div className="block px-4 py-2 text-sm" role="menuitem" id="user-menu-item-3">
                      <label className="block">
                        <span>Backend server</span>
                        <select className="block w-full mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black">
                          <option value="CBICA">CBICA server</option>
                          <option value="localhost">Your computer</option>
                        </select>
                      </label>
                    </div>
                  </form>
                </li>
                <li>
                  <a onClick={(e) => {
                    e.preventDefault();
                    setLogin(false);
                    setToken('');
                    localStorage.removeItem("token");
                  }} href="/" role="menuitem">Sign out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {(page === 'apps' && currentApp === '') ? <p className="p-10 mt-4">Please select an app</p> : ''}
        {(page === 'experiments' && experiments.length === 0) ? <p className="p-10 mt-4">You have no experiments</p> : ''}
        {/* {(page === 'results') ? <p className="p-10 mt-4">You have no results</p> : ''} */}
        {apps.map((app, i) => (
          <div className={(app.appKey === currentApp && page === 'apps') ? 'p-10 mt-4' : 'p-10 mt-4 hidden'}>
            <h2 className="text-3xl font-semibold">{app.label}</h2>
            <form onSubmit={appHandler} method="POST" action="#">
              <input name="token" type="hidden" value={token} />
              <input readOnly={true} name="app" type="hidden" value={app.appKey} />
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
                {Object.keys({ ...app.fieldGroups.required.fields, ...app.fieldGroups.optional?.fields }).map((field: string, i: number) => {
                  const combined = { ...app.fieldGroups.required.fields, ...app.fieldGroups.optional?.fields }
                  switch (combined[field].type) {
                    // switch (app.fieldGroups.required.fields[field].type) {
                    case 'string':
                      return (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">{combined[field]?.label}</span>
                          </label>
                          <input type="text" name={field} className="input input-bordered input-primary" placeholder="" />
                        </div>
                      )
                    case 'integer':
                    case 'float':
                      return (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">{combined[field]?.label}</span>
                          </label>
                          <input type="number" name={field} className="input input-bordered input-primary" placeholder="" />
                        </div>
                      )
                    case 'select':
                      return (
                        <select name={field} className="select select-bordered select-primary w-full">
                          <option disabled={true} selected={true}>{combined[field]?.label}</option>
                          {Object.keys((combined[field]) ? combined[field].choices : {}).map((choice: string) => (
                            <option value={choice}>{combined[field]?.choices[choice]}</option>
                          ))}
                        </select>
                      )

                    // return (
                    //   <label className="block">
                    //     <span>{combined[field]?.label}</span>
                    //     <select className="block w-full mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black">
                    //       {Object.keys((combined[field]) ? combined[field].choices : {}).map((choice: string) => (
                    //         <option value={choice}>{combined[field]?.choices[choice]}</option>
                    //       ))}
                    //     </select>
                    //   </label>
                    // )
                    case 'attachment':
                      return (
                        <label className="block lg:-mt-2 lg:-mb-2">
                          <span>{combined[field]?.label}</span>
                          <input type="file" name={field} multiple={true} className="mt-1 block w-full" />
                        </label>
                      )
                    default:
                      return (<div>There seems to be a misconfigured field:<br /><pre>{JSON.stringify(combined[field], null, 2)}</pre></div>)
                    //   console.log(app.fieldGroups.required.fields[field].type)
                  }
                })}
              </div>
              <label className="block mt-3">
                <button className="btn btn-primary" type="submit">Submit</button>
              </label>
            </form>
            {/* 
          <label className="block">
            <span>Additional details</span>
            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
          </label>
          <div className="block">
            <div className="mt-2">
              <div>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="border-gray-300 border-2 text-black focus:border-gray-300 focus:ring-black" />
                  <span className="ml-2">Email me news and special offers</span>
                </label>
              </div>
            </div>
          </div> */}
          </div>
        ))}
        <div className={(page === 'experiments' && experiments.length > 0) ? 'pl-3 pr-10' : 'pl-3 pr-10 hidden'}>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>App</th>
                  <th>Created</th>
                  <th>Outputs</th>
                  <th>Params</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp, idx) => (
                  <tr>
                    {console.log(exp)}
                    <th>{idx + 1}</th>
                    <td>{exp['experimentName']}</td>
                    <td>{exp['experimentDescription']}</td>
                    <td>{exp['app']}</td>
                    <td>{exp['created']}</td>
                    {/* <td>{exp['outputs']?.length}</td> */}
                    <td>{Object.keys(exp['params']).map((key, index) => (
                      <ul>
                        <li>{key}: {exp['params'][key]}</li>
                      </ul>
                    ))}</td>
                    <td>{exp['status']}</td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
