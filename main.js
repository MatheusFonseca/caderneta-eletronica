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

  getSaldoCliente(pID){
    
    for(let i = 0; i < this.clientes.length; i++){
      if(this.clientes[i].id == pID) return this.clientes[i].saldo;
    }
    return null;
  }

  updateSaldoCliente(id, novoSaldo){

    this.clientes = this.getClientes();

    this.clientes.forEach(cliente => {
      if(cliente.id == id) cliente.saldo = parseFloat(novoSaldo.toFixed(2));
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

  constructor (localStorageCrtl) {
    this.lsCrtl = localStorageCrtl;
    this.uiSelectors = {
      addClientBtn: '#addClientBtn',
      addClientInput: '#addClientInput',
      removeProdBtn: '.form__button--remove',
      addProdutoBtn: '#addProdutoBtn',
      addVendaForm: '.form--multiline',
      addVendaConfirm: '.form__button--confirm',
      vendaClienteInput: '.form__input--user',
      vendaDataInput: '.form__input--date',
      produtoVenda: '.form__produto',
      listaVendas: '.list'
    };
    this.loadVendas();
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

  loadVendas() {

    const clientes = this.lsCrtl.getClientes();
    let vendas = this.lsCrtl.getVendas();

    // Lista as compras de cada cliente
    clientes.forEach(cliente => {
      
      const vendasCliente = vendas.filter(venda => venda.cliente.id == cliente.id);

      // Bloco inteiro do cliente
      const blocoCliente = document.createElement('li');
      blocoCliente.classList.value = "list__user";

      // Nome
      const nomeCliente = document.createElement('h3');
      nomeCliente.classList.value = "list__user-name";
      nomeCliente.innerText = cliente.nome;
      blocoCliente.appendChild(nomeCliente);

      // Lista de compras do cliente
      const listaCliente = document.createElement('ul');
      listaCliente.classList.value = "list__user-info";
      blocoCliente.appendChild(listaCliente);

      // filtra datas distinct 
      const datas = vendasCliente.map(venda => venda.data).filter((data, indice, self) => self.indexOf(data) === indice);

      // Lista as vendas do cliente em cada data
      datas.forEach(data => {

        // Compras de X cliente em Y data
        const vendasClientesData = vendasCliente.filter(venda => venda.data == data);

        // Data da(s) compra(s)
        const dataUI = document.createElement('li');
        dataUI.classList.value = 'list__date';
        dataUI.innerText = data;
        listaCliente.appendChild(dataUI);

        // Compras de X cliente em Y data
        vendasClientesData.forEach(venda => {

          // Todos os produtos daquela venda
          const produtos = venda.produtos;
          produtos.forEach(produto => {

            const produtoInput = document.createElement('li');
            produtoInput.classList.value = 'list__entry';
            listaCliente.appendChild(produtoInput);
  
            const produtoNome = document.createElement('span');
            produtoNome.classList.value = 'list__entry-name';
            produtoNome.innerText = `${produto.qtde}x ${produto.nomeProduto}`;
            produtoInput.appendChild(produtoNome);

            const produtoValor = document.createElement('span');
            produtoValor.classList.value = 'list__entry-value';
            produtoValor.innerText = `R$ ${(produto.valor * produto.qtde).toFixed(2).toString().replace('.', ',')}`;
            produtoInput.appendChild(produtoValor);

          });

        });

      });

      // Mostra o saldo do cliente
      const saldo = document.createElement('li');
      saldo.classList.value = 'list__balance list__balance--neg';
      listaCliente.appendChild(saldo);

      // Nome Saldo
      const nomeSaldo = document.createElement('span');
      nomeSaldo.classList.value = 'list__entry-name';
      nomeSaldo.innerText = `Saldo ${cliente.nome}:`;
      saldo.appendChild(nomeSaldo);

      // Saldo
      const saldoValor = document.createElement('span');
      saldoValor.classList.value = 'list__entry-value';
      saldoValor.innerText = `R$ ${cliente.saldo.toFixed(2).toString().replace('.', ',')}`;
      saldo.appendChild(saldoValor);

      // Insere na UI
      const listaVendas = document.querySelector(this.uiSelectors.listaVendas);
      listaVendas.appendChild(blocoCliente);

    });



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

    let valido = {
      valor: true,
      mensagem: 'A venda foi inserida com sucesso!'
    }

    // Capturando valores do formulario
    const clienteInput = document.querySelector(this.uiSelectors.vendaClienteInput);

    let clienteNome = null;
    let clienteID = null;

    // Se existir algum cliente cadastrado
    if(clienteInput.options.length > 0){
      clienteNome = clienteInput.options[clienteInput.selectedIndex].text;
      clienteID = clienteInput.value;
    } else {
      valido.valor = false;
      valido.mensagem = 'É necessário cadastrar um Cliente antes';
    }

    const dataInput = document.querySelector(this.uiSelectors.vendaDataInput);
    let dataString = dataInput.value;
    // expressão regular que valida datas no formato DD/MM/AAAA
    const dataRegex = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
    
    // Formatando a data
    const parts = dataString.split(/-/);
    dataString = [ parts[2], parts[1], parts[0] ].join('/');

    if(!dataRegex.test(dataString.replace(/-/g, '/')) && valido.valor){
      valido.valor = false;
      valido.mensagem = 'Insira uma data válida';
    }

    const produtosArrayInput = Array.from(document.querySelectorAll(this.uiSelectors.produtoVenda));
    const produtosArray = [];
    let custoTotal = 0;
    // Regex para os produtos
    const qtdeRegex = /^0[1-9]$|^[1-9][0-9]?$|^100$/; // 1 a 100
    const valorRegex = /^[0-9][0-9]?[0-9]?([,.][0-9])?[0-9]?$/; // entre 0 (incluso) e 1000 (não incluso) com decimais (2 casas)

    produtosArrayInput.forEach(produtoInput => {
      const produto = {};

      const nomeProdutoInput = produtoInput.firstElementChild;
      produto.nomeProduto = nomeProdutoInput.value;
      
      const qtdeProdutoInput = nomeProdutoInput.nextElementSibling;
      produto.qtde = qtdeProdutoInput.value;

      const valorProdutoInput = qtdeProdutoInput.nextElementSibling;
      produto.valor = parseFloat(valorProdutoInput.value.replace(',', '.'));

      if(produto.nomeProduto == '' && valido.valor){
        valido.valor = false;
        valido.mensagem = 'Insira o nome do produto';

      } else if(!qtdeRegex.test(produto.qtde) && valido.valor) {
        valido.valor = false;
        valido.mensagem = `Insira a quantidade do produto ${produto.nomeProduto}`;
        
      } else if(!valorRegex.test(produto.valor) && valido.valor) {
        valido.valor = false;
        valido.mensagem = `Insira o valor do produto ${produto.nomeProduto}`;
      }

      custoTotal += produto.qtde * produto.valor;

      produtosArray.push(produto);

    });

    // Se tudo estiver correto a venda é cadastrada, senão, uma mensagem personalizada de erro é mostrada
    if(valido.valor) {

      const venda = {
        id: this.idGenerator(),
        cliente: {
          id: clienteID,
          nome: clienteNome
        },
        data: dataString,
        produtos: produtosArray
      }

      this.lsCrtl.saveVenda(venda);
      const saldoAtual = this.lsCrtl.getSaldoCliente(clienteID);
      this.lsCrtl.updateSaldoCliente(clienteID, saldoAtual + custoTotal);
      this.ui.limparFormVenda();

    } else {
      alert(valido.mensagem);
    }

  }

}


// Inicializando...
document.addEventListener('DOMContentLoaded', app());

// Função Principal
function app() {

  // Inicializando controllers
  const localStorageCrtl = new LocalStorageCrtl();
  const ui = new UI(localStorageCrtl);
  const uiSelectors = ui.getSelectors();
  const clienteCtrl = new ClienteCtrl(ui, localStorageCrtl);
  const vendaCtrl = new VendaCtrl(ui, localStorageCrtl);

  // Adicionando listeners
  document.querySelector(uiSelectors.addClientBtn).addEventListener('click', e => clienteCtrl.addCliente(e)); // Usar arrow function por causa do lexical this
  document.querySelector(uiSelectors.addProdutoBtn).addEventListener('click', e => ui.addProduto(e));
  document.querySelector(uiSelectors.addVendaForm).addEventListener('click', e => ui.removeProduto(e));    // Usando event delegation 
  document.querySelector(uiSelectors.addVendaConfirm).addEventListener('click', e => vendaCtrl.addVenda(e));
}
