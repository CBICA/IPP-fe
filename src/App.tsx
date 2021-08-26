import React, { useEffect, useState } from 'react';
import axios from 'axios'
import categories from './IPP-Experiment_Defintions/categories.json'
import apps from './IPP-Experiment_Defintions/apps.json'
import signupFields from './config/signupFields.json'
import './App.css';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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
          setErrorMessage(resp.data.error)
        }
      })
      .catch(resp => {
        setErrorMessage(resp.message)
        console.error(resp)
      })
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

  const [loggedIn, setLogin] = useState(localStorage.getItem('token') !== null);
  const [token, setToken] = useState(localStorage.getItem('token') || (new URLSearchParams(window.location.search).get('token') ?? ''));
  const [signup, setSignup] = useState(false);
  const [page, setPage] = useState('apps');
  const [currentApp, setApp] = useState('');
  const [experiments, setExperiments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState({ groups: [] });

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
  useEffect(fetchExperiments, [token])

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
  useEffect(fetchUser, [token])

  if (!loggedIn) {
    return (
      <div className="hero min-h-screen bg-base-200">


        <div id="tos" className="modal w-full">
          <div className="modal-box max-w-none w-3/4 overflow-y-scroll max-h-screen">
            <h1 className="font-extrabold text-4xl text-center">Terms of Service</h1>
            <p className="text-center mb-2">2015-08-12</p>
            <h2 className="text-2xl font-bold mb-1 mt-2">Acceptable Data</h2>
            <p>Do not upload files to the IPP containing Protected Health Information, as defined the federal Health Insurance Portability and Accountability Act (“HIPAA”), or any data that identifies research subjects individually (together, “Personally Identifiable Information” or “PII”).</p>
            <h2 className="text-2xl font-bold mb-1 mt-2">Data Use and Retention</h2>
            <ul className="list-disc list-inside">
              <li>UPHS will not be responsible for safeguarding any PII data that may be accidentally uploaded to the IPP.</li>
              <li>UPHS will not make any use of images or data uploaded to the IPP, except as necessary to provide the requested image processing services.</li>
              <li>UPHS will not store data beyond the term needed to perform the image processing as requested by the submitter.</li>
              <li>UPHS will not store results of processing beyond a short period deemed appropriate by UPHS in its sole discretion to allow such results to be downloaded.</li>
            </ul>
            <h2 className="text-2xl font-bold mb-1 mt-2">Terms of Use</h2>
            <ul className="list-disc list-inside">
              <li>The party providing data to CBICA for analysis is solely responsible for complying with any restrictions imposed by the original supplier of the data and any applicable laws and regulations, including but not limited to those governing data collection, use, and transfer.</li>
              <li>Parties submitting data to CBICA for processing agree to use all results generated by the IPP solely for non-commercial use. The term "non-commercial," as applied to use of the CBICA Image Processing Portal, means academic or other scholarly research which (a) is not undertaken for profit, or (b) is not intended to produce work, services, or data for commercial use, or (c) is neither conducted, nor funded, by a person or an entity engaged in a commercial process of medical image analysis. Academic sponsored research is not a commercial use under the terms of this Agreement.</li>
              <li>The software has been designed for research purposes only and has not been reviewed or approved by the Food and Drug Administration or by any other agency. It is not intended or recommended for clinical applications.</li>
              <li>UPHS reserves the right to cancel IPP accounts without prior notice. All data associated with cancelled accounts will be removed.</li>
              <li>Data processing through the IPP is provided on a best effort basis, with no guarantee of timely delivery.</li>
              <li>Users of the IPP agree to conspicuously acknowledge "CBICA" and the specific analysis method[s] employed through the IPP in any publications resulting from their use of the IPP.</li>
            </ul>
            <p className="mt-2">Revision 1.2, Wed Aug  12 13:04:00 EDT 2015</p>
            <div className="modal-action">
              <a href={window.location.href.split('#')[0] + "#"} className="btn btn-primary">Close</a>
            </div>
          </div>
        </div>


        <div className="flex-col justify-center hero-content lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="mb-5 text-5xl font-bold">
              Welcome!
            </h1>
            <p className="mb-5">
              The CBICA Image Processing Portal is available for authorized users to access the Center for Biomedical Image Computing and Analytics computing cluster and imaging analytics pipelines on their own, free of charge, without the need to download and install any of our software. In this first phase of the project, we have provided a limited set of well streamlined pipelines covering methods of broad interest. We welcome your suggestions to adapt these pipelines to suit your specific needs.
            </p>
            <p className="mb-5">
              Many CBICA image processing algorithms and pre-processing tools are available for stand-alone use through the Cancer Imaging Phenomics Toolkit (CaPTk) software package. This open-source software is designed for general-purpose quantitative medical image analysis and specialized diagnostics (such as survival and recurrence prediction of glioblastoma) and is now available for download at: <a href="https://www.cbica.upenn.edu/captk" target="_blank" className="link link-accent">https://www.cbica.upenn.edu/captk</a>
            </p>
            <p className="mb-5">
              If you use our pipelines in your own publication we ask that you cite our respective publications. Moreover, we ask that you cite the portal as follows:
            </p>
            <p className="mb-5">
              <blockquote className="border-l-4 pl-3">CBICA Image Processing Portal; https://ipp.cbica.upenn.edu/.  A web accessible platform for imaging analytics; Center for Biomedical Image Computing and Analytics, University of Pennsylvania.</blockquote>
            </p>
            <div className="w-full carousel rounded-box">
              <div className="carousel-item w-1/2">
                <img src="https://ipp.cbica.upenn.edu/uploads/files/837739763739754523-img04.full.jpg" className="w-full" />
              </div>
              <div className="carousel-item w-1/2">
                <img src="https://ipp.cbica.upenn.edu/uploads/files/72100511629801360-img05.full.jpg" className="w-full" />
              </div>
              <div className="carousel-item w-1/2">
                <img src="https://ipp.cbica.upenn.edu/uploads/files/549317001114620719-img06.full.jpg" className="w-full" />
              </div>
              <div className="carousel-item w-1/2">
                <img src="https://ipp.cbica.upenn.edu/uploads/files/604887918702357499-img07.full.jpg" className="w-full" />
              </div>
            </div>
            <p className="text-sm mt-2">Center for Biomedical Image Computing and Analytics, University of Pennsylvania &middot; <a href="mailto:ipp-support@cbica.upenn.edu" className="link link-primary">Contact</a> &middot; <a href="http://www.cbica.upenn.edu/" target="_blank" rel="noreferrer" className="link link-primary">About</a></p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className={"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative " + (errorMessage === '' ? 'hidden' : '')} role="alert">
                <strong className="font-bold">Heads up!</strong>
                <span style={{ textTransform: 'capitalize' }} className="block sm:inline ml-2">{errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage('')}>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                  </span>
                </button>
              </div>

              <p className="mt-2 text-center text-sm">
                <div className="divider text-sm m-0 mb-2 uppercase"><button onClick={() => setSignup(!signup)} className="btn btn-secondary btn-xs mr-2"> {(signup) ? 'Sign in' : 'Create an account'}</button> or</div>
              </p>
              <h2 className="card-title text-2xl text-center mb-1">
                {(signup) ? 'Create your account' : 'Sign in to your account'}
              </h2>

              <form className="mt-2" action="#" method="POST" onSubmit={signup ? signupHandler : loginHandler}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="form-control">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid email')} className="input input-bordered" placeholder="Email address" />
                </div>
                <div className="mt-2 form-control">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required minLength={6} className="input input-bordered" placeholder="Password" />
                </div>
                {(signup) ?
                  <div className="mt-2 form-control">
                    <label htmlFor="confirm-password" className="sr-only">Confirm password</label>
                    <input name="confirm-password" id="confirm-password" type="password" required={true} minLength={6} className="input input-bordered" placeholder="Confirm password" />
                  </div> : ''}
                {(signup) ?
                  signupFields.map(field => {
                    switch (field.type) {
                      case 'textarea':
                        return (
                          <div className="mt-2 form-control">
                            <label htmlFor={field.id} className="sr-only">{field.name}</label>
                            <textarea name={'setting-' + field.id} id={field.id} required={field.required} className="textarea textarea-bordered" placeholder={field.name}></textarea>
                          </div>)

                      default:
                        return (
                          <div className="mt-2 form-control">
                            <label htmlFor={field.id} className="sr-only">{field.name}</label>
                            <input name={'setting-' + field.id} id={field.id} type={field.type} required={field.required} pattern={field.pattern} className="input input-bordered" placeholder={field.name} />
                          </div>)
                    }
                  })
                  : ''}

                {(signup) ?
                  <div className="mt-2 form-control">
                    <label className="cursor-pointer label">
                      <span className="label-text">Agree to <a href="#tos" className="link link-primary">terms of service</a></span>

                      <input id="tos-check" type="checkbox" required={true} className="checkbox checkbox-primary" />
                    </label>
                  </div> : ''}

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
                <div className="form-control mt-6">
                  <button className="group relative flex justify-center btn btn-primary btn-block mt-2">
                    {/* Heroicon name: solid/lock-closed */}
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-gray-900 opacity-20 mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Sign {(signup) ? 'up' : 'in'}
                  </button>

                </div>
              </form>

            </div>
          </div>
        </div>
      </div>


    )
  }

  return (
    <div className="md:flex flex-col md:flex-row md:min-h-screen w-full bg-base-200 overflow-y-auto">
      <div className="flex flex-col w-auto py-4 px-2">



        <div className="artboard artboard-demo">
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
                    <ol className="shadow-lg menu dropdown-content bg-base-100 w-full pl-0">
                      <li>
                        {categories[cat].apps.map((app: string) => (
                          <a href="#" onClick={() => { setApp(app) }} className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">{app}</a>
                        ))}
                      </li>
                    </ol>

                  </li>
                )
              }
              return (<div></div>)
            }
            )}
          </ul>
        </div>


      </div>


      <div className="flex flex-col w-full py-4 px-2">

        <div className="navbar mb-2 shadow-lg bg-base-100 rounded-box">
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
              <div className="indicator">
                <div className={"indicator-item badge badge-secondary" + (experiments.length === 0 ? ' hidden' : '')}>{experiments.length}</div>
                <a onClick={() => setPage('experiments')} className="btn btn-ghost btn-sm rounded-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 mr-2 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                  </svg>
                  Experiments

                </a>
              </div>
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
                <li className="p-5">
                  <form action="#">
                    <div className="form-control">
                      <label className="cursor-pointer label">
                        <span className="label-text">Email notifications</span>
                        <input type="checkbox" className="checkbox checkbox-primary" />
                      </label>
                    </div>
                  </form>
                </li>
                <li className="p-5">
                  <form action="#">
                    <div className="form-control">
                      <label className="cursor-pointer label">
                        <span className="label-text">Slack notifications</span>
                        <input type="checkbox" className="checkbox checkbox-primary" />
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
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">{combined[field]?.label}</span>
                          </label>
                          <select name={field} className="select select-bordered select-primary w-full">
                            {Object.keys((combined[field]) ? combined[field].choices : {}).map((choice: string) => (
                              <option value={choice}>{combined[field]?.choices[choice]}</option>
                            ))}
                          </select>
                        </div>
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Execute host</span>
                  </label>
                  <select name="host" className="select select-bordered select-primary w-full">
                    <option value="cubic">CUBIC</option>
                    <option value="localhost">Localhost</option>
                    <option value="cbica1">IPP server</option>
                  </select>
                </div>
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
                    <th>{idx + 1}</th>
                    <td>{exp['experimentName']}</td>
                    <td>{exp['experimentDescription']}</td>
                    <td>{exp['app']}</td>
                    <td>{exp['created']}</td>
                    {/* <td><ul>{Array.from(exp['outputs']).map((output: string) => {
                      return (<div>{output}</div>)
                    })}</ul></td> */}
                    <td>{Array.from(exp['outputs']).map((x) => (<a href={apiUrl + "/experiments/" + exp['id'] + "/file?" + new URLSearchParams({
                      'token': token,
                      'path': x as string
                    }).toString()} target="_blank">{x as string}</a>))}</td>
                    <td>{Object.keys(exp['params']).map((key, index) => {
                      if (Array.from(exp['inputs']).includes(exp['params'][key])) {
                        return (
                          <ul>
                            <li>{key}: <a href={apiUrl + "/experiments/" + exp['id'] + "/file?" + new URLSearchParams({
                              'token': token,
                              'path': exp['params'][key]
                            }).toString()} target="_blank">{exp['params'][key]}</a></li>
                          </ul>)
                      } else {
                        return (
                          <ul>
                            <li>{key}: {exp['params'][key]}</li>
                          </ul>)
                      }
                    })}</td>
                    <td style={{ textTransform: 'capitalize' }}>{exp['status']}</td>
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
