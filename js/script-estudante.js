const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const acheiForm = document.querySelector('#acheiForm');
const itemSelecionado = document.querySelector('#itemSelecionado');
const descricaoSelecionada = document.querySelector('#descricaoSelecionada');
const dataSelecionada = document.querySelector('#dataSelecionada');

// Capturar o campo de busca
const searchBar = document.querySelector('#searchBar');

// Função para pesquisar e filtrar itens
function searchItems() {
  const searchTerm = searchBar.value.toLowerCase(); // Capturar o valor digitado e converter para minúsculas
  tbody.innerHTML = ''; // Limpar a tabela antes de exibir os itens filtrados

  // Filtrar itens que começam ou contêm o termo de pesquisa
  const filteredItems = itens.filter(item => {
    const itemName = item.nome.toLowerCase();
    return itemName.startsWith(searchTerm) || itemName.includes(searchTerm);
  });

  // Recarregar a tabela com os itens filtrados
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });
}

// Capturar os campos de busca de data completa, mês e ano
const searchDate = document.querySelector('#searchDate');
const searchMonth = document.querySelector('#searchMonth');
const searchYear = document.querySelector('#searchYear');

function searchItems() {
  const searchTerm = searchBar.value.toLowerCase(); // Valor do nome
  const searchDateValue = searchDate.value; // Valor do dia/mês/ano no formato YYYY-MM-DD
  const searchMonthValue = searchMonth.value; // Valor do mês/ano no formato YYYY-MM
  const searchYearValue = searchYear.value; // Valor do ano no formato YYYY

  tbody.innerHTML = ''; // Limpar a tabela antes de exibir os itens filtrados

  // Filtrar itens que começam ou contêm o termo de pesquisa, e verificar as datas
  const filteredItems = itens.filter(item => {
    const itemName = item.nome.toLowerCase();
    const itemDate = item.data || ''; // Garantir que a data exista

    // Extrair o ano, mês e dia do item, se a data estiver disponível
    const [itemYear, itemMonth, itemDay] = itemDate.split('-');

    // Verifica se o nome corresponde
    const matchesName = itemName.startsWith(searchTerm) || itemName.includes(searchTerm);

    // Verificar se a data corresponde:
    const matchesDate = searchDateValue ? itemDate === searchDateValue : true; // Se o dia/mês/ano for fornecido, deve corresponder
    const matchesMonth = searchMonthValue ? `${itemYear}-${itemMonth}` === searchMonthValue : true; // Se o mês/ano for fornecido, deve corresponder
    const matchesYear = searchYearValue ? itemYear === searchYearValue : true; // Se o ano for fornecido, deve corresponder

    // Retornar true se todas as condições forem satisfeitas
    return matchesName && matchesDate && matchesMonth && matchesYear;
  });

  // Recarregar a tabela com os itens filtrados
  filteredItems.forEach((item, index) => {
    insertItem(item, index);
  });
}


// Função para abrir o modal e preencher os campos com o item selecionado
function abrirFormAchei(item) {
  modal.classList.add('active');

  // Preencher os campos ocultos com as informações do item
  itemSelecionado.value = item.nome;
  descricaoSelecionada.value = item.descricao;
  dataSelecionada.value = item.data;

  modal.onclick = (e) => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };
}

// Função para inserir o botão "Achei!" na tabela de itens
function insertItem(item, index) {
  let tr = document.createElement('tr');
  
  // Verificar se a data existe e formatá-la para o padrão brasileiro
  const dataFormatada = item.data ? formatarData(item.data) : 'Data não informada';
  
  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.descricao}</td>
    <td>${dataFormatada}</td>
    <td><button onclick="abrirFormAchei(itens[${index}])" class="bntAchei">Achei!</button></td>
  `;

  tbody.appendChild(tr);
}

// Função para carregar os itens da base de dados
function loadItens() {
  itens = getItensBD() || [];
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

// Função para formatar a data para DD/MM/YYYY
function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

loadItens();
