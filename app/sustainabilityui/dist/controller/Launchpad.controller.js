sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("com.techm.sustainabilityui.controller.Launchpad",{onInit:function(){let e=sap.ui.core.UIComponent.getRouterFor(this)},onAfterRendering:function(){this.callODataService()},callODataService:function(){var e=this;var t=this.getOwnerComponent().getModel("dataModel");t.read("/IndustryList",{success:function(t,o){var a=new sap.ui.model.json.JSONModel;a.setData(t);e.getView().byId("Industry").setModel(a,"IndustryModel");var n=sap.ui.getCore().getModel("GlobalIndustryModel");n.getData().Industry=t.results[0].Industry;n.getData().KPIListTable=t.results[0].KPIListTable;n.getData().SocialTable=t.results[0].SocialTable;n.getData().TransactionTable=t.results[0].TransactionTable;n.getData().UOM_Telecom=t.results[0].UOM_Telecom;n.getData().UoMConversions_Telecom=t.results[0].UoMConversions_Telecom;n.getData().EmissionFactors_Telecom=t.results[0].EmissionFactors_Telecom},error:function(e){sap.m.MessageBox.error("Error")}})},onSelectionIndustry:function(e){var t=this;var o=e.getParameter("selectedItem").getKey();console.log("Selected Insdustry:"+o);var a=sap.ui.getCore().getModel("GlobalIndustryModel");var n=this.getView().byId("Industry").getModel("IndustryModel");var s=n.getData().results.length;for(var r=0;r<s;r++){if(o===n.getData().results[r].Industry){a.getData().Industry=n.getData().results[r].Industry;a.getData().KPIListTable=n.getData().results[r].KPIListTable;a.getData().SocialTable=n.getData().results[r].SocialTable;a.getData().TransactionTable=n.getData().results[r].TransactionTable;a.getData().UOM_Telecom=n.getData().results[r].UOM_Telecom;a.getData().UoMConversions_Telecom=n.getData().results[r].UoMConversions_Telecom;a.getData().EmissionFactors_Telecom=n.getData().results[r].EmissionFactors_Telecom;break}else continue}},handleTilePress:function(e){this.getOwnerComponent().getRouter().navTo("Environment",{},true)},handleTilePress_HR:function(e){this.getOwnerComponent().getRouter().navTo("Social",{},true)},handleTilePress_FI:function(e){this.getOwnerComponent().getRouter().navTo("Finance",{},true)},handleTilePress_DB:function(e){this.getOwnerComponent().getRouter().navTo("Dashboard",{},true)},handleTilePress_Admin:function(e){this.getOwnerComponent().getRouter().navTo("Admin",{},true)},handleTilePress_BulkUpload:function(e){this.getOwnerComponent().getRouter().navTo("BulkUpload",{},true)},onTilePress:function(e){this.getOwnerComponent().getRouter().navTo("Login",{},true)}})});
//# sourceMappingURL=Launchpad.controller.js.map