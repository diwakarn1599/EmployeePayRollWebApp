let employeePayrollList ;
window.addEventListener('DOMContentLoaded', (event) => {
    if(siteProperties.use_local_storage.match("true"))
    {
        getDataFromLocalStorage();
    }
    else
    {
        getEmployeePayrollDataFromServer();
    }
    
});

const processEmployeePayrollDataResponse=()=>
{
    document.getElementById('emp_count').innerHTML = employeePayrollList.length;
    createTableContents();
    localStorage.removeItem('editEmp');
}
let getDataFromLocalStorage = () =>
{
    localStorage.getItem("EmployeePayrollList")?JSON.parse(localStorage.getItem("EmployeePayrollList")):[];
    processEmployeePayrollDataResponse();
}

const   getEmployeePayrollDataFromServer = () =>
{
    makeServiceCall("GET",siteProperties.server_url,true)
    .then(responseText=>
        {
            employeePayrollList=JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error=>
        {
            console.log("GET Error status: "+JSON.stringify(error));
            employeePayrollList=[];
            processEmployeePayrollDataResponse();
        });
}
let createTableContents = () =>
{
    const tableHeader = `<tr>
    <th>Image</th>
    <th>Name</th>
    <th>Gender</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Start date</th>
    <th>Actions</th>
</tr>`;
let tableContents = `${tableHeader}`;
    for(const emp of employeePayrollList)
    {
        tableContents = `${tableContents}<tr>
            <td><img class="profile" src="${emp._profilePic}" /></td>
            <td>${emp._name}</td>
            <td>${emp._gender}</td>
            <td>
            ${getDept(emp._department)}
            </td>
            <td>${emp._salary}</td>
            <td>${stringifyDate(emp._startDate)}</td>
            <td>
                <img id="${emp.id}" src="../assets/icons/delete-black-18dp.svg" class="profile" onclick="deleteEmployee(this)" alt="delete" />
                <img id="${emp.id}" src="../assets/icons/create-black-18dp.svg" class="profile" onclick="updateEmployee(this)" alt="edit" />
            </td>
        </tr>`;
    }
    
    document.getElementById('display_container').innerHTML = tableContents;
}
let getDept = (deptArr) =>
{
    let deptHtml = '';
    for(const dept of deptArr)
    {
        deptHtml = `${deptHtml}<span class="dept_label">${dept}</span>`;
    }
    return deptHtml;
}

/********************************************Delete Employee*************************************/
let deleteEmployee = (employee) =>
{
    let empData  = employeePayrollList.find(x => x.id == employee.id);
    if(!empData)
        return;
    const index = employeePayrollList.map(x => x.id).indexOf(empData.id);
    employeePayrollList.splice(index,1);
    if(siteProperties.use_local_storage.match("true"))
    {
        localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList));
        document.getElementById('emp_count').innerHTML = employeePayrollList.length;
        createTableContents();
    }
    else{
        const deleteURL=siteProperties.server_url+empData.id.toString();
        makeServiceCall("DELETE",deleteURL,false)
        .then(responseText=>
            {
                createInnerHtml();
            })
            .catch(error=>
                {
                    console.log("DELETE Error Status:"+JSON.stringify(error));
                });
    }
    
}
/********************************************Update Employee*************************************/
let updateEmployee = (employee) =>
{
    let empData  = employeePayrollList.find(x => x.id == employee.id);
    if(!empData)
        return;
    localStorage.setItem("editEmp",JSON.stringify(empData));
    window.location.replace(siteProperties.register_page);
}