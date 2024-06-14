import {leaveRunning,moduleRecord,checkUserLogin,getContact,getCompany,closeReload,getRelatedRecords,fileAttachment,addNotes,reSize} from './components/util.js'
import {create} from './components/crud.js'




//============================================================================================================================
// Global element variable
//============================================================================================================================
let getElement = (id) => document.getElementById(id);
let alertMessage = getElement('alert');
let cancelButton = getElement('cancelButton');
let cancelButtonForm = getElement('cancelButtonForm');
let debitNoteForm = getElement('debitNoteForm');
<<<<<<< HEAD
let contactSelect = getElement('contactSelect');
let cancelButtonForm = getElement('cancelButtonForm');
=======
let closeModal = getElement('closeModalButton');
let modal = getElement('my_modal_3');
let contactSelect = getElement('contactSelect');
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47
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

<<<<<<< HEAD
    
    // //============================================================================================================================
    // // Check Claim Owner then restrict it
    // //============================================================================================================================
=======



    //============================================================================================================================
    // Check Claim Owner then restrict it
    //============================================================================================================================
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47

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


<<<<<<< HEAD
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
=======
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
    // Assign Contacts to Dropdown Company Supplier cant be recreated as usable function because of different playload and api
    //============================================================================================================================  
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47



        for(var item of checkVessels){
            var option = document.createElement("option");
            option.value = item.Vessels_linked_to_this_Claim_case.id; // replace with actual value property
            option.text = item.Vessels_linked_to_this_Claim_case.name; // replace with actual text property
            vessels.appendChild(option);
        }

    }

<<<<<<< HEAD
    associateVessels(checkAccountRecord.id)


    // //============================================================================================================================
    // // Create Record
    // //============================================================================================================================  

=======
    associateCompany(supplierCompanies)

    //============================================================================================================================
    // Assign Contacts to Dropdown Contact Supplier cant be recreated as usable function because of different playload and api
    //============================================================================================================================

    selectCompanySupplier.addEventListener('change',  async function(e){
       let recordId = selectCompanySupplier.value;

       if(recordId){
        contactSelect.classList.remove('hidden');
       }   

       selectContactSupplier.innerHTML = '';
       selectContactSupplier.innerHTML = '<option value="" disabled selected>Select Contact</option>';

       let contactRelated = await getRelatedRecords("Vendors",recordId,"Contacts");
        if(contactRelated){
            for(var item of contactRelated){
                var option = document.createElement("option");
                option.value = item.id; // replace with actual value property
                option.text = item.Full_Name; // replace with actual text property
                selectContactSupplier.appendChild(option);
            }
        }
        else{
            contactSelect.classList.add('hidden');
           }
    })


    //============================================================================================================================
    // Create Record
    //============================================================================================================================  
    


    
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47

    debitNoteForm.addEventListener('submit',  async function(e){
        e.preventDefault();

<<<<<<< HEAD
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
   
=======
        let debitNoteName = getElement('debitNoteName');
        let debitNoteTitle = getElement('debitNoteTitle');
        let submitDebit = getElement('submitDebit');
        let debitNote = getElement('debitNote');

        let requiredSCN = getElement('requiredSCN');
        let requiredSCP = getElement('requiredSCP');

        let debitFile = getElement('debitFile').files[0];
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47
        let recordDetails = await moduleRecord("Deals",currentData.EntityId);
        let claimOwner = recordDetails.Owner.id
        let claimsName = recordDetails.id
<<<<<<< HEAD
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
=======

        let aqueousCaseReference = recordDetails.AQUEOUS_Case_Reference
        let debitNoteNameInput = debitNoteName.value;
        let debitNoteInputTitle = debitNoteTitle.value;
        let debitNoteInput = debitNote.value;
        let supplierContact = selectContactSupplier.value;
        let supplierCompany = selectCompanySupplier.value;


        if(!supplierCompany){
            requiredSCN.classList.remove('hidden');
            setTimeout(() => {
                requiredSCN.classList.add('hidden');
            }, 3000);
            return;
        }



                    if (!supplierContact) {
                requiredSCP.classList.remove('hidden');
                setTimeout(() => {
                    requiredSCP.classList.add('hidden');
                }, 3000);
                return;
            }

        
        let payload = {
            Owner : owner.id,
            Aqueous_Case_Reference : aqueousCaseReference,
            Claims_name	: claimsName,
            Name : debitNoteNameInput,
            Custom_Note	: debitNoteInput,
            Suppliers_Contact_Person : supplierContact,
            Company_Name : supplierCompany ,
            trigger_workflow : true
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47
        }

        if(!vessels.value){
            requiredV.classList.remove('hidden');
            setTimeout(() => {
                requiredV.classList.add('hidden');
            }, 4000);
            error.push(true)
        }

<<<<<<< HEAD
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


 
=======
        let createdData = createBookDebitNotes.data.shift();
        console.log(JSON.stringify(createdData))
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47
        
        if (createdData.code === "SUCCESS") {
            let invoiceId = createdData.details.id;

<<<<<<< HEAD
            addNotes("Books_Invoices",invoiceId,noteTitle.value,noteContent.value)
            fileAttachment("Books_Invoices",invoiceId,file)
=======
            addNotes("Book_Debit_Notes",debitId,debitNoteInputTitle,debitNoteInput)
            fileAttachment("Book_Debit_Notes",debitId,debitFile)
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47
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
<<<<<<< HEAD
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


=======
            setTimeout( async () => {
 
         
                alertMessage.classList.add('hidden');
                debitNoteName.value = "";
                debitNoteTitle.value = "";
                debitNote.value = "";
                selectCompanySupplier.value = '';
                selectContactSupplier.value = '';
                getElement('debitFile').value = "";
                contactSelect.classList.add('hidden');
                debitNoteForm.classList.remove('hidden')
                submitDebit.disabled = false;
                await reSize("660","400");
>>>>>>> e5d1581f3bb7d56433349b52e72eb80a02494c47
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

        cancelButtonForm.addEventListener("click",function (e) {
            leaveRunning()
        })

    //============================================================================================================================
    // close modal
    //============================================================================================================================      

         closeModal.addEventListener("click", function(){
            modal.close();
         })
})
ZOHO.embeddedApp.init();