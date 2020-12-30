import React, { useContext, useState } from 'react';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import './styles.css';
import StoreContext from '../../components/Store/Context';
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api'


const SignIn: React.FC = () => {
  const [ error, setError ]  = useState('');
  const { setToken, setUser } = useContext(StoreContext);
  const history = useHistory();

  const validations = yup.object().shape({
    user_email: yup.string().email().required(),
    user_passwd: yup.string().min(8).required()
  })

  async function handlerSignIn(values: {user_email: string, user_passwd: string}) { 
   
      api.post('/login', values).then(response => {
        const { token, user } = response.data;

        if(token) {
          setToken(token);
          setUser(user);
          return history.push('/dashboard/admin/inicio')
        }
      }).catch((err) => {
        setError('Credenciais inválidas. ')
        console.log(err)
      }) 
    
  }

  return (
    <div className="user-login">
      <h1 className="user-login__title">Acessar o Sistema </h1>
      <h4 className="error-submit">{error}</h4>
      <Formik initialValues={{
        user_email: '',
        user_passwd: ''
        }} 
        validateOnMount = {true}
        onSubmit={handlerSignIn} 
        validationSchema={validations}
      >
        <Form>
          <div className="input-block">
            <label htmlFor="email" className="label-login">Email</label>
            <Field name="user_email"/>
            <ErrorMessage component="span"  name="user_email" render={()=><span className="error-submit">Email Invalido</span>}/>
          </div>
          <div className="input-block">
            <label htmlFor="email" className="label-login">Senha</label>
            <Field name="user_passwd" type="password"/>
            <ErrorMessage component="span" name="user_passwd" render={()=><span className="error-submit">Senha muito curta</span>} />
          </div>
        
        <button type="submit" className="button-submit">
          Entrar
        </button>
        <Link to="/user/form" className="button-cadastro">
          Fazer Cadastro
        </Link>
        </Form>
      </Formik>
    </div>
  );
};

export default SignIn;
