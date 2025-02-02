const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const btnSalvar = document.querySelector('#btnSalvar');
const input = document.getElementById('identificador');
const button = document.getElementById('trocarBtn');
const text = document.getElementById('t-txt');

let itens;
let id;
let tipo = 'CNPJ'; // Variável para armazenar o tipo (CPF ou CNPJ)

// Acessibilidade  
const darkModeBtn = document.getElementById('darkModeBtn');
const iconLight = document.getElementById('icon-light');
const iconDark = document.getElementById('icon-dark');
const body = document.querySelector('body');

darkModeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    iconLight.style.display = iconLight.style.display === 'none' ? 'block' : 'none';
    iconDark.style.display = iconDark.style.display === 'none' ? 'block' : 'none';

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Ajuste de fontes
const aumentarFonteBtn = document.getElementById('increaseFontSize');
const diminuirFonteBtn = document.getElementById('decreaseFontSize');
const fonteNormal = document.getElementById('normalFontSize');
let tamanhoFonte = 100;
let tamanhDiferenca = 10;
let numClicks = 0;

// Função para aumentar o tamanho da fonte
aumentarFonteBtn.addEventListener('click', () => {
    if (numClicks < 3) {
        tamanhoFonte = tamanhoFonte + tamanhDiferenca;
        document.body.style.fontSize = tamanhoFonte + '%';
        numClicks++;
    } else {
        alert('Limite máximo de zoom');
    };
});

// Função para diminuir o tamanho da fonte
diminuirFonteBtn.addEventListener('click', () => {
    if (numClicks > -3) {
        tamanhoFonte = tamanhoFonte - tamanhDiferenca;
        document.body.style.fontSize = tamanhoFonte + '%';
        numClicks--;
    } else {
        alert('Limite mínimo de zoom');
    };
});

fonteNormal.addEventListener('click', function(){
    numClicks = 0;
    tamanhoFonte = 100;
    document.body.style.fontSize = tamanhoFonte + '%';
});

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        iconLight.style.display = 'none';
        iconDark.style.display = 'block';
    } else {
        iconLight.style.display = 'block';
        iconDark.style.display = 'none';
    }
});

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        input.value = itens[index].funcao;
        tipo = itens[index].tipo;
        id = index;
        button.textContent = tipo === 'CPF' ? 'Trocar para CNPJ' : 'Trocar para CPF';
        input.placeholder = tipo === 'CPF' ? 'Trocar para CNPJ' : 'Trocar para CPF';
    } else {
        input.value = '';
        tipo = 'CPF'; 
        button.textContent = 'Trocar para CNPJ';
        input.placeholder = 'Digite seu CPF (11 dígitos)';
    }
}

button.addEventListener('click', function(event) {
    if (input.placeholder === "Digite seu CNPJ (14 dígitos)") {
        input.placeholder = "Digite seu CPF (11 dígitos)";
        button.textContent = "Trocar para CNPJ";
        tipo = 'CPF';
        text.textContent = 'CPF:'
    } else {
        input.placeholder = "Digite seu CNPJ (14 dígitos)";
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
    return valor.replace(/(^\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function aplicarMascara(event) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (tipo === 'CPF') {
        if (valor.length > 11) valor = valor.substring(0, 11); // Limita a 11 dígitos
        // Aplica a máscara de CPF
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        if (valor.length > 14) valor = valor.substring(0, 14); // Limita a 14 dígitos
        // Aplica a máscara de CNPJ
        valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{4})(\d)/, '$1/$2-$3');
    }

    event.target.value = valor; // Atualiza o valor do campo com a máscara aplicada
}

// Adiciona o evento ao campo de entrada
input.addEventListener('input', aplicarMascara);

btnSalvar.onclick = e => {
    e.preventDefault();
    let valor = input.value.trim().replace(/\D/g, ''); // Remove caracteres não numéricos antes de validar

    if (tipo === 'CPF') {
        if (valor.length !== 11) {
            alert('O CPF deve conter exatamente 11 dígitos.');
            return;
        }
    } else {
        if (valor.length !== 14) {
            alert('O CNPJ deve conter exatamente 14 dígitos.');
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
    
    let valorFormatado = item.tipo === 'CPF' ? formatarCPF(item.funcao) : formatarCNPJ(item.funcao);

    tr.innerHTML = `
        <td>${valorFormatado}</td>
        <td>${item.tipo}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class="fa-solid icon-edit fa-pen-to-square"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='fa icon-trash fa-trash'></i></button>
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
