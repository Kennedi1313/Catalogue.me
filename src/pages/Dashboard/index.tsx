import React, { useContext, useEffect, useRef, useState } from 'react'
import './styles.css'
import { Link, useParams } from 'react-router-dom'
import AddItem from './AddItem-Dashboard'
import ShopList from './ShopList-Dashboard'
import ShopListInativos from './Indisponiveis-Dashboard'
import StoreContext from '../../components/Store/Context'
import ItemDescription from './ItemDescription-Dashboard'
import EditShopForm from './UserForm-Dashboard'
import AddAvatar from './AddAvatar-Dashboard'
import api from '../../services/api'
import QRCode from 'qrcode.react'

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
    const [shopTag, setShopTag] = useState('')
    const textAreaRef = useRef(null);
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

    const downloadQR = () => {
        const canvas = document.getElementById("qrcode") as HTMLCanvasElement;
        /*@ts-ignore*/
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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
                   
                    <Link className="link" to="/dashboard/admin/inicio">Inicio</Link>
                    <Link className="link" to="/dashboard/admin/itens-ativos">Minha Loja</Link>
                    <Link className="link" to="/dashboard/admin/add-item">Adicionar Itens</Link>

                </nav>
                <div id="page-dashboard-content">
                    {
                        page === 'add-item' ? 
                            <AddItem></AddItem> 
                        : page === 'itens-ativos' ? 
                            <ShopList 
                                shop_id={user.shop_id} 
                            />
                        : page === 'shop' ? 
                            <EditShopForm
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
                                <legend>Bem vindo a area administrativa da sua loja! Você possui essas duas formas abaixo para compartilhar sua loja com seus clientes, mas antes gerencie seus itens no menu.</legend>
                                <div className="share">
                                    <div className="link">
                                        <h2>Copie esse link e envie para os seus clientes</h2>
                                        <textarea ref={textAreaRef} id="url" readOnly value={process.env.REACT_APP_URL+'/'+shopTag}></textarea>
                                        <a href="/dashboard/admin/inicio" onClick={copyToClipboard}>Copiar o link da sua Loja Virtual</a> 
                                    </div>
                                    
                                    <div className="qrcode">
                                        <h2>Ou compartilhe o seu QRCode</h2>
                                        <QRCode
                                            id="qrcode"
                                            value={process.env.REACT_APP_URL+'/'+shopTag}
                                            size={290}
                                            level={"H"}
                                            includeMargin={true}
                                        />
                                        <br/>
                                        <a href="/dashboard/admin/inicio" onClick={downloadQR}> Download QR </a>
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