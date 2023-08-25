sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.Environment", {

            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                this.UserInputMonth = "";
                this.UserInputCurrency = "";
                this.Scope = "";
                this.monthArr = [];
                this.yearArr = [];
                this.attachFile = [];   

                this.OData = this.getOwnerComponent().getModel("dataModel");
                var that = this;

                this.yearA="";
                this.StartDate="";
                this.EndDate="";
                this.OutputUoM="";
                //this.onPressGo(); //odata service calls        

                this.flag="";
                
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getTarget("Environment").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            },
            handleRouteMatched : function(evt){ 
                this.FileArr = [];
                this.GlobalIndustryModel = sap.ui.getCore().getModel("GlobalIndustryModel");//added on Feb 27
                console.log("on before Env:"+this.GlobalIndustryModel.getData());
                var that=this;
                var Industry = this.GlobalIndustryModel.getData().Industry;                
                if(Industry === "Telecom"){
                    that.getView().byId("box0").setSelectedKey("Bharti Airtel Limited");
                    that.getView().byId("box1").setSelectedKey("Maharashtra");
                    that.getView().byId("box2").setSelectedKey("");
               }
                this.onPressGo(); //odata service calls
            },            
            onPressBack: function (Event) {
                this.getView().byId("box0").setSelectedKey("");
                this.getView().byId("box1").setSelectedKey("");
                this.getView().byId("box2").setSelectedKey("");

                //navigates back
                this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
            },
            handleUploadPress: function () {              
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
            onPressDataUpload:function(event){
                var that=this;
                this.batchChanges = [];
                this.batchModel = this.getOwnerComponent().getModel("dataModel");
                this.batchModel.setUseBatch(true);
                var OData = this.getOwnerComponent().getModel("dataModel");
                for (var i = 0; i < that.EnvModel.getData().results.length; i++) {
                    //if (that.EnvModel.getData().results[i].isNewRow) 
                    {
                        var jsonSustain =
                       {
                            /*"Year": that.EnvModel.getData().results[i].YEAR,
                            "Month": that.EnvModel.getData().results[i].MONTH,
                            "Location": that.EnvModel.getData().results[i].LOCATION,
                            "Type": that.EnvModel.getData().results[i].TYPE,
                            "SubType": that.EnvModel.getData().results[i].SUBTYPE,
                            "KPI": that.EnvModel.getData().results[i].KPI,
                            "Value": parseFloat(that.EnvModel.getData().results[i].VALUE),
                           "Unit": that.EnvModel.getData().results[i].UNIT,
                            "Cost": parseFloat(that.EnvModel.getData().results[i].COST),
                            "Currency": that.EnvModel.getData().results[i].CURRENCY,
                            "Quality": "OK",
                            "Comment": that.EnvModel.getData().results[i].COMMENT,
                            "Owner": that.EnvModel.getData().results[i].OWNER,
                            "Approver": that.EnvModel.getData().results[i].APPROVER,
                            "Division": that.EnvModel.getData().results[i].DIVISION,
                            "Sno": 0,
                            "Date": null,
                            "Value2": parseFloat(that.EnvModel.getData().results[i].VALUE2), 
                           "Unit2": that.EnvModel.getData().results[i].UNIT2,
                            "Distance": null,
                            "Weight": null,
                            "Scope": that.EnvModel.getData().results[i].SCOPE,
                            "Associates": null,
                            "Logic": that.EnvModel.getData().results[i].LOGIC,
                            "Measure": that.EnvModel.getData().results[i].MEASURE, 
                            "GRIStd": that.EnvModel.getData().results[i].GRISTD,
                            "SDG": that.EnvModel.getData().results[i].SDG,
                            "Class": that.EnvModel.getData().results[i].CLASS,
                            "RenNon": that.EnvModel.getData().results[i].RENNON,
                            "FValue": 0.0,
                            "FValue1": 0.0
                            
                            "supplier":"null",*/

                            "Year": that.EnvModel.getData().results[i].Year,
                            "Month": that.EnvModel.getData().results[i].Month,
                            "Location": that.EnvModel.getData().results[i].Location,
                            "Type": that.EnvModel.getData().results[i].Type,
                            "SubType": that.EnvModel.getData().results[i].SubType,
                            "KPI": that.EnvModel.getData().results[i].KPI,
                            "Sno": 0,                            
                            "Value": parseFloat(that.EnvModel.getData().results[i].Value),
                            "Unit": that.EnvModel.getData().results[i].Unit,      
                            "IUnit":"",
                            "IValue": 0.0,                      
                            "Cost": parseFloat(that.EnvModel.getData().results[i].Cost),
                            "Currency": that.EnvModel.getData().results[i].Currency,
                            "Quality": "OK",
                            "Comment": that.EnvModel.getData().results[i].Comment,
                            "FiscalType":that.EnvModel.getData().results[i].FiscalType,
                            "YearA":that.EnvModel.getData().results[i].YearA,
                            "StartDate":that.EnvModel.getData().results[i].StartDate,
                            "EndDate":that.EnvModel.getData().results[i].EndDate,
                            "fiscal":that.EnvModel.getData().results[i].fiscal,
                            "Owner": that.EnvModel.getData().results[i].Owner,
                            "Approver": that.EnvModel.getData().results[i].Approver,
                            "Division": that.EnvModel.getData().results[i].Division,                            
                            "Date": null,
                            "Value2": parseFloat(that.EnvModel.getData().results[i].Value2), 
                            "Unit2": that.EnvModel.getData().results[i].Unit2,
                            "Distance": null,
                            "Weight": null,
                            "Scope": that.EnvModel.getData().results[i].Scope,
                            "Associates": null,
                            "Logic": that.EnvModel.getData().results[i].Logic,
                            "Measure": that.EnvModel.getData().results[i].Measure, 
                            "Standard1":that.EnvModel.getData().results[i].Standard1,
                            "LogicE":that.EnvModel.getData().results[i].LogicE,
                            "GRIStd": that.EnvModel.getData().results[i].GRIStd,
                            "SDG": that.EnvModel.getData().results[i].SDG,
                            "Class": that.EnvModel.getData().results[i].Class,
                            "RenNon": that.EnvModel.getData().results[i].RenNon,
                            "FValue": 0.0,
                            "FValue1": 0.0
                        }
                       // var oTableName = "Environment_Report_Telecom";                        
                        OData.create('/Environment_Report', jsonSustain, null, function () {
                            sap.m.MessageToast.show('The details submitted Successfully!!!');
                        }, function () {
                            alert("Create failed");
                        });
                    }
                }
            },

            onPressGo: function (event) {
                var that = this;
                this.KPIListModel = new sap.ui.model.json.JSONModel();

                var oBusyDialog = new sap.m.BusyDialog({});
                oBusyDialog.open();

                //var url1= "/"+ this.GlobalIndustryModel.getData().KPIListTable;
                 var OData = this.getOwnerComponent().getModel("dataModel");
                // this.OData.read(url1, {
                this.OData.read("/KPIList", {
                //this.OData.read("/KPIList_Ports", {

                    success: function (data, oResponse) {
                        oBusyDialog.close();
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().byId("KPISubType").setModel(ListModel, "KPIModel");
                        that.getView().byId("KPI").setModel(ListModel, "KPIModel");
                        that.KPIListModel.setData(data);
                        console.log(that.KPIListModel);
                        that._getKPITypes();
                        that._getKPISubTypes();
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

                        var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;                          

                        //Location
                         /*var Value = "Location_"+  Industry;                                  
                            var filter1 = new sap.ui.model.Filter({ path: "ID", operator: sap.ui.model.FilterOperator.EQ, value1: Value });               
                            var oTable_Location = that.getView().byId("box1");                
                            var oBinding_Loc = oTable_Location.getBinding("items");
                            oBinding_Loc.filter(filter1);*/
                           // that.getView().byId("box1").getModel("EnvModel").refresh(true);
                            //Division
                           /* var Div_Value = "Division_"+  Industry;       
                            console.log("Value"+Value);                
                            var filter1 = new sap.ui.model.Filter({ path: "ID", operator: sap.ui.model.FilterOperator.EQ, value1: Div_Value });               
                            var oTable_Division = that.getView().byId("box0");                
                            var oBinding_Div = oTable_Division.getBinding("items");
                            oBinding_Div.filter(filter1);*/

                           /* if(Industry === "IT")
                                that.getView().byId("lblLocation").setText("Location");                               
                                that.getView().byId("box1").setSelectedKey("Bangalore - TMEC");
                                that.getView().byId("box0").setSelectedKey("ACME Industries");
                            }else if(Industry === "Telecom"){
                                that.getView().byId("lblLocation").setText("Circle");                              
                                that.getView().byId("box1").setSelectedKey("Maharashtra");
                                that.getView().byId("box0").setSelectedKey("Bharti Airtel Limited");
                            }*/

                        //that.getView().byId("currency").setModel(ListModel, "ConstantsModel");//currency 
                        //that.getView().byId("currency_Table6").setModel(ListModel, "ConstantsModel");//currency //table 6

                        //that.getView().byId("currency_Table2").setModel(ListModel, "ConstantsModel");//currency 
                        //that.getView().byId("currency_Table3").setModel(ListModel, "ConstantsModel");//currency 
                        //that.getView().byId("currency_Table4").setModel(ListModel, "ConstantsModel");//currency  -- Table 4
                        //that.getView().byId("currency_Table5").setModel(ListModel, "ConstantsModel");//currency   -- Table 5

                        //    that.getView().byId("envTable2Currency").setModel(ListModel, "ConstantsModel");//currency 

                        //that.getView().byId("month").setModel(ListModel, "ConstantsModel");//month

                        //that.getView().byId("month_Template5").setModel(ListModel, "ConstantsModel");//month - Table 5

                        //that.getView().byId("month_Template6").setModel(ListModel, "ConstantsModel");//month - Table 6

                        //that.getView().byId("Class").setModel(ListModel, "ConstantsModel");//Class - Emission Factors 

                        //that.getView().byId("box0").setModel(ListModel, "ConstantsModel");//Division 
                        //that.getView().byId("box1").setModel(ListModel, "ConstantsModel");//Location
                        //that.getView().byId("box2").setModel(ListModel, "ConstantsModel");//Year
                        

                    },
                    error: function (err) {
                        console.log("Error");
                    }
                });
                //var url1= "/"+ this.GlobalIndustryModel.getData().UOM_Telecom;
                var url1= "/UOM";
                this.OData.read(url1, {
               // this.OData.read("/UOM", {
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().byId("cbUnitTable1").setModel(ListModel, "UOMListModel");//Table1
                        that.getView().byId("cbUnitTable2").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUnit1Table3").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUnit2Table3").setModel(ListModel, "UOMListModel");
                        //Added for Unts in Table 4
                        that.getView().byId("cbUnit1Table4").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUnit2Table4").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUnitTable6_1").setModel(ListModel, "UOMListModel");
                        that.getView().byId("cbUnitTable6_2").setModel(ListModel, "UOMListModel");


                    },
                    error: function (err) {
                        MessageBox.error("Error");
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
                        //Division Filter Combo Box
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
               // filters: [filter1],

                //this.OData.read("/Location_Telecom", {
                this.OData.read("/Location", {
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().setModel(ListModel, "locationModel");
                        //that.getView().byId("box1").setModel(ListModel, "locationModel");

                        var oTable_Location = that.getView().byId("box1");                
                        var oBinding_Loc = oTable_Location.getBinding("items");
                        oBinding_Loc.filter(filter1);
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });

                this.calloData_Year();      
                this.calloData_MeasureValidation1();

                var Industry = this.GlobalIndustryModel.getData().Industry;  
                if(Industry === "IT"){
                    this.getView().byId("lblLocation").setText("Location");                  
                }else if(Industry === "Telecom"){
                        this.getView().byId("lblLocation").setText("Circle");                      
                }

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

            onUpdateFinished:function(){                
                var Industry = this.GlobalIndustryModel.getData().Industry;                  
                //Location Label Text
                if(Industry === "IT"){
                    this.getView().byId("lblLocation").setText("Location");
                }else if(Industry === "Telecom"){
                        this.getView().byId("lblLocation").setText("Circle");
                }                 
            },
            onChangeYear: function (event){
                //Display year From & To date
                var a = this.getView().byId("box2").getModel("yearModel").getData().results;
                var b = this.getView().byId("box2").getSelectedKey();
                var c = "";
                var s = "", e="";
                
                for(var i=0;i<a.length;i++){
                    if(a[i].fiscal === b){                       
                        s = a[i].StartDate
                        e = a[i].EndDate
                        c = a[i].YearA
                    }
                }                
               
                this.getView().byId("dateDisp").setText("("+s+" to "+e+")");
                this.StartDate=s;
                this.EndDate=e;
                this.yearA=c;

                var split = s.split('-');
                var element1 = split[0];
                var element2 = split[1];
                var element3 = split[2];                
                console.log("element2:"+element2);
                
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

            _getUOMComboBoxValues: function () {

                var filter1 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: this.KPIMeasure })];
                var filter2 = [new sap.ui.model.Filter({ path: "Measure", operator: sap.ui.model.FilterOperator.EQ, value1: this.KPIMeasure2 })];
              
                var oUOMListModel = this.getView().byId("cbUnitTable1").getModel("UOMListModel");
                var oUOMListModel1 = this.getView().byId("cbUnitTable2").getModel("UOMListModel");
                var oUOMListModel2 = this.getView().byId("cbUnit1Table3").getModel("UOMListModel");
                var oUOMListModel3 = this.getView().byId("cbUnit2Table3").getModel("UOMListModel");
                var oUOMListModel3 = this.getView().byId("cbUnitTable6_1").getModel("UOMListModel");
                var oUOMListModel3 = this.getView().byId("cbUnitTable6_2").getModel("UOMListModel");

                var oItems = new sap.ui.core.ListItem({
                    key: "{UOMListModel>Abbreviation}",
                    text: "{UOMListModel>Abbreviation}"
                });

                this.getView().byId("cbUnitTable1").bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter1
                });

                this.getView().byId("cbUnitTable2").bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter1
                });

                this.getView().byId("cbUnit1Table3").bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter1
                });

                this.getView().byId("cbUnit2Table3").bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter1
                });
                this.getView().byId("cbUnitTable6_1").bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter1
                });
                this.getView().byId("cbUnitTable6_2").bindAggregation("items", {
                    path: 'UOMListModel>/results',
                    template: oItems,
                    filters: filter2
                });
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
                //this.KPITypeSelected = jsonModel.getData()[0];//commented on 22 Feb                
                var idx = oRadioBtn.getSelectedIndex();//added on 22 Feb
                this.KPITypeSelected = jsonModel.getData()[idx];//added on 22 Feb
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
                oComboBoxKPI.bindAggregation("items", {
                    path: 'KPIModel>/results',
                    template: oItems,
                    filters: oFilter1
                });
                this.KPI = oComboBoxKPI.getFirstItem().getKey();

                oComboBoxKPI.setSelectedKey(oComboBoxKPI.getFirstItem().getKey()); //set the KPI combo box with first KPI
                this._populateKPITableData();
            },
            _populateKPITableData: function () {
                var that = this;
                //  var OData = this.getOwnerComponent().getModel("dataModel");

                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;

                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Division", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box0").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "fiscal", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: "" + this.KPITypeSelected }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("KPISubType").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "KPI", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("KPI").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Industry", operator: sap.ui.model.FilterOperator.EQ, value1: Industry })
                    ], and: true
                });
                console.log(oFilter1);
                ///check for template...mickey
                this._getKPITemplate();
                console.log(this.template);               


                //switch stmt
                //var oTableName = "/" + this.GlobalIndustryModel.getData().TransactionTable;
                var oTableName = "/Environment_Report";
                     
                switch (this.template) {
                    case "Table 1":
                        //  case "Table 2":
                        //var oTableName = "/" + this.GlobalIndustryModel.getData().TransactionTable;
                        
                        //   var oTableName = "/Environment_Report";
                        //var oTableName = "/Environment_Report_Ports";

                        var oTableID = this.getView().byId("EnvTable");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        that.getView().byId("EnvTable").setVisible(true);
                        this.getView().byId("EnvTable2").setVisible(false);
                        this.getView().byId("EnvTable3").setVisible(false);
                        this.getView().byId("EnvTable4").setVisible(false);
                        this.getView().byId("EnvTable5").setVisible(false);
                        this.getView().byId("Table6").setVisible(false);
                        break;
                    case "Table 2":
                       // var oTableName = "/Environment_Report";
                        var oTableID = this.getView().byId("EnvTable2");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        this.getView().byId("EnvTable").setVisible(false);
                        this.getView().byId("EnvTable2").setVisible(true);
                        this.getView().byId("EnvTable3").setVisible(false);
                        this.getView().byId("EnvTable4").setVisible(false);
                        this.getView().byId("EnvTable5").setVisible(false);
                        this.getView().byId("Table6").setVisible(false);
                        break;

                    case "Table 3":
                     //   var oTableName = "/Environment_Report3";
                        var oTableID = this.getView().byId("EnvTable3");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        this.getView().byId("EnvTable").setVisible(false);
                        this.getView().byId("EnvTable2").setVisible(false);
                        this.getView().byId("EnvTable3").setVisible(true);
                        this.getView().byId("EnvTable4").setVisible(false);
                        this.getView().byId("EnvTable5").setVisible(false);
                        this.getView().byId("Table6").setVisible(false);
                        break;
                    case "Table EUI":
                        var oTableName = "/Environment_EUI_Ports";
                        var oTableID = this.getView().byId("EnvTable4");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        //this._callTemplate1(oFilter1);
                        this.getView().byId("EnvTable").setVisible(false);
                        this.getView().byId("EnvTable2").setVisible(false);
                        this.getView().byId("EnvTable3").setVisible(false);
                        this.getView().byId("EnvTable4").setVisible(true); //Table EUI
                        this.getView().byId("EnvTable5").setVisible(false);
                        this.getView().byId("Table6").setVisible(false);
                        break;
                    case "Table RTG":
                    case "Table 6":
                        //   var oTableName = "/Environment_RTG_Ports";
                        //var oTableName = "/Environment_Report_Ports";
                       // var oTableName = "/Environment_Report";
                        var oTableName = "/" + this.GlobalIndustryModel.getData().TransactionTable;
                        

                        //   var oTableID = this.getView().byId("EnvTable5");
                        var oTableID = this.getView().byId("Table6");
                        this._callTemplate1(oFilter1, oTableName, oTableID);

                        if (this.Measure === "No Selection") {
                            this.getView().byId("cbUnitTable6_1").setEditable(false);
                        }
                        if (this.Measure2 === "No Selection") {
                            this.getView().byId("cbUnitTable6_2").setEditable(false);
                        }
                        //this._callTemplate1(oFilter1);
                        this.getView().byId("EnvTable").setVisible(false);
                        this.getView().byId("EnvTable2").setVisible(false);
                        this.getView().byId("EnvTable3").setVisible(false);
                        this.getView().byId("EnvTable4").setVisible(false);
                        this.getView().byId("EnvTable5").setVisible(false);
                        this.getView().byId("Table6").setVisible(true);

                        break;
                }

                //start - Disable Unit & Cost columns in Table1 when Measure is blank
                
              /*  var oKPIModelData = KPIModel.getData().results;
                var table = this.getView().byId("EnvTable");
                for (var j = 0; j < oKPIModelData.length; j++) {
                    if (oKPIModelData[j].Measure === "") {
                        
                    }
                }*/
                //end
            },
            //call template 1
            _callTemplate1: function (oFilter1, oTableName, oTableID, ) {
                this._getUOMComboBoxValues();
                var that = this;
                this.EnvModel = new sap.ui.model.json.JSONModel();
                this.OData.read(oTableName, {
                    filters: [oFilter1],
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.EnvModel.setData(data);

                        var supplier=[], supplier1=[];

                        var length = data.results.length;
                        for (var i = 0; i < length; i++) {
                            that.EnvModel.getData().results[i].isExistingRow = true;
                            that.EnvModel.getData().results[i].isNewRow = false;

                            supplier.push(that.EnvModel.getData().results[i].supplier);
                        }
                        //vendor
                      /*  let uniqueArr = [...new Set(supplier)];
                        console.log("supplier:"+uniqueArr);                        
                        for (var j = 0; j < uniqueArr.length; j++) {
                            var object = {};
                            object.vendor = uniqueArr[j];
                            supplier1.push(object);
                        }
                        console.log("supplier:"+supplier1);
        
                        var jsondata1 = {
                            items: supplier1
                        };

                        var jsonModel1 = new sap.ui.model.json.JSONModel();
                        jsonModel1.setData(jsondata1);
                        console.log(jsondata1);
                        var oComboBox = that.getView().byId("vendor");
                        oComboBox.setModel(jsonModel1);
                        oComboBox.bindAggregation("items"
                            , "/items", new sap.ui.core.ListItem({
                                text: "{vendor}",
                                key: "{vendor}"
                            }));
                        that.getView().byId("vendor").setSelectedKey(uniqueArr[0]);*/
                        //vendor

                        // that.getView().byId("EnvTable").setVisible(true);
                        //  that.getView().byId("EnvTable").setModel(that.EnvModel, "EnvModel");


                        //   oTableID.setModel(that.EnvModel, "EnvModel");
                        that._setTableData(oTableID);

                    },
                    error: function (err) {
                        // MessageBox.error("Error");
                        //    oBusyDialog.close();
                    }
                });
            },
            _setTableData: function (oTableID) {
                oTableID.setModel(this.EnvModel, "EnvModel");
            },
            //get template and scope for seleced KPI
            _getKPITemplate: function () {
                //this.KPIListModel
                var len = this.KPIListModel.getData().results.length;
                for (var i = 0; i < len; i++) {
                    var data = this.KPIListModel.getData().results[i];
                    if (data.Type === this.KPITypeSelected && data.SubType === this.KPISubtypeSelected && data.KPI === this.KPI) {
                        console.log("KPI match found" + data.KPI);
                        this.scope = data.Scope;
                        this.template = data.Template;
                        this.KPIMeasure = data.Measure;//uom type 1
                        //this.KPILogic = data.Logic;
                        this.KPILogic = data.EmissionLogic;
                        this.KPIGRIStd = data.GRIStd;
                        this.KPISDG = data.SDG;
                        this.KPIClass = data.Class;
                        this.KPIRenNon = data.RenNon;
                        this.KPIMeasure2 = data.Measure2;//uom type 2
                        this.Standard1 = data.Standard1; //Standard1
                        //this.LogicE = data.LogicE;//LogicE
                        this.LogicE = data.EnergyLogic;//LogicE
                        break;
                    }
                    else continue;
                }
            },

            onChangeKPI: function (event) {
                this.KPI = event.getParameters().selectedItem.getProperty("key");
                console.log("onChangeKPI:" + this.KPI);
                this._populateKPITableData();
            },
            onChangeVendor: function (event) {
                var that=this;
                this.vendor = event.getParameters().selectedItem.getProperty("key");
                console.log("onChangeVendor:" + this.vendor);

                var oFilter1 = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: "Division", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box0").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Location", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box1").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "fiscal", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("box2").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "Type", operator: sap.ui.model.FilterOperator.EQ, value1: "" + this.KPITypeSelected }),
                        new sap.ui.model.Filter({ path: "SubType", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("KPISubType").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "KPI", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("KPI").getSelectedKey() }),
                        new sap.ui.model.Filter({ path: "supplier", operator: sap.ui.model.FilterOperator.EQ, value1: that.getView().byId("vendor").getSelectedKey() })
                    ], and: true
                });
                //this._populateKPITableData();
                var oList = that.getView().byId("EnvTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(oFilter1);
                that.getView().byId("EnvTable").getModel("EnvModel").refresh(true);
            },
            //on KPI type chnage
            onSelect_Radiobutton_KPIType: function (oEvent) {
                var that = this;
                var txt = oEvent.getSource().getButtons()[oEvent.getParameter("selectedIndex")].getText();
                this.KPITypeSelected = txt;
                console.log("txt:" + txt);
                that._getKPISubTypes();

            },
            //on KPI Subtype chnage
            onChange_ComboBox_KPISubType: function (oEvent) {
                var that = this;
                var selText = oEvent.getParameter("selectedItem").getText();
                this.KPISubtypeSelected = selText;
                this._getKPIs(); //filter and populate all KPI for the selected SubType
            },
            OnPressAddNewEntry: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var Scope = this.Scope;

                var arr = { "results": [] };
                arr.results = [{
                    "Month": "", "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Value": "", "Unit": "", "Cost": "", "Currency": "",
                    "Quality": "", "Comment": "", "Owner": "", "Approver": "", "isNewRow": true, "isExistingRow": false, "Scope": "" + Scope, "supplier": "", "url": "", "Industry": ""
                }];
                that.getView().byId("EnvTable").getModel("EnvModel").getData().results = that.getView().byId("EnvTable").getModel("EnvModel").getProperty("/results").concat(arr.results);
                that.getView().byId("EnvTable").getModel("EnvModel").refresh(true);
            },
            OnPressAddNewEntryEnvTable2: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var Scope = this.Scope;

                var arr = { "results": [] };
                arr.results = [{
                    "Sno": "", "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Date": "", "Value": "", "Unit": "", "Cost": "", "Currency": "",
                    "Class": "", "Quality": "", "Comment": "", "Owner": "", "Approver": "", "isNewRow": true, "isExistingRow": false, "Scope": "" + Scope
                }];
                that.getView().byId("EnvTable2").getModel("EnvModel").getData().results = that.getView().byId("EnvTable2").getModel("EnvModel").getProperty("/results").concat(arr.results);
                // that.getView().byId("EnvTable2").getModel("EnvModel").refresh(true);               


                var index = that.getView().byId("EnvTable2").getModel("EnvModel").oData.results.length;
                that.getView().byId("EnvTable2").getModel("EnvModel").oData.results[index - 1].Sno = index;
                that.getView().byId("EnvTable2").getModel("EnvModel").refresh(true);

            },
            OnPressAddNewEntryEnvTable3: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var Scope = this.Scope;

                var arr = { "results": [] };
                arr.results = [{
                    "Sno": "", "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Date": "", "Distance": "", "Unit1": "", "Weight": "", "Unit2": "",
                    "Cost": "", "Currency": "", "Transport": "", "Quality": "", "Comment": "", "Owner": "", "Approver": "", "isNewRow": true,
                    "isExistingRow": false, "Scope": "" + Scope
                }];
                that.getView().byId("EnvTable3").getModel("EnvModel").getData().results = that.getView().byId("EnvTable3").getModel("EnvModel").getProperty("/results").concat(arr.results);

                var index = that.getView().byId("EnvTable3").getModel("EnvModel").oData.results.length;
                that.getView().byId("EnvTable3").getModel("EnvModel").oData.results[index - 1].Sno = index;
                that.getView().byId("EnvTable3").getModel("EnvModel").refresh(true);

            },
            OnPressAddNewEntryEnvTable4: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var Scope = this.Scope;

                var arr = { "results": [] };
                arr.results = [{
                    "Site": "", "Type": "" + Type, "SubType": "" + subType, "KPI": "", "ValueE": "", "Unit1": "", "Cost": "",
                    "Currency": "", "ValueA": "", "Unit2": "", "Quality": "", "Comment": "", "Owner": "", "Approver": "",
                    "isNewRow": true, "isExistingRow": false, "Scope": "" + Scope
                }];
                that.getView().byId("EnvTable4").getModel("EnvModel").getData().results = that.getView().byId("EnvTable4").getModel("EnvModel").getProperty("/results").concat(arr.results);
                that.getView().byId("EnvTable4").getModel("EnvModel").refresh(true);

            },
            OnPressAddNewEntryEnvTable5: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var Scope = this.Scope;

                var arr = { "results": [] };
                arr.results = [{
                    "Month": "", "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Value": "", "Cost": "", "Currency": "",
                    "Quality": "", "Comment": "", "Owner": "", "Approver": "", "isNewRow": true, "isExistingRow": false, "Scope": "" + Scope
                }];
                that.getView().byId("EnvTable5").getModel("EnvModel").getData().results = that.getView().byId("EnvTable5").getModel("EnvModel").getProperty("/results").concat(arr.results);
                that.getView().byId("EnvTable5").getModel("EnvModel").refresh(true);

            },
            OnPressAddNewEntryTable6: function (event) {
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var Scope = this.Scope;

                var arr = { "results": [] };
                arr.results = [{
                    "Month": "", "Type": "" + Type, "SubType": "" + subType, "KPI": "", "Value": "", "Unit": "", "Value2": "", "Unit2": "", "Cost": "", "Currency": "",
                    "Quality": "", "Comment": "", "Owner": "", "Approver": "", "isNewRow": true, "isExistingRow": false, "Scope": "" + Scope
                }];
                that.getView().byId("Table6").getModel("EnvModel").getData().results = that.getView().byId("Table6").getModel("EnvModel").getProperty("/results").concat(arr.results);
                that.getView().byId("Table6").getModel("EnvModel").refresh(true);

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
                //window.open("./documents/ENVIRONMENT_REPORT_PORTS.csv");
                //window.open("./documents/Template1.csv");
                window.open("./documents/Table1.xlsx");
            },
            onChangeMonth: function (oEvent) {
                console.log(oEvent);
                var selText = oEvent.getParameter("selectedItem").getText();
                var newRow = parseInt(oEvent.getParameter("id").substring(oEvent.getParameter("id").lastIndexOf("clone") + 5));
                var results = this.getView().byId("EnvTable").getModel("EnvModel").getData().results;
                console.log(selText);
                this.UserInputMonth = selText;
            },
            onChangeCurrency: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(selText);
                this.UserInputCurrency = selText;
            },
            
            onChangeUnit: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log("onChangeUnit"+selText);
                this.Unit1 = selText;
            },
            onChangeUnit1: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(""+selText);
                this.Unit1 = selText;
            },
            onChangeUnit2: function (oEvent) {
                var selText = oEvent.getParameter("selectedItem").getText();
                console.log(""+selText);
                this.Unit2 = selText;
            },
            formatQuality: function (Value) {
                if (Value === "OK") {
                    return true;
                } else {
                    return false;
                }
            },
            formatDate: function (Value) {
                if (Value !== null && Value !== "") {
                    //var ds = "Mon Jul 03 2017 00:00:00 GMT+0530 (India Standard Time)";
                   // var date1 = Value.toDateString();
                   // var date = new Date(Value.substr(0, 16));
                   //return (date1.format("DD-MMM-YYYY"));
                   //added on 25.11
                   var str = Value;
                   var date = new Date(str),
                   mnth = ("0" + (date.getMonth()+1)).slice(-2),
                   day  = ("0" + date.getDate()).slice(-2),                   
                   year = date.getFullYear();
                  // return `${year}-${mnth}-${day}`
                  var date = new Date(`${year}-${mnth}-${day}`);

                    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd"
                    });
                    var fdateFormatted = dateFormat.format(date);

                   return fdateFormatted
                   //end
                   

                    /* var d3 = Value.getFullYear();
                     var m1 = Value.getMonth()+1;
                     var d4 = d3+"-"+m1+"-"+Value.getDate();
                     var d5 = new Date(d4);
                     return d5;
                     var Fdate = new Date(Value);
                     var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                         pattern: "yyyy-MM-dd"
                     });
                     return dateFormat.format(Fdate);*/

                } else {
                    return Value;
                }
            },
            onPressSubmit: function (event) {                

                this.batchModel = this.getOwnerComponent().getModel("dataModel");
                this.batchModel.setUseBatch(true);
                this.batchChanges = [];
                var that = this;

                if (this.template === "Table 1") {
                    this.onCreateEntry_Table1();
                    this.onUpdateEntry_Table1();                    
                    this.batchModel.submitChanges({
                        success: function (data, response) {
                            sap.m.MessageBox.show(
                                "Request has been submitted successfully! ", {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: "Success",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                }
                            });
                        },
                        error: function (e) {
                            sap.m.MessageBox.show(
                                "Unable to reach server. Please try again later! ", {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: "Success",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                }
                            });
                        }
                    });
                }
                else if (this.template === "Table 2") {
                    this.onCreateEntry_Table2();
                    this.onUpdateEntry_Table2();                   
                    this.batchModel.submitChanges({
                        success: function (data, response) {
                            sap.m.MessageBox.show(
                                "Request has been submitted successfully! ", {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: "Success",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                }
                            });
                        },
                        error: function (e) {
                            sap.m.MessageBox.show(
                                "Unable to reach server. Please try again later! ", {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: "Success",
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                }
                            });
                        }
                    });
                }
                else if (this.template === "Table 3") {
                    this.onCreateEntry_Table3();
                    this.onUpdateEntry_Table3();
                    if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitBatch();
                        this.batchModel.refresh();
                        this.getView().byId("EnvTable3").getModel("EnvModel").refresh(true);
                    }
                    else console.log("No Record present for Database Operation");
                }
                else if (this.template === "Table EUI") {
                    this.onCreateEntry_Table4();
                    this.onUpdateEntry_Table4();
                    if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitBatch();
                        this.batchModel.refresh();
                        this.getView().byId("EnvTable4").getModel("EnvModel").refresh(true);
                    }
                    else console.log("No Record present for Database Operation");
                }
                else if (this.template === "Table RTG") {
                    this.onCreateEntry_Table1();
                    this.onUpdateEntry_Table1();
                    if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitBatch();
                        this.batchModel.refresh();
                        this.getView().byId("EnvTable5").getModel("EnvModel").refresh(true);
                    }
                    else console.log("No Record present for Database Operation");
                }
                else if (this.template === "Table 6") {
                    this.onCreateEntry_Table1();
                    this.onUpdateEntry_Table1();
                    if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitBatch();
                        this.batchModel.refresh();
                        this.getView().byId("Table 6").getModel("EnvModel").refresh(true);
                    }
                    else console.log("No Record present for Database Operation");

                }
                else if (this.template === "Table RTG1") {
                    this.onCreateEntry_Table1();
                    this.onUpdateEntry_Table1();

                    if (this.batchChanges.length > 0) {
                        this.batchModel.addBatchChangeOperations(this.batchChanges); //exisitng records
                        this.batchModel.submitChanges({
                            success: function (data, response) {
                                sap.m.MessageBox.show(
                                    "Request has been submitted successfully! ", {
                                    icon: sap.m.MessageBox.Icon.INFORMATION,
                                    title: "Success",
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                    }
                                });
                            },
                            error: function (e) {
                                sap.m.MessageBox.show(
                                    "Unable to connect to server, try again later ", {
                                    icon: sap.m.MessageBox.Icon.INFORMATION,
                                    title: "Success",
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                    }
                                });
                            }
                        });                        
                        this.batchModel.refresh();
                        this.getView().byId("EnvTable5").getModel("EnvModel").refresh(true);
                    }
                    else console.log("No Record present for Database Operation");
                }
            },
            onCreateEntry_Table1: function (event) {
                console.log("on submit"+this.flag);
                if(this.flag === "template"){
                    this.onPressTemplateUpload();
                }else{
                
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected;
                var UserInputMonth = this.UserInputMonth; //template 1
                var UserInputCurrency = this.UserInputCurrency;
                var kpi = this.getView().byId("KPI").getSelectedKey();             
                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;   

                //   var EnvModel = that.getView().byId("EnvTable").getModel("EnvModel");
                if (this.template === "Table 6") {
                    var EnvModel = that.getView().byId("Table6").getModel("EnvModel");
                }
                else {
                    var EnvModel = that.getView().byId("EnvTable").getModel("EnvModel");
                }
                var OData = this.getOwnerComponent().getModel("dataModel");
                var Scope = this.Scope;
                var unit1 = this.Unit1;
                var unit2 = this.Unit2;
                
                var fiscalType="";
                if(that.getView().byId("box2").getSelectedKey().length === 3){
                    fiscalType=true;
                }else{
                    fiscalType=false;
                }
                
                //if monthe < Dec pass yearL, else yearR
             
                console.log("monthArr:"+this.monthArr);
                //RTG

                //File Upload - Manual Entry                
                /*console.log("len:"+that.FileArr.length);                
                for(var j=0; j<that.EnvModel.getData().results.length; j++){
                    if (that.EnvModel.getData().results[j].isNewRow){
                        that.EnvModel.getData().results[j].url = that.FileArr[0];                        
                        that.FileArr.shift();
                    }                    
                }
                console.log("EnvModel:"+that.EnvModel.getData().results);*/
                //end File upload======================================

                for (var i = 0; i < EnvModel.getData().results.length; i++) {
                    
                    if (EnvModel.getData().results[i].isNewRow) {         
                        
                        //May 05
                        //var fileLink = this.attachFile;
                        //console.log("fileLink:"+fileLink);
                        //end
                        
                        var yearL = this.monthArr.indexOf(EnvModel.getData().results[i].Month);
                        var yearR = this.yearArr[yearL];

                        //logicE not required for Network Traffic
                        var logicE = "";
                        if(Type === "NETWORK TRAFFIC"){
                            logicE = "";
                        }else{
                            logicE = this.LogicE
                        }
                       
                        console.log("Year:"+yearR);
                        //"supplier":"null", add next to sno
                        var jsonSustain =
                       {
                            "Industry": Industry, // Industry attribute
                            "Year": yearR, // change it to absolute value
                            "Month": "" + EnvModel.getData().results[i].Month,
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + Type,
                            "SubType": "" + subType,
                            "KPI": kpi,
                            "Value": parseFloat(EnvModel.getData().results[i].Value),
                           "Unit": EnvModel.getData().results[i].Unit, //test for table 1
                            "Cost": parseFloat(EnvModel.getData().results[i].Cost),
                            "Currency": "" + UserInputCurrency,
                            "Quality": "OK",
                            "Comment": EnvModel.getData().results[i].Comment,
                            "Owner": EnvModel.getData().results[i].Owner,
                            "Approver": EnvModel.getData().results[i].Approver,
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Sno": 0, // constant for logic 1                               
                            "url":EnvModel.getData().results[i].url,
                            "Date": null,
                            "Value2": parseFloat(EnvModel.getData().results[i].Value2), //added for table 6
                           "Unit2": EnvModel.getData().results[i].Unit2,//added for table 6
                            "Distance": null,
                            "Weight": null,
                            "Scope": this.Scope,
                            "Associates": null,
                            "Logic": this.KPILogic,//new field
                            "Measure": this.KPIMeasure,  //new field
                            "GRIStd": this.KPIGRIStd,//new field
                            "SDG": this.KPISDG,//new field
                            "Class": this.KPIClass,//new field - emission factors table
                            "RenNon": this.KPIRenNon,//new field added Reneable/non renewable
                            "FValue": 0.0,
                            "FValue1": 0.0,//new field for energy emissions
                            "FiscalType":fiscalType,
                            "YearA": this.yearA,
                            "fiscal": that.getView().byId("box2").getSelectedKey(),
                            "isValidationRequired": false,
                            "StartDate":this.StartDate,
                            "EndDate":this.EndDate,
                            "Standard1":this.Standard1,
                            "LogicE":logicE                         
                        }
                console.log("jsustain");
                console.log(jsonSustain);
                var oTableName = this.GlobalIndustryModel.getData().TransactionTable;
                       //var url1= "/" + oTableName;
                       var url1= "/Environment_Report";

                        that.batchModel.create(url1, jsonSustain, {
                     //  that.batchModel.create("/Environment_Report", jsonSustain, {
                            method: "POST",
                            success: function (data) {
                                
                            },
                            error: function (e) {

                            }
                        });

                        //call create service
                        //****************************batch call start
                        //  if (jsonSustain !== null || jsonSustain !== undefined || jsonSustain !== ""){
                        //that.batchChanges.push(that.batchModel.createBatchOperation("Environment_Report_Ports", "POST", jsonSustain)); //new records
                        //  }
                    }
                    console.log(that.batchModel);
                }
            }
            },
            handleEditBtn:function(oEvent){
                var that = this;
                var tableId = "EnvTable";                       
                var hanaTableName = "Environment_Report";                       
                var KPIListModel = this.getView().byId(tableId).getModel("EnvModel"); // total rows in the table
                var rowItems = this.getView().byId(tableId).getSelectedItems(); //selected row in the table

                var Type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var location = that.getView().byId("box1").getSelectedKey();
                var Division = that.getView().byId("box0").getSelectedKey();

                for (var i = 0; i < rowItems.length; i++) {
                    var month = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                    for (var j = 0; j < KPIListModel.getData().results.length; j++) {
                        if ((Type === KPIListModel.getData().results[j].Type ) 
                            && (subType === KPIListModel.getData().results[j].SubType) 
                            && (kpi === KPIListModel.getData().results[j].KPI)
                            && (location === KPIListModel.getData().results[j].Location)
                            && (Division === KPIListModel.getData().results[j].Division)
                            && (month === KPIListModel.getData().results[j].Month)){
                                KPIListModel.getData().results[j].isEditableRow = true;                                                                      
                            break;
                        }
                        else continue;
                    }   
                }
                KPIListModel.refresh(true); 
                that.getView().byId("btn2").setEnabled(true);
            },
            handleResetBtn:function(oEvent){
                var that = this;
                
                var tableId = "EnvTable";                       
                var hanaTableName = "Environment_Report";                       
                var KPIListModel = this.getView().byId(tableId).getModel("EnvModel"); // total rows in the table
                var rowItems = this.getView().byId(tableId).getSelectedItems(); //selected row in the table

                var Type = this.KPITypeSelected;
                var subType = this.KPISubtypeSelected;
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var location = that.getView().byId("box1").getSelectedKey();
                var Division = that.getView().byId("box0").getSelectedKey();

                for (var i = 0; i < rowItems.length; i++) {
                    var month = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                    for (var j = 0; j < KPIListModel.getData().results.length; j++) {
                        if ((Type === KPIListModel.getData().results[j].Type ) 
                            && (subType === KPIListModel.getData().results[j].SubType) 
                            && (kpi === KPIListModel.getData().results[j].KPI)
                            && (location === KPIListModel.getData().results[j].Location)
                            && (Division === KPIListModel.getData().results[j].Division)
                            && (month === KPIListModel.getData().results[j].Month)){
                                KPIListModel.getData().results[j].isEditableRow = false;                                                                      
                            break;
                        }
                        else continue;
                    }   
                }
                KPIListModel.refresh(true); 
            },
            onUpdateEntry_Table1: function () {
                console.log("on submit");
                var that = this;

                var Industry = sap.ui.getCore().getModel("GlobalIndustryModel").getData().Industry;
                var Industry1 = "" + Industry;

                var yr = that.getView().byId("box2").getSelectedKey();
                var loc = (that.getView().byId("box1").getSelectedKey()).toString();

                var subType = this.KPISubtypeSelected + "";
                var Type = this.KPITypeSelected + "";
                var kpi = this.getView().byId("KPI").getSelectedKey() + "";

                if (this.template === "Table RTG") {
                    var table = this.getView().byId("EnvTable5");
                }
                else {
                    var table = this.getView().byId("EnvTable");
                }

                // var table = this.getView().byId("EnvTable");
                var rowItems = table.getSelectedItems();
                var oSelectedItems = { "items": [] }
                var oSno = parseInt(0);

                for (var i = 0; i < rowItems.length; i++) {
                    //add
                        var yearL = this.monthArr.indexOf(rowItems[i].getCells()[0].mAggregations.items[0].getText());
                        var yearR = this.yearArr[yearL];
                        console.log("monthArr yearL:"+yearL);
                        console.log("monthArr yearR:"+yearR);
                    //end
                    var oValue = parseFloat(rowItems[i].getCells()[1].getValue());
                    if (this.template === "Table RTG") {
                        var oUnit = "kl";
                    }
                    else {

                        var oUnit = rowItems[i].getCells()[2].mAggregations.items[0].getValue() + ""; //will not work for table rtg
                    }
                    //var oUnit = rowItems[i].getCells()[2].mAggregations.items[1].getValue() + "";
                    var oMonth = rowItems[i].getCells()[0].mAggregations.items[0].getText() + ""
                    //  var oMonth = that.getView().byId("MonthMdl").getText();
                    console.log("oUnit:" + oUnit);                    
                   // var uri1 = "/Environment_Report(Industry='" + Industry + "',Year='" + yr + "',Month='" + oMonth + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "',Sno=" + oSno + ")";                    
                    var uri1 = "/Environment_Report(Industry='" + Industry + "',Year='" + yearR + "',Month='" + oMonth + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "',Sno=" + oSno + ")";                    

                    var uri = encodeURI(uri1);
                    that.batchModel.update(uri, { Value: oValue, Unit: oUnit }, {
                        method: "PUT",
                        success: function (data) {
                            /*sap.m.MessageBox.show(
                                "Request has been submitted successfully! ", {
                                    icon: sap.m.MessageBox.Icon.INFORMATION,
                                    title: "Success",
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                    
                                    }
                                }
                            );*/
                            that.getView().byId("EnvTable").getModel("EnvModel").refresh(true);
                        },
                        error: function (e) {

                        }
                    });
                    //that.batchModel.update(uri, "PATCH", { Value: oValue, Unit: oUnit }) ;               
                    //that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", { Value: oValue, Unit: oUnit }));
                }
                
            },

            onCreateEntry_Table2: function (event) {
                console.log("on submit");
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected;
                var UserInputMonth = this.UserInputMonth;
                var UserInputCurrency = this.UserInputCurrency;
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var EnvModel = that.getView().byId("EnvTable2").getModel("EnvModel");
                var OData = this.getOwnerComponent().getModel("dataModel");
                var Scope = this.Scope;


                //****************************batch call start

                var year = '2023';
                var sSrvUrlBatch = "/catalog/";
                var batchModel = new sap.ui.model.odata.ODataModel("/v2/catalog/", true);
                var batchChanges = [];
                //**********************batch call end****************
                var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                for (var i = 0; i < EnvModel.getData().results.length; i++) {
                    if (EnvModel.getData().results[i].isNewRow) {
                        var jsonSustain =
                        {
                            "Year": that.getView().byId("box2").getSelectedKey(),
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + Type,
                            "SubType": "" + subType,
                            "KPI": kpi,
                            "Value": parseFloat(EnvModel.getData().results[i].Value),
                            "Unit": EnvModel.getData().results[i].Unit,
                            "Cost": parseFloat(EnvModel.getData().results[i].Cost),
                            "Currency": EnvModel.getData().results[i].Currency,
                            "Class": EnvModel.getData().results[i].class,
                            "Quality": "OK",
                            "Comment": EnvModel.getData().results[i].Comment,
                            "Owner": EnvModel.getData().results[i].Owner,
                            "Approver": EnvModel.getData().results[i].Approver,
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Sno": parseInt(EnvModel.getData().results[i].Sno),
                            "Date": EnvModel.getData().results[i].Date,
                            "Value2": null,
                            "Unit2": null,
                            "Distance": null,
                            "Weight": null,
                            "Scope": this.Scope,
                            "Associates": null,
                            "Logic": this.KPILogic,//new field
                            "Measure": this.KPIMeasure,  //new field
                            "GRIStd": this.KPIGRIStd,//new field
                            "SDG": this.KPISDG,//new field
                            //"Class"      : this.KPIClass,//new field - emission factors table
                            "RenNon": this.KPIRenNon,//new field added Reneable/non renewable
                            "FValue": 0.0,
                            "FValue1": 0.0,//new field for energy emissions
                            "Month": month[new Date(EnvModel.getData().results[i].Date).getMonth()]
                        }


                        //call create service
                        //****************************batch call start
                        //batchChanges.push(batchModel.createBatchOperation("Environment_Report_Ports", "POST", jsonSustain)); //new records
                        batchChanges.push(batchModel.createBatchOperation("Environment_Report", "POST", jsonSustain)); //new records
                    }
                }

                batchModel.addBatchChangeOperations(batchChanges);
                batchModel.submitBatch();
                batchModel.refresh();
                //**********************batch call end****************
                console.log("jsonSustain:" + jsonSustain);


            },
            onUpdateEntry_Table2: function (event) {
                console.log("on submit");
                var that = this;

                var yr = that.getView().byId("box2").getSelectedKey();
                var loc = (that.getView().byId("box1").getSelectedKey()).toString();

                var subType = this.KPISubtypeSelected + "";
                var Type = this.KPITypeSelected + "";
                var kpi = this.getView().byId("KPI").getSelectedKey() + "";
                var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var table = this.getView().byId("EnvTable2");
                var rowItems = table.getSelectedItems();
                var oSelectedItems = { "items": [] }

                for (var i = 0; i < rowItems.length; i++) {
                    var oValue = parseFloat(rowItems[i].getCells()[2].getValue());
                    var oUnit = rowItems[i].getCells()[3].mAggregations.items[1].getValue() + "";
                    //var oUnit = rowItems[i].getCells()[3].getValue() + "";
                    var oSno = parseInt(rowItems[i].getCells()[0].getText());
                    var oMonth = month[new Date(rowItems[i].getCells()[1].getValue()).getMonth()];


                    var uri1 = "/Environment_Report(Month='" + oMonth + "',Year='" + yr + "',Sno=" + oSno + ",Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "')";
                    var uri = encodeURI(uri1);
                    console.log(uri);
                    //that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", { Value: oValue, Unit: oUnit }));
                    var uri = encodeURI(uri1);
                    that.batchModel.update(uri, { Value: oValue, Unit: oUnit }, {
                        method: "PUT",
                        success: function (data) {
                            /*sap.m.MessageBox.show(
                                "Request has been submitted successfully! ", {
                                    icon: sap.m.MessageBox.Icon.INFORMATION,
                                    title: "Success",
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                    
                                    }
                                }
                            );*/
                        },
                        error: function (e) {

                        }
                    });
                }
                console.log("oSelectedItems:" + oSelectedItems.items);

            },
            onCreateEntry_Table3: function (event) {
                console.log("on submit");
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected;
                var UserInputMonth = this.UserInputMonth;
                var UserInputCurrency = this.UserInputCurrency;
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var EnvModel = that.getView().byId("EnvTable3").getModel("EnvModel");
                var OData = this.getOwnerComponent().getModel("dataModel");
                var Scope = this.Scope;


                //****************************batch call start

                var year = '2023';
                var sSrvUrlBatch = "/catalog/";
                var batchModel = this.getOwnerComponent().getModel("dataModel");
                //var batchModel = new sap.ui.model.odata.ODataModel("/catalog/", true);
                var batchChanges = [];
                //**********************batch call end****************

                for (var i = 0; i < EnvModel.getData().results.length; i++) {
                    if (EnvModel.getData().results[i].isNewRow) {
                        var jsonSustain =
                        {
                            "Year": that.getView().byId("box2").getSelectedKey(),
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + Type,
                            "SubType": "" + subType,
                            "KPI": kpi,
                            "Distance": parseFloat(EnvModel.getData().results[i].Distance),
                            "Unit1": EnvModel.getData().results[i].Unit1,
                            "Weight": parseFloat(EnvModel.getData().results[i].Weight),
                            "Unit2": EnvModel.getData().results[i].Unit2,
                            "Cost": parseFloat(EnvModel.getData().results[i].Cost),
                            "Currency": EnvModel.getData().results[i].Currency,
                            "Transport": EnvModel.getData().results[i].Transport,
                            "Quality": "OK",
                            "Comment": EnvModel.getData().results[i].Comment,
                            "Owner": EnvModel.getData().results[i].Owner,
                            "Approver": EnvModel.getData().results[i].Approver,
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Sno": parseInt(EnvModel.getData().results[i].Sno),
                            "Date": EnvModel.getData().results[i].Date,
                            "FValue": 0.0
                        }


                        //call create service
                        //****************************batch call start
                        batchChanges.push(batchModel.createBatchOperation("Environment_Report3", "POST", jsonSustain)); //new records
                    }
                }

                batchModel.addBatchChangeOperations(batchChanges);
                batchModel.submitBatch();
                batchModel.refresh();
                //**********************batch call end****************
                console.log("jsonSustain:" + jsonSustain);
            },
            onUpdateEntry_Table3: function (event) {
                console.log("on submit");
                var that = this;

                var yr = that.getView().byId("box2").getSelectedKey();
                var loc = (that.getView().byId("box1").getSelectedKey()).toString();

                var subType = this.KPISubtypeSelected + "";
                var Type = this.KPITypeSelected + "";
                var kpi = this.getView().byId("KPI").getSelectedKey() + "";

                var table = this.getView().byId("EnvTable3");
                var rowItems = table.getSelectedItems();
                var oSelectedItems = { "items": [] }

                for (var i = 0; i < rowItems.length; i++) {
                    var oValue = parseFloat(rowItems[i].getCells()[2].getValue());
                    var oUnit = rowItems[i].getCells()[3].mAggregations.items[1].getValue() + "";
                    //var oUnit = rowItems[i].getCells()[3].getValue() + "";
                    var oSno = parseInt(rowItems[i].getCells()[0].getText());

                    var uri1 = "/Environment_Report3(Year='" + yr + "',Sno=" + oSno + ",Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "')";
                    var uri = encodeURI(uri1);
                    console.log(uri);
                    var uri = encodeURI(uri1);
                    that.batchModel.update(uri, { Value: oValue, Unit: oUnit }, {
                        method: "PUT",
                        success: function (data) {
                            /*sap.m.MessageBox.show(
                                "Request has been submitted successfully! ", {
                                    icon: sap.m.MessageBox.Icon.INFORMATION,
                                    title: "Success",
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                    
                                    }
                                }
                            );*/
                        },
                        error: function (e) {

                        }
                    });
                    //that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", { Distance: oValue, Unit1: oUnit }));
                }
                console.log("oSelectedItems:" + oSelectedItems.items);

            },
            onCreateEntry_Table4: function (event) {
                console.log("on submit table4");
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected;
                var UserInputMonth = this.UserInputMonth;
                var UserInputCurrency = this.UserInputCurrency;
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var EnvModel = that.getView().byId("EnvTable4").getModel("EnvModel");
                var OData = this.getOwnerComponent().getModel("dataModel");
                var Scope = this.Scope;

                for (var i = 0; i < EnvModel.getData().results.length; i++) {
                    if (EnvModel.getData().results[i].isNewRow) {
                        var jsonSustain =
                        {
                            "Year": that.getView().byId("box2").getSelectedKey(),
                            "Month": "May",
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + Type,
                            "SubType": "" + subType,
                            "KPI": kpi,
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Site": EnvModel.getData().results[i].Site,
                            "ValueE": parseFloat(EnvModel.getData().results[i].ValueE),
                            "Unit": EnvModel.getData().results[i].Unit,
                            "Cost": parseFloat(EnvModel.getData().results[i].Cost),
                            "Currency": "" + UserInputCurrency,
                            "Quality": "OK",
                            "Comment": EnvModel.getData().results[i].Comment,
                            "Owner": EnvModel.getData().results[i].Owner,
                            "Approver": EnvModel.getData().results[i].Approver,
                            "ValueA": parseFloat(EnvModel.getData().results[i].ValueA),
                            "Unit2": EnvModel.getData().results[i].Unit2
                        }
                        console.log(jsonSustain);
                        //call create service
                        //****************************batch call start
                        //  if (jsonSustain !== null || jsonSustain !== undefined || jsonSustain !== ""){
                        that.batchChanges.push(that.batchModel.createBatchOperation("Environment_EUI_Ports", "POST", jsonSustain)); //new records

                        //  }
                    }
                }

                that.batchModel.addBatchChangeOperations(that.batchChanges);
                that.batchModel.submitBatch();
                that.batchModel.refresh();
                //**********************batch call end****************
                console.log("jsonSustain:" + jsonSustain);

            },
            onUpdateEntry_Table4: function (event) {
                console.log("on submit");
                var that = this;

                var yr = that.getView().byId("box2").getSelectedKey();
                var loc = (that.getView().byId("box1").getSelectedKey()).toString();

                var subType = this.KPISubtypeSelected + "";
                var Type = this.KPITypeSelected + "";
                var kpi = this.getView().byId("KPI").getSelectedKey() + "";

                var table = this.getView().byId("EnvTable4");
                var rowItems = table.getSelectedItems();
                var oSelectedItems = { "items": [] }
                var oSno = parseInt(0);

                for (var i = 0; i < rowItems.length; i++) {
                    var oValue = parseFloat(rowItems[i].getCells()[1].getValue());
                    var oUnit = rowItems[i].getCells()[2].mAggregations.items[0].getText() + "";

                    var oMonth = "May";
                    var oSite = rowItems[i].getCells()[0].getValue() + "";

                    //   var uri1 = "Environment_Report(Sno=" + oSno + ",Year='" + yr + "',Month='" + oMonth + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "')";
                    var uri1 = "Environment_EUI_Ports(Site='" + oSite + "',Year='" + yr + "',Month='" + oMonth + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "')";

                    var uri = encodeURI(uri1);
                    that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", { ValueE: oValue, Unit: oUnit }));
                }
            },

            onCreateEntry_Table5: function (event) {
                console.log("on submit table5");
                var that = this;
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected;
                var UserInputMonth = this.UserInputMonth;
                var UserInputCurrency = this.UserInputCurrency;
                var kpi = this.getView().byId("KPI").getSelectedKey();
                var EnvModel = that.getView().byId("EnvTable5").getModel("EnvModel");
                //var OData = this.getOwnerComponent().getModel("dataModel");
                //OData.setUseBatch(true);
                var Scope = this.Scope;

                for (var i = 0; i < EnvModel.getData().results.length; i++) {
                    if (EnvModel.getData().results[i].isNewRow) {
                        var jsonSustain =
                        {
                            "Year": that.getView().byId("box2").getSelectedKey(),
                            "Month": EnvModel.getData().results[i].Month,
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + Type,
                            "SubType": "" + subType,
                            "KPI": kpi,
                            "Division": that.getView().byId("box0").getSelectedKey(),

                            "Value": parseFloat(EnvModel.getData().results[i].Value),

                            "Cost": parseFloat(EnvModel.getData().results[i].Cost),
                            "Currency": "" + UserInputCurrency,
                            "Quality": "OK",
                            "Comment": EnvModel.getData().results[i].Comment,
                            "Owner": EnvModel.getData().results[i].Owner,
                            "Approver": EnvModel.getData().results[i].Approver
                        }
                        console.log(jsonSustain);
                        that.batchChanges.push(that.batchModel.createBatchOperation("/Environment_RTG_Ports", "POST", jsonSustain));

                        /* OData.create("/Environment_RTG_Ports", jsonSustain, {
                             method: "POST",
                             success: function(data) {
                                 sap.m.MessageBox.show(
                                     "Request has been submitted successfully! ", {
                                         icon: sap.m.MessageBox.Icon.INFORMATION,
                                         title: "Success",
                                         actions: [sap.m.MessageBox.Action.OK],
                                         onClose: function (oAction) {
                                         
                                         }
                                     }
                                 );
                             },
                             error: function(e) {
                                
                             }
                         });*/

                        //call create service
                        //****************************batch call start
                        //  if (jsonSustain !== null || jsonSustain !== undefined || jsonSustain !== ""){
                        //that.batchChanges.push(that.batchModel.createBatchOperation("/Environment_RTG_Ports", "POST", jsonSustain)); //new records

                        //  }
                    }
                }

                /*   OData.submitChanges({
                       success: function(data, response) {
                           
                       },
                       error: function(e) {
                           
                       }
                   });*/

                // that.batchModel.addBatchChangeOperations(that.batchChanges);
                // that.batchModel.submitBatch();
                // that.batchModel.refresh();
                //**********************batch call end****************
                console.log("jsonSustain:" + jsonSustain);

            },
            onUpdateEntry_Table5: function (event) {
                console.log("on submit");
                var that = this;

                var yr = that.getView().byId("box2").getSelectedKey();
                var loc = (that.getView().byId("box1").getSelectedKey()).toString();


                var subType = this.KPISubtypeSelected + "";
                var Type = this.KPITypeSelected + "";
                var kpi = this.getView().byId("KPI").getSelectedKey() + "";

                var table = this.getView().byId("EnvTable5");
                var rowItems = table.getSelectedItems();
                var oSelectedItems = { "items": [] }
                var oSno = parseInt(0);

                for (var i = 0; i < rowItems.length; i++) {
                    var oValue = parseFloat(rowItems[i].getCells()[1].getValue());

                    //   var oUnit = rowItems[i].getCells()[2].mAggregations.items[0].getText() + "";                                      
                    var oMonth = rowItems[i].getCells()[0].mAggregations.items[0].getText() + ""

                    //var uri1 = "/Environment_Report_Ports(Year='" + yr + "',Month='" + oMonth + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "')";
                    var uri1 = "/Environment_Report(Year='" + yr + "',Month='" + oMonth + "',Location='" + loc + "',Type='" + Type + "',SubType='" + subType + "',KPI='" + kpi + "')";

                    var uri = encodeURI(uri1);

                    that.batchChanges.push(that.batchModel.createBatchOperation(uri, "PATCH", { Value: oValue, Unit: "kl" }));
                }
            },

            onPressTemplateUpload:function(event){
                var that=this;                
                var subType = this.KPISubtypeSelected;
                var Type = this.KPITypeSelected;
                var fiscalType="";
                if(that.getView().byId("box2").getSelectedKey().length === 3){
                    fiscalType=true;
                }else{
                    fiscalType=false;
                }
                
               /* var supplier="";
                for(var d=0; d<that.getView().getModel("dataExtractModel").getData().length; d++){
                    supplier=that.getView().getModel("dataExtractModel").getData()[d].name;
                }*/
                var supplierArr=[], k=0;
                for(var d=0; d<that.getView().getModel("dataExtractModel").getData().length; d++){
                    supplierArr.push(that.getView().getModel("dataExtractModel").getData()[d].name);
                }
                console.log("supplierArr:"+supplierArr);

                for(var j=0; j<that.EnvModel.getData().results.length; j++){
                    that.EnvModel.getData().results[j].supplier = supplierArr[0];                    
                    k++;
                    if(k == 12){
                        supplierArr.shift();
                    }                   
                }
                console.log("EnvModel:"+that.EnvModel.getData().results);

                this.batchChanges = [];
                this.batchModel = this.getOwnerComponent().getModel("dataModel");
                this.batchModel.setUseBatch(true);

                var OData = this.getOwnerComponent().getModel("dataModel");
                
                for (var i = 0; i < that.EnvModel.getData().results.length; i++) {   
                    
                    if (that.EnvModel.getData().results[i].isNewRow)
                    {
                        var yearL = this.monthArr.indexOf(that.EnvModel.getData().results[i].Month);
                        var yearR = this.yearArr[yearL];
                        console.log("monthArr:"+this.monthArr);
                        console.log("monthArr yearL:"+yearL);
                        console.log("monthArr yearR:"+yearR);

                        //logicE not required for Network Traffic
                        var logicE = "";
                        if(Type === "NETWORK TRAFFIC"){
                            logicE = "";
                        }else{
                            logicE = this.LogicE
                        }

                        //"supplier": that.EnvModel.getData().results[i].supplier,

                        var jsonSustain =
                        {            
                            "Year": yearR,                                            
                            "Month": that.EnvModel.getData().results[i].Month,
                            "Location": that.getView().byId("box1").getSelectedKey(),
                            "Type": "" + Type,
                            "SubType": "" + subType,
                            "KPI": that.getView().byId("KPI").getSelectedKey(),
                            "Value": parseFloat(that.EnvModel.getData().results[i].Value),
                            "Unit": that.EnvModel.getData().results[i].Unit,      
                            "Cost": parseFloat(that.EnvModel.getData().results[i].Cost),
                            "Currency": that.EnvModel.getData().results[i].Currency,
                            "Quality": "OK",
                            "Comment": that.EnvModel.getData().results[i].Comment,
                            "Owner": that.EnvModel.getData().results[i].Owner,
                            "Approver": that.EnvModel.getData().results[i].Approver,
                            "Division": that.getView().byId("box0").getSelectedKey(),
                            "Sno": 0,                            
                            "Date": null,
                            "Value2": 0.0, 
                            "Unit2": "",
                            "Distance": null,
                            "Weight": null,
                            "Scope": this.Scope,
                            "Associates": null,
                            "Logic": this.KPILogic,
                            "Measure": this.KPIMeasure, 
                            "GRIStd": this.KPIGRIStd,
                            "SDG": this.KPISDG,
                            "Class": this.KPIClass,
                            "RenNon": this.KPIRenNon,
                            "FiscalType":fiscalType,
                            "YearA":this.yearA,
                            "fiscal":that.getView().byId("box2").getSelectedKey(),  
                            "isValidationRequired": true,
                            "StartDate":this.StartDate,
                            "EndDate":this.EndDate,   
                            "Standard1":this.Standard1,
                            "LogicE":logicE,
                            "IUnit":"",
                            "IValue": 0.0, 
                            "FValue": 0.0,
                            "FValue1": 0.0
                        }                       
                        console.log("jsonSustain:"+jsonSustain);

                        var oTableName = this.GlobalIndustryModel.getData().TransactionTable;
                        var url1= "/" + oTableName;
                       OData.create(url1, jsonSustain, null, function () {
                            sap.m.MessageToast.show('The details submitted Successfully!!!');
                        }, function () {
                            alert("Create failed");
                        });
                    }
                }
            },
            onExportExcelTemplate: function (evt) {             
                /*var oView = this.getView();
                if (!this._pDialog) {
                    this._pDialog = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "com.techm.sustainabilityui.fragment.DataExtractionTemplate",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pDialog.then(function(oDialog){
                    oDialog.open();                    
                });*/

                var filename=[];                
                var that=this;                
                for( var i=0;i<evt.getParameter("files").length; i++){
                    this._importTemplate(evt.getParameter("files") && evt.getParameter("files")[i]);
                    var fname = evt.getParameter("files")[i].name;    
                    fname = fname.slice(0, -5);                    
                    filename.push(fname);                    
                }                             
               
                
                    var aArray = filename;
                    var oMainObject = {};
                    var aMainObjectArray = [];
                    for (var i = 0; i < aArray.length; i++){
                        var oObject = {};
                        oObject.name = aArray[i];
                        oObject.isEditableRow = false;
                        oObject.isExistingRow = true;
                        oObject.isNewRow = false;
                        aMainObjectArray.push(oObject);
                    }
                        oMainObject = aMainObjectArray;
                        console.log("aMainObjectArray:"+aMainObjectArray); 

                    var oView = this.getView();
                    if (!this._pDialog) {
                        this._pDialog = sap.ui.core.Fragment.load({
                            id: oView.getId(),
                            name: "com.techm.sustainabilityui.fragment.DataExtraction",
                            controller: this
                        }).then(function(oDialog){
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }
                    var dModel = new sap.ui.model.json.JSONModel(); 
                    this._pDialog.then(function(oDialog){
                        //create model and bind values to table.                        
                        //dModel.setData(filename); 
                        dModel.setData(oMainObject); 
                        that.getView().setModel(dModel, "dataExtractModel");
                        
                        for(var i=0; i<that.getView().getModel("dataExtractModel").getData().length; i++){
                            that.getView().getModel("dataExtractModel").getData()[i].isEditableRow = false;
                            that.getView().getModel("dataExtractModel").getData()[i].isExistingRow = true;
                            that.getView().getModel("dataExtractModel").getData()[i].isNewRow = false;
                        }


                        //oDialog.setModel(that.getView().getModel("dataExtractModel"));
                        //console.log("dataExtractModel:"+dModel);
                        //oDialog.open();
                        
                        sap.ui.getCore().setModel(dModel, "dataExtractModel");
                        oDialog.setModel(dModel);
                        oDialog.open();
                        
                    });
            },
            onCancelDialog: function () {
                this.byId("dataDialog").close();
            },
            onOKDialog: function () {
                var rowItems = this.getView().byId("dataExtractTbl").getSelectedItems();                
                var that=this;

                for (var i = 0; i < rowItems.length; i++)
                {
                    var selText = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;                                      
                    for (var j = 0; j < that.getView().byId("dataExtractTbl").getModel("dataExtractModel").getData().length; j++) 
                    {
                        if (selText === that.getView().byId("dataExtractTbl").getModel("dataExtractModel").getData()[j].name ){
                            that.getView().byId("dataExtractTbl").getModel("dataExtractModel").getData()[j].isEditableRow = false;
                            break;
                        }
                        else continue;
                    }
                }
                that.getView().byId("dataExtractTbl").getModel("dataExtractModel").refresh(true);
            },
            onEditDialog: function (event) {
                var rowItems = this.getView().byId("dataExtractTbl").getSelectedItems();
                console.log("rowItems:"+rowItems);
                var that=this;
                for (var i = 0; i < rowItems.length; i++)
                {
                    var selText = rowItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
                    //rowItems[i].isEditableRow = true                    
                       for (var j = 0; j < that.getView().byId("dataExtractTbl").getModel("dataExtractModel").getData().length; j++) 
                       {
                            if (selText === that.getView().byId("dataExtractTbl").getModel("dataExtractModel").getData()[j].name ){
                                that.getView().byId("dataExtractTbl").getModel("dataExtractModel").getData()[j].isEditableRow = true;
                                break;
                            }
                            else continue;                        
                        }
                }
                that.getView().byId("dataExtractTbl").getModel("dataExtractModel").refresh(true);
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
            _importTemplate: function (file) {
                this.flag="template";
                
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

                        var length = excelData.length;                        
                        for (var i = 0; i < length; i++) {
                            excelData[i].isExistingRow = false;
                            excelData[i].isNewRow = true;
                            console.log("Measure:"+that.KPIMeasure);
                            // Service call                    
                            var InputUOM = excelData[i].Unit;
                            //that.calloData_MeasureValidation(InputUOM);     
                            //excelData[i].Unit = that.OutputUoM;   
                            
                            //alternative approach
                            var dataLen = that.getView().getModel("measureValidationModel").getData().results.length;
                            var Measure = that.KPIMeasure;
                            for(var j=0;j<dataLen;j++){
                                if(that.getView().getModel("measureValidationModel").getData().results[j].MeasureType === Measure && 
                                    that.getView().getModel("measureValidationModel").getData().results[j].InputUom === InputUOM){                                      
                                        excelData[i].Unit = that.getView().getModel("measureValidationModel").getData().results[j].OutputUoM;
                                    }
                            }
                            //service end                           
                        }                        
                        
                        var results = [];
                        var recentData = that.EnvModel.getData().results;
                        recentData.push(...excelData);
                        
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
            calloData_MeasureValidation: function (InputUOM){
                //Measure Validation
                            var that = this;
                            var OData = that.getOwnerComponent().getModel("dataModel");
                            var Measure = that.KPIMeasure;
                            var InputUOM = InputUOM;
                           
                            console.log("InputUOM:"+InputUOM);
                            var oFilter1 = new sap.ui.model.Filter({
                                filters: [
                                    new sap.ui.model.Filter({ path: "MeasureType", operator: sap.ui.model.FilterOperator.EQ, value1: Measure }),
                                    new sap.ui.model.Filter({ path: "InputUom", operator: sap.ui.model.FilterOperator.EQ, value1: InputUOM })        
                                ], and: true
                            });                       
                            that.OData.read("/Measure_Validation", { 
                                filters: [oFilter1],                   
                                success: function (data, oResponse) {
                                    var ListModel = new sap.ui.model.json.JSONModel();
                                    ListModel.setData(data);
                                    that.getView().setModel(ListModel, "measureValidationModel");                                                                    
                                    that.OutputUoM = data.results[0].OutputUoM;
                                    console.log("OutputUoM:"+that.OutputUoM);                                 
                                },
                                error: function (err) {
                                    MessageBox.error("Error");
                                }
                            });     
                            
            },
            calloData_MeasureValidation1: function (){
                //Measure Validation
                var that = this;
                var OData = that.getOwnerComponent().getModel("dataModel");

                that.OData.read("/Measure_Validation", {                                 
                    success: function (data, oResponse) {
                        var ListModel = new sap.ui.model.json.JSONModel();
                        ListModel.setData(data);
                        that.getView().setModel(ListModel, "measureValidationModel");                                    
                        console.log("Output length:"+data.results.length);                                 
                    },
                    error: function (err) {
                        MessageBox.error("Error");
                    }
                });     
                            
            },
            onFileChange: function (oEvent) {
                var that=this;
                //get the selected row index
                var idx = oEvent.getSource().getParent().getParent().getBindingContextPath().substr(9,length);
                console.log("idx onFileChange:"+idx);

                //Upload file
                var file = oEvent.getParameters("files").files[0];
                this.file = file;
                console.log("file:"+this.file);

                var oUploadSet = this.byId("fileUpload1");
                //Upload image
                var reader = new FileReader();
                reader.onload = function (oEvent) {                    
                    this.content = oEvent.currentTarget.result;
                    this.createfile(idx);
                    
                }.bind(this);
                reader.readAsDataURL(this.file);
                console.log("file1:"+this.file);

                

            },
             /**
             *  Create Operation to create an entry in CAP
             */
             createfile: function (index) {
                var that = this;      
                
                // Data for CAP to create entry
                var oImageData = {
                    "content": this.content,
                    "mediaType": this.file.type,
                    "fileName": this.file.name
                };
                // var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
                var oModel = new sap.ui.model.json.JSONModel();//1
                var oCAPModel =     new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                var sURL = "/MediaFile";
                //Create call for CAP OData Service
                oCAPModel.create(sURL, oImageData, {
                    success: function (oData, oResponse) {
                        var id = oData.id;
                        that.link = oData.url;  
                        that.attachFile.push(oData.url);

                        oModel.setData(that.link);//2
                        that.getView().setModel(oModel, "fileUploadModel");//3
                        that.FileArr.push(that.link);//4

                        var sMsg = "File Uploaded Successfully with URL: "+ that.link;
                        MessageBox.success(sMsg);   

                        //For the respective index bind the url.
                        that.getView().byId("EnvTable").getModel("EnvModel").getData().results[index].url = that.link;

                        
                        // Read the file after successful upload
                       /*  oCAPModel =     new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                 sURL = "/MediaFile(da07ae51-d0d3-41e7-a737-2555a213e5a9)/content";
                 oCAPModel.read(sURL, oImageData, {
                    success: function (oData, oResponse) {
                        var id = oData.id;
                        var url = oData.url;
                        var sMsg = "File Read Successfully for ID: " + id;
                    },
                    error: function (jqXHR, textStatus) {

                    },
                });*/
                    },
                    error: function (jqXHR, textStatus) {

                    },
                });
            },
            handleDownloadFile : function (oEvent){
                //Get the link on click og button
                
                //get selected index
                var idx = oEvent.getSource().getParent().getParent().getBindingContextPath().substr(9,length);
                console.log("idx:"+idx);
                //selected url
                var url = this.getView().byId("EnvTable").getModel("EnvModel").getData().results[idx].url;
                console.log("url:"+url);
                if(url === null || url === "" ){
                    sap.m.MessageToast.show("File not exists");
                }else{
                    var uniqurl = url.substr(8,64);
                    console.log("url:"+uniqurl);
                    window.open("/v2/catalog"+uniqurl);
                }
                /*var url = this.getView().byId("EnvTable").getModel("EnvModel").getData().results[idx].url;
                var uniqurl = url.substr(8,64);
                console.log("url:"+uniqurl);
                window.open("/v2/catalog"+uniqurl);*/

                // Read the file
              /*  var that = this;               

                var oCAPModel = new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
                var sURL = "/MediaFile";
                sURL = uniqurl;
                oCAPModel.read(sURL,{
                    success: function (oData, oResponse) {
                        var id = oData.id;                
                        var sMsg = "File Read Successfully for ID: " + id;
                        var oImageData = {
                            "content": this.content,
                            "mediaType": this.file.type,
                            "fileName": this.file.name
                        };
                    },
                    error: function (jqXHR, textStatus) {

                    },
                });*/
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
                sap.m.MessageToast.show("Data Extracted Successfully");
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
                var currentData = that.getView().byId("EnvTable").getModel("EnvModel").getProperty("/results");
                var updatedData = currentData.concat(lineItems.results);
                that.getView().byId("EnvTable").getModel("EnvModel").getData().results = updatedData;
                that.getView().byId("EnvTable").getModel("EnvModel").refresh(true);

                return;
            } else if (data.status == 'PENDING') {
                setTimeout(function () {
                    console.log("Pending");
                    getExtractionResults(ID, token);
                }, 5000);
            } else if (data.status == 'FAILED') {
                var data = { "status": "DONE", "id": "ab49626b-bffb-4669-a017-d906b3560b1a", "fileName": "Energy_Report_V2_JantoJun_2022_IndirectEnergy_GridE.pdf", "documentType": "custom", "created": "2022-09-13T18:55:25.050171+00:00", "finished": "2022-09-13T18:55:33.159633+00:00", "templateId": "74e63a34-15fd-462c-a42a-8a58c30defbe", "languageCodes": ["en"], "pageCount": 1, "schemaId": "c5c7e09b-4489-47e6-810d-4d78e19edd34", "country": null, "extraction": { "headerFields": [{ "name": "Phone", "category": "custom", "value": "442045770088.00", "rawValue": "442045770088.00", "type": "number", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.16862745098039217, "y": 0.44319903059678883, "w": 0.10549019607843137, "h": 0.009088155104513784 }, "label": "Phone" }, { "name": "Location", "category": "custom", "value": "Nashville", "rawValue": "Nashville", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.1843137254901961, "y": 0.4580430172674947, "w": 0.05764705882352941, "h": 0.00969403211148137 }, "label": "Location" }, { "name": "Name", "category": "custom", "value": "Henry Lucas", "rawValue": "Henry Lucas", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.11803921568627451, "y": 0.4274462284156316, "w": 0.07882352941176471, "h": 0.011814601635867894 }, "label": "Name" }, { "name": "Year", "category": "custom", "value": "2022", "rawValue": "2022", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.15725490196078432, "y": 0.5207512874886399, "w": 0.03176470588235294, "h": 0.009088155104513784 }, "label": "Year" }, { "name": "Division", "category": "custom", "value": "ACME Industries", "rawValue": "ACME Industries", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.183921568627451, "y": 0.4737958194486519, "w": 0.10901960784313722, "h": 0.009996970614965184 }, "label": "Division" }, { "name": "Date", "category": "custom", "value": "2022-09-14", "rawValue": "2022-09-14", "type": "date", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.1588235294117647, "y": 0.5362011511663133, "w": 0.06431372549019608, "h": 0.008482278097546198 }, "label": "Date" }], "lineItems": [[{ "name": "Comment", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.9070588235294118, "y": 0.6004241139048773, "w": 0.019215686274509758, "h": 0.008482278097546203 }, "label": "Comment" }, { "name": "Cost", "category": "custom", "value": "28990.00", "rawValue": "28990.00", "type": "number", "page": 1, "confidence": 0.9950000000000003, "coordinates": { "x": 0.6113725490196078, "y": 0.6001211754013935, "w": 0.0388235294117647, "h": 0.009391093607997614 }, "label": "Cost" }, { "name": "Currency", "category": "custom", "value": "USD", "rawValue": "USD", "type": "currency", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.6819607843137255, "y": 0.6001211754013935, "w": 0.025882352941176467, "h": 0.009391093607997614 }, "label": "Currency" }, { "name": "Month", "category": "custom", "value": "January", "rawValue": "January", "type": "string", "page": 1, "confidence": 0.9285714285714284, "coordinates": { "x": 0.3968627450980392, "y": 0.5998182368979097, "w": 0.051764705882352935, "h": 0.012420478642835464 }, "label": "Month" }, { "name": "Quality", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.8003921568627451, "y": 0.6004241139048773, "w": 0.018039215686274535, "h": 0.008482278097546203 }, "label": "Quality" }, { "name": "SubType", "category": "custom", "value": "Grid Electricity(Non-RE)", "rawValue": "Grid Electricity(Non-RE)", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.2192156862745098, "y": 0.5992123598909421, "w": 0.15411764705882355, "h": 0.012420478642835464 }, "label": "SubType" }, { "name": "Type", "category": "custom", "value": "Indirect Energy", "rawValue": "Indirect Energy", "type": "string", "page": 1, "confidence": 0.9980392156862745, "coordinates": { "x": 0.09686274509803922, "y": 0.5989094213874584, "w": 0.0996078431372549, "h": 0.012420478642835464 }, "label": "Type" }, { "name": "Unit", "category": "custom", "value": "kWh", "rawValue": "kWh", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.5505882352941176, "y": 0.6001211754013935, "w": 0.02784313725490195, "h": 0.009391093607997614 }, "label": "Unit" }, { "name": "Value", "category": "custom", "value": "143950.00", "rawValue": "143950.00", "type": "number", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.4764705882352941, "y": 0.6001211754013935, "w": 0.04705882352941171, "h": 0.009391093607997614 }, "label": "Value" }], [{ "name": "Comment", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.9070588235294118, "y": 0.6167827930930021, "w": 0.019215686274509758, "h": 0.009391093607997614 }, "label": "Comment" }, { "name": "Cost", "category": "custom", "value": "25983.00", "rawValue": "25983.00", "type": "number", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.6113725490196078, "y": 0.6164798545895184, "w": 0.039215686274509776, "h": 0.009088155104513773 }, "label": "Cost" }, { "name": "Currency", "category": "custom", "value": "USD", "rawValue": "USD", "type": "currency", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.6819607843137255, "y": 0.6164798545895184, "w": 0.025882352941176467, "h": 0.009088155104513773 }, "label": "Currency" }, { "name": "Month", "category": "custom", "value": "February", "rawValue": "February", "type": "string", "page": 1, "confidence": 0.9772727272727273, "coordinates": { "x": 0.3996078431372549, "y": 0.6164798545895184, "w": 0.05764705882352944, "h": 0.011511663132384164 }, "label": "Month" }, { "name": "Quality", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.8003921568627451, "y": 0.6167827930930021, "w": 0.018039215686274535, "h": 0.009391093607997614 }, "label": "Quality" }, { "name": "SubType", "category": "custom", "value": "Grid Electricity(Non-RE)", "rawValue": "Grid Electricity(Non-RE)", "type": "string", "page": 1, "confidence": 0.9999999999999998, "coordinates": { "x": 0.2192156862745098, "y": 0.6164798545895184, "w": 0.1541176470588235, "h": 0.011511663132384164 }, "label": "SubType" }, { "name": "Type", "category": "custom", "value": "Indirect Energy", "rawValue": "Indirect Energy", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.09647058823529411, "y": 0.6164798545895184, "w": 0.1, "h": 0.011511663132384164 }, "label": "Type" }, { "name": "Unit", "category": "custom", "value": "kWh", "rawValue": "kWh", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.5505882352941176, "y": 0.6164798545895184, "w": 0.02784313725490195, "h": 0.009391093607997614 }, "label": "Unit" }, { "name": "Value", "category": "custom", "value": "111550.00", "rawValue": "111550.00", "type": "number", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.4764705882352941, "y": 0.6164798545895184, "w": 0.04705882352941171, "h": 0.011511663132384164 }, "label": "Value" }], [{ "name": "Comment", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.9070588235294118, "y": 0.6325355952741594, "w": 0.019215686274509758, "h": 0.009694032111481343 }, "label": "Comment" }, { "name": "Cost", "category": "custom", "value": "14905.00", "rawValue": "14905.00", "type": "number", "page": 1, "confidence": 0.9798979591836747, "coordinates": { "x": 0.6109803921568627, "y": 0.6322326567706755, "w": 0.03843137254901963, "h": 0.010602847621932754 }, "label": "Cost" }, { "name": "Currency", "category": "custom", "value": "USD", "rawValue": "USD", "type": "currency", "page": 1, "confidence": 0.9925373134328362, "coordinates": { "x": 0.6819607843137255, "y": 0.6322326567706755, "w": 0.026274509803921542, "h": 0.010299909118448913 }, "label": "Currency" }, { "name": "Month", "category": "custom", "value": "March", "rawValue": "March", "type": "string", "page": 1, "confidence": 0.8441558441558439, "coordinates": { "x": 0.3992156862745098, "y": 0.6322326567706755, "w": 0.04156862745098039, "h": 0.011814601635867894 }, "label": "Month" }, { "name": "Quality", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 0.9791666666666679, "coordinates": { "x": 0.8003921568627451, "y": 0.6328385337776431, "w": 0.018823529411764683, "h": 0.009694032111481343 }, "label": "Quality" }, { "name": "SubType", "category": "custom", "value": "Grid Electricity(Non-RE)", "rawValue": "Grid Electricity(Non-RE)", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.2192156862745098, "y": 0.6322326567706755, "w": 0.15411764705882355, "h": 0.011511663132384164 }, "label": "SubType" }, { "name": "Type", "category": "custom", "value": "Indirect Energy", "rawValue": "Indirect Energy", "type": "string", "page": 1, "confidence": 0.9980392156862746, "coordinates": { "x": 0.09647058823529411, "y": 0.6319297182671918, "w": 0.09960784313725493, "h": 0.011814601635867894 }, "label": "Type" }, { "name": "Unit", "category": "custom", "value": "kWh", "rawValue": "kWh", "type": "string", "page": 1, "confidence": 0.993055555555556, "coordinates": { "x": 0.5501960784313725, "y": 0.6322326567706755, "w": 0.028235294117647025, "h": 0.010602847621932754 }, "label": "Unit" }, { "name": "Value", "category": "custom", "value": "65260.00", "rawValue": "65260.00", "type": "number", "page": 1, "confidence": 0.9075000000000006, "coordinates": { "x": 0.476078431372549, "y": 0.6325355952741594, "w": 0.039215686274509776, "h": 0.010299909118448913 }, "label": "Value" }], [{ "name": "Comment", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 0.9803921568627435, "coordinates": { "x": 0.9070588235294118, "y": 0.6491972129657679, "w": 0.020000000000000018, "h": 0.008482278097546203 }, "label ": "Comment" }, { "name": "Cost", "category": "custom", "value": "30407.00", "rawValue": "30407.00", "type": "number", "page": 1, "confidence": 0.9950495049504953, "coordinates": { "x": 0.6113725490196078, "y": 0.6482883974553165, "w": 0.03960784313725485, "h": 0.009996970614965184 }, "label": "Cost" }, { "name": "Currency", "category": "custom", "value": "USD", "rawValue": "USD", "type": "currency", "page": 1, "confidence": 0.9848484848484858, "coordinates": { "x": 0.6823529411764706, "y": 0.6482883974553165, "w": 0.025882352941176467, "h": 0.009996970614965184 }, "label": "Currency" }, { "name": "Month", "category": "custom", "value": "April", "rawValue": "April", "type": "string", "page": 1, "confidence": 0.7564935064935066, "coordinates": { "x": 0.3984313725490196, "y": 0.6485913359588004, "w": 0.030980392156862768, "h": 0.012117540139351735 }, "label": "Month" }, { "name": "Quality", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 0.9791666666666679, "coordinates": { "x": 0.8003921568627451, "y": 0.6491972129657679, "w": 0.018823529411764683, "h": 0.008482278097546203 }, "label": "Quality" }, { "name": "SubType", "category": "custom", "value": "Grid Electricity(Non-RE)", "rawValue": "Grid Electricity(Non-RE)", "type": "string", "page": 1, "confidence": 0.9974683544303797, "coordinates": { "x": 0.2188235294117647, "y": 0.6482883974553165, "w": 0.15490196078431373, "h": 0.012117540139351735 }, "label": "SubType" }, { "name": "Type", "category": "custom", "value": "Indirect Energy", "rawValue": "Indirect Energy", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.09647058823529411, "y": 0.6479854589518328, "w": 0.1, "h": 0.012117540139351735 }, "label": "Type" }, { "name": "Unit", "category": "custom", "value": "kWh", "rawValue": "kWh", "type": "string", "page": 1, "confidence": 0.9929577464788737, "coordinates": { "x": 0.5505882352941176, "y": 0.6485913359588004, "w": 0.027450980392156876, "h": 0.009996970614965184 }, "label": "Unit" }, { "name": "Value", "category": "custom", "value": "130920.00", "rawValue": "130920.00", "type": "number", "page": 1, "confidence": 0.9918032786885239, "coordinates": { "x": 0.476078431372549, "y": 0.6485913359588004, "w": 0.04784313725490197, "h": 0.009996970614965184 }, "label": "Value" }], [{ "name": "Comment", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 0.9803921568627435, "coordinates": { "x": 0.9070588235294118, "y": 0.6655558921538928, "w": 0.020000000000000018, "h": 0.008482278097546203 }, "label": "Comment" }, { "name": "Cost", "category": "custom", "value": "19708.00", "rawValue": "19708.00", "type": "number", "page": 1, "confidence": 0.9850000000000009, "coordinates": { "x": 0.6121568627450981, "y": 0.6649500151469252, "w": 0.03803921568627455, "h": 0.009391093607997614 }, "label": "Cost" }, { "name": "Currency", "category": "custom", "value": "USD", "rawValue": "USD", "type": "currency", "page": 1, "confidence": 0.9924242424242429, "coordinates": { "x": 0.6823529411764706, "y": 0.6649500151469252, "w": 0.025490196078431393, "h": 0.009391093607997614 }, "label": "Currency" }, { "name": "Month", "category": "custom", "value": "May", "rawValue": "May", "type": "string", "page": 1, "confidence": 0.7337662337662338, "coordinates": { "x": 0.3992156862745098, "y": 0.6646470766434414, "w": 0.02823529411764708, "h": 0.011814601635867894 }, "label": "Month" }, { "name": "Quality", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.8003921568627451, "y": 0.6655558921538928, "w": 0.018039215686274535, "h": 0.008482278097546203 }, "label": "Quality" }, { "name": "SubType", "category": "custom", "value": "Grid Electricity(Non-RE)", "rawValue": "Grid Electricity(Non-RE)", "type": "string", "page": 1, "confidence": 0.9974554707379135, "coordinates": { "x": 0.2196078431372549, "y": 0.6643441381399576, "w": 0.15411764705882353, "h": 0.011814601635867894 }, "label": "SubType" }, { "name": "Type", "category": "custom", "value": "Indirect Energy", "rawValue": "Indirect Energy", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.09647058823529411, "y": 0.6640411996364738, "w": 0.1, "h": 0.011814601635867894 }, "label": "Type" }, { "name": "Unit", "category": "custom", "value": "kWh", "rawValue": "kWh", "type": "string", "page": 1, "confidence": 0.993055555555556, "coordinates": { "x": 0.5501960784313725, "y": 0.6649500151469252, "w": 0.028235294117647025, "h": 0.009088155104513773 }, "label": "Unit" }, { "name": "Value", "category": "custom", "value": "84589.00", "rawValue": "84589.00", "type": "number", "page": 1, "confidence": 0.8990646258503414, "coordinates": { "x": 0.476078431372549, "y": 0.6649500151469252, "w": 0.03843137254901963, "h": 0.009088155104513773 }, "label": "Value" }], [{ "name": "Comment", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 0.9795918367346951, "coordinates": { "x": 0.9070588235294118, "y": 0.6807028173280824, "w": 0.01843137254901961, "h": 0.009996970614965184 }, "label": "Comment" }, { "name": "Cost", "category": "custom", "value": "18500.00", "rawValue": "18500.00", "type": "number", "page": 1, "confidence": 0.9950495049504953, "coordinates": { "x": 0.6109803921568627, "y": 0.6807028173280824, "w": 0.03960784313725485, "h": 0.009996970614965184 }, "label": "Cost" }, { "name": "Currency", "category": "custom", "value": "USD", "rawValue": "USD", "type": "currency", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.6819607843137255, "y": 0.6807028173280824, "w": 0.025882352941176467, "h": 0.009996970614965184 }, "label": "Currency" }, { "name": "Month", "category": "custom", "value": "June", "rawValue": "June", "type": "string", "page": 1, "confidence": 0.7629870129870127, "coordinates": { "x": 0.3968627450980392, "y": 0.6807028173280824, "w": 0.03176470588235292, "h": 0.011208724628900324 }, "label": "Month" }, { "name": "Quality", "category": "custom", "value": "OK", "rawValue": "OK", "type": "string", "page": 1, "confidence": 0.9599999999999997, "coordinates": { "x": 0.7996078431372549, "y": 0.6807028173280824, "w": 0.019607843137254943, "h": 0.009996970614965184 }, "label": "Quality" }, { "name": "SubType", "category": "custom", "value": "Grid Electricity(Non-RE)", "rawValue": "Grid Electricity(Non-RE)", "type": "string", "page": 1, "confidence": 0.9974683544303797, "coordinates": { "x": 0.2188235294117647, "y": 0.6807028173280824, "w": 0.15490196078431373, "h": 0.011208724628900324 }, "label": "SubType" }, { "name": "Type", "category": "custom", "value": "Indirect Energy", "rawValue": "Indirect Energy", "type": "string", "page": 1, "confidence": 1.0, "coordinates": { "x": 0.09647058823529411, "y": 0.6807028173280824, "w": 0.1, "h": 0.011208724628900324 }, "label": "Type" }, { "name": "Unit", "category": "custom", "value": "kWh", "rawValue": "kWh", "type": "string", "page": 1, "confidence": 0.993055555555556, "coordinates": { "x": 0.5501960784313725, "y": 0.6807028173280824, "w": 0.028235294117647025, "h": 0.009996970614965184 }, "label": "Unit" }, { "name": "Value", "category": "custom", "value": "78466.00", "rawValue": "78466.00", "type": "number", "page": 1, "confidence": 0.9025990099009911, "coordinates": { "x": 0.47568627450980394, "y": 0.6807028173280824, "w": 0.03960784313725485, "h": 0.009996970614965184 }, "label": "Value" }]] }, "bocrVersion": "2.5.0", "doxVersion": "1.60.3", "fileType": "pdf", "dataForRetrainingStatus": "notUsedForTraining" };
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
                var currentData = that.getView().byId("EnvTable").getModel("EnvModel").getProperty("/results");
                var updatedData = currentData.concat(lineItems.results);
                that.getView().byId("EnvTable").getModel("EnvModel").getData().results = updatedData;
                that.getView().byId("EnvTable").getModel("EnvModel").refresh(true);

                /* lineItems.results = [{ "Type": "Direct Energy", "SubType": "HSD", "Month": "January", "Value": "1.217", "Unit": "gl", "Cost": "61919", "Currency": "USD", "Quality": "n.a", "Comment": "OK", "Year": "2022", "Location": "Nashville", "Division": "ACME Industries" },
                 { "Type": "Direct Energy", "SubType": "LPG", "Month": "January", "Value": "1.337", "Unit": "gl", "Cost": "64119", "Currency": "USD", "Quality": "n.a", "Comment": "OK", "Year": "2022", "Location": "Nashville", "Division": "ACME Industries" },
                 { "Type": "Water Withdrawal", "SubType": "Bottled Water", "Month": "January", "Value": "9", "Unit": "gl", "Cost": "921334", "Currency": "USD", "Quality": "n.a", "Comment": "OK", "Year": "2022", "Location": "Nashville", "Division": "ACME Industries" }
                 ];
                 var currentData = that.getView().byId("EnvTable").getModel("EnvModel").getProperty("/results");
                 var updatedData = currentData.concat(lineItems.results);
                 that.getView().byId("EnvTable").getModel("EnvModel").getData().results = updatedData;
                 that.getView().byId("EnvTable").getModel("EnvModel").refresh(true);*/
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
