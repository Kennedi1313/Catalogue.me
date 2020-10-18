import React, { useContext } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import landingImg from '../../assets/images/catalogo.jpg';
import StoreContext from '../../components/Store/Context';


function Landing() {
    const { token } = useContext(StoreContext);
    return (
        <div id="page-landing">
            <div className="logo-container">
                <a href="/" className="logo">Catalogue.me</a>
                <div className="nav">
                    <Link to={token ? "/dashboard/inicio" : "/login"}>{token ? "Dashboard" : "Login"}</Link>
                    {token ? "" : <Link to="/user-form">Cadastro</Link>}
                </div>
            </div>
            <div id="page-landing-content">
                <div className="landing">
                    <h2 className="subtitle">O catálogo virtual perfeito para o seu comércio.</h2>
                    <br/>
                    <div className="buttons-area">
                        <p className="text" id="text3">
                            Entre agora mesmo na plataforma, basta cadastrar seus produtos.
                        </p>
                        <div className="buttons-container">
                            <Link to="/user-form" className="products">
                                Cadastre o seu catálogo virtual agora clicando aqui.
                            </Link>
                        </div>
                    </div>
                
                    <p className="text" id="text1">
                        Com o Catalogue.me você cadastra seus itens em um catálogo virtual e envia para seus clientes, com a facilidade de um clique!
                    </p>
                    <div className="landing-image">
                        <img src={landingImg} className="hero-image" alt="landing"/>
                    </div>
                    <p className="text" id="text2">
                        Cadastre seu comércio agora mesmo e comece a usar o Catalogue.me! É a praticidade que você estava procurando. 
                    </p>
                    
                </div> 
            </div>
            
            <div className="footer-container">
                <div className="conections">
                    <p>Conecte-se a nós</p>
                    <a href="https://www.instagram.com/rodkennedi/">Instagram</a>
                    <a href="https://github.com/kennedi1313">GitHub</a>
                    <a href="https://www.linkedin.com/in/kennedi-rodrigues-b051ab176/">LinkedIn</a>
                </div>
                <div className="suport">
                    <p>Suporte</p>
                    <a href="/">Dúvidas</a>
                    <a href="/">Documentos</a>
                </div>
                <div className="contact">
                    <p>Contato</p>
                    <a href="/">Tel: (84) 998594171</a>
                </div>
            </div>
        </div>
    )
}

export default Landing;