import React, { PropTypes } from 'react';
import AddFriend from './AddFriend'

const UsersList = ({
  userId,
  friends,
  isPending,
  onClickFriend,
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
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>{friend.username}</li>
          ))}
        </ul>
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
