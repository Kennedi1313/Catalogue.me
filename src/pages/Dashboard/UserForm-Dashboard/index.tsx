import React, { FormEvent, useEffect, useState } from 'react'

import './styles.css'
import Textarea from '../../../components/Textarea';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import Input from '../../../components/Input';
import PageHeader from '../../../components/PageHeader';
import { ChromePicker } from "react-color";



interface ParamProps {
    shop_id: string,
}

const EditShopForm: React.FC<ParamProps> = ({shop_id}) => {

    const [loading, setLoading] = useState(false);
    const [whatsapp, setWhatsapp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [logo, setLogo] = useState('');
    const [shopColor, setShopColor] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [logoInput, setLogoInputInp] = useState('');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [changeColor, setChangeColor] = useState("#999");
    const [color, setColor] = useState({
        r: 0,
        g: 9,
        b: 153,
        a: 1
    });

    const styles = {
        title: "Selecionar cor da loja",
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

            console.log(shop.data[0].bio);
    
            setName(shop.data[0].name);
            setBio(shop.data[0].bio);
            setWhatsapp(shop.data[0].whatsapp);
            setLogo(shop.data[0].logo);
            setShopColor(shop.data[0].color);
        }
        searchShop();
    }, [shop_id, logoInput]);

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
                    
                    <Link className="botao-aba-esq" to={'/dashboard/admin/itens-ativos'}> Itens disponíveis </Link>
                    <Link className="botao-aba-dir" to={'/dashboard/admin/shop'}> Editar loja </Link>
                
                </h1>
                <fieldset>
                    <legend>Cabeçalho da loja</legend>
                    <PageHeader title={name} description={bio} color={shopColor} logo={ isS3 ? logo : ( logo !== '' ? process.env.REACT_APP_API_URL + logo_url : process.env.REACT_APP_API_URL + default_url)}>
                    </PageHeader>
                    <footer className="footer-simula-header">
                        <form onSubmit={handleMudarLogo}>
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
                                                <ChromePicker
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
                    </footer>
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