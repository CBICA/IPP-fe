import React, { useState } from 'react';
import axios from 'axios'
import categories from './config/categories.json'
import apps from './config/apps.json'
import './App.css';
const API_URL = 'http://localhost:3330'

function App() {
  const loginHandler = (e) => {
    e.preventDefault()
    axios({
      url: API_URL + '/users/auth',
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: new FormData(e.target)
    })
      .then((resp) => {
        if (resp.data.token) {
          setLogin(true)
          setToken(resp.data.token)
          localStorage.setItem("token", resp.data.token)
        } else {
          console.error(resp.data.error)
        }
      })
      .catch(resp => console.error(resp))
  }
  const signupHandler = (e) => {
    e.preventDefault()
    axios({
      url: API_URL + '/users/new',
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: new FormData(e.target)
    })
      .then((resp) => {
        if (resp.data.token) {
          setLogin(true)
          setToken(resp.data.token)
          localStorage.setItem("token", resp.data.token)
        } else {
          console.error(resp.data.error)
        }
      })
      .catch(resp => console.error(resp))
  }

  const appHandler = (e) => {
    e.preventDefault()
    axios({
      url: API_URL + '/experiments/new',
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data: new FormData(e.target)
    })
      .then((resp) => {
        console.log(resp.data)
      })
      .catch(resp => console.error(resp))
  }

  const [loggedIn, setLogin] = useState(localStorage.getItem('token') !== null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [signup, setSignup] = useState(false);
  const [page, setPage] = useState('apps');
  const [dropdown, setDropdown] = useState('');
  const [currentApp, setApp] = useState('');

  const experiments = [{
    label: 'my experiment',
    app: 'MIMoSA',
    status: 'Processing',
    inputs: ['flair.nii.gz', 't1.nii.gz'],
    outputs: []
  },
  {
    label: 'another experiment',
    app: 'MIMoSA',
    status: 'Done',
    inputs: ['flair.nii.gz', 't1.nii.gz'],
    outputs: ['out.nii.gz']
  }]
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            {/* <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" /> */}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {(signup) ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or <button onClick={() => setSignup(!signup)} className="font-medium text-indigo-600 hover:text-indigo-500"> {(signup) ? 'sign into' : 'create'} an account</button>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={signup ? signupHandler : loginHandler}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
              </div>
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
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
      <div className="flex flex-col w-full md:w-96 text-gray-700 bg-gray-100 dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0">
        <div className="flex-shrink-0 px-8 py-4 pb-0 flex flex-row items-center justify-between">
          <a href="#" className="text-md font-semibold text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">Image Processing Portal Apps</a>
        </div>
        <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
          {/* <a className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Home</a> */}
          {Object.keys(categories).map((cat, i) => (
            <div className="relative">
              <button onClick={() => dropdown ? setDropdown('') : setDropdown(`dropdown${i}`)} className="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600 dark-mode:hover:bg-gray-600 md:block hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                <span>{categories[cat].label}</span>
                <svg fill="currentColor" viewBox="0 0 20 20" className="inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </button>
              <div className={dropdown === `dropdown${i}` ? "absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg z-40" : "absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg transform opacity-0 scale-95"} data-dropdown={"dropdown" + i}>
                <div className="px-2 py-2 bg-white rounded-md shadow dark-mode:bg-gray-800">
                  {categories[cat].apps.map((app: string) => (
                    <button onClick={() => { setApp(app); setDropdown(''); console.log(app) }} className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">{app}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>


      <div className="flex flex-col w-full">
        {/*  style={{'background': '#34344A'}} */}
        {/*  style={{'background': '#3d405b'}} */}
        <nav className="w-full shadow bg-gray-50 rounded-bl-lg">
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  {/*
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          */}
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {/*
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          */}
                  <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    <button onClick={() => setPage('apps')} className={(page === 'apps') ? "flex mr-10 items-center text-gray-800 hover:text-gray-900 border-t-4 border-indigo-500 text-sm pt-5 pb-5 focus:outline-none" : "flex mr-10 items-center text-gray-800 hover:text-gray-900 text-sm pt-5 pb-5 focus:outline-none"}>
                      <svg className="text-gray-500 w-5 h-5 mr-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.33335 9.83342H1.50002C1.27901 9.83342 1.06704 9.92121 0.910765 10.0775C0.754484 10.2338 0.666687 10.4457 0.666687 10.6667V16.5001C0.666687 16.7211 0.754484 16.9331 0.910765 17.0893C1.06704 17.2456 1.27901 17.3334 1.50002 17.3334H7.33335C7.55437 17.3334 7.76633 17.2456 7.92261 17.0893C8.07889 16.9331 8.16669 16.7211 8.16669 16.5001V10.6667C8.16669 10.4457 8.07889 10.2338 7.92261 10.0775C7.76633 9.92121 7.55437 9.83342 7.33335 9.83342ZM6.50002 15.6667H2.33335V11.5001H6.50002V15.6667ZM16.5 0.666748H10.6667C10.4457 0.666748 10.2337 0.754545 10.0774 0.910826C9.92115 1.06711 9.83335 1.27907 9.83335 1.50008V7.33342C9.83335 7.55443 9.92115 7.76639 10.0774 7.92267C10.2337 8.07895 10.4457 8.16675 10.6667 8.16675H16.5C16.721 8.16675 16.933 8.07895 17.0893 7.92267C17.2456 7.76639 17.3334 7.55443 17.3334 7.33342V1.50008C17.3334 1.27907 17.2456 1.06711 17.0893 0.910826C16.933 0.754545 16.721 0.666748 16.5 0.666748ZM15.6667 6.50008H11.5V2.33341H15.6667V6.50008ZM16.5 9.83342H10.6667C10.4457 9.83342 10.2337 9.92121 10.0774 10.0775C9.92115 10.2338 9.83335 10.4457 9.83335 10.6667V16.5001C9.83335 16.7211 9.92115 16.9331 10.0774 17.0893C10.2337 17.2456 10.4457 17.3334 10.6667 17.3334H16.5C16.721 17.3334 16.933 17.2456 17.0893 17.0893C17.2456 16.9331 17.3334 16.7211 17.3334 16.5001V10.6667C17.3334 10.4457 17.2456 10.2338 17.0893 10.0775C16.933 9.92121 16.721 9.83342 16.5 9.83342ZM15.6667 15.6667H11.5V11.5001H15.6667V15.6667ZM7.33335 0.666748H1.50002C1.27901 0.666748 1.06704 0.754545 0.910765 0.910826C0.754484 1.06711 0.666687 1.27907 0.666687 1.50008V7.33342C0.666687 7.55443 0.754484 7.76639 0.910765 7.92267C1.06704 8.07895 1.27901 8.16675 1.50002 8.16675H7.33335C7.55437 8.16675 7.76633 8.07895 7.92261 7.92267C8.07889 7.76639 8.16669 7.55443 8.16669 7.33342V1.50008C8.16669 1.27907 8.07889 1.06711 7.92261 0.910826C7.76633 0.754545 7.55437 0.666748 7.33335 0.666748ZM6.50002 6.50008H2.33335V2.33341H6.50002V6.50008Z" fill="currentColor"></path>
                      </svg>
                      Apps
                    </button>
                    {/* uploads like inputs, results = outputs; or, "experiments" */}
                    <button onClick={() => setPage('experiments')} className={(page === 'experiments') ? "flex mr-10 items-center text-gray-800 hover:text-gray-900 border-t-4 border-indigo-500 text-sm pt-5 pb-5 focus:outline-none" : "flex mr-10 items-center text-gray-800 hover:text-gray-900 text-sm pt-5 pb-5 focus:outline-none"}>
                      <svg className="text-gray-600 w-5 h-5 mr-2" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.9831 6.64169C18.9047 6.545 18.8056 6.46712 18.6931 6.41376C18.5806 6.36041 18.4576 6.33293 18.3331 6.33335H16.6665V5.50002C16.6665 4.83698 16.4031 4.20109 15.9342 3.73225C15.4654 3.26341 14.8295 3.00002 14.1665 3.00002H8.93313L8.66646 2.16669C8.49359 1.67771 8.17292 1.2546 7.74888 0.955986C7.32484 0.657367 6.81843 0.498019 6.2998 0.500019H3.33313C2.67009 0.500019 2.0342 0.763411 1.56536 1.23225C1.09652 1.70109 0.83313 2.33698 0.83313 3.00002V13C0.83313 13.6631 1.09652 14.2989 1.56536 14.7678C2.0342 15.2366 2.67009 15.5 3.33313 15.5H15.3331C15.9008 15.4984 16.451 15.3036 16.8933 14.9476C17.3355 14.5917 17.6435 14.0959 17.7665 13.5417L19.1665 7.35002C19.1918 7.22578 19.1885 7.0974 19.1567 6.97466C19.1249 6.85191 19.0656 6.73803 18.9831 6.64169ZM4.4748 13.1834C4.43246 13.3713 4.32629 13.5388 4.17435 13.6574C4.02241 13.7759 3.8341 13.8381 3.64146 13.8334H3.33313C3.11212 13.8334 2.90015 13.7456 2.74387 13.5893C2.58759 13.433 2.4998 13.221 2.4998 13V3.00002C2.4998 2.779 2.58759 2.56704 2.74387 2.41076C2.90015 2.25448 3.11212 2.16669 3.33313 2.16669H6.2998C6.48152 2.1572 6.66135 2.20746 6.81183 2.30978C6.9623 2.4121 7.07515 2.56087 7.13313 2.73335L7.58313 4.10002C7.6366 4.25897 7.7368 4.39809 7.8706 4.49919C8.00441 4.60029 8.16561 4.65867 8.33313 4.66669H14.1665C14.3875 4.66669 14.5994 4.75448 14.7557 4.91076C14.912 5.06704 14.9998 5.27901 14.9998 5.50002V6.33335H6.66646C6.47383 6.32864 6.28551 6.39084 6.13358 6.50935C5.98164 6.62786 5.87546 6.79537 5.83313 6.98335L4.4748 13.1834ZM16.1415 13.1834C16.0991 13.3713 15.993 13.5388 15.841 13.6574C15.6891 13.7759 15.5008 13.8381 15.3081 13.8334H6.00813C6.05117 13.7405 6.08198 13.6425 6.0998 13.5417L7.33313 8.00002H17.3331L16.1415 13.1834Z" fill="currentColor"></path>
                      </svg>
                      Experiments
                    </button>

                    {/* <button onClick={() => setPage('results')} className={(page === 'results') ? "flex mr-10 items-center text-gray-800 hover:text-gray-900 border-t-4 border-indigo-500 text-sm pt-5 pb-5 focus:outline-none" : "flex mr-10 items-center text-gray-800 hover:text-gray-900 text-sm pt-5 pb-5 focus:outline-none"}>
                      <svg className="text-gray-600 w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8802 1.66663H4.2135C3.55068 1.66735 2.91522 1.93097 2.44653 2.39966C1.97785 2.86834 1.71422 3.50381 1.7135 4.16663V15.8333C1.71422 16.4961 1.97785 17.1316 2.44653 17.6003C2.91522 18.0689 3.55068 18.3326 4.2135 18.3333H15.8802C16.543 18.3326 17.1785 18.0689 17.6471 17.6003C18.1158 17.1316 18.3794 16.4961 18.3802 15.8333V4.16663C18.3794 3.50381 18.1158 2.86834 17.6471 2.39966C17.1785 1.93097 16.543 1.66735 15.8802 1.66663ZM4.2135 3.33329H15.8802C16.1011 3.33351 16.3129 3.42138 16.4692 3.57761C16.6254 3.73385 16.7133 3.94568 16.7135 4.16663V10.8333H14.6595C14.385 10.8331 14.1148 10.9007 13.8729 11.0302C13.6309 11.1597 13.4248 11.347 13.2728 11.5755L12.1009 13.3333H7.9928L6.82093 11.5755C6.6689 11.347 6.46273 11.1597 6.22079 11.0302C5.97884 10.9007 5.70863 10.8331 5.43421 10.8333H3.38017V4.16663C3.38039 3.94568 3.46826 3.73385 3.62449 3.57761C3.78072 3.42138 3.99255 3.33351 4.2135 3.33329ZM15.8802 16.6666H4.2135C3.99255 16.6664 3.78072 16.5785 3.62449 16.4223C3.46826 16.2661 3.38039 16.0542 3.38017 15.8333V12.5H5.43421L6.60608 14.2578C6.75811 14.4862 6.96428 14.6736 7.20622 14.803C7.44817 14.9325 7.71838 15.0002 7.9928 15H12.1009C12.3753 15.0002 12.6455 14.9325 12.8875 14.803C13.1294 14.6736 13.3356 14.4862 13.4876 14.2578L14.6595 12.5H16.7135V15.8333C16.7133 16.0542 16.6254 16.2661 16.4692 16.4223C16.3129 16.5785 16.1011 16.6664 15.8802 16.6666Z" fill="currentColor"></path>
                      </svg>
                      Results
                    </button> */}

                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"> */}
                {/* <span className="sr-only">View notifications</span> */}
                {/* Heroicon name: outline/bell */}
                {/* <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg> */}
                {/* </button> */}

                {/* Profile dropdown */}
                {/* <div className="ml-3 relative"> */}
                {/* <div>
                    <button type="button" className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    </button>
                  </div> */}

                {/*
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          */}
                {/* <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"> */}
                {/* Active: "bg-gray-100", Not Active: "" */}
                {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-0">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-1">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">Sign out</a>
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>

          {/* Mobile menu, show/hide based on menu state. */}
          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              <button className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Apps</button>

              <button className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Uploads</button>

              <button className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Results</button>

            </div>
          </div>
        </nav>

        {(page === 'apps' && currentApp === '') ? <p className="p-10 mt-4">Please select an app</p> : ''}
        {(page === 'experiments' && experiments.length === 0) ? <p className="p-10 mt-4">You have no experiments</p> : ''}
        {/* {(page === 'results') ? <p className="p-10 mt-4">You have no results</p> : ''} */}
        {apps.map((app, i) => (
          <div className={(app.label === currentApp && page === 'apps') ? 'p-10 mt-4' : 'p-10 mt-4 hidden'}>
            <h2 className="text-3xl font-semibold text-gray-900">{app.label}</h2>
            <form onSubmit={appHandler} method="POST" action="#">
              <input name="token" type="hidden" value={token} />
              <input readOnly={true} name="app" type="hidden" value={app.label} />
              {Object.keys({...app.fieldGroups.required.fields, ...app.fieldGroups.optional?.fields}).map((field: string, i: number) => {
                const combined = {...app.fieldGroups.required.fields, ...app.fieldGroups.optional?.fields}
                switch (combined[field].type) {
                // switch (app.fieldGroups.required.fields[field].type) {
                  case 'string':
                    return (
                      <label className="block">
                        <span className="text-gray-700">{combined[field]?.label}</span>
                        <input type="text" name={field} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="" />
                      </label>
                    )
                  case 'integer':
                  case 'float':
                    return (
                      <label className="block">
                        <span className="text-gray-700">{combined[field]?.label}</span>
                        <input type="number" name={field} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="" />
                      </label>
                    )
                  case 'select':
                    return (
                      <div className="block mt-2">
                        {combined[field]?.label}
                        {Object.keys((combined[field]) ? combined[field].choices : {}).map((choice: string) => (
                          <label className="block">
                            <input type="radio" name={field} value={choice} className="rounded ml-1 border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50" />
                            <span className="text-gray-700 ml-2">{combined[field]?.choices[choice]}</span>
                          </label>
                        ))}
                      </div>
                    )

                    // return (
                    //   <label className="block">
                    //     <span className="text-gray-700">{combined[field]?.label}</span>
                    //     <select className="block w-full mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black">
                    //       {Object.keys((combined[field]) ? combined[field].choices : {}).map((choice: string) => (
                    //         <option value={choice}>{combined[field]?.choices[choice]}</option>
                    //       ))}
                    //     </select>
                    //   </label>
                    // )
                  case 'attachment':
                    return (
                      <label className="block mt-2 mb-2">
                        <span className="text-gray-700">{combined[field]?.label}</span>
                        <input type="file" name={field} multiple={true} className="mt-1 block w-full" />
                      </label>
                    )
                  default:
                    return (<div>There seems to be a misconfigured field:<br/><pre>{JSON.stringify(combined[field], null, 2)}</pre></div>)
                    //   console.log(app.fieldGroups.required.fields[field].type)
                }
              })}
              <label className="block mt-3">
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" type="submit">Submit</button>
              </label>
            </form>
            {/* 
          <label className="block">
            <span className="text-gray-700">Additional details</span>
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
        <div className={(page === 'experiments' && experiments.length > 0) ? 'pl-10 pr-10' : 'pl-10 pr-10 hidden'}>
          {experiments.map((exp) => (
            <div className="mt-5 max-w-md inline-block mr-5">
              <h5 className="text-2xl font-semibold mb-0">{exp.label} <small className="text-gray-400 text-xl">{exp.app}</small></h5>
              <div className={'rounded-full h-3 w-3 inline-block ' + ((exp.status === 'Done') ? 'bg-green-400' : 'bg-yellow-400')}></div><p className="mt-0 pt-0 mb-2 inline ml-2">{exp.status}</p>
              <ul className="list-reset flex flex-col shadow bg-gray-50 rounded-lg">
                {exp.status === 'Done' ? <li className="block border border-grey p-4 font-bold border-b bg-yellow-400">Warning: please download your experiment now; it will be deleted in 48h</li> : ''}
                {['Inputs', ...exp.inputs, 'Outputs', ...exp.outputs].map(x => (
                  <li className={'relative -mb-px block border border-grey ' + ((x === 'Inputs' || x === 'Outputs') ? 'p-4 font-bold border-b' : 'p-2 pl-4')}>
                    {(x === 'Inputs' || x === 'Outputs') ? x :
                      <div>
                        <a href='/' className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">{x}</a>
                        <svg className="inline float-right mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.21 0-4 1.791-4 4s1.79 4 4 4c2.209 0 4-1.791 4-4s-1.791-4-4-4zm-.004 3.999c-.564.564-1.479.564-2.044 0s-.565-1.48 0-2.044c.564-.564 1.479-.564 2.044 0s.565 1.479 0 2.044z"/></svg>
                        <svg className="inline float-right mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm1 11h-10v2h10v-2z"/></svg>
                        <svg className="inline float-right mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#EF4444" d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>
                      </div>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
