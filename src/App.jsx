import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Softwares from './pages/Softwares'
import WhyGps from './pages/WhyGps'
import Downloads from './pages/Downloads'
import Faq from './pages/Faq'
import Contact from './pages/Contact'
import OpenEnquiry from './pages/OpenEnquiry'
import WhyChoose from './pages/WhyChoose'
import VehicleFleet from './pages/VehicleFleet'
import Security from './pages/Security'
import Personal from './pages/Personal'
import ElideFireball from './pages/ElideFireball'
import ElideProductOverview from './pages/ElideProductOverview'
import ElideFaq from './pages/ElideFaq'
import ElideHealthSafety from './pages/ElideHealthSafety'
import ElideDisposal from './pages/ElideDisposal'
import ElideWarranty from './pages/ElideWarranty'
import ElidePatents from './pages/ElidePatents'
import ElideStory from './pages/ElideStory'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="products" element={<Products />} />
        <Route path="softwares" element={<Softwares />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="enquiry" element={<OpenEnquiry />} />
        <Route path="demo" element={<OpenEnquiry />} />
        <Route path="faq" element={<Faq />} />
        <Route path="vehicle-fleet" element={<VehicleFleet />} />
        <Route path="security" element={<Security />} />
        <Route path="personal" element={<Personal />} />
        <Route path="whychoose" element={<WhyChoose />} />
        <Route path="whygps" element={<WhyGps />} />
        <Route path="elidefireball" element={<ElideFireball />} />
        <Route path="elidefireball/product-overview" element={<ElideProductOverview />} />
        <Route path="elidefireball/faq" element={<ElideFaq />} />
        <Route path="elidefireball/health-and-safety" element={<ElideHealthSafety />} />
        <Route path="elidefireball/disposal" element={<ElideDisposal />} />
        <Route path="elidefireball/product-warrantee" element={<ElideWarranty />} />
        <Route path="elidefireball/patents" element={<ElidePatents />} />
        <Route path="elidefireball/the-elide-fire-ball-story" element={<ElideStory />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
