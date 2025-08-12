/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - adicionar evento de escuta no input tbody
    - atualizar o valor total do produto
    - atualizar o valor total do carrinho
*/

const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");

botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener("click", (evento) => {
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        //buscar a lista de produtos no localStorage
        const carrinho = obterProdutosDoCarrinho();
        //testar se o produto já existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        //se existe produto, incrementar a quantidade
        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            //se não existe, adicionar o produto com a quantidade 1
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1,
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarCarrinhoETabela();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

//passo 4 - atuaizar o contador do carrinho de compras
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = total;
}


//passo 5 - atualizar a tabela do carrinho
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = ""; // Limpa a tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto">
        <img 
            src="${produto.imagem}"
            alt="${produto.nome}"
        />
        </td>
        <td>${produto.nome}</td>
             <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
             <td class="td-quantidade">
             <input type="number" class="input-quantidade" data-id="${produto.id}" value= "${produto.quantidade}" min="1"></td>
             <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
             <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>`;
        corpoTabela.appendChild(tr);
    });
}

// Objetivo 2 - remover produtos do carrinho:
//     - ouvir o botão de deletar
const corpoTabela = document.querySelector("#modal-1-content table tbody");

corpoTabela.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("btn-remover")) {
        const id = evento.target.dataset.id;
        // remover do localStorage
        removerProdutoDoCarrinho(id);
    }
});

//passo 1 - adicionar o evento de escuta no input do tbody
corpoTabela.addEventListener("input", (evento) => {
    //passo 2 - atualizar o valor total do produto
    if (evento.target.classList.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});

// passo 4 - atualizar o html do carrinho retirando o produto
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    //filtrar os produtos que não tem o id passado por parâmetro
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

// passo 3 - atualizar o valor total do carrinho

function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.querySelector(".total-carrinho").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();