import {leaveRunning,moduleRecord,checkUserLogin,getContact,getCompany} from './components/util.js'



//============================================================================================================================
// Global element variable
//============================================================================================================================
let getElement = (id) => document.getElementById(id);
let alert = getElement('alert');
let selectContactSupplier = getElement('Contact_Supplier');
let selectCompanySupplier = getElement('Company_Supplier');



//============================================================================================================================
// Initialize Pageload
//============================================================================================================================

ZOHO.embeddedApp.on("PageLoad", async (data) => {

    getCompany();

    let contacts = await getContact();
    let companies = await getCompany();

    let currentData = await data;

    //============================================================================================================================
    // Check Claim Owner then restrict it
    //============================================================================================================================

        async function checkOwnerClaim(id){
        let userDetails = await checkUserLogin();
        let recordDetails = await moduleRecord(id);
            
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
    // Assign Contacts to Dropdown Contact Supplier
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
    // Assign Contacts to Dropdown Company Supplier
    //============================================================================================================================  


        async function associateCompany(data){

        for(var item of data){
            var option = document.createElement("option");
            console.log(item)
            option.value = item.id; // replace with actual value property
            option.text = item.Vendor_Name; // replace with actual text property
            selectCompanySupplier.appendChild(option);
        }

    }

    associateCompany(companies)


})
ZOHO.embeddedApp.init();