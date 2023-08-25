sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/techm/sustainabilityui/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.Social", {
            formatter:formatter,
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.OData = this.getOwnerComponent().getModel("dataModel");

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getTarget("Social").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            },
            handleRouteMatched : function(evt){ 
                this.GlobalIndustryModel = sap.ui.getCore().getModel("GlobalIndustryModel");
                console.log("on before Social:"+this.GlobalIndustryModel.getData());

                this.year = "";
                this.prefixCount = "";

                var that=this;
                var Industry = this.GlobalIndustryModel.getData().Industry;                
                if(Industry === "Telecom"){
                    that.getView().byId("box0").setSelectedKey("Bharti Airtel Limited");
                    that.getView().byId("box1").setSelectedKey("Maharashtra");
                    that.getView().byId("box2").setSelectedKey("");
               }else{
                    that.getView().byId("box0").setSelectedKey("");
                    that.getView().byId("box1").setSelectedKey("");
                    that.getView().byId("box2").setSelectedKey("");
               }
                this.onPressGo(); //odata service calls
                
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
            onPressBack: function (Event) {
                //navigates back
                this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
            },
            onPressGo: function (event) {
                var that = this;
                this.KPIListModel = new sap.ui.model.json.JSONModel();

                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                // var OData = this.getOwnerComponent().getModel("dataModel");

                this.OData.read("/KPIList_Social_Ports", {

                    success: function (data, oResponse) {
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().byId("KPISubType").setModel(ListModel, "KPIModel"); //SubType combo box
                        that.getView().byId("KPI").setModel(ListModel, "KPIModel");   //KPI combo box
                        that.getView().byId("prefixValues").setModel(ListModel, "KPIModel");   //prefixValues combo box
                        that.KPIListModel.setData(data);
                        console.log(that.KPIListModel);
                        that._getKPITypes();
                        that._getKPISubTypes();
                        that.getView().byId("rbgKPITypes").setSelectedIndex(0);
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();

                    }
                });

                this.OData.read("/Constants", {
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

                //Division
                var Value = this.GlobalIndustryModel.getData().Industry;                
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                //this.OData.read("/Division_Telecom", {                    
                this.OData.read("/Division", {                    
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().setModel(ListModel, "divisionModel");

                        var oTable_Division = that.getView().byId("box0");                
                        var oBinding_Div = oTable_Division.getBinding("items");
                        oBinding_Div.filter(filter1);                        
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

                //Location
                var Value = this.GlobalIndustryModel.getData().Industry;                
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });

                //this.OData.read("/Location_Telecom", {                    
                this.OData.read("/Location", {                    
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().setModel(ListModel, "locationModel");

                        var oTable_Location = that.getView().byId("box1");                
                        var oBinding_Loc = oTable_Location.getBinding("items");
                        oBinding_Loc.filter(filter1);
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

                this.calloData_Year(); 

            },
            calloData_Year: function (){
                //Year
                var that=this;
                var OData = this.getOwnerComponent().getModel("dataModel");
                var Value = this.GlobalIndustryModel.getData().Industry;                
                var filter1 = new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               
               
                //this.OData.read("/Year_telecom", {                    
                this.OData.read("/Year_Module", {                    
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                       // that.year = data.results.YearL;
                        that.getView().setModel(ListModel, "yearModel");                        
                        //that.getView().byId("box2").setModel(ListModel, "yearModel");

                        var oTable_Year = that.getView().byId("box2");                
                        var oBinding_Year = oTable_Year.getBinding("items");
                        oBinding_Year.filter(filter1);
                       // that.getView().byId("box2").setSelectedKey(oBinding_Year.oList[oBinding_Year.aIndices[0]].fiscal);

                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });       
            },
            onChangeYear: function (event){
                //Display year From & To date
                var a = this.getView().byId("box2").getModel("yearModel").getData().results;
                var b = this.getView().byId("box2").getSelectedKey();
                var c = "";
                var s = "", e="";
                for(var i=0;i<a.length;i++){
                    if(a[i].fiscal === b){
                       // console.log("StartDate:"+a[i].StartDate);
                        s = a[i].StartDate
                        e = a[i].EndDate
                        c = a[i].YearA
                    }
                }                
               // sap.m.MessageToast.show(""+s+" to "+e);
                this.getView().byId("dateDisp").setText("("+s+" to "+e+")");
                this.StartDate=s;
                this.EndDate=e;
                this.yearA=c;

                var split = s.split('-');
                var element1 = split[0];
                var element2 = split[1];
                var element3 = split[2];                
                console.log("element2:"+element2);

                this.year = split[2];
                
                var split1 = e.split('-');
                var element4 = split1[0];
                var element5 = split1[1];
                var element6 = split1[2];                
                console.log("element5:"+element5);

                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                //monthNames[d.getMonth()]

                var a1 = new Date(s);
                var a2 = new Date(s).getMonth();
                var a3 = new Date(e).getMonth();
                console.log("startDate:"+monthNames[a2]);
                console.log("endDate:"+monthNames[a3]);
                console.log("m1:"+a2);
                console.log("m2:"+a3);
                //start
                //var d1 = new Date(2015, 10, 27);
                //var d2 = new Date(2016, 11, 27);                
                var d1 = new Date(parseInt(element3), parseInt(a2), parseInt(element1));
                var d2 = new Date(parseInt(element6), parseInt(a3), parseInt(element4));
                
                var ydiff = d2.getYear() - d1.getYear();
                var mdiff = d2.getMonth() - d1.getMonth();
                
                var diff = (ydiff*12 + mdiff);
                var array=[];
                for(var i = 0 ; i<=diff;i++){
                    if(i==0)
                        d1.setMonth(d1.getMonth() -1);
                    else
                        d1.setMonth(d1.getMonth() + 1);
                        
                        array[i]= moment(d1).format("MMMM");
                       // this.monthArr[i]= moment(d1).format("MMMM");
                        //this.yearArr[i]= moment(d1).format("YYYY");                       
                }               

                //start
                let start = new Date(element3, parseInt(a2), element1);  // 01 Nov 2022
                let end   = new Date(element6, parseInt(a3), element4); // 20 Feb 2023 
                var lang = 'en'
               // let start = new Date(2022, 10, 1);  // 01 Nov 2022
                //let end   = new Date(2023,  1, 20); // 20 Feb 2023 
                let d = new Date(start.getFullYear(), start.getMonth());
                let months = [];
                this.monthArr = [];
                this.yearArr = [];
                while (d <= end) {
                    months.push(d.toLocaleString(lang,{month:'long'}));
                    this.monthArr.push(d.toLocaleString(lang,{month:'long'}));
                   // console.log("loop:"+d.toLocaleString(lang,{year:'long'}));
                    this.yearArr.push(d.toLocaleString(lang,{year:'numeric'}));
                    d.setMonth(d.getMonth() + 1);
                }
                console.log("months before:"+months); 
                //end
                //remove duplicate months               
                if(element2 === element5 & months.length > 12){
                    if (months != null && months != undefined && months.length > 0) {
                        var removed = months.splice(months.length - 1, 1);
                        console.log("months removed:"+removed); 

                  }
                }                        
                console.log("months after:"+months);
                //end

                var jsondataMonth = {
                    items: months
                };
                var jsonModel1 = new sap.ui.model.json.JSONModel();
                jsonModel1.setData(jsondataMonth);
                console.log(jsondataMonth);

                var oComboBox = this.getView().byId("month");
                oComboBox.setModel(jsonModel1);

                oComboBox.bindAggregation("items"
                    , "/items", new sap.ui.core.ListItem({
                        text: "{}",
                        key: "{}"
                    }));       
            },
            _getKPITypes: function () {
                var types = [];
                var KPIListModelData = this.KPIListModel.getData().results;
                for (var i = 0; i < KPIListModelData.length; i++) {
                    if (types.indexOf(KPIListModelData[i].Type) === -1) {
                        types.push(KPIListModelData[i].Type);
                    }
                }
                console.log("Type:" + types);
                var jsondata = {
                    items: types
                };
                var jsonModel = new sap.ui.model.json.JSONModel();
                jsonModel.setData(jsondata.items);
                var oRadioBtn = this.getView().byId("rbgKPITypes");
                oRadioBtn.setModel(jsonModel, "KPITypeModel");
                console.log(jsonModel);
                this.KPITypeSelected = jsonModel.getData()[0];
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
               // this._getPrefixs();
                //this.calloData_Prefix_Types();//Prefix
            },
            //get KPIs
            _getKPIs: function () {
                var that = this;
                var KPIModel = that.getView().byId("KPISubType").getModel("KPIModel");

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
                var sample =
                oComboBoxKPI.bindAggregation("items", {
                    path: 'KPIModel>/results',
                    template: oItems,
                    filters: oFilter1
                });
                
                this.KPI = oComboBoxKPI.getFirstItem().getKey();                

                oComboBoxKPI.setSelectedKey(oComboBoxKPI.getFirstItem().getKey()); //set the KPI combo box with first KPI
                this._populateKPITableData();
            },
            _getPrefixs: function () {
                var that = this;
                var KPIModel = that.KPIListModel.getData().results;

                var type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;
                var kpi = this.KPI;
                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: type }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: subType }),
                        new sap.ui.model.Filter({ path: "KPI", operator: sap.ui.model.FilterOperator.EQ, value1: kpi })
                    ], and: true
                });
                console.log(oFilter1);

                var oItems = new sap.ui.core.ListItem({
                    key: "{KPIModel>Prefix}",
                    text: "{KPIModel>Prefix}"
                });
                var oComboBoxPrefix = that.getView().byId("prefixValues");
                
                oComboBoxPrefix.bindAggregation("items", {
                    path: 'KPIModel>/results',
                    template: oItems,
                    filters: oFilter1
                });

                this.prefix = oComboBoxPrefix.getFirstItem().getKey();                

               // oComboBoxPrefix.setSelectedKey(oComboBoxPrefix.getFirstItem().getKey()); 
               
            },

            _hideAllTemplate: function () {
                this.getView().byId("SocialTableA").setVisible(false);
                this.getView().byId("SocialTableB").setVisible(false);
                this.getView().byId("SocialTableC").setVisible(false);
                this.getView().byId("SocialTableD").setVisible(false);
                this.getView().byId("SocialTableE").setVisible(false);
                this.getView().byId("SocialTableF").setVisible(false);
                this.getView().byId("SocialTableG").setVisible(false);
                this.getView().byId("SocialTableH").setVisible(false);
                this.getView().byId("SocialTableI").setVisible(false);
                this.getView().byId("SocialTableJ").setVisible(false);
                this.getView().byId("SocialTableK").setVisible(false);
                this.getView().byId("SocialTableL").setVisible(false);
                //this.getView().byId("SocialTableM").setVisible(false);
            },
            _populateKPITableData: function () {
                var that = this;
                //  var OData = this.getOwnerComponent().getModel("dataModel");

                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Division", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box0").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "fiscal", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: "" + this.KPITypeSelected }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("KPISubType").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "KPI", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("KPI").getSelectedKey() })
                    ], and: true
                });
                console.log(oFilter1);
                var oTableName = "/SocialTableA";

               /* this._getKPITemplate(); //get the selected template
                console.log(this.template);

                var oTableName = "/SocialTableA";
                this._hideAllTemplate();
                
                var templateSuffix = this.template.substring(this.template.length - 1);
                var tableName = "SocialTable" + templateSuffix;
                var colHeaderName = "ColHeaderSocialTable" + templateSuffix;

                this.getView().byId(tableName).setVisible(true);
                if(tableName !== "SocialTableL"){
                    this.getView().byId(colHeaderName).setText(this.prefix);   
                }
                var oTableID = this.getView().byId(tableName);
                this._callTemplate1(oFilter1, oTableName, oTableID);*/

                //start 

                console.log(oFilter1);
                ///check for template...mickey
                this._getKPITemplate();
                console.log(this.template);               


                //switch stmt
                //var oTableName = "/" + this.GlobalIndustryModel.getData().TransactionTable;
                var oTableName = "/SocialTableA";
                     
                switch (this.template) {
                    case "Table A":                        
                        var templateSuffix = this.template.substring(this.template.length - 1);
                        var tableName = "SocialTable" + templateSuffix;
                        var colHeaderName = "ColHeaderSocialTable" + templateSuffix;

                        this.getView().byId(tableName).setVisible(true);
                        if(tableName !== "SocialTableL"){
                            this.getView().byId(colHeaderName).setText(this.prefix);   
                        }
                        var oTableID = this.getView().byId("SocialTableA");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        that.getView().byId("SocialTableA").setVisible(true);
                        that.getView().byId("SocialTableB").setVisible(false);
                        that.getView().byId("SocialTableC").setVisible(false);
                        that.getView().byId("SocialTableD").setVisible(false);
                        that.getView().byId("SocialTableE").setVisible(false);
                        that.getView().byId("SocialTableF").setVisible(false);
                        that.getView().byId("SocialTableG").setVisible(false);
                        that.getView().byId("SocialTableH").setVisible(false);
                        that.getView().byId("SocialTableI").setVisible(false);
                        that.getView().byId("SocialTableJ").setVisible(false);
                        that.getView().byId("SocialTableK").setVisible(false);
                        that.getView().byId("SocialTableL").setVisible(false);
                        break;
                    case "Text Box":                        
                        var oTableID = this.getView().byId("SocialTableL");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        that.getView().byId("SocialTableA").setVisible(false);
                        that.getView().byId("SocialTableB").setVisible(false);
                        that.getView().byId("SocialTableC").setVisible(false);
                        that.getView().byId("SocialTableD").setVisible(false);
                        that.getView().byId("SocialTableE").setVisible(false);
                        that.getView().byId("SocialTableF").setVisible(false);
                        that.getView().byId("SocialTableG").setVisible(false);
                        that.getView().byId("SocialTableH").setVisible(false);
                        that.getView().byId("SocialTableI").setVisible(false);
                        that.getView().byId("SocialTableJ").setVisible(false);
                        that.getView().byId("SocialTableK").setVisible(false);
                        that.getView().byId("SocialTableL").setVisible(true);                        
                        break;                    
                }


                //end
            },
            //call template 1
            _callTemplate1: function (oFilter1, oTableName, oTableID, ) {
                var that = this;
                this.SocialModel = new sap.ui.model.json.JSONModel();
                this.OData.read(oTableName, {
                    filters: [oFilter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.SocialModel.setData(data);
                        var length = data.results.length;                       
                        var ltext="" ;
                        for (var i = 0; i < length; i++) {
                            that.SocialModel.getData().results[i].isExistingRow = true;
                            that.SocialModel.getData().results[i].isNewRow = false;
                            that.SocialModel.getData().results[i].isEditableRow = false;
                            ltext = that.SocialModel.getData().results[i].ltext;
                            console.log("ltext:"+ltext);
                        }
                        that._setTableData(oTableID);
                        console.log(that.SocialModel.getData().results);
                       /* if( length>0 && that.template === "Table L"){
                            that.getView().byId("addBtnTableL").setVisible(false);    
                        } else{
                            that.getView().byId("addBtnTableL").setVisible(true);
                        }*/                       


                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        //    oBusyDialog.close();
                    }
                });
            },
            _setTableData: function (oTableID) {
                oTableID.setModel(this.SocialModel, "SocialModel");
            },
            //get template and scope for seleced KPI
            _getKPITemplate: function () {
                var len = this.KPIListModel.getData().results.length;
                for (var i = 0; i < len; i++) {
                    var data = this.KPIListModel.getData().results[i];
                    if (data.Type === this.KPITypeSelected && data.SubType === this.KPISubtypeSelected && data.KPI === this.KPI) {
                        console.log("KPI match found" + data.KPI);
                        this.template = data.Template;
                        this.logic = data.Logic;
                        console.log("Logic:" + this.logic);
                        var text = "[    GRI Standards - " + data.GRIStd + "    ]";
                        this.getView().byId("displayGRI").setText(text);
                        this.prefix = data.Prefix;
                        break;
                    }
                    else continue;
                }
            },

            onChangeKPI: function (event) {
                this.KPI = event.getParameters().selectedItem.getProperty("key");
                console.log("onChangeKPI:" + this.KPI);
                this._getPrefixs();
                this._populateKPITableData();

                console.log("onChangeKPI:"+this.template);
                
                
            },
            //on KPI type chnage
            onSelect_Radiobutton_KPIType: function (oEvent) {
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.KPITypeSelected = txt;
                console.log("txt:" + txt);
                this._getKPISubTypes();
            },
            //on KPI Subtype chnage
            onChange_ComboBox_KPISubType: function (oEvent) {
                //   var that = this;
                var selText = oEvent.getParameter("selectedItem").getText();
                this.KPISubtypeSelected = selText;
                this._getKPIs(); //filter and populate all KPI for the selected SubType
                this.calloData_Prefix_Types();//prefix
            },
            OnPressAddNewEntry: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var tableID = event.getSource().getParent().getParent().getId();
                console.log("tableID:" + tableID);
                var oIdentifier = "";
                if(tableID.includes("SocialTableL")){
                    oIdentifier = this.prefix;
                }

                var arr = { "results": [] };
                arr.results = [{
                    "Type": "" + Type, "SubType": "" + subType, "KPI": +kpi, "Identifier": ""+ oIdentifier,
                    "FUpto30yrs": "", "FUpto50yrs": "", "FMorethan50Yrs": "", "MUpto30yrs": "", "MUpto50yrs": "", "MMorethan50Yrs": "",
                    "NUpto30yrs": "", "NUpto50yrs": "", "NMorethan50Yrs": "", "Female": "", "Male": "", "Response": "",
                    "OperationalChge": "", "NoOfWeeks": "", "NoOfIncidents": "", "ReviewedBy": "", "RemediationPlan": "", "Results": "",
                    "sac": "", "Number": "", "NoOfHrs": "", "NoOfEmployees": "", "Covered_OHS": "", "Covered_IAudit": "", "ltext": "",
                    "Certified_OHS": "", "Fatalities": "", "High_Consequence": "", "Recordable": "", "HrsWorked": "", "Emp_Entitled_leave": "",
                    "Emp_Took_Leave": "", "Emp_Returned_To_Work": "", "Emp_Still_Employed": "", "isNewRow": true, "isExistingRow": false
                }];

                that.getView().byId(tableID).getModel("SocialModel").getData().results = that.getView().byId(tableID).getModel("SocialModel").getProperty("/results").concat(arr.results);
                that.getView().byId(tableID).getModel("SocialModel").refresh(true);
            },
            handleConnectToLocalSystem: function (event) {
                //sap.m.MessageToast.show('Pls share your system Details! We will load data for you.!!');
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "com.techm.sustainabilityui.fragment.ConnectToLocalSystem"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            onCloseDialog: function () {
                this.byId("simpleDialog").close();
            },
            onOkDialog: function () {
                sap.m.MessageToast.show('The system details are updated.!!');
                this.byId("simpleDialog").close();
            },
            handleDownloadExcel: function (event) {
                //window.open("./documents/Sustainability_Report_1.csv");
                window.open("./documents/ENVIRONMENT_REPORT_PORTS.csv");
            },
            onPressSubmit: function (event) {
                var tableId = "";

                console.log(event);
                if(this.template === "Text Box"){
                    tableId = "SocialTableL";
                }else{
                    tableId = "SocialTable" + this.template.substring(this.template.length - 1);
                }
                //var tableId = "SocialTable" + this.template.substring(this.template.length - 1);
                console.log("tableId:" + tableId);

                //this.batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                 this.batchModel = this.getOwnerComponent().getModel("dataModel");
                this.batchChanges = [];

                this.onCreateEntry_Table(tableId);
                this.onUpdateEntry_Table(tableId);
                if (this.batchChanges.length > 0) {
                    this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                    //     this.batchModel.submitBatch();
                    //added mickey
                    this.batchModel.submitBatch({
                        // groupId: "editGroup",
                        success: function (data, response) {
                            console.log("batch success");
                            console.log(response.headers["sap-messages"]);
                        },
                        error: function(oError){
                            console.log("batch error");                           
                            that._populateKPITableData();
                        }
                    });

                    //added mickey
                    this.batchModel.refresh();
                  //  this.batchModel.hasPending
                    this._populateKPITableData();
                    this.getView().byId(tableId).getModel("SocialModel").refresh(true);
                }
                else console.log("No Rcord present for Database Operation");
            },
            onCreateEntry_Table: function (tableId) {
                
                var that = this;
                console.log("on submit:-"+this.year);
                var SocialModel = that.getView().byId(tableId).getModel("SocialModel");
                var OData = this.getOwnerComponent().getModel("dataModel");
                //Calculation
                var IsTotalRequired = false;
                var year = this.year


              /*  if(that.logic === "Logic S1"){                    
                    console.log("Logic S1:-"+that.logic);
                    console.log("prefixCount:-"+that.prefixCount);    
                    console.log("Social Length:-"+SocialModel.getData().results.length);  

                    if(that.prefixCount === SocialModel.getData().results.length)  {
                        console.log("count is equal");
                        IsTotalRequired = true
                        that.onColumnTotal(tableId);
                    }
                }i*/

                
                for (var i = 0; i < SocialModel.getData().results.length; i++) {
                    console.log("val:"+SocialModel.getData().results[i].ltext);
                    if (SocialModel.getData().results[i].isNewRow) {
                        var jsonSustain =
                        {
                            "Year": "" + year,
                            "fiscal": that.getView().byId("box2").getSelectedKey(),
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + that.KPITypeSelected,
                            "SubType": "" + that.KPISubtypeSelected,
                            "KPI": that.getView().byId("KPI").getSelectedKey(),
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Prefix": that.prefix,
                            "Identifier": SocialModel.getData().results[i].Identifier,
                            "Template": that.template,
                            "Logic": that.logic,
                            "ltext": SocialModel.getData().results[i].ltext,
                            "FUpto30yrs": parseInt(SocialModel.getData().results[i].FUpto30yrs), //table A
                            "FUpto50yrs": parseInt(SocialModel.getData().results[i].FUpto50yrs),//table A
                            "FMorethan50Yrs": parseInt(SocialModel.getData().results[i].FMorethan50Yrs),//table A
                            "MUpto30yrs": parseInt(SocialModel.getData().results[i].MUpto30yrs),//table A
                            "MUpto50yrs": parseInt(SocialModel.getData().results[i].MUpto50yrs),//table A
                            "MMorethan50Yrs": parseInt(SocialModel.getData().results[i].MMorethan50Yrs),//table A
                            "NUpto30yrs": parseInt(SocialModel.getData().results[i].NUpto30yrs),//table A
                            "NUpto50yrs": parseInt(SocialModel.getData().results[i].NUpto50yrs),//table A
                            "NMorethan50Yrs": parseInt(SocialModel.getData().results[i].NMorethan50Yrs),//table A
                            "Female": parseInt(SocialModel.getData().results[i].Female), // table B, H
                            "Male": parseInt(SocialModel.getData().results[i].Male),   //table B, H
                            "Neutral": parseInt(SocialModel.getData().results[i].Neutral), //table H
                            //"Response": SocialModel.getData().results[i].Response,   //table C                             
                            "Response": "Yes",   //table C                             
                            "OperationalChge": parseInt(SocialModel.getData().results[i].OperationalChge), //tableD
                            "NoOfWeeks": parseInt(SocialModel.getData().results[i].NoOfWeeks), //table D
                            "NoOfIncidents": parseInt(SocialModel.getData().results[i].NoOfIncidents), //table E
                            "ReviewedBy": parseInt(SocialModel.getData().results[i].ReviewedBy),//table E
                            "RemediationPlan": parseInt(SocialModel.getData().results[i].RemediationPlan),//table E
                            "Results": parseInt(SocialModel.getData().results[i].Results),//table E
                            "sac": parseInt(SocialModel.getData().results[i].sac),     //table E
                            "Number": parseInt(SocialModel.getData().results[i].Number),     //table F
                            "NoOfHrs": parseInt(SocialModel.getData().results[i].NoOfHrs),            //table G
                            "NoOfEmployees": parseInt(SocialModel.getData().results[i].NoOfEmployees),    //table G
                            "Covered_OHS": parseInt(SocialModel.getData().results[i].Covered_OHS),   //table I
                            "Covered_IAudit": parseInt(SocialModel.getData().results[i].Covered_IAudit),    //table I
                            "Certified_OHS": parseInt(SocialModel.getData().results[i].Certified_OHS),    //table I
                            "Fatalities": parseInt(SocialModel.getData().results[i].Fatalities),    //table J
                            "High_Consequence": parseInt(SocialModel.getData().results[i].High_Consequence),    //table J
                            "Recordable": parseInt(SocialModel.getData().results[i].Recordable),    //table J
                            "HrsWorked": parseInt(SocialModel.getData().results[i].HrsWorked),   //table J
                            "Emp_Entitled_leave": parseInt(SocialModel.getData().results[i].Emp_Entitled_leave),  //table K
                            "Emp_Took_Leave": parseInt(SocialModel.getData().results[i].Emp_Took_Leave),    //table K
                            "Emp_Returned_To_Work": parseInt(SocialModel.getData().results[i].Emp_Returned_To_Work),   //table K
                            "Emp_Still_Employed": parseInt(SocialModel.getData().results[i].Emp_Still_Employed),
                            "IsTotalRequired": false
                        }
                        console.log(jsonSustain);
                        jsonSustain = that._replaceNaNtoNull(jsonSustain);
                        console.log(jsonSustain);
                        //call create service
                        //****************************batch call start
                       // if (jsonSustain !== null || jsonSustain !== undefined || jsonSustain !== "") {                            
                         //   that.batchChanges.push(that.batchModel.createBatchOperation("SocialTableA", "POST", jsonSustain)); 
                       // }


                        
                            that.batchModel.create("/SocialTableA", jsonSustain, {
                                   method: "POST",
                                   success: function (data) {
                                    console.log("success");
                                    if(that.logic === "Logic S1"){                    
                                        console.log("Logic S1:-"+that.logic);
                                        console.log("prefixCount:-"+that.prefixCount);    
                                        console.log("Social Length:-"+SocialModel.getData().results.length);  
                    
                                        if(that.prefixCount === SocialModel.getData().results.length)  {
                                            console.log("count is equal");
                                            IsTotalRequired = true
                                            that.onColumnTotal(tableId);
                                        }
                                    }
                                   },
                                   error: function (e) {
                                    console.log("error");
                                   }
                               });

                        
                    }
                }

            },
            onColumnTotal: function (tableId) {
                console.log("on submit");
                var that = this;
                var SocialModel = that.getView().byId(tableId).getModel("SocialModel");
                var OData = this.getOwnerComponent().getModel("dataModel");
                var year = this.year
                //Calculation
                var IsTotalRequired = true;

                        var jsonSustain =
                        {
                            "Year": "" + year,
                            "fiscal": that.getView().byId("box2").getSelectedKey(),
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + that.KPITypeSelected,
                            "SubType": "" + that.KPISubtypeSelected,
                            "KPI": that.getView().byId("KPI").getSelectedKey(),
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Prefix": that.prefix,
                            "Identifier": "Total",
                            "Template": that.template,
                            "Logic": that.logic,
                            "FUpto30yrs": 0, //table A
                            "FUpto50yrs": 0,//table A
                            "FMorethan50Yrs": 0,//table A
                            "MUpto30yrs": 0,//table A
                            "MUpto50yrs": 0,//table A
                            "MMorethan50Yrs": 0,//table A
                            "NUpto30yrs": 0,//table A
                            "NUpto50yrs": 0,//table A
                            "NMorethan50Yrs": 0,//table A
                            "Female": 0, // table B, H
                            "Male": 0,   //table B, H
                            "Neutral": 0, //table H
                            //"Response": SocialModel.getData().results[i].Response,   //table C                             
                            "Response": "Yes",   //table C                             
                            "OperationalChge": 0, //tableD
                            "NoOfWeeks": 0, //table D
                            "NoOfIncidents": 0, //table E
                            "ReviewedBy": 0,//table E
                            "RemediationPlan": 0,//table E
                            "Results": 0,//table E
                            "sac": 0,     //table E
                            "Number": 0,     //table F
                            "NoOfHrs": 0,            //table G
                            "NoOfEmployees": 0,    //table G
                            "Covered_OHS": 0,   //table I
                            "Covered_IAudit": 0,    //table I
                            "Certified_OHS": 0,    //table I
                            "Fatalities": 0,    //table J
                            "High_Consequence": 0,    //table J
                            "Recordable": 0,    //table J
                            "HrsWorked": 0,   //table J
                            "Emp_Entitled_leave": 0,  //table K
                            "Emp_Took_Leave": 0,    //table K
                            "Emp_Returned_To_Work": 0,   //table K
                            "Emp_Still_Employed": 0,
                            "IsTotalRequired": IsTotalRequired
                        }
                        console.log(jsonSustain);
                        jsonSustain = that._replaceNaNtoNull(jsonSustain);
                        console.log(jsonSustain);
                        //call create service
                        //****************************batch call start
                       // if (jsonSustain !== null || jsonSustain !== undefined || jsonSustain !== "") {                            
                        //  that.batchChanges.push(that.batchModel.createBatchOperation("SocialTableA", "POST", jsonSustain)); 
                        //}

                        that.batchModel.create("/SocialTableA", jsonSustain, {
                            method: "POST",
                            success: function (data) {
                             console.log("success");
                             sap.m.MessageToast.show("The details got updated Successfully!!");
                            // this._populateKPITableData();
                             
                            },
                            error: function (e) {
                             console.log("error");
                            }
                        });

            },

            onRowSelected: function(oEvent){
//get the table row and make the parameter isEditableRow as true
            },
            onPressEdit:function(oEvent){
             
                var tableId = "SocialTable" + this.template.substring(this.template.length - 1);
                console.log("tableId:" + tableId);
                var rowItems = this.getView().byId(tableId).getSelectedItems();
                console.log(rowItems);
            //    var oSelectedItems = { "items": [] }
                var SocialModel = this.getView().byId(tableId).getModel("SocialModel");
                for (var i = 0; i < rowItems.length; i++) {
                    if(tableId ==="SocialTableL"){
                        var oIdentifier = rowItems[i].mAggregations.cells[0].mProperties.text;                   }
                   else {
                    var oIdentifier = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;                  
                   }
                    for (var j = 0; j < SocialModel.getData().results.length; j++) {
                        if (oIdentifier === SocialModel.getData().results[j].Identifier ){
                            SocialModel.getData().results[j].isEditableRow = true;
                            break;
                        }
                        else continue;
                    }   
                }
                SocialModel.refresh(true);        


            },
            onPressReset:function(oEvent){
                var tableId = "SocialTable" + this.template.substring(this.template.length - 1);
                var rowItems = this.getView().byId(tableId).getSelectedItems();               
             //   var oSelectedItems = { "items": [] }
                var SocialModel = this.getView().byId(tableId).getModel("SocialModel");

                for (var i = 0; i < rowItems.length; i++) {
                    var oIdentifier = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                    for (var j = 0; j < SocialModel.getData().results.length; j++) {
                        if (oIdentifier === SocialModel.getData().results[j].Identifier ){
                            SocialModel.getData().results[j].isEditableRow = false;
                            rowItems[i].setSelected(false);
                            break;
                        }
                        else continue;
                    }   
                }
                SocialModel.refresh(true);
                              
            },
            _getJsonForRowUpdate: function(data){
                var that = this;
                var jsonSustain =
                {
                    "Division": that.getView().byId("box0").getSelectedKey(),
                    "Prefix": that.prefix,
                    "Template": that.template,
                    "Logic": that.Logic,
                    "FUpto30yrs": parseInt(data.FUpto30yrs), //table A
                    "FUpto50yrs": parseInt(data.FUpto50yrs),//table A
                    "FMorethan50Yrs": parseInt(data.FMorethan50Yrs),//table A
                    "MUpto30yrs": parseInt(data.MUpto30yrs),//table A
                    "MUpto50yrs": parseInt(data.MUpto50yrs),//table A
                    "MMorethan50Yrs": parseInt(data.MMorethan50Yrs),//table A
                    "NUpto30yrs": parseInt(data.NUpto30yrs),//table A
                    "NUpto50yrs": parseInt(data.NUpto50yrs),//table A
                    "NMorethan50Yrs": parseInt(data.NMorethan50Yrs),//table A
                    "Female": parseInt(data.Female), // table B, H
                    "Male": parseInt(data.Male),   //table B, H
                    "Neutral": parseInt(data.Neutral), //table H
                    //"Response": data.Response,   //table C                             
                    "Response": "Yes",   //table C                             
                    "OperationalChge": parseInt(data.OperationalChge), //tableD
                    "NoOfWeeks": parseInt(data.NoOfWeeks), //table D
                    "NoOfIncidents": parseInt(data.NoOfIncidents), //table E
                    "ReviewedBy": parseInt(data.ReviewedBy),//table E
                    "RemediationPlan": parseInt(data.RemediationPlan),//table E
                    "Results": parseInt(data.Results),//table E
                    "sac": parseInt(data.sac),     //table E
                    "Number": parseInt(data.Number),     //table F
                    "NoOfHrs": parseInt(data.NoOfHrs),            //table G
                    "NoOfEmployees": parseInt(data.NoOfEmployees),    //table G
                    "Covered_OHS": parseInt(data.Covered_OHS),   //table I
                    "Covered_IAudit": parseInt(data.Covered_IAudit),    //table I
                    "Certified_OHS": parseInt(data.Certified_OHS),    //table I
                    "Fatalities": parseInt(data.Fatalities),    //table J
                    "High_Consequence": parseInt(data.High_Consequence),    //table J
                    "Recordable": parseInt(data.Recordable),    //table J
                    "HrsWorked": parseInt(data.HrsWorked),   //table J
                    "Emp_Entitled_leave": parseInt(data.Emp_Entitled_leave),  //table K
                    "Emp_Took_Leave": parseInt(data.Emp_Took_Leave),    //table K
                    "Emp_Returned_To_Work": parseInt(data.Emp_Returned_To_Work),   //table K
                    "Emp_Still_Employed": parseInt(data.Emp_Still_Employed)
                }
                return jsonSustain;
            },
            onUpdateEntry_Table: function (tableId) {
                console.log("on submit");
                var that = this;

                var yr = that.getView().byId("box2").getSelectedKey();
                var loc = (that.getView().byId("box1").getSelectedKey()).toString();

                var subType = this.KPISubtypeSelected + "";
                var Type = this.KPITypeSelected + "";
                var kpi = this.getView().byId("KPI").getSelectedKey() + "";

                var table = this.getView().byId(tableId);
                var rowItems = table.getSelectedItems();
                var oSelectedItems = { "items": [] }
                var SocialModel = that.getView().byId(tableId).getModel("SocialModel");

                for (var i = 0; i < rowItems.length; i++) {
                    var oIdentifier = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                    for (var j = 0; j < SocialModel.getData().results.length; j++) {
                        if (oIdentifier === SocialModel.getData().results[j].Identifier ){
                            var jsonSustain = this._getJsonForRowUpdate(SocialModel.getData().results[j]);
                            jsonSustain = that._replaceNaNtoNull(jsonSustain);
                            console.log("jsonSustain:" + jsonSustain);
                            var uri1 = "SocialTableA(Year='" + yr + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "',Identifier='" + oIdentifier + "')";
                            var uri = encodeURI(uri1);        
                            that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", jsonSustain));
                            break;
                        }
                        else continue;
                    }
                }
                  
            },
            _replaceNaNtoNull: function (jsonSustain) {

                if (isNaN(jsonSustain.FUpto30yrs)) {
                    jsonSustain.FUpto30yrs = null;
                }
                if (isNaN(jsonSustain.FUpto50yrs)) {
                    jsonSustain.FUpto50yrs = null;
                }
                if (isNaN(jsonSustain.FMorethan50Yrs)) {
                    jsonSustain.FMorethan50Yrs = null;
                }
                if (isNaN(jsonSustain.MUpto30yrs)) {
                    jsonSustain.MUpto30yrs = null;
                }
                if (isNaN(jsonSustain.MUpto50yrs)) {
                    jsonSustain.MUpto50yrs = null;
                }
                if (isNaN(jsonSustain.MMorethan50Yrs)) {
                    jsonSustain.MMorethan50Yrs = null;
                }
                if (isNaN(jsonSustain.NUpto30yrs)) {
                    jsonSustain.NUpto30yrs = null;
                }
                if (isNaN(jsonSustain.NUpto50yrs)) {
                    jsonSustain.NUpto50yrs = null;
                }
                if (isNaN(jsonSustain.NMorethan50Yrs)) {
                    jsonSustain.NMorethan50Yrs = null;
                }
                if (isNaN(jsonSustain.Female)) {
                    jsonSustain.Female = null;
                }
                if (isNaN(jsonSustain.Male)) {
                    jsonSustain.Male = null;
                }
                if (isNaN(jsonSustain.Neutral)) {
                    jsonSustain.Neutral = null;
                }
                if (isNaN(jsonSustain.OperationalChge)) {
                    jsonSustain.OperationalChge = null;
                }
                if (isNaN(jsonSustain.NoOfWeeks)) {
                    jsonSustain.NoOfWeeks = null;
                }
                if (isNaN(jsonSustain.NoOfIncidents)) {
                    jsonSustain.NoOfIncidents = null;
                }
                if (isNaN(jsonSustain.ReviewedBy)) {
                    jsonSustain.ReviewedBy = null;
                }
                if (isNaN(jsonSustain.RemediationPlan)) {
                    jsonSustain.RemediationPlan = null;
                }
                if (isNaN(jsonSustain.Results)) {
                    jsonSustain.Results = null;
                }
                if (isNaN(jsonSustain.sac)) {
                    jsonSustain.sac = null;
                }
                if (isNaN(jsonSustain.Number)) {
                    jsonSustain.Number = null;
                }
                if (isNaN(jsonSustain.NoOfHrs)) {
                    jsonSustain.NoOfHrs = null;
                }
                if (isNaN(jsonSustain.NoOfEmployees)) {
                    jsonSustain.NoOfEmployees = null;
                }
                if (isNaN(jsonSustain.Covered_OHS)) {
                    jsonSustain.Covered_OHS = null;
                }
                if (isNaN(jsonSustain.Covered_IAudit)) {
                    jsonSustain.Covered_IAudit = null;
                }
                if (isNaN(jsonSustain.Certified_OHS)) {
                    jsonSustain.Certified_OHS = null;
                }
                if (isNaN(jsonSustain.Fatalities)) {
                    jsonSustain.Fatalities = null;
                }
                if (isNaN(jsonSustain.High_Consequence)) {
                    jsonSustain.High_Consequence = null;
                }
                if (isNaN(jsonSustain.Recordable)) {
                    jsonSustain.Recordable = null;
                }
                if (isNaN(jsonSustain.HrsWorked)) {
                    jsonSustain.HrsWorked = null;
                }
                if (isNaN(jsonSustain.Emp_Entitled_leave)) {
                    jsonSustain.Emp_Entitled_leave = null;
                }
                if (isNaN(jsonSustain.Emp_Took_Leave)) {
                    jsonSustain.Emp_Took_Leave = null;
                }
                if (isNaN(jsonSustain.Emp_Returned_To_Work)) {
                    jsonSustain.Emp_Returned_To_Work = null;
                }
                if (isNaN(jsonSustain.Emp_Still_Employed)) {
                    jsonSustain.Emp_Still_Employed = null;
                }

                return jsonSustain;
            },
            handleUploadPress: function () {
                //alert("thjis");
                var oBusyDialog = new sap.m.BusyDialog({ title: "UploadFile", text: "Uploading ......" });
                oBusyDialog.open();
                that = this;
                var oFileUploader = this.getView().byId("fileUploader");
                var domRef = oFileUploader.getFocusDomRef();
                var file = domRef.files[0];
                var options = { "clientId": "default", "documentType": "custom", "enrichment": {}, "schemaId": "c5c7e09b-4489-47e6-810d-4d78e19edd34", "templateId": "74e63a34-15fd-462c-a42a-8a58c30defbe" };
                /*var options = {
                    "clientId": "default",
                    "documentType": "custom",
                    "enrichment": {},
                    "schemaId": "cd64a5e8-0fdf-4de1-a084-4f39046f4609",
                    "templateId": "3ccd15e8-617d-4ad9-8ccf-b37e6bdbcec6"
                    
                };*/

                var oFormData = new FormData();

                oFormData.append("file", file);
                oFormData.append("options",
                    "{\"clientId\": \"default\",\"documentType\": \"custom\",\"enrichment\": {},\"schemaId\": \"c5c7e09b-4489-47e6-810d-4d78e19edd34\",\"templateId\": \"74e63a34-15fd-462c-a42a-8a58c30defbe\"}"
                );

                console.log(options);
                // var doxUrl = "https://aiservices-trial-dox.cfapps.eu10.hana.ondemand.com/document-information-extraction/v1/document/jobs"
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
                            "timeout": 0,
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
                                var result = JSON.parse(data);
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

            onExportExcel: function (evt) {
                this._import(evt.getParameter("files") && evt.getParameter("files")[0]);
            },
            _import: function (file) {
                var that = this;
                var excelData = {};
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
                        // Setting the data to the local model 
                        /* that.EnvModel.setData({
                             results: excelData
                         });*/



                        var length = excelData.length;
                        for (var i = 0; i < length; i++) {
                            excelData[i].isExistingRow = false;
                            excelData[i].isNewRow = true;
                        }
                        var results = [];
                        var recentData = that.EnvModel.getData().results;
                        recentData.push(...excelData);
                        //results.concat(recentData,excelData);
                        that.EnvModel.setData({
                            results: recentData
                        });
                        that.EnvModel.refresh(true);
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            },
            onChangePrefix: function (event) {
                this.prefix = event.getParameters().selectedItem.getProperty("key");
                console.log("onChangeKPI:" + this.prefix);
                
                this.calloData_Prefix_Values();
                //this._populateKPITableData();
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
                      
                       // that.getView().byId("prefixValues").setModel(that.PrefixTypesModel, "PrefixTypesModel");

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
                var Value = this.prefix;
                var filter1 = new sap.ui.model.Filter({ path: "prefix", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               

                this.PrefixValuesModel = new sap.ui.model.json.JSONModel();                
                OData.read(url1, {
                    filters: [filter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);                       
                        that.PrefixValuesModel.setData(data); 
                        that.prefixCount = data.results.length;
                       
                        //bind combo box
                        that.getView().byId("cbPrevfixVal").setModel(that.PrefixValuesModel, "PrefixValuesModel");    
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

            },


        });
    });


var that;
function getExtractionResults(docID, auth) {
    var oBusyDialog = new sap.m.BusyDialog({ "title": "Extracting Results", "text": "Extraction is in progress.. Please wait" });
    oBusyDialog.open();
    var ID = docID;
    var token = auth;
    var lineItems = { "results": [] };
    var doxUrl = "/comtechmsustainabilityui/DocExtractor" + '/document-information-extraction/v1/document/jobs/' + docID + '?returnNullValues=true&extractedValues=true';
    jQuery.ajax({
        url: doxUrl,
        method: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": auth
        },
        success: function (data, textStatus, jqXHR) {

            if (data.status == 'DONE') {
                oBusyDialog.close();
                console.log("------ Doc EXTRACTION DONE --------");
                console.log(data);
                var headerFields = {};
                for (var i = 0; i < data.extraction.headerFields.length; i++) {



                    headerFields[data.extraction.headerFields[i].name] = data.extraction.headerFields[i].value;

                    //console.log(headerFields);
                }

                for (var j = 0; j < data.extraction.lineItems.length; j++) {
                    var item = {};
                    for (var k = 0; k < data.extraction.lineItems[j].length; k++) {
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
                    item.isExistingRow = false;
                    item.isNewRow = true;
                    lineItems.results.push(item);

                    //console.log(JSON.stringify(lineItems.items));
                }
                // var extractionModel = new sap.ui.model.json.JSONModel(lineItems);
                //sap.ui.getCore().setModel(extractionModel, "extractionModel");
                var currentData = that.getView().byId("EnvTable5").getModel("EnvModel").getProperty("/results");
                var updatedData = currentData.concat(lineItems.results);
                that.getView().byId("EnvTable5").getModel("EnvModel").getData().results = updatedData;
                that.getView().byId("EnvTable5").getModel("EnvModel").refresh(true);

                return;
            } else if (data.status == 'PENDING') {
                setTimeout(function () {
                    console.log("Pending");
                    getExtractionResults(ID, token);
                }, 5000);
            } else if (data.status == 'FAILED') {
                lineItems.results = [{ "Type": "Direct Energy", "SubType": "HSD", "Month": "January", "Value": "1.217", "Unit": "gl", "Cost": "61919", "Currency": "USD", "Quality": "n.a", "Comment": "OK", "Year": "2022", "Location": "Nashville", "Division": "ACME Industries" },
                { "Type": "Direct Energy", "SubType": "LPG", "Month": "January", "Value": "1.337", "Unit": "gl", "Cost": "64119", "Currency": "USD", "Quality": "n.a", "Comment": "OK", "Year": "2022", "Location": "Nashville", "Division": "ACME Industries" },
                { "Type": "Water Withdrawal", "SubType": "Bottled Water", "Month": "January", "Value": "9", "Unit": "gl", "Cost": "921334", "Currency": "USD", "Quality": "n.a", "Comment": "OK", "Year": "2022", "Location": "Nashville", "Division": "ACME Industries" }
                ];
                var currentData = that.getView().byId("EnvTable5").getModel("EnvModel").getProperty("/results");
                var updatedData = currentData.concat(lineItems.results);
                that.getView().byId("EnvTable5").getModel("EnvModel").getData().results = updatedData;
                that.getView().byId("EnvTable5").getModel("EnvModel").refresh(true);
            }

        },
        error: function (xhr, status, error) {
            sap.m.MessageToast.show("Error in fetching extraction results: " + error);
        },
        complete: function (xhr, status) {
            oBusyDialog.close();
            console.log("xhr: " + xhr);
            console.log("Status: " + status);

        },
        formatQuality: function (Value) {
            if (Value === "Yes") {
                return true;
            } else if (Value === "No") {
                return false;
            }
        },
    });
}
