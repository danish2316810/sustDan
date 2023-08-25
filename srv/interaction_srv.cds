using app.interactions from '../db/interactions';
// using Z_ENVREPORT from '../db/interactions';
// using V_ENVREPORT2 from '../db/interactions';
// using V_ENVIRONMENT_PORTS from '../db/interactions';


service CatalogService @(path : '/catalog')  @(requires : 'authenticated-user') {
     // service CatalogService @(path : '/catalog')   {



     //     entity Download_Excel             as projection on interactions.Download_Excel;


     entity Environment_Report @(restrict : [
                                             //     {
                                             //         grant : ['READ'],
                                             //         to: 'Display',
                                             //         where: 'Location = $user.Location'

                                             //     },
                                             //     {
                                             //         grant : ['READ'],
                                             //         to: 'Display1',
                                             //         where: 'Type = $user.Type'

                                             //     },
                                             //     {
                                             //         grant : ['READ'],
                                             //         to: 'Divhead',
                                             //         where: 'Division : $user.Division'

                                             //     },
                                             //     {
                                             //         grant : ['READ'],
                                             //         to: 'Lochead',
                                             //         where: 'Location = $user.Location'

                                             //     },
                                             //      {
                                             //         grant : ['READ'],
                                             //         to: 'Dataowner1',
                                             //         where: 'Location = $user.Location and Type = $user.Type and SubType = $user.SubType and KPI = $user.KPI'

                                             //     },
                                             //      {
                                             //         grant : ['READ'],
                                             //         to: 'Dataowner2',
                                             //         where: 'Location = $user.Location'

                                             //     },
                                            {
          grant : [
               'WRITE',
               'READ'
          ],
          to    : 'Admin'

     }])                               as projection on interactions.Environment_Report;

    
     // entity Environment_Report_Telecom @(restrict : [

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'DivAdmin',
     //           where : 'Division = $user.Division'

     //      },

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'LocAdmin',
     //           where : 'Division = $user.Division and Location = $user.Location'

     //      },

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'TypeAdmin',
     //           where : 'Division = $user.Division and Location = $user.Location and Type = $user.Type '

     //      },

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'SubTypeAdmin',
     //           where : 'Location = $user.Location and Type = $user.Type and SubType = $user.SubType'

     //      },

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'KPIAdmin',
     //           where : 'Location = $user.Location and Type = $user.Type and SubType = $user.SubType and KPI = $user.KPI'

     //      },

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'Admin'

     //      }
     // ])                                as projection on interactions.Environment_Report_Telecom;

     entity PeopleImperative           as projection on interactions.PeopleImperative;
     entity Governance_Report          as projection on interactions.Governance_Report;
     entity EmissionFactors            as projection on interactions.EmissionFactors;
     entity UOM                        as projection on interactions.UOM;
     entity UoMConversions             as projection on interactions.UoMConversions;
     entity Supplier                   as projection on interactions.Supplier;
     entity LocationKPI                as projection on interactions.LocationKPI;
     entity SupplierSurvey             as projection on interactions.SupplierSurvey;
     entity SurveyQuestionnaire        as projection on interactions.SurveyQuestionnaire;


     // entity UOM_Telecom @(restrict : [
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'Admin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'DivAdmin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'LocAdmin'

     //      },
     //      {
     //           grant : ['READ'],
     //           to    : 'TypeAdmin',


     //      }

     // ])                                as projection on interactions.UOM_Telecom;

     // entity EmissionFactors_Telecom @(restrict : [
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'Admin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'DivAdmin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'LocAdmin'

     //      },
     //      {
     //           grant : ['READ'],
     //           to    : 'TypeAdmin',
     //           where : 'Type = $user.Type'

     //      }


     // ])                                as projection on interactions.EmissionFactors_Telecom;

     entity Division @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },


          {
               grant : ['READ'],
               to    : 'DivAdmin',
               where : 'Division = $user.Division'

          },
          {
               grant : ['READ'],
               to    : 'LocAdmin',
               where : 'Division = $user.Division'

          },

          {
               grant : ['READ'],
               to    : 'TypeAdmin',
               where : 'Division = $user.Division'

          }
     ])                                as projection on interactions.Division;

     entity Location @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },


          //    {
          //         grant : [ 'READ'],
          //         to: 'SustainabilityViewer'

          //    }
          // ,
          {
               grant : ['READ'],
               to    : 'LocViewers',
               where : 'Location = $user.Location'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin',
               where : 'Location = $user.Location'

          }


     ])                                as projection on interactions.Location;

     // entity UoMConversions_Telecom @(restrict : [

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'Admin'

     //      },

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'LocAdmin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'DivAdmin'

     //      },
     //      //    {
     //      //         grant : [ 'READ'],
     //      //         to: 'SustainabilityViewer'

     //      //    }
     //      {
     //           grant : ['READ'],
     //           to    : 'TypeAdmin'

     //      }

     // ])                                as projection on interactions.UoMConversions_Telecom;

     entity EnergyCnversions @(restrict : [

     {
          grant : [
               'WRITE',
               'READ'
          ],
          to    : 'Admin'

     }])                               as projection on interactions.EnergyCnversions;

     

     // entity EnergyCnversions_Telecom @(restrict : [

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'Admin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'LocAdmin'

     //      },
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'DivAdmin'

     //      },
     //      //    {
     //      //         grant : [ 'READ'],
     //      //         to: 'SustainabilityViewer'

     //      //    }
     //      {
     //           grant : ['READ'],
     //           to    : 'TypeAdmin'

     //      }

     // ])                                as projection on interactions.EnergyCnversions_Telecom

     
     entity KPIList                    as projection on interactions.KPIList;
     

     // entity KPIList_Telecom @(restrict : [

     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'Admin'

     //      },

     //      //    {
     //      //         grant : [ 'READ'],
     //      //         to: 'SustainabilityViewer'

     //      //    },

     //      //  Authorization for Division Admin to create new Type/SubType/KPI's
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'DivAdmin'

     //      },

     //      //  Authorization for Location Admin to create new Type/SubType/KPI's
     //      {
     //           grant : [
     //                'WRITE',
     //                'READ'
     //           ],
     //           to    : 'LocAdmin'

     //      },
     //      //  Authorization for Type Viewer to view Type/ALL Subtypes/KPI's of that type
     //      {
     //           grant : ['READ'],
     //           to    : 'TypeAdmin',
     //           where : 'Type = $user.Type '

     //      },
     //      //  Authorization for SubType Viewer to view Subtype/ ALL KPI's of that Subtype
     //      {
     //           grant : ['READ'],
     //           to    : 'SubTypeViewer',
     //           where : 'Type = $user.Type and SubType = $user.SubType'

     //      },
     //      //  Authorization for KPI Viewer to view KPI of a particular Type and Subtype
     //      {
     //           grant : ['READ'],
     //           to    : 'KPIViewer',
     //           where : 'Type = $user.Type and SubType = $user.SubType and KPI = $user.KPI'

     //      }


     // ])                                as projection on interactions.KPIList_Telecom;

     entity Constants                  as projection on interactions.Constants;

     entity Year_Module @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'


          },

          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Year_Module;

     entity Emission_Module @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'


          },

          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])

     as projection on interactions.Emission_Module;

     entity Constants_Telecom @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'

          },
          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Constants_Telecom;

     // entity FirstRedirect as projection on interactions.Standards_Telecom {
     //     id,
     //     toStandards_Telecom: redirected to FirstRedirect
     // };

     entity Standards_Module @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'

          },
          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Standards_Module;

     //     entity Standards_Item_Telecom
     //     @(restrict : [

     //         {
     //              grant : ['WRITE', 'READ'],
     //              to: 'Admin'

     //         },
     //         {
     //              grant : ['READ'],
     //              to: 'SustainabilityViewer'

     //         }

     //         ])
     //     as projection on interactions.Standards_Item_Telecom;
     entity Measure_Module @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'


          },

          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Measure_Module;

     entity Measure_Validation @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'


          },

          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Measure_Validation;

     entity Prefix_Types @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'


          },

          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Prefix_Types;

     entity Prefix_Values @(restrict : [

          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'Admin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'LocAdmin'

          },
          {
               grant : [
                    'WRITE',
                    'READ'
               ],
               to    : 'DivAdmin'

          },
          {
               grant : ['READ'],
               to    : 'TypeAdmin'


          },

          {
               grant : ['READ'],
               to    : 'SustainabilityViewer'

          }

     ])                                as projection on interactions.Prefix_Values;

     entity Temp                       as projection on interactions.Temp;

     entity IndustryList @(restrict : [

     {
          grant : [
               'WRITE',
               'READ'
          ],
          to    : 'Admin'

     }])                               as projection on interactions.IndustryList;

     entity KPIList_Social_Ports       as projection on interactions.KPIList_Social_Ports;
     entity SocialTableA               as projection on interactions.SocialTableA;

     entity MediaFile @(restrict : [

     {
          grant : [
               'WRITE',
               'READ'
          ],
          to    : 'Admin'

     }])                               as projection on interactions.MediaFile;

     // @readonly
     // entity V_Envreport                as projection on Z_ENVREPORT;

     // entity V_Envreport2               as projection on V_ENVREPORT2;
     // entity V_Environment_Ports        as projection on V_ENVIRONMENT_PORTS;


}
