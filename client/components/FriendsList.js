import React, { PropTypes } from 'react';
import AddFriend from './AddFriend'

const UsersList = ({
  userId,
  friends,
  requests,
  pending,
  rejections,
  declines,
  bans,
  isPending,
  onClickFriend,
  onClickReject,
  onClickAccept,
  onClickDecline,
  onClickCancelRequest,
  onClickRemoveBan,
  onRequestFriendship
}) => {
  return (
    <section className="list-container">
      {friends.length === 0 &&
        <div>
          You have no friends. What a sad, sorry, soul you are.
        </div>
      }

      {!isPending && friends.length > 0 &&
        <div>
          <h2>Your Friends</h2>
          <ul>
            {friends.map(user => (
              <li key={user.id}>
                <span className="friend-name">{user.username}</span>
                <button onClick={onClickReject(user.id)}>reject</button>
              </li>
            ))}
          </ul>
        </div>
      }

      {pending.length > 0 &&
        <div>
          <h2>Pending requests awaiting your approval</h2>
          <ul>
            {pending.map((user, index) => (
              <li key={user.id + index}>
                <span className="friend-name">{user.username}</span>
                <button onClick={onClickDecline(user.id)}>decline</button>
                <button onClick={onClickAccept(user.id)}>accept</button>
              </li>
            ))}
          </ul>
        </div>
      }

      {requests.length > 0 &&
        <div>
          <h2>Your requests to others</h2>
          <ul>
            {requests.map((user, index) => (
              <li key={user.id + index}>
                <span className="friend-name">{user.username}</span>
                <button onClick={onClickCancelRequest(user.id)}>cancel</button>
              </li>
            ))}
          </ul>
        </div>
      }

      {rejections.length > 0 &&
        <div>
          <h2>Rejections</h2>
          <ul>
            {rejections.map((user, index) => (
              <li key={user.id + index}>
                <span className="friend-name">{user.username}</span>
              </li>
            ))}
          </ul>
        </div>
      }

      {declines.length > 0 &&
        <div>
          <h2>Declines</h2>
          <ul>
            {declines.map((user, index) => (
              <li key={user.id + index}>
                <span className="friend-name">{user.username}</span>
              </li>
            ))}
          </ul>
        </div>
      }

      {bans.length > 0 &&
        <div>
          <h2>Bans</h2>
          <ul>
            {bans.map((user, index) => (
              <li key={user.id + index}>
                <span className="friend-name">{user.username}</span>
                <button onClick={onClickRemoveBan(user._id)}>undo</button>
              </li>
            ))}
          </ul>
        </div>
      }

      <AddFriend onRequestFriendship={username => onRequestFriendship(userId, username) } />
    </section>
  );
};

UsersList.propTypes = {
  friends: PropTypes.array,
  isPending: PropTypes.bool,
  onClickFriend: PropTypes.func
};

export default UsersList;
