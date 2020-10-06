import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

import whatsappIcon from '../../assets/images/whatsappIcon.png'
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

import './styles.css'

interface ParamProps {
    shop_id: string,
    item_id: string,
}

function ItemDescription(){
    const { shop_id, item_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('')
    const [info, setInfo] = useState('')
    const [price, setPrice] = useState('')

    window.onload = getItem;
    async function getItem() {
        const res = await api.get('/itembyid', { 
            params: { item_id } 
        })

        setName(res.data[0].name)
        setAvatar(res.data[0].avatar)
        setInfo(res.data[0].info)
        setPrice(res.data[0].price)

        console.log(shop_id)
        const shop = await api.get('/shopbyid', {
            params: {
                shop_id,
            }
        })

        setShopName(shop.data[0].name)
        
    }
    var avatar_url = ''
        var default_url = '/uploads/default.png'
    
        if(avatar) {
            avatar_url = avatar.substring(6, avatar.length)
        }
    return (
        
        
        <div id="item-description">
            <PageHeader title={shop_name}>
                <a className="button-back" href={"/shop/" + shop_id}>
                    Voltar à loja
                </a>
            </PageHeader>
            <article className="item">
                <header>
                    <img src={ avatar !== '' ? 'http://localhost:3333/' + avatar_url : 'http://localhost:3333/' + default_url} alt="ps5"/>
                    <div className="info">
                        <h2>{name}</h2>
                        <p>
                            <strong>Descrição</strong>
                            <p className="description">
                                {info}
                            </p>
                        </p>
                        
                        <footer>
                            <p>
                                Preço: 
                                <strong>R$ {price}</strong>
                            </p>
                            
                            <a target="_blank" rel="noopener noreferrer" href="https://wa.me/5584998594171">
                                <img src={whatsappIcon} alt="whatsapp"/>
                                Entrar em contato
                            </a>
                            
                        </footer>
                    </div>
                </header>
                
            </article>
        </div>
    )
}

export default ItemDescription;