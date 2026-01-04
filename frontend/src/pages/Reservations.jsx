import { useState } from 'react'
import { apiPost } from '../api/client'

function toLocalInputValue(date){
  // format Date to 'YYYY-MM-DDTHH:MM'
  const pad = (n)=> String(n).padStart(2,'0')
  const y = date.getFullYear()
  const m = pad(date.getMonth()+1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${y}-${m}-${d}T${h}:${min}`
}

export default function Reservations(){
  const now = new Date()
  const [timeSlot, setTimeSlot] = useState(toLocalInputValue(new Date(now.getTime()+60*60*1000)))
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status,setStatus] = useState({state:'idle', message:'', tableNumber:null})

  async function onSubmit(e){
    e.preventDefault()
    setStatus({state:'loading'})
    try{
      // Send local datetime string as entered (YYYY-MM-DDTHH:MM)
      const res = await apiPost('/reservations',{
        timeSlot: timeSlot,
        guests, name, email, phone
      })
      setStatus({state:'success', message: res.message, tableNumber: res.tableNumber})
    }catch(err){
      setStatus({state:'error', message: err.message})
    }
  }

  return (
    <section className="card">
      <h1 style={{marginTop:0}}>Reserve a Table</h1>
      <form onSubmit={onSubmit} className="grid">
        <div className="row">
          <div>
            <label htmlFor="time" className="label">Date & Time</label>
            <input id="time" className="input" type="datetime-local" required value={timeSlot} onChange={e=>setTimeSlot(e.target.value)} />
          </div>
          <div>
            <label htmlFor="guests" className="label">Number of Guests</label>
            <input id="guests" className="input" type="number" min={1} value={guests} onChange={e=>setGuests(parseInt(e.target.value||'1',10))} />
          </div>
        </div>

        <div className="row">
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input id="name" className="input" required value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="label">Phone (optional)</label>
          <input id="phone" className="input" value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>

        <button className="btn" disabled={status.state==='loading'}>Book Reservation</button>
        {status.state==='success' && (
          <div className="badge" role="status">{status.message} Table #{status.tableNumber}.</div>
        )}
        {status.state==='error' && (
          <div className="badge" role="alert" style={{color:'#f66'}}>{status.message}</div>
        )}
      </form>
    </section>
  )
}
