const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sDescricao = document.querySelector('#m-descricao')
const sData = document.querySelector('#m-data') // Certifique-se de que o ID do campo de data está correto
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

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



function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sDescricao.value = itens[index].descricao
    sData.value = itens[index].data || ''; // Certifique-se de que a data seja preenchida ou vazia se indefinida
    id = index
  } else {
    sNome.value = ''
    sDescricao.value = ''
    sData.value = '' // Limpar o campo de data para novos itens
  }
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  // Verificar se a data existe e formatá-la para o padrão brasileiro
  const dataFormatada = item.data ? formatarData(item.data) : 'Data não informada';

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.descricao}</td>
    <td>${dataFormatada}</td> <!-- Exibir a data formatada -->
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

// Função para salvar os dados do formulário
btnSalvar.onclick = e => {
  e.preventDefault(); // Prevenir comportamento padrão do botão

  // Verificar se os campos foram preenchidos corretamente
  if (sNome.value == '' || sDescricao.value == '' || sData.value == '') {
    alert('Preencha todos os campos!')
    return
  }

  // Salvar os dados
  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].descricao = sDescricao.value
    itens[id].data = sData.value // Capturar e salvar a data no formato YYYY-MM-DD
  } else {
    itens.push({
      'nome': sNome.value,
      'descricao': sDescricao.value,
      'data': sData.value // Adicionar a data no formato YYYY-MM-DD
    })
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

// Função para carregar itens da base de dados
function loadItens() {
  itens = getItensBD() || []
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

// Função para formatar a data para DD/MM/YYYY
function formatarData(data) {
  const [ano, mes, dia] = data.split('-'); // Quebra a data no formato YYYY-MM-DD
  return `${dia}/${mes}/${ano}`; // Reorganiza para DD/MM/YYYY
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
