import React from 'react';

const SubscriptionRequired: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#e74c3c', marginBottom: '20px' }}>
          Subscription Required
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '30px', color: '#555' }}>
          Please verify your subscription to continue using this service.
        </p>
        <button
          onClick={() => window.location.href = '/subscription'}
          style={{
            padding: '12px 30px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Verify Subscription
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 30px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default SubscriptionRequired;