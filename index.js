// ==============================
// Configurações
// ==============================
const CONFIG = {
  moeda: "BRL",              // Formato de moeda
  descontoINSS: 0,           // Desconto percentual (ex: 0.11 para 11%)
  multiplicadorExtra: 1      // Ex: adicional noturno
};

// ==============================
// Utilitários
// ==============================

// Formata valor para o formato BRL (R$)
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: CONFIG.moeda,
  }).format(valor);
}

// Alterna exibição das instruções
function toggleInstrucoes() {
  const instrucoes = document.getElementById("instrucoes");
  instrucoes.style.display = instrucoes.style.display === "none" ? "block" : "none";
}

// ==============================
// Cálculo e Exibição
// ==============================

// Calcula o pagamento total
function calcularPagamento(horas, valorHora, inssPercentual) {
  const valorBruto = horas * valorHora * CONFIG.multiplicadorExtra;
  const desconto = valorBruto * (inssPercentual / 100);
  const valorLiquido = valorBruto - desconto;

  return {
    bruto: valorBruto,
    desconto: desconto,
    liquido: valorLiquido,
    horas: horas,
    valorHora: valorHora,
    inssPercentual: inssPercentual
  };
}

// Exibe o resultado formatado na tela
function exibirResultado(calculo) {
  const resultadoDiv = document.getElementById("resultado");
  const valorTotalSpan = document.getElementById("valorTotal");
  const detalhesDiv = document.getElementById("detalhes");

  valorTotalSpan.textContent = formatarMoeda(calculo.liquido);

  let detalhesTexto = `${calculo.horas} horas × ${formatarMoeda(calculo.valorHora)} = ${formatarMoeda(calculo.bruto)}`;
  if (calculo.desconto > 0) {
    detalhesTexto += `<br>Desconto INSS: ${formatarMoeda(calculo.desconto)}`;
  }

  detalhesDiv.innerHTML = detalhesTexto;
  resultadoDiv.classList.add("show");
}

// ==============================
// Eventos
// ==============================

// Submissão do formulário
document.getElementById("calculatorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const horas = parseFloat(document.getElementById("horas").value);
  const valorHora = parseFloat(document.getElementById("valorHora").value);

  if (horas > 0 && valorHora > 0) {
    const calculo = calcularPagamento(horas, valorHora);
    exibirResultado(calculo);
  } else {
    alert("Por favor, preencha todos os campos com valores válidos.");
  }
});

// Limpa resultado ao alterar os inputs
function limparResultado() {
  document.getElementById("resultado").classList.remove("show");
}
document.getElementById("horas").addEventListener("input", limparResultado);
document.getElementById("valorHora").addEventListener("input", limparResultado);

// Formata o campo de valor da hora após sair do foco
document.getElementById("valorHora").addEventListener("blur", function () {
  const valor = parseFloat(this.value);
  if (!isNaN(valor)) {
    this.value = valor.toFixed(2);
  }
});

// Botão de novo cálculo
document.getElementById("btnNovoCalculo").addEventListener("click", function () {
  document.getElementById("horas").value = "";
  document.getElementById("valorHora").value = "";
  limparResultado();
  document.getElementById("valorTotal").textContent = "R$ 0,00";
  document.getElementById("detalhes").textContent = "";
  document.getElementById("horas").focus();
});

// Atualiza o ano atual no rodapé
document.getElementById("anoAtual").innerHTML = `&copy; ${new Date().getFullYear()} Todos os direitos reservados.`;
