import React, { useContext, useEffect, useState } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import StoreContext from '../../components/Store/Context';
import api from '../../services/api';
import whatsappIcon from '../../assets/images/whatsappIcon.png'
import PageHeader from '../../components/PageHeader';
import capa from '../../assets/images/capa.jpeg';

interface ShopProps {
    shop: {
        name: string,
        bio: string,
        whatsapp: string,
        tag: string,
        logo: string,
        color: string,
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
            <div className="logo-container-main">
                <a href="/" className="logo">Catalogue.me</a>
                <div className="nav">
                    <Link to={token ? "/dashboard/admin/inicio" : "/user/login"}>{token ? "Loja" : "Entrar"}</Link>
                    {token ? "" : <Link className="cadastro" to="/user/form">Criar conta gratuita</Link>}
                </div>
            </div>
            <div id="page-landing-content">
                <div className="landing">
                   
                    <h2 className="subtitle">Crie seu catálogo virtual ou loja online.</h2>
                    
                    <p id="text3">
                        Modernize sua loja virtual com o nosso catálogo, não precisa instalar nada! Faça o cadastro gratuito e cadastre seus produtos/serviços..
                    </p>

                    <div className="buttons-area">
                        <div className="buttons-container">
                            <Link to="/user/form" className="products">
                                Cadastre o seu catálogo virtual.
                            </Link>
                        </div>
                    </div>
                    <p className="text" id="text2">
                        Comece a usar o Catalogue.me agora mesmo! É a praticidade que você estava procurando. 
                    </p>
                    
                    <img src={capa} className="capa" alt="capa"/>
                   
                </div> 
                <div className="info-3">
                    <h1>Totalmente integrado com o Whatsapp <br></br> <img src={whatsappIcon} alt="whatsapp"/></h1>
                    <ul>
                        <li>
                            Sem mensagens desnecessárias
                        </li>
                        <li>
                            O cliente é enviado diretamente ao seu Whatsapp
                        </li>
                        <li>
                            Link do produto clicado incluso na mensagem 
                        </li>
                        <li>
                            Mensagem pronta para o cliente usar
                        </li>
                    </ul>
                    <ul>
                        <li>
                            Nenhum dado é salvo durante o processo de compra
                        </li>
                        <li>
                            Nenhuma taxa é cobrada sobre suas vendas
                        </li>
                        <li>
                            A compra é finalizada através do Whatsapp
                        </li>
                        <li>
                            Número de vendas ilimitadas inclusive no plano grátis
                        </li>
                    </ul>


                </div>
                <div className="landing-image">
                    <h1>Lojas que já usam o Catalogueme</h1>
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
                                    <a key={shops.tag} className="shop-card" rel="noopener noreferrer" href={ process.env.REACT_APP_URL+'/'+shops.tag }>
                                   
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
                                                color={shops.color}
                                                logo={ shops.logo && isS3 ? shops.logo : ( shops.logo !== '' ? process.env.REACT_APP_API_URL + logo_url : '')}>
                                            </PageHeader>
                                            
                                        </div>
                                    </a>
                                );
                            })
                            :  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading"/>}
                        </div>
                </div>
                <div className="info-3">
                    <h1>Todo o poder da sua loja na palma da sua mão</h1>
                    <ul>
                        <li>
                            Traga seus clientes para a sua loja virtual
                        </li> 
                        <li>
                            Promova a sua loja nas suas redes sociais compartilhando o seu link exclusivo
                        </li> 
                        <li>
                            Reúna os clientes de todos os lugares em uma loja única, facilitando a administração
                        </li> 
                        <li>
                            Compartilhe sua loja virtual com seus clientes e os deixe por dentro dos seus produtos
                        </li> 
                    </ul>
                </div>
            </div>

            <div className="chamada">
                <h1>Crie sua loja online agora mesmo</h1>
                O que está esperando para se cadastrar? É 100% grátis!
                <div className="buttons-container">
                    <Link to="/user/form" className="products">
                        Cadastre o seu catálogo virtual.
                    </Link>
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