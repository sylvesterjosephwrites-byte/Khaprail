import { BrowserRouter, Route, Routes } from "react-router-dom"
import { SiteLayout } from "@/components/layout/site-layout"
import { Home } from "@/pages/home"
import { CollectionsIndex } from "@/pages/collections-index"
import { CollectionDetail } from "@/pages/collection-detail"
import { ProductsListing } from "@/pages/products-listing"
import { ProductDetail } from "@/pages/product-detail"
import { About } from "@/pages/about"
import { Contact } from "@/pages/contact"
import { Videos } from "@/pages/videos"
import { Downloads } from "@/pages/downloads"
import { ComingSoon } from "@/pages/coming-soon"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<CollectionsIndex />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/products" element={<ProductsListing />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/new-arrivals" element={<ComingSoon title="New Arrivals" />} />
          <Route path="/best-sellers" element={<ComingSoon title="Best Sellers" />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/blog" element={<ComingSoon title="Blog" />} />
          <Route path="/blog/:slug" element={<ComingSoon title="Blog Post" />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
