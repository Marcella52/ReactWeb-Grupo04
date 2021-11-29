import "./vendas.css";
import React, { useState, useContext, useEffect } from "react";
import { CredenciaisContext } from "../../context/credenciais";

import axios from "axios";
import api from "../../service/api";

function Vendas() {
  const { credenciais, credenciaisCarregadas } = useContext(CredenciaisContext);
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    carregaVendas();
  }, [credenciaisCarregadas]);

  async function carregaVendas() {
    if (credenciaisCarregadas) {
      try {
        const response = await api.get(`api/v1/usuarios/vendas`, {
          auth: {
            username: credenciais.login,
            password: credenciais.senha,
          },
        });
        setVendas(response.data);
      } catch (error) {
        setVendas([]);
      }
    }
  }

  function calculaTotal(pedido) {
    let total = pedido.fretePedido;
    pedido.listaItemPedido.map((itemPedido) => {
      total += itemPedido.precoUnitario * itemPedido.quantidade;
    });
    return total;
  }

  function geraData(dataPedido) {
    let data = new Date(dataPedido);
    let stringData =
      data.getDate() +
      "/" +
      data.getMonth() +
      "/" +
      data.getFullYear() +
      " " +
      data.getHours() +
      ":" +
      data.getMinutes();
    return stringData;
  }

  return (
    <section className="container-vendas">
      <h1>Vendas</h1>
      <div className="informacao">
        <p className="titulo-pedido">Pedidos</p>
        <p className="titulo-data">Data</p>
        <p className="titulo-valor">Valor</p>
      </div>

      {vendas.length === 0
        ? ""
        : vendas.map((venda) => {
            if (venda.statusPedido === "FINALIZADO") {
              return (
                <div key={venda.id}>
                  <div className="info-container">
                    <p className="pedido">{venda.id}</p>
                    <p className="data">{geraData(venda.dataPedido)}</p>
                    <p className="valor">{calculaTotal(venda).toFixed(2)}</p>
                  </div>
                  <hr className="linha"></hr>
                </div>
              );
            }
          })}
    </section>
  );
}

export default Vendas;
