
class Neurona{

    numeroIteracion = parseFloat("0.0");
    rataAprendizaje = parseFloat("0.0");
    errorMaestro  = parseFloat("0.0");
    x =  [];
    yD = [];
    x1 =  [];
    yD1 = [];
    pesos = [];
    umbrales = [];
    patrones = 0;
    entradas = 0;
    salidas = 0;


    constructor() {
    }


    //metodo para inicializar
    inicializar(){
        return parseFloat("0.0");
    }


    llenarPesosUmbrales(n, m, U, W){
        let listaPesos = [];
        let listaUmbrales = [];

        for(let i = 0; i < n; i++){
            listaUmbrales.push(U[i]);

            for(let j = 0; j<m; j++){
                listaPesos.push(W[j][i]);
            }
        }
        llenarTablaPesos(listaPesos);
        llenarTablaUmbrales(listaUmbrales);

    }

    inicializarPesosUmbrales(){
        let listaPesos = [];
        let listaUmbrales = [];
        let n = this.salidas;
        let m = this.entradas;
        for(let i = 0; i < n; i++){
            this.umbrales[i] = this.inicializar();
            listaUmbrales.push(this.umbrales[i]);

            for(let j = 0; j<m; j++){
                this.pesos[j] = [];
                this.pesos[j].push(this.inicializar());
                listaPesos.push(this.pesos[j][i]);
            }
        }
        llenarTablaPesos(listaPesos);
        llenarTablaUmbrales(listaUmbrales);
    }



}

