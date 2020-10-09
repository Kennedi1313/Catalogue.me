import React, { useState } from 'react'

import './styles.css'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { ErrorMessage, Formik, Form, Field } from 'formik';



function UserForm() {


    // validações dos campos do formulario
    const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
    const validations = yup.object().shape({
        user_name: yup.string().max(80).required(),
        user_whatsapp: yup.string().matches(phoneRegExp).required(),
        user_email: yup.string().email().required(),
        user_passwd: yup.string().min(8).required(),
        new_user_passwd: yup.string().oneOf([yup.ref('user_passwd')]).required(),

        shop_name: yup.string().max(80).required(),
        shop_whatsapp: yup.string().matches(phoneRegExp).required(),
    })

    const history = useHistory();

    const [shop_bio, setShopBio] = useState('')

    // cria e atualiza o status o schedule item
    const [scheduleItems, setScheduleItem] = useState([
        { week_day: 1, from: '', to: ''},
        { week_day: 2, from: '', to: ''},
        { week_day: 3, from: '', to: ''},
        { week_day: 4, from: '', to: ''},
        { week_day: 5, from: '', to: ''},
    ]);
    function addNewScheduleItem() {
        setScheduleItem([
            ...scheduleItems,
            { week_day: 0, from: '', to: ''}
        ]);
    }

    // cria e atualiza o estado do avatar com a imagem do usuario
    const [shop_avatar, setShopAvatar] = useState('')
    function onChangeHandler (event) {
        setShopAvatar(event.target.files[0])
    }

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

        const formData = new FormData();
        formData.append('user_name', values.user_name)
        formData.append('user_whatsapp', values.user_whatsapp)
        formData.append('user_email', values.user_email)
        formData.append('user_passwd', values.user_passwd)

        formData.append('shop_name', values.shop_name)
        formData.append('shop_whatsapp', values.shop_whatsapp)
        formData.append('shop_avatar', shop_avatar)
        formData.append('shop_bio', shop_bio)

        formData.append('schedule_JSON', JSON.stringify(scheduleItems))

        api.post('/shops', formData, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            }
        }).then(() => {
            alert('Cadastro realizado com sucesso. ')
        }).then(() => {
            history.push('/login')
        }).catch((e) => {
            alert('Erro no cadastro. Verifique se todos os campos foram preenchidos. ')
        })

        console.log({
            formData,
            scheduleItems
        })
    }

    function setScheduleItemValue(position: number, field: string, value: string){
        const newArray = scheduleItems.map((scheduleItem, index) => {
            if(index === position) {
                return { ...scheduleItem, [field]: value }
            }

            return scheduleItem
        })
        setScheduleItem(newArray)
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
                                <Field name="user_name" />
                                <ErrorMessage 
                                    component="span"  
                                    name="user_name" 
                                    render={()=><span className="error-submit">O nome é inválido</span>}
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="whatsapp" >Whatsapp</label>
                                <Field name="user_whatsapp" />
                                <ErrorMessage 
                                    component="span"  
                                    name="user_whatsapp" 
                                    render={()=><span className="error-submit">Telefone Inválido</span>}
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="email" >Email</label>
                                <Field  name="user_email" />
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
                                <Field name="shop_name" />
                                <ErrorMessage 
                                    component="span"  
                                    name="shop_name" 
                                    render={()=><span className="error-submit">O nome é inválido</span>}
                                />
                            </div>
                            <div className="input-block">
                                <label htmlFor="whats" >Whatsapp</label>
                                <Field name="shop_whatsapp" />
                                <ErrorMessage 
                                    component="span"  
                                    name="shop_whatsapp" 
                                    render={()=><span className="error-submit">Telefone Inválido</span>}
                                />
                            </div>
                            <Input 
                                name="avatar" 
                                label="Imagem de capa" 
                                type="file" 
                                className="imagem-avatar" 
                                onChange={onChangeHandler}>
                            </Input>
                            <Textarea 
                                name="bio" 
                                label="Biografia" 
                                value={shop_bio} 
                                onChange={(e)=>{setShopBio(e.target.value)}}>
                            </Textarea>
                        </fieldset>

                        <fieldset>
                            <legend>
                                Horários disponíveis
                                <button type="button" onClick={addNewScheduleItem}>
                                    + novo horário
                                </button>
                            </legend>
                            {scheduleItems.map((scheduleItem, index) => {
                                return(
                                    <div key={index} className="schedule-item">
                                        <Select
                                            name={`week_day `+ index}
                                            label="Dia da semana" 
                                            onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                            value={scheduleItem.week_day}
                                            options={[
                                                {value: '0', label: 'Domingo'},
                                                {value: '1', label: 'Segunda'},
                                                {value: '2', label: 'Terça'},
                                                {value: '3', label: 'Quarta'},
                                                {value: '4', label: 'Quinta'},
                                                {value: '5', label: 'Sexta'},
                                                {value: '6', label: 'Sábado'},
                                            ]}
                                        />
                                        <Input 
                                            name={`from `+ index}
                                            label="Das" 
                                            type="time" 
                                            value={scheduleItem.from} 
                                            onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                        >
                                        </Input>
                                        <Input 
                                            name={`to `+ index}
                                            label="Ate" 
                                            type="time" 
                                            value={scheduleItem.to} 
                                            onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                        >
                                        </Input>
                                    </div>
                                );
                            })}
                        </fieldset>

                        <footer>
                            <p>Importante! <br /> Preencha todos os dados.</p>
                            <button type="submit">Salvar</button>
                        </footer>
                    </Form>
                </Formik>
            </main>

            
            <main>

            </main>
        </div>
    )
}

export default UserForm;