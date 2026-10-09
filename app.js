// Parte 1 - Manipulação e Validação de Dados

const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "João", valor: 0, status: "pago" },
  { cliente: "Maria", valor: 80, status: "pendente" },
  { cliente: "", valor: 50, status: "pago" },
  { cliente: "Pedro", valor: 200, status: "pago" }
];

const pedidosValidos = pedidos.filter(p => p.cliente.trim() !== "" && p.valor > 0);
const pedidosPagos = pedidosValidos.filter(p => p.status === "pago");

const totalFaturado = pedidosPagos.reduce((acc, p) => acc + p.valor, 0);

const containerPedidos = document.getElementById("saida-pedidos");

pedidosPagos.forEach(p => {
  const pElem = document.createElement("p");
  pElem.textContent = `${p.cliente} — R$ ${p.valor.toFixed(2)}`;
  containerPedidos.appendChild(pElem);
});

const totalElem = document.createElement("p");
totalElem.textContent = `Total faturado: R$ ${totalFaturado.toFixed(2)}`;
totalElem.style.fontWeight = "bold";
containerPedidos.appendChild(totalElem);


// Parte 2 - Buscador de CEP

const formCep = document.getElementById("form-cep");
const inputCep = document.getElementById("input-cep");
const btnCep = document.getElementById("btn-cep");
const statusCep = document.getElementById("status-cep");
const resultadoCep = document.getElementById("resultado-cep");
const listaHistorico = document.getElementById("lista-historico");

const historicoCeps = [];

formCep.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const cepLimpo = inputCep.value.trim().replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    statusCep.textContent = "Por favor, informe um CEP válido com 8 dígitos.";
    resultadoCep.replaceChildren();
    return;
  }

  statusCep.textContent = "Buscando...";
  btnCep.disabled = true;
  resultadoCep.replaceChildren();

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!resposta.ok) {
      throw new Error("Erro na requisição.");
    }

    const dados = await resposta.json();

    if (dados.erro) {
      statusCep.textContent = "CEP não encontrado.";
    } else {
      statusCep.textContent = "";

      const dl = document.createElement("dl");

      const campos = [
        { rotulo: "Rua", valor: dados.logradouro || "Não informado" },
        { rotulo: "Bairro", valor: dados.bairro || "Não informado" },
        { rotulo: "Cidade", valor: dados.localidade },
        { rotulo: "UF", valor: dados.uf }
      ];

      campos.forEach(c => {
        const dt = document.createElement("dt");
        dt.textContent = `${c.rotulo}:`;
        const dd = document.createElement("dd");
        dd.textContent = c.valor;
        dl.append(dt, dd);
      });

      resultadoCep.replaceChildren(dl);

      historicoCeps.push({ cep: cepLimpo, cidade: dados.localidade });
      atualizarHistorico();
    }
  } catch (erro) {
    statusCep.textContent = "Falha na conexão com o servidor de CEP.";
  } finally {
    btnCep.disabled = false;
  }
});

function atualizarHistorico() {
  listaHistorico.replaceChildren();
  historicoCeps.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.cep} - ${item.cidade}`;
    listaHistorico.appendChild(li);
  });
}


// Parte 3 - Mini Pokédex

const formPoke = document.getElementById("form-poke");
const inputPoke = document.getElementById("input-poke");
const btnPoke = document.getElementById("btn-poke");
const statusPoke = document.getElementById("status-poke");
const resultadoPoke = document.getElementById("resultado-poke");

formPoke.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomePoke = inputPoke.value.trim().toLowerCase();

  if (!nomePoke) {
    statusPoke.textContent = "Digite o nome de um Pokémon.";
    return;
  }

  statusPoke.textContent = "Buscando Pokémon...";
  btnPoke.disabled = true;
  resultadoPoke.replaceChildren();

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePoke}`);

    if (resposta.status === 404) {
      statusPoke.textContent = "Pokémon não encontrado.";
      return;
    }

    if (!resposta.ok) {
      throw new Error("Erro na conexão com a API.");
    }

    const dados = await resposta.json();
    statusPoke.textContent = "";

    const titulo = document.createElement("h3");
    titulo.textContent = dados.name.toUpperCase();

    const img = document.createElement("img");
    img.src = dados.sprites.front_default;
    img.alt = dados.name;

    const tiposTexto = dados.types.map(t => t.type.name).join(", ");
    const paragrafoTipos = document.createElement("p");
    paragrafoTipos.textContent = `Tipos: ${tiposTexto}`;

    resultadoPoke.append(titulo, img, paragrafoTipos);
  } catch (erro) {
    statusPoke.textContent = "Falha na conexão ao buscar o Pokémon.";
  } finally {
    btnPoke.disabled = false;
  }
});
