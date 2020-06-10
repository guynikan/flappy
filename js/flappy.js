// função auxiliar para criar elemento e adicionar uma classe a ele
function novoElemento(tagName, className) {
  const elem = document.createElement(tagName);
  elem.className = className;
  return elem;
}

// cria uma barreira
// recebe reversa para determinar onde ficará a borda
function Barreira(reversa = false) {
  // cria o elemento
  this.elemento = novoElemento("div", "barreira");

  // cria a borda
  const borda = novoElemento("div", "borda");

  // cria o corpo
  const corpo = novoElemento("div", "corpo");

  // adiciona ao elemento o corpo e a borda
  // testando onde ficará a borda
  this.elemento.appendChild(reversa ? corpo : borda);
  this.elemento.appendChild(reversa ? borda : corpo);

  // seta a altura da barreira
  this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
}

// const b = new Barreira(true);
// b.setAltura(500);
// document.querySelector("[wm-flappy").appendChild(b.elemento);

// cria o par de barreiras
function ParDeBarreiras(altura, abertura, x) {
  // cria o elemento
  this.elemento = novoElemento("div", "par-de-barreiras");

  // cria as barreiras superior e inferior
  // superior recebe reversa para a borda, pois a borda fica embaixo do corpo
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  // adiciona ao elemento par-de-barreiras as duas barreiras
  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  // sorteia a altura das barreiras
  this.sortearAbertura = () => {
    // seta um valor random para a barreira superior
    const alturaSuperior = Math.random() * (altura - abertura);
    // baseado na altura superior, seta um valor pra inferior
    // sendo que o valor inferior poderá ser maior que o superior
    // dado que o numero random atribuído ao superior está num intervalo de 0 a 300 (altura - abertura)
    const alturaInferior = altura - abertura - alturaSuperior;

    // seta os valores para as barreiras
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  // pega a posição do elemento (par de barreiras) no eixo X
  this.getX = () => parseInt(this.elemento.style.left.split("px")[0]);

  // seta um valor passado por parametro para a posição do elemento no eixo X
  this.setX = (x) => (this.elemento.style.left = `${x}px`);
  // pega a largura do client do elemento em px
  this.getLargura = () => this.elemento.clientWidth;

  this.sortearAbertura();
  this.setX(x);
}

// const b = new ParDeBarreiras(700, 400, 400);
// document.querySelector("[wm-flappy]").appendChild(b.elemento);

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  // cria 4 Pares de barreiras
  // onde a primeira tem a posição passada por param
  // a segunda tem o valor passado + espaco
  // a terceira o valor de param + espaco * 2
  // assim, o terceiro par está 2 vezes distante da segunda e uma vez distante da primeira
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3),
  ];

  const deslocamento = 3;
  this.animar = () => {
    // itera sobre os pares, setando para a posição do eixo X o valor da posição atual - deslocamento
    // assim, a posição do par será sempre 3 px a menos, toda vez que a função for chamada
    this.pares.forEach((par) => {
      par.setX(par.getX() - deslocamento);

      // onde a posição do par no eixo X for menor que a largura do par em px
      if (par.getX() < -par.getLargura()) {
        // seta a posição do par no eixo X o valor da sua posição atual(no limite da tela)
        //+ espaco * o tamanho do array
        // somando todo os espaços que existem de um lado do espaço do jogo até o outro
        // ou seja: o tamanho da barreira + espaco entre elas * total de barreiras
        // assim, o elemento estará na posição mais extrema ao left do elemento
        par.setX(par.getX() + espaco * this.pares.length);

        // sorteia o tamanho das barreiras novamente
        par.sortearAbertura();
      }

      const meio = largura / 2;
      const cruzouOMeio =
        // verifica se o passaro cruzou o meio para poder notificar o ponto
        // sendo que ele considera que cruzou se a posição do par no eixo X + deslocamento
        // for maior que o meio da tela
        // OU, posição do par no eixo X for menor que o meio
        par.getX() + deslocamento >= meio && par.getX() < meio;
      if (cruzouOMeio) notificarPonto();
    });
  };
}

// recebe a altura do jogo
function Passaro(alturaJogo) {
  let voando = false;

  // cria o elemento img e adiciona a classe passaro
  this.elemento = novoElemento("img", "passaro");
  // seta ao src da imagem o local da imagem
  this.elemento.src = "img/passaro.png";

  // pega o posição do elemento no eixo Y
  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0]);
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);

  // se alguma tecla estiver sendo segurada, seta voando para true
  window.onkeydown = (e) => (voando = true);
  // se soltar a tecla
  window.onkeyup = (e) => (voando = false);

  this.animar = () => {
    // se voando = true, seta 8 px para o novoY (sobe) se false, -5 px(desce)
    const novoY = this.getY() + (voando ? 8 : -5);

    // seta uma alturaMaxima que o passaro pode subir
    // baseado no param alturaJogo - o tamanho do passaro
    const alturaMaxima = alturaJogo - this.elemento.clientHeight;

    // se a posição do passaro for menor que 0
    if (novoY <= 0) {
      this.setY(0);
    }
    // se a posição do passaro for maior ou igual a alturaMaxima
    else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else {
      this.setY(novoY);
    }
  };

  this.setY(alturaJogo / 2);
}

function Progresso() {
  this.elemento = novoElemento("span", "progresso");
  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };

  this.atualizarPontos(0);
}

// const barreiras = new Barreiras(700, 1200, 350, 400);
// const areaDoJogo = document.querySelector("[wm-flappy]");
// const passaro = new Passaro(areaDoJogo.clientHeight);
// const progresso = new Progresso();
// areaDoJogo.appendChild(passaro.elemento);
// areaDoJogo.appendChild(progresso.elemento);
// barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));
// setInterval(() => {
//   barreiras.animar();
//   passaro.animar();
// }, 20);

function estaoSobrepostos(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();

  // a distancia de a do limite da esquerda + sua largura = lado direito do elemento A
  // onde, se esse cumprimento for maior ou igual ao lado esquerdo de B, retorna true
  // E
  // a distancia de B do lado esquerdo + sua largura = lado direito de B
  // onde, se esse cumprimento for maior ou igual ao lado esquerdo de A, retorna true
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;

  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical;
}

function colidiu(passaro, barreiras) {
  let colidiu = false;

  barreiras.pares.forEach((parDeBarreiras) => {
    if (!colidiu) {
      const superior = parDeBarreiras.superior.elemento;
      const inferior = parDeBarreiras.inferior.elemento;
      colidiu =
        estaoSobrepostos(passaro.elemento, superior) ||
        estaoSobrepostos(passaro.elemento, inferior);
    }
  });

  return colidiu;
}
function FlappyBird() {
  let pontos = 0;

  const areaDoJogo = document.querySelector("[wm-flappy]");
  const altura = areaDoJogo.clientHeight;
  const largura = areaDoJogo.clientWidth;

  const progresso = new Progresso();
  const barreiras = new Barreiras(altura, largura, 200, 400, () =>
    progresso.atualizarPontos(++pontos)
  );

  const passaro = new Passaro(altura);

  areaDoJogo.appendChild(progresso.elemento);
  areaDoJogo.appendChild(passaro.elemento);
  barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();

      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador);
      }
    }, 20);
  };
}

new FlappyBird().start();
