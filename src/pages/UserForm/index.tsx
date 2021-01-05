import React, { useState } from 'react'

import './styles.css'
import PageHeader from '../../components/PageHeader'
import Textarea from '../../components/Textarea';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { ErrorMessage, Formik, Form, Field } from 'formik';



function UserForm() {

    const [loading, setLoading] = useState(false);
    // validações dos campos do formulario
    const validations = yup.object().shape({
        user_name: yup.string().max(80).required(),
        user_email: yup.string().email().required(),
        user_passwd: yup.string().min(8).required(),
        new_user_passwd: yup.string().oneOf([yup.ref('user_passwd')]).required(),

        shop_name: yup.string().max(80).required(),
        shop_whatsapp: yup.string().min(11).required(),
    })

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

    const history = useHistory();

    const [shop_bio, setShopBio] = useState('')
    function handleCreateShop(
        values:  
        {
            user_name: string,
            user_whatsapp: string,
            user_email: string, 
            user_passwd: string,
            new_user_passwd: string,
            shop_name: string,
            shop_whatsapp: string,
        } ) {
        setLoading(true);

        const formData = new FormData();
        formData.append('user_name', values.user_name)
        formData.append('user_whatsapp', values.user_whatsapp)
        formData.append('user_email', values.user_email)
        formData.append('user_passwd', values.user_passwd)

        formData.append('shop_name', values.shop_name)
        formData.append('shop_whatsapp', values.shop_whatsapp)
        formData.append('shop_bio', shop_bio)

        api.post('/shops', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then(() => {
            setLoading(false);
            alert('Cadastro realizado com sucesso. ')
        }).then(() => {
            history.push('/user/login')
        }).catch((e) => {
            setLoading(false);
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })
    }

    return (
        <div id="page-user-form" className="container">
            <PageHeader 
            title="Formulário de Cadastro" 
            description="Primeiro precisamos de algumas informações sobre você e seu trabalho."/>
            
            <main>
                <Formik initialValues={{
                            user_name: '',
                            user_whatsapp: '',
                            user_email: '', 
                            user_passwd: '',
                            new_user_passwd: '',
                
                            shop_name: '',
                            shop_whatsapp: '',
                            shop_bio: '',
                        }} 
                        validateOnMount = {true}
                        onSubmit={handleCreateShop} 
                        validationSchema={validations}>
                    <Form>
                        <fieldset>
                            <legend>Seus dados</legend>
                            <div className="input-block">
                                <label htmlFor="name" >Nome</label>
                                <Field name="user_name" placeHolder="seu nome"/>
                                <ErrorMessage 
                                    component="span"  
                                    name="user_name" 
                                    render={()=><span className="error-submit">O nome é inválido</span>}
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="email">Email</label>
                                <Field  name="user_email" placeHolder="email@mail.com"/>
                                <ErrorMessage 
                                    component="span"  
                                    name="user_email" 
                                    render={()=><span className="error-submit">Email Inválido</span>}
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="senha" >Senha</label>
                                <Field name="user_passwd" type="password"/>
                                <ErrorMessage 
                                    component="span" 
                                    name="user_passwd" 
                                    render={()=><span className="error-submit">Senha muito curta</span>} 
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="new senha" >Repita a Senha</label>
                                <Field name="new_user_passwd" type="password"/>
                                <ErrorMessage 
                                    component="span" 
                                    name="new_user_passwd" 
                                    render={()=><span className="error-submit">Senhas devem ser iguais</span>} 
                                />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Sobre seu trabalho</legend>
                            <div className="input-block">
                                <label htmlFor="nomeloja" >Nome da Loja</label>
                                <Field name="shop_name" placeHolder="nome da loja"/>
                                <ErrorMessage 
                                    component="span"  
                                    name="shop_name" 
                                    render={()=><span className="error-submit">O nome é inválido</span>}
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="whats" >Whatsapp</label>
                                <Field type="number" name="shop_whatsapp" placeHolder="84 99999 9999" onKeyPress={(e) => mascaraTelefone(e.target)}/>
                                <ErrorMessage 
                                    component="span"  
                                    name="shop_whatsapp" 
                                    render={()=><span className="error-submit">Telefone Inválido</span>}
                                />
                            </div>
                            <Textarea 
                                name="bio" 
                                label="Biografia" 
                                value={shop_bio} 
                                onChange={(e)=>{setShopBio(e.target.value)}}>
                            </Textarea>
                        </fieldset>
                        {!loading ?
                        <footer>
                            <p>Importante! <br /> Preencha todos os dados.</p>
                            <button type="submit">Salvar</button>
                        </footer>
                        : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />}
                    </Form>
                </Formik>
            </main>

            
            <main>

            </main>
        </div>
    )
}

export default UserForm;