// namespace app.interactions;

using {
    Currency,  
    managed
} from '@sap/cds/common'; //commented on July 29, 2023
// // CDS Common Content
// // This package holds default content based on the ISO specification for the following CDS common definitions:

// // sap.common.Countries: ISO 3166-1
// // sap.common.Currencies: ISO 4217
// // sap.common.Languages: ISO 639-1
// }from '@sap/cds-common-content';

context app.interactions {
    type BusinessKey : String(10);
    type SDate : DateTime;
    type LText : String(1024);

    entity PeopleImperative {
        Type          : String;
        SubType       : String;
        Category      : String;
        Gender        : String;
        Upto30yrs     : Integer;
        Upto50yrs     : Integer;
        Morethan50Yrs : Integer;
        Total         : Integer;
        Division      : String;
        Location      : String;
        Year          : String;


    }
entity Location {
        Location : String;
        Industry : String;
    }
   
    entity Environment_Report {
        key Industry             : String(25) not null;
        key Year                 : String(25);
        key Month                : String(14);
        key Location             : String(120);
        key Type                 : String(50);
        key SubType              : String(50);
        key KPI                  : String not null;
        key Sno                  : Integer;
            // key supplier   : String(100);
            url                  : String;
            Value                : Decimal;
            Unit                 : String(4);
            IUnit                : String(8); // New field
            IValue               : Decimal; // New field
            Cost                 : Decimal;
            Currency             : String(10);
            Quality              : String(40);
            Comment              : LText;
            // New fileds added for
            FiscalType           : Boolean;
            YearA                : String(9);
            StartDate            : String(25);
            EndDate              : String(25);
            fiscal               : String(25);
            isValidationRequired : Boolean;
            // End of addition
            // Type       : String(50);
            // SubType    : String(50);
            Owner                : String;
            Approver             : String;
            Division             : String;
            Value2               : Decimal;
            Unit2                : String(4);
            Distance             : Decimal;
            Weight               : Decimal;
            Scope                : String;
            Associates           : Integer;
            // Sno        : Integer;
            Date                 : Date;
            Logic                : String(15); //new field
            Measure              : String(70); //new field
            Standard1            : String; //new field
            LogicE               : String(20); //new field
            GRIStd               : String; //new field
            SDG                  : String(500); //new field
            Class                : String(50); //new field
            RenNon               : String; //new field added Reneable/non renewable
            createdAt            : Timestamp @cds.on.insert : $now;
            modifiedAt           : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
            FValue               : Decimal;
            FValue1              : Decimal; //new field for energy emissions
    }

    

    entity Governance_Report {
        Type       : String;
        SubType    : String;
        Category   : String;
        Value      : Decimal;
        Unit       : String;
        Quality    : String;
        Comment    : String;
        Textanswer : String;
        Division   : String;
        Location   : String;
        Year       : String;
    }

    // entity EmissionFactors : managed {
    entity EmissionFactors {
        key Industry       : String(25) not null;
        key KPI            : String;
        key Type           : String;
        key SubType        : String;
        key Standard       : String;
        key Shortlong      : String;
        key class          : String;
            EmissionFactor : Decimal;
            UoM            : String;
            Deno           : String;
            Nume           : String; //new field added
            createdAt      : Timestamp @cds.on.insert : $now;
            modifiedAt     : Timestamp @cds.on.insert : $now  @cds.on.update : $now;

    }

    
    entity Division {
    key Industry : String(25) not null;
    key    Division : String;
        // Location : String;
    }

    

    entity UOM {
        key Industry : String(25) not null;
        key Measure      : String not null;
            Unit         : String not null;
        key Abbreviation : String not null;
    }

    entity UoMConversions {
        key Industry : String(25) not null;
        key Measure            : String not null;
        key UserInputUnit      : String not null;
        key ExpectedOutputUnit : String not null;
            ConverstionFactor  : Decimal not null;
            Operation          : String not null;
            KPI                : String(70); //new field added
            Type               : String(70); //new field added
            Subtype            : String(70); //new field added
    // Energy             : String(70);//new field added

    }

  

    entity EnergyCnversions {

        key Industry           : String(25) not null;
        key KPI                : String(70); //new field added
        key Type               : String(70); //new field added
        key Subtype            : String(70); //new field added
            // Energy             : String(70);//new field added
        key UserInputUnit      : String not null;
            ExpectedOutputUnit : String not null;
            ConverstionFactor  : Decimal not null;
            Operation          : String not null;

    }

    

    entity KPIList : managed {
        key Industry             : String(25) not null;
        key KPI               : String(50) not null;
        key Type              : String(50) not null;
        key SubType           : String(50) not null;
            EnergyUse         : String(100);
            Supplier          : String(100);
            BiogenicEmissions : String(4);
            Template          : String;
            Measure           : String(50);
            // Standard          : String;
            EFStandard : String;
            // Logic             : String;
            EmissionLogic : String(50);
            Scope             : String;
            // Standard1         : String;
            ReportingStandard : String;
            // LogicE            : String(20);
            EnergyLogic  : String(20);
            GRIStd            : String;
            SDG               : String;
            RenNon            : String; //new field added Reneable/non renewable
    // createdAt      : Timestamp @cds.on.insert : $now;
    // modifiedAt : Timestamp  @cds.on.insert : $now   @cds.on.update : $now;
    }

   

    entity Temp {
        key Identifier : String not null;
            Lower      : Integer not null;
            Upper      : Integer not null;
    }

    entity Constants {
        // key Industry  : String(25) not null;
        key ID    : String not null;
        key Value : String not null;
    }

    entity Constants_Telecom {
        key ID       : String not null;
        key Value    : String not null;
        key Industry : String not null;
    }

    

    entity IndustryList {
        key Industry                  : String(25) not null;
            IndustryDesc              : String;
            TransactionTable          : String(50);
            KPIListTable              : String(50);
            SocialTable               : String(50);
            UOM_Telecom               : String(50);
            UoMConversions_Telecom    : String(50);
            EmissionFactors_Telecom   : String(50);
            ENergyConversions_Telecom : String(50);
            Measure_Telecom           : String(50);

    }

    entity Year_Module {
            // key Year: String(25) not null;
        // key Vertical  : String(9) not null;
        Industry                  : String(25) not null;
        key YearL     : String(4);
        key fiscal    : String(25);
            YearR     : String(4);
            YearA     : String(9);
            StartDate : String(25);
            EndDate   : String(25);


    }

    entity Emission_Module {
        key id                      : Integer not null;
            YearL                   : String(4);
            scope                   : String(20);
            Level1                  : String(50);
            Level2                  : String(50);
            Level3                  : String(500);
            Level4                  : String(50);
            ColumnText              : String(50);
            UomSimple               : String(25);
            Uom                     : String(25);
        key GHG                     : String(30);
        key LookUp                  : String(500);
            GHGConversionFactor2021 : String(25);
    //  UomConversionFactor          : Decimal;


    }

    entity KPIList_Social_Ports {
        
        key Type     : String(50);
        key SubType  : String(50);
        key KPI      : String not null;
        key Prefix   : String;
            Template : String;
            GRIStd   : String;
            SDG      : String;
            Logic    : String;
            // Prefix   : String;
            InfoType : String;
    }

    entity SocialTableA {
        key Year                 : String(25);
        key Location             : String;
        key Type                 : String(50);
        key SubType              : String(50);
        key KPI                  : String not null;
        key Division             : String;
        key Prefix               : String;
        key Identifier           : String;
            Template             : String;
            Logic                : String;
            ltext                : String;
            FUpto30yrs           : Integer;
            FUpto50yrs           : Integer;
            FMorethan50Yrs       : Integer;
            MUpto30yrs           : Integer;
            MUpto50yrs           : Integer;
            MMorethan50Yrs       : Integer;
            NUpto30yrs           : Integer;
            NUpto50yrs           : Integer;
            NMorethan50Yrs       : Integer;
            Female               : Integer;
            Male                 : Integer;
            Neutral              : Integer;
            Response             : String;
            OperationalChge      : Integer;
            NoOfWeeks            : Integer;
            NoOfIncidents        : Integer;
            ReviewedBy           : Integer;
            RemediationPlan      : Integer;
            Results              : Integer;
            sac                  : Integer;
            Number               : Integer;
            NoOfHrs              : Integer;
            NoOfEmployees        : Integer;
            Covered_OHS          : Integer;
            Covered_IAudit       : Integer;
            Certified_OHS        : Integer;
            Fatalities           : Integer;
            High_Consequence     : Integer;
            Recordable           : Integer;
            HrsWorked            : Integer;
            Emp_Entitled_leave   : Integer;
            Emp_Took_Leave       : Integer;
            Emp_Returned_To_Work : Integer;
            Emp_Still_Employed   : Integer;
            //Start of NEw addition to accommodate Year module 19/05/2023
            FiscalType           : Boolean;
            YearA                : String(9);
            StartDate            : String(25);
            EndDate              : String(25);
            fiscal               : String(25);
            //End of NEw addition to accommodate Year module 19/05/2023
            IsTotalRequired      : Boolean;
            total                : Integer;
    }

    // Start Standards value help tables

    entity Standards_Module {

        key id                  : String;
            HierarchyLevel      : String;
            ParentNodeID        : String;
            Description         : String;
            DrillState          : String;

            // ITEMS : Composition of many  Standards_Item_Telecom
            // on ITEMS.INTHeader = $self;

            toStandards_Module : Association to many Standards_Module
                                      on toStandards_Module.id = $self.ParentNodeID;
    // HierarchyLevel  : String;


    // DrillState      : String;

    }

    entity Measure_Module {
        key Industry          : String(25) not null;
        key InputMeasureType  : String not null;
            InputUom          : String not null;
            OutputMeasureType : String not null;
            OutputUoM         : String not null;
            ConverstionFactor : Decimal not null;
            Operation         : String not null;

    }

    entity Supplier {

        key SupplierID              : Integer not null;
            SupplierName            : String not null;
            SupplierAddress         : String not null;
            SupplierContactPoint    : String not null;
            SupplierContactNumber   : Decimal not null;
            Supplier_Category       : String(20);
            // multi select, list of KPIs where "Supplier" is marked as yes
            KPI_List                : String;
            CompanySPOC            : String(50);
            Status                  : String;
            RelationshipStartDate : Date;
            RelationshipEndDate   : Date;
            Industry                : String(50);


    }

    entity SurveyQuestionnaire {

        key SurveyID      : Integer not null;
            ReportingYear : String;
            Section        : String;
            QuestionID    : String;
            QuestionText  : String;
            KPI_Mapping    : String;
            // multi select, list of KPIs where "Supplier" is marked as yes
            Industry       : String;


    }

    entity SupplierSurvey {

        key SurveyID           : Integer not null;
        key SupplierID          : Integer not null;
            ReportingYear      : String;
            Section             : String;
            SurveyResponse      : String;
            SurveyResponseValue : Decimal;
            Fvalue              : Decimal;
            // multi select, list of KPIs where "Supplier" is marked as yes
            FValue1             : Decimal;
            EmissionLogic       : String(50);
            EnergyLogic         : String;
            // Evidence : Date;
            Ratings             : Decimal;
            Remarks             : String;
            Industry            : String(50);


    }

    entity LocationKPI {

        key LocKPIId            : Integer not null;
            LocKpiName          : String;
            LocId               : Integer;
            BaselineWaterStress : Integer;
            FacilityType        : Integer;
            ProAreaName         : String;
            ProAreaDesgn        : Integer;
            ProAreaDist         : Integer;
            ReportingYear       : Date;

    }

    entity Measure_Validation {


        key MeasureType : String not null;
        key InputUom    : String not null;
            OutputUoM   : String not null;

    }

    entity Prefix_Types {


        key prefix : String not null;


    }

    entity Prefix_Values {

        key prefix : String not null;
        key value  : String not null;


    }

    entity MediaFile : managed {
        key id        : UUID;
            @Core.MediaType   : mediaType
            content   : LargeBinary;
            @Core.IsMediaType : true
            mediaType : String;
            fileName  : String;
            url       : String;
    };


}

// @cds.persistence.exists
// @cds.persistence.calcview
// entity![Z_ENVREPORT]{
//     key![YEAR]       : String(25)   @title : 'YEAR: YEAR';
//     key![MONTH]      : String(14)   @title : 'MONTH: MONTH';
//     key![LOCATION]   : String(120)  @title : 'LOCATION: LOCATION';
//     key![TYPE]       : String(50)   @title : 'TYPE: TYPE';
//     key![SUBTYPE]    : String(50)   @title : 'SUBTYPE: SUBTYPE';
//     key![KPI]        : String(5000) @title : 'KPI: KPI';
//     key![SNO]        : Integer      @title : 'SNO: SNO';
//     key![UNIT]       : String(4)    @title : 'UNIT: UNIT';
//     key![CURRENCY]   : String(10)   @title : 'CURRENCY: CURRENCY';
//     key![QUALITY]    : String(40)   @title : 'QUALITY: QUALITY';
//     key![COMMENT]    : String(1024) @title : 'COMMENT: COMMENT';
//     key![OWNER]      : String(5000) @title : 'OWNER: OWNER';
//     key![APPROVER]   : String(5000) @title : 'APPROVER: APPROVER';
//     key![DIVISION]   : String(5000) @title : 'DIVISION: DIVISION';
//     key![UNIT2]      : String(4)    @title : 'UNIT2: UNIT2';
//     key![SCOPE]      : String(5000) @title : 'SCOPE: SCOPE';
//     key![DATE]       : Date         @title : 'DATE: DATE';
//     key![LOGIC]      : String(15)   @title : 'LOGIC: LOGIC';
//     key![MEASURE]    : String(70)   @title : 'MEASURE: MEASURE';
//     key![GRISTD]     : String(30)   @title : 'GRISTD: GRISTD';
//     key![SDG]        : String(70)   @title : 'SDG: SDG';
//     key![CLASS]      : String(50)   @title : 'CLASS: CLASS';
//     key![RENNON]     : String(5000) @title : 'RENNON: RENNON';
//     key![VALUE]      : Decimal(34)  @title : 'VALUE: VALUE';
//     key![COST]       : Integer      @title : 'COST: COST';
//     key![VALUE2]     : Decimal(34)  @title : 'VALUE2: VALUE2';
//     key![DISTANCE]   : Decimal(34)  @title : 'DISTANCE: DISTANCE';
//     key![WEIGHT]     : Decimal(34)  @title : 'WEIGHT: WEIGHT';
//     key![ASSOCIATES] : Integer      @title : 'ASSOCIATES: ASSOCIATES';
//     key![FVALUE]     : Decimal(34)  @title : 'FVALUE: FVALUE';
//     key![FVALUE1]    : Decimal(34)  @title : 'FVALUE1: FVALUE1';
// }

// ;

// @cds.persistence.exists
// @cds.persistence.calcview
// entity![V_ENVREPORT2]{
//     key![YEAR]       : String(25)   @title : 'YEAR: YEAR';
//     key![LOCATION]   : String(120)  @title : 'LOCATION: LOCATION';
//     key![TYPE]       : String(50)   @title : 'TYPE: TYPE';
//     key![SUBTYPE]    : String(50)   @title : 'SUBTYPE: SUBTYPE';
//     key![KPI]        : String(5000) @title : 'KPI: KPI';
//     key![DATE]       : Date         @title : 'DATE: DATE';
//     key![UNIT]       : String(4)    @title : 'UNIT: UNIT';
//     key![CURRENCY]   : String(10)   @title : 'CURRENCY: CURRENCY';
//     key![CLASS]      : String(40)   @title : 'CLASS: CLASS';
//     key![QUALITY]    : String(40)   @title : 'QUALITY: QUALITY';
//     key![ATTACHMENT] : String(5000) @title : 'ATTACHMENT: ATTACHMENT';
//     key![COMMENT]    : String(1024) @title : 'COMMENT: COMMENT';
//     key![OWNER]      : String(5000) @title : 'OWNER: OWNER';
//     key![APPROVER]   : String(5000) @title : 'APPROVER: APPROVER';
//     key![DIVISION]   : String(5000) @title : 'DIVISION: DIVISION';
//     key![SNO]        : Integer      @title : 'SNO: SNO';
//     key![VALUE]      : Decimal(34)  @title : 'VALUE: VALUE';
//     key![COST]       : Integer      @title : 'COST: COST';
//     key![FVALUE]     : Decimal(34)  @title : 'FVALUE: FVALUE';
// };


// @cds.persistence.exists
// @cds.persistence.calcview
// @cds.persistence.exists
// entity![V_ENVIRONMENT_PORTS]{
//     key![YEAR]       : String(25)   @title : 'YEAR: YEAR';
//     key![MONTH]      : String(14)   @title : 'MONTH: MONTH';
//     key![LOCATION]   : String(120)  @title : 'LOCATION: LOCATION';
//     key![TYPE]       : String(50)   @title : 'TYPE: TYPE';
//     key![SUBTYPE]    : String(50)   @title : 'SUBTYPE: SUBTYPE';
//     key![KPI]        : String(5000) @title : 'KPI: KPI';
//     key![UNIT]       : String(4)    @title : 'UNIT: UNIT';
//     key![CURRENCY]   : String(10)   @title : 'CURRENCY: CURRENCY';
//     key![QUALITY]    : String(40)   @title : 'QUALITY: QUALITY';
//     key![COMMENT]    : String(1024) @title : 'COMMENT: COMMENT';
//     key![OWNER]      : String(5000) @title : 'OWNER: OWNER';
//     key![APPROVER]   : String(5000) @title : 'APPROVER: APPROVER';
//     key![DIVISION]   : String(5000) @title : 'DIVISION: DIVISION';
//     key![UNIT2]      : String(4)    @title : 'UNIT2: UNIT2';
//     key![SCOPE]      : String(5000) @title : 'SCOPE: SCOPE';
//     key![DATE]       : Date         @title : 'DATE: DATE';
//     key![LOGIC]      : String(15)   @title : 'LOGIC: LOGIC';
//     key![MEASURE]    : String(70)   @title : 'MEASURE: MEASURE';
//     key![GRISTD]     : String(30)   @title : 'GRISTD: GRISTD';
//     key![SDG]        : String(70)   @title : 'SDG: SDG';
//     key![CLASS]      : String(50)   @title : 'CLASS: CLASS';
//     key![RENNON]     : String(5000) @title : 'RENNON: RENNON';
//     key![SNO]        : Integer      @title : 'SNO: SNO';
//     key![VALUE]      : Decimal(34)  @title : 'VALUE: VALUE';
//     key![COST]       : Integer      @title : 'COST: COST';
//     key![VALUE2]     : Decimal(34)  @title : 'VALUE2: VALUE2';
//     key![DISTANCE]   : Decimal(34)  @title : 'DISTANCE: DISTANCE';
//     key![WEIGHT]     : Decimal(34)  @title : 'WEIGHT: WEIGHT';
//     key![ASSOCIATES] : Integer      @title : 'ASSOCIATES: ASSOCIATES';
//     key![FVALUE]     : Decimal(34)  @title : 'FVALUE: FVALUE';
//     key![FVALUE1]    : Decimal(34)  @title : 'FVALUE1: FVALUE1';
// };
