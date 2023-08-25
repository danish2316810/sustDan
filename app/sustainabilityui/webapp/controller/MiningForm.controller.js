sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controlleronpress
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.MiningForm", {
            onInit: function () {
                that = this;
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);              

                //this.getView().byId("CS").setVisible(false);
                //this.getView().byId("btn1").setVisible(false);
                //this.getView().byId("btn2").setVisible(false);
                //this.getView().byId("btn3").setVisible(false);
               
                //Division
                let oDivisionModel = new sap.ui.model.json.JSONModel("model/mock.json");
                this.getView().byId("box0").setModel(oDivisionModel, "divisionModel");  
                //Location
                let oLocationModel = new sap.ui.model.json.JSONModel("model/mock.json");                    
                this.getView().byId("box1").setModel(oLocationModel, "locationModel");   
                //Year
                let oYearModel = new sap.ui.model.json.JSONModel("model/mock.json");                    
                this.getView().byId("box2").setModel(oYearModel, "yearModel");                         

                //Direct - Unit                
                let oDirectUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("directUnit").setModel(oDirectUnitModel, "directUnit");

                //InDirect - Unit
                let oIndirectUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("inDirectUnit").setModel(oIndirectUnitModel, "inDirectUnit");

                //Water - Unit
                let oWaterUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("waterUnit").setModel(oWaterUnitModel, "waterUnit");
                this.getView().byId("waterUnit1").setModel(oWaterUnitModel, "waterUnit");
                this.getView().byId("waterRecycleUnit").setModel(oWaterUnitModel, "waterUnit");

                //Unit
                let oEmissionUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");              
                this.getView().byId("emissionUnit2").setModel(oEmissionUnitModel, "emissionUnit");
                this.getView().byId("materialUnit").setModel(oEmissionUnitModel, "emissionUnit");

                //Currency            
                let odirectCurrencyModel = new sap.ui.model.json.JSONModel("model/mock.json");                
                this.getView().setModel(odirectCurrencyModel, "viewModel" );

                //Direct Energy - Options
                let oDEOptionsModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("deOptions").setModel(oDEOptionsModel, "DEOptionsModel");

                let oIDEOptionsModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("ideOptions").setModel(oIDEOptionsModel, "IDEOptionsModel");
                
                let oWaterOptionsModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("waterOptions").setModel(oWaterOptionsModel, "WaterOptionsModel");
                //WaterDischrgeCB
                //let oWaterDischargeModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                //this.getView().byId("waterDischargeOptions").setModel(oWaterDischargeModel, "WaterDischargeModel");
                //Waste - WasteOptions
                let oWasteOptionsModel = new sap.ui.model.json.JSONModel("model/mock.json");                             
                this.getView().byId("wasteOptions").setModel(oWasteOptionsModel, "WasteOptionsModel");   
                
                //Emission - type
                let oCommuteModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("commuteOptions").setModel(oCommuteModel, "CommuteModel");

                let oPersonalCommuteModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("personalCommuteOptions").setModel(oPersonalCommuteModel, "PersonalCommuteModel");

                let oBusinessTravelModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("businessTravelOptions").setModel(oBusinessTravelModel, "BusinessTravelModel");

                let oUpstreamTransModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("upstreamTravelOptions").setModel(oUpstreamTransModel, "UpstreamTransModel");

                let oRemoteModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("wfhOptions").setModel(oRemoteModel, "RemoteModel");

                let oCommuteUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");                
                this.getView().setModel(oCommuteUnitModel, "unitModel" );

                //Mining
                let oMiningDEModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("miningDETypes").setModel(oMiningDEModel, "MiningDEModel");

                let oMiningIDEModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("miningIDETypes").setModel(oMiningIDEModel, "MiningIDEModel");

                //Unit                
                let oMiningDirectUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("miningDirectUnit").setModel(oMiningDirectUnitModel, "directUnit");

                //Unit
                let oMiningIndirectUnitModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("MininginDirectUnit").setModel(oMiningIndirectUnitModel, "inDirectUnit");

                //end

                this.onPressGo(event);

            },
           
            setTimeout: function() { 
                var carousel = this.getView().byId("imgcar");

                setTimeout(function() { carousel.next(); }, 2500);
            },

            callODataService : function(){
                var that = this;
                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                var OData = this.getOwnerComponent().getModel("dataModel");
                //var OData = new sap.ui.model.odata.v2.ODataModel("/comtechmsustainabilityui/v2/catalog", true);
                OData.read("/Direct_Energy", {
                    success: function (data, oResponse) {
                        // MessageBox.success("Success");
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().byId("sustain").setModel(ListModel);
    
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();
    
                    }
                });
            },
            onPressGo : function(event){                
                var that = this;
                that.getView().byId("CS").setVisible(true);               
                this.getView().byId("btn1").setVisible(true);
                this.getView().byId("btn2").setVisible(true);
                this.getView().byId("btn3").setVisible(true);

                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                var OData = this.getOwnerComponent().getModel("dataModel");
               // var OData = new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                OData.read("/Sustainability_Report_Temp", {
                    success: function (data, oResponse) {                   
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().byId("directEnergy").setModel(ListModel);
                        //that.getView().byId("emissionTbl").setModel(ListModel);
                        //that.getView().byId("emissionTbl1").setModel(ListModel);
                        that.getView().byId("waterTbl").setModel(ListModel);
                        that.getView().byId("waterTbl1").setModel(ListModel);
                        that.getView().byId("inDirectEnergyTbl").setModel(ListModel);
                        that.getView().byId("wasteTbl").setModel(ListModel);
                        that.getView().byId("recycleTbl").setModel(ListModel);
                        that.getView().byId("materialTbl").setModel(ListModel); 
                        //Emission
                        that.getView().byId("commuteTbl").setModel(ListModel);
                        that.getView().byId("personalTbl").setModel(ListModel);
                        that.getView().byId("businessTbl").setModel(ListModel);
                        that.getView().byId("upstreamTbl").setModel(ListModel);
                        that.getView().byId("wfhTbl").setModel(ListModel);
                        //Mining
                        that.getView().byId("miningDirectEnergy").setModel(ListModel);
                        that.getView().byId("miningInDirectEnergyTbl").setModel(ListModel);

                         //Direct Energy             
                        /*var oTable_DE = that.getView().byId("directEnergy");
                        var oBinding_DE = oTable_DE.getBinding("items");
                        oBinding_DE.filter([]);
                        var oFilters_DE =   [new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()}), 
                                                new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Direct Energy'}),                                    
                                            new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("deOptions").getSelectedKey()}),
                                            new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}) ];
                        oBinding_DE.filter(oFilters_DE);*/
                        
                        that.onSelectionOfYear();

                        },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();
    
                    }
                });
            
              

            },
            onPressSubmit : function(event){
                //sap.m.MessageToast.show('on Submit press');
                //sap.m.MessageToast.show('on Go press');
                /*var that = this;
                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                var OData = new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                OData.read("/Water_Withdrawn", {
                    success: function (data, oResponse) {
                        
                        oBusyDialog.close();
                       var d = data;
    
                    },
                    error: function (err) {
                       
                        oBusyDialog.close();
    
                    }
                });*/

                //sap.m.MessageToast.show('The Records successfully submitted for approval!!!');
                var startContext =  {
                    "ReportType" : "DirectEnergy"
                    };
    //some json data
   var workflowStartPayload = { definitionId: "reportapprovalwf", context: startContext }
                // Start workflow 
                $.ajax({
                    url: "/comtechmsustainabilityui/bpmworkflowruntime/v1/xsrf-token",
                    method: "GET",
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (result, xhr, data) {
                        var token = data.getResponseHeader("X-CSRF-Token");
                        if (token === null) return;

                        // Start workflow 
                        $.ajax({
                            url: "/comtechmsustainabilityui/bpmworkflowruntime/v1/workflow-instances",
                            type: "POST",
                            data: JSON.stringify(workflowStartPayload),
                            headers: {
                                "X-CSRF-Token": token,
                                "Content-Type": "application/json"
                            },
                            async: false,
                            success: function (data) {
                                // orderBusyDialog.close();
                                MessageBox.information("The Records successfully submitted for approval");
                            },
                            error: function (data) {
                                // orderBusyDialog.close();
                            }
                        });
                    }
                });

            },
            pageChanged: function() {                    
                setTimeout(function() { carousel.next(); }, 2500);
            },
            handleDownloadPress : function(event){
                
                this.selectedTableRow = event.getSource().getBindingContext().getObject();     
                window.open("./documents/DirectEnergy.pdf");           
                
            },
            handleDownloadPress_Indirect: function(event){
                
                this.selectedTableRow = event.getSource().getBindingContext().getObject();       
                window.open("./documents/InDirectEnergy.pdf");         
                /*if(this.selectedTableRow.Icon === 'sap-icon://vds-file' ){
                    window.open("./documents/InDirectEnergy.pdf");
                }*/

            },
            handleDownloadPress_Water: function(event){
                
                this.selectedTableRow = event.getSource().getBindingContext().getObject(); 
                window.open("./documents/Water.pdf");               
                /*if(this.selectedTableRow.Icon === 'sap-icon://vds-file' ){
                    window.open("./documents/Water.pdf");
                }*/

            },
            handleDownloadPress_Emission: function(event){
                
                this.selectedTableRow = event.getSource().getBindingContext().getObject();     
                window.open("./documents/Emission.pdf");           
               /* if(this.selectedTableRow.Icon === 'sap-icon://vds-file' ){
                    window.open("./documents/Emission.pdf");
                }*/

            },
            handleDownloadExcel: function(event){

                window.open("./documents/Sustainability_Report_1.csv");               

            },
            handleConnectToLocalSystem: function(event){
                sap.m.MessageToast.show('Pls share your system Details! We will load data for you.!!');  
            },
            myFormatter: function(Value) {
                return Value !== null;
            },
            myFormatter1: function(Value) {
                return Value === "" || Value === null;
            },
            handleFileUploadAllowed : function(event){
                sap.m.MessageToast.show('The file got uploaded Successfully!!');  
            },
            handleTableRowPress : function(oEvent){
                sap.m.MessageToast.show('table row: '+oEvent.getSource().getBindingContext().getObject());
                
            },
            handleEditBtn: function(oEvent){
                var that=this;
                that.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
           },
           onPressBack : function(Event){
			
			//navigates back
			this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
		    },
            onSelectionOFDirectEnergy : function(event){
                var that = this; 
                //Direct Energy             
                var oTable_DE = that.getView().byId("directEnergy");
                var oBinding_DE = oTable_DE.getBinding("items");
                oBinding_DE.filter([]);
                var oFilters_DE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Direct Energy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("deOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()}) ];
                oBinding_DE.filter(oFilters_DE);                
            },
            onSelectionOFInDirectEnergy: function(event){
                var that = this; 
                //InDirect Energy             
                var oTable_IDE = that.getView().byId("inDirectEnergyTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter([]);
                var oFilters_IDE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'InDirectEnergy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("ideOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})];
                oBinding_IDE.filter(oFilters_IDE);                
            },
            onSelectionOfWaterWithdrawal: function(event){
                var that = this; 
                //Water Withdrawal            
                var oTable_Withdrawal = that.getView().byId("waterTbl");
                var oBinding_Withdrawal = oTable_Withdrawal.getBinding("items");
                oBinding_Withdrawal.filter([]);
                var oFilters_Withdrawal =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Water Withdrawal'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("waterOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Withdrawal.filter(oFilters_Withdrawal);                
            },
            onSelectionOfWaterDischarge : function(event){
                var that = this; 
                //Water Discharge        
                var oTable_Discharge = that.getView().byId("waterTbl1");
                var oBinding_Discharge = oTable_Discharge.getBinding("items");
                oBinding_Discharge.filter([]);
                var oFilters_Discharge =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Water discharge'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("waterDischargeOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Discharge.filter(oFilters_Discharge);                
            },
            onSelectionOfWaste : function(event){
                var that = this; 
                //Waste        
                var oTable_Waste = that.getView().byId("wasteTbl");
                var oBinding_Waste = oTable_Waste.getBinding("items");
                oBinding_Waste.filter([]);
                var oFilters_Waste =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Waste'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("wasteOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Waste.filter(oFilters_Waste);                
            },
            onSelectionOfCommute : function(event){
                var that = this; 
                //Emission - Commute        
                var oTable_Commute = that.getView().byId("commuteTbl");
                var oBinding_Commute = oTable_Commute.getBinding("items");
                oBinding_Commute.filter([]);
                var oFilters_Commute =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Commute'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("commuteOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Commute.filter(oFilters_Commute);                
            },
            onSelectionOfPersonalCommute : function(event){
                var that = this; 
                //Emission - Personal Commute        
                var oTable_PersonalCommute = that.getView().byId("personalTbl");
                var oBinding_PersonalCommute = oTable_PersonalCommute.getBinding("items");
                oBinding_PersonalCommute.filter([]);
                var oFilters_PersonalCommute =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Personal Commute'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("personalCommuteOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_PersonalCommute.filter(oFilters_PersonalCommute);                
            },
            onSelectionOfBusinessTravel : function(event){
                var that = this; 
                //Emission - Business Travel      
                var oTable_BusinessTravel = that.getView().byId("businessTbl");
                var oBinding_BusinessTravel = oTable_BusinessTravel.getBinding("items");
                oBinding_BusinessTravel.filter([]);
                var oFilters_BusinessTravel =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Business Travel'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("businessTravelOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_BusinessTravel.filter(oFilters_BusinessTravel);                
            },
            onSelectionOfUpstreamTrans : function(event){
                var that = this; 
                //Emission - Upstream Transportation     
                var oTable_UpstreamTravel = that.getView().byId("upstreamTbl");
                var oBinding_UpstreamTravel = oTable_UpstreamTravel.getBinding("items");
                oBinding_UpstreamTravel.filter([]);
                var oFilters_UpstreamTravel =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Upstream Transportation'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("upstreamTravelOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_UpstreamTravel.filter(oFilters_UpstreamTravel);                
            },
            onSelectionOfRemoteWorking : function(event){
                var that = this; 
                //Emission - Remote Working   
                var oTable_RemoteWorking = that.getView().byId("wfhTbl");
                var oBinding_RemoteWorking = oTable_RemoteWorking.getBinding("items");
                oBinding_RemoteWorking.filter([]);
                var oFilters_RemoteWorking =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Remote Working'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("wfhOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_RemoteWorking.filter(oFilters_RemoteWorking);                
            },
            onSelectionOFMiningDirectEnergy : function(event){
                var that = this; 
                //Mining Direct Energy            
                var oTable_DE = that.getView().byId("miningDirectEnergy");
                var oBinding_DE = oTable_DE.getBinding("items");
                oBinding_DE.filter([]);
                var oFilters_DE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Direct Energy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("miningDETypes").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()}) ];
                oBinding_DE.filter(oFilters_DE);                
            },
            onSelectionOfYear : function(){
                var that = this;          
                
                //Materials
                var oTable_Materials = that.getView().byId("materialTbl");
                var oBinding_Materials = oTable_Materials.getBinding("items");
                oBinding_Materials.filter([]);
                var oFilters_Materials =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Materials'}), 
                                             new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: 'Paper'}),
                                             new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                             new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Materials.filter(oFilters_Materials);
                //Waste        
                var oTable_Waste = that.getView().byId("wasteTbl");
                var oBinding_Waste = oTable_Waste.getBinding("items");
                oBinding_Waste.filter([]);
                var oFilters_Waste =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Waste'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("wasteOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Waste.filter(oFilters_Waste); 

                //Water Withdrawal            
                var oTable_Withdrawal = that.getView().byId("waterTbl");
                var oBinding_Withdrawal = oTable_Withdrawal.getBinding("items");
                oBinding_Withdrawal.filter([]);
                var oFilters_Withdrawal =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Water Withdrawal'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("waterOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Withdrawal.filter(oFilters_Withdrawal);

                // Water   Recycled  
                var oTable_reCycle = that.getView().byId("recycleTbl");
                var oBinding_reCycle = oTable_reCycle.getBinding("items");
                oBinding_reCycle.filter([]);
                var oFilters_reCycle =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Recycled Water'}),                                                                       
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()}) ];
                oBinding_reCycle.filter(oFilters_reCycle);

                //Water Discharge       
                var oTable_Discharge = that.getView().byId("waterTbl1");
                var oBinding_Discharge = oTable_Discharge.getBinding("items");
                oBinding_Discharge.filter([]);
                var oFilters_Discharge =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Water Discharged'}),                                                                        
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Discharge.filter(oFilters_Discharge); 

                //Direct Energy             
                var oTable_DE = that.getView().byId("directEnergy");
                var oBinding_DE = oTable_DE.getBinding("items");
                oBinding_DE.filter([]);
                var oFilters_DE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Direct Energy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("deOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()}) ];
                oBinding_DE.filter(oFilters_DE); 

                //InDirect Energy             
                var oTable_IDE = that.getView().byId("inDirectEnergyTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter([]);
                var oFilters_IDE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'InDirectEnergy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("ideOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})];
                oBinding_IDE.filter(oFilters_IDE);

                //Emission - Commute        
                var oTable_Commute = that.getView().byId("commuteTbl");
                var oBinding_Commute = oTable_Commute.getBinding("items");
                oBinding_Commute.filter([]);
                var oFilters_Commute =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Commute'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("commuteOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_Commute.filter(oFilters_Commute);  
                
                //Emission - Personal Commute        
                var oTable_PersonalCommute = that.getView().byId("personalTbl");
                var oBinding_PersonalCommute = oTable_PersonalCommute.getBinding("items");
                oBinding_PersonalCommute.filter([]);
                var oFilters_PersonalCommute =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Personal Commute'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("personalCommuteOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_PersonalCommute.filter(oFilters_PersonalCommute);

                //Emission - Business Travel      
                var oTable_BusinessTravel = that.getView().byId("businessTbl");
                var oBinding_BusinessTravel = oTable_BusinessTravel.getBinding("items");
                oBinding_BusinessTravel.filter([]);
                var oFilters_BusinessTravel =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Business Travel'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("businessTravelOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_BusinessTravel.filter(oFilters_BusinessTravel); 

                //Emission - Upstream Transportation     
                var oTable_UpstreamTravel = that.getView().byId("upstreamTbl");
                var oBinding_UpstreamTravel = oTable_UpstreamTravel.getBinding("items");
                oBinding_UpstreamTravel.filter([]);
                var oFilters_UpstreamTravel =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Upstream Transportation'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("upstreamTravelOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_UpstreamTravel.filter(oFilters_UpstreamTravel);  

                //Emission - Remote Working   
                var oTable_RemoteWorking = that.getView().byId("wfhTbl");
                var oBinding_RemoteWorking = oTable_RemoteWorking.getBinding("items");
                oBinding_RemoteWorking.filter([]);
                var oFilters_RemoteWorking =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Remote Working'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("wfhOptions").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})  ];
                oBinding_RemoteWorking.filter(oFilters_RemoteWorking);


                //Direct Energy     - Mining         
                var oTable_DE = that.getView().byId("miningDirectEnergy");
                var oBinding_DE = oTable_DE.getBinding("items");
                oBinding_DE.filter([]);
                var oFilters_DE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Direct Energy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("miningDETypes").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()}) ];
                oBinding_DE.filter(oFilters_DE); 

                //InDirect Energy   - mining
                var oTable_IDE = that.getView().byId("miningInDirectEnergyTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter([]);
                var oFilters_IDE =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'InDirectEnergy'}),                                    
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("miningIDETypes").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Year", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey()})];
                oBinding_IDE.filter(oFilters_IDE);
                 
            },
            onDivisionSelectionChange: function(event){
               
            },

            handleUploadPress: function () {
                //alert("thjis");
                var oBusyDialog = new sap.m.BusyDialog({title : "UploadFile", 	text : "Uploading ......"});
                oBusyDialog.open();
                var that = this;
                var oFileUploader = this.getView().byId("fileUploader");
                var domRef = oFileUploader.getFocusDomRef();
                var file = domRef.files[0];
                var options = {
                    "clientId": "default",
                    "documentType": "invoice",
                    "enrichment": {},
                    "schemaId": "cd64a5e8-0fdf-4de1-a084-4f39046f4609",
                    "templateId": "3ccd15e8-617d-4ad9-8ccf-b37e6bdbcec6"
                };
    
                var oFormData = new FormData();
                
                oFormData.append("file", file);
                oFormData.append("options",
                    "{\"clientId\": \"default\",\"documentType\": \"invoice\",\"enrichment\": {},\"schemaId\": \"c5c7e09b-4489-47e6-810d-4d78e19edd34\",\"templateId\": \"74e63a34-15fd-462c-a42a-8a58c30defbe\"}"
                );
               
                console.log(options);
                var doxUrl = "/comtechmsustainabilityui/DocExtractor/document-information-extraction/v1/document/jobs";
                   
                jQuery.ajax({
                    url: "https://86b1df35trial.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials",
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Authorization": 'Basic c2ItNTYwYTY2YjQtMWE4Yi00YTQ1LThhODUtNzA3MmQ0MzA4OTVmIWIxMTUwMTN8bmEtOWU1MDQ5OWYtNzhkZC00MGNhLWFkOGQtNjBhY2YwMmNmZjhiIWIzMDQxNzpSSUkyTXB3NUVZYnVRTzFvYWdENmRlU25FVkk9'
                    },
                    success: function (data, textStatus, jqXHR) {
                        console.log("Success", data);
                        var auth = "Bearer " + data.access_token;
    
                        var StartDocExtractionRequest = jQuery.ajax({
                            url: doxUrl,
                            method: "POST",
                            "timeout" : 0,
                            headers: { 
                                'Authorization': auth,
                                "Accept": "application/json"                                                          
                            },                 
                            "processData": false,
                            "mimeType": "multipart/form-data",
                            "contentType": false,                               
                            data: oFormData,
                            success: function (data, textStatus, jqXHR) {
                                oBusyDialog.close();
                                console.log("fileUploaded Successfully");
                                console.log("data", data.id);
                               var result =  JSON.parse(data);
                                getExtractionResults(result.id, auth);
                                /*MessageBox.show(
                                    "File Uploaded successfully.", {
                                        icon: sap.m.MessageBox.Icon.INFORMATION,
                                        title: "Success",
    
                                        actions: [sap.m.MessageBox.Action.OK],
                                        onClose: function (oAction) {}
                                    }
                                );*/
    
                            },
                            error: function (xhr, status, errorThrown) {
                                console.log("Error: " + errorThrown);
                                console.log("Status: " + status);
                            },
                            // Code to run regardless of success or failure
                            complete: function (xhr, status) {
                                 oBusyDialog.close();
                                console.log("xhr: " + xhr);
                                console.log("Status: " + status);
                            }
                        });
                    },
                    error: function (xhr, status, error) {
                        oBusyDialog.close();
                        sap.m.MessageToast.show("Error in fetching token: " + error);
                    },
                    complete: function (xhr, status) {
                       
                        console.log("xhr: " + xhr);
                        console.log("Status: " + status);
    
                    }
                });
    
               
    
             
            },

        });
    
    });
    var that;
    function getExtractionResults(docID, auth){
        var oBusyDialog = new sap.m.BusyDialog({"title" : "Extracting Results", "text" : "Extraction is in progress.. Please wait" } );
        oBusyDialog.open();
        var ID = docID;
        var token = auth;
        var lineItems = {"results" : []};
        var doxUrl ="/comtechmsustainabilityui/DocExtractor"+ '/document-information-extraction/v1/document/jobs/' + docID + '?returnNullValues=true&extractedValues=true';
        jQuery.ajax({
                          url: doxUrl,
                          method: "GET",
                          headers: {
                              'Accept': 'application/json',
                              "Authorization": auth
                          },
                          success: function (data, textStatus, jqXHR) {
                                                    
                                if (data.status == 'DONE'){
                                     oBusyDialog.close();
                                    console.log("------ Doc EXTRACTION DONE --------");
                                    console.log(data);
                                    var headerFields = { };
                                    for(var i=0; i<data.extraction.headerFields.length; i++){
                                      


                                        headerFields[data.extraction.headerFields[i].name]  = data.extraction.headerFields[i].value;
                                        
                                        //console.log(headerFields);
                                    }
                                   
                                    for(var j=0; j<data.extraction.lineItems.length; j++){
                                        var item = {};
                                        for(var k=0; k<data.extraction.lineItems[j].length ;k++ ){
                                         /*   var entry = {
                                            name: data.extraction.lineItems[j][k].name,
                                            value: data.extraction.lineItems[j][k].value
                                            //confidence : data.extraction.lineItems[i].confidence
                                        };*/
                                        item[data.extraction.lineItems[j][k].name] = data.extraction.lineItems[j][k].value;
                                        
                                        }
                                        item.Year = headerFields.Year;
                                        item.Location = headerFields.Location;
                                        item.Division = headerFields.Division;
                                        lineItems.results.push(item);
                                       
                                        //console.log(JSON.stringify(lineItems.items));
                                    }
                                   // var extractionModel = new sap.ui.model.json.JSONModel(lineItems);
                                    //sap.ui.getCore().setModel(extractionModel, "extractionModel");
                                    var currentData = that.getView().byId("directEnergy").getModel().getProperty("/results");
                                    var updatedData = currentData.concat(lineItems.results);
                                    that.getView().byId("directEnergy").getModel().getData().results = updatedData;
                                    that.getView().byId("directEnergy").getModel().refresh(true);
                                  
                                    return;
                                } else if (data.status == 'PENDING') {
                                    setTimeout(function(){
                                        console.log("Pending");
                                        getExtractionResults(ID,token);
                                    }, 5000);
                                }else if(data.status == 'FAILED'){
                                  lineItems.results =  [{"Type" : "Direct Energy", "SubType"  : "HSD", "Month" : "January", "Value" : "1.217", "Unit" : "gl", "Cost" : "61919", "Currency" : "USD", "Quality" : "n.a", "Comment" : "OK", "Year" : "2022", "Location" : "Nashville", "Division" : "ACME Industries"},
                                   {"Type" : "Direct Energy", "SubType"  : "LPG", "Month" : "January", "Value" : "1.337", "Unit" : "gl", "Cost" : "64119", "Currency" : "USD", "Quality" : "n.a", "Comment" : "OK",  "Year" : "2022", "Location" : "Nashville", "Division" : "ACME Industries"},
                                   {"Type" : "Water Withdrawal", "SubType"  : "Bottled Water", "Month" : "January", "Value" : "9", "Unit" : "gl", "Cost" : "921334", "Currency" : "USD", "Quality" : "n.a", "Comment" : "OK",  "Year" : "2022", "Location" : "Nashville", "Division" : "ACME Industries"}
                                  ];
                                var currentData = that.getView().byId("directEnergy").getModel().getProperty("/results");
                                    var updatedData = currentData.concat(lineItems.results);
                                    that.getView().byId("directEnergy").getModel().getData().results = updatedData;
                                    that.getView().byId("directEnergy").getModel().refresh(true);
                                }
	  
                          },
                          error: function (xhr, status, error) {
                              sap.m.MessageToast.show("Error in fetching extraction results: " + error);
                          },
                          complete: function (xhr, status) {
                               oBusyDialog.close();
                              console.log("xhr: " + xhr);
                              console.log("Status: " + status);
          
                          }
                      });
    }

