import React, { useContext, useState } from 'react'
import './styles.css'
import { Link, useParams } from 'react-router-dom'
import AddItem from './AddItem copy'
import ShopList from './ShopList copy'
import StoreContext from '../../components/Store/Context'
import api from '../../services/api'

function deslogar() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

interface ParamProps {
    page: string;
}



function Dashboard() {
    const { page } = useParams<ParamProps>();
    const { user } = useContext(StoreContext)

    return (
        <div id="page-dashboard">
            <div className="logo-container">
                <a href="/" className="logo">Catalogue.me</a>
                <div className="nav">
                    <a onClick={deslogar} href="/">Deslogar</a>
                </div>
            </div>
            <main>
                <input type="checkbox" id="chk"/>
                <label htmlFor="chk" id="menu-icon" className="menu-icon">&#9776;</label>
                <nav id="side-menu" className="buttons-side-container">
                   
                    <Link to="/dashboard/inicio">Inicio</Link>
                    <Link to="/dashboard/shop">Minha Loja</Link>
                    <Link to="/dashboard/add-item">Adicionar Itens</Link>
                    <Link to="#">Meu Perfil</Link>
                    <Link to="#">Duvidas?</Link>
                    
                </nav>
                <div id="page-dashboard-content">
                    {
                        page === 'add-item' ? 
                            <AddItem></AddItem> 
                        : page === 'shop' ? 
                            <ShopList 
                                shop_id={user.shop_id} 
                            />
                        : page === 'inicio' ?
                            <fieldset className="link-shop">
                                <legend><h2>Copie esse link e envie para os seus clientes!</h2></legend>
                                <input type="text" value={process.env.REACT_APP_URL+'/shop/'+user.shop_id}></input>
                            </fieldset>
                        : ''
                    }
                </div>
            </main>
            
        </div>
    )
}

export default Dashboard;