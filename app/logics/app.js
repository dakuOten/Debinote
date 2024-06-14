import {leaveRunning,moduleRecord,checkUserLogin,getContact,getCompany,closeReload,getRelatedRecords,fileAttachment,addNotes,reSize} from './components/util.js'
import {create} from './components/crud.js'




//============================================================================================================================
// Global element variable
//============================================================================================================================
let getElement = (id) => document.getElementById(id);
let alertMessage = getElement('alert');
let cancelButton = getElement('cancelButton');
let debitNoteForm = getElement('debitNoteForm');
let contactSelect = getElement('contactSelect');
let cancelButtonForm = getElement('cancelButtonForm');
//============================================================================================================================
// form fields
//============================================================================================================================
let clubCaseAccounts = getElement('clubCaseAccounts');
let clubCaseContact = getElement('clubCaseContact');
let vessels = getElement('vessels');

//============================================================================================================================
// Initialize Pageload
//============================================================================================================================

ZOHO.embeddedApp.on("PageLoad", async (data) => {

    //============================================================================================================================
    // Static Reponse from modules
    //============================================================================================================================
    let currentData = await data;
    let checkCurrentDetails = await moduleRecord("Deals",currentData.EntityId);
    let checkAccountRecord = checkCurrentDetails;

    
    // //============================================================================================================================
    // // Check Claim Owner then restrict it
    // //============================================================================================================================

        async function checkOwnerClaim(id){
        let userDetails = await checkUserLogin();
        let recordDetails = await moduleRecord("Deals",id);
        if(userDetails.profile.name === "Administrator" || userDetails.profile.name === "CEO"){

            return;   
        }

        if(  userDetails.id !== recordDetails.Owner.id ){
           await ZOHO.CRM.UI.Resize({height:"110",width:"400"})
           alertMessage.classList.remove('hidden');
           debitNoteForm.classList.add('hidden')
           document.body.style.overflow = 'hidden';
            setTimeout(() => {
                leaveRunning()
              }, 5000);
        }

        }

        checkOwnerClaim(currentData.EntityId)


    // //============================================================================================================================
    // // Assign Contacts to Dropdown Contact Supplier cant be recreated as usable function because of different playload and api
    // //============================================================================================================================
        
        async function associateContact(data){
            
            clubCaseAccounts.value = data.name
            let checkAccount = await getRelatedRecords("Accounts",data.id,"Contacts");


            if(checkAccount){
                contactSelect.classList.remove('hidden');
            }

            for(var item of checkAccount){
                var option = document.createElement("option");
                option.value = item.id; // replace with actual value property
                option.text = item.Full_Name; // replace with actual text property
                clubCaseContact.appendChild(option);
            }

        }

        associateContact(checkAccountRecord.Account_Name)


    // //============================================================================================================================
    // // Assign Contacts to Dropdown Contact Supplier cant be recreated as usable function because of different playload and api
    // //============================================================================================================================
        
    async function associateVessels(id){
            

        let checkVessels = await getRelatedRecords("Deals",id,"Vessels19");



        for(var item of checkVessels){
            var option = document.createElement("option");
            option.value = item.Vessels_linked_to_this_Claim_case.id; // replace with actual value property
            option.text = item.Vessels_linked_to_this_Claim_case.name; // replace with actual text property
            vessels.appendChild(option);
        }

    }

    associateVessels(checkAccountRecord.id)


    // //============================================================================================================================
    // // Create Record
    // //============================================================================================================================  


    debitNoteForm.addEventListener('submit',  async function(e){
        e.preventDefault();

        let validSE = getElement('validSE');
        let recordName = getElement('recordName');
        let reimbursement = getElement('reimbursement');
        let clubCaseContact = getElement('clubCaseContact');
        let startTime = getElement('startTime');
        let endTime = getElement('endTime');
        let noteTitle = getElement('noteTitle');
        let noteContent = getElement('noteContent');
        let requiredV = getElement('requiredV');
        let requiredCCC = getElement('requiredCCC');
        let submitDebit = getElement('submitDebit');

     
        let file = getElement('Attachment').files[0];
   
        let recordDetails = await moduleRecord("Deals",currentData.EntityId);
        let claimOwner = recordDetails.Owner.id
        let claimsName = recordDetails.id
        let accountID = recordDetails.Account_Name.id


        let error = [];
        
        if(startTime.value > endTime.value){
            validSE.classList.remove('hidden');
            setTimeout(() => {
                validSE.classList.add('hidden');
                startTime.value = "";
                endTime.value = "";
            }, 4000);
            error.push(true)
        }

        if(!vessels.value){
            requiredV.classList.remove('hidden');
            setTimeout(() => {
                requiredV.classList.add('hidden');
            }, 4000);
            error.push(true)
        }

        if(!clubCaseContact.value){
            requiredCCC.classList.remove('hidden');
            setTimeout(() => {
                requiredCCC.classList.add('hidden');
            }, 4000);
            error.push(true)
        }


        if(error.includes(true)){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            return;
        }


        console.log(vessels.value)

        let payload = {
            Owner : claimOwner,
            Claims_name	: claimsName,
        //     Vessel_Name	: vessels.value,
            Name : recordName.value, 
            Club : accountID ,
            Reimbursable_Expenses : reimbursement.value,
            Club_Contact_name : clubCaseContact.value,
            From : startTime.value,
            To : endTime.value,
            Note :noteContent.value ,
            Trigger_workflow : true,
        }



        console.log(payload);

        let createInvoice = await create("Books_Invoices",payload)
   

        let createdData = createInvoice.data.shift();


 
        
        if (createdData.code === "SUCCESS") {
            let invoiceId = createdData.details.id;

            addNotes("Books_Invoices",invoiceId,noteTitle.value,noteContent.value)
            fileAttachment("Books_Invoices",invoiceId,file)
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
            existingAnchor.href = `https://crm.zoho.com/crm/aqueous/tab/CustomModule13/${invoiceId}`;
            existingAnchor.target = '_blank';
            existingAnchor.classList.add('text-blue-500');
            existingAnchor.textContent = 'Click here to redirect to Debit Note';
            submitDebit.disabled = true;
            alertMessage.classList.remove('hidden');
            debitNoteForm.classList.add('hidden')
            await reSize("179","400");
            setTimeout(async ()  => {
                alertMessage.classList.add('hidden');
                recordName.value = "";
                noteTitle.value = "";
                noteContent.value = "";
                reimbursement.value = "";
                getElement('Attachment').value = "";
                vessels.value = "";
                startTime.value = "";
                endTime.value = "";
                clubCaseContact.value = "";
                debitNoteForm.classList.remove('hidden')
                submitDebit.disabled = false;
                await reSize("760","400");


            }, 4000);
        }

        



    });




    //============================================================================================================================
    // Cancel Button
    //============================================================================================================================ 
    
    cancelButton.addEventListener("click",function (e) {
        leaveRunning()
    })

    cancelButtonForm.addEventListener("click",function (e) {
        leaveRunning()
    })

})
ZOHO.embeddedApp.init();