import { BrowserRouter, Route, Routes } from "react-router-dom"
import { SiteLayout } from "@/components/layout/site-layout"
import { Home } from "@/pages/home"
import { CollectionsIndex } from "@/pages/collections-index"
import { CollectionDetail } from "@/pages/collection-detail"
import { ProductsListing } from "@/pages/products-listing"
import { ProductDetail } from "@/pages/product-detail"
import { NewArrivals } from "@/pages/new-arrivals"
import { BestSellers } from "@/pages/best-sellers"
import { About } from "@/pages/about"
import { Contact } from "@/pages/contact"
import { Videos } from "@/pages/videos"
import { Downloads } from "@/pages/downloads"
import { BlogIndex } from "@/pages/blog-index"
import { BlogPost } from "@/pages/blog-post"
import { AdminLogin } from "@/pages/admin/login"
import { DashboardHome } from "@/pages/admin/dashboard-home"
import { AdminProductsList } from "@/pages/admin/products-list"
import { AdminProductEditor } from "@/pages/admin/product-editor"
import { AdminCollectionsList } from "@/pages/admin/collections-list"
import { AdminCollectionEditor } from "@/pages/admin/collection-editor"
import { AdminFilterTypesList } from "@/pages/admin/filter-types-list"
import { AdminBlogList } from "@/pages/admin/blog-list"
import { AdminBlogEditor } from "@/pages/admin/blog-editor"
import { AdminSampleInquiriesList } from "@/pages/admin/sample-inquiries-list"
import { AuthProvider } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<CollectionsIndex />} />
            <Route path="/collections/:slug" element={<CollectionDetail />} />
            <Route path="/products" element={<ProductsListing />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/best-sellers" element={<BestSellers />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin gets its own chrome, not the storefront's SiteLayout
              (07-ADMIN-DASHBOARD-SPEC.md). /admin/login is the only public
              admin route; everything else requires a session. */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardHome />} />
              <Route path="/admin/products" element={<AdminProductsList />} />
              <Route path="/admin/products/new" element={<AdminProductEditor />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductEditor />} />
              <Route path="/admin/collections" element={<AdminCollectionsList />} />
              <Route path="/admin/collections/new" element={<AdminCollectionEditor />} />
              <Route path="/admin/collections/:id/edit" element={<AdminCollectionEditor />} />
              <Route path="/admin/filter-types" element={<AdminFilterTypesList />} />
              <Route path="/admin/blog" element={<AdminBlogList />} />
              <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
              <Route path="/admin/blog/:id/edit" element={<AdminBlogEditor />} />
              <Route path="/admin/sample-inquiries" element={<AdminSampleInquiriesList />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
