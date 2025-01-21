const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const btnSalvar = document.querySelector('#btnSalvar');
const input = document.getElementById('identificador');
const button = document.getElementById('trocarBtn');
const text = document.getElementById('t-txt');


let itens;
let id;
let tipo = 'CNPJ'; // Variável para armazenar o tipo (CPF ou CNPJ)

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        // Fechar o modal se clicar na área de fundo
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        input.value = itens[index].funcao;
        tipo = itens[index].tipo;
        id = index;
        button.textContent = tipo === 'CPF' ? 'Trocar para CNPJ' : 'Trocar para CPF';
        input.placeholder = tipo === 'CPF' ? 'Digite o CPF' : 'Digite o CNPJ';
    } else {
        input.value = '';
        tipo = 'CPF'; // Define o tipo como CNPJ ao abrir o modal em branco
        button.textContent = 'Trocar para CNPJ';
        input.placeholder = 'Digite o CPF';
    }
}

button.addEventListener('click', function() {
    if (input.placeholder === "Digite o CNPJ") {
        input.placeholder = "Digite o CPF";
        button.textContent = "Trocar para CNPJ";
        tipo = 'CPF';
        text.textContent = 'CPF:'
    } else {
        input.placeholder = "Digite o CNPJ";
        button.textContent = "Trocar para CPF";
        tipo = 'CNPJ';
        text.textContent = 'CNPJ:'
    }
});

// Funções para validar e formatar CPF e CNPJ
function validarCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
}

function validarCNPJ(cnpj) {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regex.test(cnpj);
}

function formatarCPF(valor) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCNPJ(valor) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function validarCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
}

function validarCNPJ(cnpj) {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return regex.test(cnpj);
}

function formatarCPF(valor) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCNPJ(valor) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

btnSalvar.onclick = e => {
    e.preventDefault();
    let valor = input.value.trim();
    

    if (tipo === 'CPF') {
        if (!/^\d{11}$/.test(valor)) {
            alert('O CPF deve conter exatamente 11 dígitos.');
            return;
        }
        valor = formatarCPF(valor);
        if (!validarCPF(valor)) {
            alert('Formato de CPF inválido.');
            return;
        }
    } else {
        if (!/^\d{14}$/.test(valor)) {
            alert('O CNPJ deve conter exatamente 14 dígitos.');
            return;
        }
        valor = formatarCNPJ(valor);
        if (!validarCNPJ(valor)) {
            alert('Formato de CNPJ inválido.');
            return;
        }
    }

    const novoItem = { funcao: valor, tipo: tipo };

    if (id !== undefined) {
        itens[id] = novoItem; // Atualiza o item existente
    } else {
        itens.push(novoItem); // Adiciona um novo item
    }

    setItensBD();
    modal.classList.remove('active');
    loadItens();
    id = undefined; // Reseta o id após salvar
}


// Função para editar um item
function editItem(index) {
    openModal(true, index); // Abre o modal com os dados do item selecionado
}

// Função para excluir um item
function deleteItem(index) {
    itens.splice(index, 1); // Remove o item do array
    setItensBD();
    loadItens();
}

// Função para inserir item na tabela
function insertItem(item, index) {
    let tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${item.funcao}</td>
        <td>${item.tipo}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

// Função para carregar os itens da localStorage
function loadItens() {
    itens = getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
}

// Função para obter os itens armazenados no localStorage
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []; // Lê os itens do localStorage ou cria um array vazio

// Função para atualizar os itens no localStorage
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens)); // Atualiza os itens no localStorage

loadItens(); // Carrega os itens armazenados quando a página é carregada
