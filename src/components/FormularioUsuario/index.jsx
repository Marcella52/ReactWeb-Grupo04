import React, { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CredenciaisContext } from '../../context/credenciais';

import api from "../../service/api";

import "./style.css"

function FormularioUsuario() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [telefone2, settelefone2] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');   
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const { credenciais } = useContext(CredenciaisContext);
  const history = useHistory();

  function cadastrarUsuario() {
    let formData = new FormData();

    const usuario = {
      nome: nome,
      sobrenome: sobrenome,
      telefone1: telefone1,
      telefone2: telefone2,
      cpf: cpf,
      dataNascimento: datanascimento,
      email: email,
      nomeusuario: usuario,
      senha: senha,
      cep: cep,
      rua: rua,  
      bairro: bairro,
      numero: numero,
      complemento: complemento,
      cidade: cidade,
      estado: estado
    } 

    formData.append('usuario', JSON.stringify(usuario));

    api
      .post(`api/v1/usuarios`, formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
        },
        auth: {
          username: credenciais.login,
          password: credenciais.senha
        },
        data: '[form]'
      })
      .then((response) => {
        if (response.status === 201) {
          alert("Usuario cadastrado com sucesso");
          limpaEstados();
        }
      })
      .catch((error) => {
        if(error?.response?.data.titulo === 'Usuario já existe no sistema'){
          alert("Usuário já possui cadastro!");
        }
      });
  }

  function limpaEstados() {
    setNome('');
    setSobrenome('');
    setTelefone1('');
    settelefone2('');
    setCpf('');
    setDataNascimento('');
    setEmail('');
    setNomeUsuario('');
    setSenha('');
    setCep('');
    setRua('');   
    setBairro('');
    setNumero('');
    setComplemento('');
    setCidade('');
    setEstado('');
  }

  function handleSetNome(e) {
    setNome(e.target.value);
  }

  function handleSetSobrenome(e) {
    setSobrenome(e.target.value);
  }

  function handleSetTelefone1(e) {
    setTelefone1(e.target.value);
  }

  function handleSetTelefone2(e) {
    setTelefone2(e.target.value);
  }

  function handleSetCpf(e) {
    setCpf(e.target.value);
  }

  function handleSetDataNascimento(e) {
    console.log(e.target.value)
    setDataNascimento(e.target.value);
  }
  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function handleSetCpf(e) {
    setCpf(e.target.value);
  }
  
  function handleSetNomeUsuario(e) {
    setNomeUsuario(e.target.value);
  }

  function handleSetSenha(e) {
    setSenha(e.target.value);
  }

  function handleSetCep(e) {
    setCep(e.target.value);
  }

  function handleSetRua(e) {
    setRua(e.target.value);
  }

  function handleSetBairro(e) {
    setBairro(e.target.value);
  }

  function handleSetNumero(e) {
    setNumero(e.target.value);
  }

  function handleSetComplemento(e) {
    setComplemento(e.target.value);
  }

  function handleSetCidade(e) {
    setCidade(e.target.value);
  }

  function handleSetEstado(e) {
    setEstado(e.target.value);
  }

  useEffect(() => {
    if (credenciais.login === undefined && credenciais.senha === undefined) {
      return;
    }
    if(credenciais.login === null && credenciais.senha === null) {
      
      history.push('/login');
    }
}, [credenciais]);

const formik = useFormik({
  initialValues: {
      nome: '',
      sobreNome: '',
      telefone1: '',
      telefone2: '',
      cpf: '',
      dataNascimento: '',
      email: '',
      nomeUsuario: '',
      senha: '',
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      complemento: '',
      cidade: '',
      estado: '',

  },


validationSchema: Yup.object({
  nome: Yup.string().min(4, 'Nome deve conter no mínimo 4 caracteres').max(40, 'Nome deve conter no máximo 40 caracteres').required('Nome não pode ficar em branco. O campo deve ser preenchido!'),
  sobrenome: Yup.string().min(4, 'Sobrenome deve conter no mínimo 4 caracteres').max(40, 'Sobrenome deve conter no máximo 40 caracteres').required('Sobrenome não pode ficar em branco. O campo deve ser preenchido!'),

  telefone1: Yup.string().required('O Telefone Principal não pode ficar em branco. O campo deve ser preenchido!'),
  cep: Yup.string().required('CEP não pode ficar em branco. O campo deve ser preenchido!'),
  datanascimento: Yup.date().max(new Date(), 'Data de nascimento não pode estar no futuro!').required('Data de nascimento não pode ficar em branco. O campo deve ser preenchido!'),
  cpf: Yup.string().required('CPF não pode ficar em branco. O campo deve ser preenchido!'),
  numero: Yup.string().required('Numero não pode ficar em branco. O campo deve ser preenchido!'),

})
});

  return (
    <main><h1>Cadastro de Usuário</h1>
      <form className="CadastroUsuario" onSubmit={formik.handleSubmit}>
        <div id="div-meio">
          <div class="esquerda">
                <label htmlFor="nome">Nome <spam id="alerta">*</spam></label>
                <input
                    id="nome"
                    nome="nome"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nome}
                 />
                {formik.touched.nome && formik.errors.nome ? <div class="error">{formik.errors.nome}</div> : null}

          </div>
          <div class="direita">
                <label htmlFor="sobreNome">Sobre-nome <spam id="alerta">*</spam></label>
                <input
                    id="sobreNome"
                    nome="sobreNome"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sobreNome}
                />
                {formik.touched.sobreNome && formik.errors.sobreNome ? <div class="error">{formik.errors.sobreNome}</div> : null}
          </div>
        </div>



        <div id="div-meio">
          <div class="esquerda">
            <label htmlFor="telefone1">Telefone principal <spam id="alerta">*</spam></label>
            <input
                id="telefone1"
                nome="telefone1"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefone1}
            />
            {formik.touched.telefone1 && formik.errors.telefone1 ? <div class="error">{formik.errors.telefone1}</div> : null}

          </div>
          <div class="direita">
            <label htmlFor="telefone2">Telefone secundário </label>
            <input
                id="telefone2"
                nome="telefone2"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefone2}
            />
            {formik.touched.telefone2 && formik.errors.telefone2 ? <div class="error">{formik.errors.telefone2}</div> : null}
            </div>
        </div>

        <label>Genero<spam id="alerta">*</spam></label>
        <div className="form-group-check-inline">
           <div className="form-check form-check-inline">
               <input
                  className="form-check-input"
                  type="radio"
                  name="genero"
                  value=" Masculino"
                  id="inlineRadio1"
               />
               <label className="form-check-label radio-label" htmlFor="inlineRadio1">
                   Masculino
               </label>
            </div>
          <div className="form-check form-check-inline">
              <input
                 className="form-check-input"
                 type="radio"
                 name="genero"
                 value=" Feminino"
                 id="inlineRadio2"
              />
              <label className="form-check-label radio-label" htmlFor="inlineRadio2">
                Feminino
              </label>
         </div>
         <div className="form-check form-check-inline">
             <input
                className="form-check-input"
                type="radio"
                name="genero"
                value=" Prefiro não informar"
                id="inlineRadio3"
             />
              <label className="form-check-label radio-label" htmlFor="inlineRadio3">
              Prefiro não informar
               </label>
          </div>
        </div>

        <div id="div-meio">
          <div class="esquerda">
            <label htmlFor="cpf">CPF <spam id="alerta">*</spam></label>
            <input
              id="cpf"
              nome="cpf"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cpf}
            />
            {formik.touched.cpf && formik.errors.cpf ? <div class="error">{formik.errors.cpf}</div> : null}

          </div>
          <div class="direita">
            <label htmlFor="dataNascimento">Data de nascimento <spam id="alerta">*</spam></label>
            <input
              id="dataNascimento"
              nome="dataNascimento"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dataNascimento}
            />
            {formik.touched.dataNascimento && formik.errors.dataNascimento ? <div class="error">{formik.errors.dataNascimento}</div> : null}
          </div>
        </div>


        <label htmlFor="email">e-mail <spam id="alerta">*</spam></label>
        <input
           id="email"
           nome="email"
           type="email"
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? <div class="error">{formik.errors.email}</div> : null}


        <label htmlFor="nomeUsuario">Nome de usuário <spam id="alerta">*</spam></label>
        <input
           id="nomeUsuario"
           nome="nomeUsuario"
           type="text"
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           value={formik.values.nomeUsuario}
        />
        {formik.touched.nomeUsuario && formik.errors.nomeUsuario ? <div class="error">{formik.errors.nomeUsuario}</div> : null}

        <label htmlFor="senha">Senha <spam id="alerta">*</spam></label>
        <input
          id="senha"
          nome="senha"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.senha}
        />
        {formik.touched.senha && formik.errors.senha ? <div class="error">{formik.errors.senha}</div> : null}

        <label htmlFor="cep">CEP <spam id="alerta">*</spam></label>
        <input
          id="cep"
          nome="cep"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cep}
        />
        {formik.touched.cep && formik.errors.cep ? <div class="error">{formik.errors.cep}</div> : null}

        
        <label htmlFor="rua">Rua <spam id="alerta">*</spam></label>
        <input
           id="rua"
           nome="rua"
           type="text"
           readOnly="true"          
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           value={formik.values.rua}

        />
        {formik.touched.rua && formik.errors.rua ? <div class="error">{formik.errors.rua}</div> : null}

        <label htmlFor="bairro">Bairro <spam id="alerta">*</spam></label>
        <input
           id="bairro"
           nome="bairro"
           type="text"
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           value={formik.values.bairro}
        />
        {formik.touched.bairro && formik.errors.bairro ? <div class="error">{formik.errors.bairro}</div> : null}

        <div id="div-meio">
          <div class="esquerda-numero">
            <label htmlFor="numero">Número <spam id="alerta">*</spam></label>
            <input
              id="numero"
              nome="numero"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.numero}
            />
            {formik.touched.numero && formik.errors.numero ? <div class="error">{formik.errors.numero}</div> : null}

          </div>
          <div class="direita-complemento">
            <label htmlFor="complemento">Complemento </label>
            <input
              id="complemento"
              nome="complemento"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.complemento}
            />
            {formik.touched.complemento && formik.errors.complemento ? <div class="error">{formik.errors.complemento}</div> : null}
          </div>
        </div>

        <div id="div-meio">
          <div class="esquerda-cidade">
            <label htmlFor="cidade">Cidade <spam id="alerta">*</spam></label>
            <input
              id="cidade"
              nome="cidade"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cidade}
            />
            {formik.touched.cidade && formik.errors.cidade ? <div class="error">{formik.errors.cidade}</div> : null}

          </div>
          <div class="direita-uf">
            <label htmlFor="uf">Estado <spam id="alerta">*</spam></label>
            <input
              id="uf"
              nome="uf"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.uf}
              size="20"
            />
            {formik.touched.uf && formik.errors.uf ? <div class="error">{formik.errors.uf}</div> : null}
         </div>
        </div>
         <div className="checkboxDeclaracao">
            <input
               type="checkbox"
               placeholder="  Declaro que li e aceito os Termos de Uso"
               name="DeclaracaoCiente"
               id="checkboxDeclaracao"
             />
             <label htmlFor="labelCheckDeclaracao">  Declaro que li e aceito os Termos de Uso</label>
          </div>
         <input id="botao" type='submit' nome="enviar" value="CADASTRAR-SE" />
         <div className="linkentrada">
            <label htmlFor="linkentrada"> Ja tem cadastro? Entrar </label>
         </div>
      </form >
    </main>
  );
}
  
export default FormularioUsuario;
