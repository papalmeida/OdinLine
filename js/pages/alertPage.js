function loadProdutos() {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const listaProdutos = Array.isArray(produtos) ? produtos : [produtos];
    
    listaProdutos.forEach(produto => {
        $("#select_produto").append(`<option value="${produto.id}">${produto.descricao}</option>`);
    });
    
    atualizarTabelaAlertas();
}

/**
 * @param {Alerta} alerta 
 */
function calcular() {
    const produtoId = $("#select_produto").val();
    const produtoNome = $("#select_produto option:selected").text();
    const valorDesejado = parseFloat($("#valor").val());
    const acao = parseInt($("#action").val());

    if (!produtoId || !valorDesejado || !acao) return;

    let alertas;
    if (localStorage.getItem("alertas")) {
        alertas = JSON.parse(localStorage.getItem("alertas"));
    } else {
        alertas = [];
    }

    if (alertas.some(a => a.id == produtoId)) {
        alert("⚠️ Já existe um alerta para esse produto.");
        return;
    }

    const alerta = new Alerta(
        produtoId,
        produtoNome,
        valorDesejado,
        acao === 2 // true se for "Comprar"
    );

    console.log(alerta);

    alertas.push(alerta);
    localStorage.setItem("alertas", JSON.stringify(alertas));

    atualizarTabelaAlertas();
}

async function verificarAlertas() {
    const alertas = JSON.parse(localStorage.getItem("alertas")) || [];
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${user.chave}/usuario`);
        const produtos = await resposta.json();

        alertas.forEach(alertaData => {
            const alerta = new Alerta(
                alertaData.id,
                alertaData.nome,
                alertaData.valor,
                alertaData.isCompra
            );

            const produto = produtos.find(p => p.id == alerta.id);
            if (!produto) return;

            if (produto.valor == alerta.valor) {
                if (alerta.isCompra) {
                    adicionarProdutoCompra(produto);

                    alert(`🛒 Produto "${alerta.nome}" comprado por R$ ${produto.valor.toFixed(2)}!`);

                    const novosAlertas = alertas.filter(a => a.id != alerta.id);
                    localStorage.setItem("alertas", JSON.stringify(novosAlertas));

                    atualizarTabelaAlertas();
                } else {
                    alert(`🔔 Alerta: "${alerta.nome}" está por R$ ${produto.valor.toFixed(2)}!`);
                    const novosAlertas = alertas.filter(a => a.id != alerta.id);
                    localStorage.setItem("alertas", JSON.stringify(novosAlertas));
        
                    atualizarTabelaAlertas();
                }
            }
        });
    } catch (err) {
        console.error("Erro ao verificar alertas:", err);
    }
}

function adicionarProdutoCompra(produto) {
    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    
    compras.push(produto);
    localStorage.setItem("compras", JSON.stringify(compras));
}

function atualizarTabelaAlertas() {
    $(".table_alert").empty();

    const alertas = JSON.parse(localStorage.getItem("alertas")) || [];

    alertas.forEach(alerta => {
        $(".table_alert").append(`
            <tr id="alerta-${alerta.id}">
                <td>${alerta.nome}</td>
                <td>${alerta.valor.toFixed(2)}</td>
                <td>${alerta.isCompra ? "Comprar" : "Notificar"}</td>
                <td>
                    <button type="button" class="btn btn-close float-end" aria-label="Close" onclick="excluirAlerta(${alerta.id})"></button>
                </td>
            </tr>
        `);
    });
}

function excluirAlerta(id) {
    const alertaId = String(id);
    let alertas = JSON.parse(localStorage.getItem("alertas")) || [];

    alertas = alertas.filter(alerta => String(alerta.id) !== alertaId);
    localStorage.setItem("alertas", JSON.stringify(alertas));

    $(`#alerta-${alertaId}`).remove();
}

setInterval(verificarAlertas, 5000);