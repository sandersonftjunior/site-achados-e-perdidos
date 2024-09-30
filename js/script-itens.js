const showForm = document.querySelector('#showForm');
const divForm = document.querySelector('.divForm');
const blur = document.querySelector('#container');
const btnSalvar = document.querySelector('#btnSalvar');
const itemInput = document.querySelector('#item');
const descricaoInput = document.querySelector('#descrição');
const dataInput = document.querySelector('#data');
const tableBody = document.createElement('tbody');
let editingRow = null; // Variável para armazenar a linha sendo editada

// Adiciona o tbody na tabela
document.querySelector('#divTable table').appendChild(tableBody);

// Carrega os itens do localStorage na tabela
loadItemsFromLocalStorage();

// Função para exibir o formulário
function callForm() {
    divForm.classList.add('visible');
    blur.classList.add('blur');
}

// Função para ocultar o formulário
function hideForm(event) {
    if (!divForm.contains(event.target) && event.target !== showForm) {
        divForm.classList.remove('visible');
        blur.classList.remove('blur');
    }
}

// Função para adicionar um item na tabela
function addItemToTable(item, descricao, data) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${item}</td>
        <td>${descricao}</td>
        <td>${data}</td>
        <td><button onclick="editItem(this)"><i class='bx bx-edit-alt'></i></button></td>
        <td><button onclick="deleteItem(this)"><i class='bx bx-trash'></i></button></td>
    `;

    tableBody.appendChild(row);
}

// Função para salvar o item (novo ou editado)
function saveItem(event) {
    event.preventDefault(); // Evita o envio do formulário

    const item = itemInput.value;
    const descricao = descricaoInput.value;
    const data = dataInput.value;

    if (editingRow) {
        // Se estiver editando, atualiza a linha existente
        editingRow.cells[0].textContent = item;
        editingRow.cells[1].textContent = descricao;
        editingRow.cells[2].textContent = data;

        // Atualiza os dados no localStorage
        updateLocalStorage();
        editingRow = null; // Reseta a variável após a edição
    } else {
        // Se não estiver editando, adiciona um novo item
        addItemToTable(item, descricao, data);
        saveToLocalStorage(item, descricao, data); // Salva o novo item no localStorage
    }

    // Limpa o formulário
    clearForm();

    // Fecha o formulário e remove o desfoque
    divForm.classList.remove('visible');
    blur.classList.remove('blur');
}

// Função para editar um item (abre o formulário com os dados preenchidos)
function editItem(button) {
    // Obtém a linha que está sendo editada
    editingRow = button.parentElement.parentElement;

    // Preenche o formulário com os dados da linha
    itemInput.value = editingRow.cells[0].textContent;
    descricaoInput.value = editingRow.cells[1].textContent;
    dataInput.value = editingRow.cells[2].textContent;

    // Exibe o formulário para edição
    callForm();
}

// Função para excluir um item da tabela
function deleteItem(button) {
    const row = button.parentElement.parentElement;
    tableBody.removeChild(row);
    updateLocalStorage(); // Atualiza o localStorage após a exclusão
}

// Função para salvar novos itens no localStorage
function saveToLocalStorage(item, descricao, data) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.push({ item, descricao, data });
    localStorage.setItem('items', JSON.stringify(items));
}

// Função para atualizar o localStorage com a tabela atual
function updateLocalStorage() {
    const items = [];
    for (let row of tableBody.rows) {
        items.push({
            item: row.cells[0].textContent,
            descricao: row.cells[1].textContent,
            data: row.cells[2].textContent,
        });
    }
    localStorage.setItem('items', JSON.stringify(items));
}

// Função para carregar itens do localStorage
function loadItemsFromLocalStorage() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.forEach(({ item, descricao, data }) => {
        addItemToTable(item, descricao, data);
    });
}

// Função para limpar o formulário
function clearForm() {
    itemInput.value = '';
    descricaoInput.value = '';
    dataInput.value = '';
}

// Eventos para abrir e fechar o formulário
showForm.addEventListener('click', callForm);
document.addEventListener('click', hideForm);
btnSalvar.addEventListener('click', saveItem);
