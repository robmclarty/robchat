import React, { PropTypes } from 'react';

const FlashMessenger = ({
  status,
  messages,
  isVisible,
  isFetchingAssignments,
  isFetchingLocations,
  isFetchingUsers,
  onClickClose
}) => {
  if (!isVisible) return false;

  return (
    <div className={`flash-messenger ${ status }`}>
      <span className={`flash-message-icon ${ status }`}></span>
      <div className="flash-message-text">
        <ul className="flash-message-list">
          {messages && messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </div>
      <button
          className="flash-messenger-close-button ion-close-circled"
          onClick={onClickClose}>
      </button>
    </div>
  );
};

FlashMessenger.propTypes = {
  status: PropTypes.string,
  messages: PropTypes.array,
  isVisible: PropTypes.bool,
  isFetchingMessages: PropTypes.bool,
  isFetchingUsers: PropTypes.bool,
  onClickClose: PropTypes.func
};

export default FlashMessenger;
