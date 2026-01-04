import { useState } from 'react'
import { apiPost } from '../api/client'

export default function Home(){
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [status,setStatus] = useState({state:'idle', message:''})

  async function onSubmit(e){
    e.preventDefault()
    setStatus({state:'loading'})
    try{
      await apiPost('/newsletter',{ email, name })
      setStatus({state:'success', message:'Subscribed! Thank you.'})
      setEmail('')
    }catch(err){
      setStatus({state:'error', message: err.message})
    }
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <h1 className="brand" style={{fontSize:'1.75rem'}}>Welcome to Café Fausse</h1>
        <p>Fine dining blending traditional Italian flavors with modern innovation.</p>
        <div className="grid" style={{marginTop:'1rem'}}>
          <div><span className="badge">Address</span><div>1234 Culinary Ave, Suite 100, Washington, DC 20002</div></div>
          <div><span className="badge">Phone</span><div>(202) 555-4567</div></div>
          <div><span className="badge">Hours</span><div>Mon–Sat: 5:00 PM – 11:00 PM • Sun: 5:00 PM – 9:00 PM</div></div>
        </div>
      </section>
      <section className="card">
        <h2 style={{marginTop:0}}>Join our newsletter</h2>
        <form onSubmit={onSubmit} className="grid">
          <label className="label" htmlFor="name">Name (optional)</label>
          <input id="name" className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />

          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />

          <button className="btn" disabled={status.state==='loading'}>Subscribe</button>
          {status.state==='success' && <div className="badge" role="status">{status.message}</div>}
          {status.state==='error' && <div className="badge" role="alert" style={{color:'#f66'}}>{status.message}</div>}
        </form>
      </section>
    </div>
  )
}
