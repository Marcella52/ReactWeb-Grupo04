import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import CardMinhaConta from "../../components/CardMinhaConta";
import FormularioUsuarioMinhaConta from "../../components/FormularioUsuarioMinhaConta";
import Vendas from "../../components/Vendas";
import Compras from "../../components/Compras";
import "./style.css";

import { CredenciaisContext } from '../../context/credenciais';

function MinhaConta() {
  const [escolha, setEscolha] = useState(1);
  const { credenciais, credenciaisCarregadas, handleSetCredenciais } = useContext(CredenciaisContext);
  const history = useHistory();

  const cards = [
    {
      imagem: "./img/user.png",
      titulo: "Cadastro",
      descricao: "Alterar as informações pessoais e de endereço",
      altImagem: "Ícone de usuário",
    },
    {
      imagem: "./img/compras.png",
      titulo: "Compras",
      descricao: "Visualizar pedidos realizados",
      altImagem: "Ícone de compras com um carrinho de supermercado",
    },
    {
      imagem: "./img/vendas.png",
      titulo: "Vendas",
      descricao: "Visualizar vendas realizadas",
      altImagem: "Ícone de vendas com uma uma mão simbolizando crescimento",
    },
    {
      imagem: "./img/cadastrarProduto.png",
      titulo: "Cadastrar produtos",
      descricao: "Cadastrar novos produtos para venda",
      altImagem: "Ícone de cadastro de produtos com uma mão segurando um caixa aberta",
    },
    {
      imagem: "./img/cadastrarCategoria.png",
      titulo: "Cadastrar categorias",
      descricao: "Cadastrar novas categorias",
      altImagem: "Ícone de cadastro de categorias com o símbolo de uma lista",
    },
    {
      imagem: "./img/log-out.svg",
      titulo: "Log out",
      descricao: "Deslogar da conta atual",
      altImagem: "Ícone de logout com uma seta apontando para fora de uma caixa",
    },
  ];

  function realizarLogout() {
    localStorage.removeItem('credenciais');
    handleSetCredenciais({
      login: null,
      senha: null
    });
    alert("Usuário deslogado com sucesso");
    history.push("/");
  }

  useEffect(() =>{ 
    if(escolha === 4) {
      history.push('/cadastro-produto');
    }
    else if (escolha === 5) {
      history.push('/cadastro-categoria');
    }
    else if (escolha === 6) {
      realizarLogout();
    }
  }, [escolha]);

  useEffect(() => {
    if (credenciaisCarregadas) {
      if (credenciais.login === null && credenciais.senha === null) {
        history.push("/login");
      }
    }
  }, [credenciaisCarregadas]);
  

  return (
    <main className="container-minha-conta">
      <div className="menu">
        <div className="lateral">
          {cards.length === 0
            ? ""
            : cards.map((card, index) => {
                return <CardMinhaConta key={index} informacoes={card} setEscolha={setEscolha} index={index} escolha={escolha} />;
              })}
        </div>

        <div className="container-principal">
          {
            escolha === 1
            ? <FormularioUsuarioMinhaConta />
            : (
                escolha === 2
              )
              ? <Compras />
              : (
                escolha === 3
              )
              ? <Vendas />
                : ""
          }
        </div>
      </div>
    </main>
  );
}

export default MinhaConta;
