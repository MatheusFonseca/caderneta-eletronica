class UI {

  constructor () {
    this.clientes = [];
    this.uiSelectors = {
      addClientBtn: '#addClientBtn',
      addClientInput: '#addClientInput'
    };
    this.getClientes();
  }

  getClientes(){
    if(localStorage.getItem('clientes') === null) {
      this.clientes = [];
    } else {
      this.clientes = JSON.parse(localStorage.getItem('clientes'));
    }
  }

  getSelectors () {
    return this.uiSelectors;
  }

}

class ClienteCtrl{

  constructor (UI) {
    this.ui = UI;
    this.uiSelectors = this.ui.getSelectors();
  }

  addCliente(e) {

    const addClientInput = document.querySelector(this.uiSelectors.addClientInput);
    const nomeCliente = addClientInput.value;

    // Adicionar na localStorage - Criar um lsCtrl

    e.preventDefault();
    console.log(nomeCliente);
 
  }

}

// const arrClientes = ["Ana", "Maria"];
// localStorage.setItem('clientes', JSON.stringify(arrClientes));

// Inicializando...
document.addEventListener('DOMContentLoaded', app());

// Função Principal
function app() {

  // Inicializando controllers
  const ui = new UI();
  const uiSelectors = ui.getSelectors();
  const clienteCtrl = new ClienteCtrl(ui);

  // Adicionando listeners
  document.querySelector(uiSelectors.addClientBtn).addEventListener('click', evt => clienteCtrl.addCliente(evt)); // Estudar por que a arrow function muda o 'this' dentro do event handler


  

}
