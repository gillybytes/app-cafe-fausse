export default function About(){
  return (
    <div className="grid cols-2">
      <section className="card">
        <h1 style={{marginTop:0}}>About Café Fausse</h1>
        <p>
          Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends
          traditional Italian flavors with modern culinary innovation. Our mission is to provide an
          unforgettable dining experience that reflects both quality and creativity.
        </p>
        <p>
          We are committed to unforgettable dining, excellent food, and locally sourced ingredients. Our
          team partners with farmers and artisans to bring the freshest seasonal produce and sustainable
          products to your table.
        </p>
      </section>
      <section className="card">
        <h2 style={{marginTop:0}}>Founders</h2>
        <div className="grid cols-2">
          <div>
            <div className="brand">Chef Antonio Rossi</div>
            <div className="small">Executive Chef</div>
            <p>Antonio crafts menus inspired by his Italian heritage and global techniques.</p>
          </div>
          <div>
            <div className="brand">Maria Lopez</div>
            <div className="small">Restaurateur</div>
            <p>Maria leads the guest experience and vision of Café Fausse.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
