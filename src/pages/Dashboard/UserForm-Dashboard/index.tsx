import React, { FormEvent, useEffect, useState } from 'react'

import './styles.css'
import Textarea from '../../../components/Textarea';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import Input from '../../../components/Input';
import PageHeader from '../../../components/PageHeader';
import { SwatchesPicker } from "react-color";
import DeleteIcon from '@material-ui/icons/DeleteOutlined';



interface ParamProps {
    shop_id: string,
}

interface ParamCategories {
    category: string,
}

const EditShopForm: React.FC<ParamProps> = ({shop_id}) => {

    const [loading, setLoading] = useState(false);
    const [whatsapp, setWhatsapp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [logo, setLogo] = useState('');
    const [shopColor, setShopColor] = useState('');
    const [shopTextColor, setShopTextColor] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [logoInput, setLogoInputInp] = useState('');

    const [newCategory, setNewCategory] = useState('');
    const [categoryDeleted, setCategoryDeleted] = useState('');
    const [shopCategories, setShopCategories] = useState<ParamCategories[]>([]);

    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [changeColor, setChangeColor] = useState("#999");
    const [color, setColor] = useState({
        r: 0,
        g: 9,
        b: 153,
        a: 1
    });

    const [displayColorPickerText, setDisplayColorPickerText] = useState(false);
    const [changeColorText, setChangeColorText] = useState("#999");
    const [colorText, setColorText] = useState({
        r: 0,
        g: 9,
        b: 153,
        a: 1
    });

    const [reset, setReset] = useState('')

    const styles = {
        title: "Selecionar cor da loja",
        titleText: "Selecionar cor do texto",
        labelStyle: {
          paddingBottom: "7px",
          fontSize: "11px"
        },
        colorTextBoxStyle: {
          height: "35px",
          border: "none",
          borderBottom: "1px solid lightgray",
          paddingLeft: "35px"
        }
    };

    useEffect(() => {
        async function searchShop(){
            
            const shop = await api.get('/shopbyid', {
                params: {
                    shop_id,
                }
            });
    
            setName(shop.data[0].name);
            setBio(shop.data[0].bio);
            setWhatsapp(shop.data[0].whatsapp);
            setLogo(shop.data[0].logo);
            setShopColor(shop.data[0].color);
            setShopTextColor(shop.data[0].color_text);

            const categories = await api.get('/shops-categories', {
                params: {
                    shop_id
                }
            });

            setShopCategories(
                categories.data
            )
        }
        searchShop();
        setReset('');
    }, [shop_id, logoInput, reset]);

    function mascaraTelefone(input){
        input.maxLength = 11;//propriedade maxlength adicionada ao campo por javascript
        setTimeout(//set timeout usado para atualização mais precisa
            function(){
                input.value = formataTelefone(input.value);//atualização do campo com seu valor formatado em formataTelefone()
            }
            ,1//atualização do campo a cada milisegundo
        );
    }

    function formataTelefone(value){
        value = value.replace(/\D/g,"");//Remove tudo o que não é dígito
        return value;
    }

    function resetFormState() {
        setLogoInputInp('');
        setLabelInput('');
    }

    function handleMudarLogo(e: FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("shop_id", shop_id);
        formData.append("logo", logoInput);

        api.post('/logo', formData, {
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

    function handleAddCategory(e: FormEvent) {
        e.preventDefault();
        console.log(newCategory, shop_id)
        api.post('shops-categories', {
                category: newCategory,
                shop_id: shop_id
            
        }).then((res) => {
            console.log(res)
            setNewCategory('')
            setReset(res.statusText)
            alert('Cadastro realizado com sucesso. ')
            
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })  
    }

    function handlerDeleteCategory(e: FormEvent) {
        e.preventDefault();
        api.post('shops-categories-delete', {
            category: categoryDeleted,
            shop_id
        }).then((res) => {
            console.log(res)
            setCategoryDeleted('')
            setReset(res.statusText)
            alert('Deletado com sucesso. ')
            
        }).catch((e) => {
            alert('Erro na operação. Verifique se todos os campos foram preenchidos. ')
        })  
    }

    function handleMudarCor(e: FormEvent) {
        e.preventDefault();

        api.post('/color', {
            shop_id,
            color: changeColor
        }).then((res) => {
            console.log(res)
            setLogoInputInp(res.headers)
            resetFormState();
            alert('Cadastro realizado com sucesso. ')
            
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
        
    }

    function handleMudarCorText(e: FormEvent) {
        e.preventDefault();

        api.post('/colorText', {
            shop_id,
            color_text: changeColorText
        }).then((res) => {
            console.log(res)
            setLogoInputInp(res.headers)
            resetFormState();
            alert('Cadastro realizado com sucesso. ')
            
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
        
    }

    function onChangeHandler (event) {
        setLogoInputInp(event.target.files[0])
        setLabelInput(event.target.files[0].name)
    }

    function handleCreateShop(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('shop_id', shop_id)
        formData.append('shop_name', name)
        formData.append('shop_whatsapp', whatsapp)
        formData.append('shop_bio', bio)

        api.post('/shops-edit', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then(() => {
            setLoading(false);
            alert('Atualizado com sucesso. ')
        }).catch((e) => {
            setLoading(false);
            alert([e, 'Erro no cadastro. Verifique se todos os campos foram preenchidos. '])
        })
    }


    var logo_url = ''
    var default_url = '/uploads/default.png'
    var logo_s3 = 'https://upload-catalogueme.'
    var isS3 = false
    
    if(logo) {
        console.log(logo)
        if(logo.match(logo_s3)){
            isS3 = true
        } else {
            logo_url = logo.substring(6, logo.length)
        }
    }

    return (
        <div id="page-user-form-dash" className="container">
            <main>
                <h1> 
                    
                    <Link className="botao-aba-esq" to={'/dashboard/admin/itens-ativos'}> Meus Itens </Link>
                    <Link className="botao-aba-dir" to={'/dashboard/admin/shop'}> Editar loja </Link>
                
                </h1>
                <fieldset>
                    <legend>Cabeçalho da loja</legend>
                    <PageHeader title={name} description={bio} color={shopColor} colorText={shopTextColor} logo={ isS3 ? logo : ( logo !== '' ? process.env.REACT_APP_API_URL + logo_url : process.env.REACT_APP_API_URL + default_url)}>
                    </PageHeader>
                    <footer className="footer-simula-header">
                        <form onSubmit={handleMudarLogo}>
                            <label htmlFor="arquivo"> Logo </label>
                            <div className="trocar-logo">
                                
                                <label id="label-file" htmlFor="arquivo">{labelInput ? labelInput : 'Selecionar imagem'}</label>
                                <input 
                                    name="avatar" 
                                    type="file" 
                                    id="arquivo"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    className="imagem-avatar" 
                                    onChange={onChangeHandler}
                                />
                                <button>Confirmar</button>
                            </div>
                        </form>
                        <form onSubmit={handleMudarCor}>
                            <div className="trocar-cor">
                                <div className="color-picker-container">
                                    <label>{styles.title}</label>
                                    <div style={styles.labelStyle}/>
                                    <div className="color-picker-color-background"
                                        style={{backgroundColor: changeColor}}
                                    >
                                        &nbsp;
                                    </div>
                                    <input 
                                        readOnly
                                        style={styles.colorTextBoxStyle}
                                        type="text"
                                        className="color-picker-text"
                                        value={changeColor}
                                        onClick={() => setDisplayColorPicker(true)}
                                    />
                                    {displayColorPicker && (
                                        <div className="color-picker-palette">
                                            <div className="color-picker-cover" onClick={() => setDisplayColorPicker(false)}>
                                                <SwatchesPicker
                                                    color={color}
                                                    //@ts-ignore
                                                    onChange={(color) => {setColor(color.rgb); setChangeColor(color.hex)} }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button>Confirmar</button>
                            </div>
                        </form>
                        <form onSubmit={handleMudarCorText}>
                            <div className="trocar-cor">
                                <div className="color-picker-container">
                                    <label>{styles.titleText}</label>
                                    <div style={styles.labelStyle}/>
                                    <div className="color-picker-color-background"
                                        style={{backgroundColor: changeColorText}}
                                    >
                                        &nbsp;
                                    </div>
                                    <input 
                                        readOnly
                                        style={styles.colorTextBoxStyle}
                                        type="text"
                                        className="color-picker-text"
                                        value={changeColorText}
                                        onClick={() => setDisplayColorPickerText(true)}
                                        onLostPointerCapture={() => setDisplayColorPickerText(false)}
                                    />
                                    {displayColorPickerText && (
                                        <div className="color-picker-palette">
                                            <div className="color-picker-cover" onClick={() => setDisplayColorPickerText(false)}>
                                                <SwatchesPicker
                                                    color={colorText}
                                                    //@ts-ignore
                                                    onChange={(color) => {setColorText(color.rgb); setChangeColorText(color.hex)} }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button>Confirmar</button>
                            </div>
                        </form>
                    </footer>
                </fieldset>
                <fieldset>
                    <legend>Categorias</legend>
                    <form  onSubmit={handleAddCategory}>
                        <label>Adicionar nova Categoria</label>
                        <div className="add-category">
                            <Input 
                                label="" 
                                name="name" 
                                type="text"
                                value={newCategory}
                                onChange={(e)=>{setNewCategory(e.target.value)}}
                            />
                            <button>Adicionar</button>
                        </div>
                    </form>
                    <form onSubmit={handlerDeleteCategory}>
                        <label>Categorias Existentes</label>
                        <div className="categories-container">
                           
                            {shopCategories &&
                                shopCategories.map((category) => {
                                    return (
                                        <div className="categories" key ={category.category}>
                                            <h3  className="category">
                                                {category.category}
                                            </h3>
                                            <button onClick={() => setCategoryDeleted(category.category)}><DeleteIcon fontSize="large"/></button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </form>
                </fieldset>
                <form onSubmit={handleCreateShop}>
                    <fieldset>
                        <legend>Sobre seu trabalho</legend>
                        
                        <div className="input-block">
                            <Input 
                                label="Nome da Loja" 
                                name="name" 
                                type="text"
                                value={name}
                                onChange={(e)=>{setName(e.target.value)}}
                            />
                        </div>
                        <div className="input-block">
                            <Input 
                                label="Whatsapp (somente números)" 
                                type="number" 
                                name="shop_whatsapp" 
                                value={whatsapp}
                                onKeyPress={(e) => mascaraTelefone(e.target)}
                                onChange={(e)=>{setWhatsapp(e.target.value)}}
                            />
                        </div>
                        <Textarea 
                            name="bio" 
                            label="Biografia" 
                            value={bio} 
                            onChange={(e)=>{setBio(e.target.value)}}>
                        </Textarea>
                    </fieldset>
                    {!loading ?
                    <footer>
                        <p>Importante! <br /> Preencha todos os dados.</p>
                        <button type="submit">Salvar</button>
                    </footer>
                    : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="loading" />}
                </form>
            </main>
        </div>
    )
}

export default EditShopForm;