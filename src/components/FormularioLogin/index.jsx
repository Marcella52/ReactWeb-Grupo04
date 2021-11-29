import { Link, useHistory } from 'react-router-dom';

import React, { useContext, useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CredenciaisContext } from '../../context/credenciais';

import api from '../../service/api';

import "./login.css";


function FormularioLogin() {
  const {credenciais, handleSetCredenciais, credenciaisCarregadas} = useContext(CredenciaisContext);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory();

  useEffect(() => {
    if(credenciaisCarregadas) {
      if((credenciais.login !== null && credenciais.senha !== null) && (credenciais.login !== undefined && credenciais.senha !== undefined)) {
        history.push('/minha-conta');
      }
    }
  }, [credenciais]);

  async function efetuaLogin(){
    let usuario = await getUsuario();
    if((credenciais.login !== null && credenciais.senha !== null) && (credenciais.login !== undefined && credenciais.senha !== undefined)) {
      alert("Usuário já logado");
    }

    if(usuario == null) {
      alert("Credenciais inválidas");
    }
    else {
      let credenciaisTemp = {
        login: nomeUsuario,
        senha: senha
      }
      handleSetCredenciais(credenciaisTemp);
      localStorage.setItem("credenciais", JSON.stringify(credenciaisTemp));
    }
  }

  async function getUsuario() {
    try {
      const response = await api.get(`api/v1/usuarios`, {
        auth: {
          username: nomeUsuario,
          password: senha
        }
      });
      return response.data;
    } catch (error) {
      return null;
    };
  }

  const formik = useFormik({
    initialValues: {
      "nome-usuario": '',
      senha: '',
    },
    validationSchema: Yup.object({
      "nome-usuario": Yup.string().required('Nome de usuário obrigatório'),
      senha: Yup.string().min(8, 'Senha deve conter no mínimo 8 caracteres').max(35, 'Senha deve conter no máximo 35 caracteres').required('Senha obrigatória')
    }),

  });

  function handleNomeUsuario(e) {
    setNomeUsuario(e.target.value);
  }

  function handleSenha(e) {
    setSenha(e.target.value);
  }

  return (
    <main className="container-login">

      <div className="titulo-login">
        <img src="./img/user.png" className="login-imagem" alt="Ícone de usuário" />
        <h1>Login</h1>
      </div>

      <form className="formulario-login" onSubmit={(e) => {
        formik.handleSubmit(e);
        efetuaLogin();
      }}>
        <label htmlFor="nome-usuario">Nome de usuário:</label>
        <input
          id="nome-usuario"
          name="nome-usuario"
          type="text"
          placeholder="Digite seu nome de usuario aqui"
          onChange={(e) => {
            handleNomeUsuario(e);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          value={nomeUsuario}
        />
        {formik.touched['nome-usuario'] && formik.errors['nome-usuario'] ? (
          <div className="mensagem-validacao">{formik.errors['nome-usuario']}</div>
        ) : null}

        <label htmlFor="senha">Senha:</label>
        <input
          id="senha"
          name="senha"
          type="password"
          placeholder="Digite sua senha"
          onChange={(e) => {
            handleSenha(e);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          value={senha}
          maxLength='35'
        />
        {formik.touched.senha && formik.errors.senha ? (
          <div className="mensagem-validacao">{formik.errors.senha}</div>
        ) : null}

        <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Entrar</button>

        <p>Ainda não tem cadastro?</p>
        <Link to={`cadastro-usuario`}>
          <p>Clique para sua conta!</p>
        </Link>

      </form>
    </main>

  );
}

export default FormularioLogin;