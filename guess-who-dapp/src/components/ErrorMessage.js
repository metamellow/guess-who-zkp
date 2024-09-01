import React, { useState } from 'react';

function ErrorMessage({ message, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={handleDismiss} className="error-dismiss-button">
        &times;
      </button>
    </div>
  );
}

export default ErrorMessage;