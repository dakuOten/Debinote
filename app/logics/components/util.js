export let leaveRunning = async () => {
    return await ZOHO.CRM.UI.Popup.close();
}

export let moduleRecord = async (module,recordId) => { 
    let recordData = await ZOHO.CRM.API.getRecord({Entity: module.toString(), approved: "both", RecordID:recordId })
    let claimRecord = recordData.data.shift();
    return claimRecord;
}


export let checkUserLogin = async () => { 
    let configUser = await ZOHO.CRM.CONFIG.getCurrentUser();
    configUser = configUser.users.shift();
    return configUser;
}


export let getContact = async () => { 
    let contacts = await ZOHO.CRM.API.getAllRecords({Entity:"Contacts"})
    let contactData = await contacts.data;
    return contactData;
}

export let getCompany = async () => { 
    let vendors = await ZOHO.CRM.API.getAllRecords({Entity:"Vendors"})
    let vendorsData = await vendors.data;
    return vendorsData;
}


export let closeReload = async () =>{
    return await ZOHO.CRM.UI.Popup.closeReload()
}

export let getRelatedRecords = async (module,recordId,relatedModule) => {
     let supplierCompanies = await ZOHO.CRM.API.getRelatedRecords({Entity:module.toString(),RecordID:recordId,RelatedList:relatedModule})
     supplierCompanies = supplierCompanies.data
     return supplierCompanies
}

export let fileAttachment = async (module,recordId,file) => {

    const blob = new Blob([file], { type: file.type });
    let attachmentFile = await ZOHO.CRM.API.attachFile({Entity:module.toString(),RecordID:recordId,File:{Name:file.name,Content:blob}})

    console.log(attachmentFile)

}


