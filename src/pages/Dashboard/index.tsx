import React, { useContext, useRef } from 'react'
import './styles.css'
import { Link, useParams } from 'react-router-dom'
import AddItem from './AddItem-Dashboard'
import ShopList from './ShopList-Dashboard'
import ShopListInativos from './Indisponiveis-Dashboard'
import StoreContext from '../../components/Store/Context'
import ItemDescription from './ItemDescription-Dashboard'
import AddAvatar from './AddAvatar-Dashboard'

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
    const textAreaRef = useRef(null);
    function copyToClipboard(e) {
        //@ts-ignore
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        alert("Copiado com sucesso! Agora compartilhe esse link com seus clientes.");
      };

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

                </nav>
                <div id="page-dashboard-content">
                    {
                        page === 'add-item' ? 
                            <AddItem></AddItem> 
                        : page === 'shop' ? 
                            <ShopList 
                                shop_id={user.shop_id} 
                            />
                        : page === 'itens-inativos' ? 
                            <ShopListInativos 
                                shop_id={user.shop_id} 
                            />
                        : page === 'item' ? 
                            <ItemDescription />
                        : page === 'add-avatar' ? 
                            <AddAvatar />
                        : page === 'inicio' ?
                            <fieldset className="link-shop">
                                <legend><h2>Copie esse link e envie para os seus clientes!</h2></legend>
                                <textarea ref={textAreaRef} id="url" readOnly value={process.env.REACT_APP_URL+'/shop/'+user.shop_id}></textarea>
                                <button onClick={copyToClipboard}>Copiar o link da sua Loja Virtual</button> 
                                
                            </fieldset>
                        : ''
                    }
                </div>
            </main>
            
        </div>
    )
}

export default Dashboard;