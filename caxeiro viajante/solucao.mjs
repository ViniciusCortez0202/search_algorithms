import { writeFileSync } from 'fs'

const distanciaEntreCidades = [
    [
        9999999, 30, 84, 56, 9999999, 9999999, 9999999, 75, 9999999, 80,
    ],
    [
        30, 9999999, 65, 9999999, 9999999, 70, 9999999, 9999999, 40
    ],
    [
        84, 65, 9999999, 74, 52, 55, 9999999, 60, 143, 48,
    ],
    [
        56, 9999999, 74, 9999999, 135, 9999999, 9999999, 20, 9999999, 9999999
    ],
    [
        9999999, 9999999, 52, 135, 9999999, 70, 9999999, 122, 98, 80
    ],
    [
        70, 9999999, 55, 9999999, 70, 9999999, 63, 9999999, 82, 35
    ],
    [
        9999999, 70, 9999999, 9999999, 9999999, 63, 9999999, 9999999, 120, 57
    ],
    [
        75, 9999999, 135, 20, 122, 9999999, 9999999, 9999999, 9999999, 9999999
    ],
    [
        9999999, 9999999, 143, 9999999, 98, 82, 120, 9999999, 9999999, 9999999
    ],
    [
        80, 40, 48, 9999999, 80, 35, 57, 9999999, 9999999, 9999999,
    ]
]

function getRandomInt() {
    return Math.floor(Math.random() * 10);
}
const arvoreBase = {
    estado: 1,
    pai: null,
    filhoEsquerdo: null,
    filhoDireito: null,
    distanciaPercorida: 0,
    profundidade: 0
}
var folhaDeMenorDistanciaPercorida = structuredClone(arvoreBase);


function main() {

    let no = structuredClone(arvoreBase);
    let cidades = [1];

    const criarEstatosFilhos = (noBase) => {

        if (cidades.length !== 10) {
            do {
                var noEsquerdo = getRandomInt();
            } while (distanciaEntreCidades[noBase.estado - 1].at(noEsquerdo) === 9999999 || cidades.includes((noEsquerdo + 1)));
            
            do {
                var noDireito = getRandomInt();
            } while (distanciaEntreCidades[noBase.estado - 1].at(noDireito) === 9999999 || cidades.includes((noDireito + 1)));
        } else {
            noEsquerdo = 0;
            noDireito = 0;
        }


        noBase.filhoEsquerdo = structuredClone(noBase);
        noBase.filhoEsquerdo.estado = noEsquerdo + 1;
        noBase.filhoEsquerdo.profundidade += 1;
        noBase.filhoEsquerdo.pai = noBase.estado;
        noBase.filhoEsquerdo.distanciaPercorida += distanciaEntreCidades[noBase.estado - 1].at(noEsquerdo);
        noBase.filhoEsquerdo.filhoDireito = noBase.filhoEsquerdo.filhoEsquerdo = null;

        noBase.filhoDireito = structuredClone(noBase);
        noBase.filhoDireito.estado = noDireito + 1;
        noBase.filhoDireito.profundidade += 1;
        noBase.filhoDireito.pai = noBase.estado;
        noBase.filhoDireito.distanciaPercorida += distanciaEntreCidades[noBase.estado - 1].at(noDireito);
        noBase.filhoDireito.filhoDireito = noBase.filhoDireito.filhoEsquerdo = null;
    }

    const viagem = (noInicial) => {
        criarEstatosFilhos(noInicial);
        if (noInicial.filhoEsquerdo.estado === 1 || noInicial.filhoDireito.estado === 1) {
            folhaDeMenorDistanciaPercorida = structuredClone(noInicial);
            return noInicial;
        }
        const proximo = noInicial.filhoEsquerdo.distanciaPercorida < noInicial.filhoDireito.distanciaPercorida;
        if (proximo) {
            cidades.push(noInicial.filhoEsquerdo.estado);
            return viagem(noInicial.filhoEsquerdo);
        }
        cidades.push(noInicial.filhoDireito.estado);
        return viagem(noInicial.filhoDireito);
    }
    viagem(no);
    return no
}

writeFileSync('solucao.json', Buffer.from(JSON.stringify(main())));