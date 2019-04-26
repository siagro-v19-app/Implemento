sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject){
    "use strict";
    return BaseObject.extend("br.com.idxtec.model.Implemento",{
        constructor: function(){
            this.Id = 0;
            this.Descricao = "";
            this.Numero = "";
            this.NumeroSerie = "";
            this.Inativo = false;
            this.Observacoes = "";
            this.Usuario = 0;
            this.Empresa = 0;
        }
    });
});