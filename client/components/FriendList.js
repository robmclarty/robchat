import React, { PropTypes } from 'react'

// If a callback is defined, call it, otherwise, do nothing.
const handleClick = (e, userId, friendId, cb) => {
  if (cb) cb(userId, friendId)
}

// TODO: children won't work here as they each need references of the ids here.
const FriendList = ({ userId, friends, heading, onClickFriend }) => (
  {friends.length > 0 &&
    <div>
      <h2>{heading}</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            <span
                className="friend-name"
                onClick={e => handleClick(e, userId, friend.id, onClickFriend)}>
              {friend.username}
            </span>
            {children}
          </li>
        ))}
      </ul>
    </div>
  }
)

List.propTypes = {
  id: PropTypes.number.isRequired,
  list: PropTypes.array,
  onClickFriend: PropTypes.func,
  children: PropTypes.element
}

export default List
