import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import './styles.css'
import Textarea from '../../../components/Textarea';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import StoreContext from '../../../components/Store/Context';
import imageCompression from 'browser-image-compression';
import { AddCircleOutlineRounded, DeleteOutlineRounded } from '@material-ui/icons';

interface ParamProps {
    item_id: string,
}

interface ParamLabel {
    value: string,
    label: string,
}

function ItemDescription(){
    const { item_id } = useParams<ParamProps>();
    const { user } = useContext(StoreContext);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState([
        {
            id: 0,
            avatar: "string",
            item_id: 0
        }
    ]);
    const [itemCategory, setItemCategory] = useState('');
    const [info, setInfo] = useState('');
    const [price, setPrice] = useState('');
    const [itemAvatar, setItemAvatar] = useState('');
    const [avatarInp, setAvatarInp] = useState<File>();
    const [infoLength, setInfoLength] = useState(600);
    const [loading, setLoading] = useState(false);
    const [labelInput, setLabelInput] = useState('')
    const [labelCategories, setLabelCategories] = useState<ParamLabel[]>([])
    const [itemOptions, setItemOptions] = useState([{ label: '' } ]);
    const [optionLabel, setOptionLabel] = useState('');

    function resetFormState() {
        setLabelInput('')
    }

    useEffect(() => {
        function getItem() {
            api.get('/itembyid', { 
                params: { item_id } 
            }).then((res) => {
                setName(res.data[0].name)
                setInfo(res.data[0].info)
                setPrice(res.data[0].price)
                
                setItemAvatar(res.data[0].avatar)
    
                api.get('/itemavatarbyid', {
                    params: {item_id}
                }).then((avatarData) => {
                    setAvatar(avatarData.data.itemsAvatar)
                })

                api.get('/getOptionsById', {
                    params: {
                        item_id,
                    }
                }).then((options) => {
                    setItemOptions(options.data.itemsOptions) 
                });

                if (labelCategories.length === 0) {
                    api.get('/shops-categories', {
                        params: {
                            shop_id: user.shop_id
                        }
                    }).then((categories) => {
                        let newlabel = labelCategories;
                        let isPossuiCategoriaDoItem = false;
            
                        categories.data.map(({category}) => {
                            if(category === res.data[0].category)
                                isPossuiCategoriaDoItem = true;
                            
                            newlabel.push({value: category, label: category})
                        })
                        if(!isPossuiCategoriaDoItem)
                            newlabel.push({value: res.data[0].category, label: res.data[0].category})
                       
                        setLabelCategories(newlabel)
                        setItemCategory(res.data[0].category)
                    
                    });
                }
                
            })
        }
        getItem();
        
    }, [item_id, labelInput]);

    function addNewItemOptions() {
        
        if(itemOptions.length === 0 || itemOptions[0].label === '') {
            setItemOptions([{ label: optionLabel }])
        } else {
            setItemOptions([
                ...itemOptions, 
                { label: optionLabel }
            ]);
        }

        api.post('/add-item-option',{
            item_id,
            options_label: optionLabel
        }).then((res) => { 
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
        

        setOptionLabel('');
    }

    function deleteItemOptions(label: string){
        const updatedItemOptions = itemOptions.filter(function(itemOptions) {
            if ( itemOptions.label === label ) {
                return false;
            }

            return true;
            
        }).map( (itemOptions ) => {
            return itemOptions;
        });

        setItemOptions(updatedItemOptions);

        api.post('delete-item-option', {
            item_id: item_id,
            options_label: label
        }).then((res) => { 
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
        
    }
    
    async function onChangeHandler(event) {
        setLabelInput(event.target.files[0].name)
        const imageFile = event.target.files[0];

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
 
          setAvatarInp(compressedFile)
        } catch (error) {
          console.log(error);
        }
      
    }

    function handlerMudarAvatar(item_id, avatar) {
        api.post('avatar-change', {
            avatar,
            item_id
        }).then((res) => { 
            resetFormState();
            window.location.reload(); 
            alert('Essa imagem agora é a capa do item!') 
        })
        .catch((err) => {
            alert('Opa, algo deu errado.')
        })
    }

    function handlerDeletarAvatar(id, avatar) {
        api.post('avatar-delete', {
            avatar,
            id
        }).then((res) => { 
            resetFormState();
            window.location.reload(); 
            alert('Deletada com sucesso!') 
        })
        .catch((err) => {
            alert('Opa, algo deu errado.')
        })
    }

    function handleEdit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        const user_id = user.id

        api.post('/items-edit',{
                item_id,
                user_id,
                name,
                price,
                category: itemCategory,
                info, 
            } 
        ).then((res) => {
            console.log(res)
            setLoading(false);
            alert('Atualizado com sucesso. ')
            resetFormState();
        }).catch((e) => {
            setLoading(false);
            alert(['Erro no cadastro. Verifique se todos os campos foram preenchidos. '])
        })
    }

    function handleCreate(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("item_id", item_id);
        formData.append("avatar", avatarInp as File);

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
                <header>
                    <div className="info">
                        <form onSubmit={handleEdit}>

                            <fieldset>
                                <legend>Informações do item</legend>
                                <Input 
                                    name="name" 
                                    label="Nome" 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => {setName(e.target.value)}}
                                />

                                <Select 
                                    name="category" 
                                    label="Categoria" 
                                    value={itemCategory}
                                    onChange={(e) => {setItemCategory(e.target.value)}}
                                    options={labelCategories} 
                                />

                                <Textarea 
                                    name="info" 
                                    label={'Descrição (caracteres restantes: '+ infoLength +')'} 
                                    value={info}
                                    maxLength={600}
                                    onChange={(e) => {setInfo(e.target.value); setInfoLength(600 - info.length)}}
                                />
                            
                                <Input 
                                    name="price" 
                                    label="Preço" 
                                    type="number" 
                                    value={price}
                                    onChange={(e) => {setPrice(e.target.value)}}
                                />
                            
                                {!loading ?
                            
                                    <button type="submit">Salvar</button>
                                
                                : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading" />}
                            </fieldset>
                           
                        </form>
                    </div>
                </header>
                
                <form onSubmit={handleCreate}>
                    <fieldset className="add-image">
                        <legend>Adicionar nova imagem</legend>
                        <label id="label-file" htmlFor="arquivo">{labelInput ? labelInput : 'Selecionar imagem'}</label>
                        <input 
                            name="avatar" 
                            type="file" 
                            id="arquivo"
                            accept="image/x-png,image/gif,image/jpeg"
                            className="imagem-avatar" 
                            onChange={onChangeHandler}
                        />
                        <button>Adicionar</button>
                        
                    </fieldset>
                </form>
                <fieldset className="imagens">
                    <legend>Imagens deste item</legend>
                    <div className="item-imagens">
                        {avatar.map(({avatar, id, item_id}) => {
                            return (
                                    <div key={id} className="imagem">
                                        <img src={ isS3 ? avatar : ( avatar !== '' ? process.env.REACT_APP_API_URL + avatar_url : process.env.REACT_APP_API_URL + default_url)} alt="avatar"/>  
                                        <div className="button-group">
                                            <button disabled={avatar === itemAvatar} onClick={() => handlerMudarAvatar(item_id, avatar)} className="mudar-avatar">{avatar !== itemAvatar ? "Mudar capa" : "Capa atual"}</button>
                                            <button onClick={() => handlerDeletarAvatar(id, avatar)} className="deletar-avatar">Deletar</button>
                                        </div>
                                    </div>
                                )
                        }) }
                    </div>
                </fieldset>

                <fieldset className="imagens">
                    <legend>Opções deste item</legend>
                    <div className="new-option">
                        <Input name="label" label="Opção" type="text" value={optionLabel} onChange={ e => setOptionLabel(e.target.value) }/>
                        <button type="button" onClick={ addNewItemOptions }> <AddCircleOutlineRounded style={{ fontSize: '40' }}/> </button>    
                    </div>
                    <div className="item-imagens">
                        {itemOptions.map(({label}, index) => {
                            return (
                                    <div key={label} className="item-options">
                                        <span > { label } </span>   
                                        <button type="button" onClick={e => deleteItemOptions(label)}><DeleteOutlineRounded style={{ fontSize: '30' }}/></button>
                                    </div>
                                )
                        }) }
                    </div>
                </fieldset>
            </article>
        </div>
    )
}

export default ItemDescription;