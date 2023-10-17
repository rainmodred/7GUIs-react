import { useState } from 'react';
import styles from './CRUD.module.css';

function createUser(name: string, surname: string) {
  return `${surname}, ${name}`.trim();
}

export default function CRUD() {
  const [users, setUsers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [filter, setFilter] = useState('');

  function handleSelectUser(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedUser(e.target.value);
  }

  function resetInputs() {
    setName('');
    setSurname('');
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.length > 0 && surname.length > 0) {
      setUsers([...users, createUser(name, surname)]);
      resetInputs();
    }
  }

  function handleUpdate() {
    setUsers(
      users.map(user =>
        user === selectedUser ? createUser(name, surname) : user,
      ),
    );
    resetInputs();
  }

  function handleDelete() {
    setUsers(users.filter(user => user !== selectedUser));
    resetInputs();
  }

  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className={styles.wrapper}>
      <h3>CRUD</h3>
      <form onSubmit={handleCreate}>
        <label>
          Filter prefix:
          <input
            onChange={e => setFilter(e.target.value.trim())}
            value={filter}
          />
        </label>
        <div className={styles.formWrapper}>
          <select size={3} onChange={handleSelectUser} value={selectedUser}>
            {filteredUsers.map(user => (
              <option key={user}>{user}</option>
            ))}
          </select>
          <div>
            <label>
              Name:
              <input
                onChange={e => setName(e.target.value.trim())}
                value={name}
              />
            </label>

            <label>
              Surname:
              <input
                onChange={e => setSurname(e.target.value.trim())}
                value={surname}
              />
            </label>
          </div>
        </div>
        <div className={styles.controls}>
          <button type="submit">create</button>
          <button type="button" onClick={handleUpdate}>
            update
          </button>
          <button type="button" onClick={handleDelete}>
            delete
          </button>
        </div>
      </form>
    </div>
  );
}
