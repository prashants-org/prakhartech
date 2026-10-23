import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './styles/components.css'
import './styles/ui.css'
import Layout from './components/Layout'
import { notFoundRoute, routes } from './routes'

// Every page is its own lazily loaded chunk, keyed by file name.
const pageModules = import.meta.glob('./pages/*.jsx')
const pages = Object.fromEntries(
  Object.entries(pageModules).map(([file, load]) => [file.slice('./pages/'.length, -'.jsx'.length), lazy(load)]),
)

function routeElement(route) {
  if (route.redirect) return <Navigate to={route.redirect} replace />
  const Page = pages[route.page]
  return <Page />
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((route) =>
          route.path === '/' ? (
            <Route key="/" index element={routeElement(route)} />
          ) : (
            <Route key={route.path} path={route.path.slice(1)} element={routeElement(route)} />
          ),
        )}
        <Route path="*" element={routeElement(notFoundRoute)} />
      </Route>
    </Routes>
  )
}

export default App
