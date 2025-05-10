let produtoAtual = null;

/**
 * @param {User} user 
 * @returns {Produto[]}
 */
async function getProdutos(user) {
    if (user == null) return [];
    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${user.chave}/usuario`);
        const produtos = await resposta.json();
        return produtos;

    } catch (error) {
        alert("Erro ao buscar produtos.")
        return [];
    }
}

async function loadProdutos() {
    document.querySelector("#tabela_produtos tbody").innerHTML = "";

    const user = getUser();
    const produtos = await getProdutos(user);

    produtos.forEach((produto) => {
        adicionarLinha(produto);
    });
}

/**

 * @param {Produto}
 */
function adicionarLinha(produto) {
	const novaLinha = document.createElement("tr");

    novaLinha.innerHTML = 
    `
        <th scope="row">${produto.id}</th>
        <td>
            <div class="d-flex align-items-center gap-3">
                <img src="${produto.urlImage || 'https://via.placeholder.com/60'}" alt="${produto.descricao}" class="rounded shadow-sm" width="60" height="60" style="object-fit: cover;">
                <span>${produto.descricao}</span>
            </div>
        </td>
        <td>R$ ${produto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
    `;

	$("#tabela_produtos").append(novaLinha);
}

function criarAlerta() {
    let preco = converterPrecoFloat($("#preco-alerta").val());
    let acao = $('input[name="acao-alerta"]:checked').val() == 'comprar' ? true : false;
    let alertas = localStorage.getItem("alertas") ? JSON.parse(localStorage.getItem("alertas")) : [];

    const existe = alertas.some(alerta => alerta.id == produtoAtual.id);
    if (existe) {
        alert("Produto já possui alerta");
        return;
    }

    alertas.push(new Alerta(produtoAtual.id, produtoAtual.descricao, preco, acao));
    localStorage.setItem("alertas", JSON.stringify(alertas));
}