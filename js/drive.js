function toggleSideBar(e){
    $('#side-bar li').removeClass('active');
    $(e.target).addClass('active');
}
function toggleBreadcrumb(e){
    $('.breadcrumb').remove();
    if(e.target.id === 'my-drive'){
        $('#breadcrumb .my-drive').removeClass('hidden');
        $('#breadcrumb .my-trash').addClass('hidden');
    }
    if(e.target.id === 'my-trash'){
        $('#breadcrumb .my-trash').removeClass('hidden');
        $('#breadcrumb .my-drive').addClass('hidden');
    }
}
// ----------------- Fetch data ----------------- //
function fetchMyDrive(){
    axios.get(API_MY_DRIVE, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')}
    }).then(response => {
        renderDriveData(response.data.data);
    }).catch(error => globalExceptionHandler(error))
}

function fetchMyTrash(){
    axios.get(API_MY_TRASH, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')}
    }).then(response => {
        renderDriveData(response.data.data);
    }).catch(error => globalExceptionHandler(error))
}
async function fetchDrive(folderId){
    const api_drive = API_DRIVE_PREFIX + folderId;
    axios.get(api_drive, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')}
    }).then(response => {
        renderDriveData(response.data.data);
    }).catch(error => globalExceptionHandler(error))
}
// ----------------- Render data ----------------- //

function clearDriveData(){
    $('#folder').html('');
    $('#file').html('');
}

function addBreadcrumb(target){
    $('#breadcrumb li').removeClass('active');
    $('#breadcrumb').append(`<li id="${target.id}" class="active breadcrumb">${target.innerHTML}</li>`);
    $('.breadcrumb').click((e) => {
        fetchDrive(e.target.id);
        $(e.target).nextAll().remove();});
}

function renderDriveData(rawData){
    clearDriveData();
    renderFolders(rawData);
    renderFiles(rawData);
    $('.folder').dblclick((e) => {
        fetchDrive(e.target.id);
        addBreadcrumb(e.target);
    });
}

function renderFolders(rawData){
    const folders = rawData
    .filter(item => item.dataType === 0)
    .map(item => function(){
        return `<div class="folder" id="${item.id}" access="${item.accessLevel}">${item.dataName}</div>`;
    });
    folders.forEach(folder => $('#folder').append(folder));
}

function renderFiles(rawData){
 const files = rawData
    .filter(item => item.dataType === 1)
    .map(item => function(){
        return `<div class="file" id="${item.id}" access="${item.accessLevel}">${item.dataName}</div>`;
    });
    files.forEach(file => $('#file').append(file));
}