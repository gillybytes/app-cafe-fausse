import { MENU } from '../constants/menu'

export default function Menu(){
  return (
    <div className="grid cols-2">
      {Object.entries(MENU).map(([section, items]) => (
        <section key={section} className="card">
          <h2 style={{marginTop:0}}>{section}</h2>
          <div className="menu-grid">
            {items.map((it)=> (
              <div key={it.name} className="menu-item">
                <div>
                  <div style={{fontWeight:600}}>{it.name}</div>
                  <div className="small">{it.desc}</div>
                </div>
                <div>${it.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
