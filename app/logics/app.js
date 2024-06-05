import {leaveRunning,moduleRecord,checkUserLogin,getContact,getCompany,closeReload,getRelatedRecords,fileAttachment} from './components/util.js'
import {create} from './components/crud.js'


//============================================================================================================================
// Global element variable
//============================================================================================================================
let getElement = (id) => document.getElementById(id);
let alertMessage = getElement('alert');
let cancelButton = getElement('cancelButton');
let debitNoteForm = getElement('debitNoteForm');
//============================================================================================================================
// form fields
//============================================================================================================================
let debitNoteOwner = getElement('debitNoteOwner');
let claimsName = getElement('claimsName');
let aqueousCaseReference = getElement('aqueousCaseReference');
let selectContactSupplier = getElement('contactSupplier');
let selectCompanySupplier = getElement('companySupplier');
let debitNoteName = getElement('debitNoteName');
let debitNote = getElement('debitNote');
//============================================================================================================================
// Initialize Pageload
//============================================================================================================================

ZOHO.embeddedApp.on("PageLoad", async (data) => {

    //============================================================================================================================
    // Static Reponse from modules
    //============================================================================================================================
    let currentData = await data;
    let supplierCompanies = await getRelatedRecords("Deals",currentData.EntityId,"Vendors25");
    let supplierContact = await getRelatedRecords("Deals",currentData.EntityId,"Contact_Roles");

    


    //============================================================================================================================
    // Check Claim Owner then restrict it
    //============================================================================================================================

        async function checkOwnerClaim(id){
        let userDetails = await checkUserLogin();
        let recordDetails = await moduleRecord("Deals",id);
        console.log(recordDetails)  
        if(userDetails.profile.name === "Administrator" || userDetails.profile.name === "CEO"){

            return;   
        }

        if(  userDetails.id !== recordDetails.Owner.id ){
           await ZOHO.CRM.UI.Resize({height:"120",width:"400"})
           alertMessage.classList.remove('hidden');
            setTimeout(() => {
                leaveRunning()
              }, 5000);
        }

        }

        checkOwnerClaim(currentData.EntityId)


    //============================================================================================================================
    // auto populate field base on the claims records
    //============================================================================================================================

    
    async function autoPopulateStaticFields(id){
        let recordDetails = await moduleRecord("Deals",id);

        if(recordDetails.Owner){
            let owner = recordDetails.Owner
            debitNoteOwner.value = owner.name
        }

        if(recordDetails.Deal_Name){
            claimsName.value = recordDetails.Deal_Name
        }

        if(recordDetails.AQUEOUS_Case_Reference){
            aqueousCaseReference.value = recordDetails.AQUEOUS_Case_Reference
        }

        }

        autoPopulateStaticFields(currentData.EntityId)




    //============================================================================================================================
    // Assign Contacts to Dropdown Contact Supplier cant be recreated as usable function because of different playload and api
    //============================================================================================================================
        
        async function associateContact(data){

            for(var item of data){
                var option = document.createElement("option");
                option.value = item.id; // replace with actual value property
                option.text = item.Full_Name; // replace with actual text property
                selectContactSupplier.appendChild(option);
            }

        }

        associateContact(supplierContact)


    //============================================================================================================================
    // Assign Contacts to Dropdown Company Supplier cant be recreated as usable function because of different playload and api
    //============================================================================================================================  


        async function associateCompany(data){

        for(var item of data){
            var option = document.createElement("option");
            let companySupplier = item.Companies_Involve
            option.value = companySupplier.id; // replace with actual value property
            option.text = companySupplier.name; // replace with actual text property
            selectCompanySupplier.appendChild(option);
        }

    }

    associateCompany(supplierCompanies)

    //============================================================================================================================
    // Create Record
    //============================================================================================================================  
    




    debitNoteForm.addEventListener('submit',  async function(e){
        e.preventDefault();

        let debitNoteName = getElement('debitNoteName');
        let debitNote = getElement('debitNote');
        let debitFile = getElement('debitFile').files[0];
        let recordDetails = await moduleRecord("Deals",currentData.EntityId);
        let owner = recordDetails.Owner || ""
        let claimsName = recordDetails.id
        let aqueousCaseReference = recordDetails.AQUEOUS_Case_Reference
        let debitNoteNameInput = debitNoteName.value;
        let debitNoteInput = debitNote.value;
        let supplierContact = selectContactSupplier.value;
        let supplierCompany = selectCompanySupplier.value;
        
        let payload = {
            Owner : owner.id,
            Aqueous_Case_Reference : aqueousCaseReference,
            Claims_name	: claimsName,
            Name : debitNoteNameInput,
            Custom_Note	: debitNoteInput,
            Suppliers_Contact_Person : supplierContact,
            Company_Name : supplierCompany
        }

        let createBookDebitNotes = await create("Book_Debit_Notes",payload)

        let createdData = createBookDebitNotes.data.shift();
        
        if (createdData.code === "SUCCESS") {
            let debitId = createdData.details.id;

            fileAttachment("Book_Debit_Notes",debitId,debitFile)
            let divAnchor = getElement('redirectButton');
            let alertMessage = getElement('createdSuccessfully');
            
            // Check if an anchor already exists
            let existingAnchor = divAnchor.querySelector('a');
            if (!existingAnchor) {
                // Create the anchor element if it doesn't exist
                existingAnchor = document.createElement('a');
                divAnchor.appendChild(existingAnchor);
            }
            
            // Update the anchor properties
            existingAnchor.href = `https://crm.zoho.com/crm/aqueous/tab/CustomModule12/${debitId}`;
            existingAnchor.target = '_blank';
            existingAnchor.classList.add('text-blue-500');
            existingAnchor.textContent = 'Click here to redirect to Debit Note';
            
            alertMessage.classList.remove('hidden');
            setTimeout(() => {
                alertMessage.classList.add('hidden');
                debitNoteName.value = "";
                debitNote.value = "";
            }, 6000);
        }

        



    });




    //============================================================================================================================
    // Cancel Button
    //============================================================================================================================ 
    
        cancelButton.addEventListener("click",function (e) {
            leaveRunning()
        })

})
ZOHO.embeddedApp.init();