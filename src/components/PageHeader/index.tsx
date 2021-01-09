import React from 'react'
import { Link } from 'react-router-dom';
import './styles.css'

interface PageHeaderProps {
    title: String;
    description?: String;
    logo?: string;
    color?: string;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    const style = {
        backgroundColor: props.color ? props.color : "#2F4F4F"
    }
    return (
        <header className="page-header" style={style}>
            <div className="top-bar-container">
                <Link to="/">
                    Catalogue.me
                </Link>
            </div>
            <div className="header-content">
                <div className="header">
                    
                    {props.logo && <img src={props.logo} alt="logo"/>}
                    <h2><strong>{props.title}</strong></h2>
                    {props.description && <p>{props.description}</p>}
                </div>
                {props.children}
            </div>
        </header>
    )
}

export default PageHeader;