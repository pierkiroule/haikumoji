import Navbar from './Navbar.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="pb-16 lg:pb-0 lg:pt-16" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)' }}>
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="w-full max-w-[500px] px-6" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
            {children}
          </div>
        </main>
      </div>
      <Navbar />
    </div>
  )
}
