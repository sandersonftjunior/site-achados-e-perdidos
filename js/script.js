const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sDescricao = document.querySelector('#m-descricao')
const sData = document.querySelector('#m-data') // Certifique-se de que o ID do campo de data está correto
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

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
