import React, { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import './styles.css'
import {Carousel} from 'react-bootstrap'
import Input from '../../../components/Input';

interface ParamProps {
    item_id: string,
}

function ItemDescription(){
    const { item_id } = useParams<ParamProps>();
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState([
        {avatar: "string"}
    ])
    const [info, setInfo] = useState('')
    const [price, setPrice] = useState('')
    const [avatarInp, setAvatarInp] = useState('')

    function resetFormState() {
        setAvatarInp('');
    }

    useEffect(() => {
        async function getItem() {
            console.log(item_id)
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
        }
        getItem();
    }, [item_id, avatarInp]);

    function onChangeHandler (event) {
        setAvatarInp(event.target.files[0])
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("item_id", item_id);
        formData.append("avatar", avatarInp);

        api.post('/avatar', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then((res) => {
            console.log(res)
            resetFormState();
            alert('Cadastro realizado com sucesso. ')
            
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
    }

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
        <div id="item-description-dashboard">
            
            <article className="item-dashboard">
            <form onSubmit={handleCreate}>
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
                        </footer>
                    </div>
                </header>
                <footer>
                    <fieldset className="add-image">
                        <legend>Adicionar nova imagem</legend>
                        <label id="label-file" htmlFor='selecao-arquivo'>&#187; Selecionar imagem &#187;</label>
                        <Input 
                            name="avatar" 
                            label=""
                            type="file" 
                            id="selecao-arquivo"
                            accept="image/x-png,image/gif,image/jpeg"
                            className="imagem-avatar" 
                            onChange={onChangeHandler}
                        />
                        <button>Adicionar</button>
                    </fieldset>
                
                </footer>
                </form>
            </article>
        </div>
    )
}

export default ItemDescription;