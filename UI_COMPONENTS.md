# LoveChain UI Components

## Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --love-pink: #ff6b9d;
  --love-purple: #8b5cf6;
  --love-gradient: linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%);
  
  /* Secondary Colors */
  --warm-white: #fef7ff;
  --soft-gray: #f3f4f6;
  --dark-gray: #374151;
  
  /* Status Colors */
  --success-green: #10b981;
  --warning-amber: #f59e0b;
  --error-red: #ef4444;
  --info-blue: #3b82f6;
}
```

### Typography
```css
/* Primary Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Heading Scales */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### Spacing System
```css
/* Consistent spacing scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## Component Library

### Button Components

#### Primary Button
```jsx
const PrimaryButton = ({ children, onClick, disabled, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="primary-button"
    style={{
      background: 'var(--love-gradient)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: 'var(--text-base)',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.6 : 1,
      transform: loading ? 'scale(0.98)' : 'scale(1)'
    }}
  >
    {loading ? '⏳ Loading...' : children}
  </button>
);
```

#### Secondary Button
```jsx
const SecondaryButton = ({ children, onClick, variant = 'outline' }) => (
  <button
    onClick={onClick}
    className="secondary-button"
    style={{
      background: variant === 'ghost' ? 'transparent' : 'white',
      color: 'var(--love-pink)',
      border: `2px solid ${variant === 'ghost' ? 'transparent' : 'var(--love-pink)'}`,
      borderRadius: '12px',
      padding: '10px 20px',
      fontSize: 'var(--text-base)',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    {children}
  </button>
);
```

### Card Components

#### Profile Card
```jsx
const ProfileCard = ({ user, onLike, onPass }) => (
  <div className="profile-card" style={{
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    width: '320px',
    height: '480px'
  }}>
    <div className="profile-image" style={{
      backgroundImage: `url(${user.profileImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '60%',
      position: 'relative'
    }}>
      <div className="gradient-overlay" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
      }} />
      <div className="profile-info" style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white'
      }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>
          {user.displayName}, {user.age}
        </h3>
        <p style={{ margin: '4px 0', fontSize: 'var(--text-sm)', opacity: 0.9 }}>
          📍 {user.location || '5km away'}
        </p>
      </div>
    </div>
    
    <div className="profile-content" style={{ padding: '20px' }}>
      <p style={{ 
        fontSize: 'var(--text-sm)', 
        color: 'var(--dark-gray)',
        lineHeight: 1.5,
        margin: '0 0 16px 0'
      }}>
        {user.bio}
      </p>
      
      <div className="interests" style={{ marginBottom: '20px' }}>
        {user.interests?.slice(0, 3).map(interest => (
          <span key={interest} style={{
            display: 'inline-block',
            background: 'var(--love-gradient)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: 'var(--text-xs)',
            marginRight: '8px',
            marginBottom: '4px'
          }}>
            {interest}
          </span>
        ))}
      </div>
      
      <div className="action-buttons" style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <button onClick={() => onPass(user.id)} style={{
          background: '#fee2e2',
          color: '#dc2626',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '20px',
          cursor: 'pointer'
        }}>
          ❌
        </button>
        <button onClick={() => onLike(user.id)} style={{
          background: 'var(--love-gradient)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '20px',
          cursor: 'pointer'
        }}>
          💖
        </button>
      </div>
    </div>
  </div>
);
```

### Input Components

#### Text Input
```jsx
const TextInput = ({ label, value, onChange, placeholder, error }) => (
  <div className="input-group" style={{ marginBottom: '20px' }}>
    {label && (
      <label style={{
        display: 'block',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        color: 'var(--dark-gray)',
        marginBottom: '8px'
      }}>
        {label}
      </label>
    )}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${error ? 'var(--error-red)' : '#e5e7eb'}`,
        borderRadius: '12px',
        fontSize: 'var(--text-base)',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        ':focus': {
          borderColor: 'var(--love-pink)'
        }
      }}
    />
    {error && (
      <p style={{
        color: 'var(--error-red)',
        fontSize: 'var(--text-xs)',
        marginTop: '4px',
        margin: 0
      }}>
        {error}
      </p>
    )}
  </div>
);
```

### Modal Components

#### Match Modal
```jsx
const MatchModal = ({ isOpen, onClose, matchedUser }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        animation: 'modalSlideIn 0.3s ease'
      }}>
        <div className="celebration-icon" style={{
          fontSize: '80px',
          marginBottom: '20px',
          animation: 'bounce 0.6s ease infinite alternate'
        }}>
          🎉
        </div>
        
        <h2 style={{
          background: 'var(--love-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 'var(--text-3xl)',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          ¡Es un Match!
        </h2>
        
        <p style={{
          color: 'var(--dark-gray)',
          fontSize: 'var(--text-base)',
          marginBottom: '32px'
        }}>
          A ti y a {matchedUser.displayName} se gustaron mutuamente
        </p>
        
        <div className="modal-actions" style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          <SecondaryButton onClick={onClose}>
            Seguir viendo
          </SecondaryButton>
          <PrimaryButton onClick={() => {/* Navigate to chat */}}>
            Enviar mensaje
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
```

## Animation Library

### CSS Animations
```css
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}

@keyframes modalSlideIn {
  0% { 
    opacity: 0; 
    transform: translateY(20px) scale(0.9); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes swipeRight {
  0% { 
    transform: translateX(0) rotate(0deg); 
    opacity: 1; 
  }
  100% { 
    transform: translateX(100px) rotate(15deg); 
    opacity: 0; 
  }
}

@keyframes swipeLeft {
  0% { 
    transform: translateX(0) rotate(0deg); 
    opacity: 1; 
  }
  100% { 
    transform: translateX(-100px) rotate(-15deg); 
    opacity: 0; 
  }
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base: Mobile (320px+) */

/* Tablet */
@media (min-width: 768px) {
  .profile-card {
    width: 360px;
    height: 520px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

## Accessibility Features

### Focus Management
```css
button:focus-visible {
  outline: 2px solid var(--love-pink);
  outline-offset: 2px;
}

input:focus {
  border-color: var(--love-pink);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}
```

### Screen Reader Support
```jsx
// Example with proper ARIA labels
<button 
  aria-label={`Like ${user.displayName}'s profile`}
  onClick={() => onLike(user.id)}
>
  💖
</button>
```

## Performance Optimizations

### Image Loading
```jsx
const OptimizedImage = ({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    style={{
      objectFit: 'cover',
      transition: 'opacity 0.3s ease'
    }}
    {...props}
  />
);
```

### Component Memoization
```jsx
import { memo } from 'react';

const ProfileCard = memo(({ user, onLike, onPass }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id;
});
```