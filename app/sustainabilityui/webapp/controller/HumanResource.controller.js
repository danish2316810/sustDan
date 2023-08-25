sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.HumanResource", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);   

                this.getView().byId("object1").setVisible(false);
                this.getView().byId("btn1").setVisible(false);
                this.getView().byId("btn2").setVisible(false);
                this.getView().byId("btn3").setVisible(false);
                this.getView().byId("btn4").setVisible(false);

                //Division             
                let oDivisionModel = new sap.ui.model.json.JSONModel("model/mock.json");                                
                this.getView().byId("box0").setModel(oDivisionModel, "divisionModel");
                //Location
                let oLocationModel = new sap.ui.model.json.JSONModel("model/mock.json");                    
                this.getView().byId("box1").setModel(oLocationModel, "locationModel");
                //Year
                let oYearModel = new sap.ui.model.json.JSONModel("model/mock.json");                    
                this.getView().byId("box2").setModel(oYearModel, "yearModel");

                var viewModel = new sap.ui.model.json.JSONModel({
                "CountriesCollection" : [
                    {
                        "key" : "January",
                        "text" : "January"
                    },
                        {
                        "key" : "February",
                        "text" : "February"
                    },
                        {
                        "key" : "March",
                        "text" : "March"
                    },
                        {
                        "key" : "April",
                        "text" : "April"
                    },
                        {
                        "key" : "May",
                        "text" : "May"
                    },
                        {
                        "key" : "June",
                        "text" : "June"
                    },
                        {
                        "key" : "July",
                        "text" : "Jan"
                    },	{
                        "key" : "August",
                        "text" : "August"
                    },
                        {
                        "key" : "September",
                        "text" : "September"
                    },
                        {
                        "key" : "Jan",
                        "text" : "Jan"
                    },
                    {
                        "key" : "Octobe",
                        "text" : "October"
                    },
                    {
                        "key" : "November",
                        "text" : "November"
                    },
                    {
                        "key" : "December",
                        "text" : "December"
                    }
                    
                    ]
                });
                this.getView().setModel(viewModel, "month");
              /*  var viewModel = new sap.ui.model.json.JSONModel({
                    "PermanentEmpMale": [{
                            "category": "Junior Mgmt",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }, {
                            "category": "Middle Mgmt",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }, {
                            "category": "Senior Mgmt",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }, {
                            "category": "Fix term Contract",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        },  {
                            "category": "Third Party Contract",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "100"
                        }, {
                            "category": "Others",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }
    
                    ],
                        "PermanentEmpFemale": [{
                            "category": "Junior Mgmt",
                            "18-30": "150",
                            "31-50": "240",
                            ">50": "110",
                            "total": "400"
                        }, {
                            "category": "Middle Mgmt",
                            "18-30": "75",
                            "31-50": "150",
                            ">50": "150",
                            "total": "375"
                        }, {
                            "category": "Senior Mgmt",
                            "18-30": "200",
                            "31-50": "350",
                            ">50": "100",
                            "total": "650"
                        }, {
                            "category": "Fix term Contract",
                            "18-30": "68",
                            "31-50": "75",
                            ">50": "35",
                            "total": "178"
                        },  {
                            "category": "Third Party Contract",
                            "18-30": "110",
                            "31-50": "70",
                            ">50": "30",
                            "total": "210"
                        }, {
                            "category": "Others",
                            "18-30": "500",
                            "31-50": "100",
                            ">50": "200",
                            "total": "800"
                        }
    
                    ],
                    
                        "NewHireMale": [{
                            "category": "Junior Mgmt",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }, {
                            "category": "Middle Mgmt",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }, {
                            "category": "Senior Mgmt",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }, {
                            "category": "Fix term Contract",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        },  {
                            "category": "Third Party Contract",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "100"
                        }, {
                            "category": "Others",
                            "18-30": "100",
                            "31-50": "100",
                            ">50": "100",
                            "total": "300"
                        }
    
                    ],
                        "NewHireFemale": [{
                            "category": "Junior Mgmt",
                            "18-30": "150",
                            "31-50": "240",
                            ">50": "110",
                            "total": "400"
                        }, {
                            "category": "Middle Mgmt",
                            "18-30": "75",
                            "31-50": "150",
                            ">50": "150",
                            "total": "375"
                        }, {
                            "category": "Senior Mgmt",
                            "1l8-30": "200",
                            "31-50": "350",
                            ">50": "100",
                            "total": "650"
                        }, {
                            "category": "Fix term Contract",
                            "18-30": "68",
                            "31-50": "75",
                            ">50": "35",
                            "total": "178"
                        },  {
                            "category": "Third Party Contract",
                            "18-30": "110",
                            "31-50": "70",
                            ">50": "30",
                            "total": "210"
                        }, {
                            "category": "Others",
                            "18-30": "500",
                            "31-50": "100",
                            ">50": "200",
                            "total": "800"
                        }
    
                    ],
                    
                "TotalWorkedHrs" : [
                    {"category" : "Permanent Male Employees Hours Worked",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                        {"category" : "Permanent female employees hours worked",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted male employees hours worked",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted female employees hours worked",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other male employees hours worked",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other female employees hours worked",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    }
                    
                    
                    ],
                    "TotalAccidentsReported" : [
                            {"category" : "Permanent Male Employees accidents reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                        {"category" : "Permanent female employees accidents reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted male employees accidents reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted female employees accidents reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other male employees accidents reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other female employees accidents reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    }
                        ],
                        "TotalLostdaysreported" : [
                                        {"category" : "Permanent Male Employees lost days reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                        {"category" : "Permanent female employees lost days reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted male employees lost days reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted female employees lost days reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other male employees lost days reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other female employees lost days reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    }
                            ],
                    "Totalfatalitiesreported" : [
                                {"category" : "Permanent Male Employees fatalities reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                        {"category" : "Permanent female employees fatalities reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted male employees fatalities reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Contracted female employees fatalities reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other male employees fatalities reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                            {"category" : "Other female employees fatalities reported",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    }
                        ],
                    "OrganizationReport" : [
                                {"category" : "Number of suppliers subject to impact assessments for social impacts",
                    "month" : "April",
                    "details" : "",
                    "value" : "100",
                    "unit" : "14"
                    },
                        {"category" : "Number of suppliers identified as having significant actual and potential negative social impacts",
                
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                        "quality" : ""
                    },
                            {"category" : "Significant actual and potential negative social impacts identified in the supply chain",
                    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    },
                            {"category" : "Percentage of suppliers with which improvements agreed",
                    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    },
                            {"category" : "Reasons for termination of supplier relationships",
    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    }
                        ]	,
                    "SecurityTrained" : [
                                {"category" : "Security Personnel (Employed Directly)",
                
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    },
                        {"category" : "Security Personnel trained on human rights (Employed Directly)",
                
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                        "quality" : ""
                    },
                            {"category" : "Security Personnel Training Hours (Employed Directly)",
                    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    },
                            {"category" : "Security Personnel (Third Party)",
                    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    },
                            {"category" : "Security Personnel trained on human rights (Third Party)",
    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    },
                            {"category" : "Security Personnel Training Hours (Third Party)",
    
                    "details" : "",
                    "value" : "100",
                    "unit" : "14",
                    "quality" : ""
                    }
                        ]		,
                        
                        "CountriesCollection" : [
                            {
                                "key" : "January",
                                "text" : "January"
                            },
                                {
                                "key" : "February",
                                "text" : "February"
                            },
                                {
                                "key" : "March",
                                "text" : "March"
                            },
                                {
                                "key" : "April",
                                "text" : "April"
                            },
                                {
                                "key" : "May",
                                "text" : "May"
                            },
                                {
                                "key" : "June",
                                "text" : "June"
                            },
                                {
                                "key" : "July",
                                "text" : "Jan"
                            },	{
                                "key" : "August",
                                "text" : "August"
                            },
                                {
                                "key" : "September",
                                "text" : "September"
                            },
                                {
                                "key" : "Jan",
                                "text" : "Jan"
                            },
                            {
                                "key" : "Octobe",
                                "text" : "October"
                            },
                            {
                                "key" : "November",
                                "text" : "November"
                            },
                            {
                                "key" : "December",
                                "text" : "December"
                            }
                            
                            ]
                        
                    
                    
                    
                });
                this.getView().setModel(viewModel);*/
                
                //	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //this.oRouter.getTarget("TargetPeopleImperative").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
          
            },
            onPressBack : function(Event){
			
                //navigates back
                this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
            },   
            handleRouteMatched:function(evt){
			
            },
            
            moveToFinance:function(){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Finance", true);
                
            },
            onPressGo : function(event){                
                var that = this;
                
                this.getView().byId("object1").setVisible(true);
                this.getView().byId("btn1").setVisible(true);
                this.getView().byId("btn2").setVisible(true);
                this.getView().byId("btn3").setVisible(true);
                this.getView().byId("btn4").setVisible(true);


                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();
                var OData = this.getOwnerComponent().getModel("dataModel");
               // var OData = new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                OData.read("/PeopleImperative", {
                    success: function (data, oResponse) {                   
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().byId("table1").setModel(ListModel);                       
                        that.getView().byId("table2").setModel(ListModel);                       
                        that.getView().byId("table3").setModel(ListModel);                       
                        that.getView().byId("table4").setModel(ListModel);                       
                        that.getView().byId("table5").setModel(ListModel);    

                        that.getView().byId("SocialTableA").setModel(ListModel, "SocialModel");
                        
                        OData.read("/Healthy_Safety", {
                            success: function (data1, oResponse) {                   
                               
                                var ListModel = new sap.ui.model.json.JSONModel();
                                ListModel.setData(data1);                                               
                                that.getView().byId("table5").setModel(ListModel);                       
                                that.getView().byId("table6").setModel(ListModel);                       
                                that.getView().byId("table7").setModel(ListModel);                       
                                that.getView().byId("table8").setModel(ListModel);                       
                                that.getView().byId("table9").setModel(ListModel);                       
                                that.getView().byId("table10").setModel(ListModel);                       
                            },
                            error: function (err) {
                                // MessageBox.error("Error");                     
            
                            }
                        });            
                        
                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        oBusyDialog.close();
    
                    }
                });      

            

            },
            onEmpSelectionChange : function(event){
             
                var that = this;
                console.log("selected key:"+that.getView().byId("empType").getSelectedKey());              
                //Female
                var oTable_Female = that.getView().byId("table1");
                var oBinding_Female = oTable_Female.getBinding("items");
                oBinding_Female.filter([]);
                var oFilters_Female =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'TotalEmployees'}),
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("empType").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Gender", operator: sap.ui.model.FilterOperator.EQ, value1: 'Female'})  ];
                oBinding_Female.filter(oFilters_Female);
                //Male
                var oTable_Male = that.getView().byId("table2");
                var oBinding_Male = oTable_Male.getBinding("items");
                oBinding_Male.filter([]);
                var oFilters_Male =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'TotalEmployees'}),
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("empType").getSelectedKey()}),
                                    new sap.ui.model.Filter({path: "Gender", operator: sap.ui.model.FilterOperator.EQ, value1: 'Male'})  ];
                oBinding_Male.filter(oFilters_Male);
            },
            onMonthSelectionChange : function(event){
                var that = this; 
                //Total Hours               
                var oTable_Hours = that.getView().byId("table7");
                var oBinding_Hours = oTable_Hours.getBinding("items");
                oBinding_Hours.filter([]);
                var oFilters_Hours =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Rate of Injury'}),
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: 'Total hours worked'}),
                                    new sap.ui.model.Filter({path: "Month", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("month").getSelectedKey()})  ];
                oBinding_Hours.filter(oFilters_Hours);                
            },
            onMonthChange_Accidents : function(event){
                var that = this; 
                //Total Accidents               
                var oTable_Accdts = that.getView().byId("table8");
                var oBinding_Accdts = oTable_Accdts.getBinding("items");
                oBinding_Accdts.filter([]);
                var oFilters_Accdts =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Rate of Injury'}),
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: 'Total accidents reported'}),
                                    new sap.ui.model.Filter({path: "Month", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("mnth_acdts").getSelectedKey()})  ];
                oBinding_Accdts.filter(oFilters_Accdts);                
            },
            onMonthChange_LstDays : function(event){
                var that = this; 
                //Total Lost Days             
                var oTable_LostDays = that.getView().byId("table9");
                var oBinding_LostDays = oTable_LostDays.getBinding("items");
                oBinding_LostDays.filter([]);
                var oFilters_LostDays =   [ new sap.ui.model.Filter({path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: 'Rate of Injury'}),
                                    new sap.ui.model.Filter({path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: 'Total lost days reported'}),
                                    new sap.ui.model.Filter({path: "Month", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("mnth_lstDays").getSelectedKey()})  ];
                oBinding_LostDays.filter(oFilters_LostDays);                
            },
            OnPressAddNewEntry_TableA: function(event){
                var that=this;
                var subType = "Direct Energy";
                var Type = "Energy";
                var kpi = "Teset";
                var arr = { "results": [] };

               /* arr.results = [{
                   "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Governance": "", "FemaleL30Y": "", "FemaleE30Y": "", "FemaleG50Y": "",
                    "MaleL30Y": "", "MaleE30Y": "", "MaleG50Y": "", "NeutralL30Y": "", "NeutralE30Y": "", "NeutralG50Y": "",
                    "Owner": "", "Approver": "", "isNewRow": true, "isExistingRow": false
                }];*/

                arr.results = [{
                    "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Category": "", "Upto30yrs": "", "Upto50yrs": "", "Morethan50Yrs": ""
                     
                 }];
                that.getView().byId("SocialTableA").getModel("SocialModel").getData().results = that.getView().byId("SocialTableA").getModel("SocialModel").getProperty("/results").concat(arr.results);
                that.getView().byId("SocialTableA").getModel("SocialModel").refresh(true);
            }
        });
    });
