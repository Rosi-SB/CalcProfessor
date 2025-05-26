// Configurações para facilitar futuras modificações
const CONFIG = {
  // Formato de moeda
  moeda: "BRL",
  // Desconto de INSS (percentual) - pode ser ajustado conforme necessário
  descontoINSS: 0.11, // 0% por padrão, pode ser alterado
  // Multiplicador para valores extras (ex: adicional noturno)
  multiplicadorExtra: 1,
};

// Alterna exibição das instruções
function toggleInstrucoes() {
  const instrucoes = document.getElementById("instrucoes");
  instrucoes.style.display =
    instrucoes.style.display === "none" ? "block" : "none";
}

// Função para formatar valor em Real brasileiro
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: CONFIG.moeda,
  }).format(valor);
}

// Função principal de cálculo
function calcularPagamento(horas, valorHora) {
  const valorBruto = horas * valorHora * CONFIG.multiplicadorExtra;
  const desconto = valorBruto * CONFIG.descontoINSS;
  const valorLiquido = valorBruto - desconto;

  return {
    bruto: valorBruto,
    desconto: desconto,
    liquido: valorLiquido,
    horas: horas,
    valorHora: valorHora,
  };
}

// Função para exibir o resultado
function exibirResultado(calculo) {
  const resultadoDiv = document.getElementById("resultado");
  const valorTotalSpan = document.getElementById("valorTotal");
  const detalhesDiv = document.getElementById("detalhes");

  valorTotalSpan.textContent = formatarMoeda(calculo.liquido);

  let detalhesTexto = `${calculo.horas} horas × ${formatarMoeda(
    calculo.valorHora
  )} = ${formatarMoeda(calculo.bruto)}`;

  if (calculo.desconto > 0) {
    detalhesTexto += `<br>Desconto INSS 11%: ${formatarMoeda(calculo.desconto)}`;
  }

  detalhesDiv.innerHTML = detalhesTexto;

  resultadoDiv.classList.add("show");
}

// Event listener para o formulário
document
  .getElementById("calculatorForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const horas = parseFloat(document.getElementById("horas").value);
    const valorHora = parseFloat(document.getElementById("valorHora").value);

    if (horas && valorHora && horas > 0 && valorHora > 0) {
      const calculo = calcularPagamento(horas, valorHora);
      exibirResultado(calculo);
    } else {
      alert("Por favor, preencha todos os campos com valores válidos.");
    }
  });

// Função para limpar resultado quando campos são alterados
function limparResultado() {
  document.getElementById("resultado").classList.remove("show");
}

// Event listeners para limpar resultado quando inputs mudam
document.getElementById("horas").addEventListener("input", limparResultado);
document.getElementById("valorHora").addEventListener("input", limparResultado);

// Formatação automática do campo valor da hora (opcional)
document.getElementById("valorHora").addEventListener("blur", function () {
  const valor = parseFloat(this.value);
  if (!isNaN(valor)) {
    this.value = valor.toFixed(2);
  }
});


// Botão de novo cálculo
document
  .getElementById("btnNovoCalculo")
  .addEventListener("click", function () {
    document.getElementById("horas").value = "";
    document.getElementById("valorHora").value = "";
    limparResultado();
    document.getElementById("valorTotal").textContent = "R$ 0,00";
    document.getElementById("detalhes").textContent = "";
    document.getElementById("horas").focus();
  });

// Atualiza o ano atual no rodapé
document.getElementById(
  "anoAtual"
).innerHTML = `&copy; ${new Date().getFullYear()} Todos os direitos reservados.`;

