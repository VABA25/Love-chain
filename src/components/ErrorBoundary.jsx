import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes enviar el error a un servicio externo aquí
    console.error("ErrorBoundary atrapó un error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#ffe0e0',
          color: '#b71c1c',
          padding: '2rem',
          borderRadius: '10px',
          margin: '2rem auto',
          maxWidth: 600,
          textAlign: 'center',
          border: '2px solid #ffb2b2'
        }}>
          <h2>¡Algo salió mal!</h2>
          <p>Ocurrió un error inesperado en la aplicación.</p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#b71c1c', background: '#fff0f0', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
