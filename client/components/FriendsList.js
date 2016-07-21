import React, { PropTypes } from 'react';
import AddFriend from './AddFriend'

const UsersList = ({
  userId,
  friends,
  friendRequests,
  isPending,
  onClickFriend,
  onClickReject,
  onClickAccept,
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
          <h2>Friends</h2>
          <ul>
            {friends.map(friend => (
              <li key={friend.id}>{friend.username}</li>
            ))}
          </ul>
        </div>
      }

      {friendRequests.length > 0 &&
        <div>
          <h2>Pending Friend Requests</h2>
          <ul>
            {friendRequests.map((requester, index) => (
              <li key={requester.id + index}>
                {requester.username}
                <button onClick={onClickReject(requester.id)}>reject</button>
                <button onClick={onClickAccept(requester.id)}>accept</button>
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
