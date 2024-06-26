import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import './index.css'

const App = () => {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [users, setUsers] = useState([])

  const loadUsers = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    setUsers(data.users)
    setStatus(data.status)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: name }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()
    loadUsers()
    setName('')
    toast.success('Tạo ghi chú thành công!', {
      duration: 4000,
      position: 'top-right'
    })
  }

  const deleteUser = async (id) => {
    const response = await fetch(`/api/users`, {
      method: 'DELETE',
      body: JSON.stringify({ _id: id }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    loadUsers()

    const data = await response.json()

    if (data.status == 200) {
      toast.success('Xoá ghi chú thành công!', {
        duration: 4000,
        position: 'top-right'
      })
      return "User deleted!"
    } else {
      toast.error('Error while deleting ghi chú.', {
        duration: 4000,
        position: 'top-right'
      })
      return "An error ocurred."
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
      <form onSubmit={handleSubmit}>
        <input style={{ fontSize: '1.25rem',}} name="name" placeholder="Nhập ghi chú của bạn!" value={name} onChange={e => setName(e.target.value)} />

        <button style={{ fontSize: '1.25rem', borderRadius: '10%', border: 'none', backgroundColor: '#1B7CED', color: 'white', cursor: 'pointer', marginLeft: '10px' }}>Lưu</button>
      </form>

      <code style={{ backgroundColor: '#EBECF0', color: '#1B7CED', fontSize: '1.25rem' }}>Trạng Thái => {status == 200 ? 'OK' : 'Error'}</code>
      <div style={{color: 'red',marginLeft: '-40px'}}>
        <p>*Nếu Trạng Thái => OK là Thành Công</p>
        <p>*Nếu Trạng Thái => Error là Lỗi</p>
      </div>
      {users && <ul>
        {users.map(user => (
          <>
            {/* <li style={{ fontSize: '1.25rem',}} key={user._id}>{user.name}
              <button style={{ marginLeft: '300px', maxWidth:'300px', marginTop: '-50px', backgroundColor: '#DC143C', border: 'none', color: 'white', fontSize: '1.1rem', borderRadius: '10%', height: '1.5rem', cursor: 'pointer' }} onClick={() => deleteUser(user._id)}>Xoá</button>
            </li> */}
            <li style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', fontSize: '1.25rem', maxWidth: '300px' }} key={user._id}>
            <div>{user.name}</div>
              <button 
                style={{ 
                  marginLeft: '150px', // Cách name 150px
                  backgroundColor: '#DC143C',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.1rem',
                  borderRadius: '10%',
                  height: '1.5rem',
                  cursor: 'pointer',
                  marginTop: '5px',
                }} 
                onClick={() => deleteUser(user._id)}
              >
                Xoá
              </button>
            </li>
          </>
        ))}
      </ul>}

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '300px',}}>
        <img style={{width:'250px', height:'250px'}} src='https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_Blue.png' alt=''/>
        <img style={{width:'250px', height:'250px'}} src='https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png' alt=''/>
        <img style={{width:'250px', height:'250px'}} src='https://mongodb.gallerycdn.vsassets.io/extensions/mongodb/mongodb-vscode/1.6.0/1713873233895/Microsoft.VisualStudio.Services.Icons.Default' alt=''/>
      </div>
      
      <Toaster />
    </div>
  )
}

export default App
