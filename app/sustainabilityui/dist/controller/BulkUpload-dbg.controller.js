sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controlleronpress
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.techm.sustainabilityui.controller.BulkUpload", {
            onInit: function () {
          
            },

            onPressBack: function (Event) {
                //navigates back
                this.getOwnerComponent().getRouter().navTo("Launchpad", {}, true);
            },
            handleDownload: function (Event){
                var that = this;
               // var OData = that.getOwnerComponent().getModel("dataModel");
                //var oCAPModel =     new sap.ui.model.odata.v2.ODataModel("/v2/catalog", true);
               /* var oCAPModel =     new sap.ui.model.odata.v2.ODataModel("", true);               
                                    
                oCAPModel.read("/Environment", {                                    
                    success: function (data, oResponse) {                        
                        console.log("Success");                                 
                    },
                    error: function (err) {
                        console.log("Error");
                    }
                });   */

                /*var y = "https://port4004-workspaces-ws-68b4h.eu10.applicationstudio.cloud.sap/Environment"
                var xmlHttp = null;
                xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", y, false);
                xmlHttp.send(null);*/
            },
            handleUrlPress: function (evt) {
			//sap.m.URLHelper.redirect(this._getVal(evt), true);
		    },
            _getVal: function(evt) {
              //  return evt.getSource().getValue();
            },
    });
});