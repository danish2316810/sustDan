sap.ui.define(["sap/ui/core/mvc/Controller","com/techm/sustainabilityui/model/formatter"],function(e,t){"use strict";return e.extend("com.techm.sustainabilityui.controller.Social",{formatter:t,onInit:function(){let e=sap.ui.core.UIComponent.getRouterFor(this);this.OData=this.getOwnerComponent().getModel("dataModel");this.oRouter=this.getOwnerComponent().getRouter();this.oRouter.getTarget("Social").attachDisplay(jQuery.proxy(this.handleRouteMatched,this))},handleRouteMatched:function(e){this.GlobalIndustryModel=sap.ui.getCore().getModel("GlobalIndustryModel");console.log("on before Social:"+this.GlobalIndustryModel.getData());this.year="";this.prefixCount="";var t=this;var a=this.GlobalIndustryModel.getData().Industry;if(a==="Telecom"){t.getView().byId("box0").setSelectedKey("Bharti Airtel Limited");t.getView().byId("box1").setSelectedKey("Maharashtra");t.getView().byId("box2").setSelectedKey("")}else{t.getView().byId("box0").setSelectedKey("");t.getView().byId("box1").setSelectedKey("");t.getView().byId("box2").setSelectedKey("")}this.onPressGo()},formatEditField:function(e,t,a){if(e||t){return true}else if(a){return false}},formatDisplayField:function(e,t,a){if(e||t){return false}else if(a){return true}},formatPKeyField:function(e,t,a){if(e){return false}else if(a||t){return true}},onPressBack:function(e){this.getOwnerComponent().getRouter().navTo("Launchpad",{},true)},onPressGo:function(e){var t=this;this.KPIListModel=new sap.ui.model.json.JSONModel;var a=new sap.m.BusyDialog({});a.open();this.OData.read("/KPIList_Social_Ports",{success:function(e,s){a.close();var o=new sap.ui.model.json.JSONModel;o.setData(e);t.getView().byId("KPISubType").setModel(o,"KPIModel");t.getView().byId("KPI").setModel(o,"KPIModel");t.getView().byId("prefixValues").setModel(o,"KPIModel");t.KPIListModel.setData(e);console.log(t.KPIListModel);t._getKPITypes();t._getKPISubTypes();t.getView().byId("rbgKPITypes").setSelectedIndex(0)},error:function(e){a.close()}});this.OData.read("/Constants",{success:function(e,a){console.log("success");var s=new sap.ui.model.json.JSONModel;s.setData(e);t.getView().setModel(s,"ConstantsModel")},error:function(e){console.log("Error")}});var s=this.GlobalIndustryModel.getData().Industry;var o=new sap.ui.model.Filter({path:"Industry",operator:sap.ui.model.FilterOperator.EQ,value1:s});this.OData.read("/Division",{success:function(e,a){var s=new sap.ui.model.json.JSONModel;s.setData(e);t.getView().setModel(s,"divisionModel");var l=t.getView().byId("box0");var i=l.getBinding("items");i.filter(o)},error:function(e){MessageBox.error("Error")}});var s=this.GlobalIndustryModel.getData().Industry;var o=new sap.ui.model.Filter({path:"Industry",operator:sap.ui.model.FilterOperator.EQ,value1:s});this.OData.read("/Location",{success:function(e,a){var s=new sap.ui.model.json.JSONModel;s.setData(e);t.getView().setModel(s,"locationModel");var l=t.getView().byId("box1");var i=l.getBinding("items");i.filter(o)},error:function(e){MessageBox.error("Error")}});this.calloData_Year()},calloData_Year:function(){var e=this;var t=this.getOwnerComponent().getModel("dataModel");var a=this.GlobalIndustryModel.getData().Industry;var s=new sap.ui.model.Filter({path:"Industry",operator:sap.ui.model.FilterOperator.EQ,value1:a});this.OData.read("/Year_Module",{success:function(t,a){var o=new sap.ui.model.json.JSONModel;o.setData(t);e.getView().setModel(o,"yearModel");var l=e.getView().byId("box2");var i=l.getBinding("items");i.filter(s)},error:function(e){MessageBox.error("Error")}})},onChangeYear:function(e){var t=this.getView().byId("box2").getModel("yearModel").getData().results;var a=this.getView().byId("box2").getSelectedKey();var s="";var o="",l="";for(var i=0;i<t.length;i++){if(t[i].fiscal===a){o=t[i].StartDate;l=t[i].EndDate;s=t[i].YearA}}this.getView().byId("dateDisp").setText("("+o+" to "+l+")");this.StartDate=o;this.EndDate=l;this.yearA=s;var r=o.split("-");var n=r[0];var d=r[1];var u=r[2];console.log("element2:"+d);this.year=r[2];var c=l.split("-");var g=c[0];var p=c[1];var h=c[2];console.log("element5:"+p);const y=["January","February","March","April","May","June","July","August","September","October","November","December"];var f=new Date(o);var I=new Date(o).getMonth();var b=new Date(l).getMonth();console.log("startDate:"+y[I]);console.log("endDate:"+y[b]);console.log("m1:"+I);console.log("m2:"+b);var m=new Date(parseInt(u),parseInt(I),parseInt(n));var v=new Date(parseInt(h),parseInt(b),parseInt(g));var S=v.getYear()-m.getYear();var M=v.getMonth()-m.getMonth();var w=S*12+M;var T=[];for(var i=0;i<=w;i++){if(i==0)m.setMonth(m.getMonth()-1);else m.setMonth(m.getMonth()+1);T[i]=moment(m).format("MMMM")}let N=new Date(u,parseInt(I),n);let D=new Date(h,parseInt(b),g);var _="en";let V=new Date(N.getFullYear(),N.getMonth());let P=[];this.monthArr=[];this.yearArr=[];while(V<=D){P.push(V.toLocaleString(_,{month:"long"}));this.monthArr.push(V.toLocaleString(_,{month:"long"}));this.yearArr.push(V.toLocaleString(_,{year:"numeric"}));V.setMonth(V.getMonth()+1)}console.log("months before:"+P);if(d===p&P.length>12){if(P!=null&&P!=undefined&&P.length>0){var E=P.splice(P.length-1,1);console.log("months removed:"+E)}}console.log("months after:"+P);var x={items:P};var K=new sap.ui.model.json.JSONModel;K.setData(x);console.log(x);var O=this.getView().byId("month");O.setModel(K);O.bindAggregation("items","/items",new sap.ui.core.ListItem({text:"{}",key:"{}"}))},_getKPITypes:function(){var e=[];var t=this.KPIListModel.getData().results;for(var a=0;a<t.length;a++){if(e.indexOf(t[a].Type)===-1){e.push(t[a].Type)}}console.log("Type:"+e);var s={items:e};var o=new sap.ui.model.json.JSONModel;o.setData(s.items);var l=this.getView().byId("rbgKPITypes");l.setModel(o,"KPITypeModel");console.log(o);this.KPITypeSelected=o.getData()[0]},_getKPISubTypes:function(){var e=this;var t=e.getView().byId("KPISubType").getModel("KPIModel");var a=this.KPITypeSelected;var s=[];var o=[];var l=t.getData().results;for(var i=0;i<l.length;i++){if(l[i].Type===a){for(var r=0;r<l.length;r++){if(s.indexOf(l[r].SubType)===-1&&l[r].Type===a){s.push(l[r].SubType)}}}}console.log(s);for(var i=0;i<s.length;i++){var n={};n.SubType=s[i];o.push(n)}console.log(o);var d={items:o};var u=new sap.ui.model.json.JSONModel;u.setData(d);console.log(d);var c=e.getView().byId("KPISubType");c.setModel(u);c.bindAggregation("items","/items",new sap.ui.core.ListItem({text:"{SubType}",key:"{SubType}"}));e.getView().byId("KPISubType").setSelectedKey(s[0]);this.KPISubtypeSelected=s[0];this._getKPIs()},_getKPIs:function(){var e=this;var t=e.getView().byId("KPISubType").getModel("KPIModel");var a=this.KPITypeSelected;var s=this.KPISubtypeSelected;var o=new sap.ui.model.Filter({filters:[new sap.ui.model.Filter({path:"Type",operator:sap.ui.model.FilterOperator.EQ,value1:a}),new sap.ui.model.Filter({path:"SubType",operator:sap.ui.model.FilterOperator.EQ,value1:s})],and:true});console.log(o);var l=new sap.ui.core.ListItem({key:"{KPIModel>KPI}",text:"{KPIModel>KPI}"});var i=e.getView().byId("KPI");var r=i.bindAggregation("items",{path:"KPIModel>/results",template:l,filters:o});this.KPI=i.getFirstItem().getKey();i.setSelectedKey(i.getFirstItem().getKey());this._populateKPITableData()},_getPrefixs:function(){var e=this;var t=e.KPIListModel.getData().results;var a=this.KPITypeSelected;var s=this.KPISubtypeSelected;var o=this.KPI;var l=new sap.ui.model.Filter({filters:[new sap.ui.model.Filter({path:"Type",operator:sap.ui.model.FilterOperator.EQ,value1:a}),new sap.ui.model.Filter({path:"SubType",operator:sap.ui.model.FilterOperator.EQ,value1:s}),new sap.ui.model.Filter({path:"KPI",operator:sap.ui.model.FilterOperator.EQ,value1:o})],and:true});console.log(l);var i=new sap.ui.core.ListItem({key:"{KPIModel>Prefix}",text:"{KPIModel>Prefix}"});var r=e.getView().byId("prefixValues");r.bindAggregation("items",{path:"KPIModel>/results",template:i,filters:l});this.prefix=r.getFirstItem().getKey()},_hideAllTemplate:function(){this.getView().byId("SocialTableA").setVisible(false);this.getView().byId("SocialTableB").setVisible(false);this.getView().byId("SocialTableC").setVisible(false);this.getView().byId("SocialTableD").setVisible(false);this.getView().byId("SocialTableE").setVisible(false);this.getView().byId("SocialTableF").setVisible(false);this.getView().byId("SocialTableG").setVisible(false);this.getView().byId("SocialTableH").setVisible(false);this.getView().byId("SocialTableI").setVisible(false);this.getView().byId("SocialTableJ").setVisible(false);this.getView().byId("SocialTableK").setVisible(false);this.getView().byId("SocialTableL").setVisible(false)},_populateKPITableData:function(){var e=this;var t=new sap.ui.model.Filter({filters:[new sap.ui.model.Filter({path:"Division",operator:sap.ui.model.FilterOperator.EQ,value1:e.getView().byId("box0").getSelectedKey()}),new sap.ui.model.Filter({path:"Location",operator:sap.ui.model.FilterOperator.EQ,value1:e.getView().byId("box1").getSelectedKey()}),new sap.ui.model.Filter({path:"fiscal",operator:sap.ui.model.FilterOperator.EQ,value1:e.getView().byId("box2").getSelectedKey()}),new sap.ui.model.Filter({path:"Type",operator:sap.ui.model.FilterOperator.EQ,value1:""+this.KPITypeSelected}),new sap.ui.model.Filter({path:"SubType",operator:sap.ui.model.FilterOperator.EQ,value1:e.getView().byId("KPISubType").getSelectedKey()}),new sap.ui.model.Filter({path:"KPI",operator:sap.ui.model.FilterOperator.EQ,value1:e.getView().byId("KPI").getSelectedKey()})],and:true});console.log(t);var a="/SocialTableA";console.log(t);this._getKPITemplate();console.log(this.template);var a="/SocialTableA";switch(this.template){case"Table A":var s=this.template.substring(this.template.length-1);var o="SocialTable"+s;var l="ColHeaderSocialTable"+s;this.getView().byId(o).setVisible(true);if(o!=="SocialTableL"){this.getView().byId(l).setText(this.prefix)}var i=this.getView().byId("SocialTableA");this._callTemplate1(t,a,i);e.getView().byId("SocialTableA").setVisible(true);e.getView().byId("SocialTableB").setVisible(false);e.getView().byId("SocialTableC").setVisible(false);e.getView().byId("SocialTableD").setVisible(false);e.getView().byId("SocialTableE").setVisible(false);e.getView().byId("SocialTableF").setVisible(false);e.getView().byId("SocialTableG").setVisible(false);e.getView().byId("SocialTableH").setVisible(false);e.getView().byId("SocialTableI").setVisible(false);e.getView().byId("SocialTableJ").setVisible(false);e.getView().byId("SocialTableK").setVisible(false);e.getView().byId("SocialTableL").setVisible(false);break;case"Text Box":var i=this.getView().byId("SocialTableL");this._callTemplate1(t,a,i);e.getView().byId("SocialTableA").setVisible(false);e.getView().byId("SocialTableB").setVisible(false);e.getView().byId("SocialTableC").setVisible(false);e.getView().byId("SocialTableD").setVisible(false);e.getView().byId("SocialTableE").setVisible(false);e.getView().byId("SocialTableF").setVisible(false);e.getView().byId("SocialTableG").setVisible(false);e.getView().byId("SocialTableH").setVisible(false);e.getView().byId("SocialTableI").setVisible(false);e.getView().byId("SocialTableJ").setVisible(false);e.getView().byId("SocialTableK").setVisible(false);e.getView().byId("SocialTableL").setVisible(true);break}},_callTemplate1:function(e,t,a){var s=this;this.SocialModel=new sap.ui.model.json.JSONModel;this.OData.read(t,{filters:[e],success:function(e,t){var o=new sap.ui.model.json.JSONModel;o.setData(e);s.SocialModel.setData(e);var l=e.results.length;var i="";for(var r=0;r<l;r++){s.SocialModel.getData().results[r].isExistingRow=true;s.SocialModel.getData().results[r].isNewRow=false;s.SocialModel.getData().results[r].isEditableRow=false;i=s.SocialModel.getData().results[r].ltext;console.log("ltext:"+i)}s._setTableData(a);console.log(s.SocialModel.getData().results)},error:function(e){}})},_setTableData:function(e){e.setModel(this.SocialModel,"SocialModel")},_getKPITemplate:function(){var e=this.KPIListModel.getData().results.length;for(var t=0;t<e;t++){var a=this.KPIListModel.getData().results[t];if(a.Type===this.KPITypeSelected&&a.SubType===this.KPISubtypeSelected&&a.KPI===this.KPI){console.log("KPI match found"+a.KPI);this.template=a.Template;this.logic=a.Logic;console.log("Logic:"+this.logic);var s="[    GRI Standards - "+a.GRIStd+"    ]";this.getView().byId("displayGRI").setText(s);this.prefix=a.Prefix;break}else continue}},onChangeKPI:function(e){this.KPI=e.getParameters().selectedItem.getProperty("key");console.log("onChangeKPI:"+this.KPI);this._getPrefixs();this._populateKPITableData();console.log("onChangeKPI:"+this.template)},onSelect_Radiobutton_KPIType:function(e){var t=e.getSource().getButtons()[e.getParameter("selectedIndex")].getText();this.KPITypeSelected=t;console.log("txt:"+t);this._getKPISubTypes()},onChange_ComboBox_KPISubType:function(e){var t=e.getParameter("selectedItem").getText();this.KPISubtypeSelected=t;this._getKPIs();this.calloData_Prefix_Types()},OnPressAddNewEntry:function(e){var t=this;var a=this.KPISubtypeSelected;var s=this.KPITypeSelected;var o=this.getView().byId("KPI").getSelectedKey();var l=e.getSource().getParent().getParent().getId();console.log("tableID:"+l);var i="";if(l.includes("SocialTableL")){i=this.prefix}var r={results:[]};r.results=[{Type:""+s,SubType:""+a,KPI:+o,Identifier:""+i,FUpto30yrs:"",FUpto50yrs:"",FMorethan50Yrs:"",MUpto30yrs:"",MUpto50yrs:"",MMorethan50Yrs:"",NUpto30yrs:"",NUpto50yrs:"",NMorethan50Yrs:"",Female:"",Male:"",Response:"",OperationalChge:"",NoOfWeeks:"",NoOfIncidents:"",ReviewedBy:"",RemediationPlan:"",Results:"",sac:"",Number:"",NoOfHrs:"",NoOfEmployees:"",Covered_OHS:"",Covered_IAudit:"",ltext:"",Certified_OHS:"",Fatalities:"",High_Consequence:"",Recordable:"",HrsWorked:"",Emp_Entitled_leave:"",Emp_Took_Leave:"",Emp_Returned_To_Work:"",Emp_Still_Employed:"",isNewRow:true,isExistingRow:false}];t.getView().byId(l).getModel("SocialModel").getData().results=t.getView().byId(l).getModel("SocialModel").getProperty("/results").concat(r.results);t.getView().byId(l).getModel("SocialModel").refresh(true)},handleConnectToLocalSystem:function(e){if(!this.pDialog){this.pDialog=this.loadFragment({name:"com.techm.sustainabilityui.fragment.ConnectToLocalSystem"})}this.pDialog.then(function(e){e.open()})},onCloseDialog:function(){this.byId("simpleDialog").close()},onOkDialog:function(){sap.m.MessageToast.show("The system details are updated.!!");this.byId("simpleDialog").close()},handleDownloadExcel:function(e){window.open("./documents/ENVIRONMENT_REPORT_PORTS.csv")},onPressSubmit:function(e){var t="";console.log(e);if(this.template==="Text Box"){t="SocialTableL"}else{t="SocialTable"+this.template.substring(this.template.length-1)}console.log("tableId:"+t);this.batchModel=this.getOwnerComponent().getModel("dataModel");this.batchChanges=[];this.onCreateEntry_Table(t);this.onUpdateEntry_Table(t);if(this.batchChanges.length>0){this.batchModel.addBatchChangeOperations(this.batchChanges);this.batchModel.submitBatch({success:function(e,t){console.log("batch success");console.log(t.headers["sap-messages"])},error:function(e){console.log("batch error");that._populateKPITableData()}});this.batchModel.refresh();this._populateKPITableData();this.getView().byId(t).getModel("SocialModel").refresh(true)}else console.log("No Rcord present for Database Operation")},onCreateEntry_Table:function(e){var t=this;console.log("on submit:-"+this.year);var a=t.getView().byId(e).getModel("SocialModel");var s=this.getOwnerComponent().getModel("dataModel");var o=false;var l=this.year;for(var i=0;i<a.getData().results.length;i++){console.log("val:"+a.getData().results[i].ltext);if(a.getData().results[i].isNewRow){var r={Year:""+l,fiscal:t.getView().byId("box2").getSelectedKey(),Location:t.getView().byId("box1").getSelectedKey(),Type:""+t.KPITypeSelected,SubType:""+t.KPISubtypeSelected,KPI:t.getView().byId("KPI").getSelectedKey(),Division:t.getView().byId("box0").getSelectedKey(),Prefix:t.prefix,Identifier:a.getData().results[i].Identifier,Template:t.template,Logic:t.logic,ltext:a.getData().results[i].ltext,FUpto30yrs:parseInt(a.getData().results[i].FUpto30yrs),FUpto50yrs:parseInt(a.getData().results[i].FUpto50yrs),FMorethan50Yrs:parseInt(a.getData().results[i].FMorethan50Yrs),MUpto30yrs:parseInt(a.getData().results[i].MUpto30yrs),MUpto50yrs:parseInt(a.getData().results[i].MUpto50yrs),MMorethan50Yrs:parseInt(a.getData().results[i].MMorethan50Yrs),NUpto30yrs:parseInt(a.getData().results[i].NUpto30yrs),NUpto50yrs:parseInt(a.getData().results[i].NUpto50yrs),NMorethan50Yrs:parseInt(a.getData().results[i].NMorethan50Yrs),Female:parseInt(a.getData().results[i].Female),Male:parseInt(a.getData().results[i].Male),Neutral:parseInt(a.getData().results[i].Neutral),Response:"Yes",OperationalChge:parseInt(a.getData().results[i].OperationalChge),NoOfWeeks:parseInt(a.getData().results[i].NoOfWeeks),NoOfIncidents:parseInt(a.getData().results[i].NoOfIncidents),ReviewedBy:parseInt(a.getData().results[i].ReviewedBy),RemediationPlan:parseInt(a.getData().results[i].RemediationPlan),Results:parseInt(a.getData().results[i].Results),sac:parseInt(a.getData().results[i].sac),Number:parseInt(a.getData().results[i].Number),NoOfHrs:parseInt(a.getData().results[i].NoOfHrs),NoOfEmployees:parseInt(a.getData().results[i].NoOfEmployees),Covered_OHS:parseInt(a.getData().results[i].Covered_OHS),Covered_IAudit:parseInt(a.getData().results[i].Covered_IAudit),Certified_OHS:parseInt(a.getData().results[i].Certified_OHS),Fatalities:parseInt(a.getData().results[i].Fatalities),High_Consequence:parseInt(a.getData().results[i].High_Consequence),Recordable:parseInt(a.getData().results[i].Recordable),HrsWorked:parseInt(a.getData().results[i].HrsWorked),Emp_Entitled_leave:parseInt(a.getData().results[i].Emp_Entitled_leave),Emp_Took_Leave:parseInt(a.getData().results[i].Emp_Took_Leave),Emp_Returned_To_Work:parseInt(a.getData().results[i].Emp_Returned_To_Work),Emp_Still_Employed:parseInt(a.getData().results[i].Emp_Still_Employed),IsTotalRequired:false};console.log(r);r=t._replaceNaNtoNull(r);console.log(r);t.batchModel.create("/SocialTableA",r,{method:"POST",success:function(s){console.log("success");if(t.logic==="Logic S1"){console.log("Logic S1:-"+t.logic);console.log("prefixCount:-"+t.prefixCount);console.log("Social Length:-"+a.getData().results.length);if(t.prefixCount===a.getData().results.length){console.log("count is equal");o=true;t.onColumnTotal(e)}}},error:function(e){console.log("error")}})}}},onColumnTotal:function(e){console.log("on submit");var t=this;var a=t.getView().byId(e).getModel("SocialModel");var s=this.getOwnerComponent().getModel("dataModel");var o=this.year;var l=true;var i={Year:""+o,fiscal:t.getView().byId("box2").getSelectedKey(),Location:t.getView().byId("box1").getSelectedKey(),Type:""+t.KPITypeSelected,SubType:""+t.KPISubtypeSelected,KPI:t.getView().byId("KPI").getSelectedKey(),Division:t.getView().byId("box0").getSelectedKey(),Prefix:t.prefix,Identifier:"Total",Template:t.template,Logic:t.logic,FUpto30yrs:0,FUpto50yrs:0,FMorethan50Yrs:0,MUpto30yrs:0,MUpto50yrs:0,MMorethan50Yrs:0,NUpto30yrs:0,NUpto50yrs:0,NMorethan50Yrs:0,Female:0,Male:0,Neutral:0,Response:"Yes",OperationalChge:0,NoOfWeeks:0,NoOfIncidents:0,ReviewedBy:0,RemediationPlan:0,Results:0,sac:0,Number:0,NoOfHrs:0,NoOfEmployees:0,Covered_OHS:0,Covered_IAudit:0,Certified_OHS:0,Fatalities:0,High_Consequence:0,Recordable:0,HrsWorked:0,Emp_Entitled_leave:0,Emp_Took_Leave:0,Emp_Returned_To_Work:0,Emp_Still_Employed:0,IsTotalRequired:l};console.log(i);i=t._replaceNaNtoNull(i);console.log(i);t.batchModel.create("/SocialTableA",i,{method:"POST",success:function(e){console.log("success");sap.m.MessageToast.show("The details got updated Successfully!!")},error:function(e){console.log("error")}})},onRowSelected:function(e){},onPressEdit:function(e){var t="SocialTable"+this.template.substring(this.template.length-1);console.log("tableId:"+t);var a=this.getView().byId(t).getSelectedItems();console.log(a);var s=this.getView().byId(t).getModel("SocialModel");for(var o=0;o<a.length;o++){if(t==="SocialTableL"){var l=a[o].mAggregations.cells[0].mProperties.text}else{var l=a[o].mAggregations.cells[0].mAggregations.items[0].mProperties.text}for(var i=0;i<s.getData().results.length;i++){if(l===s.getData().results[i].Identifier){s.getData().results[i].isEditableRow=true;break}else continue}}s.refresh(true)},onPressReset:function(e){var t="SocialTable"+this.template.substring(this.template.length-1);var a=this.getView().byId(t).getSelectedItems();var s=this.getView().byId(t).getModel("SocialModel");for(var o=0;o<a.length;o++){var l=a[o].mAggregations.cells[0].mAggregations.items[0].mProperties.text;for(var i=0;i<s.getData().results.length;i++){if(l===s.getData().results[i].Identifier){s.getData().results[i].isEditableRow=false;a[o].setSelected(false);break}else continue}}s.refresh(true)},_getJsonForRowUpdate:function(e){var t=this;var a={Division:t.getView().byId("box0").getSelectedKey(),Prefix:t.prefix,Template:t.template,Logic:t.Logic,FUpto30yrs:parseInt(e.FUpto30yrs),FUpto50yrs:parseInt(e.FUpto50yrs),FMorethan50Yrs:parseInt(e.FMorethan50Yrs),MUpto30yrs:parseInt(e.MUpto30yrs),MUpto50yrs:parseInt(e.MUpto50yrs),MMorethan50Yrs:parseInt(e.MMorethan50Yrs),NUpto30yrs:parseInt(e.NUpto30yrs),NUpto50yrs:parseInt(e.NUpto50yrs),NMorethan50Yrs:parseInt(e.NMorethan50Yrs),Female:parseInt(e.Female),Male:parseInt(e.Male),Neutral:parseInt(e.Neutral),Response:"Yes",OperationalChge:parseInt(e.OperationalChge),NoOfWeeks:parseInt(e.NoOfWeeks),NoOfIncidents:parseInt(e.NoOfIncidents),ReviewedBy:parseInt(e.ReviewedBy),RemediationPlan:parseInt(e.RemediationPlan),Results:parseInt(e.Results),sac:parseInt(e.sac),Number:parseInt(e.Number),NoOfHrs:parseInt(e.NoOfHrs),NoOfEmployees:parseInt(e.NoOfEmployees),Covered_OHS:parseInt(e.Covered_OHS),Covered_IAudit:parseInt(e.Covered_IAudit),Certified_OHS:parseInt(e.Certified_OHS),Fatalities:parseInt(e.Fatalities),High_Consequence:parseInt(e.High_Consequence),Recordable:parseInt(e.Recordable),HrsWorked:parseInt(e.HrsWorked),Emp_Entitled_leave:parseInt(e.Emp_Entitled_leave),Emp_Took_Leave:parseInt(e.Emp_Took_Leave),Emp_Returned_To_Work:parseInt(e.Emp_Returned_To_Work),Emp_Still_Employed:parseInt(e.Emp_Still_Employed)};return a},onUpdateEntry_Table:function(e){console.log("on submit");var t=this;var a=t.getView().byId("box2").getSelectedKey();var s=t.getView().byId("box1").getSelectedKey().toString();var o=this.KPISubtypeSelected+"";var l=this.KPITypeSelected+"";var i=this.getView().byId("KPI").getSelectedKey()+"";var r=this.getView().byId(e);var n=r.getSelectedItems();var d={items:[]};var u=t.getView().byId(e).getModel("SocialModel");for(var c=0;c<n.length;c++){var g=n[c].mAggregations.cells[0].mAggregations.items[0].mProperties.text;for(var p=0;p<u.getData().results.length;p++){if(g===u.getData().results[p].Identifier){var h=this._getJsonForRowUpdate(u.getData().results[p]);h=t._replaceNaNtoNull(h);console.log("jsonSustain:"+h);var y="SocialTableA(Year='"+a+"',Location='"+s+"',Type='"+l+"',SubType='"+o+"',KPI='"+i+"',Identifier='"+g+"')";var f=encodeURI(y);t.batchChanges.push(t.batchModel.createBatchOperation(f,"PATCH",h));break}else continue}}},_replaceNaNtoNull:function(e){if(isNaN(e.FUpto30yrs)){e.FUpto30yrs=null}if(isNaN(e.FUpto50yrs)){e.FUpto50yrs=null}if(isNaN(e.FMorethan50Yrs)){e.FMorethan50Yrs=null}if(isNaN(e.MUpto30yrs)){e.MUpto30yrs=null}if(isNaN(e.MUpto50yrs)){e.MUpto50yrs=null}if(isNaN(e.MMorethan50Yrs)){e.MMorethan50Yrs=null}if(isNaN(e.NUpto30yrs)){e.NUpto30yrs=null}if(isNaN(e.NUpto50yrs)){e.NUpto50yrs=null}if(isNaN(e.NMorethan50Yrs)){e.NMorethan50Yrs=null}if(isNaN(e.Female)){e.Female=null}if(isNaN(e.Male)){e.Male=null}if(isNaN(e.Neutral)){e.Neutral=null}if(isNaN(e.OperationalChge)){e.OperationalChge=null}if(isNaN(e.NoOfWeeks)){e.NoOfWeeks=null}if(isNaN(e.NoOfIncidents)){e.NoOfIncidents=null}if(isNaN(e.ReviewedBy)){e.ReviewedBy=null}if(isNaN(e.RemediationPlan)){e.RemediationPlan=null}if(isNaN(e.Results)){e.Results=null}if(isNaN(e.sac)){e.sac=null}if(isNaN(e.Number)){e.Number=null}if(isNaN(e.NoOfHrs)){e.NoOfHrs=null}if(isNaN(e.NoOfEmployees)){e.NoOfEmployees=null}if(isNaN(e.Covered_OHS)){e.Covered_OHS=null}if(isNaN(e.Covered_IAudit)){e.Covered_IAudit=null}if(isNaN(e.Certified_OHS)){e.Certified_OHS=null}if(isNaN(e.Fatalities)){e.Fatalities=null}if(isNaN(e.High_Consequence)){e.High_Consequence=null}if(isNaN(e.Recordable)){e.Recordable=null}if(isNaN(e.HrsWorked)){e.HrsWorked=null}if(isNaN(e.Emp_Entitled_leave)){e.Emp_Entitled_leave=null}if(isNaN(e.Emp_Took_Leave)){e.Emp_Took_Leave=null}if(isNaN(e.Emp_Returned_To_Work)){e.Emp_Returned_To_Work=null}if(isNaN(e.Emp_Still_Employed)){e.Emp_Still_Employed=null}return e},handleUploadPress:function(){var e=new sap.m.BusyDialog({title:"UploadFile",text:"Uploading ......"});e.open();that=this;var t=this.getView().byId("fileUploader");var a=t.getFocusDomRef();var s=a.files[0];var o={clientId:"default",documentType:"custom",enrichment:{},schemaId:"c5c7e09b-4489-47e6-810d-4d78e19edd34",templateId:"74e63a34-15fd-462c-a42a-8a58c30defbe"};var l=new FormData;l.append("file",s);l.append("options",'{"clientId": "default","documentType": "custom","enrichment": {},"schemaId": "c5c7e09b-4489-47e6-810d-4d78e19edd34","templateId": "74e63a34-15fd-462c-a42a-8a58c30defbe"}');console.log(o);var i="/comtechmsustainabilityui/DocExtractor/document-information-extraction/v1/document/jobs";jQuery.ajax({url:"https://86b1df35trial.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials",method:"GET",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:"Basic c2ItNTYwYTY2YjQtMWE4Yi00YTQ1LThhODUtNzA3MmQ0MzA4OTVmIWIxMTUwMTN8bmEtOWU1MDQ5OWYtNzhkZC00MGNhLWFkOGQtNjBhY2YwMmNmZjhiIWIzMDQxNzpSSUkyTXB3NUVZYnVRTzFvYWdENmRlU25FVkk9"},success:function(t,a,s){console.log("Success",t);var o="Bearer "+t.access_token;var r=jQuery.ajax({url:i,method:"POST",timeout:0,headers:{Authorization:o,Accept:"application/json"},processData:false,mimeType:"multipart/form-data",contentType:false,data:l,success:function(t,a,s){e.close();console.log("fileUploaded Successfully");console.log("data",t.id);var l=JSON.parse(t);getExtractionResults(l.id,o)},error:function(e,t,a){console.log("Error: "+a);console.log("Status: "+t)},complete:function(t,a){e.close();console.log("xhr: "+t);console.log("Status: "+a)}})},error:function(t,a,s){e.close();sap.m.MessageToast.show("Error in fetching token: "+s)},complete:function(e,t){console.log("xhr: "+e);console.log("Status: "+t)}})},onExportExcel:function(e){this._import(e.getParameter("files")&&e.getParameter("files")[0])},_import:function(e){var t=this;var a={};if(e&&window.FileReader){var s=new FileReader;s.onload=function(e){var s=e.target.result;var o=XLSX.read(s,{type:"binary"});o.SheetNames.forEach(function(e){a=XLSX.utils.sheet_to_row_object_array(o.Sheets[e])});var l=a.length;for(var i=0;i<l;i++){a[i].isExistingRow=false;a[i].isNewRow=true}var r=[];var n=t.EnvModel.getData().results;n.push(...a);t.EnvModel.setData({results:n});t.EnvModel.refresh(true)};s.onerror=function(e){console.log(e)};s.readAsBinaryString(e)}},onChangePrefix:function(e){this.prefix=e.getParameters().selectedItem.getProperty("key");console.log("onChangeKPI:"+this.prefix);this.calloData_Prefix_Values()},calloData_Prefix_Types:function(){var e=this;var t=this.getOwnerComponent().getModel("dataModel");var a="/Prefix_Types";this.PrefixTypesModel=new sap.ui.model.json.JSONModel;t.read(a,{success:function(t,a){var s=new sap.ui.model.json.JSONModel;s.setData(t);e.PrefixTypesModel.setData(t);console.log(e.PrefixTypesModel);console.log("ListModel:"+s)},error:function(e){MessageBox.error("Error")}})},calloData_Prefix_Values:function(){var e=this;var t=this.getOwnerComponent().getModel("dataModel");var a="/Prefix_Values";var s=this.prefix;var o=new sap.ui.model.Filter({path:"prefix",operator:sap.ui.model.FilterOperator.EQ,value1:s});this.PrefixValuesModel=new sap.ui.model.json.JSONModel;t.read(a,{filters:[o],success:function(t,a){var s=new sap.ui.model.json.JSONModel;s.setData(t);e.PrefixValuesModel.setData(t);e.prefixCount=t.results.length;e.getView().byId("cbPrevfixVal").setModel(e.PrefixValuesModel,"PrefixValuesModel")},error:function(e){MessageBox.error("Error")}})}})});var that;function getExtractionResults(e,t){var a=new sap.m.BusyDialog({title:"Extracting Results",text:"Extraction is in progress.. Please wait"});a.open();var s=e;var o=t;var l={results:[]};var i="/comtechmsustainabilityui/DocExtractor"+"/document-information-extraction/v1/document/jobs/"+e+"?returnNullValues=true&extractedValues=true";jQuery.ajax({url:i,method:"GET",headers:{Accept:"application/json",Authorization:t},success:function(e,t,i){if(e.status=="DONE"){a.close();console.log("------ Doc EXTRACTION DONE --------");console.log(e);var r={};for(var n=0;n<e.extraction.headerFields.length;n++){r[e.extraction.headerFields[n].name]=e.extraction.headerFields[n].value}for(var d=0;d<e.extraction.lineItems.length;d++){var u={};for(var c=0;c<e.extraction.lineItems[d].length;c++){u[e.extraction.lineItems[d][c].name]=e.extraction.lineItems[d][c].value}u.Year=r.Year;u.Location=r.Location;u.Division=r.Division;u.isExistingRow=false;u.isNewRow=true;l.results.push(u)}var g=that.getView().byId("EnvTable5").getModel("EnvModel").getProperty("/results");var p=g.concat(l.results);that.getView().byId("EnvTable5").getModel("EnvModel").getData().results=p;that.getView().byId("EnvTable5").getModel("EnvModel").refresh(true);return}else if(e.status=="PENDING"){setTimeout(function(){console.log("Pending");getExtractionResults(s,o)},5e3)}else if(e.status=="FAILED"){l.results=[{Type:"Direct Energy",SubType:"HSD",Month:"January",Value:"1.217",Unit:"gl",Cost:"61919",Currency:"USD",Quality:"n.a",Comment:"OK",Year:"2022",Location:"Nashville",Division:"ACME Industries"},{Type:"Direct Energy",SubType:"LPG",Month:"January",Value:"1.337",Unit:"gl",Cost:"64119",Currency:"USD",Quality:"n.a",Comment:"OK",Year:"2022",Location:"Nashville",Division:"ACME Industries"},{Type:"Water Withdrawal",SubType:"Bottled Water",Month:"January",Value:"9",Unit:"gl",Cost:"921334",Currency:"USD",Quality:"n.a",Comment:"OK",Year:"2022",Location:"Nashville",Division:"ACME Industries"}];var g=that.getView().byId("EnvTable5").getModel("EnvModel").getProperty("/results");var p=g.concat(l.results);that.getView().byId("EnvTable5").getModel("EnvModel").getData().results=p;that.getView().byId("EnvTable5").getModel("EnvModel").refresh(true)}},error:function(e,t,a){sap.m.MessageToast.show("Error in fetching extraction results: "+a)},complete:function(e,t){a.close();console.log("xhr: "+e);console.log("Status: "+t)},formatQuality:function(e){if(e==="Yes"){return true}else if(e==="No"){return false}}})}
//# sourceMappingURL=Social.controller.js.map