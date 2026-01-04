import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Reservations from './pages/Reservations.jsx'
import About from './pages/About.jsx'
import Gallery from './pages/Gallery.jsx'

function NavBar() {
  return (
    <header className="container">
      <div className="brand">Café Fausse</div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/reservations">Reservations</NavLink>
        <NavLink to="/about">About Us</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container small">
        <div>
          <div className="brand">Café Fausse</div>
          <div>1234 Culinary Ave, Suite 100, Washington, DC 20002</div>
          <div>(202) 555-4567</div>
          <div>Mon–Sat: 5:00 PM – 11:00 PM • Sun: 5:00 PM – 9:00 PM</div>
        </div>
        <div>
          <a href="/" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'})}}>Back to top</a>
        </div>
      </div>
    </footer>
  )
}

export default function App(){
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
