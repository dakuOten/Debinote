
//============================================================================================================================
// Create Record
//============================================================================================================================

export let create = async (module,payload) => {
    //"workflow", "approval" or "blueprint"
    let createReponse = await ZOHO.CRM.API.insertRecord({Entity:module.toString(),APIData:payload,Trigger:[]});
    return  createReponse;
}


//============================================================================================================================
// Create Update
//============================================================================================================================

export let update = async (module,payload) => {
    //"workflow", "approval" or "blueprint"
    let createReponse = await ZOHO.CRM.API.insertRecord({Entity:module.toString(),APIData:payload,Trigger:[]});
    return  createReponse;
}