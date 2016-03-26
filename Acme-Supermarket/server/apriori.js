Meteor.methods({
	Contains:function(array, elemento){
		for (var i = 0; i < array.length; i++) {
	        if (array[i] == elemento) {
	            return true;
	        }
	    }
	    return false;
	},


	ContainsArrays:function(array1, array2){//comprueba si el array2 esta contenido en el array1(array de array)
		for (var i = 0; i < array1.length; i++) {
	        if (Meteor.call('Equals',array1[i], array2)) {
	            return true;
	        }
	    }
	    return false;
	},


	jsonConcat:function(o1, o2) {
		for (var key in o2) {
			o1[key] = o2[key];
		}
		return o1;
	},


	intersect_safe:function(a, b)
	{
		a.sort();
		b.sort();
		var ai=0, bi=0;
		var result = [];

		while( ai < a.length && bi < b.length ){
		    if      (a[ai] < b[bi] ){ ai++; }
		    else if (a[ai] > b[bi] ){ bi++; }
		    else /* they're equal */
		    {
		      result.push(a[ai]);
		      ai++;
		      bi++;
		    }
		}

		return result;
	},


	Equals:function(A,B){
		var res = true;
		A.sort();
		B.sort();
		for (var i =0; i<A.length;i++){
			if (A[i] != B[i]){
				res = false;
				break;
			}
		}
		return res;
	},


	clone:function( obj ) {
	    if ( obj === null || typeof obj  !== 'object' ) {
	        return obj;
	    }
	 
	    var temp = obj.constructor();
	    for ( var key in obj ) {
	        temp[ key ] = Meteor.call('clone', obj[ key ] );
	    }
	 
	    return temp;
	},


	arrayUnique:function(array) {
	    var a = array.concat();
	    for(var i=0; i<a.length; ++i) {
	        for(var j=i+1; j<a.length; ++j) {
	            if(a[i] === a[j])
	                a.splice(j--, 1);
	        }
	    }

	    return a;
	},


	L1:function (D,smin) {
		var dic = {};
		var res = {};
		for (l in D){
			for (o in D[l]){
				var key = D[l][o].toString();;
				if (D[l][o] in dic){
					dic[key] = dic[key] + 1;
				}else{
					dic[key] = 1;
				}
			}
		}
		for(v in dic){
			if (dic[v] >= smin){
				res[v] = dic[v];
			}	
		}
		return res;
	},


	Filtra:function (C,D,smin){//C y D son objetos y smin un numero
		var dic = {};
		var L = {};
		var CFinal = false;

		for (c2 in C){
			var c3 = c2.split(',').map(Number);
			dic[c3] = 0;
		}

		for (t in D){
			for (c in C){
				var cont = 0;
				var c1 = c.split(',').map(Number);
				for (i in c1){
					if(Meteor.call('Contains',D[t],c1[i])){
						cont++;
					}
				}

				if (cont == c1.length){
					dic[c1] = dic[c1]+1;
				}
			}
		}

		for (v in dic){
			if (dic[v] >=smin){
				L[v] = dic[v];
			}
		}
		if(Object.keys(L).length <= 1){
			CFinal = true;
		}else{
			if (Object.keys(Meteor.call('UnionL',L)).length <= 0){
				CFinal = true;
			}
		}
		var res = [L,CFinal]
		return res;
	},


	UnionL:function (L){
	var C = {};
	var Laux = Meteor.call('clone',L);

	for (n in L){
		for(m in Laux){
			var array1 = n.split(',').map(Number);
			var array2 = m.split(',').map(Number);
			if (!Meteor.call('Equals',array1,array2)){
				if (array1.length == 1){
					C[array1.concat(array2)] = 0;

				}else if (Meteor.call('Equals',array1.slice(0, array1.length -1 ),array2.slice(0, array2.length -1 ))){
					C[Meteor.call('arrayUnique',array1.concat(array2))] = 0;
				}
			}
			
		}
		delete Laux[n];
	}
	return C;
	},
	GeneraCandidatos:function(L){
	var C2 = {};
	var C = Meteor.call('UnionL',L);
	
	for (c in C){
		var c1 = c.split(',').map(Number);
		var caux = c1.slice();
		for (var e = 0; e<c1.length;e++){
			var indice = caux.indexOf(c1[e]);
			caux.splice(indice, 1);
			var cont = 0;

			for (j in caux){
				
				for (l in L){
					for(le in L[l]){
						if (le == j){
							cont++;
						}
					}
				}
			}

			if(cont==caux.length){
				C2[c1] = 0;
			}
		}
	}
	return C2;
	},
	Apriori:function(D,smin){
	var L = {};
	var C = {};
	var dicFinal = {};

	L[1] = Meteor.call('L1',D,smin);
	tam = 2;
	
	for(d in D){
		if(tam<D[d].length){
			tam = D[d].length;
		}
	}

	for (var k = 2; k<tam;k++){
		C[k] = Meteor.call('GeneraCandidatos',L[k-1]);

		var res = Meteor.call('Filtra',C[k],D,smin);
		L[k] = res[0];
		var fin = res[1]
		if (fin){
			break;
		}

		
	}
	for (var l = 2; l<= Object.keys(L).length; l++){
		dicFinal = Meteor.call('jsonConcat',dicFinal,L[l]);
	}
	return dicFinal;
	},


	Combinacion:function(combinar, lista){
	var new_comb = [];

	for (x in combinar){
		for (var y=0; y<lista.length;y++){
			var aux = [];
			if(typeof(combinar[x]) == 'number'){
				aux.push(combinar[x]);
				aux.push(lista[y]);
				if (combinar[x] != lista[y]){
					new_comb.push(aux);
				}
			}else{
				if(!Meteor.call('Equals',combinar[x],lista[y])){
					for (i in combinar[x]){
						aux.push(combinar[x][i]);
					}
					aux.push(lista[y]);
					new_comb.push(aux);
				}
			}
		}
	}

	var laux = []; //array ordenado
	for (comb in new_comb) {
		laux.push(new_comb[comb].sort());
	}

	var laux2 = [];
	for (a in laux){
		if(!Meteor.call('ContainsArrays',laux2,laux[a])){
			laux2.push(laux[a])
		}
	}

	new_comb = laux2;
	return new_comb;

	},
	Reglas: function(L,D){
	var reglas = {};
	var valores = {};
	for (key in L){
		var key1 = key.split(',').map(Number);//string como array de numeros 
		var comb_final = key1;
		var cont = key1.length -1;
		var result = [];
		for (i in key1){
			result.push(key1[i]);
		} 

		//Combinacion de todas las posibles combinaciones
		while(cont>1){//Un bucle que llama la funcion hasta que esten todas las combinaciones posibles
			comb_final = Meteor.call('Combinacion',comb_final,key1);
			for (a in comb_final){
				result.push(comb_final[a]);
			}
			cont--;
		}

		//Generacion de diccionarios con las combinaciones Estructura del diccionario: {dado el elemento x:[se da el elemento y,[soporte,confianza]]}
		var reglasKey = {};
		ta = result.length;
		dictam = Object.keys(D).length;

		for (var j =0; j<ta;j++){
			if (typeof(result[j]) == 'number'){
				if (typeof(result[ta-1-j]) == 'number'){
					var element1 = [result[ta-1-j]];
					element1.push(result[j]);
				}else{
					var element1 = result[ta-1-j].slice(0); //clona el array result[tam-1-j]
					element1.push(result[j])
				}
				var cnt = 0;
				var cnt2 = 0;
				for (di in D){
					if(Meteor.call('intersect_safe',element1,D[di]).length == element1.length){
						cnt++;
					}
					if (Meteor.call('Contains',D[di],result[j])){
						cnt2++;
					}
				}
				var soporte = cont/dictam;
				confianza = 0;

				if(cnt2 != 0){
					confianza = cnt/cnt2;
				}
				reglasKey[result[j]] = [result[ta-1-j],[soporte,confianza]];
			}
			else if(typeof(result[ta-1-j]) == 'number'){
				var element1 = result[j].slice(0);
				element1.push(result[ta-1-j]);

				var cnt = 0;
				var cnt2 = 0;
				for (di in D){
					if(Meteor.call('intersect_safe',element1,D[di]).length == element1.length){
						cnt++;
					}
					if (Meteor.call('intersect_safe',result[j],D[di]).length == result[j].length){
						cnt2++;
					}
				}
				var soporte = cont/dictam;
				confianza = 0;

				if(cnt2 != 0){
					confianza = cnt/cnt2;
				}
				reglasKey[result[j]] = [result[ta-1-j],[soporte,confianza]];
			}
			else{
				element1 = result[ta-1-j].concat(result[j]);
				var cnt = 0;
				var cnt2 = 0;
				for (di in D){
					if(Meteor.call('intersect_safe',element1,D[di]).length == element1.length){
						cnt++;
					}
					if (Meteor.call('intersect_safe',result[j],D[di]).length == result[j].length){
						cnt2++;
					}
				}
				var soporte = cont/dictam;
				confianza = 0;

				if(cnt2 != 0){
					confianza = cnt/cnt2;
				}
				reglasKey[result[j]] = [result[ta-1-j],[soporte,confianza]];
			}
		}
		reglas[key1] = reglasKey;
	}
	return reglas;
	},
	CollectionToDic:function(){
		var activos = ShoppingCarts.find({"active":false}).fetch();
		var cont =1;
		var recolector = {};
		for(var i = 0; i<activos.length;i++){
			var dic = activos[i]['items'];
			var li = [];
			for (var j =0; j<dic.length;j++){
				li.push(dic[j]['productCode']);
			}
			recolector['i'+cont] =li;
			cont++;
		}
		return recolector;
	},
	DicToCollection: function(reglas){
	//console.log('reglas',reglas);
	var ts = new Date();
		for(x in reglas){
			var obj = reglas[x];
			for (y in obj){
				var purchased = y.split(',').map(Number);
				var st = obj[y][0].toString();
				var recommended = st.split(',').map(Number);
				ShoppingCartsRules.insert({purchasedProduct: purchased, recommendedProduct: recommended, probabilityRelation: obj[y][1][1], ts_process: ts});
			}
		}
	},
	mainApriori: function(){
		console.log("Apriori started")
		var D = Meteor.call('CollectionToDic');
		var D = {"i1":[1,3,4],"i2":[2,3,5],"i3":[1,2,3,5],"i4":[2,5]};//prueba con ejemplo pequeño
		//console.log("resultado ",Apriori(D,2));
		var apriori = Meteor.call('Apriori',D,2);//crea las Ls
		var reglas = Meteor.call('Reglas',apriori,D);//Crea las reglas
		console.log(reglas);
		Meteor.call('DicToCollection',reglas)//guarda las reglas en una tabla
		console.log("Apriori finished")
		return true
	}
});



/*
var D = {"i1":[1,3,4],"i2":[2,3,5],"i3":[1,2,3,5],"i4":[2,5]};
console.log("resultado ",Apriori(D,2));
var apriori = Apriori(D,2);
var reglas = Reglas(apriori,D);

console.log(reglas)
*/

