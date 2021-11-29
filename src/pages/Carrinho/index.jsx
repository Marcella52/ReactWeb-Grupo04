import React, { useState, useContext, useEffect } from "react";
import { CredenciaisContext } from "../../context/credenciais";
import "./style.css";
import api from "../../service/api";
import { useHistory } from "react-router-dom";

function Carrinho() {
  const [cep, setCep] = useState({ cep: "" });
  const [carrinho, setCarrinho] = useState([]);
  const { credenciais } = useContext(CredenciaisContext);
  const [frete, setFrete] = useState(0.0);
  const [precoTotal, setPrecoTotal] = useState(0.0);
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

  const getInformacoes = (e) => {
    e.preventDefault();
    if(cep.length !== 8) {
      alert("CEP inválido");
      return;
    }
    api.get("http://viacep.com.br/ws/" + cep + "/json/").then((response) => {
      if(response?.data?.erro) {
        alert("CEP não encontrado");
      }
      setInformacoes(response.data);
    }).catch((error) => {
      console.log("CEP inválido");
    });
  };

  const handlingCep = (e) => {
      setCep(e.target.value);
  };

  function aumentarContador(produto, pedido) {
    produto.quantidade++;
    setCarrinho(JSON.parse(JSON.stringify(carrinho)));
    atualizaCarrinho(pedido);
  }
  function diminuirContador(produto, pedido) {
    if (produto.quantidade > 1) {
      produto.quantidade--;
      setCarrinho(JSON.parse(JSON.stringify(carrinho)));
      atualizaCarrinho(pedido);
    }
  }

  function removeItem(index, pedido) {
    if (pedido.listaItemPedido.length > 1) {
      pedido.listaItemPedido.splice(index, 1);
      setCarrinho(JSON.parse(JSON.stringify(carrinho)));
      atualizaCarrinho(pedido);
    }
  }

  async function getCarrinho() {
    try {
      const response = await api.get(`api/v1/usuarios/carrinho`, {
        auth: {
          username: credenciais.login,
          password: credenciais.senha,
        },
      });
      setCarrinho(response.data);
    } catch (error) {
      setCarrinho([]);
    }
  }

  function atualizaCarrinho(pedido) {
    api
      .put(`api/v1/pedidos/${pedido.id}`, pedido, {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: credenciais.login,
          password: credenciais.senha,
        },
      })
      .then(() => {})
      .catch((error) => {
        alert(error.response.data.listaErros[0]);
      });
  }

  function finalizarPedido() {
    carrinho.map((pedido) => {
      console.log(pedido.id);
      try {
        const response = api.put(`api/v1/pedidos/${pedido.id}/finalizar`, null, {
          auth: {
            username: credenciais.login,
            password: credenciais.senha,
          },
        });
        alert("Pedido(s) finalizado(s). Cheque seu email");
        history.push("/minha-conta");
      } catch (error) {
        alert("Erro ao finalizar o pedido");
      }
    });
  }

  useEffect(() => {
    let freteTotal = 0;
    carrinho.map((pedido) => {
      freteTotal += pedido.fretePedido;
    });
    setFrete(freteTotal);
  }, [carrinho]);

  useEffect(() => {
    let total = frete;
    carrinho.map((pedido) => {
      pedido.listaItemPedido.map((itemPedido) => {
        total += itemPedido.precoUnitario * itemPedido.quantidade;
      });
    });
    setPrecoTotal(total);
  }, [carrinho]);

  useEffect(() => {
    if (
      credenciais.login !== null &&
      credenciais.senha !== null &&
      credenciais.login !== undefined &&
      credenciais.senha !== undefined
    ) {
      getCarrinho();
    }
  }, [credenciais]);

  return (
    <main className="container-carrinho">
      <h1>Meu carrinho</h1>
      <div className="container-carrinho-superior">
        {/* COMEÇA AQUI MEU CARRINHO */}
        <section className="produtos-container">
          <div className="titulo-itens">
            <p>Produtos</p>
            <p>Quantidade</p>
            <p>Preço</p>
          </div>
          {carrinho.length === 0
            ? ""
            : carrinho.map((pedido) => {
                let produtos = pedido.listaItemPedido.map((itemPedido, index) => {
                  return (
                    <div key={itemPedido.produto.id} className="itens-produtos">
                      <div className="foto-nome">
                        <img src={itemPedido.produto.urlFoto} className="imagem-produto" alt="Ícone de usuário" />
                        <p>{itemPedido.produto.nome}</p>
                      </div>

                      <div className="button-container">
                        <div className="contar-container">
                          <button onClick={() => diminuirContador(itemPedido, pedido)}>–</button>
                          <p className="quantidade-produto">{itemPedido.quantidade}</p>
                          <button onClick={() => aumentarContador(itemPedido, pedido)}>+</button>
                        </div>
                        <button className="remover-button" onClick={() => removeItem(index, pedido)}>
                          Remover
                        </button>
                      </div>
                      <div className="preco-altera">
                        <p>R$ {itemPedido.produto.precoUnitario}</p>
                      </div>
                    </div>
                  );
                });
                return produtos;
              })}
        </section>

        {/* COMEÇA AQUI O RESUMO DO PEDIDO */}
        <section className="resumo-pedido">
          <div className="titulo-resumo-pedido">
            <p>Resumo do pedido</p>
          </div>

          {carrinho.length === 0
            ? ""
            : carrinho.map((pedido) => {
                let produtos = pedido.listaItemPedido.map((itemPedido, index) => {
                  return (
                    <div key={itemPedido.produto.id} className="produtos-total">
                      <p>
                        {itemPedido.quantidade}x {itemPedido.produto.nome}
                      </p>
                      <p>R$ {(itemPedido.quantidade * itemPedido.precoUnitario).toFixed(2)}</p>
                    </div>
                  );
                });
                return produtos;
              })}

          <div className="frete-valor">
            <p>Frete</p>
            <p>R$ {frete.toFixed(2)}</p>
          </div>

          <div className="prazo-dias">
            <p>Prazo</p>
            <p>7 dias úteis</p>
          </div>

          <hr />

          <div className="total">
            <p>Total:</p>
            <p>R$ {precoTotal.toFixed(2)}</p>
          </div>

          <div className="button-continuar">
            <button onClick={finalizarPedido}>Finalizar</button>
          </div>
        </section>
      </div>

      {/* COMEÇA AQUI O CALCULA FRETE PRAZO */}
      <section className="calcula-frete-prazo">
        <div className="titulo-cfp">
          <p>Calcula frete e prazo</p>
        </div>

        <div className="formulario-cep">
          <form
            onSubmit={(e) => {
              getInformacoes(e);
            }}
          >
            <label htmlFor="cep" className="label-cep">
              CEP
            </label>
            <input
              type="text"
              name="cep"
              id="cep"
              onChange={(e) => {
                handlingCep(e);
              }}
              minLength='8'
              maxLength='8'
              placeholder="Digite o CEP aqui"
            />
            <button type="submit">ok!</button>

            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank">
              Não sei meu cep :&#40;
            </a>
          </form>
          <div className="cpf-encontrado">
            <p>
              Endereço encontrado: {informacoes.logradouro} - {informacoes.bairro} - {informacoes["localidade"]}/
              {informacoes["uf"]}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Carrinho;
