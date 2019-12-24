class LocalStorageCrtl {

  constructor () {
    this.clientes = this.getClientes();
    this.vendas = this.getVendas();
  }

  getClientes() {
    if(localStorage.getItem('clientes') === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem('clientes'));
    }
  }

  getSaldoCliente(id){
    this.clientes.forEach(cliente => {
      if(cliente.id == id) return cliente.saldo;
    });
    return null;
  }

  updateSaldoCliente(id, novoSaldo){

    this.clientes = this.getClientes();

    this.clientes.forEach(cliente => {
      if(cliente.id == id) cliente.saldo = novoSaldo;
    });

    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

  getVendas() {
    if(localStorage.getItem('vendas') === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem('vendas'));
    }
  }

  saveCliente(cliente) {
    this.clientes = this.getClientes();
    this.clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

  saveVenda(venda){
    this.vendas = this.getVendas();
    this.vendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(this.vendas));
  }

}

class UI {

  constructor () {
    this.uiSelectors = {
      addClientBtn: '#addClientBtn',
      addClientInput: '#addClientInput',
      removeProdBtn: '.form__button--remove',
      addProdutoBtn: '#addProdutoBtn',
      addVendaForm: '.form--multiline',
      addVendaConfirm: '.form__button--confirm',
      vendaClienteInput: '.form__input--user',
      vendaDataInput: '.form__input--date',
      produtoVenda: '.form__produto'
    };
  }

  getSelectors () {
    return this.uiSelectors;
  }

  clearInput (selector) {
    document.querySelector(this.uiSelectors[selector]).value = '';
  }

  limparFormVenda(){
    
    this.clearInput('vendaDataInput');
    const produtosArrayInput = Array.from(document.querySelectorAll(this.uiSelectors.produtoVenda));

    produtosArrayInput.forEach(produtoInput => {

      // Limpa o primeiro e apaga os outros
      if(produtoInput.previousElementSibling.classList.contains('form__input--date')) {

        const nomeProdutoInput = produtoInput.firstElementChild;
        nomeProdutoInput.value = '';
        
        const dataProdutoInput = nomeProdutoInput.nextElementSibling;
        dataProdutoInput.value = '';
  
        const valorProdutoInput = dataProdutoInput.nextElementSibling.value = '';

      } else {
        produtoInput.remove();
      }


    });

  }

  setClientes(clientes){

    const vendaClienteInput = document.querySelector(this.uiSelectors.vendaClienteInput);

    clientes.forEach(cliente => {
      const option = document.createElement('option');
      option.setAttribute('value', cliente.id);
      option.innerText = cliente.nome;
      vendaClienteInput.appendChild(option);
    });
  }

  updateSetClientes(cliente){
    const vendaClienteInput = document.querySelector(this.uiSelectors.vendaClienteInput);

    const option = document.createElement('option');
    option.setAttribute('value', cliente.id);
    option.innerText = cliente.nome;
    vendaClienteInput.appendChild(option);

  }

  addProduto(e) {

    e.preventDefault();
    
    const addBtn = e.currentTarget;
    const formulario = document.querySelector(this.uiSelectors.addVendaForm);
    // Criando um novo elemento do produto
    const novoProduto = document.createElement('fieldset');
    novoProduto.classList = 'form__produto';

    // Novo campo de nome do produto
    const novoNome = document.createElement('input');
    novoNome.classList = 'form__input';
    novoNome.setAttribute('type', 'text');
    novoNome.setAttribute('placeholder', 'Produto');

    // Novo campo de quantidade do produto
    const novaQtde = document.createElement('input');
    novaQtde.classList = 'form__input';
    novaQtde.setAttribute('type', 'text');
    novaQtde.setAttribute('value', '1');
    novaQtde.setAttribute('min', '0');

    // Novo campo de valor do produto
    const novoValor = document.createElement('input');
    novoValor.classList = 'form__input';
    novoValor.setAttribute('type', 'text');
    novoValor.setAttribute('placeholder', 'Valor');

    // Novo X de remover
    const novoBotao = document.createElement('button');
    novoBotao.classList = 'form__button form__button--remove';
    novoBotao.innerHTML = '<i class="fa fa-times"></i>';

    // Ligando os novos campos ao novo fieldset
    novoProduto.appendChild(novoNome);
    novoProduto.appendChild(novaQtde);
    novoProduto.appendChild(novoValor);
    novoProduto.appendChild(novoBotao);

    // Inserindo na UI no final da lista
    formulario.insertBefore(novoProduto, addBtn);
  }

  removeProduto(e) {

    e.preventDefault();
    const produto = e.target.parentElement.parentElement;

    // Usando event delegation 
    if(e.target.classList.contains('fa-times')) {

      // Se ele for o primeiro produto ele nao pode ser apagado
      if(!produto.previousElementSibling.classList.contains('form__input--date')) {

        produto.remove();
      }

    }
  }
}

class ClienteCtrl{

  constructor (UI, localStorageCrtl) {
    this.ui = UI;
    this.lsCrtl = localStorageCrtl;
    this.uiSelectors = this.ui.getSelectors();
    this.clientes = localStorageCrtl.getClientes();
    this.idGenerator = () => Math.random().toString(36).substr(2, 9);
    this.setClientesUI();
  }

  setClientesUI(){
    this.ui.setClientes(this.clientes);
  }

  addCliente(e) {

    e.preventDefault();
    const addClientInput = document.querySelector(this.uiSelectors.addClientInput);
    const nomeCliente = addClientInput.value;

    // filtrando somente o nome dos clientes
    this.cliente = this.lsCrtl.getClientes();
    const nomes = this.clientes.map(cliente => cliente.nome.toLowerCase());
    
    // Se o nome nao for repetido E nao for vazio
    if(!nomes.includes(nomeCliente.toLowerCase()) && nomeCliente != ''){

      const cliente = {
        id: this.idGenerator(),
        nome: nomeCliente, 
        saldo: 0
      }
      this.clientes.push(cliente);
      this.lsCrtl.saveCliente(cliente);
      this.ui.updateSetClientes(cliente);
    }

    this.ui.clearInput('addClientInput');

  }

}

class VendaCtrl {

  constructor(UI, localStorageCrtl){
    this.ui = UI;
    this.lsCrtl = localStorageCrtl;
    this.uiSelectors = this.ui.getSelectors();
    this.vendas = localStorageCrtl.getVendas();
    this.idGenerator = () => Math.random().toString(36).substr(2, 9);
  }

  addVenda(e) {

    e.preventDefault();

    // Capturando valores do formulario
    const clienteInput = document.querySelector(this.uiSelectors.vendaClienteInput);
    const clienteNome = clienteInput.options[clienteInput.selectedIndex].text;
    const clienteID = clienteInput.value;

    const dataInput = document.querySelector(this.uiSelectors.vendaDataInput);
    const data = dataInput.value;

    const produtosArrayInput = Array.from(document.querySelectorAll(this.uiSelectors.produtoVenda));
    const produtosArray = [];
    let custoTotal = 0;

    produtosArrayInput.forEach(produtoInput => {
      const produto = {};

      const nomeProdutoInput = produtoInput.firstElementChild;
      produto.nomeProduto = nomeProdutoInput.value;
      
      const qtdeProdutoInput = nomeProdutoInput.nextElementSibling;
      produto.qtde = qtdeProdutoInput.value;

      const valorProdutoInput = qtdeProdutoInput.nextElementSibling;
      produto.valor = valorProdutoInput.value;

      custoTotal += produto.qtde * parseFloat(produto.valor);

      produtosArray.push(produto);

    });

    const venda = {
      id: this.idGenerator(),
      cliente: {
        id: clienteID,
        nome: clienteNome
      },
      data: data,
      produtos: produtosArray
    }

    this.lsCrtl.saveVenda(venda);
    const saldoAtual = this.lsCrtl.getSaldoCliente(clienteID);
    this.lsCrtl.updateSaldoCliente(clienteID, saldoAtual + custoTotal);
    this.ui.limparFormVenda();
  }

}


// Inicializando...
document.addEventListener('DOMContentLoaded', app());

// Função Principal
function app() {

  // Inicializando controllers
  const ui = new UI();
  const uiSelectors = ui.getSelectors();
  const localStorageCrtl = new LocalStorageCrtl();
  const clienteCtrl = new ClienteCtrl(ui, localStorageCrtl);
  const vendaCtrl = new VendaCtrl(ui, localStorageCrtl);

  // Adicionando listeners
  document.querySelector(uiSelectors.addClientBtn).addEventListener('click', e => clienteCtrl.addCliente(e)); // Usar arrow function por causa do lexical this
  document.querySelector(uiSelectors.addProdutoBtn).addEventListener('click', e => ui.addProduto(e));
  document.querySelector(uiSelectors.addVendaForm).addEventListener('click', e => ui.removeProduto(e));    // Usando event delegation 
  document.querySelector(uiSelectors.addVendaConfirm).addEventListener('click', e => vendaCtrl.addVenda(e));
}
