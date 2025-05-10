function loadCompras() {
    const compras = JSON.parse(localStorage.getItem("compras")) || [];

    const corpoTabela = $("#body_compras");
    corpoTabela.empty(); // limpa a tabela

    compras.forEach(produto => {
        corpoTabela.append(`
            <tr>
                <td>${produto.id}</td>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${produto.urlImage}" alt="${produto.descricao}" class="rounded shadow-sm" width="60" height="60" style="object-fit: cover;">
                        <span>${produto.descricao}</span>
                    </div>
                </td>
                <td>R$ ${produto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td></td>
            </tr>
        `);
    });
};