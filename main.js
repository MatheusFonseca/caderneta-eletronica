class LocalStorageCrtl {

  constructor () {
    this.clientes = this.getClientes();
  }

  getClientes() {
    if(localStorage.getItem('clientes') === null) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem('clientes'));
    }
  }

  saveCliente(cliente) {
    this.clientes = this.getClientes();
    this.clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

}

class UI {

  constructor () {
    this.uiSelectors = {
      addClientBtn: '#addClientBtn',
      addClientInput: '#addClientInput'
    };
  }

  getSelectors () {
    return this.uiSelectors;
  }

  clearInput (selector) {
    document.querySelector(this.uiSelectors[selector]).value = '';
  }
}

class ClienteCtrl{

  constructor (UI, localStorageCrtl) {
    this.ui = UI;
    this.lsCrtl = localStorageCrtl;
    this.uiSelectors = this.ui.getSelectors();
    this.clientes = localStorageCrtl.getClientes();
    this.idGenerator = () => Math.random().toString(36).substr(2, 9);
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
        nome: nomeCliente
      }
      this.clientes.push(cliente);
      this.lsCrtl.saveCliente(cliente);
    }

    this.ui.clearInput('addClientInput');

    e.preventDefault();
 
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

  // Adicionando listeners
  document.querySelector(uiSelectors.addClientBtn).addEventListener('click', evt => clienteCtrl.addCliente(evt)); // Estudar por que a arrow function muda o 'this' dentro do event handler


  

}
