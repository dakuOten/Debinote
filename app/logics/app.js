import {leaveRunning,moduleRecord,checkUserLogin,getContact,getCompany} from './components/util.js'
import {create} from './components/crud.js'


//============================================================================================================================
// Global element variable
//============================================================================================================================
let getElement = (id) => document.getElementById(id);
let alert = getElement('alert');
let selectContactSupplier = getElement('contactSupplier');
let selectCompanySupplier = getElement('companySupplier');
let debitNoteOwner = getElement('debitNoteOwner');
let claimsName = getElement('claimsName');
let aqueousCaseReference = getElement('aqueousCaseReference');
let cancelButton = getElement('cancelButton');



//============================================================================================================================
// Initialize Pageload
//============================================================================================================================

ZOHO.embeddedApp.on("PageLoad", async (data) => {

    //============================================================================================================================
    // Static Reponse from modules
    //============================================================================================================================
    let contacts = await getContact();
    let companies = await getCompany();
    let currentData = await data;


    
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
           alert.classList.remove('hidden');
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

        associateContact(contacts)


    //============================================================================================================================
    // Assign Contacts to Dropdown Company Supplier cant be recreated as usable function because of different playload and api
    //============================================================================================================================  


        async function associateCompany(data){

        for(var item of data){
            var option = document.createElement("option");
            option.value = item.id; // replace with actual value property
            option.text = item.Vendor_Name; // replace with actual text property
            selectCompanySupplier.appendChild(option);
        }

    }

    associateCompany(companies)


    //============================================================================================================================
    // Cancel Button
    //============================================================================================================================ 
    
        cancelButton.addEventListener("click",function (e) {
            leaveRunning()
        })

})
ZOHO.embeddedApp.init();