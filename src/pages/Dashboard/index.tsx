import React, { useContext, useState } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import AddItem from './AddItem copy'
import ShopList from './ShopList copy'
import StoreContext from '../../components/Store/Context'
import api from '../../services/api'

function deslogar() {
    localStorage.removeItem('token')
}

function Dashboard() {
    const [page, setPage] = useState('');
    const { user } = useContext(StoreContext)
    const [shop_name, setShopName] = useState('');
    const [items, setItems] = useState([{}] as any);
    
    async function searchAllItems(){
        console.log(user.shop_id)
        const item = await api.get('/items', {
            params: {
                shop_id: user.shop_id,
            }
        })
        
        setItems(item.data)

        console.log(user.shop_id)
        const shop = await api.get('/shopbyid', {
            params: {
                shop_id: user.shop_id,
            }
        })

        setShopName(shop.data[0].name)
    }

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
                   
                    <Link to="#" onClick={()=>{setPage('')}}>Inicio</Link>
                    <Link to="#" onClick={()=>{
                                searchAllItems().then(
                                    () => setPage('shop')
                                )
                            }
                        }
                    >Minha Loja</Link>
                    <Link to="#" onClick={()=>{setPage('add-item')}}>Adicionar Itens</Link>
                    <Link to="#">Meu Perfil</Link>
                    <Link to="#">Duvidas?</Link>
                    
                </nav>
                <div id="page-dashboard-content">
                    {
                        page === 'add-item' ? <AddItem></AddItem> 
                        : page === 'shop' ? 
                        
                        <ShopList shop_id={user.shop_id} item={items} shop_name={shop_name}></ShopList> 
                        : 
                        <fieldset className="link-shop">
                            <legend><h2>Copie esse link e envie para os seus clientes!</h2></legend>
                            <p > <p>{process.env.REACT_APP_API_URL+'/shop/'+user.shop_id}</p> </p>
                        </fieldset>
                    }
                </div>
            </main>
            
        </div>
    )
}

export default Dashboard;