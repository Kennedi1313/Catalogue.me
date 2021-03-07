import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles.css'
import { Link, useParams } from 'react-router-dom'
import AddItem from './AddItem-Dashboard'
import ShopList from './ShopList-Dashboard'
import StoreContext from '../../components/Store/Context'
import ItemDescription from './ItemDescription-Dashboard'
import EditShopForm from './UserForm-Dashboard'
import AddAvatar from './AddAvatar-Dashboard'
import api from '../../services/api'

function deslogar() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

interface ParamProps {
    page: string;
}

interface ParamLabel {
    value: string,
    label: string,
}

function Dashboard() {
    const { page } = useParams<ParamProps>();
    const { user } = useContext(StoreContext)
    const [shopTag, setShopTag] = useState('')
    const textAreaRef = useRef(null);
    const [labelCategories, setLabelCategories] = useState<ParamLabel[]>([])

    function copyToClipboard(e) {
        //@ts-ignore
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        alert("Copiado com sucesso! Agora compartilhe esse link com seus clientes.");
    };

    useEffect(() => {
        async function searchTag(){
            
            const shop = await api.get('/shopbyid', {
                params: {
                    shop_id: user.shop_id,
                }
            })
            setShopTag(shop.data[0].tag)

        }
        searchTag();
    },[user.shop_id]);

    function getCategories() { 
        setLabelCategories([])

        api.get('/shops-categories', {
            params: {
                shop_id: user.shop_id
            }
        }).then((categories) => {
            let newlabel = new Array();
            
            categories.data.map(({category}) => {
                newlabel.push({value: category, label: category})
            })

            setLabelCategories(newlabel)
        })
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
                   
                    <Link style={page === 'inicio' ? { color: '#FF6347', borderTop: '2px solid #FF6347' } : undefined} className="link" to="/dashboard/admin/inicio">Inicio</Link>
                    <Link style={page === 'itens-ativos' || page === 'shop' || page === 'item' ? { color: '#FF6347', borderTop: '2px solid #FF6347' } : undefined} className="link" to="/dashboard/admin/itens-ativos">Minha Loja</Link>
                    <Link style={page === 'add-item' ? { color: '#FF6347', borderTop: '2px solid #FF6347' } : undefined} className="link" onClick={() => getCategories()} to="/dashboard/admin/add-item">Adicionar Itens</Link>

                </nav>
                <div id="page-dashboard-content">
                    {
                        page === 'add-item' ? 
                            <AddItem categories={labelCategories}></AddItem> 
                        : page === 'itens-ativos' ? 
                            <ShopList 
                                shop_id={user.shop_id} 
                            />
                        : page === 'shop' ? 
                            <EditShopForm
                                shop_id={user.shop_id}
                            />
                        : page === 'item' ? 
                            <ItemDescription />
                        : page === 'add-avatar' ? 
                            <AddAvatar />
                        : page === 'inicio' ?
                            <fieldset className="link-shop">
                                <p>Bem vindo a area administrativa da sua loja. Gerencie seus itens no menu e compartilhe sua loja!</p>
                                <div className="share">
                                    <h2>Copie esse link e envie para os seus clientes</h2>
                                    <div className="link">
                                        <textarea draggable="false" ref={textAreaRef} id="url" readOnly value={process.env.REACT_APP_URL+'/'+shopTag}></textarea>
                                        <a href="/dashboard/admin/inicio" onClick={copyToClipboard}>Copiar</a> 
                                    </div>
                                </div>
                                
                            </fieldset>
                        : ''
                    }
                </div>
            </main>
            
        </div>
    )
}

export default Dashboard;