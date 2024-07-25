const keySeguranca = 'seguranca_db'; 
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sModelo = document.querySelector('#m-modelo');
const sFuncao = document.querySelector('#m-funcao');
const sQuantidade = document.querySelector('#m-quantidade');
const btnSalvar = document.querySelector('#btnSalvar');

let itensSeguranca; 
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    }

    if (edit) {
        sModelo.value = itensSeguranca[index].modelo;
        sFuncao.value = itensSeguranca[index].funcao;
        sQuantidade.value = itensSeguranca[index].quantidade;
        id = index;
    } else {
        sModelo.value = '';
        sFuncao.value = '';
        sQuantidade.value = '';
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
        alert("Você não tem permissão para editar este item.");
        return;
    }

    openModal(true, index);
}

function deleteItem(index) {
    
    if (!canEdit()) {
        alert("Você não tem permissão para excluir este item.");
        return;
    }

    itensSeguranca.splice(index, 1);
    setItensBD(keySeguranca); 
    loadItens(); 
}

function insertItem(item, index) {
    let tr = document.createElement('tr');

    
    const podeEditar = canEdit();

    tr.innerHTML = `
        <td>${item.modelo}</td>
        <td>${item.funcao}</td>
        <td>${item.quantidade}</td>
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
    if (sModelo.value == '' || sFuncao.value == '' || sQuantidade.value == '') {
        return;
    }

    e.preventDefault();

    if (id !== undefined) {
        itensSeguranca[id].modelo = sModelo.value;
        itensSeguranca[id].funcao = sFuncao.value;
        itensSeguranca[id].quantidade = sQuantidade.value;
    } else {
        itensSeguranca.push({
            'modelo': sModelo.value,
            'funcao': sFuncao.value,
            'quantidade': sQuantidade.value
        });
    }

    setItensBD(keySeguranca); 
    modal.classList.remove('active');
    loadItens(); 
    id = undefined;
}

function loadItens() {
    itensSeguranca = getItensBD(keySeguranca); 
    tbody.innerHTML = '';
    itensSeguranca.forEach((item, index) => {
        insertItem(item, index);
    });
}

function getItensBD(key) {
    return JSON.parse(localStorage.getItem(key)) || []; 
}

function setItensBD(key) {
    localStorage.setItem(key, JSON.stringify(itensSeguranca)); 
}

loadItens(); 
