import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">🔍</div>
                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">Page Not Found</h2>
                <p className="not-found-text">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="btn btn-primary btn-lg">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound
