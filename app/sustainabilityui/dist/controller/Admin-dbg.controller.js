sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
	"sap/m/MessageToast",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/syncStyleClass",
    "sap/m/Token"
  
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Fragment, FilterOperator, Filter, syncStyleClass, Token) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.Admin", {

            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                let oModel = new sap.ui.model.json.JSONModel("model/mock.json");
                this.getView().setModel(oModel);
                //this.GlobalIndustryModel = sap.ui.getCore().getModel("GlobalIndustryModel");// commented on Feb 27

                

              //  this.callODataService();

               // this.UOMConversionMeasure = "Distance"; //mk // commented by krishnaveni on 13 dec
                //    this.KPITypeSelected = "ENERGY";
                //   this.KPISubtypeSelected = "Direct Energy";
                
               /* var Industry = this.GlobalIndustryModel.getData().Industry;                
                if(Industry === "IT"){
                    this.UOMSelected = "Area";
                    this.UOMConversionMeasure = "Area";
                    this.KPITypeSelected = "NETWORK TRAFFIC";
               }else if(Industry === "Telecom"){
                    this.UOMSelected = "Data";
                    this.UOMConversionMeasure = "Data";
                    this.KPITypeSelected="NETWORK TRAFFIC";
               }*/
              
                //this.UOMSelected = "Area";// commented by krishnaveni on 13 dec
                this.UserInputUnit = "";
                this.ExpectedOutputUnit = "";
                this.EFSelected = "ENERGY";
                this.KPIListTypeSelected = "Environment";

                //KPI LIST
                this.SDG = "";
                this.Scope = "";
                this.CalculationLogic = "";
                this.Standard = "";
                this.Measure = "";
                this.Template = "";
                this.RENON = "";

                //Emission Factors
                this.EFStandard = "";
                this.KPI_EF = "";

                //Currency            
                let odirectCurrencyModel = new sap.ui.model.json.JSONModel("model/mock.json");
                this.getView().setModel(odirectCurrencyModel, "viewModel");

                //Direct - Unit                
                //let oOperationModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                //this.getView().byId("operation").setModel(oOperationModel, "operationUnit");
                this.ConversionTypeSelected = "UoM Conversions";
                this.UoMTypeSelected = "Measure Type";
                this.EFTypeSelected = "DEFRA";
                
                this.PrefixTypesSelected = "Prefix Types";

                //this.getView().byId("yearRBtn").setSelectedKey("Jan - Dec");
                //var rb = this.getView().byId("yearRBtn");
                //rb.setSelectedButton("Jan - Dec");
                //rb.aRBs[rb.setSelectedIndex()].mProperties.text = "Jan - Dec";
              
                this._mViewSettingsDialogs = {};

                //KPI Table - Standards Logic
                var oStd = {
                    "data": [
                        {
                             "name": "GRI",
                             "value": "GRI"
                        },
                        {
                             "name": "SASB",
                             "value": "SASB"
                        }                        
                    ]  
                };
                var oStdsModel = new sap.ui.model.json.JSONModel(oStd);
                this.getView().setModel(oStdsModel, "StdsModel");

                //KPI Table - Biogenic Emission Values
                var oBiogenic = {
                    "data": [
                        {
                             "name": "Yes",
                             "value": "Yes"
                        },
                        {
                             "name": "No",
                             "value": "No"
                        }                        
                    ]  
                };
                var oBioGen = new sap.ui.model.json.JSONModel(oBiogenic);
                this.getView().setModel(oBioGen, "BioGen"); 


                var griModel  = new sap.ui.model.json.JSONModel();
                this.getView().setModel(griModel, "NodesModel");

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getTarget("Admin").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            },
            handleRouteMatched : function(evt){ 
                
                this.GlobalIndustryModel = sap.ui.getCore().getModel("GlobalIndustryModel");//added on Feb 27

                this.initRichTextEditor(true);
                var Industry = this.GlobalIndustryModel.getData().Industry;                
                if(Industry === "IT"){
                    this.UOMSelected = "Area";
                    this.UOMConversionMeasure = "Area";
                    this.KPITypeSelected = "NETWORK TRAFFIC";
               }else if(Industry === "Telecom"){
                    this.UOMSelected = "Data";
                    this.UOMConversionMeasure = "Data";
                    this.KPITypeSelected="NETWORK TRAFFIC";
               }
                    this.PrefixSelected = "Employee Category";
                //added for HTML
                this.total=0;
                this.valArray=[];
                this.socialPrefix = "";
                this.callODataService(); //odata service calls
                
            },
          /*  onBeforeRendering: function () {
                this.callODataService();
            },*/
            onAfterRendering: function () {
                this.getView().byId("shortLongColn").setVisible(false);
                this.getView().byId("classColn").setVisible(false);               
            },
            addNewButtonPressHandler: function (event) {
                //sap.m.MessageToast.show("test");
            },
            onPressBack: function (Event) {
                //navigates baonSelect_Convsck
                this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
            },
            handleSelectionFinish_StdsLogic: function (oEvent) {
                var selectedItems = oEvent.getParameter("selectedItems");
                var messageText = "";

                for (var i = 0; i < selectedItems.length; i++) {
                    messageText += selectedItems[i].getText();
                    if (i != selectedItems.length - 1) {
                        messageText += ",";
                    }
                }       

                /*sap.m.MessageToast.show(messageText, {
                    width: "auto"
                });*/

               /* if (messageText === "GRI"){
                    this.getView().byId("KPIListTbl").getColumns()[12].setVisible(true);                    
                }else{
                    this.getView().byId("KPIListTbl").getColumns()[12].setVisible(false);                    
                } commented on 2 Mar*/

            },
            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "com.techm.sustainabilityui.fragment.ValueHelpDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
    
                    //oDialog.getBinding("items").filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sInputValue)]);
                    //Open ValueHelpDialog filtered by the input's value

                   // var oValueHelpModel = new sap.ui.model.json.JSONModel(oData);
                   var oData = 
                    {
                        Product : [
                            {
                                SDGimgUrl : "./images/SDG/E-WEB-Goal-01.png",
                                Name: "SDG 1 : No Poverty"                                
                            },{
                                SDGimgUrl : "./images/SDG/E-WEB-Goal-02.png",
                                Name: "SDG 2 : Zero Hunger"                                 
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-03.png",                                
                                Name: "SDG 3 : Good Health and Well-being"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-04.png",                                
                                Name: "SDG 4 : Quality Education"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-05.png",                                
                                Name: "SDG 5 : Gender Equality"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-06.png",                                
                                Name: "SDG 6 : Clean Water and Sanitation"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-07.png",                              
                                Name: "SDG 7 : Affordable and Clean Energy"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-08.png",                                
                                Name: "SDG 8 : Decent Work and Economic Growth"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-09.png",                                
                                Name: "SDG 9 : Industry Innovation and Infrastructure"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-10.png",                                
                                Name: "SDG 10 : Reduced Inequalities"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-11.png",                                
                                Name: "SDG 11 : Sustainable Cities and Communities"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-12.png",                                
                                Name: "SDG 12 : Responsible Consumption and Production"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-13.png",                                
                                Name: "SDG 13 : Climate Action"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-14.png",                                
                                Name: "SDG 14 : Life Below Water"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-15.png",                                
                                Name: "SDG 15 : Life On Land"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-16.png",                                
                                Name: "SDG 16 : Peace Justice and Strong Institutions"                                
                            },{
                                SDGimgUrl: "./images/SDG/E-WEB-Goal-17.png",                                
                                Name: "SDG 17 : Partnership for The Goals"                                
                            }]                    };
                    

                    var oValueHelpModel = new sap.ui.model.json.JSONModel(oData);// create JSON model instance     
                    sap.ui.getCore().setModel(oValueHelpModel);

                    oDialog.setModel(oValueHelpModel);
                    oDialog.open(sInputValue);
                   });
                
            },
            onValueHelpDialogSearch: function (evt) {
               
                var sValue = evt.getParameter("value");
                    var oFilter = new sap.ui.model.Filter(
                        "Name",
                        sap.ui.model.FilterOperator.Contains,
                        sValue
                    );
                    evt.getSource().getBinding("items").filter([oFilter]);

            },
    
            onValueHelpDialogClose: function (oEvent) {

                // var aItems = this.getView().byId('Employees').getItems();
                // var aSelectedItems = [];
                // for (var i=0; i<aItems.length;i++) {
                //      if (aItems[i].getSelected()) {
                //           aSelectedItems.push(aItems[i]);
                //      }
                // }
                
                var aSelectedItems = oEvent.getParameter("selectedItems");				
                var kpiItems = this.getView().byId("KPIListTbl").getItems();
                var kpiIndex = this.getView().byId("KPIListTbl").getItems().length - 1;
                var oMultiInput = kpiItems[kpiIndex].mAggregations.cells[17].getItems()[1];
                var KPIModel = this.getView().byId("KPIListTbl").getModel("KPIModel");
                var a="";
                for (var i = 0; i < KPIModel.getData().results.length; i++) {
                    if (KPIModel.getData().results[i].isNewRow) {
                        console.log("newRow");                       
                        if (aSelectedItems && aSelectedItems.length > 0) {
                            aSelectedItems.forEach(function (oItem) {
                            	oMultiInput.addToken(new sap.m.Token({
                                    text: oItem.getTitle()                        
                                }));                                                            
                            });
                        }                        
                    }
                }      

                //end

			/*if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
				var a=	oMultiInput.addToken(new sap.m.Token({
						text: oItem.getTitle()                        
					}));
                    console.log("selected text:"+oItem.mProperties.title);//a.getTokens()[0].mProperties.text
				});
			}*/
    
            },
            onTokenUpdateSDG : function (oEvent) {
                console.log("onTokenUpdateSDG");
            },
    
            onSuggestionItemSelected: function (oEvent) {
                var oItem = oEvent.getParameter("selectedItem");
                var oText = oItem ? oItem.getKey() : "";
                this.byId("selectedKeyIndicator").setText(oText);
            },

            /************************************************************************************
             *        Edit Function use to select Selected Value  - Measure Conversions pending
             ***********************************************************************************/ 
            onPressEdit:function(oEvent){

                var that = this;
                var selectedTab = that.getView().byId("myTabContainer").getSelectedItem();
                selectedTab = selectedTab.substring(selectedTab.lastIndexOf("-") + 1);                
                var selectedTab1 = that.getView().byId("myTabContainer1").getSelectedItem();
                selectedTab1 = selectedTab1.substring(selectedTab1.lastIndexOf("-") + 1);                
                var selectedTab2 = that.getView().byId("myTabContainer2").getSelectedItem();

                if (selectedTab === "KPI_List") {

                    if (this.KPIListTypeSelected === "Environment") { //KPI LIST env tab
                        var tableId = "KPIListTbl";                       
                        var hanaTableName = "KPIList";                       
                        var KPIListModel = this.getView().byId(tableId).getModel("KPIModel");
                    } else if (this.KPIListTypeSelected === "Social") { //KPI List social table
                        var tableId = "SocialKPIList";
                        var hanaTableName = "KPIList_Social_Ports";
                        var KPIListModel = this.getView().byId(tableId).getModel();
                    }
                    var rowItems = this.getView().byId(tableId).getSelectedItems();
                
                    for (var i = 0; i < rowItems.length; i++) {
                        var kpiType = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        var kpiSubType = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        var kpi = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;                    
                        
                        for (var j = 0; j < KPIListModel.getData().results.length; j++) {
                            if ((kpiType === KPIListModel.getData().results[j].Type ) 
                                && (kpiSubType === KPIListModel.getData().results[j].SubType) 
                                && (kpi === KPIListModel.getData().results[j].KPI)){
                                    KPIListModel.getData().results[j].isEditableRow = true;                                                                      
                                break;
                            }
                            else continue;
                        }   
                    }
                    KPIListModel.refresh(true); 
                }else if (selectedTab === "UoM"){

                    var UOMSelected = this.UOMSelected;
                    var tableId = "uomVolumeTbl";
                    var hanaTableName = "UOM";                   
                    var oModel = this.getView().byId(tableId).getModel();
                    var rowItems = this.getView().byId(tableId).getSelectedItems();
                    for (var i = 0; i < rowItems.length; i++) {
                        var Measure = "" + UOMSelected;
                        var Abbreviation = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                                        
                        for (var j = 0; j < oModel.getData().results.length; j++) {
                            if ((Abbreviation === oModel.getData().results[j].Abbreviation)){
                                    oModel.getData().results[j].isEditableRow = true;
                                    break;
                            }
                            else continue;
                        }   
                    }
                    oModel.refresh(true);
                }
                else if (selectedTab === "Factors") {
                    selectedTab2 = selectedTab2.substring(selectedTab2.lastIndexOf("-") + 1);
                    if (selectedTab2 === "UoM_Conversions"){
                        //Radio button                     
                        if (this.ConversionTypeSelected === "UoM Conversions") {    
                            console.log("1:"+this.UOMConversionMeasure);
                            var UOMConversionMeasure = this.UOMConversionMeasure;
                            var tableId = "uomConVolTbl";
                            var hanaTableName = "UoMConversions";

                            var convModel = this.getView().byId(tableId).getModel("UOMConvModel");
                            var rowItems = this.getView().byId(tableId).getSelectedItems();
    
                            for (var i = 0; i < rowItems.length; i++) {
                                var measure = "" + UOMConversionMeasure;
                                var userInput = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                                var userOutput = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                    
                                
                                for (var j = 0; j < convModel.getData().results.length; j++) {
                                    if ((measure === convModel.getData().results[j].Measure ) 
                                        && (userInput === convModel.getData().results[j].UserInputUnit) 
                                        && (userOutput === convModel.getData().results[j].ExpectedOutputUnit)){
                                            convModel.getData().results[j].isEditableRow = true;                                                                       
                                        break;
                                    }
                                    else continue;
                                }   
                            }
                            convModel.refresh(true);
                        } else if (this.ConversionTypeSelected === "Measure Conversions") {
                            var MeasureConversion = this.UOMConversionMeasure;
                            var tableId = "measureConvsTbl";
                            var hanaTableName = "Measure_Module";

                            var convModel = this.getView().byId(tableId).getModel("measureConvsModel");
                            var rowItems = this.getView().byId(tableId).getSelectedItems();

                            for (var i = 0; i < rowItems.length; i++) {
                                var measure = "" + MeasureConversion;
                                var userInput = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                                var userOutput = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;                    
                                
                                for (var j = 0; j < convModel.getData().results.length; j++) {
                                    if ((measure === convModel.getData().results[j].InputMeasureType ) 
                                        && (userInput === convModel.getData().results[j].InputUom) 
                                        && (userOutput === convModel.getData().results[j].OutputUoM)){
                                            convModel.getData().results[j].isEditableRow = true;                                                                       
                                        break;
                                    }
                                    else continue;
                                }   
                            }
                            convModel.refresh(true);

                        }
                    }else if(selectedTab2 === "Energy_Factors"){
                        var tableId = "energyConvTbl";                 
                        var energyConvModel = this.getView().byId(tableId).getModel("EnergyConvModel");
                        var rowItems = this.getView().byId(tableId).getSelectedItems();                                

                        for (var i = 0; i < rowItems.length; i++) {
                            var type = "" + this.KPITypeSelected;
                            var subType =  that.getView().byId("Sub_Type").getSelectedKey();                       
                            var kpi = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;    
                            var userInput =  rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                   
                            
                            for (var j = 0; j < energyConvModel.getData().results.length; j++) {
                                if ((kpi === energyConvModel.getData().results[j].KPI)
                                    && (userInput === energyConvModel.getData().results[j].UserInputUnit)){
                                        energyConvModel.getData().results[j].isEditableRow = true;                                                                       
                                    break;
                                }
                                else continue;
                            }   
                        }
                        energyConvModel.refresh(true);
                    }else if (selectedTab2 === "Emission_Factors") {
                        console.log("Emission Factors");
                        var tableId = "EmissionFactorsTbl";                 
                        var efModel = this.getView().byId(tableId).getModel("EmissionFactorsModel");
                        var rowItems = this.getView().byId(tableId).getSelectedItems();
                        
                        for (var i = 0; i < rowItems.length; i++) {                                            
                            var kpi = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;    
                            var standard =  rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                   
                            var shortlong = rowItems[i].mAggregations.cells[4].mAggregations.items[0].mProperties.text;    
                            var classAttr = rowItems[i].mAggregations.cells[5].mAggregations.items[0].mProperties.text;
    
                            for (var j = 0; j < efModel.getData().results.length; j++) {
                                if ((kpi === efModel.getData().results[j].KPI)
                                    && (standard === efModel.getData().results[j].Standard)
                                    && (shortlong === efModel.getData().results[j].Shortlong)
                                    && (classAttr === efModel.getData().results[j].class)){
                                        efModel.getData().results[j].isEditableRow = true;                                                                       
                                    break;
                                }
                                else continue;
                            }   
                        }
                        efModel.refresh(true);
                    } 
                }else if (selectedTab === "Year"){

                    var tableId = "generalYearTbl";                 
                    var yearModel = this.getView().byId(tableId).getModel("yearModel");
                    var rowItems = this.getView().byId(tableId).getSelectedItems();

                    for (var i = 0; i < rowItems.length; i++) {                                            
                        var fiscal = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;    
                        var fromDate =  rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                   
                        var toDate = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;    
                        var reportingYear = rowItems[i].mAggregations.cells[3].mProperties.text;

                        for (var j = 0; j < yearModel.getData().results.length; j++) {
                            if ((fromDate === yearModel.getData().results[j].StartDate)
                                && (toDate === yearModel.getData().results[j].EndDate)){
                                    yearModel.getData().results[j].isEditableRow = true;                                                                       
                                break;
                            }
                            else continue;
                        }       
                    }
                    yearModel.refresh(true);
                }
           
            },

            /************************************************************************************
             *        Reset Function use to unselect Selected Value 
             ***********************************************************************************/        
            onPressReset:function(oEvent){
                var that = this;
                var selectedTab = that.getView().byId("myTabContainer").getSelectedItem();
                selectedTab = selectedTab.substring(selectedTab.lastIndexOf("-") + 1);
                var selectedTab1 = that.getView().byId("myTabContainer1").getSelectedItem();
                selectedTab1 = selectedTab1.substring(selectedTab1.lastIndexOf("-") + 1);

                var selectedTab2 = that.getView().byId("myTabContainer2").getSelectedItem();

                if (selectedTab === "KPI_List") {

                    if (this.KPIListTypeSelected === "Environment") { //KPI LIST env tab
                        var tableId = "KPIListTbl";
                        var hanaTableName = "KPIList";                       
                        var KPIListModel = this.getView().byId(tableId).getModel("KPIModel");
                    } else if (this.KPIListTypeSelected === "Social") { //KPI List social table
                        var tableId = "SocialKPIList";
                        var hanaTableName = "KPIList_Social_Ports";
                        var KPIListModel = this.getView().byId(tableId).getModel();
                    }

                    var rowItems = this.getView().byId(tableId).getSelectedItems();                
                    //need to find Pkey for KPIListModel and match
                    for (var i = 0; i < rowItems.length; i++) {
                        var kpiType = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        var kpiSubType = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        var kpi = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;                    
                        
                        for (var j = 0; j < KPIListModel.getData().results.length; j++) {
                            if ((kpiType === KPIListModel.getData().results[j].Type ) 
                                && (kpiSubType === KPIListModel.getData().results[j].SubType) 
                                && (kpi === KPIListModel.getData().results[j].KPI)){
                                    KPIListModel.getData().results[j].isEditableRow = false;
                                break;
                            }
                            else continue;
                        }   
                    }
                    KPIListModel.refresh(true); 
                }else if (selectedTab === "UoM"){
                    console.log("UoM");
                    var UOMSelected = this.UOMSelected;

                    var tableId = "uomVolumeTbl";
                    var hanaTableName = "UOM";                    
                    var oModel = this.getView().byId(tableId).getModel();
                    var rowItems = this.getView().byId(tableId).getSelectedItems();
                    for (var i = 0; i < rowItems.length; i++) {
                        var Measure = "" + UOMSelected;
                        var Abbreviation = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                
                        
                        for (var j = 0; j < oModel.getData().results.length; j++) {
                            if ((Abbreviation === oModel.getData().results[j].Abbreviation)){
                                    oModel.getData().results[j].isEditableRow = false;                                       
                                break;
                            }
                            else continue;
                        } 
                    }
                    oModel.refresh(true);
                } else if (selectedTab === "Factors") {
                    selectedTab2 = selectedTab2.substring(selectedTab2.lastIndexOf("-") + 1);
                    if (selectedTab2 === "UoM_Conversions"){
                        //Radio button                     
                        if (this.ConversionTypeSelected === "UoM Conversions") {                                
                            
                            var UOMConversionMeasure = this.UOMConversionMeasure;
                            var tableId = "uomConVolTbl";
                            var hanaTableName = "UoMConversions";    
                            var convModel = this.getView().byId(tableId).getModel("UOMConvModel");
                            var rowItems = this.getView().byId(tableId).getSelectedItems();
    
                            for (var i = 0; i < rowItems.length; i++) {
                                var measure = "" + UOMConversionMeasure;
                                var userInput = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                                var userOutput = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                    
                                
                                for (var j = 0; j < convModel.getData().results.length; j++) {
                                    if ((measure === convModel.getData().results[j].Measure ) 
                                        && (userInput === convModel.getData().results[j].UserInputUnit) 
                                        && (userOutput === convModel.getData().results[j].ExpectedOutputUnit)){
                                            convModel.getData().results[j].isEditableRow = false;                                                                       
                                        break;
                                    }
                                    else continue;
                                }   
                            }
                            convModel.refresh(true);

                        } else if (this.ConversionTypeSelected === "Measure Conversions") {
                            
                            var MeasureConversion = this.UOMConversionMeasure;
                            var tableId = "measureConvsTbl";
                            var hanaTableName = "Measure_Module";

                            var convModel = this.getView().byId(tableId).getModel("measureConvsModel");
                            var rowItems = this.getView().byId(tableId).getSelectedItems();

                            for (var i = 0; i < rowItems.length; i++) {
                                var measure = "" + MeasureConversion;
                                var userInput = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                                var userOutput = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;                    
                                
                                for (var j = 0; j < convModel.getData().results.length; j++) {
                                    if ((measure === convModel.getData().results[j].InputMeasureType ) 
                                        && (userInput === convModel.getData().results[j].InputUom) 
                                        && (userOutput === convModel.getData().results[j].OutputUoM)){
                                            convModel.getData().results[j].isEditableRow = false;                                                                       
                                        break;
                                    }
                                    else continue;
                                }   
                            }
                            convModel.refresh(true);
                        }
                    }else if(selectedTab2 === "Energy_Factors"){
                        var tableId = "energyConvTbl";                 
                        var energyConvModel = this.getView().byId(tableId).getModel("EnergyConvModel");
                        var rowItems = this.getView().byId(tableId).getSelectedItems();

                        for (var i = 0; i < rowItems.length; i++) {
                            var type = "" + this.KPITypeSelected;
                            var subType =  that.getView().byId("Sub_Type").getSelectedKey();                       
                            var kpi = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;    
                            var userInput =  rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                   
                            
                            for (var j = 0; j < energyConvModel.getData().results.length; j++) {
                                if ((kpi === energyConvModel.getData().results[j].KPI)
                                    && (userInput === energyConvModel.getData().results[j].UserInputUnit)){
                                        energyConvModel.getData().results[j].isEditableRow = false;                                                                       
                                    break;
                                }
                                else continue;
                            }   
                        }
                        energyConvModel.refresh(true);
                    
                    }else if (selectedTab2 === "Emission_Factors") {                        
                        var tableId = "EmissionFactorsTbl";                 
                        var efModel = this.getView().byId(tableId).getModel("EmissionFactorsModel");
                        var rowItems = this.getView().byId(tableId).getSelectedItems();
                        
                        for (var i = 0; i < rowItems.length; i++) {                                            
                            var kpi = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;    
                            var standard =  rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                   
                            var shortlong = rowItems[i].mAggregations.cells[4].mAggregations.items[0].mProperties.text;    
                            var classAttr = rowItems[i].mAggregations.cells[5].mAggregations.items[0].mProperties.text;
    
                            for (var j = 0; j < efModel.getData().results.length; j++) {
                                if ((kpi === efModel.getData().results[j].KPI)
                                    && (standard === efModel.getData().results[j].Standard)
                                    && (shortlong === efModel.getData().results[j].Shortlong)
                                    && (classAttr === efModel.getData().results[j].class)){
                                        efModel.getData().results[j].isEditableRow = false;                                                                       
                                    break;
                                }
                                else continue;
                            }   
                        }
                        efModel.refresh(true);
                    } 
                }else if (selectedTab === "Year"){                    
                    var tableId = "generalYearTbl";                 
                    var yearModel = this.getView().byId(tableId).getModel("yearModel");
                    var rowItems = this.getView().byId(tableId).getSelectedItems();

                    for (var i = 0; i < rowItems.length; i++) {                                            
                        var fiscal = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;    
                        var fromDate =  rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;                   
                        var toDate = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;    
                        var reportingYear = rowItems[i].mAggregations.cells[3].mProperties.text;

                        for (var j = 0; j < yearModel.getData().results.length; j++) {
                            if ((fromDate === yearModel.getData().results[j].StartDate)
                                && (toDate === yearModel.getData().results[j].EndDate)){
                                    yearModel.getData().results[j].isEditableRow = false;                                                                       
                                break;
                            }
                            else continue;
                        }   
                    }
                    yearModel.refresh(true);
                }
            },

            //Added By Pankaj
            onPressSubmitMsg: function (event) {

                //Information Box added by Pankaj
                sap.m.MessageBox.show(
                    "Do you want to submit the record.", {
                        icon: MessageBox.Icon.WARNING,
                        title: "Warning",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) { 
                            if(oAction=="NO"){
                                return false;
                            }
                            if(oAction=="Yes"){
                                this.onPressSubmit(event);
                            }
                         }
                    }
                );
            },
            
            onPressSubmit: function (event) {

                
                var that = this;
                var selectedTab = that.getView().byId("myTabContainer").getSelectedItem();
                selectedTab = selectedTab.substring(selectedTab.lastIndexOf("-") + 1);
                console.log("selectedTab:" + selectedTab);

                var selectedTab1 = that.getView().byId("myTabContainer1").getSelectedItem();
                selectedTab1 = selectedTab1.substring(selectedTab1.lastIndexOf("-") + 1);
                console.log("selectedTab:" + selectedTab1);

                var selectedTab2 = that.getView().byId("myTabContainer2").getSelectedItem();
               // selectedTab2 = selectedTab2.substring(selectedTab2.lastIndexOf("-") + 1);
                //console.log("selectedTab2:" + selectedTab2);

                /*if (selectedTab === "Emission_Factors") {
                    var tableID = "EmissionFactorsTbl";                    
                    var hanaTableName = this.GlobalIndustryModel.getData().EmissionFactors_Telecom;                    
                    this.batchModel = this.getOwnerComponent().getModel("dataModel");
                    this.batchChanges = [];
                    this.onCreateEntry_Table(tableID,hanaTableName);
                    this.onUpdateEntry_Table(tableID, hanaTableName);
                    this.batchModel.submitChanges({
                        success: function (data, response) {
                            
                        },
                        error: function (e) {
                           
                        }
                    });
                  
                } else */
                if (selectedTab === "UoM") {
                   /* var tableID = "uomVolumeTbl";
                    //var hanaTableName = "UOM";
                    var hanaTableName = this.GlobalIndustryModel.getData().UOM_Telecom;
                    this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                    this.batchChanges = [];
                    this.onCreateEntry_Table(tableID,hanaTableName);
                   // this.onUpdateEntry_Table(tableID, hanaTableName);
                    if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitBatch();
                        this.batchModel.refresh();                   
                    }
                    else console.log("No Rcord present for Database Operation");*/

                    if (this.UoMTypeSelected === "Measure Type") {
                        var tableID = "generalTbl";
                        var hanaTableName = "Constants_Telecom";
                        //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");//2
                        this.batchChanges = [];

                        this.onCreateEntry_Table(tableID,hanaTableName);

                        if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges);
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                    
                        }
                        else console.log("No Record present for Database Operation");
                        
                    }else if (this.UoMTypeSelected === "UoM Values") {
                      
                        var tableID = "uomVolumeTbl";
                        var hanaTableName = "UOM";
                        //var hanaTableName = this.GlobalIndustryModel.getData().UOM_Telecom;
                        //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");//3
                        this.batchChanges = [];
                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        /*if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                   
                         }
                         else console.log("No Rcord present for Database Operation");*/
                         this.batchModel.submitChanges({
                            success: function (data, response) {
                                
                            },
                            error: function (e) {
                               
                            }
                        });

                    }   
                } else if (selectedTab === "Factors") {
                    selectedTab2 = selectedTab2.substring(selectedTab2.lastIndexOf("-") + 1);
                    console.log("selectedTab2:"+selectedTab2);
                    
                    if (selectedTab2 === "UoM_Conversions"){
                        //Radio button                     
                        if (this.ConversionTypeSelected === "UoM Conversions") {
                            // console.log(this.ConversionTypeSelected);
                            //UOM Conversions
                            var convItems = "", convIndex;
                        
                            var tableID = "uomConVolTbl";                      
                            //var hanaTableName = this.GlobalIndustryModel.getData().UoMConversions_Telecom;                        
                            var hanaTableName = "UoMConversions";
                            this.batchModel = this.getOwnerComponent().getModel("dataModel");
                            this.batchChanges = [];

                            this.onCreateEntry_Table(tableID,hanaTableName);
                            this.onUpdateEntry_Table(tableID, hanaTableName);
                            this.batchModel.submitChanges({
                                success: function (data, response) {                               
                                },
                                error: function (e) {                               
                                }
                            });                      

                        } else if (this.ConversionTypeSelected === "Measure Conversions") {
                                //Energy                        
                                var tableID = "measureConvsTbl";                        
                                //var hanaTableName = "Measure_Telecom";                        
                                var hanaTableName = "Measure_Module";                        
                                this.batchModel = this.getOwnerComponent().getModel("dataModel");
                                this.batchChanges = [];

                                this.onCreateEntry_Table(tableID,hanaTableName);
                                this.onUpdateEntry_Table(tableID, hanaTableName);
                                this.batchModel.submitChanges({
                                    success: function (data, response) {
                                        
                                    },
                                    error: function (e) {
                                    
                                    }
                                });
                        }
                    }else if(selectedTab2 === "Energy_Factors"){
                        //Energy Conversions - Energy Factors
                        var tableID = "energyConvTbl";                        
                        //var hanaTableName = "EnergyCnversions_Telecom";                        
                        var hanaTableName = "EnergyCnversions";                        
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");
                        this.batchChanges = [];

                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        /*if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                    
                        }
                        else console.log("No Rcord present for Database Operation");*/
                        this.batchModel.submitChanges({
                            success: function (data, response) {                                
                            },
                            error: function (e) {                               
                            }
                        });
                    }else if (selectedTab2 === "Emission_Factors") {
                        var tableID = "EmissionFactorsTbl";                    
                       // var hanaTableName = this.GlobalIndustryModel.getData().EmissionFactors_Telecom;                    
                        var hanaTableName = "EmissionFactors";
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");
                        this.batchChanges = [];
                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        this.batchModel.submitChanges({
                            success: function (data, response) {
                                
                            },
                            error: function (e) {
                               
                            }
                        });
                    } 
                } else if (selectedTab === "KPI_List") {

                    //  var tableId = "SocialTable" + this.template.substring(this.template.length - 1);
                    //  console.log("tableId:" + tableId);

                    if(this.KPIListTypeSelected === "Environment"){ //KPI LIST env tab
                      var tableID = "KPIListTbl";
                      //var hanaTableName = "KPIList_Ports";
                      var hanaTableName = "KPIList";
                     //var hanaTableName = this.GlobalIndustryModel.getData().KPIListTable;
                       
                    }else if (this.KPIListTypeSelected === "Social"){ //KPI List social table
                        var tableID = "SocialKPIList";
                        var hanaTableName = "KPIList_Social_Ports";
                     
                    }

                    //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                    this.batchModel = this.getOwnerComponent().getModel("dataModel");//6
                    this.batchChanges = [];

                    this.onCreateEntry_Table(tableID,hanaTableName);
                    this.onUpdateEntry_Table(tableID, hanaTableName);
                    //this.onCreate_Social();
                    /*if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitBatch();
                        this.batchModel.refresh();                    
                    }
                    else console.log("No Rcord present for Database Operation");*/
                    this.batchModel.submitChanges({
                        success: function (data, response) {
                            
                        },
                        error: function (e) {
                           
                        }
                    });
                   
                }else if (selectedTab === "General"){

                    if (this.PrefixTypesSelected === "Prefix Types") {
                        var tableID = "prefixTypesTbl";
                        var hanaTableName = "Prefix_Types";                        
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");
                        this.batchChanges = [];

                        this.onCreateEntry_Table(tableID,hanaTableName);

                        if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges);
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                    
                        }
                        else console.log("No Record present for Database Operation");
                        
                    }else if (this.PrefixTypesSelected === "Prefix Values") {
                      
                        var tableID = "prefixValuesTbl";                        
                        var hanaTableName = "Prefix_Values";
                        
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");
                        this.batchChanges = [];
                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        
                         this.batchModel.submitChanges({
                            success: function (data, response) {
                                
                            },
                            error: function (e) {
                               
                            }
                        });

                    }
                 
                }else if (selectedTab === "CorporateStructure"){
                    //Corporate Structure
                    if(selectedTab1 === "Division"){
                        var tableID = "tblDivision";
                        //var hanaTableName = "Division_Telecom";
                        var hanaTableName = "Division";
                        //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);                        
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");//7
                        this.batchModel.setUseBatch(true);
                        this.batchChanges = [];

                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges); 
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                    
                        }
                        else console.log("No Record present for Database Operation");

                    }else if (selectedTab1 === "Location"){
                        var tableID = "tblLocation";
                        //var hanaTableName = "Location_Telecom";
                        var hanaTableName = "Location";
                        //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");//8
                        this.batchChanges = [];

                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges); 
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                    
                        }
                        else console.log("No Record present for Database Operation");
                    }                    
                }else if (selectedTab === "Year"){
                    var tableID = "generalYearTbl";
                    //var hanaTableName = "Year_telecom";
                    var hanaTableName = "Year_Module";
                    //Validation - Month count should not exceed 12.
                    var Model1 = this.getView().byId(tableID).getModel("yearModel");
                    for (var i = 0; i < Model1.getData().results.length; i++) {
                        if (Model1.getData().results[i].isNewRow) {                            
                            var count = new Date(Model1.oData.results[i].EndDate).getMonth() -
                            new Date(Model1.oData.results[i].StartDate).getMonth() +
                                12 * (new Date(Model1.oData.results[i].EndDate).getFullYear() - new Date(Model1.oData.results[i].StartDate).getFullYear());
                        }
                    }
                    console.log("count:"+count);
                    if(count>12){
                        MessageBox.alert("Month count should not be more than 12");
                        //MessageBox.alert("The quantity you have reported exceeds the quantity planed.");
                    }else{
                        //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                        this.batchModel = this.getOwnerComponent().getModel("dataModel");//9
                        this.batchChanges = [];

                        this.onCreateEntry_Table(tableID,hanaTableName);
                        this.onUpdateEntry_Table(tableID, hanaTableName);
                        /*if (this.batchChanges.length > 0) {
                            this.batchModel.addBatchChangeOperations(this.batchChanges);
                            this.batchModel.submitBatch();
                            this.batchModel.refresh();                    
                        }
                        else console.log("No Record present for Database Operation");*/
                        this.batchModel.submitChanges({
                            success: function (data, response) {
                                
                            },
                            error: function (e) {
                               
                            }
                        });
                    }
                }

                /*
        var json2="";
        if(convRadio.aRBs[convRadio.getSelectedIndex()].mProperties.text === "Energy"){
            convItems  = that.getView().byId("uomConEnergyTbl").getItems();
            convIndex = that.getView().byId("uomConEnergyTbl").getItems().length-1;
            json2= 
                {                            
                    "Measure": "Energy",
                    "UserInputUnit" : convItems[convIndex].getCells()[0].mProperties.value,
                    "ExpectedOutputUnit" :convItems[convIndex].getCells()[1].mProperties.value,
                    "ConverstionFactor": convItems[convIndex].getCells()[2].mProperties.value,
                    "Operation": convItems[convIndex].getCells()[3].mProperties.value                     
                }
        }else if(convRadio.aRBs[convRadio.getSelectedIndex()].mProperties.text === "Volume"){
            convItems  = that.getView().byId("uomConVolTbl").getItems();
            convIndex = that.getView().byId("uomConVolTbl").getItems().length-1;
            json2= 
                {                                       
                    "Measure": "Volume",
                    "UserInputUnit" : convItems[convIndex].getCells()[0].mProperties.value,
                    "ExpectedOutputUnit" :convItems[convIndex].getCells()[1].mProperties.value,
                    "ConverstionFactor": convItems[convIndex].getCells()[2].mProperties.value,
                    "Operation": convItems[convIndex].getCells()[3].mProperties.value                     
                }
        }else if(convRadio.aRBs[convRadio.getSelectedIndex()].mProperties.text === "Mass"){
            convItems  = that.getView().byId("uomConMassTbl").getItems();
            convIndex = that.getView().byId("uomConMassTbl").getItems().length-1;
            json2= 
                {                            
                    "Measure": "Mass",
                    "UserInputUnit" : convItems[convIndex].getCells()[0].mProperties.value,
                    "ExpectedOutputUnit" :convItems[convIndex].getCells()[1].mProperties.value,
                    "ConverstionFactor": convItems[convIndex].getCells()[2].mProperties.value,
                    "Operation": convItems[convIndex].getCells()[3].mProperties.value                     
                }
        }else if(convRadio.aRBs[convRadio.getSelectedIndex()].mProperties.text === "Distance"){
            convItems  = that.getView().byId("uomConDistanceTbl").getItems();
            convIndex = that.getView().byId("uomConDistanceTbl").getItems().length-1;
            json2= 
                {                            
                    "Measure": "Distance",
                    "UserInputUnit" : convItems[convIndex].getCells()[0].mProperties.value,
                    "ExpectedOutputUnit" :convItems[convIndex].getCells()[1].mProperties.value,
                    "ConverstionFactor": convItems[convIndex].getCells()[2].mProperties.value,
                    "Operation": convItems[convIndex].getCells()[3].mProperties.value                     
                }
        }else if(convRadio.aRBs[convRadio.getSelectedIndex()].mProperties.text === "Electricity"){
            convItems  = that.getView().byId("uomConElecTbl").getItems();
            convIndex = that.getView().byId("uomConElecTbl").getItems().length-1;
            json2= 
                {                            
                    "Measure": "Electricity",
                    "UserInputUnit" : convItems[convIndex].getCells()[0].mProperties.value,
                    "ExpectedOutputUnit" :convItems[convIndex].getCells()[1].mProperties.value,
                    "ConverstionFactor": convItems[convIndex].getCells()[2].mProperties.value,
                    "Operation": convItems[convIndex].getCells()[3].mProperties.value                     
                }
        }

        console.log("json2:"+json2);
        
        var OData = this.getOwnerComponent().getModel("dataModel");
        OData.create('/UoMConversions', jsonMK, null, function() {         //mickey json2  -> jsonMk            
            sap.m.MessageToast.show('The details submitted Successfully!!!');
        }, function() {
            alert("Create failed");
        });*/

            },
            onCreate_Social: function(){
                var that = this;
                var KPIModel;
                var kpiItems = that.getView().byId("SocialKPIList").getItems();
                var kpiIndex = that.getView().byId("SocialKPIList").getItems().length - 1;
                KPIModel = that.getView().byId("SocialKPIList").getModel();

                for (var i = 0; i < KPIModel.getData().results.length; i++) {
                    if (KPIModel.getData().results[i].isNewRow) {
                        sap.m.MessageToast.show("prefix:"+kpiItems[kpiIndex].mAggregations.cells[5].mAggregations.items[1].mProperties.value);
                    }
                }

            },
            onCreateEntry_Table: function (tableId, hanaTableName) {
                var that = this;
                var KPIModel;
                
                var kpiItems = that.getView().byId(tableId).getItems();
                var kpiIndex = that.getView().byId(tableId).getItems().length - 1;
                //   var OData = this.getOwnerComponent().getModel("dataModel");
                if(tableId === "KPIListTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("KPIModel");
                }else if(tableId === "EmissionFactorsTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("EmissionFactorsModel");
                }else if(tableId === "uomConVolTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("UOMConvModel");
                }else if(tableId === "energyConvTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("EnergyConvModel");
                }else if(tableId === "generalTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("generalModel");
                }else if(tableId === "tblDivision"){
                    KPIModel = this.getView().byId(tableId).getModel("divisionModel");
                }else if(tableId === "tblLocation"){
                    KPIModel = this.getView().byId(tableId).getModel("locationModel");
                }else if(tableId === "generalYearTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("yearModel");
                }else if(tableId === "measureConvsTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("measureConvsModel");
                }else if(tableId === "prefixTypesTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("PrefixTypesModel");
                }else if(tableId === "prefixValuesTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("PrefixValuesModel");
                }else{              
                    KPIModel = that.getView().byId(tableId).getModel();
                }

                
                
                for (var i = 0; i < KPIModel.getData().results.length; i++) {
                    if (KPIModel.getData().results[i].isNewRow) {
                        if(tableId === "KPIListTbl"){
                            var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                            var jsonSustain = {
                                "Industry": "" + Industry,
                                "Type": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                "SubType": kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.value,
                                "KPI": kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.value,
                                "Template": kpiItems[kpiIndex].mAggregations.cells[3].mAggregations.items[1].mProperties.value,
                                "Measure": kpiItems[kpiIndex].mAggregations.cells[4].mAggregations.items[1].mProperties.value,                                
                                "EFStandard": kpiItems[kpiIndex].mAggregations.cells[5].mAggregations.items[1].mProperties.value,

                                "EmissionLogic": kpiItems[kpiIndex].mAggregations.cells[8].mAggregations.items[1].mProperties.value,
                                "BiogenicEmissions": kpiItems[kpiIndex].mAggregations.cells[9].mAggregations.items[1].mProperties.value,
                                "Scope": kpiItems[kpiIndex].mAggregations.cells[10].mAggregations.items[1].mProperties.value,
                                "EnergyLogic":kpiItems[kpiIndex].mAggregations.cells[11].mAggregations.items[1].mProperties.value,
                                "EnergyUse":kpiItems[kpiIndex].mAggregations.cells[12].mAggregations.items[1].mProperties.value,

                                "RenNon": kpiItems[kpiIndex].mAggregations.cells[13].mAggregations.items[1].mProperties.value,
                                "Supplier":kpiItems[kpiIndex].mAggregations.cells[14].mAggregations.items[1].mProperties.value,
                                "ReportingStandard": "GRI",     //15
                                "GRIStd": kpiItems[kpiIndex].mAggregations.cells[16].mAggregations.items[1].mProperties.value,                                
                                "SDG": kpiItems[kpiIndex].mAggregations.cells[17].mAggregations.items[1].mProperties._semanticFormValue
                                
                            }
                        }else if(tableId === "SocialKPIList"){
                            var jsonSustain =
                            {                            
                                /*"KPI": kpiItems[kpiIndex].getCells()[2].mProperties.value,
                                "Type": kpiItems[kpiIndex].getCells()[0].mProperties.value,
                                "SubType": kpiItems[kpiIndex].getCells()[1].mProperties.value,
                                "Template": kpiItems[kpiIndex].getCells()[3].mProperties.value,       
                                "GRIStd": kpiItems[kpiIndex].getCells()[6].mProperties.value,
                                "SDG": kpiItems[kpiIndex].getCells()[7].mProperties.value,                         
                                "Logic": kpiItems[kpiIndex].getCells()[5].mProperties.value,
                                "Prefix": kpiItems[kpiIndex].getCells()[4].mProperties.value*/
                                
                                "Type": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                "SubType": kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.value,
                                "KPI": kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.value,
                                "InfoType":kpiItems[kpiIndex].mAggregations.cells[3].mAggregations.items[1].mProperties.value,                                
                                "Template": kpiItems[kpiIndex].mAggregations.cells[4].mAggregations.items[1].mProperties.value,
                                "Prefix": this.socialPrefix,
                                "Logic": kpiItems[kpiIndex].mAggregations.cells[6].mAggregations.items[1].mProperties.value,
                                "GRIStd": kpiItems[kpiIndex].mAggregations.cells[7].mAggregations.items[1].mProperties.value,
                                "SDG": kpiItems[kpiIndex].mAggregations.cells[8].mAggregations.items[1].mProperties.value
                            }
                        }else if(tableId === "uomVolumeTbl"){
                            var UOMSelected = this.UOMSelected;
                            var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                            var jsonSustain =
                            {   
                                "Industry": "" + Industry,
                                "Measure": "" + UOMSelected,
                                "Unit": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                "Abbreviation": kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.value
                            }
                        }else if(tableId === "EmissionFactorsTbl"){
                            var KPI = this.KPITypeSelected;
                            var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                            var jsonSustain =
                            {
                                "Industry": "" + Industry,
                                "KPI": kpiItems[kpiIndex].getCells()[0].mAggregations.items[1].mProperties.selectedKey,
                                "Type": "" + KPI,
                                "SubType": that.getView().byId("EF_Type").getSelectedKey(),
                                //"Standard": kpiItems[kpiIndex].getCells()[1].mAggregations.items[1].mProperties.selectedKey,
                                "Standard": this.EFTypeSelected,
                                "EmissionFactor": kpiItems[kpiIndex].getCells()[2].mAggregations.items[1].mProperties.value,
                                "UoM": kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value,
                                "Deno": kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value.substring(kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value.lastIndexOf("/") + 1),
                                "Shortlong": kpiItems[kpiIndex].getCells()[4].mAggregations.items[1].mProperties.selectedKey,
                                "class": kpiItems[kpiIndex].getCells()[5].mAggregations.items[1].mProperties.selectedKey,
                                "Nume": kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value.substring(0, kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value.indexOf('/'))
                            }
                        }else if(tableId === "uomConVolTbl"){
                            var UOMConversionMeasure = this.UOMConversionMeasure;
                            var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;

                            var jsonSustain =
                            {
                                "Industry": "" + Industry,
                                "Measure": "" + UOMConversionMeasure,
                                "UserInputUnit": kpiItems[kpiIndex].getCells()[0].mAggregations.items[1].mProperties.selectedKey,
                                "ExpectedOutputUnit": kpiItems[kpiIndex].getCells()[1].mAggregations.items[1].mProperties.selectedKey,
                                "ConverstionFactor": kpiItems[kpiIndex].getCells()[2].mAggregations.items[1].mProperties.value,
                                "Operation": kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.selectedKey
                            }
                        }else if(tableId === "energyConvTbl"){
                            var type = this.KPITypeSelected;
                            var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                            var jsonSustain =
                            {
                                "Industry": "" + Industry,
                                "KPI": kpiItems[kpiIndex].getCells()[0].mAggregations.items[1].mProperties.selectedKey,
                                "Type": "" + type,
                                "Subtype": that.getView().byId("Sub_Type").getSelectedKey(),
                                "UserInputUnit": kpiItems[kpiIndex].getCells()[1].mAggregations.items[1].mProperties.selectedKey,
                                "ExpectedOutputUnit": kpiItems[kpiIndex].getCells()[2].mAggregations.items[1].mProperties.selectedKey,
                                "ConverstionFactor":kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value,
                                "Operation": kpiItems[kpiIndex].getCells()[4].mAggregations.items[1].mProperties.selectedKey
                            }
                        }else if(tableId === "measureConvsTbl"){
                            var UOMConversionMeasure = this.UOMConversionMeasure;
                            var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;

                            var jsonSustain =
                            {
                                "Industry": "" + Industry,
                                "InputMeasureType": "" + UOMConversionMeasure,
                                "InputUom": kpiItems[kpiIndex].getCells()[0].mAggregations.items[1].mProperties.selectedKey,
                                "OutputMeasureType": kpiItems[kpiIndex].getCells()[1].mAggregations.items[1].mProperties.selectedKey,
                                "OutputUoM": kpiItems[kpiIndex].getCells()[2].mAggregations.items[1].mProperties.selectedKey,
                                "ConverstionFactor": kpiItems[kpiIndex].getCells()[3].mAggregations.items[1].mProperties.value,
                                "Operation": kpiItems[kpiIndex].getCells()[4].mAggregations.items[1].mProperties.selectedKey
                                
                            }
                        }else if(tableId === "generalTbl"){
                           
                            var Industry = this.GlobalIndustryModel.getData().Industry;
                            var jsonSustain =
                            {
                                "ID": "Measure",
                                "Value": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                "Industry": "" + Industry                            
                            }
                        }else if(tableId === "tblDivision"){
                           
                            var Industry = this.GlobalIndustryModel.getData().Industry;
                            var jsonSustain =
                            {                                
                                "Division": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                "Industry": "" + Industry                            
                            }
                        }else if(tableId === "tblLocation"){
                           
                            var Industry = this.GlobalIndustryModel.getData().Industry;
                            var jsonSustain =
                            {                                
                                "Location": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                "Industry": "" + Industry                            
                            }
                        }else if(tableId === "prefixTypesTbl"){
                            var jsonSustain =
                            {                                
                                "prefix": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value                                
                            }
                        }else if(tableId === "prefixValuesTbl"){
                            var PrefixSelected = this.PrefixSelected;
                            var jsonSustain =
                            {
                                "prefix": "" + PrefixSelected,
                                "value": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value                                
                            }
                        }else if(tableId === "generalYearTbl"){                            
                            //var fromDate = this.getView().byId("FromDP").mProperties.dateValue.getFullYear();                            
                            //var toDate = this.getView().byId("ToDP").mProperties.dateValue.getFullYear();

                            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                            ];

                            var d = kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue;
                            var dd = kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getDate();
                            var mm = String(kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getMonth()+1).padStart(2, '0');
                            var yyyy = kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getFullYear();
                            var fromDate2 = +dd +"-"+ monthNames[d.getMonth()] +"-"+ yyyy;
                            console.log("The fromDate2 is : "+ fromDate2);

                            var d_to = kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue;
                            var dd_to = kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getDate();
                            var mm_to = String(kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getMonth()+1).padStart(2, '0');
                            var yyyy_to = kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getFullYear();
                            var toDate2 = +dd_to +"-"+ monthNames[d_to.getMonth()] +"-"+ yyyy_to;
                            console.log("The toDate2 is : "+ toDate2);

                            var fromDate = kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getFullYear();
                            var toDate = kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getFullYear();
                                               
                            var fromDate1 = kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getDate()+"/"+(kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getMonth()+1)+"/"+kpiItems[kpiIndex].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getFullYear();
                            var toDate1 = kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getDate()+"/"+(kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getMonth()+1)+"/"+kpiItems[kpiIndex].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getFullYear();

                            var yearA = "";
                            var Industry = this.GlobalIndustryModel.getData().Industry;    

                            if(fromDate === toDate){
                                yearA = fromDate;
                                var jsonSustain ={
                                    "Industry": "" + Industry,
                                    "YearL": "" + fromDate,
                                    "YearR": "" + toDate,
                                    "YearA": "" + yearA,
                                    "StartDate": "" + fromDate2,
                                    "EndDate": "" + toDate2,
                                    "fiscal": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value
                                }     
                               // kpiItems[kpiIndex].mAggregations.cells[2].mProperties.text = yearA
                            }else{
                                yearA = fromDate+"-"+toDate;
                                var jsonSustain ={
                                    "Industry": "" + Industry,
                                    "YearL": "" + fromDate,
                                    "YearR": "" + toDate,
                                    "YearA": "" + yearA,
                                    "StartDate": "" + fromDate2,
                                    "EndDate": "" + toDate2,
                                    "fiscal": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value
                                }     
                                //kpiItems[kpiIndex].mAggregations.cells[3].mProperties.text = "3000";
                            }
                            kpiItems[kpiIndex].getCells()[3].setText(yearA);
                            console.log("yearA:"+yearA);

                            /*if(kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value.length>5){
                                var arr = kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value.split("-");
                                var itIsNumber1 = arr[0]; 
                                var itIsNumber2 = arr[1];
                                var jsonSustain ={
                                    "Vertical": "" + Industry,
                                    "YearL":itIsNumber1,
                                    "YearR": itIsNumber2,
                                    "YearA": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value
                                }                                
                            }else{
                                var jsonSustain =
                                {                        
                                    "Vertical": "" + Industry,
                                    "YearL":kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                    "YearR": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value,
                                    "YearA": kpiItems[kpiIndex].mAggregations.cells[0].mAggregations.items[1].mProperties.value
                                }
                            }*/
                        }
                        
                        console.log( "Before call Create Service:: "  +jsonSustain);
                        //call create service
                        //****************************batch call start
                        if (jsonSustain !== null || jsonSustain !== undefined || jsonSustain !== "") {
                            // that.batchChanges.push(that.batchModel.createBatchOperation(hanaTableName, "POST", jsonSustain)); //new records
                            hanaTableName = "/" + hanaTableName;
                            that.batchModel.create(hanaTableName, jsonSustain, {
                                method: "POST",
                            success: function (data) {
                                //add on Feb 23
                                sap.m.MessageBox.show("Record created successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
                                    /*onClose: function (oAction) { 
                                        if(oAction === "YES"){
                                            console.log("get service");                                            
                                            if(tableId === "tblDivision"){
                                                that.calloData_Division();//Division
                                            }else if(tableId === "tblLocation"){
                                                that.calloData_Location();//Location
                                            }else if(tableId === "generalYearTbl"){
                                                that.calloData_General_Year();//Year
                                            }else if(tableId === "generalTbl"){
                                                that.calloData_General();//Measure Type
                                            }else if(tableId === "uomVolumeTbl"){
                                                that.calloData_UOM();//UoM                                                
                                            }else if(tableId === "uomConVolTbl"){
                                                that.calloData_Conversions();//UoM Conversions
                                            }elsoComboBoxKPIe if(tableId === "energyConvTbl"){
                                                that.calloData_EnergyConversions();//Energy Conversions
                                            }else if(tableId === "KPIListTbl"){
                                                that.calloData_KPIList();//KPI List - Environment
                                            }else if(tableId === "EmissionFactorsTbl"){
                                                that.calloData_EF();//Emission Factor
                                            }
                                        }                           
                                    }*/
                                });
                                //end
                            },
                            error: function (e) {
                                //add on Feb 23
                                console.log("error:"+JSON.parse(e.responseText).error.message.value);
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                                //end
                            }
                            });
                        }
                    }//is new row
                }// for loop
                
            },
            //For Update
            onUpdateEntry_Table: function (tableId, hanaTableName) {
                var that = this;
                this.batchModel = this.getOwnerComponent().getModel("dataModel");
                this.batchChanges = [];               
                var Type = "", subType = "", kpi = "";

                var KPIModel;
                if(tableId === "KPIListTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("KPIModel");
                }else if(tableId === "EmissionFactorsTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("EmissionFactorsModel");
                }else if(tableId === "uomConVolTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("UOMConvModel");
                }else if(tableId === "energyConvTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("EnergyConvModel");
                }else if(tableId === "tblDivision"){
                    KPIModel = this.getView().byId(tableId).getModel("divisionModel");
                }else if(tableId === "generalYearTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("yearModel");
                }else if(tableId === "measureConvsTbl"){
                    KPIModel = this.getView().byId(tableId).getModel("measureConvsModel");
                }else{              
                    KPIModel = that.getView().byId(tableId).getModel();
                }

                var rowItems = this.getView().byId(tableId).getSelectedItems();
                var oSelectedItems = { "items": [] }
                for (var i = 0; i < rowItems.length; i++) {

                    if(tableId === "KPIListTbl"){
                        Type = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        subType = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        kpi = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;
                        var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                        var json3 = {                         
                            "Template": rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value,
                            "Measure": rowItems[i].mAggregations.cells[4].mAggregations.items[1].mProperties.value,
                            "EFStandard": rowItems[i].mAggregations.cells[5].mAggregations.items[1].mProperties.value,

                            "EmissionLogic": rowItems[i].mAggregations.cells[8].mAggregations.items[1].mProperties.value,
                            "BiogenicEmissions": rowItems[i].mAggregations.cells[9].mAggregations.items[1].mProperties.value,
                            "Scope": rowItems[i].mAggregations.cells[10].mAggregations.items[1].mProperties.value,

                            "EnergyLogic": rowItems[i].mAggregations.cells[11].mAggregations.items[1].mProperties.value,
                            "EnergyUse": rowItems[i].mAggregations.cells[12].mAggregations.items[1].mProperties.value,
                            "RenNon": rowItems[i].mAggregations.cells[13].mAggregations.items[1].mProperties.value,
                            "Supplier": rowItems[i].mAggregations.cells[14].mAggregations.items[1].mProperties.value,

                            "ReportingStandard": "GRI",     //15
                            "GRIStd": rowItems[i].mAggregations.cells[16].mAggregations.items[1].mProperties.value,                            
                            "SDG": rowItems[i].mAggregations.cells[17].mAggregations.items[1].mProperties._semanticFormValue,
                            
                        };
                        var uri1 = "/"+hanaTableName+"(Industry='" + Industry + "',KPI='" + kpi + "',Type='" + Type + "',SubType='" + subType + "')"; //hanaTableName
                        var uri = encodeURI(uri1);                    
                        that.batchModel.update(uri, json3, {
                            method: "PUT",
                            success: function (data) {                               
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                                 
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });
                        that.getView().byId(tableId).getModel().refresh();
                    }else if(tableId === "SocialKPIList"){
                       // Type =  rowItems[0].getCells()[0].getValue();
                       // subType =  rowItems[0].getCells()[1].getValue();
                       // kpi =  rowItems[0].getCells()[2].getValue();
                       var Type = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                       var subType = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                       var kpi = rowItems[i].mAggregations.cells[2].mAggregations.items[0].mProperties.text;                    
                      

                        var json3 = {                            
                            /*"KPI": kpiItems[kpiIndex].getCells()[2].mProperties.value,
                            "Type": kpiItems[kpiIndex].getCells()[0].mProperties.value,
                            "SubType": kpiItems[kpiIndex].getCells()[1].mProperties.value,
                            "Template": kpiItems[kpiIndex].getCells()[3].mProperties.value,       
                            "GRIStd": kpiItems[kpiIndex].getCells()[6].mProperties.value,
                            "SDG": kpiItems[kpiIndex].getCells()[7].mProperties.value,                         
                            "Logic": kpiItems[kpiIndex].getCells()[5].mProperties.value,
                            "Prefix": kpiItems[kpiIndex].getCells()[4].mProperties.value*/                            
                            /*
                            "Template": rowItems[0].getCells()[3].getValue(),       
                            "GRIStd": rowItems[0].getCells()[6].getValue(),
                            "SDG": rowItems[0].getCells()[7].getValue(),                         
                            "Logic": rowItems[0].getCells()[5].getValue(),
                            "Prefix": rowItems[0].getCells()[4].getValue()
                            */

                           "Template": rowItems[i].mAggregations.cells[3].mAggregations.items[0].mProperties.text,       
                           "GRIStd": rowItems[i].mAggregations.cells[6].mAggregations.items[0].mProperties.text,                           
                        // "SDG": rowItems[i].mAggregations.cells[7].mAggregations.items[0].mProperties.text,//Line commented By Pankaj                      
                           "SDG": rowItems[i].mAggregations.cells[7].mAggregations.items[1].getProperty("selectedKeys").toString(),//Added By Pankaj
                           "Logic": rowItems[i].mAggregations.cells[5].mAggregations.items[0].mProperties.text,
                           "Prefix": rowItems[i].mAggregations.cells[4].mAggregations.items[0].mProperties.text
                        }
                        that.getView().byId(tableId).getModel().getData().results[i].GRIStd = json3["GRIStd"];
                        that.getView().byId(tableId).getModel().getData().results[i].Logic = json3["Logic"];
                        that.getView().byId(tableId).getModel().getData().results[i].Prefix = json3["Prefix"];
                        that.getView().byId(tableId).getModel().getData().results[i].SDG = json3["SDG"];
                        that.getView().byId(tableId).getModel().getData().results[i].Template =json3["Template"];       
                        
                        var uri1 = hanaTableName+"(KPI='" + kpi + "',Type='" + Type + "',SubType='" + subType + "')"; //hanaTableName
                        var uri = encodeURI(uri1);
                        that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", json3));                    
                        that.getView().byId(tableId).getModel().refresh();
                    }else if(tableId === "uomVolumeTbl"){                        
                        var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;                        
                        var Measure = this.UOMSelected;
                        var Abbreviation = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text; 
                        var oUnit = rowItems[i].mAggregations.cells[0].mAggregations.items[1].mProperties.value;
                        var json3 =
                        {                            
                            "Unit": rowItems[i].mAggregations.cells[0].mAggregations.items[1].mProperties.value                            
                        }
                        var uri1 = "/"+hanaTableName+"(Industry='" + Industry + "',Measure='" + Measure + "',Abbreviation='" + Abbreviation + "')"; //hanaTableName
                        var uri = encodeURI(uri1);                       
                        that.batchModel.update(uri, {Unit: oUnit}, {
                            method: "PUT",
                            success: function (data) {
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });
                        that.getView().byId(tableId).getModel().refresh();
                    }else if(tableId === "EmissionFactorsTbl"){
                        var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;                        
                        var Type = this.KPITypeSelected;
                        var subType = that.getView().byId("EF_Type").getSelectedKey();                
                        var KPI = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        var Standard = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        var Shortlong = rowItems[i].mAggregations.cells[4].mAggregations.items[0].mProperties.text;
                        var classAttr = rowItems[i].mAggregations.cells[5].mAggregations.items[0].mProperties.text;
                        var json3 =
                        {                   
                            "EmissionFactor": rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.value,
                            "UoM": rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value,
                            "Deno": rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value.substring(rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value.lastIndexOf("/") + 1),                      
                            "Nume": rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value.substring(0, rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value.indexOf('/'))
                        }
                        var uri1 = "/"+hanaTableName+"(Industry='" + Industry + "',KPI='" + KPI + "',Type='" + Type + "',SubType='" + subType + "',Standard='" + Standard + "',Shortlong='" + Shortlong + "',class='" + classAttr + "')"; //hanaTableName
                        var uri = encodeURI(uri1);                        
                        that.batchModel.update(uri, json3, {
                            method: "PUT",
                            success: function (data) {
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });
                        that.getView().byId(tableId).getModel().refresh();
                    }else if(tableId === "uomConVolTbl"){
                        var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                        var UOMConversionMeasure = this.UOMConversionMeasure;
                        var Measure = UOMConversionMeasure;
                        var UserInputUnit = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        var ExpectedOutputUnit = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        var json3 =
                        {                                                        
                            "ConverstionFactor": rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.value,
                            "Operation": rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.selectedKey
                        }
                        console.log("json3:"+json3);
                        var uri1 = "/"+hanaTableName+"(Industry='" + Industry + "',Measure='" + Measure + "',UserInputUnit='" + UserInputUnit + "',ExpectedOutputUnit='" + ExpectedOutputUnit + "')"; //hanaTableName
                        var uri = encodeURI(uri1);                        
                        that.batchModel.update(uri, json3, {
                            method: "PUT",
                            success: function (data) {
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });                        
                        that.getView().byId(tableId).getModel().refresh();
                        
                    }else if(tableId === "measureConvsTbl"){
                        var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                        var UOMConversionMeasure = this.UOMConversionMeasure;
                        var InputMeasureType = UOMConversionMeasure;
                        //var UserInputUnit = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        //var ExpectedOutputUnit = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        //var OutputUoM = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;
                        var json3 =
                        {                       
                            "InputUom": rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text,
                            "OutputMeasureType": rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text,
                            "OutputUoM":rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text,
                            "ConverstionFactor": rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value,
                            "Operation": rowItems[i].mAggregations.cells[4].mAggregations.items[1].mProperties.selectedKey
                        }
                        console.log("json3:"+json3);
                        var uri1 = "/"+hanaTableName+"(Industry='" + Industry + "',InputMeasureType='" + InputMeasureType + "')"; //hanaTableName
                        var uri = encodeURI(uri1);                        
                        that.batchModel.update(uri, json3, {
                            method: "PUT",
                            success: function (data) {
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });                        
                        that.getView().byId(tableId).getModel().refresh();
                        
                    }else if(tableId === "energyConvTbl"){
                        var Industry = this.GlobalIndustryModel.getData().Industry;    
                        var type = this.KPITypeSelected;
                        var Type = type;
                        var Subtype = that.getView().byId("Sub_Type").getSelectedKey();
                        var KPI = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;                          
                        var UserInputUnit = rowItems[i].mAggregations.cells[1].mAggregations.items[0].mProperties.text;

                        var json3 =
                        {                            
                            "ExpectedOutputUnit": rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.selectedKey,
                            "ConverstionFactor":rowItems[i].mAggregations.cells[3].mAggregations.items[1].mProperties.value,
                            "Operation": rowItems[i].mAggregations.cells[4].mAggregations.items[1].mProperties.selectedKey
                        }

                        var uri1 = "/"+hanaTableName+"(Industry='" + Industry + "',KPI='" + KPI + "',Type='" + Type + "',Subtype='" + Subtype + "',UserInputUnit='" + UserInputUnit + "')"; //hanaTableName
                        var uri = encodeURI(uri1);
                        that.batchModel.update(uri, json3, {
                            method: "PUT",
                            success: function (data) {
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });                        
                        that.getView().byId(tableId).getModel().refresh();
                        
                    }else if(tableId === "generalYearTbl"){
                        var Industry = this.GlobalIndustryModel.getData().Industry;    
                        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        var fiscal = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                        var yearA = rowItems[i].mAggregations.cells[3].mProperties.text;

                        var d = rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue;
                        var dd = rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getDate();
                        var mm = String(rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getMonth()+1).padStart(2, '0');
                        var yyyy = rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getFullYear();
                        var fromDate2 = +dd +"-"+ monthNames[d.getMonth()] +"-"+ yyyy;
                        console.log("The fromDate2 is : "+ fromDate2);

                        var d_to = rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue;
                        var dd_to = rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getDate();
                        var mm_to = String(rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getMonth()+1).padStart(2, '0');
                        var yyyy_to = rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getFullYear();
                        var toDate2 = +dd_to +"-"+ monthNames[d_to.getMonth()] +"-"+ yyyy_to;
                        console.log("The toDate2 is : "+ toDate2);

                        var fromDate = rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getFullYear();
                        var toDate = rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getFullYear();
                                           
                        var fromDate1 = rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getDate()+"/"+(rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getMonth()+1)+"/"+rowItems[i].mAggregations.cells[1].mAggregations.items[1].mProperties.dateValue.getFullYear();
                        var toDate1 = rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getDate()+"/"+(rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getMonth()+1)+"/"+rowItems[i].mAggregations.cells[2].mAggregations.items[1].mProperties.dateValue.getFullYear();

                        var json3 ={                            
                            "Industry": "" + Industry,
                            "YearR": "" + toDate,
                            "YearA": "" + yearA,
                            "StartDate": "" + fromDate2,
                            "EndDate": "" + toDate2                            
                        }  
                        console.log("year json3:"+json3)
                        var uri1 = "/"+hanaTableName+"(YearL='" + fromDate + "',fiscal='" + fiscal + "')"; //hanaTableName
                        console.log("year uri1:"+uri1)
                        var uri = encodeURI(uri1);                        
                        that.batchModel.update(uri, json3, {
                            method: "PUT",
                            success: function (data) {
                                sap.m.MessageBox.show("Details updated successfully.", {
                                    icon: MessageBox.Icon.INFORMATION,
                                    title: "Information",
                                    actions: [MessageBox.Action.YES],
                                    emphasizedAction: MessageBox.Action.YES
							    });
                            },
                            error: function (e) {
                                if(JSON.parse(e.responseText).error.code != '202'){
                                    sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                                }
                            }
                        });                        
                        that.getView().byId(tableId).getModel().refresh();
                    }
                }

            },
            formatEmissionFactor: function (Value) {
                //console.log("formatEmissionFactor:" + Value)
                if (Value === "BUSINESS TRAVEL") {
                    this.getView().byId("shortLongColn").setVisible(true);
                    this.getView().byId("classColn").setVisible(true);
                    return true;
                } else {
                    this.getView().byId("shortLongColn").setVisible(false);
                    this.getView().byId("classColn").setVisible(false);
                    return false;

                }
            },
            formatEditField: function (isNewRow, isEditableRow, isExistingRow) {
                if(isNewRow||isEditableRow){
                    return true;
                }   
                 else if(isExistingRow) {
                     return false;
                 }  
                 
             },
             formatDisplayField: function (isNewRow, isEditableRow, isExistingRow) {
                if(isNewRow||isEditableRow){
                    return false;
                }           
                 else if(isExistingRow) {
                     return true;
                 }  
                 
             },
             formatPKeyField: function (isNewRow, isEditableRow, isExistingRow) {
                if(isNewRow){
                    return false;
                }           
                 else  if(isExistingRow ||isEditableRow){
                     return true;
                 }  
                 
             },
             formatDivisionText: function (Industry) {
                console.log("Industry:"+Industry);
                if(Industry === "IT"){
                    return "ITs";
                }           
                 else  if(Industry === "Ports"){
                     return "Port";
                 }  
                 else{
                    return "no value";
                 }
                 
             },
             /*onPressEdit:function(oEvent){
                 console.log("on press edit");
             },*/
            //  onPressReset:function(oEvent){  //Pankaj : Two onPressRest Function created
            //     console.log("on press reset");
            //  },
            calloData_GRIStds : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                //var url1= "/Standards_Telecom";         
                var url1= "/Standards_Module";         

                //var Value = this.GlobalIndustryModel.getData().Industry;                
                //var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               
                var oTable = this.byId("firstTabl");
                this.GRIStdModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {                  
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.GRIStdModel.setData(data);
                        /*
                        var level1 =[], level2 = [];                        
                        var length = data.results.length;
                        for(let i=0;i<length;i++){
                            if(data.results[i].DrillState != 'leaf' & data.results[i].ParentNodeID === "1"){                                
                                level1.push(data.results[i].Description);
                            }
                            else if(data.results[i].ParentNodeID === "6"){                                
                                level2.push(data.results[i].Description);
                            }                            
                        }

                       // that.GRIStdModel.setData(level1);  
                        var odata = {
                            "data": [
                                {
                                     "name": level1,
                                     "categories": level2
                                }                                                 
                            ]  
                        };                       
                       that.GRIStdModel.setData(odata);
                        
                        that.getView().setModel(that.GRIStdModel, "GRIStdModel")                      
                        //console.log(that.GRIStdModel);
                        console.log("ListModel:" + ListModel);                       

                       
                        */
                        //that.getView().byId("firstTabl").bindRows(that.GRIStdModel, "GRIStdModel");                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },           
            calloData_Division : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                //var url1= "/Division_Telecom";
                var url1= "/Division";

                var Value = this.GlobalIndustryModel.getData().Industry;                
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.DivisionModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.DivisionModel.setData(data);                        
                        console.log(that.DivisionModel);
                        console.log("ListModel:" + ListModel);
                       
                        var length = data.results.length;
                        for (var i= 0; i < length; i++) {
                            that.DivisionModel.getData().results[i].isExistingRow = true;
                            that.DivisionModel.getData().results[i].isNewRow = false;
                            that.DivisionModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("tblDivision").setModel(that.DivisionModel, "divisionModel");                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },
            calloData_Location: function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                //var url1= "/Location_Telecom";         
                var url1= "/Location";         

                var Value = this.GlobalIndustryModel.getData().Industry;                
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.LocationModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.LocationModel.setData(data);                        
                        console.log(that.LocationModel);
                        console.log("ListModel:" + ListModel);
                       
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.LocationModel.getData().results[i].isExistingRow = true;
                            that.LocationModel.getData().results[i].isNewRow = false;
                            that.LocationModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("tblLocation").setModel(that.LocationModel, "locationModel");    
                        
                        //added for Location Dropdown - Report
                        //that.getView().byId("box1").setModel(that.LocationModel, "locationModel");    
                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },
            //OData call for General Tab
            calloData_General : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                var url1= "/Constants_Telecom";                
                var Value = this.GlobalIndustryModel.getData().Industry;
                //var Value = "IT";
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.GeneralModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.GeneralModel.setData(data);                        
                        console.log(that.GeneralModel);
                        console.log("ListModel:" + ListModel);
                       
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.GeneralModel.getData().results[i].isExistingRow = true;
                            that.GeneralModel.getData().results[i].isNewRow = false;
                            that.GeneralModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("GroupMeasure").setModel(that.GeneralModel, "generalModel");//Added for Measure Conversions
                        that.getView().byId("cbUOMConv3_Measure").setModel(that.GeneralModel, "generalModel");//Added for Measure Conversions
                        that.getView().byId("generalTbl").setModel(that.GeneralModel, "generalModel");
                        that.getView().byId("GroupA").setModel(that.GeneralModel, "generalModel");
                        that.getView().byId("GroupB").setModel(that.GeneralModel, "generalModel");                        
                        
                       // console.log(""+that.getView().byId("generalTbl").getItems());
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },
            calloData_General_Year: function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                //var url1= "/Year_telecom";  // YEAR_TELECOM             
                var url1= "/Year_Module";
                var Value = this.GlobalIndustryModel.getData().Industry;
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.YearModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {     
                    filters: [filter1],              
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.YearModel.setData(data);                        
                        console.log(that.YearModel);
                        console.log("ListModel:" + ListModel);
                       
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.YearModel.getData().results[i].isExistingRow = true;
                            that.YearModel.getData().results[i].isNewRow = false;
                            that.YearModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("generalYearTbl").setModel(that.YearModel, "yearModel");
                        //that.getView().byId("GroupA").setModel(that.GeneralModel, "generalModel");
                        //that.getView().byId("GroupB").setModel(that.GeneralModel, "generalModel");
                       // console.log(""+that.getView().byId("generalTbl").getItems());

                       //added for Year Dropdown - Report
                       //that.getView().byId("box2").setModel(that.YearModel, "yearModel");    
                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },
            // UOM
            calloData_UOM : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");

                //var url1= "/"+ this.GlobalIndustryModel.getData().UOM_Telecom;
                //var hanaTableName = this.GlobalIndustryModel.getData().UOM_Telecom;

                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;

                var Value = this.UOMSelected;
               // var filter1 = new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: Value });  
                
                var oFilter1 = new sap.ui.model.Filter({
                    filters: [                        
                        new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry })
                    ], and: true
                });

                this.UOMModel = new sap.ui.model.json.JSONModel();
                OData.read("/UOM", {
                //OData.read(url1, {                  
                    filters: [oFilter1],  
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.UOMModel.setData(data);                        
                        console.log(that.UOMModel);
                        console.log("ListModel:" + ListModel);
                        //UoM
                        that.getView().byId("cbUOMConv").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUOMConv2").setModel(ListModel, "UOMListModel");
                        //Measure Conversion
                        that.getView().byId("cbUOMConv_Measure").setModel(ListModel, "UOMListModel");
                        //that.getView().byId("cbUOMConv2_Measure").setModel(ListModel, "UOMListModel");

                        var EnergyListModel = new sap.ui.model.json.JSONModel();
                        /*ListModel.setData(data);
                        ListModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
                        sap.ui.getCore().setModel(ListModel, "ListModel");
                        that.listData = data;*/

                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.UOMModel.getData().results[i].isExistingRow = true;
                            that.UOMModel.getData().results[i].isNewRow = false;
                            that.UOMModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("uomVolumeTbl").setModel(that.UOMModel);    
                         
                        //that.getView().byId("uomVolumeTbl").setModel(that.UOMModel);    

                        //Energey Conversion
                        sap.ui.getCore().setModel(ListModel,"EnergyListModel");
                        that.getView().byId("cbEnergyConvIP").setModel(EnergyListModel, "FilterEnergy");
                        that.getView().byId("cbEnergyConvOP").setModel(ListModel, "EnergyListModel");
                        //this._getFilterData_EnergyConv(cbEnergyConvOP, EnergyListModel2, filter2);//added
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

            },
            // Conversions - UOM , Energy
            calloData_Conversions : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                
                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry });

                this.UOMConvModel = new sap.ui.model.json.JSONModel(); //mk
                //var url1= "/"+ this.GlobalIndustryModel.getData().UoMConversions_Telecom;
                OData.read("/UoMConversions", {
                //OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.UOMConvModel.setData(data);//mk
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.UOMConvModel.getData().results[i].isExistingRow = true;
                            that.UOMConvModel.getData().results[i].isNewRow = false;
                            that.UOMConvModel.getData().results[i].isEditableRow = false;  
                        }

                        //UoMConversions
                        that.getView().byId("uomConVolTbl").setModel(that.UOMConvModel, "UOMConvModel");
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

                this.EnergyConvModel = new sap.ui.model.json.JSONModel();
                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry });

               // OData.read("/EnergyCnversions_Telecom", {
                OData.read("/EnergyCnversions", {
                    // OData.read("/EnergyCnversions_Ports", {
                        filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.EnergyConvModel.setData(data);
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.EnergyConvModel.getData().results[i].isExistingRow = true;
                            that.EnergyConvModel.getData().results[i].isNewRow = false;
                            that.EnergyConvModel.getData().results[i].isEditableRow = false;  
                        }

                        //UoMConversions
                        that.getView().byId("energyConvTbl").setModel(that.EnergyConvModel, "EnergyConvModel");
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

            },
            calloData_EnergyConversions: function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                this.EnergyConvModel = new sap.ui.model.json.JSONModel();
                //var url1= "/"+ this.GlobalIndustryModel.getData().UoMConversions_Telecom;

                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry });

                //OData.read("/EnergyCnversions_Telecom", {
                    OData.read("/EnergyCnversions", {
                        filters: [filter1],
                        // OData.read("/EnergyCnversions_Ports", {
    
                        success: function (data, oResponse) {
                            var ListModel = new sap.ui.model.json.JSONModel();
                            ListModel.setData(data);
                            that.EnergyConvModel.setData(data);
                            var length = data.results.length;
                            for (var i = 0; i < length; i++) {
                                that.EnergyConvModel.getData().results[i].isExistingRow = true;
                                that.EnergyConvModel.getData().results[i].isNewRow = false;
                                that.EnergyConvModel.getData().results[i].isEditableRow = false;  
                            }
    
                            //UoMConversions
                            that.getView().byId("energyConvTbl").setModel(that.EnergyConvModel, "EnergyConvModel");
                        },
                        error: function (err) {
                            MessageBox.error("Error");
                        }
                    });
            },
            calloData_MeasureConversions: function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                this.measureConvsModel = new sap.ui.model.json.JSONModel();
                //var url1= "/"+ this.GlobalIndustryModel.getData().UoMConversions_Telecom;
                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry });

                //OData.read("/Measure_Telecom", {                   
                OData.read("/Measure_Module", {  
                    filters: [filter1],                 
                        success: function (data, oResponse) {
                            var ListModel = new sap.ui.model.json.JSONModel();
                            ListModel.setData(data);
                            that.measureConvsModel.setData(data);
                            var length = data.results.length;
                            for (var i = 0; i < length; i++) {
                                that.measureConvsModel.getData().results[i].isExistingRow = true;
                                that.measureConvsModel.getData().results[i].isNewRow = false;
                                that.measureConvsModel.getData().results[i].isEditableRow = false;  
                            }    
                            //Measure Conversions
                            that.getView().byId("measureConvsTbl").setModel(that.measureConvsModel, "measureConvsModel");
                        },
                        error: function (err) {
                            MessageBox.error("Error");
                        }
                    });
            },
            calloData_KPIList_Social: function (){
                var that = this;
                
                var OData = this.getOwnerComponent().getModel("dataModel");
                //added for social KPI List
                //this.KPIListModel = new sap.ui.model.json.JSONModel();                
                OData.read("/KPIList_Social_Ports", {
                    success: function (data, oResponse) {
                        /*var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);                       
                        that.KPIListModel.setData(data);
                        that.getView().byId("SocialKPIList").setModel(that.KPIListModel, "KPIListModel");
                        console.log(that.KPIListModel);                        */

                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            ListModel.getData().results[i].isExistingRow = true;
                            ListModel.getData().results[i].isNewRow = false;
                            ListModel.getData().results[i].isEditableRow = false;                          
                        }
                        that.getView().byId("SocialKPIList").setModel(ListModel);
                         
                    },
                    error: function (err) {
                        // MessageBox.error("Error");

                    }
                });

            },
            calloData_KPIList: function (){
                //Environment - KPI List
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");

                //var url1= "/"+ this.GlobalIndustryModel.getData().KPIListTable;                
                var url1= "/KPIList";

                var Value = this.GlobalIndustryModel.getData().Industry;                
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });

                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        //Table content alignment
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            ListModel.getData().results[i].isExistingRow = true;
                            ListModel.getData().results[i].isNewRow = false;
                            ListModel.getData().results[i].isEditableRow = false;

                            if (ListModel.getData().results[i].SDG != null) {
                                let TAndCList = ListModel.getData().results[i].SDG.split(",").join("\n ");
                                ListModel.getData().results[i].SDG = "";
                                ListModel.getData().results[i].SDG = TAndCList;

                                let GRI = ListModel.getData().results[i].GRIStd.split(";,").join("\n ");
                                ListModel.getData().results[i].GRIStd = "";
                                ListModel.getData().results[i].GRIStd = GRI;
                            }
                        }

                        that.getView().byId("KPIListTbl").setModel(ListModel, "KPIModel");                  
                        
                     //   that.getView().byId("EmissionFactorsTbl").setModel(ListModel, "KPIModel");                                //mickey 20/10
                        that.getView().byId("EF_Type").setModel(ListModel, "KPIModel");  //subtype combox in EF Screen
                        that.getView().byId("KPI").setModel(ListModel, "KPIModel");  //KPI combox in EF Screen

                        //newly added for Energy conver
                        that.getView().byId("energyConvTbl").setModel(ListModel, "EnergyModel");
                        that.getView().byId("Sub_Type").setModel(ListModel, "EnergyModel");  //subtype combox in Energy Screen
                        that.getView().byId("KPI_Energy").setModel(ListModel, "EnergyModel");  //KPI combox in EF Screen

                        //Type - Emisson Factors
                        //  var a = [];
                        var b = [];

                        var oTypeData = data.results;
                        
                        for (var i = 0; i < oTypeData.length; i++) {
                            if (b.indexOf(oTypeData[i].Type) === -1) {
                                b.push(oTypeData[i].Type);
                            }
                        }
                        console.log("subType:" + b);
                        var jsondata = {
                            items: b
                        };
                        var jsonModel = new sap.ui.model.json.JSONModel();
                        jsonModel.setData(jsondata.items);

                        //newly added for Energy - GroupC
                        var oEnergyBtn = that.getView().byId("GroupC");
                        oEnergyBtn.setModel(jsonModel, "EmissionModel");

                        var oRadioBtn = that.getView().byId("EmissonFactors");
                        oRadioBtn.setModel(jsonModel, "EmissionModel");

                        console.log(jsonModel);
                        that.KPITypeSelected = jsonModel.getData()[0];
                        //that._getKPISubTypes();//added

                        that._getFilterData_KPI_EF();
                        that._getEmissionFactorData(); //make it dynamic...mickey
                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },
            calloData_EF: function (){
                var that = this;
                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                var OData = this.getOwnerComponent().getModel("dataModel");
                this.EmissionFactorsModel = new sap.ui.model.json.JSONModel();
                
                //var url1= "/"+ this.GlobalIndustryModel.getData().EmissionFactors_Telecom;
                //OData.read(url1, {
                OData.read("/EmissionFactors", {
                    //   OData.read("/EmissionFactors_Ports", {

                    success: function (data, oResponse) {
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.EmissionFactorsModel.setData(data);
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.EmissionFactorsModel.getData().results[i].isExistingRow = true;
                            that.EmissionFactorsModel.getData().results[i].isNewRow = false;
                            that.EmissionFactorsModel.getData().results[i].isEditableRow = false;
                        }
                        that.getView().byId("EmissionFactorsTbl").setModel(that.EmissionFactorsModel, "EmissionFactorsModel");

                       // that.getView().byId("EmissionFactorsUserTbl").setModel(that.EmissionFactorsModel, "EmissionFactorsUserModel");//added for user defined EF on 08 Feb 23
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();

                    }
                });
            },
            calloData_Prefix_Types : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                var url1= "/Prefix_Types";         

                this.PrefixTypesModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {                    
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.PrefixTypesModel.setData(data);                        
                        console.log(that.PrefixTypesModel);
                        console.log("ListModel:" + ListModel);
                       
                        var length = data.results.length;
                        for (var i= 0; i < length; i++) {
                            that.PrefixTypesModel.getData().results[i].isExistingRow = true;
                            that.PrefixTypesModel.getData().results[i].isNewRow = false;
                            that.PrefixTypesModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("prefixTypesTbl").setModel(that.PrefixTypesModel, "PrefixTypesModel");       
                        that.getView().byId("prefixValues_RBtn").setModel(that.PrefixTypesModel, "PrefixTypesModel");
                        that.getView().byId("prefixKPI").setModel(that.PrefixTypesModel, "PrefixTypesModel");

                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });
            },
            calloData_Prefix_Values : function (){
                var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");

                var url1= "/Prefix_Values";
                var Value = this.PrefixSelected;
                var filter1 = new sap.ui.model.Filter({ path: "prefix", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.PrefixValuesModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);                       
                        that.PrefixValuesModel.setData(data); 

                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.PrefixValuesModel.getData().results[i].isExistingRow = true;
                            that.PrefixValuesModel.getData().results[i].isNewRow = false;
                            that.PrefixValuesModel.getData().results[i].isEditableRow = false;  
                        }
                        that.getView().byId("prefixValuesTbl").setModel(that.PrefixValuesModel, "PrefixValuesModel");    
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

            },
            callODataService: function () {
                var that = this;

               // var oBusyDialog = new sap.m.BusyDialog({});
                //oBusyDialog.open();
                var OData = this.getOwnerComponent().getModel("dataModel");

               /* this.EmissionFactorsModel = new sap.ui.model.json.JSONModel();
                OData.read("/EmissionFactors", {
                    //   OData.read("/EmissionFactors_Ports", {

                    success: function (data, oResponse) {
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.EmissionFactorsModel.setData(data);
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.EmissionFactorsModel.getData().results[i].isExistingRow = true;
                            that.EmissionFactorsModel.getData().results[i].isNewRow = false;
                        }
                        that.getView().byId("EmissionFactorsTbl").setModel(that.EmissionFactorsModel, "EmissionFactorsModel");
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();

                    }
                });*/


               /* OData.read("/DataMaster", {
                    success: function (data, oResponse) {
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();
                    }
                });*/

               
                
               /* this.UOMModel = new sap.ui.model.json.JSONModel(); //mk
                OData.read("/UOM", {
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.UOMModel.setData(data);//mk
                        //   that.oCBNewRow.setModel(ListModel,"UOMListModel");//mk
                        console.log(that.UOMModel);//mk
                        console.log("ListModel:" + ListModel);
                        //UoM
                        that.getView().byId("cbUOMConv").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUOMConv2").setModel(ListModel, "UOMListModel");

                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.UOMModel.getData().results[i].isExistingRow = true;
                            that.UOMModel.getData().results[i].isNewRow = false;
                        }
                        that.getView().byId("uomVolumeTbl").setModel(that.UOMModel);                        

                        //Energey Conversion
                        that.getView().byId("cbEnergyConvIP").setModel(ListModel, "EnergyListModel");
                        that.getView().byId("cbEnergyConvOP").setModel(ListModel, "EnergyListModel");

                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });*/
               
               
              /*  this.UOMConvModel = new sap.ui.model.json.JSONModel(); //mk

                OData.read("/UoMConversions", {
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.UOMConvModel.setData(data);//mk
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.UOMConvModel.getData().results[i].isExistingRow = true;
                            that.UOMConvModel.getData().results[i].isNewRow = false;
                        }

                        //UoMConversions
                        that.getView().byId("uomConVolTbl").setModel(that.UOMConvModel, "UOMConvModel");
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });*/


                //added for social KPI List
            /*    //this.KPIListModel = new sap.ui.model.json.JSONModel();                
                OData.read("/KPIList_Social_Ports", {
                    success: function (data, oResponse) {*/
                        /*var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);                       
                        that.KPIListModel.setData(data);
                        that.getView().byId("SocialKPIList").setModel(that.KPIListModel, "KPIListModel");
                        console.log(that.KPIListModel);                        */

                    /*    var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            ListModel.getData().results[i].isExistingRow = true;
                            ListModel.getData().results[i].isNewRow = false;
                            ListModel.getData().results[i].isEditableRow = false;                          
                        }
                        that.getView().byId("SocialKPIList").setModel(ListModel);
                         
                    },
                    error: function (err) {
                        // MessageBox.error("Error");

                    }
                });*/



              /*  this.EnergyConvModel = new sap.ui.model.json.JSONModel();

                OData.read("/EnergyCnversions", {
                    // OData.read("/EnergyCnversions_Ports", {

                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.EnergyConvModel.setData(data);
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.EnergyConvModel.getData().results[i].isExistingRow = true;
                            that.EnergyConvModel.getData().results[i].isNewRow = false;
                        }

                        //UoMConversions
                        that.getView().byId("energyConvTbl").setModel(that.EnergyConvModel, "EnergyConvModel");
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });*/

                 /*var url1= "/"+ this.GlobalIndustryModel.getData().KPIListTable;
              
                 //  OData.read("/KPIList", {
                //OData.read("/KPIList_Ports", {
                    OData.read(url1, {  
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);

                        //KPIList
                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            ListModel.getData().results[i].isExistingRow = true;
                            ListModel.getData().results[i].isNewRow = false;
                            ListModel.getData().results[i].isEditableRow = false;
                        }

                        that.getView().byId("KPIListTbl").setModel(ListModel, "KPIModel");                  

                        that.getView().byId("EmissionFactorsTbl").setModel(ListModel, "KPIModel");
                        that.getView().byId("EF_Type").setModel(ListModel, "KPIModel");  //subtype combox in EF Screen
                        that.getView().byId("KPI").setModel(ListModel, "KPIModel");  //KPI combox in EF Screen

                        //newly added for Energy conver
                        that.getView().byId("energyConvTbl").setModel(ListModel, "EnergyModel");
                        that.getView().byId("Sub_Type").setModel(ListModel, "EnergyModel");  //subtype combox in Energy Screen
                        that.getView().byId("KPI_Energy").setModel(ListModel, "EnergyModel");  //KPI combox in EF Screen
                        //end

                        //Type - Emisson Factors
                        //  var a = [];
                        var b = [];

                        var oTypeData = data.results;
                        
                        for (var i = 0; i < oTypeData.length; i++) {
                            if (b.indexOf(oTypeData[i].Type) === -1) {
                                b.push(oTypeData[i].Type);
                            }
                        }
                        console.log("subType:" + b);
                        var jsondata = {
                            items: b
                        };
                        var jsonModel = new sap.ui.model.json.JSONModel();
                        jsonModel.setData(jsondata.items);

                        //newly added for Energy - GroupC
                        var oEnergyBtn = that.getView().byId("GroupC");
                        oEnergyBtn.setModel(jsonModel, "EmissionModel");

                        var oRadioBtn = that.getView().byId("EmissonFactors");
                        oRadioBtn.setModel(jsonModel, "EmissionModel");

                        console.log(jsonModel);
                        that.KPITypeSelected = jsonModel.getData()[0];


                        that._getFilterData_KPI_EF();
                        that._getEmissionFactorData(); //make it dynamic...mickey
                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });*/


               OData.read("/Constants", {
                    success: function (data, oResponse) {
                        console.log("success");
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        
                        that.getView().setModel(ListModel, "ConstantsModel");
                    
                       
                    },
                    error: function (err) {
                        console.log("Error");
                    }
                });               

                this.calloData_Prefix_Types(); //Social - Prefix Types
                this.calloData_Prefix_Values(); // Social - Prefix Values
                this.calloData_UOM();
                this.calloData_Conversions();
                this.calloData_MeasureConversions();
                this.calloData_EnergyConversions();
                this.calloData_KPIList();
                this.calloData_KPIList_Social();
                this.calloData_EF();
                this.calloData_General();  
                this.calloData_Division();
                this.calloData_Location();
                this.calloData_General_Year();
                

            },

            onUpdateFinished:function(){
                //start            
              var Industry = this.GlobalIndustryModel.getData().Industry;  
              /* var Value = "Location_"+  Industry;       
              //console.log("Value"+Value);
                //var filter1 = new sap.ui.model.Filter({ path: "ID", operator: sap.ui.model.FilterOperator.EQ, value1: 'Location_Telecom' });               
                var filter1 = new sap.ui.model.Filter({ path: "ID", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               
                var oTable_Location = this.getView().byId("tblLocation");                
                var oBinding_Loc = oTable_Location.getBinding("items");
                oBinding_Loc.filter(filter1);

                var Div_Value = "Division_"+  Industry;       
                //console.log("Value"+Value);                
               var filter1 = new sap.ui.model.Filter({ path: "ID", operator: sap.ui.model.FilterOperator.EQ, value1: Div_Value });               
                var oTable_Division = this.getView().byId("tblDivision");                
                var oBinding_Div = oTable_Division.getBinding("items");
                oBinding_Div.filter(filter1);*/

                //var Industry = this.GlobalIndustryModel.getData().Industry;  
               /* if(Industry === "IT" || Industry === "Ports" ){
                    this.getView().byId("Location").setName("Location");
               }else if(Industry === "Telecom"){
                    this.getView().byId("Location").setName("Circle");
               }*/

               //load selected record by default - UOM
               /* var Value = this.UOMSelected;               
                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: Value })];             
                var oTable_IDE = this.getView().byId("uomVolumeTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);     */      
                
                //Load selected record by default - UOM Conversions
               /* var txt = this.UOMConversionMeasure;
                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                var oTable_IDE = this.getView().byId("uomConVolTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);*/

                //Load selected record by default - Prefix Values
                /*var txt = this.PrefixSelected;
                var filter1 = [new sap.ui.model.Filter({ path: "prefix", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                var oTable_IDE = this.getView().byId("prefixValuesTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);*/
                
            },

            //get KPI subtypes
            _getKPISubTypes: function () {
                var that = this;
                var KPIModel = that.getView().byId("KPISubType").getModel("KPIModel");
                var EFType = this.KPITypeSelected;

                var a = [];
                var b = [];

                var oKPIModelData = KPIModel.getData().results;

                for (var j = 0; j < oKPIModelData.length; j++) {
                    if (oKPIModelData[j].Type === EFType) {
                        for (var i = 0; i < oKPIModelData.length; i++) {
                            if (a.indexOf(oKPIModelData[i].SubType) === -1 && oKPIModelData[i].Type === EFType) {
                                a.push(oKPIModelData[i].SubType);
                            }
                        }
                    }

                }
                console.log(a);

                for (var j = 0; j < a.length; j++) {
                    var object = {};
                    object.SubType = a[j];
                    b.push(object);
                }
                console.log(b);

                var jsondata1 = {
                    items: b
                };

                var jsonModel1 = new sap.ui.model.json.JSONModel();
                jsonModel1.setData(jsondata1);
                console.log(jsondata1);
                var oComboBox = that.getView().byId("KPISubType");
                oComboBox.setModel(jsonModel1);
                oComboBox.bindAggregation("items"
                    , "/items", new sap.ui.core.ListItem({
                        text: "{SubType}",
                        key: "{SubType}"
                    }));
                that.getView().byId("KPISubType").setSelectedKey(a[0]);
                this.KPISubtypeSelected = a[0];
                this._getKPIs();
            },
            //Division - New Row
            OnPressAddNewEntry_Division : function (event) {
                var that = this;
                var arr = { "results": [] };
                arr.results = [{ "Division": "", "Industry": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("tblDivision").getModel("divisionModel").getData().results = that.getView().byId("tblDivision").getModel("divisionModel").getProperty("/results").concat(arr.results);
                that.getView().byId("tblDivision").getModel("divisionModel").refresh(true);               
            },
            OnPressAddNewEntry_Location : function (event) {
                var that = this;
                var arr = { "results": [] };
                arr.results = [{ "Location": "", "Industry": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("tblLocation").getModel("locationModel").getData().results = that.getView().byId("tblLocation").getModel("locationModel").getProperty("/results").concat(arr.results);
                that.getView().byId("tblLocation").getModel("locationModel").refresh(true);               
            },
            OnPressAddNewEntry_General: function (event) {
                var that = this;
                var UOMSelected = this.UOMSelected;
                var arr = { "results": [] };
                arr.results = [{ "Value": "" + UOMSelected, "ID": "", "Industry": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("generalTbl").getModel("generalModel").getData().results = that.getView().byId("generalTbl").getModel("generalModel").getProperty("/results").concat(arr.results);
                that.getView().byId("generalTbl").getModel("generalModel").refresh(true);               
            },
            OnPressAddNewEntry_General_Year: function (event) {
                var that = this;
                //var UOMSelected = this.UOMSelected;
                var arr = { "results": [] };
                arr.results = [{ "YearL": "", "YearR": "", "YearA": "", "Vertical": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("generalYearTbl").getModel("yearModel").getData().results = that.getView().byId("generalYearTbl").getModel("yearModel").getProperty("/results").concat(arr.results);
                that.getView().byId("generalYearTbl").getModel("yearModel").refresh(true);               
            },
            OnPressAddNewEntry_UOM_Volume: function (event) {
                var that = this;
                var UOMSelected = this.UOMSelected;
                var arr = { "results": [] };
                arr.results = [{ "Measure": "" + UOMSelected, "Unit": "", "Abbreviation": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("uomVolumeTbl").getModel().getData().results = that.getView().byId("uomVolumeTbl").getModel().getProperty("/results").concat(arr.results);
                that.getView().byId("uomVolumeTbl").getModel().refresh(true);
                //Editable                
                var aItems = that.getView().byId("uomVolumeTbl").getItems();
                var index = that.getView().byId("uomVolumeTbl").getItems().length - 1;
                //aItems[index].getCells()[0].setEditable(true);
            },

            OnPressAddNewEntry_UOM_Convs_Volume: function (event) {
                var that = this;
                var arr = { "results": [] };
                var UOMConversionMeasure = this.UOMConversionMeasure; //mickey
                //  arr.results =  [{"Measure" : "Volume", "UserInputUnit"  : "", "ExpectedOutputUnit" : "", "" : "", "ConverstionFactor" : "", "Operation" : ""}];
                arr.results = [{
                    "Measure": "" + UOMConversionMeasure, "UserInputUnit": "",
                    "ExpectedOutputUnit": "", "": "", "ConverstionFactor": "", "Operation": "",
                    "isNewRow": true, "isExistingRow": false, "isEditableRow": false 
                }];

                that.getView().byId("uomConVolTbl").getModel("UOMConvModel").getData().results = that.getView().byId("uomConVolTbl").getModel("UOMConvModel").getProperty("/results").concat(arr.results);

                that.getView().byId("uomConVolTbl").getModel("UOMConvModel").refresh(true);
            },
            OnPressAddNewEntry_Measure_Convs : function (event) {
                var that = this;
                var arr = { "results": [] };
                var UOMConversionMeasure = this.UOMConversionMeasure; //mickey                
                arr.results = [{
                    "InputMeasureType": "" + UOMConversionMeasure, "InputUom": "",
                    "OutputUoM": "", "OutputMeasureType": "", "ConverstionFactor": "", "Operation": "",
                    "isNewRow": true, "isExistingRow": false, "isEditableRow": false 
                }];

                that.getView().byId("measureConvsTbl").getModel("measureConvsModel").getData().results = that.getView().byId("measureConvsTbl").getModel("measureConvsModel").getProperty("/results").concat(arr.results);

                that.getView().byId("measureConvsTbl").getModel("measureConvsModel").refresh(true);
            },
            OnPressAddNewEntry_Energy: function (event) {
                var that = this;
                //var EFSelected = this.EnergyTypeSelected;
                //var EFType = this.EnergySubtypeSelected;
                var EFSelected = this.KPITypeSelected;
                var EFType = this.KPISubtypeSelected;
                var arr = { "results": [] };
                arr.results = [{
                    "KPI": "", "Type": "" + EFSelected, "Subtype": "" + EFType, "UserInputUnit": "", "ExpectedOutputUnit": "",
                    "ConverstionFactor": "", "Operation": "", "isNewRow": true, "isExistingRow": false, "isEditableRow": false 
                }];

                that.getView().byId("energyConvTbl").getModel("EnergyConvModel").getData().results = that.getView().byId("energyConvTbl").getModel("EnergyConvModel").getProperty("/results").concat(arr.results);
                //that.getView().byId("energyConvTbl").getModel("EnergyConvModel").getData().results = that.getView().byId("energyConvTbl").getModel("EnergyConvModel").concat({"Energy" : sap.ui.getCore().getModel("EnergyListModel").getProperty("/results")});
                that.getView().byId("energyConvTbl").getModel("EnergyConvModel").refresh(true);
                
                /*var filter2 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: "Energy" })];                
                var cbEnergyConvOP = that.getView().byId("cbEnergyConvOP");
                var EnergyListModel2 = that.getView().byId("cbEnergyConvOP").getModel("EnergyListModel");
                this._getFilterData_EnergyConv(cbEnergyConvOP, EnergyListModel2, filter2);//added                
                console.log("EnergyListModel2:"+EnergyListModel2);
                for (var i = 0; i < EnergyListModel2.getData().results.length; i++) {
                    if (EnergyListModel2.getData().results[i].isNewRow) {
                        if(EnergyListModel2.getData().results[i].Abbreviation.length>0){
                            console.log(":"+EnergyListModel2.getData().results[i].Abbreviation);
                        }
                    }else{
                        console.log("else:"+EnergyListModel2.getData().results[i].Abbreviation);
                    }
                }*/
                /*var filter2 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: "Energy" })];                
                var cbEnergyConvOP = that.getView().byId("cbEnergyConvOP");
                var EnergyListModel2 = that.getView().byId("cbEnergyConvOP").getModel("EnergyListModel");
                this._getFilterData_EnergyConv(cbEnergyConvOP, EnergyListModel2, filter2);//added   
                var energyConvModel = this.getView().byId("energyConvTbl").getModel("EnergyConvModel");
                for (var i = 0; i < energyConvModel.getData().results.length; i++) {
                    if (energyConvModel.getData().results[i].isNewRow) {
                        console.log("New row");
                        if(EnergyListModel2.getData().results[i].Abbreviation.length>0){
                            console.log(":"+EnergyListModel2.getData().results[i].Abbreviation);
                        }
                    }else{
                        console.log("existing row:"+EnergyListModel2.getData().results[i].Abbreviation);
                    }
                }*/


            },
            OnPressAddNewEntry_KPIList: function (event) {
                var that = this;
                var arr = { "results": [] };
                arr.results = [{
                    "KPI": "", "Type": "", "SubType": "", "Template": "", "Measure": "", "Standard": "", "Logic": "", "Standard1":"",
                    "Scope": "", "GRIStd": "", "SDG": "", "RENON": "", "EnergyUse": "", "BiogenicEmissions" : "", "Supplier": "",
                    "isNewRow": true, "isExistingRow": false
                }];

                that.getView().byId("KPIListTbl").getModel("KPIModel").getData().results = that.getView().byId("KPIListTbl").getModel("KPIModel").getProperty("/results").concat(arr.results);

                that.getView().byId("KPIListTbl").getModel("KPIModel").refresh(true);

                                
               
            },

            OnPressAddNewEntry_SocialKPI: function (event) {
                var that = this;
                var arr = { "results": [] };
                arr.results = [{
                    "KPI": "", "Type": "", "SubType": "", "Template": "",                     
                    "Template": "", "Prefix": "", "Logic": "", "GRIStd": "", "GRIStd": "", "SDG": "",
                    "isNewRow": true, "isExistingRow": false, "isEditableRow": false, "InformationType": ""
                }];

                that.getView().byId("SocialKPIList").getModel().getData().results = that.getView().byId("SocialKPIList").getModel().getProperty("/results").concat(arr.results);

                that.getView().byId("SocialKPIList").getModel().refresh(true);
               
            },
            //Prefix Types - New Row
            OnPressAddNewEntry_PrefixTypes : function (event) {
                var that = this;
                var arr = { "results": [] };
                arr.results = [{ "prefix": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("prefixTypesTbl").getModel("PrefixTypesModel").getData().results = that.getView().byId("prefixTypesTbl").getModel("PrefixTypesModel").getProperty("/results").concat(arr.results);
                that.getView().byId("prefixTypesTbl").getModel("PrefixTypesModel").refresh(true);               
            },
            //Prefix Types - New Row
            OnPressAddNewEntry_Prefix_Values : function (event) {
                var that = this;
                var prefi = this.PrefixSelected;
                var arr = { "results": [] };
                arr.results = [{ "prefix": ""+ prefi, "value": "",
                            "isNewRow": true, "isExistingRow": false, "isEditableRow": false   }];
                that.getView().byId("prefixValuesTbl").getModel("PrefixValuesModel").getData().results = that.getView().byId("prefixValuesTbl").getModel("PrefixValuesModel").getProperty("/results").concat(arr.results);
                that.getView().byId("prefixValuesTbl").getModel("PrefixValuesModel").refresh(true);               
            },
            OnPressAddNewEntry_EF: function (event) {
                var that = this;
                // var EFSelected = this.EFSelected;
                // var EFType = that.getView().byId("EF_Type").getSelectedKey();
                var EFSelected = this.KPITypeSelected;
                var EFType = this.KPISubtypeSelected;
                var std = this.EFTypeSelected;
                var arr = { "results": [] };
                arr.results = [{
                    "KPI": "", "Type": "" + EFSelected, "SubType": "" + EFType, "Standard": std, "EmissionFactor": "", "UoM": "", "Shortlong": "", "class": "",
                    "Deno": "", "Nume": "", "isNewRow": true, "isExistingRow": false, "isEditableRow": false
                }];
                //arr.results = [{  "Type": "Energy","KPI":"", "Standard": "" , "EmissionFactor": "", "UoM":""}];
                that.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel").getData().results = that.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel").getProperty("/results").concat(arr.results);
                that.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel").refresh(true);

                if(this.EFTypeSelected === "DEFRA"){
                    var kpiItems = that.getView().byId("EmissionFactorsTbl").getItems();
                    var kpiIndex = that.getView().byId("EmissionFactorsTbl").getItems().length - 1;
                    var oEFValue = kpiItems[kpiIndex].mAggregations.cells[2].getItems()[1];
                    var oEFUnit = kpiItems[kpiIndex].mAggregations.cells[3].getItems()[1];
                    console.log("oEFValue:"+oEFValue);
                    console.log("oEFUnit:"+oEFUnit);
                    oEFValue.mProperties.editable=false;
                    oEFUnit.mProperties.editable=false;
                }
            },

            OnPressAddNewEntry_Templates: function (event) {
                var that = this;

                var json = {
                    "KPI": "LPG",
                    "Type": "ENERGY",
                    "SubType": "Direct Energy",
                    "Template": "Table 1",
                    "UomType": "Mass",
                    "EmissionFactor": "IPCC",
                    "Logic": "Logic 1",
                    "Scope": "Scope 1",
                    "GRIStd": null,
                    "EmissionResults": "13"
                };
            },
            myFunction: function (oEvent) {
                oEvent.getSource().setEditable(true);
                oEvent.getSource().setEnabled(true);
            },
            onSelect_Radiobutton_PrefixValues: function (oEvent) {
                var that = this;

                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.PrefixSelected = txt;

                var filter1 = [new sap.ui.model.Filter({ path: "prefix", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                console.log(filter1);

                var oTable_IDE = that.getView().byId("prefixValuesTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);
                console.log(oBinding_IDE);

            },
            /* Update UoM Table with selected Measure Type from radiobutton in UoM tab - Admin screen */
            onSelect_Radiobutton_UOM: function (oEvent) {
                var that = this;

                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.UOMSelected = txt;
                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;

                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                //console.log(filter1);

               /* var filter1 = new sap.ui.model.Filter({
                    filters: [    
                        new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: txt }),                            
                        new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry })
                    ], and: true

                });*/

                var oTable_IDE = that.getView().byId("uomVolumeTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);
                console.log(oBinding_IDE);

            },
            /* Update UoM table with desired Measure Type */
            _getFilterData_UOMConv: function (cbUOMConv, UOMListModel, filter1) {

                var oItems = new sap.ui.core.ListItem({
                    key: "{UOMListModel>Abbreviation}",
                    text: "{UOMListModel>Abbreviation}"
                });

                cbUOMConv.bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter1
                });
            },

            onSelectionChange:function(evt){
                var e = evt;
                var items = evt.getSource().getSelectedItems();
               
               
                for(var i=0;i<items.length;i++){
                    var template = evt.getSource().getSelectedItems()[i].getCells()[3].getItems()[1].getSelectedKey();
                    var row = evt.getSource().getSelectedItems()[i];
                    if( template == "Table 3" || template == "Table 6" ) {
                        row.getCells()[6].getItems()[1].setEditable(true);
                        row.getCells()[7].getItems()[1].setEditable(true);
                    }
                }
                
            },

            onSelect_KPIList: function (oEvent) {
                var that = this;
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
              //  this.KPITypeSelected = txt;
              this.KPIListTypeSelected = txt;
                if (txt === "Environment") {
                    that.getView().byId("KPIListTbl").setVisible(true);
                    that.getView().byId("SocialKPIList").setVisible(false);

                   // sap.m.MessageToast.show("txt:" + txt);

                } else if (txt === "Social") {
                    that.getView().byId("KPIListTbl").setVisible(false);
                    //
                    that.getView().byId("SocialKPIList").setVisible(true);
                   // sap.m.MessageToast.show("txt:" + txt);
                }
            },
            /** Depending on selected conversion type, either UoM Conversion or Evergy Conversion table is displayed */
            onSelect_Convs: function (oEvent) {
                var that = this;
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.ConversionTypeSelected = txt;
                if (txt === "UoM Conversions") {
                    that.getView().byId("uom").setVisible(true);
                    that.getView().byId("measure").setVisible(false);                   

                } else if (txt === "Measure Conversions") {
                    that.getView().byId("uom").setVisible(false);
                    that.getView().byId("measure").setVisible(true);                                       
                }
            },
            onSelect_EF: function (oEvent) {
                var that = this;
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                //this.ConversionTypeSelected = txt;
                this.EFTypeSelected = txt;
                if (txt === "DEFRA") {
                    that.getView().byId("Defra").setVisible(true);                       
                   //filter the table  data with defra condition.
                   // var filter1 = [new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                   var type = this.KPITypeSelected;
                    var oFilter1 = new sap.ui.model.Filter({
                        filters: [    
                            new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),                            
                            new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: txt }) //add on 08 Feb
                        ], and: true
    
                    });

                    var oTable_IDE = that.getView().byId("EmissionFactorsTbl");
                    var oBinding_IDE = oTable_IDE.getBinding("items");
                    //oBinding_IDE.filter([]);
                    console.log(oBinding_IDE);
                    oBinding_IDE.filter(oFilter1);
                    that.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel").refresh(true);

                    var oRadioBtn = that.getView().byId("EmissonFactors");
                    oRadioBtn.setSelectedIndex(0);



                 } else if (txt === "User Defined") {
                    that.getView().byId("Defra").setVisible(false);
                    //filter the table  data with user defined condition.             
                    //var filter1 = [new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                    var type = this.KPITypeSelected;
                    var oFilter1 = new sap.ui.model.Filter({
                        filters: [    
                            new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),                            
                            new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: txt }) //add on 08 Feb
                        ], and: true
    
                    });

                    var oTable_IDE = that.getView().byId("EmissionFactorsTbl");
                    var oBinding_IDE = oTable_IDE.getBinding("items");
                   // oBinding_IDE.filter([]);
                    console.log(oBinding_IDE);
                    oBinding_IDE.filter(oFilter1);
                    that.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel").refresh(true);

                    var oRadioBtn = that.getView().byId("EmissonFactors");
                    oRadioBtn.setSelectedIndex(0);
                }
            },
            /* Update UoM Conversion table with desired Measure Type */
            onSelect_Radiobutton_UOMConvs: function (oEvent) {
                var that = this;
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();

                //mickey start
                this.UOMConversionMeasure = txt;
                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];

                console.log(filter1);

                var oTable_IDE = that.getView().byId("uomConVolTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);
                console.log(oBinding_IDE);

                // fetch elevant UoM values from input drop downs while adding new row
                var cbUOMConv = that.getView().byId("cbUOMConv");
                var UOMListModel = that.getView().byId("cbUOMConv").getModel("UOMListModel")

                this._getFilterData_UOMConv(cbUOMConv, UOMListModel, filter1);

                var cbUOMConv2 = that.getView().byId("cbUOMConv2");
                var UOMListModel2 = that.getView().byId("cbUOMConv2").getModel("UOMListModel");
                this._getFilterData_UOMConv(cbUOMConv2, UOMListModel2, filter1);


            },
            onSelect_Radiobutton_MeasureConvs : function (oEvent) {
                var that = this;
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();

                this.UOMConversionMeasure = txt;
                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];

                var filter2 = [new sap.ui.model.Filter({ path: "InputMeasureType", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];

                console.log(filter1);

                var oTable_IDE = that.getView().byId("measureConvsTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter2);
                console.log(oBinding_IDE);

               
                var cbUOMConv_Measure = that.getView().byId("cbUOMConv_Measure");
                var UOMListModelMeasure = that.getView().byId("cbUOMConv_Measure").getModel("UOMListModel")

                this._getFilterData_UOMConv(cbUOMConv_Measure, UOMListModelMeasure, filter1);

                
               /* var oItems = new sap.ui.core.ListItem({
                    key: "{UOMListModelMeasure>Abbreviation}",
                    text: "{UOMListModelMeasure>Abbreviation}"
                });

                cbUOMConv_Measure.bindAggregation("items", {
                    path: 'UOMListModelMeasure>/results',
                    template: oItems,
                    filters: filter1
                });*/

                
            },
            onChangeTemplate: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.Template = selText;
                var pos = this.getView().byId("KPIListTbl").getItems().length - 1;
                //Measure 2 is applicable only for Table 3
                if (selText === "Table 3" || selText === "Table 6") {
                    this.getView().byId("KPIListTbl").getItems()[pos].getCells()[6].getItems()[1].setEditable(false);
                    this.getView().byId("KPIListTbl").getItems()[pos].getCells()[7].getItems()[1].setEditable(false);
                    //var UomType2 = this.getView().byId("UomType2");
                    //UomType2.setEditable(true);

                    /* this.getView().byId("UomType2").onAfterRendering = function() {
                         if (sap.m.ComboBox.prototype.onAfterRendering) {
                             sap.m.ComboBox.prototype.onAfterRendering.apply(this);
                         }
                         document.getElementById("UomType2-inner").disabled = true;
                     }*/
                } else {
                    this.getView().byId("KPIListTbl").getItems()[pos].getCells()[6].getItems()[1].setEditable(true);
                    this.getView().byId("KPIListTbl").getItems()[pos].getCells()[7].getItems()[1].setEditable(true);
                }
                //For Table 2 only, enable UOM Typ2 & Emission Factor2 columns others hide it - on Feb 9 20223
                if (selText === "Table 2"){
                    this.getView().byId("KPIListTbl").getColumns()[6].setVisible(true);
                    this.getView().byId("KPIListTbl").getColumns()[7].setVisible(true);
                }else{
                    this.getView().byId("KPIListTbl").getColumns()[6].setVisible(false);
                    this.getView().byId("KPIListTbl").getColumns()[7].setVisible(false);
                }

            },
            onChangeUomType: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.Measure = selText;
            },
            onChangeEmissionFactor: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.Standard = selText;
            },
            onCollapseAll: function(oEvent) {
                var oTreeTable = this.byId("firstTabl");
                oTreeTable.collapseAll();
            },
    
            onCollapseSelection: function(oEvent) {
                var oTreeTable = this.byId("firstTabl");
                oTreeTable.collapse(oTreeTable.getSelectedIndices());
            },
    
            onExpandFirstLevel: function(oEvent) {
                var oTreeTable = this.byId("firstTabl");
                oTreeTable.expandToLevel(1);
            },
    
            onExpandSelection: function(oEvent) {
                var oTreeTable = this.byId("firstTabl");
                oTreeTable.expand(oTreeTable.getSelectedIndices());                
            },
            onPressCancelGRI: function(oEvent){
                if (!this._gDialog) {
                    this._gDialog = sap.ui.core.Fragment.load({
                        id: that.getView().getId(),
                        name: "com.techm.sustainabilityui.fragment.GRIStd1",
                        controller: that
                    }).then(function(oDialog){
                        that.getView().addDependent(oDialog);
                        return oDialog;
                    });
                    }
                    this._gDialog.then(function(oDialog){
                    //  oDialog.setModel(oDefraModel);
                        //oDialog.open(sInputValue);
                        oDialog.close();
                    });
            },
            onPressOkGRI: function(oEvent){

                //Bind selected value to table
                var oTable = this.byId("firstTabl");
                var selectedData = [];
                //get indices of selected rows, comma-separated
                var aIndices = oTable.getSelectedIndices();
                var val="";
                var drillState="";
                var arrVal=[];
                for(var i=0;i<aIndices.length; i++) {
                    //fetch the data of selected rows by index
                    var tableContext = oTable.getContextByIndex(aIndices[i]);
                    //var data = oTable.getModel("cloth").getProperty(tableContext.getPath());
                    var data = oTable.getModel().getProperty(tableContext.getPath());
                    selectedData.push(data);
                    //val=data.name;
                    //val=data.Description;
                    drillState = data.DrillState;
                    if(drillState === "expanded"){                        
                        sap.m.MessageBox.show(
                            "Please Select Leaf Node..", {
                                icon: MessageBox.Icon.WARNING,
                                title: "Warning",                                
                            });
                            arrVal = "";
                    }else{
                        val=data.Description;
                        //arrVal.push(val);
                        arrVal.push(val+";");
                        /*if(aIndices.length>1){
                            arrVal.push(val+";");                            
                        }else{
                            arrVal.push(val);
                        }*/
                    }
                }

                var a = arrVal.toString();
                console.log("a:"+a);
                console.log("a:"+a.length);
                var b = a.slice(0,-1);
                console.log("b:"+b);
                console.log("b:"+b.length);

                var that=this;
                var kpiItems = that.getView().byId("KPIListTbl").getItems();
                var kpiIndex = that.getView().byId("KPIListTbl").getItems().length - 1;
                //GRI - 16 coln
                var oEFValue = kpiItems[kpiIndex].mAggregations.cells[16].getItems()[1];                                       
                var KPIModel = this.getView().byId("KPIListTbl").getModel("KPIModel");
                for (var i = 0; i < KPIModel.getData().results.length; i++) {                            
                    if (KPIModel.getData().results[i].isNewRow) {
                        //var unitL = return val ;
                       oEFValue.setValue(b);                       
                    }
                } 
               
                //close the dialog box
               // var approvalDialog = sap.ui.xml.Fragment("com.techm.sustainabilityui.fragment.GRIStd",this.getView().getController());
               // approvalDialog.close();

                if (!this._gDialog) {
                    this._gDialog = sap.ui.core.Fragment.load({
                        id: that.getView().getId(),
                        name: "com.techm.sustainabilityui.fragment.GRIStd1",
                        controller: that
                    }).then(function(oDialog){
                        that.getView().addDependent(oDialog);
                        return oDialog;
                    });
                    }
                    this._gDialog.then(function(oDialog){
                    //  oDialog.setModel(oDefraModel);
                        //oDialog.open(sInputValue);
                        oDialog.close();
                    });

            },
            onChangeGRIStd: function (oEvent) {
				var that=this;
                
                if (!this._gDialog) {
                    this._gDialog = sap.ui.core.Fragment.load({
                        id: that.getView().getId(),
                        name: "com.techm.sustainabilityui.fragment.GRIStd1",
                        controller: that
                    }).then(function(oDialog){
                        that.getView().addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._gDialog.then(function(oDialog){
                  //  oDialog.setModel(oDefraModel);
                    //oDialog.open(sInputValue);
                    
                    //that.getView().byId("GRIDialog").bindRows("GRIStdModel");
                    // that.getView().byId("firstTabl").bindRows("GRIStdModel");                   
                      that.callBindings();
                    // that.calloData_GRIStds();
                    
                    oDialog.open();
                    
                });
                //this.calloData_GRIStds();
                
            },
            onChangeStdValue_EF: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.KPI_EF = selText;
            },
            onChangeKPI: function (oEvent) {            
                
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);                
                this.EFStandard = selText;
                
                //addd
                if(this.EFTypeSelected === "DEFRA"){ //condition for popup selection
                var oButton = oEvent.getSource(),
				oView = this.getView();

                var sInputValue = oEvent.getSource().getValue(),//1
                oView = this.getView();//2

                if (!this._pDialog) {
                    this._pDialog = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "com.techm.sustainabilityui.fragment.Defra",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                
                var that = this;
               // var oDefraModel = that.getView().byId("myDialog").getModel("defraModel");

                this._pDialog.then(function(oDialog){
                   // this._configDialog(oButton, oDialog);
                   //add
                 /*  var oData = 
                    {
                        Order : [
                            {
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Gaseous fuels",
                                Level3: "Butane",
                                Level4: "",
                                ColumnText: "Energy - Gross CV",
                                UOMSimple: "kWh",
                                UOM: "kWh (Gross CV)",
                                GHG: "kg CO2e",
                                Lookup: "Butane kWh (Gross CV)",
                                ConvFactor: "0.2224"
                            },{
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Gaseous fuels",
h                                Level3: "Butane",
                                Level4: "",
                                ColumnText: "Volume",
                                UOMSimple: "litres",
                                UOM: "litres",
                                GHG: "kg CO2e",
                                Lookup: "Butane litres",
                                ConvFactor: "1.74529"                                
                            },{
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Gaseous fuels",
                                Level3: "CNG",
                                Level4: "",
                                ColumnText: "Energy - Gross CV",
                                UOMSimple: "kWh",
                                UOM: "kWh (Gross CV)",
                                GHG: "kg CO2e",
                                Lookup: "CNG kWh (Gross CV)",
                                ConvFactor: "0.18316"                                
                            },{
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Gaseous fuels",
                                Level3: "LPG",
                                Level4: "",
                                ColumnText: "Energy - Gross CV",
                                UOMSimple: "kWh",
                                UOM: "kWh (Gross CV)",
                                GHG: "kg CO2",
                                Lookup: "LPG kWh (Gross CV)",
                                ConvFactor: "0.21419"                                
                            },{
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Gaseous fuels",
                                Level3: "LNG",
                                Level4: "",
                                ColumnText: "Tonnes",
                                UOMSimple: "tonnes",
                                UOM: "tonnes",
                                GHG: "kg CH4",
                                Lookup: "LNG tonnes",
                                ConvFactor: "3.44"                                
                            },{
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Liquid fuels",
                                Level3: "Aviation spirit",
                                Level4: "",
                                ColumnText: "Energy - Net CV",
                                UOMSimple: "kWh",
                                UOM: "kWh (Net CV)",
                                GHG: "kg CO2",
                                Lookup: "Aviation spirit kWh (Net CV)",
                                ConvFactor: "0.25135"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Fuels",
                                Level2: "Liquid fuels",
                                Level3: "Lubricants",
                                Level4: "",
                                ColumnText: "Energy - Net CV",
                                UOMSimple: "kWh",
                                UOM: "kWh (Net CV)",
                                GHG: "kg CO2e",
                                Lookup: "Lubricants kWh (Net CV)",
                                ConvFactor: "0.28105"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Refrigerant & other",
                                Level2: "Kyoto protocol - standard",
                                Level3: "Carbon dioxide",
                                Level4: "",
                                ColumnText: "",
                                UOMSimple: "kg",
                                UOM: "kg",
                                GHG: "kg CO2e",
                                Lookup: "Carbon dioxide kg",
                                ConvFactor: "1.0000"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Refrigerant & other",
                                Level2: "Kyoto protocol - standard",
                                Level3: "Perfluorocyclobutane (PFC-318)",
                                Level4: "",
                                ColumnText: "",
                                UOMSimple: "kg",
                                UOM: "kg",
                                GHG: "kg CO2e",
                                Lookup: "Perfluorocyclobutane (PFC-318) kg",
                                ConvFactor: "10300.00000"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Passenger vehicles",
                                Level2: "Cars (by market segment)",
                                Level3: "Mini",
                                Level4: "",
                                ColumnText: "Battery Electric Vehicle",
                                UOMSimple: "miles",
                                UOM: "miles",
                                GHG: "kg CH4",
                                Lookup: "Mini miles",
                                ConvFactor: "0.00000"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Passenger vehicles",
                                Level2: "Cars (by market segment)",
                                Level3: "Lower medium",
                                Level4: "",
                                ColumnText: "Diesel",
                                UOMSimple: "km",
                                UOM: "km",
                                GHG: "kg CO2",
                                Lookup: "Lower medium km",
                                ConvFactor: "0.14119"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Passenger vehicles",
                                Level2: "Cars (by market segment)",
                                Level3: "Lower medium",
                                Level4: "",
                                ColumnText: "Battery Electric Vehicle",
                                UOMSimple: "km",
                                UOM: "km",
                                GHG: "kg N2O",
                                Lookup: "Lower medium km",
                                ConvFactor: "0.00000"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Delivery vehicles",
                                Level2: "Vans",
                                Level3: "Class I (up to 1.305 tonnes)",
                                Level4: "",
                                ColumnText: "Petrol",
                                UOMSimple: "km",
                                UOM: "km",
                                GHG: "kg CO2",
                                Lookup: "Class I (up to 1.305 tonnes) km",
                                ConvFactor: "0.19914"                               
                            },{
                                Scope : "Scope 1",
                                Level1: "Delivery vehicles",
                                Level2: "HGV (all diesel)",
                                Level3: "Rigid (>3.5 - 7.5 tonnes)",
                                Level4: "",
                                ColumnText: "50% Laden",
                                UOMSimple: "km",
                                UOM: "km",
                                GHG: "kg CO2e",
                                Lookup: "Rigid (>3.5 - 7.5 tonnes) km HGV (all diesel)",
                                ConvFactor: "0.48364"                               
                            },
                            {
                                Scope : "Scope 2",
                                Level1: "UK electricity",
                                Level2: "Electricity generated",
                                Level3: "Electricity: UK",
                                Level4: "",
                                ColumnText: "",
                                UOMSimple: "kWh",
                                UOM: "kWh",
                                GHG: "kg N2O",
                                Lookup:"Electricity: UK",
                                ConvFactor: "0.00137"                               
                                },
                                {
                                    Scope : "Scope 2",
                                    Level1: "SECR kWh UK electricity for EVs",
                                    Level2: "Vans",
                                    Level3: "Class III (1.74 to 3.5 tonnes)",
                                    Level4: "",
                                    ColumnText: "Battery Electric Vehicle",
                                    UOMSimple: "tonne.km",
                                    UOM: "tonne.km",
                                    GHG: "kWh",
                                    Lookup:"Class III (1.74 to 3.5 tonnes) tonne.km",
                                    ConvFactor: "0.99239"                               
                                },
                                {
                                    Scope : "Scope 2",
                                    Level1: "SECR kWh UK electricity for EVs",
                                    Level2: "Cars (by size)",
                                    Level3: "Large car",
                                    Level4: "",
                                    ColumnText: "Plug-in Hybrid Electric Vehicle",
                                    UOMSimple: "km",
                                    UOM: "km",
                                    GHG: "kWh",
                                    Lookup:"Large car km",
                                    ConvFactor: "0.12196"                               
                                },{
                                    Scope : "Scope 2",
                                    Level1: "Heat and steam",
                                    Level2: "Heat and steam",
                                    Level3: "Onsite heat and steam",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "kWh",
                                    UOM: "kWh",
                                    GHG: "kg CO2",
                                    Lookup:"Onsite heat and steam",
                                    ConvFactor: "0.16906"                               
                                },{
                                    Scope : "Scope 2",
                                    Level1: "UK electricity for Evs",
                                    Level2: "Cars (by size)",
                                    Level3: "Average car",
                                    Level4: "",
                                    ColumnText: "Battery Electric Vehicle",
                                    UOMSimple: "miles",
                                    UOM: "miles",
                                    GHG: "kg N2O",
                                    Lookup:"Average car miles",
                                    ConvFactor: "0.00052"                               
                                },{
                                    Scope : "Scope 2",
                                    Level1: "UK electricity for Evs",
                                    Level2: "Vans",
                                    Level3: "Class I (up to 1.305 tonnes)",
                                    Level4: "",
                                    ColumnText: "Battery Electric Vehicle",
                                    UOMSimple: "km",
                                    UOM: "km",
                                    GHG: "kg N2O",
                                    Lookup:"Class I (up to 1.305 tonnes) km",
                                    ConvFactor: "0.00023"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Water supply",
                                    Level2: "Water supply",
                                    Level3: "Water supply",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "million litres",
                                    UOM: "million litres",
                                    GHG: "kg CO2e",
                                    Lookup:"Water supply million litres",
                                    ConvFactor: "149.00000"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Water treatment",
                                    Level2: "Water treatment",
                                    Level3: "Water treatment",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "million litres",
                                    UOM: "million litres",
                                    GHG: "kg CO2e",
                                    Lookup:"Water treatment million litres",
                                    ConvFactor: "272.00000"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Construction",
                                    Level3: "Average construction",
                                    Level4: "",
                                    ColumnText: "Primary material production",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Average construction",
                                    ConvFactor: "79.9736726085447"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Construction",
                                    Level3: "Asphalt",
                                    Level4: "",
                                    ColumnText: "Re-used",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Asphalt",
                                    ConvFactor: "1.73826086956522"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Construction",
                                    Level3: "Insulation",
                                    Level4: "",
                                    ColumnText: "Primary material production",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Insulation",
                                    ConvFactor: "1861.7589016"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Other",
                                    Level3: "Clothing",
                                    Level4: "",
                                    ColumnText: "Primary material production",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Clothing",
                                    ConvFactor: "22310.00000"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Organic",
                                    Level3: "Compost derived from garden waste",
                                    Level4: "",
                                    ColumnText: "Primary material production",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Compost derived from garden waste",
                                    ConvFactor: "113.308906976744"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Electrical items",
                                    Level3: "Batteries - Li ion",
                                    Level4: "",
                                    ColumnText: "Primary material production",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Batteries - Li ion",
                                    ConvFactor: "6308.00000"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Material use",
                                    Level2: "Plastic",
                                    Level3: "Plastics: average plastic rigid",
                                    Level4: "",
                                    ColumnText: "Open-loop source",
                                    UOMSimple: "tonnes",
                                    UOM: "tonnes",
                                    GHG: "kg CO2e",
                                    Lookup:"Plastics: average plastic rigid",
                                    ConvFactor: "600.00000"                               
                                },{
                                    Scope : "Scope 3",
                                    Level1: "Managed assets- vehicles",
                                    Level2: "Managed HGV refrigerated (all diesel)",
                                    Level3: "Articulated (>3.5 - 33t)",
                                    Level4: "",
                                    ColumnText: "0% Laden",
                                    UOMSimple: "km",
                                    UOM: "km",
                                    GHG: "kg CO2",
                                    Lookup:"Managed HGV refrigerated (all diesel) Articulated (>3.5 - 33t) km",
                                    ConvFactor: "0.70687"                               
                                },{
                                    Scope : "Outside of Scopes",
                                    Level1: "Outside of Scopes",
                                    Level2: "Biofuel",
                                    Level3: "Biodiesel ME",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "litres",
                                    UOM: "litres",
                                    GHG: "kg CO2",
                                    Lookup:"Biodiesel ME litres",
                                    ConvFactor: "2.36000"                               
                                },{
                                    Scope : "Outside of Scopes",
                                    Level1: "Outside of Scopes",
                                    Level2: "Biofuel",
                                    Level3: "Biodiesel ME (from used cooking oil)",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "kg",
                                    UOM: "kg",
                                    GHG: "kg CO2",
                                    Lookup:"Biodiesel ME (from used cooking oil) kg",
                                    ConvFactor: "2.65000"                               
                                },{
                                    Scope : "Outside of Scopes",
                                    Level1: "Outside of Scopes",
                                    Level2: "Electricity generated",
                                    Level3: "Electricity: UK",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "kWh",
                                    UOM: "kWh",
                                    GHG: "kg CO2",
                                    Lookup:"Electricity: UK kWh",
                                    ConvFactor: "0.106867856756268"                               
                                },{
                                    Scope : "Outside of Scopes",
                                    Level1: "Outside of Scopes",
                                    Level2: "Biomass",
                                    Level3: "Wood chips",
                                    Level4: "",
                                    ColumnText: "",
                                    UOMSimple: "kWh",
                                    UOM: "kWh",
                                    GHG: "kg CO2",
                                    Lookup:"Wood chips kWh",
                                    ConvFactor: "0.35357"                               
                                }]                    
                        };         */      

                       // var that = this;
                        var OData = that.getOwnerComponent().getModel("dataModel");
                        //var url1= "/Emission_Module_telecom";         
                        var url1= "/Emission_Module";         
        
                        //var Value = "2021";                
                        var Value = that.getView().byId("defraYear").getSelectedKey();

                        var filter1 = new sap.ui.model.Filter({ path: "YearL", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               
        
                        that.DefraModel = new sap.ui.model.json.JSONModel();                
                        OData.read(url1, {
                            filters: [filter1],
                            success: function (data, oResponse) {
                                var ListModel = new sap.ui.model.json.JSONModel();
                                ListModel.setData(data);
                                that.DefraModel.setData(data);                        
                                console.log(that.DefraModel);
                                console.log("ListModel:" + ListModel);                       
                                
                                that.getView().setModel(that.DefraModel, "defraModel");
                               // that.getView().byId("myDialog").setModel(that.DefraModel, "defraModel");                        
                               // that.getView().byId("df1").setModel(that.DefraModel, "defraModel1");                        
                               //sap.ui.getCore().byId("df1").setModel(that.DefraModel, "defraModel1"); 

                               oDialog.setModel(that.DefraModel);
                            },
                            error: function (err) {
                                MessageBox.error("Error");
                            }
                        });
                       

                   // var oDefraModel = new sap.ui.model.json.JSONModel(oData);// create JSON model instance     
                   // sap.ui.getCore().setModel(oDefraModel);                      
                       
                   // oDialog.setModel(oDefraModel);
                    oDialog.open(sInputValue);
                   });
                   //end
                 //   oDialog.open();
             //   }.bind(this));

                }//selected text is DEFRA
            },
            onChangeDefraYear: function (oEvent){
           // calloData_EFModule : function (){
              /*  var that = this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                var url1= "/Emission_Module_telecom";         

                var Value = "2021";                
                var filter1 = new sap.ui.model.Filter({ path: "YearL", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.DefraModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.DefraModel.setData(data);                        
                        console.log(that.DefraModel);
                        console.log("ListModel:" + ListModel);                       
                        
                        //that.getView().byId("myDialog").setModel(that.DefraModel, "defraModel");                        
                       sap.ui.getCore().byId("myDialog").setModel(that.DefraModel, "defraModel"); 
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });*/
            },
            handleSearch: function (oEvent) {
                var aFilters, oFilter;
                aFilters = [];
                var sValue = oEvent.getParameter("value");
                //var oFilter = new sap.ui.model.Filter("Scope", sap.ui.model.FilterOperator.Contains, sValue);

                aFilters.push(new sap.ui.model.Filter("scope", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("Level1", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("Level2", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("Level3", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("Level4", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("ColumnText", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("UomSimple", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("Uom", sap.ui.model.FilterOperator.Contains, sValue));
                aFilters.push(new sap.ui.model.Filter("GHG", sap.ui.model.FilterOperator.Contains, sValue));
                
                oFilter = new sap.ui.model.Filter({ filters: aFilters, and: false });

                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
                //oBinding.filter([aFilters]);
                /*
                var aFilters, oFilter, oBinding;
                if (this._sSearchQuery === sSearchQuery) {
                   return;
                   }
                this._sSearchQuery = sSearchQuery;
                this.byId("search").setValue(sSearchQuery);
                aFilters = [];
                if (sSearchQuery && sSearchQuery.length > 0) {
                aFilters.push(new Filter("ProductId", FilterOperator.Contains, sSearchQuery));
                aFilters.push(new Filter("Name", FilterOperator.Contains, sSearchQuery));
                aFilters.push(new Filter("Category", FilterOperator.Contains, sSearchQuery));
                aFilters.push(new Filter("SupplierName", FilterOperator.Contains, sSearchQuery));
                aFilters.push(new Filter("Price", FilterOperator.Contains, sSearchQuery));
                // aFilters.push(new Filter("Quantity", FilterOperator.Contains, sSearchQuery));                
                oFilter = new Filter({ filters: aFilters, and: false });
                } 
                else { oFilter = null;
                }
                oBinding = this._oTable.getBinding("items");
                oBinding.filter(oFilter, "Application");*/
            },
            handleClose: function (oEvent) {
                // reset the filter
                var that=this;
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
    
                var aContexts = oEvent.getParameter("selectedContexts");
                if (aContexts && aContexts.length) {
                    var kpiItems = that.getView().byId("EmissionFactorsTbl").getItems();
                    var kpiIndex = that.getView().byId("EmissionFactorsTbl").getItems().length - 1;
                    //kpiItems[2].mAggregations.cells[2].getItems()[1].setValue("value");//working
                    //kpiItems[2].mAggregations.cells[3].getItems()[1].setValue("value1");//working
                    
                    //sap.m.MessageToast.show("You have chosen " + aContexts.map(function (oContext) { return oContext.getObject().Scope; }).join(", "));
                        
                        var oEFValue = kpiItems[kpiIndex].mAggregations.cells[2].getItems()[1];                       
                        var oEFUnit = kpiItems[kpiIndex].mAggregations.cells[3].getItems()[1];                        
                        var KPIModel = this.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel");
                        for (var i = 0; i < KPIModel.getData().results.length; i++) {                            
                            if (KPIModel.getData().results[i].isNewRow) {
                                oEFValue.setValue(aContexts.map(function (oContext) { return oContext.getObject().GHGConversionFactor2021; }).join(", "));
                                var unitL = aContexts.map(function (oContext) { return oContext.getObject().GHG; }).join(", ");
                                var unitR = aContexts.map(function (oContext) { return oContext.getObject().UomSimple; }).join(", ")
                                oEFUnit.setValue(unitL.replaceAll(' ','')+"/"+unitR);
                            }
                        }  
                }
            },
            handleFilterButtonPressed: function () {
                this.getViewSettingsDialog("com.techm.sustainabilityui.fragment.DefraFilter")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
                
                    //var TableFilterDistance = new sap.m.ViewSettingsFilterItem("TableFilterDistance",{multiSelect:false,text:"Scope"});
                    //sap.m.ViewSettingsItem.addFilterItem(TableFilterDistance);
                    
            },
            getViewSettingsDialog: function (sDialogFragmentName) {
                var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];
    
                if (!pDialog) {
                    pDialog = sap.ui.core.Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    });                    
                    this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;
            },
            handleFilterDialogConfirm: function (oEvent) {
                var oTable = this.byId("myDialog"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];
    
                mParams.filterItems.forEach(function(oItem) {
                    var aSplit = oItem.getKey().split("___"),
                        sPath = aSplit[0],
                        sOperator = aSplit[1],
                        sValue1 = aSplit[2],
                        sValue2 = aSplit[3],
                        oFilter = new sap.ui.model.Filter(sPath, sOperator, sValue1, sValue2);
                    aFilters.push(oFilter);
                });
    
                // apply filter settings
                oBinding.filter(aFilters);
    
                // update filter bar
                this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
                this.byId("vsdFilterLabel").setText(mParams.filterString);
            },
            onSelectDefraValues: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                //oSelectedItem.getBindingContext().getProperty("GHG");
                //console.log("oSelectedItem:"+oSelectedItem);
                //add
                var that=this;
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([]);
    
                //var aContexts = oEvent.getParameter("listItem");
                //if (aContexts && aContexts.length) 
                {
                    var kpiItems = that.getView().byId("EmissionFactorsTbl").getItems();
                    var kpiIndex = that.getView().byId("EmissionFactorsTbl").getItems().length - 1;
                    var oEFValue = kpiItems[kpiIndex].mAggregations.cells[2].getItems()[1];                       
                    var oEFUnit = kpiItems[kpiIndex].mAggregations.cells[3].getItems()[1];                        
                    var KPIModel = this.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel");
                    for (var i = 0; i < KPIModel.getData().results.length; i++) {                            
                        if (KPIModel.getData().results[i].isNewRow) {
                            oEFValue.setValue(oSelectedItem.getBindingContext().getProperty("ConvFactor"));
                            var unitL = oSelectedItem.getBindingContext().getProperty("GHG");
                            var unitR = oSelectedItem.getBindingContext().getProperty("UOM");
                            oEFUnit.setValue(unitL.replaceAll(' ','')+"/"+unitR);
                            oEvent.getSource().getParent().close();
                          //  var approvalDialog = sap.ui.xml.Fragment("com.techm.sustainabilityui.fragment.Defra",this.getView().getController());
                            //approvalDialog.close();
                        }
                    }  
                }

               
            },
            _configDialog: function (oButton, oDialog) {
                // Set draggable property
                var bDraggable = oButton.data("draggable");
                oDialog.setDraggable(bDraggable == "true");
    
                // Set resizable property
                var bResizable = oButton.data("resizable");
                oDialog.setResizable(bResizable == "true");
    
                // Multi-select if required
                var bMultiSelect = !!oButton.data("multi");
                oDialog.setMultiSelect(bMultiSelect);
                    // Remember selections if required
                var bRemember = !!oButton.data("remember");
                oDialog.setRememberSelections(bRemember);
    
                var sResponsivePadding = oButton.data("responsivePadding");
                var sResponsiveStyleClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer";
    
                if (sResponsivePadding) {
                    oDialog.addStyleClass(sResponsiveStyleClasses);
                } else {
                    oDialog.removeStyleClass(sResponsiveStyleClasses);
                }
    
                // Set custom text for the confirmation button
                var sCustomConfirmButtonText = oButton.data("confirmButtonText");
                oDialog.setConfirmButtonText(sCustomConfirmButtonText);
    
                // toggle compact style
                sap.ui.core.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
              
            },
            handleTableSelectDialogPress: function (oEvent){
              /*  var oButton = oEvent.getSource(),
				oView = this.getView();

                if (!this._pDialog) {
                    this._pDialog = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "com.techm.sustainabilityui.fragment.Defra",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._pDialog.then(function(oDialog){
                   // this._configDialog(oButton, oDialog);
                    oDialog.open();
                }.bind(this));*/
            },
            onChangeLogic: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.CalculationLogic = selText;
            },
            onChangeScope: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.Scope = selText;
            },
            onChangeSDG: function (oEvent) {
                 // var selText = oEvent.getParameter("selectedItem").getText();//Line commented by Pankaj and below Line added too
                var selText = oEvent.getSource().getProperty("selectedKeys").toString();
                console.log(selText);
                this.SDG = selText;
            },
            onChangeRenon: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.RENON = selText;
            },
            onChangeKPI_EnergyConv: function (oEvent) {
                //var selText = oEvent.getParameter("selectedItem").getText();
                var selText = oEvent.getParameters().value;
                console.log(selText);
                this.KPI = selText;
                //start - Input,Output
                var that = this;

                var KPIModel = that.getView().byId("Sub_Type").getModel("EnergyModel");
                var oKPIModelData = KPIModel.getData().results;
                var oKPIMeasure = null;
                for (var j = 0; j < oKPIModelData.length; j++) {
                    if (oKPIModelData[j].Type === this.KPITypeSelected && oKPIModelData[j].SubType === this.KPISubtypeSelected && oKPIModelData[j].KPI === this.KPI) {
                        oKPIMeasure = oKPIModelData[j].Measure;
                    }

                }
                that.oKPIMeasure = oKPIMeasure;
                //            
                /*var filter1 = [new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: oKPIMeasure })];*/
                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: oKPIMeasure })];

                var filter2 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: "Energy" })];



                console.log(filter1);

                var cbEnergyConvIP = that.getView().byId("cbEnergyConvIP");
                //var EnergyListModel = that.getView().byId("cbEnergyConvIP").getModel("EnergyListModel");
                var EnergyListModel = sap.ui.getCore().getModel("EnergyListModel");
                //this._getFilterData_EnergyConv(cbEnergyConvIP, EnergyListModel, filter1);
                //that.getView().byId("cbEnergyConvIP").getModel("EnergyListModel").refresh(true);
                var cbEnergyConvOP = that.getView().byId("cbEnergyConvOP");
                var EnergyListModel2 = that.getView().byId("cbEnergyConvOP").getModel("EnergyListModel");
                this._getFilterData_EnergyConv(cbEnergyConvOP, EnergyListModel2, filter2);//added
               // console.log(EnergyListModel2);
               // console.log(filter2);
               // this._getFilterData_UOMConv(cbEnergyConvOP, EnergyListModel2, filter2);//commented
               // that.getView().byId("cbEnergyConvOP").getModel("EnergyListModel2").refresh(true);
                //end

            },
            onChangeUOMConvUsrInput: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log("selText:"+selText);
                this.UserInputUnit = selText;


               
            },
            onChangeUOMConvExpOutput: function (oEvent) {
                /* var that = this;
 
                 var selText = oEvent.getParameter("selectedItem").getText();
                 var UOMConvModel = that.getView().byId("cbUOMConv").getModel("UOMConvModel");
                 console.log(selText);
                 var source = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
                 this.ExpectedOutputUnit = selText;*/
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.ExpectedOutputUnit = selText;

            },
            onChangeMeasureOutput: function (oEvent){
                var that=this;
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log("Measure Output:"+selText);
                this.MeasureExpectedOutputUnit = selText;                
                //=================================
                //var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: selText })];
                //console.log(filter1);
                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry; 

                var filter1 = new sap.ui.model.Filter({
                    filters: [    
                        new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: selText }),                            
                        new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry })
                    ], and: true

                });

                
                var OData = this.getOwnerComponent().getModel("dataModel");

                //var url1= "/"+ this.GlobalIndustryModel.getData().UOM_Telecom;   
                var url1= "/UOM";

                this.MeasureModel = new sap.ui.model.json.JSONModel();
                
                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.MeasureModel.setData(data);                       
                        console.log("ListModel:" + ListModel);                        
                        //Measure Conversion                        
                       /* 
                        var oComboBoxKPI = that.getView().byId("cbUOMConv2_Measure");
                        var oItems = new sap.ui.core.ListItem({
                            key: "{UOMListModel1>Abbreviation}",
                            text: "{UOMListModel1>Abbreviation}"
                        });
                        oComboBoxKPI.bindAggregation("items", {
                            path: 'UOMListModel1>/results',
                            template: oItems                            
                        });*/

                        var arrayData = data.results;
                        var jsondata = {
                            items: arrayData
                        };
                       /* var jsonModel = new sap.ui.model.json.JSONModel();
                        jsonModel.setData(jsondata);
                        var oComboBox = that.getView().byId("cbUOMConv2_Measure");
                        oComboBox.setModel(jsonModel);
                       
                        oComboBox.bindAggregation("items"
                                , "/items", new sap.ui.core.ListItem({
                            text: "{Abbreviation}",
                            key:"{Abbreviation}"
                        }));*/


                        that.getView().getModel().setProperty("/MeasureList", arrayData);
                        var oComboBox = that.getView().byId("cbUOMConv2_Measure");
                        oComboBox.bindAggregation("items",
                            "/MeasureList", new sap.ui.core.ListItem({
                                text: "{Abbreviation}",
                                key: "{Abbreviation}"
                            }));
                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

            },
            onChangeEF_Energy: function (oEvent) {
                var that = this;

                var selText = oEvent.getParameter("selectedItem").getText(); //Subtype selected - Emission Factor Table

                var type = this.KPITypeSelected;
                var subType = selText;
                var standard = this.EFTypeSelected;

                var oFilter1 = new sap.ui.model.Filter({

                    filters: [

                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: subType }),
                        new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: standard }) //add on 08 Feb
                    ]

                });
                console.log(oFilter1);
                var oTable_IDE = that.getView().byId("EmissionFactorsTbl");


                var oBinding_IDE = oTable_IDE.getBinding("items");
                console.log(oBinding_IDE);
                oBinding_IDE.filter(oFilter1);

                that.getView().byId("EmissionFactorsTbl").setVisible(true);



            },
            onChangeEF_Energy1: function (oEvent) {
                var that = this;
                var selText = oEvent.getParameter("selectedItem").getText(); //Subtype selected - Emission Factor Table
                this.KPISubtypeSelected = selText;
                this._getKPIDataforNewEntry();

                this._getEmissionFactorData();
            },
            _getEmissionFactorData: function () {


                var that = this; ``
                var type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;
                var standard = this.EFTypeSelected;

                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: subType }),
                        new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: standard }) //add on 08 Feb
                    ], and: true
                });
                
                //new sap.ui.model.Filter({ path: "Standard", operator: sap.ui.model.FilterOperator.EQ, value1: standard }) //add on 08 Feb
                console.log(oFilter1);

                //added
                if(that.getView().byId("EmissionFactorsTbl").getVisible()){
                    var oTable_IDE = that.getView().byId("EmissionFactorsTbl");
                    var oBinding_IDE = oTable_IDE.getBinding("items");                //mickey 20/10
                    
                    //oBinding_IDE.filter([]);
                    console.log(oBinding_IDE);
                    oBinding_IDE.filter(oFilter1);
                    that.getView().byId("EmissionFactorsTbl").getModel("EmissionFactorsModel").refresh(true);
                }

                //added
                /*var kpiItems = that.getView().byId("KPIListTbl");
                var oBinding_IDE1 = kpiItems.getBinding("items");
                oBinding_IDE1.filter([]);
                oBinding_IDE1.filter(oFilter1);
                that.getView().byId("KPIListTbl").getModel().refresh(true);*/

            },
            itemSelectHandler : function (oEvent) {
                var oTabContainer = this.byId("myTabContainer");
				var oItemToClose = oEvent.getParameter('item');
                console.log("oItemToClose:"+oItemToClose);
                
                //Submit btn
                this.getView().byId("btn3").setVisible(true);
                //Enable/disable Edit/reset buttons
                if(oItemToClose.getName() === "Corporate Structure"){
                    this.getView().byId("btn1").setVisible(false);//Edit
                    this.getView().byId("btn2").setVisible(false);//Reset
                }else if(oItemToClose.getName() === "Location" || oItemToClose.getName() === "Circle"){
                    this.getView().byId("btn1").setVisible(false);//Edit
                    this.getView().byId("btn2").setVisible(false);//Reset
                }else if(oItemToClose.getName() === "General"){
                    this.getView().byId("btn1").setVisible(false);//Edit
                    this.getView().byId("btn2").setVisible(false);//Reset
                    this.getView().byId("btn3").setVisible(true);//Submit
                }/*else if(oItemToClose.getName() === "Year"){
                    this.getView().byId("btn1").setVisible(false);//Edit
                    this.getView().byId("btn2").setVisible(false);//Reset
                }*/else if(oItemToClose.getName() === "Measure"){
                    if(this.UoMTypeSelected === "Measure Types"){ //disable
                        this.getView().byId("btn1").setVisible(false);//Edit
                        this.getView().byId("btn2").setVisible(false);//Reset
                    }else if(this.UoMTypeSelected === "UoM Values"){ //enable
                        this.getView().byId("btn1").setVisible(true);//Edit
                        this.getView().byId("btn2").setVisible(true);//Reset
                    }
                }else{//enable
                    this.getView().byId("btn1").setVisible(true);//Edit
                    this.getView().byId("btn2").setVisible(true);//Reset
                }


                if(oItemToClose.getName() === "Emission Factors"){
                    this.calloData_KPIList();
                }
            },
            itemSelectHandlerMyTab1 : function (oEvent){
                var oTabContainer = this.byId("myTabContainer1");
				var oItemToClose = oEvent.getParameter('item');
                console.log("oItemToClose:"+oItemToClose);
            },
            itemSelectHandlerMyTab2 : function (oEvent){
                var oTabContainer = this.byId("myTabContainer2");
				var oItemToClose = oEvent.getParameter('item');
                console.log("oItemToClose:"+oItemToClose);

                if(oItemToClose.getName() === "Emission Factors"){
                    this.calloData_KPIList();
                }
            },
            /*
            onSelect_Radiobutton_EF1: function (oEvent) {
                var that = this;

                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText(); //get selected value in radiobutton Emission factor
                this.KPITypeSelected = txt;

                console.log("txt:" + txt);

            },
            */
            onSelect_Radiobutton_Energy: function (oEvent) {

                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.EnergyTypeSelected = txt;
                this.KPITypeSelected = txt; //mickey
                console.log("txt:" + txt);
                this._getFilterData_Energy();
                
                //create json array
              /*  let oFilteredObjects=[];
                var that=this;
                var EnergyListModel = that.getView().byId("cbEnergyConvIP").getModel("EnergyListIPModel");
                let oModel = new sap.ui.model.json.JSONModel();
               

                for(let i=0; i<EnergyListModel.oData.results.length;i++){ 
                    if(EnergyListModel.oData.results[i].Measure === 'Data')
                    {
                        console.log(""+EnergyListModel.oData.results[i].Abbreviation);
                        //oModel.setProperty("/Name", EnergyListModel.oData.results[i].Abbreviation);
                        oFilteredObjects.push(EnergyListModel.oData.results[i].Abbreviation);
                    }
                }   
                oModel.setData(oFilteredObjects, "FEnergy");
                console.log("oFilteredObjects:"+oFilteredObjects);*/
                /*var filter1 = [new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                var oTable_IDE = this.getView().byId("energyConvTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);
                console.log(oBinding_IDE);*/

                 //start Krishnaveni
               /*  var that = this;
                 var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                 var subType =  that.getView().byId("Sub_Type").getSelectedKey(); 
 
                 this.UserInputUnit = txt;
                
                 var filter1 = [new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                 //console.log(filter1);
 
                 var oTable_IDE = that.getView().byId("energyConvTbl");
                 var oBinding_IDE = oTable_IDE.getBinding("items");
                 oBinding_IDE.filter(filter1);
                 console.log(oBinding_IDE);
 
                 var cbUOMConv = that.getView().byId("cbEnergyConvIP");
                 var UOMListModel = that.getView().byId("cbEnergyConvIP").getModel("EnergyConvModel")
 
                 this._getFilterData_EnergyConv(cbUOMConv, UOMListModel, filter1);
 
                 var cbUOMConv2 = that.getView().byId("cbEnergyConvOP");
                 var UOMListModel2 = that.getView().byId("cbEnergyConvOP").getModel("EnergyConvModel");
                 this._getFilterData_EnergyConv(cbUOMConv2, UOMListModel2, filter1);*/

            },
            _getFilterData_KPI_EF: function () {
                var that = this;
                // var subType = that.getView().byId("EF_Type");
                var KPIModel = that.getView().byId("EF_Type").getModel("KPIModel");

                var EFType = this.KPITypeSelected;

                var a = [];
                var b = [];

                var oKPIModelData = KPIModel.getData().results;

                for (var j = 0; j < oKPIModelData.length; j++) {
                    if (oKPIModelData[j].Type === EFType) {
                        for (var i = 0; i < oKPIModelData.length; i++) {
                            if (a.indexOf(oKPIModelData[i].SubType) === -1 && oKPIModelData[i].Type === EFType) {
                                a.push(oKPIModelData[i].SubType);
                            }
                        }
                    }

                }
                console.log(a);
                that.getView().byId("EF_Type").setSelectedKey(a[0]);
                this.KPISubtypeSelected = a[0];

                for (var j = 0; j < a.length; j++) {
                    var object = {};
                    object.SubType = a[j];
                    b.push(object);
                }
                console.log(b);
                that.getView().getModel().setProperty("/Countries", b);
                var oComboBox = that.getView().byId("EF_Type");
                oComboBox.bindAggregation("items",
                    "/Countries", new sap.ui.core.ListItem({
                        text: "{SubType}",
                        key: "{SubType}"
                    }));

                //mickey
                /* oComboBoxKPI.bindAggregation("items",
                     "/Countries", new sap.ui.core.ListItem({
                         text: "{SubType}",
                         key: "{SubType}"
                     }));*/

                //   var filter1 = [new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: txt })];
                /*EFType
                                var oItems = new sap.ui.core.ListItem({
                                    key: "{KPIModel>SubType}",
                                    text: "{KPIModel>SubType}"
                                });
                
                                subType.bindAggregation("items", {
                                    path: 'KPIModel>/results',
                                    template: oItems,
                                    filters: filter1
                                });
                */

                /*
                          var oFilter1 = new sap.ui.model.Filter({
                              filters: [            
                                  new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: EFType }),
                                  new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: a[0] })
  
                              ]  ,and: true          
                          });
                          console.log(oFilter1);
                          var oItems = new sap.ui.core.ListItem({
                              key: "{KPIModel>KPI}",
                              text: "{KPIModel>KPI}"
                          });
  
                          var oComboBoxKPI = that.getView().byId("KPI");                
                          oComboBoxKPI.bindAggregation("items", {
                              path: 'KPIModel>/results',
                              template: oItems,
                              filters: oFilter1
                          });
                  */
                this._getKPIDataforNewEntry();

                this._getEmissionFactorData();

            },
            _getFilterData_Energy: function () {
                var that = this;

                var KPIModel = that.getView().byId("Sub_Type").getModel("EnergyModel");

                var EFType = this.EnergyTypeSelected;

                var a = [];
                var b = [];

                var oKPIModelData = KPIModel.getData().results;

                for (var j = 0; j < oKPIModelData.length; j++) {
                    if (oKPIModelData[j].Type === EFType) {
                        for (var i = 0; i < oKPIModelData.length; i++) {
                            if (a.indexOf(oKPIModelData[i].SubType) === -1 && oKPIModelData[i].Type === EFType) {
                                a.push(oKPIModelData[i].SubType);
                            }
                        }
                    }

                }
                console.log(a);
                that.getView().byId("Sub_Type").setSelectedKey(a[0]);
                this.EnergySubtypeSelected = a[0];
                this.KPISubtypeSelected = a[0]; //mickey
                for (var j = 0; j < a.length; j++) {
                    var object = {};
                    object.SubType = a[j];
                    b.push(object);
                }
                console.log(b);
                that.getView().getModel().setProperty("/Countries", b);
                var oComboBox = that.getView().byId("Sub_Type");
                oComboBox.bindAggregation("items",
                    "/Countries", new sap.ui.core.ListItem({
                        text: "{SubType}",
                        key: "{SubType}"
                    }));


                this._getKPIDataforNewEnergy();

                this._getEnergyTblData();

            },
            _getEnergyTblData: function () {
                var that = this; ``
                // var type = this.EnergyTypeSelected;
                // var subType = this.EnergySubtypeSelected;

                var type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;

                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),
                        new sap.ui.model.Filter({ path: "Subtype", operator: sap.ui.model.FilterOperator.EQ, value1: subType })
                    ], and: true
                });
                console.log(oFilter1);

                var oTable_IDE = that.getView().byId("energyConvTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter([]);
                console.log(oBinding_IDE);
                oBinding_IDE.filter(oFilter1);
                that.getView().byId("energyConvTbl").getModel().refresh(true);

            },
            handleLoadItems:function(evt){
               /* var e = evt;
                var that = this;
                var cbEnergy = this.getView().byId("cbEnergyConvIP");
                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: that.oKPIMeasure})];

                cbEnergy.getBinding("items").filter(filter1);*/
            },
            
            _getFilterData_EnergyConv: function (cbEnergy, EnergyListModel, filter1) {
                let oFilteredObjects=[];
                var that=this;
                //var EnergyListModel = that.getView().byId("cbEnergyConvIP").getModel("EnergyListIPModel");
                let oModel = new sap.ui.model.json.JSONModel();
               // oModel.setData(oFilteredObjects, "FEnergy");
              

                for(let i=0; i<EnergyListModel.oData.results.length;i++){ 
                    if(EnergyListModel.oData.results[i].Measure === that.oKPIMeasure)
                    {
                        console.log(""+EnergyListModel.oData.results[i].Abbreviation);
                        //oModel.setProperty("/Name", EnergyListModel.oData.results[i].Abbreviation);
                        oFilteredObjects.push(EnergyListModel.oData.results[i]);
                    }
                }    
                that.getView().byId("cbEnergyConvIP").getModel("FilterEnergy").setData({"results" : oFilteredObjects}); 
                //oModel.setJSON(JSON.stringify(oFilteredObjects));

                //that.getView().byId("cbEnergyConvIP").setModel(oModel,"FilterEnergy");
                
                //oModel.setData({"results" : oFilteredObjects});
                //that.getView().byId("cbEnergyConvIP").getModel("FilterEnergy").refresh(true);
                
                //oModel.setData( : oFilteredObjects}", "FilterEnergy");
                console.log("oFilteredObjects:"+oFilteredObjects);

                //let oModel1 = new sap.ui.model.json.JSONModel();
                //oModel1.setProperty(oFilteredObjects,"FilterEnergy");
                //this.getView().getModel("EnergyListIPModel").setProperty("/",{"ofp":oFilteredObjects});
                //this.getView().getModel("EnergyListIPModel").setData({"/" : oFilteredObjects});
                //=================================


               /* var filterResult = [];
                var data = this.listData;
                if(cbEnergy.getId().indexOf("cbEnergyConvIP") > -1 && this.getView().byId("energyConvTbl").getItems().length == 1){
                    for(var i=0;i<EnergyListModel.getData().results.length;i++){
                        if(data.results[i].Measure == this.oKPIMeasure){
                            filterResult.push(data.results[i]);
                        }
                    }
                    EnergyListModel.setData({"results" : filterResult});
                    //var model = new sap.ui.model.json.JSONModel({"results" : filterResult});
                    var oItems = new sap.ui.core.Item({
                        key: "{EnergyListIPModel>Abbreviation}",
                        text: "{EnergyListIPModel>Abbreviation}"
                    });
                    cbEnergy.setModel(EnergyListModel, "EnergyListIPModel");
                cbEnergy.bindAggregation("items", {
                    path: 'EnergyListIPModel>/results',
                    template: oItems
                   
                    
                });
                }else{
                var oItems = new sap.ui.core.Item({
                    key: "{EnergyListModel>Abbreviation}",
                    text: "{EnergyListModel>Abbreviation}"
                });
                
                //var data_filter = EnergyListModel.getData().filter( element => element.Measure == that.oKPIMeasure)
               
                
               //var binding = cbEnergy.getBinding("items");
                //binding.filter(filter1);
                //cbEnergy.getBinding("items").aFilters = filter1;
              
               
                //cbEnergy.getBinding("items").filter(filter1);
                //cbEnergy.bindItems("EnergyListModel>/results",oItems, null, filter1);
                cbEnergy.setModel(EnergyListModel, "EnergyListModel");
                cbEnergy.bindAggregation("items", {
                    path: 'EnergyListModel>/results',
                    template: oItems
                   
                    
                });
            }
                
                */
                
            },
            _getKPIDataforNewEnergy: function () {
                var that = this;
                var EnergyModel = that.getView().byId("Sub_Type").getModel("EnergyModel");

                // var type = this.EnergyTypeSelected;
                //var subType = this.EnergySubtypeSelected ;
                var type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;
                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: subType })

                    ], and: true
                });
                console.log(oFilter1);
                var oItems = new sap.ui.core.ListItem({
                    key: "{EnergyModel>KPI}",
                    text: "{EnergyModel>KPI}"
                });

                var oComboBoxKPI = that.getView().byId("KPI_Energy");
                oComboBoxKPI.bindAggregation("items", {
                    path: 'EnergyModel>/results',
                    template: oItems,
                    filters: oFilter1
                });
            },
            onChange_Energy: function (oEvent) {
                var that = this;
                var selText = oEvent.getParameter("selectedItem").getText(); //Subtype
                //this.EnergySubtypeSelected = selText;
                this.KPISubtypeSelected = selText;

                this._getKPIDataforNewEnergy();
                this._getEnergyTblData();
            },
            onSelect_Radiobutton_EF: function (oEvent) {
                var that = this;

                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.KPITypeSelected = txt;

                console.log("txt:" + txt);
                this._getFilterData_KPI_EF();
            },

            _getKPIDataforNewEntry: function () {
                var that = this;
                var KPIModel = that.getView().byId("EF_Type").getModel("KPIModel");

                var type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;
                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: subType })

                    ], and: true
                });
                console.log(oFilter1);
                var oItems = new sap.ui.core.ListItem({
                    key: "{KPIModel>KPI}",
                    text: "{KPIModel>KPI}"
                });

                var oComboBoxKPI = that.getView().byId("KPI");
                oComboBoxKPI.bindAggregation("items", {
                    path: 'KPIModel>/results',
                    template: oItems,
                    filters: oFilter1
                });
            },
            handleExcel_Template: function (event) {

                window.open("./documents/Template1.csv");

            },
            handleSortButtonPressed: function () {
                this.getViewSettingsDialog("com.techm.sustainabilityui.fragment.SortDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            getViewSettingsDialog: function (sDialogFragmentName) {
                var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

                if (!pDialog) {
                    pDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    });
                    this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;
            },
            onSearch: function (oEvent) {

                var aFilter = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery) {
                    aFilter.push(new Filter("Type", FilterOperator.Contains, sQuery));
                }

                // filter binding
                var oList = this.getView().byId("tableId");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);

            },
            formatEditField: function (isNewRow, isEditableRow, isExistingRow) {
                if(isNewRow||isEditableRow){
                    return true;
                }   
                 else if(isExistingRow) {
                     return false;
                 }  
                 
             },
             formatDisplayField: function (isNewRow, isEditableRow, isExistingRow) {
                if(isNewRow||isEditableRow){
                    return false;
                }           
                 else if(isExistingRow) {
                     return true;
                 }  
                 
             },
             formatPKeyField: function (isNewRow, isEditableRow, isExistingRow) {
                if(isNewRow){
                    return false;
                }           
                 else  if(isExistingRow ||isEditableRow){
                     return true;
                 }  
                 
             },
             onSelect_Radiobutton_PrefixTypes:function (oEvent) {
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.PrefixTypesSelected = txt;

                if(txt === "Prefix Types"){
                    this.getView().byId("prefixTypesTbl").setVisible(true);            
                    this.getView().byId("prefixTypes").setVisible(true);
                    this.getView().byId("prefixValues").setVisible(false);

                    //this.getView().byId("btn1").setVisible(false);//Edit
                    //this.getView().byId("btn2").setVisible(false);//Reset
                    
                }else if(txt === "Prefix Values"){
                    this.getView().byId("prefixTypesTbl").setVisible(false);            
                    this.getView().byId("prefixTypes").setVisible(false);
                    this.getView().byId("prefixValues").setVisible(true);

                    //this.getView().byId("btn1").setVisible(true);//Edit
                    //this.getView().byId("btn2").setVisible(true);//Reset
                }
             },
             onSelect_Radiobutton_General:function (oEvent) {
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.UoMTypeSelected = txt;

                if(txt === "Measure Types"){
                    this.getView().byId("generalTbl").setVisible(true);            
                    this.getView().byId("meaType").setVisible(true);
                    this.getView().byId("uomValues").setVisible(false);

                    this.getView().byId("btn1").setVisible(false);//Edit
                    this.getView().byId("btn2").setVisible(false);//Reset
                    
                }else if(txt === "UoM Values"){
                    this.getView().byId("generalTbl").setVisible(false);            
                    this.getView().byId("meaType").setVisible(false);
                    this.getView().byId("uomValues").setVisible(true);

                    this.getView().byId("btn1").setVisible(true);//Edit
                    this.getView().byId("btn2").setVisible(true);//Reset
                }

               /*this.getView().byId("generalTbl").setVisible(true);            
                this.getView().byId("yearRBtn").setVisible(false);
                this.getView().byId("yearAlign").setVisible(false);
                this.getView().byId("generalYearTblAlign").setVisible(false);
                this.getView().byId("generalYearTbl").setVisible(false);
                if(this.getView().byId("GeneralRBtn").getSelectedButton().getText() === "Measure Type"){
                    this.getView().byId("generalTbl").setVisible(true);            
                    this.getView().byId("yearRBtn").setVisible(false);
                    this.getView().byId("yearAlign").setVisible(false);
                    this.getView().byId("generalYearTblAlign").setVisible(false);
                    this.getView().byId("generalYearTbl").setVisible(false);
                }else if(this.getView().byId("GeneralRBtn").getSelectedButton().getText() === "Fiscal Year"){
                    this.getView().byId("generalTbl").setVisible(false);            
                    this.getView().byId("yearRBtn").setVisible(true);
                    this.getView().byId("yearAlign").setVisible(true);
                    this.getView().byId("generalYearTblAlign").setVisible(true);
                    this.getView().byId("generalYearTbl").setVisible(true);
                }*/
             },
             onSelect_Radiobutton_Year:function (oEvent) {    
                var that=this;
                this.getView().byId("generalTbl").setVisible(false);            
                this.getView().byId("yearRBtn").setVisible(true);
                this.getView().byId("yearAlign").setVisible(true);
                this.getView().byId("generalYearTblAlign").setVisible(true);
                this.getView().byId("generalYearTbl").setVisible(true);

                var kpiItems = that.getView().byId("generalYearTbl").getItems();
                var kpiIndex = that.getView().byId("generalYearTbl").getItems().length - 1;
                var KPIModel = this.getView().byId("generalYearTbl").getModel("yearModel");
                //var val = "";
                
                //var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
               
                var Industry = this.GlobalIndustryModel.getData().Industry; 
                var filter1 = [new sap.ui.model.Filter({ path: "Vertical", operator: sap.ui.model.FilterOperator.EQ, value1: Industry })]; 

                               

              /*  var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Vertical", operator: sap.ui.model.FilterOperator.EQ, value1: Industry }),
                        new sap.ui.model.Filter({ path: "YearA", operator: sap.ui.model.FilterOperator.EQ, value1: txt })
                    ]
                });*/

                var oTable_IDE = that.getView().byId("generalYearTbl");
                var oBinding_IDE = oTable_IDE.getBinding("items");
                oBinding_IDE.filter(filter1);
                console.log(oBinding_IDE);


                for (var i = 0; i < KPIModel.getData().results.length; i++) {
                    if (KPIModel.getData().results[i].isExistingRow) {
                       var val = kpiItems[i].mAggregations.cells[0].mAggregations.items[1].mProperties.value;
                        console.log("val:"+val);
                    }
                }

            },

            callBindings: function (){
             var that = this;
            //   var oTable =  that.getView().byId("firstTabl");
              //column list item creation
			// var oTemplate = new sap.m.ColumnListItem({
			// 	cells: [new sap.m.Text({
			// 		text: "{Description}"
			// 	}), new sap.m.Text({
			// 		text: "{id}"
			// 	}),
            //     new sap.m.Text({
			// 		text: "{ParentNodeID}"
			// 	})
            // ]
			// });

            var oTable = that.getView().byId("firstTabl", ({
                columns : [ new sap.ui.table.Column({
                label : "Description",
                template : "Description"
                }), new sap.ui.table.Column({
                label : "NodeID",
                template : "id"
                }),
                new sap.ui.table.Column({
                    label : "ParentNodeID",
                    template : "ParentNodeID"
                    })
            
            ],
                selectionMode : sap.ui.table.SelectionMode.Single,
                enableColumnReordering : true,
                }));

            // var sServiceUrl = "/catalog";
		//Adding service to the odata model
			var oModel = this.getOwnerComponent().getModel("dataModel");
            // new sap.ui.model.odata.ODataModel(sServiceUrl, false);
		//Setting model to the table
        oTable.setModel(oModel);
			//navigation service binding
 oTable.bindRows({
    path : "/Standards_Module",
    parameters : {
    expand : "toStandards_Module",
    navigation : {
    'Standards_Module': 'toStandards_Module'
    },
    countMode: 'Inline',
    treeAnnotationProperties : 
        {
           hierarchyLevelFor : 'HierarchyLevel',
           hierarchyNodeFor : 'id',
           hierarchyParentNodeFor : 'ParentNodeID',
           hierarchyDrillStateFor : 'DrillState'
       }
    }
    });

            },
            onExportExcelMeasures: function (evt) {
                //General tab - Measures
                this._importMeasures(evt.getParameter("files") && evt.getParameter("files")[0]);
            },
            _importMeasures: function (file) {                

                var that = this;
                var excelData = {};
                this.MeasureModel = new sap.ui.model.json.JSONModel();
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        });                                              
                        
                        that.MeasureModel.setData(excelData);
                        that.MeasureModel.refresh(true);
                        console.log("measure model:"+that.MeasureModel);

                        if(that.MeasureModel.getData().length>0){
                            for(var i=0;i<that.MeasureModel.getData().length;i++){
                                var jsonSustain =
                                {
                                    "MeasureType": that.MeasureModel.getData()[i].MeasureType,
                                    "InputUom": that.MeasureModel.getData()[i].InputUom,
                                    "OutputUoM": that.MeasureModel.getData()[i].ExpectedUoM
                                }
                               that.calloData_MeasureValidation(jsonSustain);
                               console.log("data:"+that.MeasureModel.getData()[i]);
                               sap.m.MessageToast.show('The details submitted Successfully!!!');
                            }
                        }
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            },
            calloData_MeasureValidation: function (jsonSustain){
                //Measure Validation
                var that = this;
                //start
                this.batchChanges = [];
                this.batchModel = this.getOwnerComponent().getModel("dataModel");
                this.batchModel.setUseBatch(true);
                var OData = this.getOwnerComponent().getModel("dataModel");

                OData.create('/Measure_Validation', jsonSustain, null, function () {
                    //sap.m.MessageToast.show('The details submitted Successfully!!!');
                    sap.m.MessageBox.show("Success!!");
                }, function () {
                    alert("Create failed");
                });

                //end
                /*var OData = that.getOwnerComponent().getModel("dataModel");

                var json =jsonSustain;
               

                if (json !== null || json !== undefined || json !== "") {                    
                    var hanaTableName = "/Measure_Validation";
                    that.batchModel.create(hanaTableName, json, {
                        method: "POST",
                        success: function (data) {},
                        error: function (e) {                        
                            console.log("error:"+JSON.parse(e.responseText).error.message.value);
                            if(JSON.parse(e.responseText).error.code != '202'){
                                sap.m.MessageBox.show(JSON.parse(e.responseText).error.message.value, {title: "Error"});
                            }                        
                        }
                    });
                }   */
                            
            },
            handleDownloadExcel: function (event) {                
                window.open("./documents/Measures.xlsx");
            },
            handleSelectionFinish_PrefixKPI: function (oEvent) {
                this.socialPrefix="";
                var selectedItems = oEvent.getParameter("selectedItems");
                var messageText = "";

                for (var i = 0; i < selectedItems.length; i++) {
                    messageText += selectedItems[i].getText();
                    if (i != selectedItems.length - 1) {
                        messageText += ",";
                    }
                }  
                sap.m.MessageToast.show("test:"+messageText);   
                this.socialPrefix =  messageText;
            },
            parseBool: function(val){

            },
            onPressSearch: function (event){
                //call oData
                this._callTemplate1();
            },
            _callTemplate1: function () {                
                var that = this;
                
                this.EnvModel = new sap.ui.model.json.JSONModel();
                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Division", operator: sap.ui.model.FilterOperator.EQ, value1: "Bharti Airtel Limited" }),
                        new sap.ui.model.Filter({ path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "fiscal", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: "NETWORK TRAFFIC"}),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: "Voice & Data Traffic" }),
                        new sap.ui.model.Filter({ path: "KPI", operator: sap.ui.model.FilterOperator.EQ, value1: "3G Data Traffic" })                       
                    ], and: true
                });
                
                
                that.total=0;
                var OData = this.getOwnerComponent().getModel("dataModel");    
                var url1= "/Environment_Report_Telecom"; 
                that.valArray = [];
                OData.read(url1, {
                    filters: [oFilter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.EnvModel.setData(data);
                        var length = data.results.length;
                        console.log("msg length:"+length);
                       for (var i = 0; i < length; i++) {
                            that.valArray.push(that.EnvModel.getData().results[i].Value);
                            that.total+=parseInt(that.EnvModel.getData().results[i].Value)
                        }
                        console.log("value:-"+that.valArray);
                        console.log("total:-"+that.total);
                    },
                    error: function (err) {
                        
                    }
                });
            },
            handlePrint: function (oEvent) {
                var that = this;
                this.getView().byId("myText");
                console.log("msg");
                
                //get values of division table in an array
                var oTable_Division = this.getView().byId("tblDivision");                
                var oBinding_Div = oTable_Division.getBinding("items");
                console.log("msg:"+oBinding_Div);
                var length = oBinding_Div.oList.length
                var divArray = [];
                for (let i=0;i<length;i++){
                    divArray.push(oBinding_Div.oList[i].Division);
                }
                console.log("div:"+divArray);                

                var ohtmlModel = new sap.ui.model.json.JSONModel({
                    HTML : "<h3>subheader</h3>" +
                    "<p>link: <a href=\"//www.sap.com\" style=\"color:green; font-weight:600;\">link to sap.com</a> - links open in a new window.</p>" + divArray +
                    "<p>paragraph: <strong>strong</strong> and <em>emphasized</em>.</p>" + 
                    "<p>list:</p>" + that.valArray +
                    "<p>Total:</p>" + that.total +                    
                    "<ul><li>list item 1</li><li>list item 2<ul><li>sub item 1</li><li>sub item 2</li></ul></li></ul>" +
                    "<p>pre:</p><pre>abc    def    ghi</pre>" +
                    "<p>code: <code>var el = document.getElementById(\"myId\");</code></p>" +
                    "<p>cite: <cite>a reference to a source</cite></p>" +
                    "<dl><dt>definition:</dt><dd>definition list of terms and descriptions</dd>" +
                    "<p>Lorem ipsum dolor sit amet" +
                    "consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate." + 
                    "Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue.</p> "+
                    "<p><img style=\"float: left; padding-right: 1em;\" src=\"http://monliban.org/images/1473838236_274706_l_srgb_s_gl_465881_large.jpg\" width=\"304\" height=\"181\">" +
                    "<span style=\"font-size: 10.5pt; font-family: sans-serif; color: #0070c0;\">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style=\"font-size: 10.5pt; font-family: sans-serif; color: black;\"> " +
                    "Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. " +
                    "Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>" +
                    "<p><span>Fusce dapibus sodales ornare. " +
                    "Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. " +
                    "Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>" +
                    "<ul>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Phasellus sodales enim nec sapien commodo mattis.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Integer laoreet eros placerat pharetra euismod.</span></li>" +
                    "</ul>" +
                    "<p style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #c00000;\">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. " +
                    "Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>" +
                    "<ol>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Proin id eros vel libero maximus dignissim ac et velit.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>" +
                    "</ol>" +
                    "<p style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, " +
                    "ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>" +
                    "<p style=\"text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;\" ><em><span style=\"font-family: sans-serif; color: #a6a6a6;\">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit</span></em></p>" +
                    "<p style=\"text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;\" ><span style=\"font-family: sans-serif; color: #353535;\">-</span> <strong><span style=\"font-family: sans-serif; color: #353535;\">Sed in lacus dolor.</span></strong></p>" +
                    "<p>paragraph: <strong>strong</strong> and <em>emphasized</em>.</p>" +
                    "<p>list:</p>" +
                    "<ul><li>list item 1</li><li>list item 2<ul><li>sub item 1</li><li>sub item 2</li></ul></li></ul>" +
                    "<p>pre:</p><pre>abc    def    ghi</pre>" +
                    "<p>code: <code>var el = document.getElementById(\"myId\");</code></p>" +
                    "<p>cite: <cite>a reference to a source</cite></p>" +
                    "<dl><dt>definition:</dt><dd>definition list of terms and descriptions</dd>" +
                    "<p>Lorem ipsum dolor sit amet" +
                    "consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate." + 
                    "Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue.</p> "+
                    "<p><img style=\"float: left; padding-right: 1em;\" src=\"http://monliban.org/images/1473838236_274706_l_srgb_s_gl_465881_large.jpg\" width=\"304\" height=\"181\">" +
                    "<span style=\"font-size: 10.5pt; font-family: sans-serif; color: #0070c0;\">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style=\"font-size: 10.5pt; font-family: sans-serif; color: black;\"> " +
                    "Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. " +
                    "Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>" +
                    "<p><span>Fusce dapibus sodales ornare. " +
                    "Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. " +
                    "Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>" +
                    "<ul>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Phasellus sodales enim nec sapien commodo mattis.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Integer laoreet eros placerat pharetra euismod.</span></li>" +
                    "</ul>" +
                    "<p style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #c00000;\">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. " +
                    "Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>" +
                    "<ol>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Proin id eros vel libero maximus dignissim ac et velit.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>" +
                    "</ol>" +
                    "<p style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, " +
                    "ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>" +
                    "<p style=\"text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;\" ><em><span style=\"font-family: sans-serif; color: #a6a6a6;\">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit</span></em></p>" +
                    "<p style=\"text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;\" ><span style=\"font-family: sans-serif; color: #353535;\">-</span> <strong><span style=\"font-family: sans-serif; color: #353535;\">Sed in lacus dolor.</span></strong></p>" +
                    "<p>paragraph: <strong>strong</strong> and <em>emphasized</em>.</p>" +
                    "<p>list:</p>" +
                    "<ul><li>list item 1</li><li>list item 2<ul><li>sub item 1</li><li>sub item 2</li></ul></li></ul>" +
                    "<p>pre:</p><pre>abc    def    ghi</pre>" +
                    "<p>code: <code>var el = document.getElementById(\"myId\");</code></p>" +
                    "<p>cite: <cite>a reference to a source</cite></p>" +
                    "<dl><dt>definition:</dt><dd>definition list of terms and descriptions</dd>" +
                    "<p>Lorem ipsum dolor sit amet" +
                    "consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate." + 
                    "Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue.</p> "+
                    "<p><img style=\"float: left; padding-right: 1em;\" src=\"http://monliban.org/images/1473838236_274706_l_srgb_s_gl_465881_large.jpg\" width=\"304\" height=\"181\">" +
                    "<span style=\"font-size: 10.5pt; font-family: sans-serif; color: #0070c0;\">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style=\"font-size: 10.5pt; font-family: sans-serif; color: black;\"> " +
                    "Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. " +
                    "Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>" +
                    "<p><span>Fusce dapibus sodales ornare. " +
                    "Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. " +
                    "Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>" +
                    "<ul>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Phasellus sodales enim nec sapien commodo mattis.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Integer laoreet eros placerat pharetra euismod.</span></li>" +
                    "</ul>" +
                    "<p style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #c00000;\">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. " +
                    "Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>" +
                    "<ol>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Proin id eros vel libero maximus dignissim ac et velit.</span></li>" +
                    "<li style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>" +
                    "</ol>" +
                    "<p style=\"font-size: 10pt; font-family: Calibri, sans-serif;\"><span style=\"font-family: sans-serif; color: #353535;\">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, " +
                    "ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>" +
                    "<p style=\"text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;\" ><em><span style=\"font-family: sans-serif; color: #a6a6a6;\">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit</span></em></p>" +
                    "<p style=\"text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;\" ><span style=\"font-family: sans-serif; color: #353535;\">-</span> <strong><span style=\"font-family: sans-serif; color: #353535;\">Sed in lacus dolor.</span></strong></p>"

                });
                this.getView().setModel(ohtmlModel);
               
                var modulePath = $.sap.getModulePath("print", "/image/");
                //var headertable1 = modulePath + "<caption style='color:green;font-weight: bold;font-size: large;'>Student Details</caption>"   
                var headertable1 = modulePath + this.getView().byId("myText").getHtmlText();
                var wind = window.open("", "prntExample");
                wind.document.write(headertable1);
                setTimeout(function () {
                 wind.print();
                 wind.close();
                }, 1000);
               },
               

            initRichTextEditor: function (bIsTinyMCE5) {
                var that = this,
                    sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
                    '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
                    'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ' +
                    '<p style="margin: 0in 0in 11.25pt; text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><img style="float: left; padding-right: 1em;" src="http://monliban.org/images/1473838236_274706_l_srgb_s_gl_465881_large.jpg" width="304" height="181">' +
                    '<span style="font-size: 10.5pt; font-family: sans-serif; color: #0070c0;">Phasellus imperdiet metus est, in luctus erat fringilla ut. In commodo magna justo, sit amet ultrices ipsum egestas quis.</span><span style="font-size: 10.5pt; font-family: sans-serif; color: black;"> ' +
                    'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. <strong>Aenean quam libero</strong>, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. <strong><em>Aliquam semper neque eu aliquam dictum</em></strong>. ' +
                    'Nulla in convallis diam. Fusce molestie risus nec posuere ullamcorper. Fusce ut sodales tortor. <u>Morbi eget odio a augue viverra semper.</u></span></p>' +
                    '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Fusce dapibus sodales ornare. ' +
                    'Nullam ac mauris felis. Sed tempor odio diam, nec ullamcorper lacus laoreet vitae. Aenean quam libero, varius eu ex eu, aliquet fermentum orci. Donec eget ante sed enim pretium tempus. Nullam laoreet metus ac enim placerat, nec tempor arcu finibus. ' +
                    'Curabitur nec pretium odio, sed auctor felis. Nam eu neque faucibus, pharetra purus id, congue elit. Phasellus neque lectus, gravida at cursus at, pretium eu lorem. </span></p>' +
                    '<ul>' +
                    '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Nulla non elit hendrerit, auctor arcu sit amet, tempor nisl.</span></li>' +
                    '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Morbi sed libero pulvinar, maximus orci et, hendrerit orci.</span></li>' +
                    '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Phasellus sodales enim nec sapien commodo mattis.</span></li>' +
                    '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Integer laoreet eros placerat pharetra euismod.</span></li>' +
                    '</ul>' +
                    '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #c00000;">Ut vitae commodo ante. Morbi nibh dolor, ullamcorper sed interdum id, molestie vel libero. ' +
                    'Proin volutpat dui eget ipsum scelerisque, a ullamcorper ipsum mattis. Cras sed elit sit amet diam convallis vehicula vitae ut nisl. Ut ornare dui ligula, id euismod lectus eleifend at. Nulla facilisi. In pharetra lectus et augue consequat vestibulum.</span></p>' +
                    '<ol>' +
                    '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Proin id eros vel libero maximus dignissim ac et velit.</span></li>' +
                    '<li style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">In non odio pharetra, dapibus augue quis, laoreet felis.</span></li>' +
                    '</ol>' +
                    '<p style="font-size: 10pt; font-family: Calibri, sans-serif;"><span style="font-family: sans-serif; color: #353535;">Donec a consectetur libero. Donec ut massa justo. Duis euismod varius odio in rhoncus. Nullam sagittis enim vel massa tempor, ' +
                    'ut malesuada libero mollis. Vivamus dictum diam diam, quis rhoncus ex congue vel.</span></p>' +
                    '<p style="text-align: center; font-size: 10pt; font-family: Calibri, sans-serif;" align="center"><em><span style="font-family: sans-serif; color: #a6a6a6;">"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."</span></em></p>' +
                    '<p style="text-align: right; font-size: 10pt; font-family: Calibri, sans-serif;" align="right"><span style="font-family: sans-serif; color: #353535;">-</span> <strong><span style="font-family: sans-serif; color: #353535;">Sed in lacus dolor.</span></strong></p>';
                sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/library"],
                    function (RTE, library) {
                        var EditorType = library.EditorType;
                        that.oRichTextEditor = new RTE("myRTE", {
                            editorType: bIsTinyMCE5 ? EditorType.TinyMCE5 : EditorType.TinyMCE6,
                            width: "100%",
                            height: "600px",
                            customToolbar: true,
                            showGroupFont: true,
                            showGroupLink: true,
                            showGroupInsert: true,
                            value: sHtmlValue,
                            ready: function () {
                                bIsTinyMCE5 ? this.addButtonGroup("styleselect").addButtonGroup("table") : this.addButtonGroup("styles").addButtonGroup("table");
                            }
                        });
    
                       // that.getView().byId("idVerticalLayout").addContent(that.oRichTextEditor);
                });
            }

        });
    });
	