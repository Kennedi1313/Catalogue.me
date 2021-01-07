import React, { FormEvent, useEffect, useState } from 'react'

import './styles.css'
import Textarea from '../../../components/Textarea';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import Input from '../../../components/Input';



interface ParamProps {
    shop_id: string,
}

const EditShopForm: React.FC<ParamProps> = ({shop_id}) => {

    const [loading, setLoading] = useState(false);
    const [whatsapp, setWhatsapp] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');

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

        }
        searchShop();
    }, [shop_id]);

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
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
    }

    return (
        <div id="page-user-form-dash" className="container">
            <main>
                <h1> 
                    
                    <Link className="botao-aba-esq" to={'/dashboard/admin/itens-ativos'}> Itens disponíveis </Link>
                    <Link className="botao-aba-dir" to={'/dashboard/admin/shop'}> Editar loja </Link>
                
                </h1>
                
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