import { Component } from 'react';

// Last line of defence: if something unexpected breaks while rendering, show a friendly page
// with a way forward instead of a blank white screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('[GiftNest] Something went wrong while showing this page:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="container" style={{ padding: '96px 0' }}>
        <div className="shop-empty">
          <h2>Something went wrong</h2>
          <p className="muted">We could not show this page. Please try again, or head back to the home page.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn" type="button" onClick={() => window.location.reload()}>Reload page</button>
            <a className="btn btn--ghost" href="/">Go to home</a>
          </div>
        </div>
      </div>
    );
  }
}
