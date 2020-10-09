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
                <h2><strong>{props.title}</strong></h2>
                {props.children}
                {props.description && <p>{props.description}</p>}
            </div>
        </header>
    )
}

export default PageHeader;