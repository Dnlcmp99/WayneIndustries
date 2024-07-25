const keyFuncionarios = 'funcionarios_db'; 
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const sUsuario = document.querySelector('#m-usuario');
const sSenha = document.querySelector('#m-senha');
const btnSalvar = document.querySelector('#btnSalvar');

let itensFuncionarios; 
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    }

    if (edit) {
        sNome.value = itensFuncionarios[index].nome;
        sFuncao.value = itensFuncionarios[index].funcao;
        sSalario.value = itensFuncionarios[index].salario;
        sUsuario.value = itensFuncionarios[index].usuario;
        sSenha.value = itensFuncionarios[index].senha;
        id = index;
    } else {
        sNome.value = '';
        sFuncao.value = '';
        sSalario.value = '';
        sUsuario.value = '';
        sSenha.value = '';
    }
}

function canEdit() {
    
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        return false; 
    }

    
    const funcao = usuarioLogado.funcao;

    
    const funcoesPermitidasParaEdicao = ['Administrador', 'Supervisor', 'Adm', 'Admin', 'administrador', 'adm', 'admin', 'supervisor', 'SUPERVISOR', 'ADMINISTRADOR', 'ADM', 'ADMIN'];

    
    return funcoesPermitidasParaEdicao.includes(funcao);
}

function editItem(index) {
    
    if (!canEdit()) {
        alert("Você não tem permissão para editar este funcionário.");
        return;
    }

    openModal(true, index);
}

function deleteItem(index) {
    
    if (!canEdit()) {
        alert("Você não tem permissão para excluir este funcionário.");
        return;
    }

    itensFuncionarios.splice(index, 1);
    setItensBD(keyFuncionarios); 
    loadItens(); 
}

function insertItem(item, index) {
    let tr = document.createElement('tr');

    
    const podeEditar = canEdit();

    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.funcao}</td>
        <td>R$ ${item.salario}</td>
        <td>${item.usuario}</td>
        <td>${item.senha}</td>
        <td class="acao">
            ${podeEditar ? `<button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>` : ''}
        </td>
        <td class="acao">
            ${podeEditar ? `<button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>` : ''}
        </td>
    `;

    tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
    if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '' || sUsuario.value == '' || sSenha.value == '') {
        return;
    }

    e.preventDefault();

    if (id !== undefined) {
        itensFuncionarios[id].nome = sNome.value;
        itensFuncionarios[id].funcao = sFuncao.value;
        itensFuncionarios[id].salario = sSalario.value;
        itensFuncionarios[id].usuario = sUsuario.value;
        itensFuncionarios[id].senha = sSenha.value;
    } else {
        itensFuncionarios.push({
            'nome': sNome.value,
            'funcao': sFuncao.value,
            'salario': sSalario.value,
            'usuario': sUsuario.value,
            'senha': sSenha.value
        });
    }

    setItensBD(keyFuncionarios); 
    modal.classList.remove('active');
    loadItens(); 
    id = undefined;
}

function loadItens() {
    itensFuncionarios = getItensBD(keyFuncionarios); 
    tbody.innerHTML = '';
    itensFuncionarios.forEach((item, index) => {
        insertItem(item, index);
    });
}

function getItensBD(key) {
    return JSON.parse(localStorage.getItem(key)) || []; 
}

function setItensBD(key) {
    localStorage.setItem(key, JSON.stringify(itensFuncionarios)); 
}

loadItens(); 
