function loadProdutos() {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    const listaProdutos = Array.isArray(produtos) ? produtos : [produtos];

    listaProdutos.forEach(produto => {
        $("#select_produto").append(`<option value="${produto.id}">${produto.descricao}</option>`);
    });

    atualizarTabelaAlertas();
}

function calcular() {
    const produtoId = $("#select_produto").val();
    const produtoNome = $("#select_produto option:selected").text();
    const valorDesejado = parseFloat($("#valor").val());
    const acao = parseInt($("#action").val());

    if (!produtoId || !valorDesejado || !acao) return;

    const alertas = JSON.parse(localStorage.getItem("alertas")) || [];

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

    atualizarTabelaCompras();
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
                    <button type="button" class="btn btn-danger btn-sm" onclick="excluirAlerta(${alerta.id})">Excluir</button>
                </td>
            </tr>
        `);
    });
}

function excluirAlerta(id) {
    const alertaId = parseInt(id);
    let alertas = JSON.parse(localStorage.getItem("alertas")) || [];

    alertas = alertas.filter(alerta => alerta.id !== alertaId);
    localStorage.setItem("alertas", JSON.stringify(alertas));

    $(`#alerta-${alertaId}`).remove();
}

setInterval(verificarAlertas, 5000);

function atualizarTabelaCompras() {
    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    $(".table_compras tbody").empty(); // Limpa a tabela antes de adicionar os produtos

    compras.forEach(produto => {
        $(".table_compras tbody").append(`
            <tr>
                <td>${produto.id}</td>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${produto.urlImage}" alt="${produto.descricao}" class="rounded shadow-sm" width="60" height="60" style="object-fit: cover;">
                        <span>${produto.descricao}</span>
                    </div>
                </td>
                <td>R$ ${produto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
        `);
    });
}