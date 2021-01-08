import React, { useContext, useEffect, useState } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import StoreContext from '../../components/Store/Context';
import api from '../../services/api';
import whatsappIcon from '../../assets/images/whatsappIcon.png'
import PageHeader from '../../components/PageHeader';

interface ShopProps {
    shop: {
        name: string,
        bio: string,
        whatsapp: string,
        tag: string,
        logo: string,
    }
}

function Landing() {
    const { token } = useContext(StoreContext);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function findAllShops() {
            api.get('/shops')
            .then((response) => {
                setShops(response.data);
            })
            setLoading(false);
        }

        findAllShops()
    }, []);
    return (
        <div id="page-landing">
            <div className="logo-container">
                <a href="/" className="logo">Catalogue.me</a>
                <div className="nav">
                    <Link to={token ? "/dashboard/admin/inicio" : "/user/login"}>{token ? "Loja" : "Login"}</Link>
                    {token ? "" : <Link to="/user/form">Cadastro</Link>}
                </div>
            </div>
            <div id="page-landing-content">
                <div className="landing">
                    <h2 className="subtitle">Crie seu catálogo virtual online e 100% grátis em menos de 5 minutos.</h2>
                    
                    <p id="text3">
                        Modernize sua loja virtual com o nosso catálogo, não precisa instalar nada! Faça login, cadastre seus produtos/serviços e compartilhe com seus clientes em tempo real.
                    </p>
                    
                    
                    <div className="buttons-area">
                        <div className="buttons-container">
                            <Link to="/user/form" className="products">
                                Cadastre o seu catálogo virtual agora clicando aqui.
                            </Link>
                        </div>
                    </div>
                
                    
                    <div className="landing-image">
                    <p className="text" id="text1">
                        Veja abaixo algumas lojas que já aderiram ao Catalogue.me
                    </p>
                    <h2>Lojas associadas</h2>
                        <div className="landing-shops">
                            
                            {!loading ? 
                            shops.map((shops: ShopProps["shop"]) => {
                                var logo_url = ''
                                var logo_s3 = 'https://upload-catalogueme.'
                                var isS3 = false
                                
                                if(shops.logo) {
                                    console.log(shops.logo)
                                    if(shops.logo.match(logo_s3)){
                                        isS3 = true
                                    } else {
                                        logo_url = shops.logo.substring(6, shops.logo.length)
                                    }
                                }
                                return(
                                    <div key={shops.tag} className="shop-card">
                                        <div className="info">
                                            <PageHeader 
                                                title={
                                                    shops.name.length > 25
                                                    ?
                                                    shops.name.substring(0, 25) + '...'
                                                    :
                                                    shops.name
                                                } 
                                                description={
                                                    shops.bio.length > 45
                                                    ?
                                                    shops.bio.substring(0, 45) + '...'
                                                    :
                                                    shops.bio
                                                } 
                                                logo={ shops.logo && isS3 ? shops.logo : ( shops.logo !== '' ? process.env.REACT_APP_API_URL + logo_url : '')}>
                                            </PageHeader>
                                        </div>
                                        <div className="buttons">
                                            <a rel="noopener noreferrer" href={ process.env.REACT_APP_URL+'/'+shops.tag }>
                                            
                                                Visitar a loja
                                            </a>
                                            <a target="_blank" rel="noopener noreferrer" href={'https://wa.me/+55' + shops.whatsapp }>
                                                <img src={whatsappIcon} alt="whatsapp"/>
                                                Entrar em contato
                                            </a>

                                        </div>
                                    </div>
                                );
                            })
                            :  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading"/>}
                        </div>
                    </div>
                    <p className="text" id="text2">
                        Comece a usar o Catalogue.me agora mesmo! É a praticidade que você estava procurando. 
                    </p>
                    
                </div> 
                
            </div>
            
            <div className="footer-container">
                <div className="conections">
                    <p>Conexões</p>
                    <a href="https://github.com/kennedi1313">GitHub</a>
                    <a href="https://www.linkedin.com/in/kennedi-rodrigues-b051ab176/">LinkedIn</a>
                </div>
                <div className="contact">
                    <p>Contato</p>
                    <a href="/">Tel: (84) 998594171</a>
                    <a href="https://www.instagram.com/rodkennedi/">Instagram</a>
                </div>
            </div>
        </div>
    )
}

export default Landing;