$("#form").validate(
    {
        rules:{
            login:{
                required: true
            },
            senha:{
                required: true
            }
        },
        messages:{
            login:{
                required: "Campo Obrigatório"
            },
            senha:{
                required: "Campo Obrigatório"
            }
        }
    }
);

async function autenticar() {
    if($("#form").valid()) {
        let login = $("#login").val();
        let senha = $("#senha").val();

        try {
            let resposta = await fetch(`https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`);
            let usuario = await resposta.json();

            if(usuario.id > 0) {
                localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
                window.location.href = "./pages/menuPage.html";
            } else {
                alert("Usuário ou senha inválidos.")
            }
        } catch (error) {
            alert("Erro ao tentar autenticar.")
        }
    }
}

