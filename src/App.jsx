import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleShowFriend() {
    setShowAddFriend((show) => !show)
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend(cur => (cur?.id == friend.id ? null : friend))
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">  
        <FriendList onFormBill={handleSelectedFriend} friends={friends} onSelectedFriend={selectedFriend} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} onShowFriend={handleAddFriend} />}
        <Button onClick={() => setShowAddFriend(!showAddFriend)} >{showAddFriend ? 'Close' : 'Add Friend'}</Button>
      </div>
      {
        selectedFriend && <FormSplitBill onSplitBill={handleSplitBill} onSelectedFriend={selectedFriend} />
      }
    </div>
  )
}

function FriendList({ friends, onFormBill, onSelectedFriend }) {

  return (
    <ul>
      {
        friends.map(friend => (
          <Friend onSelectedFriend={onSelectedFriend} onFormBill={onFormBill} key={friend.id} friend={friend} />
        ))
      }
    </ul>

  )
}

function Friend({ friend, onFormBill, onSelectedFriend }) {
  const isSelected = onSelectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>}
      {friend.balance > 0 && <p className="green">{friend.name} owes you {Math.abs(friend.balance)}$</p>}
      {friend.balance === 0 && <p>You and {friend.name} are even </p>}
      <Button onClick={() => onFormBill(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )

}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}



function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    }
    onAddFriend(newFriend)
    setName("");
    setImage("https://i.pravatar.cc/48")
  }

  return (
    <form className="form-add-friend" action="" onSubmit={handleSubmit}>
      <label>👫Friend name</label>
      <input type="text" value={name} onChange={(e) => (setName(e.target.value))} />

      <label>🌄Image URL</label>
      <input type="text" value={image} onChange={(e) => (setImage(e.target.value))} />
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ onSelectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("")
  const [paidByUser, setPaidByUser] = useState("")
  const paidByFriend = bill ? bill - paidByUser : ""
  const [whoIsPaying, setWhoIsPaying] = useState("user")
  // const x = Math.abs((bill / 2) - paidByUser)

  // function onSubmit(e) {
  //   e.preventDefault()
  //   const billParam = {
  //     x,
  //     whoIsPaying
  //   }
  //   console.log(billParam);
  // }

  function handleSubmit(e) {
    e.preventDefault()
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)
  }


  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {onSelectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />
      <label>🧍Your expense</label>
      <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} />
      <label>👫{onSelectedFriend.name} 's expense</label>
      <input type="number" disabled value={paidByFriend} />
      <label>🤑Who is paying the bill</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        {/* {
          paidByUser > (bill / 2) ? <option value="user">You</option> : <option value="friend">{onSelectedFriend.name}</option>
        } */}
        <option value="user">You</option>
        <option value="friend">{onSelectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form >
  )
}
