import React, { PropTypes } from 'react';

const Flash = ({
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
    <div className={`flash ${ status }`}>
      <span className={`flash-icon ${ status }`}></span>
      <span className="flash-text">
        <ul className="flash-list">
          {messages && messages.map((message, i) => (
            <li key={i}>{String(message)}</li>
          ))}
        </ul>
      </span>
      <button
          className="flash-close-button ion-close-circled"
          onClick={onClickClose}>
      </button>
    </div>
  );
};

Flash.propTypes = {
  status: PropTypes.string,
  messages: PropTypes.array,
  isVisible: PropTypes.bool,
  isFetchingMessages: PropTypes.bool,
  isFetchingUsers: PropTypes.bool,
  onClickClose: PropTypes.func
};

export default Flash;
