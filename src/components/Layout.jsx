import Navbar from './Navbar.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-cyan-50">
      <div className="pb-16 lg:pb-0 lg:pt-16">
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="w-full max-w-[500px] px-6">
            {children}
          </div>
        </main>
      </div>
      <Navbar />
    </div>
  )
}
