import React, { useContext } from "react";

import { BotaoVermelho } from "./style";

import { CredenciaisContext } from '../../context/credenciais';

import api from '../../service/api';

import { useHistory } from 'react-router-dom';

function BotaoDeletar() {
  const { credenciais, handleSetCredenciais, credenciaisCarregadas } = useContext(CredenciaisContext);
  const history = useHistory();

  async function deletarUsuario() {
    try {
      const response = await api.delete(`api/v1/usuarios`, {
        auth: {
          username: credenciais.login,
          password: credenciais.senha
        }
      });
      alert("Usuário deletado com sucesso!");
      realizarLogout();
    } catch (error) {
      alert("Ocorreu um erro no processo de exclusão");
    };
  }

  function realizarLogout() {
    localStorage.removeItem('credenciais');
    handleSetCredenciais({
      login: null,
      senha: null
    });
    history.push("/");
  }

  return <BotaoVermelho type="button" className="botao-deletar" onClick={deletarUsuario}>Deletar</BotaoVermelho>;
}

export default BotaoDeletar;
