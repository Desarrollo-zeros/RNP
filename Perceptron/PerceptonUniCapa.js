class PerceptonUniCapa{


    /**
     * @param {Neurona} neurona
     *  */
    async entrenar(neurona){



        let sumaEl;
        let sumaEp;
        let listaErrores = [];
        let listaErrorMaestro = [];
        let listaIndice =[];

        let m = neurona.entradas; //entradas
        let n = neurona.salidas; //salidas
        let patrones = neurona.patrones;
        let el = [];
        let y = new Array(n);
        let ep = new Array(patrones);
        let erms;
        let soma = new Array(n);
        let u = [];
        for(let i = 0; i<n; i++){
            u.push(parseFloat($("#inicialUmbral").val()));
        }
        let w = [];
        for(let i = 0; i<m; i++){
            w[i] = [];
            w[i][0] = 0;
        }

        if(neurona.pesos.length> 0  && neurona.umbrales.length > 0 ){
            u = neurona.umbrales;
            w = neurona.pesos;
        }else{
            neurona.pesos = new Array(m);
            for(let i = 0; i<m; i++){
                neurona.pesos[i] = new Array(n);
            }
            neurona.umbrales = new Array(n);
            neurona.inicializarPesosUmbrales();
        }

        let e = 0;

        while (e <= neurona.numeroIteracion){
            sumaEl = 0;
            sumaEp = 0;
            erms = 0;

            //se recorre los patrones
            for(let p = 0; p<patrones; p++){
                for(let i = 0; i<n; i++){
                    soma[i] = 0;
                    el[i] = 0;
                    for(let j = 0; j<m; j++){
                        //se optine la suma del soma
                        soma[i] += parseFloat(neurona.x[p][j]) * parseFloat(w[j][i])
                    }//ciclo de salidas

                    //la suma del soma obtenido anteriormente se suma con el umbral que se encuentra en el indice i
                    soma[i] =  soma[i] -parseFloat(u[i]);
                    //y toma el valor de la activacion
                    y[i] = this.activacionBipolar(soma[i]);

                    //restamos el valor de la salida con el valor de la activacion, para obtener el erorr lineal
                    el[i] = this.subtract(neurona.yD[p], y[i]);

                    //se suma el valor absoluto del error linea mas el contenido de la suma anterior
                    sumaEl = sumaEl + Math.abs(el[i]);

                } //ciclo de entradas

                for(let i = 0; i<n;i++){
                    //se optiene el valor del umbral
                    u[i] +=parseFloat((neurona.rataAprendizaje * parseFloat(el[i])).toString());
                    for(let j = 0; j<m; j++){
                        //se obtiene el valor del peso
                        w[j][i] = parseFloat(w[j][i]) + neurona.rataAprendizaje  *  parseFloat(el[i])  * parseFloat(neurona.x[p][j]);
                    }
                    //se optiene el error del patron
                    ep[p] =  Math.abs(el[i])/ neurona.salidas;

                    //se optiene la suma de los resultantes
                    sumaEp += parseFloat(ep[p]);
                }

            }//ciclo recorrido de patrones

            //se optiene erms para la lista de errores
            erms = parseFloat(sumaEp) / patrones;
            listaErrores.push(erms);
            listaErrorMaestro.push(neurona.errorMaestro);
            listaIndice.push(e);

            //slep
            await sleep(1000);
            if(cancel){
                cancel = false;
               return false;
            }
            neurona.pesos = w;
            neurona.umbrales = u;
            //se llena los pesos y se genera las tablas de pesos y umbrales
            neurona.llenarPesosUmbrales(n,m,u,w);
            //se optiene la frafica
            graficarError(listaErrores, listaIndice, listaErrorMaestro);
            if(erms <= neurona.errorMaestro){
                return true;
            }
            e++;

        }
        return false;
    }


    activacionBipolar(v){
        return parseFloat( (v > 0 ? 1.0 : -1.0).toString());
    }

    subtract(a,b){
        return a - b;
    }

    simular(neurona, entradas){
        let m = neurona.entradas;
        let n = neurona.salidas;
        let soma = [];
        let y = [];

        for(let i = 0; i<n;i++){
            soma[i] = 0;
            for(let j =0; j<m;j++){
                soma[i] = soma[i] + entradas[j] * neurona.pesos[j][i];
            }
            soma[i] = soma[i] + neurona.umbrales[i];
            y[i] = this.activacionBipolar(soma[i]).toString();
        }
        return y;
    }
}