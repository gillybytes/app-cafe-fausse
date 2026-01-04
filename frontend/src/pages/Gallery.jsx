import { useState } from 'react'
import { GALLERY_IMAGES, AWARDS, REVIEWS } from '../constants/gallery'

export default function Gallery(){
  const [active, setActive] = useState(null)

  return (
    <div className="grid">
      <section className="card">
        <h1 style={{marginTop:0}}>Gallery</h1>
        <div className="gallery-grid" role="list">
          {GALLERY_IMAGES.map((src,i)=> (
            <img key={i} src={src} alt={`Gallery image ${i+1}`} role="listitem" onClick={()=>setActive(src)} />
          ))}
        </div>
      </section>

      <section className="card">
        <h2 style={{marginTop:0}}>Awards</h2>
        <ul>
          {AWARDS.map((a)=> <li key={a} className="small">{a}</li>)}
        </ul>
        <h2>Reviews</h2>
        <ul>
          {REVIEWS.map((r)=> <li key={r} className="small">{r}</li>)}
        </ul>
      </section>

      {active && (
        <div className="modal" onClick={()=>setActive(null)}>
          <img src={active} alt="Enlarged" />
        </div>
      )}
    </div>
  )
}
