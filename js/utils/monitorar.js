/**
 * @param {Alerta}
 * @returns 
 */
async function verificaProduto(alerta) {
    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${alerta.id}`);
        const produto = await resposta.json();

        if (produto.valor < alerta.valor) {
            if (alerta.isCompra) {
                let compras = localStorage.getItem("compras") ? 
                JSON.parse(localStorage.getItem("compras")) : [];

                compras.push(new Compra(alerta.id, alerta.nome, alerta.valor, (new Date()).toLocaleDateString('pt-BR')));

                localStorage.setItem("compras", JSON.stringify(compras));

                alert("O produto " + alerta.nome + " foi comprado por " + formatarPreco(alerta.valor) + ".");
            } else {
                alert("O produto " + alerta.nome + " chegou ao valor de " + formatarPreco(alerta.valor) + ".");
            }
            removerAlerta(alerta);
        }
    } finally {}
}

function removerAlerta(alerta) {
    const alertas = localStorage.getItem("alertas") ? 
        JSON.parse(localStorage.getItem("alertas")) : [];

    alertas.forEach((item, i) => {
        if (item.id == alerta.id) {
            alertas.splice(i, 1);
            localStorage.setItem("alertas", JSON.stringify(alertas));
            return;
        }
    });
}

async function verificarTodosAlertas() {
    const alertas = localStorage.getItem("alertas") ? 
        JSON.parse(localStorage.getItem("alertas")) : [];

    await Promise.all(alertas.map(alerta => verificaProduto(alerta)));
}

setInterval(verificarTodosAlertas, 5000);