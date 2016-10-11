import React, { PropTypes } from 'react'
import AddFriend from './AddFriend'

const FriendControls = ({
  userId,
  friends,
  requests,
  pending,
  rejections,
  declines,
  bans,
  isPending,
  onClickChat,
  onClickFriend,
  onClickReject,
  onClickAccept,
  onClickDecline,
  onClickCancelRequest,
  onClickRemoveBan,
  onRequestFriendship
}) => (
  <div className="page list-container">
    {friends.length === 0 &&
      <div>
        You have no friends. What a sad, sorry, soul you are.
        <br />
        <br />
      </div>
    }

    {!isPending && friends.length > 0 &&
      <div>
        <h2>Your Friends</h2>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              <span
                  className="friend-name"
                  onClick={e => onClickFriend(userId, friend.id)}>
                {friend.username}
              </span>
              <button onClick={e => onClickChat(userId, friend.id)}>Chat</button>
              <button onClick={e => onClickReject(userId, friend.id)}>reject</button>
            </li>
          ))}
        </ul>
      </div>
    }

    {pending.length > 0 &&
      <div>
        <h2>Pending requests awaiting your approval</h2>
        <ul>
          {pending.map((friend, index) => (
            <li key={friend.id + index}>
              <span className="friend-name">{friend.username}</span>
              <button onClick={e => onClickDecline(userId, friend.id)}>decline</button>
              <button onClick={e => onClickAccept(userId, friend.id)}>accept</button>
            </li>
          ))}
        </ul>
      </div>
    }

    {requests.length > 0 &&
      <div>
        <h2>Your requests to others</h2>
        <ul>
          {requests.map((friend, index) => (
            <li key={friend.id + index}>
              <span className="friend-name">{friend.username}</span>
              <button onClick={e => onClickCancelRequest(userId, friend.id)}>cancel</button>
            </li>
          ))}
        </ul>
      </div>
    }

    {rejections.length > 0 &&
      <div>
        <h2>Rejections</h2>
        <ul>
          {rejections.map((friend, index) => (
            <li key={friend.id + index}>
              <span className="friend-name">{friend.username}</span>
            </li>
          ))}
        </ul>
      </div>
    }

    {declines.length > 0 &&
      <div>
        <h2>Declines</h2>
        <ul>
          {declines.map((friend, index) => (
            <li key={friend.id + index}>
              <span className="friend-name">{friend.username}</span>
            </li>
          ))}
        </ul>
      </div>
    }

    {bans.length > 0 &&
      <div>
        <h2>Bans</h2>
        <ul>
          {bans.map((friend, index) => (
            <li key={friend.id + index}>
              <span className="friend-name">{friend.username}</span>
              <button onClick={e => onClickRemoveBan(userId, friend.id)}>undo</button>
            </li>
          ))}
        </ul>
      </div>
    }

    <AddFriend onRequestFriendship={username => onRequestFriendship(userId, username) } />
  </div>
)

FriendControls.propTypes = {
  userId: PropTypes.string,
  friends: PropTypes.array,
  requests: PropTypes.array,
  pending: PropTypes.array,
  rejections: PropTypes.array,
  declines: PropTypes.array,
  bans: PropTypes.array,
  isPending: PropTypes.bool,
  onClickChat: PropTypes.func,
  onClickFriend: PropTypes.func,
  onClickReject: PropTypes.func,
  onClickAccept: PropTypes.func,
  onClickDecline: PropTypes.func,
  onClickCancelRequest: PropTypes.func,
  onClickRemoveBan: PropTypes.func,
  onRequestFriendship: PropTypes.func
}

export default FriendControls
