import fs from 'fs'
import stringfy from 'safe-json-stringify'

var estado = 1;
const no = {
    estado: estado,
    pai: null,

    margemEsquerda: {
        missionarios: 3,
        canibais: 3
    },
    margemDireita: {
        missionarios: 0,
        canibais: 0
    },
    profundidade: 0,
    filhos: []
}

const fronteira = [];
fronteira.push(no)

//Não há necessidade de verificar estados repetidos pois eles levariam à mesma solução
const createState = (noBase) => {

    const mE = noBase.margemEsquerda.missionarios;
    const cE = noBase.margemEsquerda.canibais;
    const mD = noBase.margemDireita.missionarios;
    const cD = noBase.margemDireita.canibais;

    if ((cE > mE && mE > 0) || (cD > mD && mD > 0)) return;

    var novoNo = structuredClone(noBase);
    if (noBase.margemEsquerda.missionarios > 0) {
        novoNo.filhos = [];
        novoNo.margemEsquerda.missionarios -= 1;
        novoNo.margemDireita.missionarios += 1;
        novoNo.pai = noBase.estado;
        novoNo.profundidade += 1;
        novoNo.estado = ++estado;
        noBase.filhos.push(novoNo);
        fronteira.push(novoNo);
    }

    if (noBase.margemEsquerda.missionarios >= 2) {
        novoNo = structuredClone(noBase);
        novoNo.filhos = [];
        novoNo.margemEsquerda.missionarios -= 2;
        novoNo.margemDireita.missionarios += 2;
        novoNo.pai = noBase.estado;
        novoNo.profundidade += 1;
        novoNo.estado = ++estado;
        noBase.filhos.push(novoNo);
        fronteira.push(novoNo);
    }

    if (noBase.margemEsquerda.canibais > 0) {
        novoNo = structuredClone(noBase);
        novoNo.filhos = [];
        novoNo.margemEsquerda.canibais -= 1;
        novoNo.margemDireita.canibais += 1;
        novoNo.pai = noBase.estado;
        novoNo.profundidade += 1;
        novoNo.estado = ++estado;
        noBase.filhos.push(novoNo);
        fronteira.push(novoNo);
    }

    if (noBase.margemEsquerda.canibais >= 2) {
        novoNo = structuredClone(noBase);
        novoNo.filhos = [];
        novoNo.margemEsquerda.canibais -= 2;
        novoNo.margemDireita.canibais += 2;
        novoNo.pai = noBase.estado;
        novoNo.profundidade += 1;
        novoNo.estado = ++estado;
        noBase.filhos.push(novoNo);
        fronteira.push(novoNo);
    }

    if (noBase.margemEsquerda.canibais > 0 && noBase.margemEsquerda.missionarios > 0) {
        novoNo = structuredClone(noBase);
        novoNo.filhos = [];
        novoNo.margemEsquerda.canibais -= 1;
        novoNo.margemDireita.canibais += 1;
        novoNo.margemEsquerda.missionarios -= 1;
        novoNo.margemDireita.missionarios += 1;
        novoNo.pai = noBase.estado;
        novoNo.profundidade += 1;
        novoNo.estado = ++estado;
        noBase.filhos.push(novoNo);
        fronteira.push(novoNo);
    }
}
//Foi utilizado busca em largura, pois era necessário uma solução ótima
const busca = () => {
    const noAtual = fronteira.shift();;
    if (noAtual.margemDireita.missionarios === 3 && noAtual.margemDireita.canibais === 3) return noAtual;
    createState(noAtual);
    return busca();
}
const escrever = () => {
    console.log(busca())
    const buffer = Buffer.from(stringfy(no));
    fs.writeFile('arvore.json', buffer, (err) => {
        if (err) console.log(err)
        console.log('write')
    })
}

escrever()
