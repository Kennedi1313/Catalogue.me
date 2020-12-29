import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import whatsappIcon from '../../assets/images/whatsappIcon.png'
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

import { useContext } from 'react'

import './styles.css'
import {Carousel} from 'react-bootstrap'
import StoreContext from '../../components/Store/Context';

interface ParamProps {
    shop_id: string,
    item_id: string,
}

function ItemDescription(){
    const { shop_id, item_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState([
        {avatar: "string"}
    ])
    const [info, setInfo] = useState('')
    const [price, setPrice] = useState('')
    const [whatsapp, setWhatsapp] = useState('')

    const { user } = useContext(StoreContext)

    useEffect(() => {
        async function getItem() {
            const res = await api.get('/itembyid', { 
                params: { item_id } 
            })
    
            setName(res.data[0].name)
            setInfo(res.data[0].info)
            setPrice(res.data[0].price)
    
            const avatarData = await api.get('/itemavatarbyid', {
                params: {item_id}
            })
            setAvatar(avatarData.data.itemsAvatar)
    
            const shop = await api.get('/shopbyid', {
                params: {
                    shop_id,
                }
            })
    
            setShopName(shop.data[0].name)
            setWhatsapp(shop.data[0].whatsapp)
            console.log(whatsapp)
        }
        getItem();
    }, [item_id, shop_id, whatsapp]);
    

    var avatar_url = ''
    var default_url = '/uploads/default.png'
    var avatar_s3 = 'https://upload-catalogueme.'
    var isS3 = false
    
    avatar.forEach(({avatar})=> {
        
        if(avatar.substring(0, avatar_s3.length) === avatar_s3){
            isS3 = true
        } else {
            avatar_url = avatar.substring(6, avatar.length)
        }
        
    });
    return (
        <div id="item-description">
            <PageHeader title={shop_name}>
                <Link className="button-back" to={!!user ? "/dashboard/shop/" : "/shop/" + shop_id}>
                    Voltar à loja
                </Link>
            </PageHeader>
            <article className="item">
                <header>
                <Carousel pause="hover" fade={true} interval={5000} keyboard={true}>
                    {avatar.map(({avatar}) => {
                        return (<Carousel.Item key={avatar} className="carousel-item-dashboard">
                                    <img src={ isS3 ? avatar : ( avatar !== '' ? process.env.REACT_APP_API_URL + avatar_url : process.env.REACT_APP_API_URL + default_url)} alt="avatar"/>  
                                </Carousel.Item>)
                    }) }
                    
                </Carousel>
                    <div className="info">
                        <h2>{name}</h2>
                        
                            <strong>Descrição</strong>
                            <p className="description">
                                {info}
                            </p>
                        
                        
                        <footer>
                            <p>
                                Preço: 
                                <strong>R$ {price}</strong>
                            </p>
                            
                            <a target="_blank" rel="noopener noreferrer" href={'https://wa.me/55' + whatsapp + '/?text=Olá%21%20Tenho%20interesse%20nesse%20item%20' +  process.env.REACT_APP_URL + '/shop/'+shop_id+'/item/'+item_id }>
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