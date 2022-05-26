import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { db } from './assets/config';
import { onValue, push, ref, remove, set } from 'firebase/database'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [updateUsername, setUpdateUsername] = useState('')
  const [updatePassword, setUpdatePassword] = useState('')

  const addUser = async () => {
    if (username && password) {
      // let userID = uuidv4()
      const userRef = ref(db, 'Users')
      const user = {
        username,
        password
      }
      await push(userRef, user)
      setUsername('')
      setPassword('')
    } else {
      alert('Please fill in all fields')
    }
  }

  const updateUser = async (userId) => {
    if (updateUsername && updatePassword) {
      const userRef = ref(db, 'Users/' + userId)
      const user = {
        username: updateUsername,
        password: updatePassword
      }
      await set(userRef, user)
      setUpdateUsername('')
      setUpdatePassword('')
    } else {
      alert('Please fill in all fields')
    }
  }

  const deleteUser = async (userId) => {
    const userRef = ref(db, 'Users/' + userId)
    await remove(userRef, userId)
  }

  useEffect(() => {
    const getUser = async () => {
      const userRef = ref(db, 'Users')
      await onValue(userRef, (snapshot) => {
        const data = snapshot.val()
        let users = []
        for (let id in data) {
          users.push({ id, ...data[id] })
        }
        // console.log(users)
        setUsers(users)
      })
    }
    getUser()
  }, [])


  return (
    <div className="App">
      <div className='user-form'>
        <div className='form-group'>
          <label>Username</label>
          <input type='text' placeholder='@username'
            onChange={(e) => {
              setUsername(e.target.value)
            }}
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input type='password'
            placeholder='password'
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <div className='form-group'>
          <input
            type='submit'
            value='Add User'
            onClick={() => {
              addUser()
            }}
          />
        </div>
      </div>
      <div className='show-users'>
        {
          users.map((user) => {
            return (
              <div key={user.id}>
                <div className='user-name'>
                  {user.username}
                </div>
                <div className='user-pass'>
                  {user.password}
                </div>
                <div className='update-form'>
                  <input type='text'
                    placeholder='@username'
                    onChange={(e) => {
                      setUpdateUsername(e.target.value)
                    }}
                  />
                  <input type='password'
                    placeholder='password'
                    onChange={(e) => {
                      setUpdatePassword(e.target.value)
                    }}
                  />
                  <input
                    type='submit'
                    value='Update'
                    onClick={() => {
                      updateUser(user.id)
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    deleteUser(user.id)
                  }}
                >
                  Delete
                </button>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
