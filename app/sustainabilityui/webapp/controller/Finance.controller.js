sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.Finance", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.getView().byId("object1").setVisible(false);
                this.getView().byId("btn1").setVisible(false);
                this.getView().byId("btn2").setVisible(false);
                this.getView().byId("btn3").setVisible(false);

                //Division             
                let oDivisionModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("box0").setModel(oDivisionModel, "divisionModel");
                //Location
                let oLocationModel = new sap.ui.model.json.JSONModel("model/mock.json");                    
                this.getView().byId("box1").setModel(oLocationModel, "locationModel");
                //Year
                let oYearModel = new sap.ui.model.json.JSONModel("model/mock.json");                    
                this.getView().byId("box2").setModel(oYearModel, "yearModel");
            },
            onPressBack : function(Event){
			
                //navigates back
                this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
            },  
            onPressGo : function(event){                
                var that = this;
                
                this.getView().byId("object1").setVisible(true);
                this.getView().byId("btn1").setVisible(true);
                this.getView().byId("btn2").setVisible(true);
                this.getView().byId("btn3").setVisible(true);

                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                var OData = this.getOwnerComponent().getModel("dataModel");
                //var OData = new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                OData.read("/Governance_Report", {
                    success: function (data, oResponse) {                   
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().setModel(ListModel);                       
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();
    
                    }
                });      

            },
        });
    });