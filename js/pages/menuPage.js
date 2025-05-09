const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

async function loadProdutos() {
    const table = document.querySelector("#tabela_produtos tbody");

    try {
        const resposta = await fetch("https://api-odinline.odiloncorrea.com/produtos");
        const protudos = await resposta.json;

        protudos.array.forEach(protudo => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <th scope="row">${produto.id}</th>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${produto.imagem || 'https://via.placeholder.com/60'}" alt="${produto.nome}" class="rounded shadow-sm" width="60" height="60" style="object-fit: cover;">
                        <span>${produto.nome}</span>
                    </div>
                </td>
                <td>R$ ${produto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>
                    <button 
                        type="button"
                        class="btn btn-sm" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                        data-bs-title="Adicionar um alerta"
                    >🔔</button>
                    <button 
                        type="button"
                        class="btn btn-sm"
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                        data-bs-title="Comprar"
                    >🛒</button>
                </td>
            `;

            table.appendChild(tr);
            console.log(protudo)
        })
    } catch (error) {
        console.log("Erro ao carregar os produtos:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadProdutos)
