import React from 'react'
import { Link } from 'react-router-dom';
import './styles.css'

interface PageHeaderProps {
    title: String;
    description?: String;
    logo?: string;
    color?: string;
    colorText?: string;
    landing?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    const style = {
        header: {
            backgroundColor: props.color ? props.color : "white",
        },
        text: {
            color: props.colorText ? props.colorText : "black",
        }
    }
    return (
        <header className="page-header" style={style.header}>
            
            <div className="top-bar-container">
                {!props.landing &&
                    <Link style={style.text} to="/">
                        Catalogue.me
                    </Link>
                }
            </div>
            
            <div className="header-content" style={style.text}>
                <div className="header">
                    
                    {props.logo && <img src={props.logo} alt="logo"/>}
                    <h2 style={style.text}><strong>{props.title}</strong></h2>
                    {props.description && <p style={style.text}>{props.description}</p>}
                </div>
                {props.children}
            </div>
        </header>
    )
}

export default PageHeader;