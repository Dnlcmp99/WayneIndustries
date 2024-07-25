
function logar() {
    var usuario = document.getElementById('user').value;
    var senha = document.getElementById('senha').value;

    var funcionarios = JSON.parse(localStorage.getItem('funcionarios_db')) || []; // 
    var found = funcionarios.find(function(funcionario) {
        return funcionario.usuario === usuario && funcionario.senha === senha;
    });

    if (found) {
        alert("Sucesso");
        localStorage.setItem('usuarioLogado', JSON.stringify(found)); 
        location.href = "/html/home.html"; 
    } else if (usuario === "admin" && senha === "admin123") {
        alert("Sucesso (administrador)");
        localStorage.setItem('usuarioLogado', JSON.stringify({ usuario: 'admin', senha: 'admin123', funcao: 'Administrador' }));
        location.href = "/html/home.html"; 
    } else {
        alert("Usuário ou senha incorreta");
    }
}