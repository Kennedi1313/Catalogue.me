import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import whatsappIcon from '../../assets/images/whatsappIcon.png'
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

import { useContext } from 'react'

import './styles.css'
import { Carousel } from 'react-bootstrap'
import StoreContext from '../../components/Store/Context';
import Checkbox from '@material-ui/core/Checkbox';

interface ParamProps {
    shop_tag: string,
    item_id: string,
}

function ItemDescription(){
    const { shop_tag, item_id } = useParams<ParamProps>();
    const [shop_name, setShopName] = useState('');
    const [shop_bio, setShopBio] = useState('');
    const [shop_logo, setShopLogo] = useState('');
    const [shop_color, setShopColor] = useState('');
    const [shopTextColor, setShopTextColor] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState([
        {avatar: "string"}
    ]);
    const [info, setInfo] = useState('');
    const [price, setPrice] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [itemOptions, setItemOptions] = useState([{ label: '' } ]);
    const [itemOptionsValue, setItemOptionsValue] = useState([{value: false}]);

    const { user } = useContext(StoreContext)

    useEffect(() => {
        async function getItem() {
            const res = await api.get('/itembyid', { 
                params: { item_id } 
            });
    
            setName(res.data[0].name);
            setInfo(res.data[0].info);
            setPrice(res.data[0].price);
    
            const avatarData = await api.get('/itemavatarbyid', {
                params: {item_id}
            })
            setAvatar(avatarData.data.itemsAvatar);
    
            const shop = await api.get('/shopbytag', {
                params: {
                    shop_tag,
                }
            });
    
            setShopName(shop.data[0].name);
            setShopBio(shop.data[0].bio);
            setShopLogo(shop.data[0].logo);
            setWhatsapp(shop.data[0].whatsapp);
            setShopColor(shop.data[0].color);
            setShopTextColor(shop.data[0].color_text);

            const options = await api.get('/getOptionsById', {
                params: {
                    item_id,
                }
            });
            
            setItemOptions(options.data.itemsOptions)

            let arrayValues = Array();
            options.data.itemsOptions.forEach(itemsOptions => {
                if(itemsOptions)
                    arrayValues.push({ value: false })
            });
    
            setItemOptionsValue(arrayValues);
        }
        getItem();
    }, [item_id, shop_tag, whatsapp]);
    
    function setItemOptionValue( position: number, checked: boolean ) {
        
        const updatedItemOptionsValue = itemOptionsValue.map( (itemOptionsValue, index ) => {
            if ( index === position ) {
                return { ...itemOptionsValue, value: (checked) };
            }

            return itemOptionsValue;
        });
        
        setItemOptionsValue(updatedItemOptionsValue);
        console.log(itemOptionsValue[position]);
    }

    let text = 'Olá! Tenho interesse no item: ' + name + '\n( ' + 
        process.env.REACT_APP_URL + '/'+shop_tag+'/item/'+item_id + " )\n";

    let label = false;
    itemOptionsValue.map((value, index) => {
            
            if(value.value === true) {
                if(label === false){
                    text += "Opções marcadas: \n";
                    label = true;
                } 
                return (
                    text += ( itemOptions[index].label + "\n")
                )
            }
            else
                return ""
        }) 

    const textWhats = window.encodeURIComponent(text);


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
            <PageHeader title={shop_name} description={shop_bio} color={shop_color} colorText={shopTextColor} logo={shop_logo && shop_logo}>
                <Link className="button-back" to={!!user ? "/dashboard/admin/shop" : "/" + shop_tag}>
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
                        
                            { info && <strong>Descrição</strong> }
                            <p className="description">
                                {info}
                            </p> 
                            { itemOptions.length > 0 && <strong>Opções: </strong> }
                            { itemOptions.length > 0 ? 
                                itemOptions.map((itemOptions, index) => {
                                return (
                                    itemOptions.label !== '' ?
                                        <div key={ itemOptions.label } className="item-description-options">
                                            <label htmlFor={itemOptions.label}>{itemOptions.label}</label>
                                            <Checkbox onChange={e => setItemOptionValue(index, !itemOptionsValue[index].value)} id={itemOptions.label} />
                                        </div>
                                    : null
                                );
                            }) : null}
                        <footer>
                            <p>
                                Preço: 
                                <strong>R$ {price}</strong>
                            </p>
                        
                            <a target="_blank" rel="noopener noreferrer" 
                                href={ 'https://wa.me/55' + whatsapp + '/?text=' + textWhats }>
                                <img src={whatsappIcon} alt="whatsapp"/>
                                Realizar pedido
                            </a>
                        </footer>
                    </div>
                </header>
                
            </article>
        </div>
    )
}

export default ItemDescription;