sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.Launchpad", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //call ODataService
                //this.callODataService();
           
            },
            onAfterRendering: function () {
                this.callODataService();
            },
            callODataService: function (){
                var that=this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                
                OData.read("/IndustryList", {
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                                          
                        that.getView().byId("Industry").setModel(ListModel, "IndustryModel");  
                        var GlobalIndustryModel = sap.ui.getCore().getModel("GlobalIndustryModel");
                        GlobalIndustryModel.getData().Industry = data.results[0].Industry;
                        GlobalIndustryModel.getData().KPIListTable = data.results[0].KPIListTable;
                        GlobalIndustryModel.getData().SocialTable = data.results[0].SocialTable;
                        GlobalIndustryModel.getData().TransactionTable = data.results[0].TransactionTable;        

                        GlobalIndustryModel.getData().UOM_Telecom = data.results[0].UOM_Telecom;        
                        GlobalIndustryModel.getData().UoMConversions_Telecom = data.results[0].UoMConversions_Telecom;        
                        GlobalIndustryModel.getData().EmissionFactors_Telecom = data.results[0].EmissionFactors_Telecom;       

                    },
                    error: function (err) {
                        sap.m.MessageBox.error("Error");
                    }
                });
            },
            onSelectionIndustry: function (oEvent) {
                var that = this;
                //var selText = oEvent.getParameter("selectedItem").getText();
                var selText = oEvent.getParameter("selectedItem").getKey();
                console.log("Selected Insdustry:" + selText);
                //mickey
                var GlobalIndustryModel = sap.ui.getCore().getModel("GlobalIndustryModel");
                var oIndustryModel = this.getView().byId("Industry").getModel("IndustryModel");
                var len = oIndustryModel.getData().results.length;
                for (var i = 0; i < len; i++) {
                    if (selText === oIndustryModel.getData().results[i].Industry) {
                        GlobalIndustryModel.getData().Industry = oIndustryModel.getData().results[i].Industry;
                        GlobalIndustryModel.getData().KPIListTable = oIndustryModel.getData().results[i].KPIListTable;
                        GlobalIndustryModel.getData().SocialTable = oIndustryModel.getData().results[i].SocialTable;
                        GlobalIndustryModel.getData().TransactionTable = oIndustryModel.getData().results[i].TransactionTable;
                        
                        GlobalIndustryModel.getData().UOM_Telecom = oIndustryModel.getData().results[i].UOM_Telecom;
                        GlobalIndustryModel.getData().UoMConversions_Telecom = oIndustryModel.getData().results[i].UoMConversions_Telecom;
                        GlobalIndustryModel.getData().EmissionFactors_Telecom = oIndustryModel.getData().results[i].EmissionFactors_Telecom;
                        break;
                    }
                    else continue;
                }
            },
            handleTilePress: function(oEvent){
              this.getOwnerComponent().getRouter().navTo("Environment", {}, true);
              //  this.getOwnerComponent().getRouter().navTo("TrackerForm", {}, true);
               // this.getOwnerComponent().getRouter().navTo("MiningForm", {}, true);
           },
           handleTilePress_HR: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("Social", {}, true);          
          //  this.getOwnerComponent().getRouter().navTo("HumanResource", {}, true);
          },
          handleTilePress_FI : function(oEvent){
                
            this.getOwnerComponent().getRouter().navTo("Finance", {}, true);
          },
          handleTilePress_DB : function(oEvent){
            this.getOwnerComponent().getRouter().navTo("Dashboard", {}, true);
          },
          handleTilePress_Admin : function(oEvent){
            this.getOwnerComponent().getRouter().navTo("Admin", {}, true);
          },
          handleTilePress_BulkUpload : function(oEvent){
            this.getOwnerComponent().getRouter().navTo("BulkUpload", {}, true);
          },
          onTilePress: function(oEvent){
            this.getOwnerComponent().getRouter().navTo("Login", {}, true);
          },
        });
    });