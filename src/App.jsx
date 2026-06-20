import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const Softwares = lazy(() => import('./pages/Softwares'))
const WhyGps = lazy(() => import('./pages/WhyGps'))
const Downloads = lazy(() => import('./pages/Downloads'))
const Faq = lazy(() => import('./pages/Faq'))
const Contact = lazy(() => import('./pages/Contact'))
const OpenEnquiry = lazy(() => import('./pages/OpenEnquiry'))
const WhyChoose = lazy(() => import('./pages/WhyChoose'))
const VehicleFleet = lazy(() => import('./pages/VehicleFleet'))
const Security = lazy(() => import('./pages/Security'))
const Personal = lazy(() => import('./pages/Personal'))
const ElideFireball = lazy(() => import('./pages/ElideFireball'))
const ElideProductOverview = lazy(() => import('./pages/ElideProductOverview'))
const ElideFaq = lazy(() => import('./pages/ElideFaq'))
const ElideHealthSafety = lazy(() => import('./pages/ElideHealthSafety'))
const ElideDisposal = lazy(() => import('./pages/ElideDisposal'))
const ElideWarranty = lazy(() => import('./pages/ElideWarranty'))
const ElidePatents = lazy(() => import('./pages/ElidePatents'))
const ElideStory = lazy(() => import('./pages/ElideStory'))
const Gifts = lazy(() => import('./pages/Gifts'))
const Stationery = lazy(() => import('./pages/Stationery'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={null}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={null}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={null}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="softwares"
          element={
            <Suspense fallback={null}>
              <Softwares />
            </Suspense>
          }
        />
        <Route
          path="downloads"
          element={
            <Suspense fallback={null}>
              <Downloads />
            </Suspense>
          }
        />
        <Route
          path="enquiry"
          element={
            <Suspense fallback={null}>
              <OpenEnquiry />
            </Suspense>
          }
        />
        <Route
          path="demo"
          element={
            <Suspense fallback={null}>
              <OpenEnquiry />
            </Suspense>
          }
        />
        <Route
          path="faq"
          element={
            <Suspense fallback={null}>
              <Faq />
            </Suspense>
          }
        />
        <Route
          path="vehicle-fleet"
          element={
            <Suspense fallback={null}>
              <VehicleFleet />
            </Suspense>
          }
        />
        <Route
          path="security"
          element={
            <Suspense fallback={null}>
              <Security />
            </Suspense>
          }
        />
        <Route
          path="personal"
          element={
            <Suspense fallback={null}>
              <Personal />
            </Suspense>
          }
        />
        <Route
          path="whychoose"
          element={
            <Suspense fallback={null}>
              <WhyChoose />
            </Suspense>
          }
        />
        <Route
          path="whygps"
          element={
            <Suspense fallback={null}>
              <WhyGps />
            </Suspense>
          }
        />
        <Route
          path="elidefireball"
          element={
            <Suspense fallback={null}>
              <ElideFireball />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/product-overview"
          element={
            <Suspense fallback={null}>
              <ElideProductOverview />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/faq"
          element={
            <Suspense fallback={null}>
              <ElideFaq />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/health-and-safety"
          element={
            <Suspense fallback={null}>
              <ElideHealthSafety />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/disposal"
          element={
            <Suspense fallback={null}>
              <ElideDisposal />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/product-warrantee"
          element={
            <Suspense fallback={null}>
              <ElideWarranty />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/patents"
          element={
            <Suspense fallback={null}>
              <ElidePatents />
            </Suspense>
          }
        />
        <Route
          path="elidefireball/the-elide-fire-ball-story"
          element={
            <Suspense fallback={null}>
              <ElideStory />
            </Suspense>
          }
        />
        <Route
          path="gifts"
          element={
            <Suspense fallback={null}>
              <Gifts />
            </Suspense>
          }
        />
        <Route
          path="stationery"
          element={
            <Suspense fallback={null}>
              <Stationery />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
