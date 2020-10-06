import React from 'react'
import { Link } from 'react-router-dom';
import './styles.css'

interface PageHeaderProps {
    title: String;
    description?: String;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    return (
        <header className="page-header">
            <div className="top-bar-container">
                <Link to="/">
                    Catalogue.me
                </Link>
            </div>
            <div className="header-content">
                <strong>{props.title}{props.children}</strong>
                {props.description && <p>{props.description}</p>}
            </div>
        </header>
    )
}

export default PageHeader;