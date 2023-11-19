function fetchMyDrive(){
    axios.get(API_MY_DRIVE, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')}
    }).then(response => {
        renderDriveData(response.data.data);
    }).catch(error => globalExceptionHandler(error))
}

function fetchTrash(){
    axios.get(API_MY_TRASH, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')}
    }).then(response => {
        renderDriveData(response.data.data);
    }).catch(error => globalExceptionHandler(error))
}
function fetchDrive(folderId){
    const api_drive = API_DRIVE_PREFIX + folderId;
    console.log(api_drive);
    axios.get(api_drive, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')}
    }).then(response => {
        renderDriveData(response.data.data);
    }).catch(error => globalExceptionHandler(error))
}
function clearDriveData(){
    $('#folder').html('');
    $('#file').html('');
}

function renderDriveData(rawData){
    clearDriveData();
    renderFolders(rawData);
    renderFiles(rawData);
    $('.folder').dblclick((e) => fetchDrive(e.target.id));
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