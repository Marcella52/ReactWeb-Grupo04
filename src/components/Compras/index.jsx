import "./compras.css";
import React, { useState, useContext, useEffect } from "react";
import { CredenciaisContext } from "../../context/credenciais";

import axios from "axios";
import api from "../../service/api";

function Compras() {
  const { credenciais, credenciaisCarregadas } = useContext(CredenciaisContext);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    carregaCompras();
  }, [credenciaisCarregadas]);

  async function carregaCompras() {
    if (credenciaisCarregadas) {
      try {
        const response = await api.get(`api/v1/usuarios/compras`, {
          auth: {
            username: credenciais.login,
            password: credenciais.senha,
          },
        });
        setCompras(response.data);
      } catch (error) {
        setCompras([]);
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
    <section className="container-compras">
      <h1>Compras</h1>
      <div className="informacao">
        <p className="titulo-pedido">Pedidos</p>
        <p className="titulo-data">Data</p>
        <p className="titulo-valor">Valor</p>
      </div>

      {compras.length === 0
        ? ""
        : compras.map((compra) => {
            if (compra.statusPedido === "FINALIZADO") {
              return (
                <div key={compra.id}>
                  <div className="info-container">
                    <p className="pedido">{compra.id}</p>
                    <p className="data">{geraData(compra.dataPedido)}</p>
                    <p className="valor">{calculaTotal(compra).toFixed(2)}</p>
                  </div>
                  <hr className="linha"></hr>
                </div>
              );
            }
          })}
    </section>
  );
}

export default Compras;
