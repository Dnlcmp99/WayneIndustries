const keyVeiculos = 'veiculos_db'; 
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sModelo = document.querySelector('#m-modelo');
const sDepartamento = document.querySelector('#m-departamento');
const sAno = document.querySelector('#m-ano');
const btnSalvar = document.querySelector('#btnSalvar');

let itensVeiculos; 
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    }

    if (edit) {
        sModelo.value = itensVeiculos[index].modelo;
        sDepartamento.value = itensVeiculos[index].departamento;
        sAno.value = itensVeiculos[index].ano;
        id = index;
    } else {
        sModelo.value = '';
        sDepartamento.value = '';
        sAno.value = '';
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

    itensVeiculos.splice(index, 1);
    setItensBD(keyVeiculos); 
    loadItens(); 
}

function insertItem(item, index) {
    let tr = document.createElement('tr');

    
    const podeEditar = canEdit();

    tr.innerHTML = `
        <td>${item.modelo}</td>
        <td>${item.departamento}</td>
        <td>${item.ano}</td>
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
    if (sModelo.value == '' || sDepartamento.value == '' || sAno.value == '') {
        return;
    }

    e.preventDefault();

    if (id !== undefined) {
        itensVeiculos[id].modelo = sModelo.value;
        itensVeiculos[id].departamento = sDepartamento.value;
        itensVeiculos[id].ano = sAno.value;
    } else {
        itensVeiculos.push({
            'modelo': sModelo.value,
            'departamento': sDepartamento.value,
            'ano': sAno.value
        });
    }

    setItensBD(keyVeiculos); 
    modal.classList.remove('active');
    loadItens(); 
    id = undefined;
}

function loadItens() {
    itensVeiculos = getItensBD(keyVeiculos); 
    tbody.innerHTML = '';
    itensVeiculos.forEach((item, index) => {
        insertItem(item, index);
    });
}

function getItensBD(key) {
    return JSON.parse(localStorage.getItem(key)) || []; 
}

function setItensBD(key) {
    localStorage.setItem(key, JSON.stringify(itensVeiculos)); 
}

loadItens(); 
