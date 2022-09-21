import { readFileSync, writeFileSync } from 'fs'

const no = {
    custo: 0,
    heuristica: 0,
    aEstrela: 0,
    pai: '',
    estado: '',
    profundidade: 0,
    filhos: []
}


const lerArquivo =  () =>  {
    return JSON.parse(readFileSync('heuristica.json'))
}

const arvore = new Map();
const h = lerArquivo();
const listaAdj = new Map();
const inicio = "E1";
const fim = "E5";
const linhas = [
    ['E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
    ['E10', 'E2', 'E9', 'E8', 'E5', 'E7'],
    ['E11', 'E9', 'E3', 'E13'],
    ['E12', 'E8', 'E4', 'E13', 'E14']
];
const fronteira = [];

const criarListaAdj = () => {
    listaAdj.set("E1", ["E2"]);
    listaAdj.set("E2", ["E1", 'E3', 'E9', 'E10']);
    listaAdj.set("E3", ["E2", 'E9', 'E13', 'E4']);
    listaAdj.set("E4", ["E3", 'E8', 'E13', 'E5']);
    listaAdj.set("E5", ["E4", 'E8', 'E16', 'E7']);
    listaAdj.set("E6", ["E5"]);
    listaAdj.set("E7", ["E5"]);
    listaAdj.set("E8", ["E5", 'E12', 'E9', 'E4']);
    listaAdj.set("E9", ["E2", 'E3', 'E8', 'E11']);
    listaAdj.set("E10", ["E2"]);
    listaAdj.set("E11", ["E9"]);
    listaAdj.set("E12", ["E8"]);    
    listaAdj.set("E13", ["E14", 'E4', 'E3']);    
    listaAdj.set("E14", ["E13"]);    

}

const adicionarFronteira = (fronteira, arg) => {
    if(fronteira.length === 0) {
        fronteira.push(arg);
        return;
    }
    const value = fronteira.shift();
    if(value.aEstrela > arg.aEstrela){
        fronteira.unshift(arg, value);
        return;
    }

    adicionarFronteira(fronteira, arg);
    fronteira.unshift(value)
}

const criarFilhos = (pai) => {

    const filhos = listaAdj.get(pai.estado)
    for(let filho of filhos){
        if(filho === pai.pai) continue;
        const noFilho = structuredClone(pai);
        noFilho.filhos = [];
        noFilho.estado = filho;
        noFilho.pai = pai.estado;
        noFilho.heuristica = h[pai.estado][filho];
        noFilho.custo = pai.custo + (noFilho.heuristica / 30) + (linhas.includes([filho, pai.estado, pai.pai]) ? 0.67 : 0);
        noFilho.aEstrela = noFilho.heuristica + noFilho.custo;
        noFilho.profundidade += 1;
        pai.filhos.push(noFilho);
        adicionarFronteira(fronteira, noFilho)
    }
}

const iniciar = () =>{
    no.estado = inicio;

    criarListaAdj();
    console.log(aEstrela(no));
    writeFileSync('solucao.json', Buffer.from(JSON.stringify(no)));
}

const aEstrela = (noAtual) => {
    if(noAtual.estado === fim){
        return noAtual;
    }
    criarFilhos(noAtual);
    return aEstrela(fronteira.shift());
}


iniciar();