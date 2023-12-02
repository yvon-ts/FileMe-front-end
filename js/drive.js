function toggleSideBar(e){
    $('#side-bar li').removeClass('active');
    $(e.target).addClass('active');
}
function toggleBreadcrumb(e){
    $('.breadcrumb').remove();
    if(e.target.id === 'my-drive'){
        $('#root').removeClass('hidden');
        $('.tool-drive').removeClass('hidden');
        $('#toolbar').addClass('hidden');
        $('.tool-trash').addClass('hidden');
    }
    if(e.target.id === 'my-trash'){
        $('#root').removeClass('hidden');
        $('.tool-trash').removeClass('hidden');
        $('#toolbar').addClass('hidden');
        $('.tool-drive').addClass('hidden');
    }
}
function toggleFocus(e){
    if($(e.target).hasClass('focus')){
        $(e.target).removeClass('focus');
        monitorToolbar();
    }else{
        $(e.target).addClass('focus');
        monitorToolbar();
    }
}
function monitorToolbar(){
    const count = countFocus();
   if(count > 0){
    $('#root').addClass('hidden');
    $('.breadcrumb').addClass('hidden');
    $('#toolbar').removeClass('hidden');
    $('#toolbar span').text(`已選取 ${count} 個`);
   }
   else{
    resumeHeader();
   }
}
function resumeHeader(){
    $('#toolbar').addClass('hidden');
    $('#root').removeClass('hidden');
    $('.breadcrumb').removeClass('hidden');
}
function countFocus(){
    return $('.focus').length;
}
function collectFocused(){
    let list = [];
    $('.focus').each((index, item) => {
        let dataTypeValue = $(item).hasClass('folder') || $(item).hasClass('folder-trash')? 0 : 1;
        list.push({id: item.id, dataType: dataTypeValue});
    });
    return list;
}
function clearFocused(){
    $('.focus').removeClass('focus');
    monitorToolbar();
}
// ----------------- Create ----------------- //
function swalAddFolder(){
    Swal.fire({
        text: '請輸目錄名稱',
        input: 'text',
        inputValidator: (value) => {
            if(!REGEX_DATA_NAME.test(value)) return REGEX_WARN_DATA_NAME;
        },
        showCancelButton: true,
        confirmButtonText: '確認新增',
        showLoaderOnConfirm: true,
        preConfirm: folderName => {
            doAddFolder(folderName)},
        allowOutsideClick: () => !Swal.isLoading()
    })
}
function doAddFolder(folderName){
    const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
    axios.post(API_ADD_FOLDER, {
        parentId: currentFolderId,
        dataName: folderName,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
        swalSuccess();
    })
}
// ----------------- Fetch data ----------------- //
function fetchMyDrive(){
    axios.get(API_MY_DRIVE, {
        headers: {
            'token': localStorage.getItem('token')}
    }).then(response => {
        const result = response.data.data;
        if(result.length === 0){
            handleEmptyFolder();
        }else{
            renderDriveData(result);
        }
    })
}

function fetchMyTrash(){
    axios.get(API_MY_TRASH, {
        headers: {
            'token': localStorage.getItem('token')}
    }).then(response => {
        const result = response.data.data;
        if(result.length === 0){
            handleEmptyTrashcan();
        }else{
            renderTrash(result);
        }
    })
}
async function fetchDrive(folderId){
    const api_drive = API_DRIVE_PREFIX + folderId;
    axios.get(api_drive, {
        headers: {
            'token': localStorage.getItem('token')}
    }).then(response => {
        const result = response.data.data;
        if(result.length === 0){
            handleEmptyFolder();
        }else{
            renderDriveData(result);
        }
    })
}
function fetchPreview(fileId){
    const api_preview = API_PREVIEW_PREFIX + fileId;
    axios.get(api_preview, {
        headers: {
            'token': localStorage.getItem('token')},
        responseType: 'blob'
    }).then(response => {
        let url = URL.createObjectURL(new Blob([response.data]));
        $('#preview').attr('src', url);
        renderDialogPreview();
    }).catch(() => {
        $('#preview').attr('src', '');
        $('#preview').attr('alt', '該檔案不支援預覽，請直接下載查看');
        renderDialogPreview();
    })
}
function fetchDownload(fileId){
    const api_download = API_DOWNLOAD_PREFIX + fileId;
    axios.get(api_download, {
        headers: {
            'token': localStorage.getItem('token')},
        responseType: 'blob'
    }).then(response => {
        const contentDisposition = response.headers['content-disposition'];
        let fileName = contentDisposition.split('filename=')[1].split(';')[0];
        fileName = fileName.replace(/\"/g, "");
        fileName = decodeURIComponent(fileName);
        
        let url = URL.createObjectURL(new Blob([response.data]));
        let link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        downloadFileId = '';
    }).catch(() => {
    })
}
// ----------------- Render data ----------------- //

function clearDriveData(){
    $('#folder').html('');
    $('#file').html('');
    $('#toolbar').addClass('hidden');
    $('#root').removeClass('hidden');
}

function addBreadcrumb(target){
    $('#breadcrumb').addClass('flex');
    $('#breadcrumb li').removeClass('active');
    $('#breadcrumb').append(`<li id="${target.id}" class="active breadcrumb">${target.innerHTML}</li>`);
    $('.breadcrumb').click(e => {
        fetchDrive(e.target.id);
        $(e.target).nextAll().remove();});
}

function renderDriveData(rawData){
    clearDriveData();
    renderFolders(rawData);
    renderFiles(rawData);
    $('.folder').click(e => toggleFocus(e));
    $('.file').click(e => toggleFocus(e));
    $('.folder').dblclick(e => {
        fetchDrive(e.target.id);
        addBreadcrumb(e.target);
    });
}

function renderTrash(rawData){
    clearDriveData();
    renderFolderTrash(rawData);
    renderFileTrash(rawData);
    $('.folder').click(e => toggleFocus(e));
    $('.file').click(e => toggleFocus(e));
    $('.trash').dblclick(e => {
        $('.focus').removeClass('focus');
        $(e.target).addClass('focus');
        recover();
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
    $('.file').dblclick(e => {
        downloadFileId = e.target.id;
        fetchPreview(downloadFileId);
    });
}

function renderFolderTrash(rawData){
    const folders = rawData
    .filter(item => item.dataType === 0)
    .map(item => function(){
        return `<div class="folder-trash trash" id="${item.id}" access="${item.accessLevel}">${item.dataName}</div>`;
    });
    folders.forEach(folder => $('#folder').append(folder));
}
function renderFileTrash(rawData){
    const files = rawData
       .filter(item => item.dataType === 1)
       .map(item => function(){
           return `<div class="file-trash trash" id="${item.id}" access="${item.accessLevel}">${item.dataName}</div>`;
       });
       files.forEach(file => $('#file').append(file));
   }
// ----------------- Read: preview ----------------- //
   function renderDialogPreview() {
    $('#dialog').removeClass('hidden');
    $('.preview').removeClass('hidden');
    $( "#dialog" ).dialog({
      resizable: false,
      height: "auto",
      width: 900,
      modal: true,
      close: () => {
        $('#preview').attr('src', '');
        $('#dialog').addClass('hidden');
        $('.preview').addClass('hidden');
      },
      buttons: {
        '取得連結': function(downloadFileId) {
            copyLink(downloadFileId);
            // swal會公開喔可以嗎 // 然後同時fetch修改檔案權限
        },
        '下載': function() {
            swalDownload(downloadFileId);
        },
        '關閉視窗': function() {
            downloadFileId = '';
            $( this ).dialog( "close" );
        }
      }
    });
}
function swalDownload(downloadFileId){
    Swal.fire({
        text: '是否要下載？',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        showLoaderOnConfirm: true,
        preConfirm: () => fetchDownload(downloadFileId),
        allowOutsideClick: () => !Swal.isLoading()
      }).then(() => swalSuccess());
}
// ----------------- Update: access level (temporary ver.)----------------- //
function generatePublicLink(folderId){
    const domain = window.location.hostname;
    return domain + PUBLIC_FOLDER_SUFFIX + folderId;
}
function copyLink(folderId){
    navigator.clipboard.writeText(generatePublicLink(folderId));
}
function swalPublicFolder(access){
    Swal.fire({
        text: '目前權限：' + access,
        showCancelButton: true,
        confirmButtonText: '變更權限',
        denyButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) swalToggleAccess();
      });
}
function swalPrivateFolder(access){
    Swal.fire({
        text: '目前權限：' + access,
        showCancelButton: true,
        confirmButtonText: '變更權限',
        denyButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) swalToggleAccess();
      });
}
function swalToggleAccess(){
    Swal.fire({
        text: '是否要變更權限？',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) doToggleAccess();
      });
}
function doToggleAccess(){
    const api_toggle_access = API_ACCESS_CONTROL_PREFIX + accessControlId;
    axios.post(api_toggle_access, null, {
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
        swalSuccess();
        accessControlId = '';
    })
}
// ----------------- Update: rename ----------------- //
function swalRename(targetId, dataType){
    Swal.fire({
        text: '請輸入新的名稱',
        input: 'text',
        inputValidator: (value) => {
            if(!REGEX_DATA_NAME.test(value)) return REGEX_WARN_DATA_NAME;
        },
        showCancelButton: true,
        confirmButtonText: '確認改名',
        showLoaderOnConfirm: true,
        preConfirm: newName => {
            doRename(newName, targetId, dataType)},
        allowOutsideClick: () => !Swal.isLoading()
    })
}
function doRename(newName, targetId, dataType){
    axios.post(API_RENAME, {
        id: targetId,
        dataName: newName,
        dataType: dataType
    }, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
        swalSuccess();
    })
}
// ----------------- Update: trash ----------------- //
function trash(){
    const list = collectFocused();
    if(list.length === 0) swal('warning', null, SWAL_NULL_DEST);
    else swalTrash(list);
}
function swalTrash(list){
    Swal.fire({
        text: '是否要將已選擇的檔案移至垃圾桶？',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) doTrash(list);
        else clearFocused();
      });
}
function doTrash(list){
    const jsonList = JSON.stringify(list);
    axios.post(API_TRASH, jsonList, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        $('.focus').remove();
        resumeHeader();
        swalSuccess();
    })
}
// ----------------- Update: recover ----------------- //
function recover(){
    const list = collectFocused();
    if(list.length === 0) swal('warning', null, SWAL_NULL_DEST);
    else swalRecover(list, true);
}
function swalRecover(list){
    Swal.fire({
        text: '是否要還原已選擇的檔案？',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) doRecover(list);
        else clearFocused();
      });
}
function doRecover(list){
    const jsonList = JSON.stringify(list);
    axios.post(API_RECOVER, jsonList, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        $('.focus').remove();
        resumeHeader();
        swalSuccess();
    })
}
// ----------------- Update: relocate: render menu ----------------- //
function fetchSuperFolders(folderId){
    axios.get(API_SUPER_FOLDER,{
        params: {
            folderId: folderId},
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then(response => {
        renderSuperFolders(response.data.data);
        displaySelectedMenu(folderId);
    });
}
function fetchSubFolders(folderId){
    relocateDestId = folderId;
    return axios.get(API_SUB_FOLDER,{
        params: {
            folderId: folderId},
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then(response => {
        renderSubFolders(response.data.data);
        displaySelectedMenu(folderId);
    });
}
function displaySelectedMenu(folderId){
    relocateDestId = folderId;
    $('.super-folder').removeClass('selected');
    if(folderId === ROOT_FOLDER_ID) {
        $('#root-super').addClass('selected');
    } else {
        $('#root-super').removeClass('selected');
        $('.super-folder').each((index, item) => {
            if(item.id === folderId) $(item).addClass('selected');
        })
    }
}
function renderSuperFolders(rawData){
    $('.super-folder').remove();
    const folders = rawData.map(item => function(){
        return `<li id="${item.id}" class="super-folder">${item.dataName}</li>`;
    });
    folders.forEach(folder => $('#dialog ul').append(folder));
    $('.super-folder').click(e => fetchSubFolders(e.target.id));
}

function renderSubFolders(rawData){
    $('#sub-folder').empty();
    const folders = rawData.map(item => {
        let className = includesLargeNumber(relocateTargetFolders, item.id) ? 'folder origin' : 'folder';
    return `<div id="${item.id}" class="${className}">${item.dataName}</div>`;
    });
    folders.forEach(folder => $('#sub-folder').append(folder));
    addListenerRelocate('origin');
}
function relocate(removeFocus){
    axios.post(API_RELOCATE, {
        id: relocateDestId,
        list: relocateTarget
    }, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        if(removeFocus){
            $('.focus').remove();
            resumeHeader();
        }
        swalSuccess();
        clearRelocateParams();
    })
}
function relocateSetting(){
    relocateTarget = collectFocused();
    relocateTargetFolders.push(relocateTarget
        .filter(item => item.dataType === 0)
        .map(item => item.id.toString())
    );
    if(relocateTarget.length === 0){
        swalFrontEndError();
    } else {
        initDialogRelocate();
        addListenerRelocate('focus');
    }
}
function initDialogRelocate(){
    //取得current folder id
    relocateOrigin = $('.breadcrumb').last().attr('id') || 0;
    // 彈出menu
    renderDialogRelocate();
    if(!(relocateOrigin === ROOT_FOLDER_ID)) fetchSuperFolders(relocateOrigin);
    // 左側
    $('#root-super').click(() => fetchSubFolders(ROOT_FOLDER_ID));
    // 右側
    $('.folder').clone().appendTo('#sub-folder');
}
/**
 * 禁止移動目標double click
 * 透過右鍵/移動按鈕/renderSub取得的判斷class不同(context-menu-active/focus/origin)
 * 故新增此方法
 */
function addListenerRelocate(excludedClass){
    const className = '.' + excludedClass; 
    $('#sub-folder .folder').not(className).dblclick(e => {
        fetchSubFolders(e.target.id)
        .then(() => fetchSuperFolders(e.target.id))
        // .catch(error => {
        //     let errCode = error.response.data.code;
        //     console.log((errCode === error.response.data.code));
        // })
    });
}
function includesLargeNumber(array, number){
    return array.some(element => element.toString() === number.toString())
}
function clearRelocateParams(){
    relocateTarget.length = 0;
    relocateTargetFolders.length = 0;
    relocateOrigin = '';
    relocateDestId = '';
}

function renderDialogRelocate() {
    $('#dialog').removeClass('hidden');
    $('.relocate').removeClass('hidden');
    $( "#dialog" ).dialog({
      resizable: false,
      height: "auto",
      width: 900,
      modal: true,
      close: () => {
        $('#sub-folder').empty();
        $('.super-folder').remove();
        $('#dialog').addClass('hidden');
        $('.relocate').addClass('hidden');
      },
      buttons: {
        '移動到這裡': function() {
            if(relocateDestId.length === 0){
                swal('warning', null, SWAL_NULL_DEST);
                return;
            }
            if(relocateDestId === relocateOrigin){
                swal('warning', null, SWAL_RELOCATE_FORBIDDEN);
                return;
            }
            relocate(true);
            $(this).dialog('close');
        },
        '取消': function() {
            clearFocused();
            $( this ).dialog( "close" );
        }
      }
    });
}