
sap.ui.define([], function () {
	"use strict";
	return {
		formatField: function (isNewRow, isEditableRow, isExistingRow) {
            if(isNewRow || isEditableRow){
                return true;
            }
            else if(isExistingRow) {
                return false;
            }  
            return false; 
			
		}
	};
});