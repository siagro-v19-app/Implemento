sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"br/com/idxtec/Implemento/services/Session",
	"br/com/idxtec/Implemento/model/Implemento",
	"br/com/idxtec/Implemento/model/EmpresaDetails",
	"br/com/idxtec/Implemento/model/UsuarioDetails",
], function(Controller, History, MessageBox, JSONModel, Session, Implemento,
	EmpresaDetails, UsuarioDetails) {
	"use strict";

	return Controller.extend("br.com.idxtec.Implemento.controller.FormAddEdit", {
		onInit: function(){
			var oRouter = this.getOwnerComponent().getRouter();
			
			oRouter.getRoute("actionAddEdit").attachMatched(this._routerMatch, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			this._operacao = null;
			this._sPath = null;
			
			var oJSONModel = new JSONModel();
			this.getOwnerComponent().setModel(oJSONModel,"model");
		},
		
		_routerMatch: function(oEvent){
			var oQuery = oEvent.getParameter("arguments")["?query"];
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getOwnerComponent().getModel("view");
			
			var EmpresaId = Session.get("EMPRESA_ID");
			var UsuarioId = Session.get("USUARIO_ID");

			this._operacao = oQuery.action;
			
			if (this._operacao === "incluir"){
				
				oViewModel.setData({
					titulo: "Inserir Implemento"
				});
				
				var oNovoImplemento = new Implemento();
				oNovoImplemento.Empresa = EmpresaId
				oNovoImplemento.Usuario = UsuarioId
				oNovoImplemento.EmpresaDetails = new EmpresaDetails( EmpresaId );
				oNovoImplemento.UsuarioDetails = new UsuarioDetails( UsuarioId );

				oJSONModel.setData(oNovoImplemento);

			} else if (this._operacao === "editar"){
				
				this._sPath = "/Implementos(" + oQuery.id + ")";

				oViewModel.setData({
					titulo: "Editar Implemento"
				});
				
				oModel.read(this._sPath,{
					success: function(oData) {
						oData.UsuarioDetails = new UsuarioDetails( UsuarioId );
						oJSONModel.setData(oData);
					}
				});
			}
		},
		
		onSalvar: function(){
			if (this._checarCampos(this.getView())) {
				MessageBox.warning("Preencha todos os campos obrigatórios!");
				return;
			}
			
			if (this._operacao === "incluir") {
				this._createData();
			} else if (this._operacao === "editar") {
				this._updateData();
			}
		},
		
		_goBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
					window.history.go(-1);
			} else {
				oRouter.navTo("overview", {}, true);
			}
		},
		
		_getDados: function(){
			var oJSONModel = this.getOwnerComponent().getModel("model");
			var oDados = oJSONModel.getData();
			
			return oDados;
		},
		
		_createData: function() {
			var oModel = this.getOwnerComponent().getModel();
			var that = this;

			oModel.create("/Implementos", this._getDados(), {
				success: function() {
					MessageBox.success("Dados gravados!", {
						onClose: function(){
							that._goBack(); 
						}
					});
				}
			});
		},
		
		_updateData: function() {
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			
			oModel.update(this._sPath, this._getDados(), {
					success: function() {
					MessageBox.success("Dados gravados!", {
						onClose: function(){
							that._goBack();
						}
					});
				}
			});
		},
		
		_checarCampos: function(oView){
			if(oView.byId("descricao").getValue() === "" || oView.byId("numero").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		onVoltar: function(){
			this._goBack();
		},
		
		getModel : function(sModel) {
			return this.getOwnerComponent().getModel(sModel);	
		}
	});

});