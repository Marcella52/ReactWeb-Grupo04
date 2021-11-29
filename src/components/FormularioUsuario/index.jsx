import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { CredenciaisContext } from "../../context/credenciais";

import api from "../../service/api";

import "./style.css";

function FormularioUsuario() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone1, setTelefone1] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [genero, setGenero] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const { credenciais, credenciaisCarregadas } = useContext(CredenciaisContext);
  const history = useHistory();
  const [informacoes, setInformacoes] = useState({
    cep: '',
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    ibge: "",
    gia: "",
  });

  async function getInformacoes() {
    if(cep === undefined || cep.length !== 8) {
      return;
    }
    try {
      const response = await api.get("http://viacep.com.br/ws/" + cep + "/json/")
      if(response?.data?.erro) {
        alert("CEP não encontrado");
      }
      setInformacoes(response.data);
      return(response.data)
    }
    catch (e) {
      console.log(2);
    }
  };

  useEffect(async () => {
    console.log(cep);
    let informacoesTemp = await getInformacoes();
    
    setRua((informacoesTemp?.logradouro ?? ''));
    setCidade((informacoesTemp?.localidade ?? ''));
    setEstado((informacoesTemp?.uf ?? ''));
    setBairro((informacoesTemp?.bairro ?? ''));
    console.log('bateu aqui');
  }, [cep]);

  function cadastrarUsuario(e) {
    e.preventDefault();
    const usuario = {
      nome: nome,
      sobrenome: sobrenome,
      telefonePrincipal: telefone1,
      telefoneSecundario: telefone2 == "" ? null : telefone2,
      sexo: genero,
      cpf: cpf,
      dataNascimento: dataNascimento,
      email: email,
      nomeUsuario: nomeUsuario,
      senhaUsuario: senha,
      endereco: {
        cep: cep,
        logradouro: rua === "" ? null : rua,
        bairro: bairro === "" ? null : bairro,
        numero: numero === "" ? null : +numero,
        complemento: complemento === "" ? null : complemento,
        cidade: cidade === "" ? null : cidade,
        estado: estado === "" ? null : estado,
      },
    };

    console.log(usuario);

    api
      .post(`api/v1/usuarios`, usuario, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          alert("Usuario cadastrado com sucesso");
          history.push("/");
        }
      })
      .catch((error) => {
        if (error?.response?.data.titulo === "Usuario já existe no sistema") {
          alert("Usuário já possui cadastro!");
        }
        else {
          alert(error?.response?.data.listaErros[0]);
        }
      });
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

  function handleSetGenero(opcao) {
    setGenero(opcao);
  }

  function handleSetCpf(e) {
    setCpf(e.target.value);
  }

  function handleSetDataNascimento(e) {
    setDataNascimento(e.target.value);
  }
  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function handleSetNomeUsuario(e) {
    setNomeUsuario(e.target.value);
  }

  function handleSetSenha(e) {
    setSenha(e.target.value);
  }

  function handleSetCep(e) {
    // atualizaCampos(e.target.value);
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
    if (credenciaisCarregadas) {
      if (
        credenciais.login !== null &&
        credenciais.senha !== null &&
        credenciais.login !== undefined &&
        credenciais.senha !== undefined
      ) {
        history.push("/minha-conta");
      }
    }
  }, [credenciaisCarregadas]);

  const formik = useFormik({
    initialValues: {
      nome: "",
      sobrenome: "",
      telefone1: "",
      telefone2: "",
      cpf: "",
      dataNascimento: "",
      email: "",
      nomeUsuario: "",
      senha: "",
      cep: "",
      rua: "",
      bairro: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
    },

    validationSchema: Yup.object({
      nome: Yup.string()
        .min(4, "Nome deve conter no mínimo 4 caracteres")
        .max(40, "Nome deve conter no máximo 40 caracteres")
        .required("Nome não pode ficar em branco. O campo deve ser preenchido!"),
      sobrenome: Yup.string()
        .min(4, "Sobrenome deve conter no mínimo 4 caracteres")
        .max(40, "Sobrenome deve conter no máximo 40 caracteres")
        .required("Sobrenome não pode ficar em branco. O campo deve ser preenchido!"),
      telefone1: Yup.string()
        .min(8, "Telefone principal deve conter no mínimo 8 caracteres")
        .max(13, "Telefone principal deve conter no máximo 13 caracteres")
        .required("O Telefone Principal não pode ficar em branco. O campo deve ser preenchido!"),
      telefone2: Yup.string()
        .min(8, "Telefone secundário deve conter no mínimo 8 caracteres")
        .max(13, "Telefone secundário deve conter no máximo 13 caracteres"),
      cpf: Yup.string()
        .min(11, "CPF inválido")
        .max(11, "CPF inválido")
        .required("CPF não pode ficar em branco. O campo deve ser preenchido!"),
      dataNascimento: Yup.date()
        .max(new Date(), "Data de nascimento não pode estar no futuro!")
        .required("Data de nascimento não pode ficar em branco. O campo deve ser preenchido!"),
      email: Yup.string()
        .email("Campo deve conter um email!")
        .required("Email não pode ficar em branco. O campo deve ser preenchido!"),
      nomeUsuario: Yup.string().required("Nome de usuário não pode ficar em branco. O campo deve ser preenchido!"),
      senha: Yup.string()
        .min(8, "Senha deve conter no mínimo 8 caracteres")
        .max(35, "Senha deve conter no máximo 35 caracteres")
        .required("Senha não pode ficar em branco. O campo deve ser preenchido!"),
      cep: Yup.string()
        .min(8, "CEP inválido")
        .max(8, "CEP inválido")
        .required("CEP não pode ficar em branco. O campo deve ser preenchido!"),
      rua: Yup.string().required("Rua não pode ficar em branco. O campo deve ser preenchido!"),
      bairro: Yup.string(),
      numero: Yup.number().min(0, "Número não pode ser negativo"),
      compemento: Yup.string(),
      cidade: Yup.string(),
      estado: Yup.string(),
    }),
  });

  return (
    <main className="container-cadastro-usuario">
      <h1>Cadastro de Usuário</h1>
      <form
        className="CadastroUsuario"
        onSubmit={(e) => {
          formik.handleSubmit(e);
          cadastrarUsuario(e);
        }}
      >
        <div id="div-meio">
          <div className="esquerda">
            <label htmlFor="nome">
              Nome <span id="alerta">*</span>
            </label>
            <input
              id="nome"
              nome="nome"
              type="text"
              onChange={(e) => {
                handleSetNome(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={nome}
              required
            />
            {formik.touched.nome && formik.errors.nome ? <div className="error">{formik.errors.nome}</div> : null}
          </div>
          <div className="direita">
            <label htmlFor="sobrenome">
              Sobrenome <span id="alerta">*</span>
            </label>
            <input
              id="sobrenome"
              nome="sobrenome"
              type="text"
              onChange={(e) => {
                handleSetSobrenome(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={sobrenome}
              required
            />
            {formik.touched.sobrenome && formik.errors.sobrenome ? (
              <div className="error">{formik.errors.sobrenome}</div>
            ) : null}
          </div>
        </div>

        <div id="div-meio">
          <div className="esquerda">
            <label htmlFor="telefone1">
              Telefone principal <span id="alerta">*</span>
            </label>
            <input
              id="telefone1"
              nome="telefone1"
              type="text"
              onChange={(e) => {
                handleSetTelefone1(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={telefone1}
              required
            />
            {formik.touched.telefone1 && formik.errors.telefone1 ? (
              <div className="error">{formik.errors.telefone1}</div>
            ) : null}
          </div>
          <div className="direita">
            <label htmlFor="telefone2">Telefone secundário </label>
            <input
              id="telefone2"
              nome="telefone2"
              type="text"
              onChange={(e) => {
                handleSetTelefone2(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={telefone2}
            />
            {formik.touched.telefone2 && formik.errors.telefone2 ? (
              <div className="error">{formik.errors.telefone2}</div>
            ) : null}
          </div>
        </div>

        <label>
          Genero<span id="alerta">*</span>
        </label>
        <div className="form-group-check-inline">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="genero"
              value="M"
              checked={genero === "M"}
              onChange={() => handleSetGenero("M")}
              id="inlineRadio1"
              required
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
              value="F"
              checked={genero === "F"}
              onChange={() => handleSetGenero("F")}
              id="inlineRadio2"
              required
            />
            <label className="form-check-label radio-label" htmlFor="inlineRadio2">
              Feminino
            </label>
          </div>
        </div>

        <div id="div-meio">
          <div className="esquerda">
            <label htmlFor="cpf">
              CPF <span id="alerta">*</span>
            </label>
            <input
              id="cpf"
              nome="cpf"
              type="text"
              onChange={(e) => {
                handleSetCpf(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={cpf}
              required
            />
            {formik.touched.cpf && formik.errors.cpf ? <div className="error">{formik.errors.cpf}</div> : null}
          </div>
          <div className="direita">
            <label htmlFor="dataNascimento">
              Data de nascimento <span id="alerta">*</span>
            </label>
            <input
              id="dataNascimento"
              nome="dataNascimento"
              type="date"
              onChange={(e) => {
                handleSetDataNascimento(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={dataNascimento}
              required
            />
            {formik.touched.dataNascimento && formik.errors.dataNascimento ? (
              <div className="error">{formik.errors.dataNascimento}</div>
            ) : null}
          </div>
        </div>

        <div id="div-linha">
          <label htmlFor="email">
            e-mail <span id="alerta">*</span>
          </label>
          <input
            id="email"
            nome="email"
            type="email"
            onChange={(e) => {
              handleSetEmail(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={email}
            required
          />
          {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
        </div>

        <div id="div-linha">
          <label htmlFor="nomeUsuario">
            Nome de usuário <span id="alerta">*</span>
          </label>
          <input
            id="nomeUsuario"
            nome="nomeUsuario"
            type="text"
            onChange={(e) => {
              handleSetNomeUsuario(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={nomeUsuario}
            required
          />
          {formik.touched.nomeUsuario && formik.errors.nomeUsuario ? (
            <div className="error">{formik.errors.nomeUsuario}</div>
          ) : null}
        </div>

        <div id="div-linha">
          <label htmlFor="senha">
            Senha <span id="alerta">*</span>
          </label>
          <input
            id="senha"
            nome="senha"
            type="password"
            onChange={(e) => {
              handleSetSenha(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={senha}
            required
          />
          {formik.touched.senha && formik.errors.senha ? <div className="error">{formik.errors.senha}</div> : null}
        </div>

        <div id="div-linha">
          <label htmlFor="cep">
            CEP <span id="alerta">*</span>
          </label>
          <input
            id="cep"
            nome="cep"
            type="text"
            onChange={(e) => {
              handleSetCep(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={cep}
            required
          />
          {formik.touched.cep && formik.errors.cep ? <div className="error">{formik.errors.cep}</div> : null}
        </div>

        <div id="div-linha">
          <label htmlFor="rua">
            Rua <span id="alerta">*</span>
          </label>
          <input
            id="rua"
            nome="rua"
            type="text"
            onChange={(e) => {
              handleSetRua(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={rua}
            required
          />
          {formik.touched.rua && formik.errors.rua ? <div className="error">{formik.errors.rua}</div> : null}
        </div>

        <div id="div-linha">
          <label htmlFor="bairro">
            Bairro <span id="alerta">*</span>
          </label>
          <input
            id="bairro"
            nome="bairro"
            type="text"
            readOnly={true}
            onChange={(e) => {
              handleSetBairro(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={bairro}
            required
          />
          {formik.touched.bairro && formik.errors.bairro ? <div className="error">{formik.errors.bairro}</div> : null}
        </div>

        <div id="div-meio">
          <div className="esquerda-numero">
            <label htmlFor="numero">
              Nº <span id="alerta">*</span>
            </label>
            <input
              id="numero"
              nome="numero"
              type="number"
              onChange={(e) => {
                handleSetNumero(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={numero}
            />
            {formik.touched.numero && formik.errors.numero ? <div className="error">{formik.errors.numero}</div> : null}
          </div>
          <div className="direita-complemento">
            <label htmlFor="complemento">Complemento </label>
            <input
              id="complemento"
              nome="complemento"
              type="text"
              onChange={(e) => {
                handleSetComplemento(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={complemento}
            />
            {formik.touched.complemento && formik.errors.complemento ? (
              <div className="error">{formik.errors.complemento}</div>
            ) : null}
          </div>
        </div>

        <div id="div-meio">
          <div className="esquerda-cidade">
            <label htmlFor="cidade">
              Cidade <span id="alerta">*</span>
            </label>
            <input
              id="cidade"
              nome="cidade"
              type="text"
              readOnly={true}
              onChange={(e) => {
                handleSetCidade(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={cidade}
            />
            {formik.touched.cidade && formik.errors.cidade ? <div className="error">{formik.errors.cidade}</div> : null}
          </div>
          <div className="direita-uf">
            <label htmlFor="estado">
              Estado <span id="alerta">*</span>
            </label>
            <input
              id="estado"
              nome="estado"
              type="text"
              readOnly={true}
              onChange={(e) => {
                handleSetEstado(e);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={estado}
              size="20"
            />
            {formik.touched.estado && formik.errors.estado ? <div className="error">{formik.errors.estado}</div> : null}
          </div>
        </div>

        <div className="checkboxDeclaracao">
          <input type="checkbox" name="checkboxDeclaracao" id="checkboxDeclaracao" required />
          <label htmlFor="checkboxDeclaracao">Declaro que li e aceito os Termos de Uso</label>
        </div>

        <input
          id="botao"
          type="submit"
          nome="enviar"
          value="Cadastrar Usuário"
          disabled={!(formik.isValid && formik.dirty)}
        />

        <div className="linkentrada">
          <label htmlFor="linkentrada"> Ja tem cadastro? <Link to="/login">Entrar</Link></label>
        </div>
      </form>
    </main>
  );
}

export default FormularioUsuario;
