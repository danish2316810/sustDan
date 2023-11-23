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
           
            console.log("test3");
           
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