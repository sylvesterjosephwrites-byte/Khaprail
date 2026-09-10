import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { SiteLayout } from "@/components/layout/site-layout"
import { Home } from "@/pages/home"
import { CategoriesIndex } from "@/pages/categories-index"
import { CategoryDetail } from "@/pages/category-detail"
import { ProductsListing } from "@/pages/products-listing"
import { SearchResults } from "@/pages/search-results"
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
import { AdminCategoriesList } from "@/pages/admin/categories-list"
import { AdminCategoryEditor } from "@/pages/admin/category-editor"
import { AdminFilterTypesList } from "@/pages/admin/filter-types-list"
import { AdminBlogList } from "@/pages/admin/blog-list"
import { AdminBlogEditor } from "@/pages/admin/blog-editor"
import { AdminSampleInquiriesList } from "@/pages/admin/sample-inquiries-list"
import { AdminLifestyleTilesList } from "@/pages/admin/lifestyle-tiles-list"
import { AdminLifestyleTileEditor } from "@/pages/admin/lifestyle-tile-editor"
import { AdminOfferCardsList } from "@/pages/admin/offer-cards-list"
import { AdminOfferCardEditor } from "@/pages/admin/offer-card-editor"
import { AdminTrendingTilesList } from "@/pages/admin/trending-tiles-list"
import { AdminTrendingTileEditor } from "@/pages/admin/trending-tile-editor"
import { AuthProvider } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<CategoriesIndex />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/products" element={<ProductsListing />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
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
              <Route path="/admin/categories" element={<AdminCategoriesList />} />
              <Route path="/admin/categories/new" element={<AdminCategoryEditor />} />
              <Route path="/admin/categories/:id/edit" element={<AdminCategoryEditor />} />
              <Route path="/admin/filter-types" element={<AdminFilterTypesList />} />
              <Route path="/admin/blog" element={<AdminBlogList />} />
              <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
              <Route path="/admin/blog/:id/edit" element={<AdminBlogEditor />} />
              <Route path="/admin/sample-inquiries" element={<AdminSampleInquiriesList />} />
              <Route path="/admin/lifestyle-tiles" element={<AdminLifestyleTilesList />} />
              <Route path="/admin/lifestyle-tiles/new" element={<AdminLifestyleTileEditor />} />
              <Route path="/admin/lifestyle-tiles/:id/edit" element={<AdminLifestyleTileEditor />} />
              <Route path="/admin/offer-cards" element={<AdminOfferCardsList />} />
              <Route path="/admin/offer-cards/new" element={<AdminOfferCardEditor />} />
              <Route path="/admin/offer-cards/:id/edit" element={<AdminOfferCardEditor />} />
              <Route path="/admin/trending-tiles" element={<AdminTrendingTilesList />} />
              <Route path="/admin/trending-tiles/new" element={<AdminTrendingTileEditor />} />
              <Route path="/admin/trending-tiles/:id/edit" element={<AdminTrendingTileEditor />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
