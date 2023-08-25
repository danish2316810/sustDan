// const { Readable, PassThrough } = require("stream");
        const cds = require('@sap/cds');
        cds.env.features.fetch_csrf = true
module.exports = srv => {

    const cds = require('@sap/cds')
// For excel download
    // var xl = require('excel4node');

    // const { buffer } = require('stream/consumers');//Commented this line on June 20, 2023 because of deployment issue
// Excel download end
    // const { Standards_Telecom } = cds.entities('CatalogService');

    // srv.before("READ", "Standards_Telecom", async (xs) => {
    //     var res = [];
    //     const cats = await cds.connect.to('CatalogService');
    //     const { Standards_Telecom } = cats.entities('CatalogService');
    //     console.log("data", xs.data);
    //     if (xs.data.id == undefined) {
    //         // res= await cds.read(Standards_Telecom.where`({ '$expand': 'ITEMS', '$skip': '0', '$top': '110' })`;
    //         // res = await cds.read(Standards_Telecom).where`id = '1'`
    //         res = await cds.read(Standards_Telecom).where`({
    //              '$expand': 'ITEMS', '$skip': '0', '$top': '1' 
    //         })`
    //     }

    //     // console.log("done");
    //     const cats = await cds.connect.to('CatalogService');
    //     const { UoMConversions } = cats.entities;

    //     var uom = [];
    //     uom = await cds.tx(xs).run(SELECT.from(UoMConversions));
    //     // console.log(uom);

    //     xs.forEach(x => {
    //         if (x.SubType === 'HSD') {

    //             const found = uom.find(element => element.UserInputUnit = x.Unit);
    //             if (found) {
    //                 // operate user input value with operation conversionfactor
    //                 // if (found.Operation == "*") {
    //                 //     x.Value = x.Value * found.ConverstionFactor;
    //                 //     // console.log(x.Value + found.ConverstionFactor);

    //                 // } else {
    //                 //     x.Value = x.Value  / found.ConverstionFactor;
    //                 // }


    //             }

    //             //   x.Unit = 'L';

    //         }

    //         //   });
    //    console.log(res);
            // return res;


        // });
    // });
// ***********************Media

// srv.before('CREATE', "MediaFile", async (req) => {
//     // const db = await cds.connect.to("db");
//     const db = await cds.connect.to('CatalogService');
//     // Create Constructor for SequenceHelper 
//     // Pass the sequence name and db
//     console.log("Request data", req.data);
//     // const SeqReq = new SequenceHelper({
//     //     sequence: "MEDIA_ID",
//     //     db: db,
//     // });
//     //Call method getNextNumber() to fetch the next sequence number 
//     // let seq_no = await SeqReq.getNextNumber();
//     // let seq_no = 1;
//     // Assign the sequence number to id element
//     //  req.data.id = 1;
//     //req.data.content = '1';
//     //Assign the url by appending the id
//     req.data.url = `/catalog/MediaFile(${req.data.id})/content`;
//     const readable = new Readable();
//         readable.push(req.data.content);
//         readable.push(null)
//         req.data.content = readable,
//         console.log("last", req.data.content);

//     // console.log("last", req.data.content);
// });

// srv.on("READ", "MediaFile", async (req, next) => {
//     if (!req.data.id) {
//         return next();
//     }
//     //Fetch the url from where the req is triggered
//     const url = req._.req.path;
//     //If the request url contains keyword "content"
//     // then read the media content
//     if (url.includes("content")) {
//         const id = req.data.id;
//         var tx = cds.transaction(req);
//         // Fetch the media obj from database
//         var mediaObj = await tx.run(
//             SELECT.one.from("APP_INTERACTIONS_MEDIAFILE", ["content", "mediaType"]).where(
//                 "id =",
//                 id
//             )
//         );
//         if (mediaObj.length <= 0) {
//             req.reject(404, "Media not found for the ID");
//             return;
//         }
//         var decodedMedia = "";
//         decodedMedia = new Buffer.from(
//             mediaObj.content.toString().split(";base64,").pop(),
//             "base64"
//         );
//         return _formatResult(decodedMedia, mediaObj.mediaType);
//     } else return next();
// });

// function _formatResult(decodedMedia, mediaType) {
//     const readable = new Readable();
//     const result = new Array();
//     readable.push(decodedMedia);
//     readable.push(null);
//     return {
//         value: readable,
//         '*@odata.mediaContentType': mediaType
//     }
// }


// **************end media
    //   *********Fetch Envivironment Reports**************************************
    // srv.on("READ", "Environment_Report", async (xs) => {
        
    //     var q;

    //     const cats = await cds.connect.to('CatalogService');
    //     const { Environment_Report } = cats.entities;
    //     var results = [];
    //     results = await SELECT.from(Environment_Report);

    //     return results;



    // });
    // ********************End of fetching*************************************

     //   *********Fetch DEFRA Records**************************************
    //  srv.on("READ", "Emission_Module_telecom", async (xs) => {
        
    //     var q;

    //     const cats = await cds.connect.to('CatalogService');
    //     const { Emission_Module_telecom } = cats.entities;
    //     var results = [];
    //     if (xs.data.YearL) {
    //         results = await SELECT.from(Emission_Module_telecom).where`YearL = ${xs.data.YearL}`;   
    //     } else {
    //         results = await SELECT.from(Emission_Module_telecom); 
    //     }
        

    //     return results;



    // });
    // ********************End of fetching*************************************

   
    


    // *********************** TELECOM LOGIC*****************************************************

    // **********************START OF TELECOM LOGIC**********************************************************//
    srv.before("CREATE", "Environment_Report", async (xs, res) => {
        var results = [];
        var flag = false;
        var intvalue;
        var emission;
        var shortVal;
        var uom1;
        var Energy;
        var uom2;
        var InputValueTel;

        console.log("Test");
        const cats = await cds.connect.to('CatalogService');
        const { UoMConversions, EmissionFactors, Temp, EnergyCnversions, 
            Measure_Module, Measure_Validation } = cats.entities;

// ************************Start of Uom Check******************************
// try {
//     console.log("MValidation");
//     console.log(xs.data.Unit);
//     console.log(xs.data.Measure);
//     if (xs.data.isValidationRequired == true) {
        
    
//     const MValidation = await cds.tx(xs).run(SELECT.from(Measure_Validation).where({
//         MeasureType: xs.data.Measure,
//         InputUom: xs.data.Unit
//     }));
//     console.log(MValidation);
//     if (MValidation[0].OutputUoM !== "") {
//         xs.data.Unit = MValidation[0].OutputUoM;
//         console.log("Mvalidation", MValidation[0].OutputUoM);
//         console.log("Input Unit", xs.data.Unit);
//     } 
// }
// } catch (error) {
//     xs.error(500, "Please check the UoM");
// }
    
//*****************End of UomCheck */

        try {


            // ********************Start of LogicT**********************************
            if (xs.data.Logic == 'LogicT') {
                try {
                    console.log(xs.data.LogicE);

                    EnergyTelecom = await cds.tx(xs).run(SELECT.from(Measure_Module).where({
                        InputMeasureType: xs.data.Measure
                        // KPI: xs.data.KPI,
                        // Type: xs.data.Type,
                        // SubType: xs.data.SubType
                    }));
                    console.log(EnergyTelecom);
                    if (EnergyTelecom.length != 0) {
                        console.log(xs.data.Unit);
                        const cVal = EnergyTelecom[0].ConverstionFactor;
                        var cNewVal = Number.parseFloat(cVal).toFixed(3);
                        if (xs.data.Unit === EnergyTelecom[0].InputUom) {
                            // const cVal = EnergyTelecom[0].ConverstionFactor;
                            // var cNewVal = Number.parseFloat(cVal).toFixed(3);
                            InputValueTel = xs.data.Value * cNewVal;
                            console.log(InputValueTel);
                        } else {
                            try {
                                const uom = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                    UserInputUnit: xs.data.Unit,
                                    ExpectedOutputUnit: EnergyTelecom[0].InputUom
                                }));
                                console.log("show uom");
                                console.log(uom);
                                const cVal = uom[0].ConverstionFactor;
                                const convVal = Number.parseFloat(cVal).toFixed(3);
                                if (uom[0].Operation == "*") {
                                    InputValueTel = convVal * xs.data.Value;
                                    InputValueTel = InputValueTel * cNewVal;
                                    console.log(InputValueTel);
                                } else {
                                    InputValueTel = xs.data.Value / convVal;
                                    InputValueTel = InputValueTel * cNewVal;
                                    console.log(InputValueTel);
                                }

                            } catch (error) {
                                xs.error(400, "error" + e);
                            }

                        }
                    }
                }
                catch (e) {
                    //xs.data.error = "Exception occured" + e;
                    xs.error(400, "error" + e);

                }
            }
            //********************End of LogicT **************************************/ 

            // if (xs.data.Logic != 'Logic2') {
            if (xs.data.Logic == 'Logic1' || xs.data.Logic == 'LogicT') {
                // emission = await cds.read(EmissionFactors).where({ KPI: xs.data.KPI });

                // emission = await cds.read(EmissionFactors_Telecom).where({
                //     KPI: xs.data.KPI,
                //     Type: xs.data.Type,
                //     SubType: xs.data.SubType
                // });
                console.log("test3");
                // emission = await  {SELECT:{from: {ref:["EmissionFactors"]},
                // where:[
                //      {ref:["KPI"]},
                //  '=', {val:[xs.data.KPI]},
                //   'and', {ref:["Type"]},
                //    '=', {val:[xs.data.Type]},
                //    'and', {ref:["SubType"]},
                //    '=', {val:[xs.data.SubType]}],                 
                //  orderBy:[{ref:["createdAt"], sort:'asc'}]
                // }};
                emission =   await SELECT.from(EmissionFactors).where
                ({ KPI: xs.data.KPI, Type: xs.data.Type, SubType: xs.data.SubType })
                .orderBy({ createdAt: "desc" });
                    

                // }
                console.log("emission");
                console.log(emission);
                //   console.log(xs.data.SubType);
                if (emission) {



                    const x = emission[0];
                    console.log("Emission");
                    console.log(x);

                    const Val = x.EmissionFactor;


                    const newVal = Number.parseFloat(Val).toFixed(5);
                    intvalue = newVal;
                    console.log(intvalue);

                    // if (x.UoM) {


                    var splitUom = x.UoM.toString().split("/");
                    //         //Compare the incoming uom with the denominator of emission uom


                    if (xs.data.Logic == 'LogicT') {
                        // if (splitUom[1] == EnergyTelecom[0].ExpectedOutputUnit) {
                        if (x.Deno == EnergyTelecom[0].OutputUoM) {
                            flag = true;
                            xs.data.FValue = InputValueTel * newVal;
                            console.log(InputValueTel);
                            console.log(newVal);
                            console.log(intvalue);
                            console.log(xs.data.FValue);
                            // Get the value of the interim unit and value
                            xs.data.IUnit = x.Deno;
                            xs.data.IValue = InputValueTel;
                            console.log("IUnit", xs.data.IUnit);
                            console.log("Ivalue", xs.data.IValue );

                            // }



                        }
                        // }
                    } else {
                        // if (splitUom[1] == xs.data.Unit) {
                        if (x.Deno == xs.data.Unit) {
                            flag = true;
                            xs.data.FValue = xs.data.Value * newVal;
                            // }
                            // Get the value of the interim unit and value
                            xs.data.IUnit = x.Deno;
                            xs.data.IValue = xs.data.Value;


                        }
                        // } 
                    }


                    //******The second iteration with UOM conversion after this */
                    // console.log(flag);
                    if (flag == false) {

                        if (xs.data.Logic == 'LogicT') {
                            console.log("uom_new");
                            uom2 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                UserInputUnit: EnergyTelecom[0].OutputUoM,
                                ExpectedOutputUnit: x.Deno
                            }));
                            //     console.log("uom");
                            // console.log(uom);
                        } else {
                            console.log("uom");
                            // console.log(uom);
                            uom2 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                UserInputUnit: xs.data.Unit,
                                ExpectedOutputUnit: x.Deno
                            }));
                            // console.log("uom");

                        }


                        const cVal = uom2[0].ConverstionFactor;
                        console.log(uom2);
                        // console.log(cVal);
                        var cNewVal = Number.parseFloat(cVal).toFixed(3);
                        console.log(cNewVal);



                        if (uom2[0].Operation == "*") {

                            xs.data.FValue = xs.data.Value * cNewVal;
                            console.log("Show FValue");
                            console.log(xs.data.FValue);
                            // Get the value of the interim unit and value
                            xs.data.IUnit = x.Deno;
                            xs.data.IValue = xs.data.FValue;
                            console.log("IUnit", xs.data.IUnit);
                            console.log("Ivalue", xs.data.IValue );
                            xs.data.FValue = xs.data.FValue * intvalue;//new addition
                            // console.log(intvalue);
                            // console.log(FValue);

                        } else {
                            xs.data.FValue = xs.data.Value / cNewVal;
                            // Get the value of the interim unit and value
                            xs.data.IUnit = x.Deno;
                            xs.data.IValue = xs.data.FValue;
                            xs.data.FValue = xs.data.FValue * intvalue;
                            console.log("Show FValue");
                            console.log(xs.data.FValue);

                            // console.log(cNewVal);
                            // console.log(xs.data.Value);
                        }

                    }

                    // Convert to MTCO2e if the final nemission unit is not the same
                    // get the numerator of the KPI if it does not match go to UOM conversion table
                    // get the conversion factor and multiply it with fval
                    console.log(xs.data.FValue);
                    console.log(emission[0].Nume);
                    const uom = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                        UserInputUnit: emission[0].Nume,
                        Measure: 'Emissions'

                    }));
                    console.log("uom energy conversion", uom);
                    //Energy conversion factor derivation
                    if (xs.data.LogicE == "LogicE") {
                        console.log("Show Energy11");
                        Energy = await cds.tx(xs).run(SELECT.from(EnergyCnversions).where({
                            KPI: emission[0].KPI,
                            Type: xs.data.Type,
                            SubType: xs.data.SubType
                            // UserInputUnit: xs.data.Unit


                        }));
                        console.log("Show Energy");
                        console.log(Energy.length);
                        console.log(Energy[0]);
                        //If the incoming unit and userinput unit in energyconverison table are same no conversion is required
                        if (Energy.length != 0) {
                            console.log("Show Energy");
                            if (xs.data.Unit == Energy[0].UserInputUnit) {

                            } else {

                                uom1 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                    UserInputUnit: xs.data.Unit,
                                    ExpectedOutputUnit: Energy[0].UserInputUnit


                                }));
                            }

                        }


                    }
                    // added a condition
                    console.log("Uom", uom) ;
                    //  if (uom != null) {
                        console.log("Uom") ;
                        var cVal1 = uom[0].ConverstionFactor; 
                        console.log("ConvFactor", cVal1) ;
                    //  }
                    

                    var cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                    console.log("ConvFactor", cNewVal1) ;
                    // console.log(cVal1);
                    // console.log(cNewVal1);
                    if (uom[0].Operation == "*") {
                        console.log("Show MTCO2");
                        console.log("Energy", xs.data.LogicE)

                        xs.data.FValue = xs.data.FValue * cNewVal1;
                        console.log(xs.data.FValue);
                    }
                    else {
                        console.log("Show MTCO2");
                        console.log("Energy", xs.data.LogicE)
                        xs.data.FValue = xs.data.FValue / cNewVal1;
                        console.log(xs.data.FValue);

                    }
                    //End of code addition for fval conversion to MTCO2e as final unit
                    //Energy calculations
                    if (xs.data.LogicE == "LogicE") {
                        if (Energy.length != 0) {
                            // console.log("Conv factor");
                            console.log("uom1");
                            console.log(uom1);
                            // if (uom1) {
                            if (uom1 != null || uom1 !== undefined) {
                                // console.log("Conv factor");
                                cVal1 = uom1[0].ConverstionFactor;

                                cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                                if (uom1[0].Operation == "*") {
                                    xs.data.FValue1 = xs.data.Value * cNewVal1;
                                }
                                else {
                                    xs.data.FValue1 = xs.data.Value / cNewVal1;

                                }
                                // At this stage the incoming unit gets converted to the input uinit of Energy table for this unique
                                // reocrd. Now the conversion for the expected unit in energy table should follow
                                // if (Energy.length != 0) {
                                cVal1 = Energy[0].ConverstionFactor;

                                cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                                if (Energy[0].Operation == "*") {
                                    xs.data.FValue1 = xs.data.FValue1 * cNewVal1;
                                }
                                else {
                                    xs.data.FValue1 = xs.data.FValue1 / cNewVal1;

                                }
                                // }
                                // End of final converison to expected unit in energy table          

                            } else {
                                console.log("Show Energy12");
                                cVal1 = Energy[0].ConverstionFactor;
                                console.log(cVal1);

                                cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                                if (Energy[0].Operation == "*") {
                                    xs.data.FValue1 = xs.data.Value * cNewVal1;
                                }
                                else {
                                    xs.data.FValue1 = xs.data.Value / cNewVal1;

                                }

                            }


                            // console.log(xs.data.FValue1);
                        }
                    }
                    //End of code addition for fval1 energy calculations
                }

            }

        } catch (e) {
            //xs.data.error = "Exception occured" + e;
            xs.error(400, "error" + e);
            //console.log("except" + e)
            // await srv.tx.rollback(e)
        }

    });






    //******************************UPDATE QUERY FOR TELECOM******************************

    srv.before("UPDATE", "Environment_Report", async (xs, res) => {
        var results = [];
        var flag = false;
        var intvalue;
        var emission;
        var shortVal;
        var uom1;
        var envReport;
        var Energy;

        // console.log(res);
        const cats = await cds.connect.to('CatalogService');
        const { UoMConversions, EmissionFactors, Temp, Environment_Report, EnergyCnversions,
            Measure_Module, Measure_Validation } = cats.entities;


        try {
            //THIS OPERATION IS ONLY VALID WHEN THE PROPERTY "Value" CONTAINS A VALUE
            if (xs.data.Value) {
                if (xs.data.Unit) {


                    // ********************Start of Logic2**********************************
                    // if (xs.data.Logic == 'Logic2') {
                    // identify whether the incoming value is shorter than short haul lower limit of Temp table
                    // console.log("start calc");
                    envReport = await cds.read(Environment_Report).where`Year = ${xs.data.Year} and 
    Month = ${xs.data.Month} and Location = ${xs.data.Location}  and
    Type = ${xs.data.Type} and SubType = ${xs.data.SubType} and KPI = ${xs.data.KPI}`

                    // console.log(envReport);
                    if (envReport[0].Logic == 'LogicT') {
                        try {
                            console.log(xs.data.KPI);

                            // EnergyTelecom = await cds.tx(xs).run(SELECT.from(EnergyCnversions).where({
                            //     KPI: xs.data.KPI,
                            //     Type: xs.data.Type,
                            //     SubType: xs.data.SubType
                            // }));
                            EnergyTelecom = await cds.tx(xs).run(SELECT.from(Measure_Module).where({
                                InputMeasureType: envReport[0].Measure
                            }));
                            console.log(EnergyTelecom);
                            if (EnergyTelecom.length != 0) {
                                console.log(xs.data.Unit);
                                const cVal = EnergyTelecom[0].ConverstionFactor;
                                var cNewVal = Number.parseFloat(cVal).toFixed(3);
                                if (xs.data.Unit === EnergyTelecom[0].InputUom) {
                                    // const cVal = EnergyTelecom[0].ConverstionFactor;
                                    // var cNewVal = Number.parseFloat(cVal).toFixed(3);
                                    InputValueTel = xs.data.Value * cNewVal;
                                    console.log(InputValueTel);
                                } else {
                                    try {
                                        const uom = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                            UserInputUnit: xs.data.Unit,
                                            ExpectedOutputUnit: EnergyTelecom[0].InputUom
                                        }));
                                        console.log("show uom");
                                        console.log(uom);
                                        const cVal = uom[0].ConverstionFactor;
                                        const convVal = Number.parseFloat(cVal).toFixed(3);
                                        if (uom[0].Operation == "*") {
                                            InputValueTel = convVal * xs.data.Value;
                                            InputValueTel = InputValueTel * cNewVal;
                                            console.log(InputValueTel);
                                        } else {
                                            InputValueTel = xs.data.Value / convVal;
                                            InputValueTel = InputValueTel * cNewVal;
                                            console.log(InputValueTel);
                                        }

                                    } catch (error) {
                                        xs.error(400, "error" + e);
                                    }

                                }
                            }
                        }
                        catch (e) {
                            //xs.data.error = "Exception occured" + e;
                            xs.error(400, "error" + e);

                        }
                    }
                    //********************End of Logic 2 **************************************/ 
                    if (envReport[0].Logic == 'Logic1' || envReport[0].Logic == 'LogicT') {
                        // emission = await cds.read(EmissionFactors).where({ KPI: xs.data.KPI });
                        emission =   await SELECT.from(EmissionFactors).where
                        ({ KPI: xs.data.KPI, Type: xs.data.Type, SubType: xs.data.SubType })
                        .orderBy({ createdAt: "desc" });


                        if (emission) {

                            const x = emission[0];
                            // console.log(x);

                            const Val = x.EmissionFactor;


                            const newVal = Number.parseFloat(Val).toFixed(8);
                            intvalue = newVal;
                            // if (x.UoM) {


                            var splitUom = x.UoM.toString().split("/");
                            //         //Compare the incoming uom with the denominator of emission uom

                            //  //Parse the emissionfactor value
                            if (envReport[0].Logic == 'LogicT') {
                                if (x.Deno == EnergyTelecom[0].OutputUoM) {
                                    flag = true;
                                    xs.data.FValue = InputValueTel * newVal;
                                    console.log(xs.data.FValue);

                                    // Get the value of the interim unit and value
                                    xs.data.IUnit = x.Deno;
                                    xs.data.IValue = InputValueTel;

                                }
                            } else {
                                if (x.Deno == xs.data.Unit) {
                                    flag = true;
                                    xs.data.FValue = xs.data.Value * newVal;
                                    // Get the value of the interim unit and value
                                    xs.data.IUnit = x.Deno;
                                    xs.data.IValue = xs.data.Value;

                                }
                            }
                            // if (splitUom[1] == xs.data.Unit) {
                            //     if (x.Deno == xs.data.Unit) {
                            //         flag = true;

                            //         xs.data.FValue = xs.data.Value * newVal;

                            //     }
                            // }


                            //******The second iteration with UOM conversion after this */
                            // console.log(flag);
                            if (flag == false) {

                                if (envReport[0].Logic == 'LogicT') {
                                    console.log("uom_new");
                                    uom2 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                        UserInputUnit: EnergyTelecom[0].OutputUoM,
                                        ExpectedOutputUnit: x.Deno
                                    }));
                                    //     console.log("uom");
                                    // console.log(uom);
                                } else {
                                    console.log("uom");
                                    // console.log(uom);
                                    uom2 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                        UserInputUnit: xs.data.Unit,
                                        ExpectedOutputUnit: x.Deno
                                    }));
                                    // console.log("uom");

                                }

                                // const uom = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                //     UserInputUnit: xs.data.Unit,
                                //     ExpectedOutputUnit: x.Deno
                                // }));

                                const cVal = uom[0].ConverstionFactor;

                                // console.log(cVal);
                                var cNewVal = Number.parseFloat(cVal).toFixed(3);
                                // console.log(cNewVal);


                                if (uom[0].Operation == "*") {

                                    xs.data.FValue = xs.data.Value * cNewVal;
                                    // console.log(xs.data.FValue);
                                 // Get the value of the interim unit and value
                                 xs.data.IUnit = x.Deno;
                                 xs.data.IValue = xs.data.FValue;

                                    xs.data.FValue = xs.data.FValue * intvalue;


                                } else {
                                    xs.data.FValue = xs.data.Value / cNewVal;
                                
                                    // Get the value of the interim unit and value
                                    xs.data.IUnit = x.Deno;
                                    xs.data.IValue = xs.data.FValue;
                                    xs.data.FValue = xs.data.FValue * intvalue;

                                }

                            }
                        }

                        // Convert to MTCO2e if the final nemission unit is not the same
                        // get the numerator of the KPI if it does not match go to UOM conversion table
                        // get the conversion factor and multiply it with fval
                        // console.log(emission[0].Nume);
                        const uom = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                            UserInputUnit: emission[0].Nume,
                            Measure: 'Emissions'

                        }));

                        //Energy conversion factor derivation
                        if (xs.data.LogicE == "LogicE") {
                            // uom1 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                            //     Measure: emission[0].KPI,
                            //     UserInputUnit: xs.data.Unit
                            // }));
                            // console.log(xs.data.KPI);
                            // console.log(xs.data.Type);
                            // console.log(xs.data.SubType);
                            Energy = await cds.tx(xs).run(SELECT.from(EnergyCnversions).where({
                                KPI: xs.data.KPI,
                                Type: xs.data.Type,
                                SubType: xs.data.SubType
                                // UserInputUnit: xs.data.Unit

                            }));
                            // console.log(Energy);

                            if (Energy.length != 0) {
                                if (xs.data.Unit == Energy[0].UserInputUnit) {

                                } else {

                                    uom1 = await cds.tx(xs).run(SELECT.from(UoMConversions).where({
                                        UserInputUnit: xs.data.Unit,
                                        ExpectedOutputUnit: Energy[0].UserInputUnit


                                    }));
                                    // console.log(uom1[0].ConverstionFactor);
                                }

                            }

                        }

                        //End of energy factor derivation
                        // console.log(uom1);
                        // console.log(xs.data.FValue);
                        var cVal1 = uom[0].ConverstionFactor;

                        var cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                        // console.log(cVal1);
                        // console.log(cNewVal1);
                        if (uom[0].Operation == "*") {
                            xs.data.FValue = xs.data.FValue * cNewVal1;
                        }
                        else {
                            xs.data.FValue = xs.data.FValue / cNewVal1;

                        }
                        // console.log(xs.data.FValue);
                        //End of code addition for fval conversion to MTCO2e as final unit

                        //End of code addition for fval conversion to MTCO2e as final unit

                        //Energy calculations
                        if (xs.data.LogicE == "LogicE") {
                            // console.log("Conv factor");
                            // console.log(uom1);
                            if (uom1) {
                                // console.log("Conv factor");
                                cVal1 = uom1[0].ConverstionFactor;
                                // console.log(cVal1);
                                cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                                // console.log(cNewVal1);
                                if (uom1[0].Operation == "*") {
                                    xs.data.FValue1 = xs.data.Value * cNewVal1;
                                }
                                else {
                                    xs.data.FValue1 = xs.data.Value / cNewVal1;

                                }
                                // At this stage the incoming unit gets converted to the input uinit of Energy table for this unique
                                // reocrd. Now the conversion for the expected unit in energy table should follow
                                cVal1 = Energy[0].ConverstionFactor;

                                cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                                if (Energy[0].Operation == "*") {
                                    xs.data.FValue1 = xs.data.FValue1 * cNewVal1;
                                }
                                else {
                                    xs.data.FValue1 = xs.data.FValue1 / cNewVal1;

                                }
                                // End of final converison to expected unit in energy table
                            } else {
                                cVal1 = Energy[0].ConverstionFactor;

                                cNewVal1 = Number.parseFloat(cVal1).toFixed(3);
                                if (Energy[0].Operation == "*") {
                                    xs.data.FValue1 = xs.data.Value * cNewVal1;
                                }
                                else {
                                    xs.data.FValue1 = xs.data.Value / cNewVal1;

                                }

                            }


                            // console.log(xs.data.FValue1);
                        }
                        //End of code addition for fval1 energy calculations
                    }
                }
                else {
                    xs.error(500, "Please pass the Unit");
                }
            }
        } catch (e) {
            //xs.data.error = "Exception occured" + e;
            xs.error(400, "error" + e);
            //console.log("except" + e)
            // await srv.tx.rollback(e)
        }

    });



    //***********************END OF TELECOM LOGIC*********************************************************** */


       
// *********************************ENVIRONMENT SOCIAL TABLE************************************
srv.before("CREATE", "SocialTableA", async (req, res) => {
    const cats = await cds.connect.to('CatalogService');
    const { SocialTableA } = cats.entities;
    if (req.data.Logic == 'Logic S1') {
        req.data.total = req.data.FUpto30yrs  + req.data.FUpto50yrs + req.data.FMorethan50Yrs +
        req.data.MUpto30yrs + req.data.MUpto50yrs + req.data.MMorethan50Yrs + 
        req.data.NUpto30yrs  + req.data.NUpto50yrs + req.data.NMorethan50Yrs; 
    }
    

// Columnwise calculation
  if (req.data.IsTotalRequired == true && req.data.Prefix != '') {
   const Social = await SELECT.from(SocialTableA).where`Year = ${req.data.Year} and 
   Location = ${req.data.Location}  and Type = ${req.data.Type} and SubType = ${req.data.SubType} and
    KPI = ${req.data.KPI} and Division = ${req.data.Division} and Prefix = ${req.data.Prefix}`

    if (Social) {
        Social.forEach(element => {
            // Female
            req.data.FUpto30yrs      = req.data.FUpto30yrs + element.FUpto30yrs;
            req.data.FUpto50yrs      = req.data.FUpto50yrs + element.FUpto50yrs;
            req.data.FMorethan50Yrs  = req.data.FMorethan50Yrs + element.FMorethan50Yrs;

            // Male
            req.data.MUpto30yrs      = req.data.MUpto30yrs + element.MUpto30yrs;
            req.data.MUpto50yrs      = req.data.MUpto50yrs + element.MUpto50yrs;
            req.data.MMorethan50Yrs  = req.data.MMorethan50Yrs + element.MMorethan50Yrs;
           // Neutral
            req.data.NUpto30yrs      = req.data.NUpto30yrs + element.NUpto30yrs;
            req.data.NUpto50yrs      = req.data.NUpto50yrs + element.NUpto50yrs;
            req.data.NMorethan50Yrs  = req.data.NMorethan50Yrs + element.NMorethan50Yrs;
        
            // Total
            req.data.total  = req.data.total + element.total;
        });
        
    }
  }
});




}