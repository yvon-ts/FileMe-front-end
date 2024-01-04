function toggleSideBar(e){
    $('.side-bar-menu').removeClass('active');
    $(e.target).addClass('active');
}
function toggleBreadcrumb(e){
    $('.breadcrumb').remove();
    $('.breadcrumb-delimiter').remove();
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
function addFocus(e){
    if (!e.ctrlKey && !e.metaKey){ // without ctrl key means single focus
        $('.focus').removeClass('focus');
    }
    $(e.target).addClass('focus');
    $('.breadcrumb').addClass('hidden');
    $('.breadcrumb-delimiter').addClass('hidden');
    monitorToolbar();
    return false; // stop propagation to outside DOM
}
function monitorToolbar(){
    const count = countFocus();
   if(count > 0){
    $('#root').addClass('hidden');
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
    $('.breadcrumb-delimiter').removeClass('hidden');
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
function collectFocusedInfo(){
    let list = [];
    $('.focus').each((index, item) => {
        let dataTypeValue = $(item).hasClass('folder') || $(item).hasClass('folder-trash')? 0 : 1;
        list.push({id: item.id, dataName: item.innerText, dataType: dataTypeValue});
    });
    return list;
}
function clearFocused(){
    $('.focus').removeClass('focus');
    $('.breadcrumb').removeClass('hidden');
    $('.breadcrumb-delimiter').removeClass('hidden');
    monitorToolbar();
}
function showLoadingMask(){
    $('.loading-mask').css({'display':'block'});   
}
function hideLoadingMask(){
    $('.loading-mask').css({'display':'none'});
}
// ----------------- Init drag drop area ----------------- //
function initDragDropArea(){
    $('#content').on('dragenter', function(ev) {
        $('#content').addClass('highlightDropArea');
        $('#drag-drop-reminder').removeClass('hidden');
    });
    
    $('#content').on('dragleave', function(ev) {
      $('#content').removeClass('highlightDropArea');
      $('#drag-drop-reminder').addClass('hidden');
    });
    // drop upload: loop to upload single file as workaround
    $('#content').on('drop', async function(ev) {
      // Dropping files
      ev.preventDefault();
      ev.stopPropagation();

      if(ev.originalEvent.dataTransfer){
        if(ev.originalEvent.dataTransfer.files.length) {
            var droppedFiles = ev.originalEvent.dataTransfer.files;
            var isFolderIncluded = false;

            for(var i = 0; i < droppedFiles.length; i++) {
                if(droppedFiles[i].type === '') {
                    isFolderIncluded = true;
                    break;
                }
            }

            if(isFolderIncluded) {
                swal('warning','','暫不支援上傳整個資料夾，請先新增目錄再上傳檔案內容')
            } else {
                showLoadingMask();
                for(var i = 0; i < droppedFiles.length; i++)
                {
                    try{
                        // Upload droppedFiles[i] to server
                        await batchUpload(droppedFiles[i]);
                    }catch(error){
                        swalFrontEndError();
                    }
                }
                const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
                currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
                swalSuccess();
                hideLoadingMask();
            }
        }
      }
  
      $("#content").removeClass("highlightDropArea");
      return false;
    });
    
    $("#content").on('dragover', function(ev) {
        ev.preventDefault();
    });
}
// ----------------- Create Folder ----------------- //
function swalAddFolder(){
    Swal.fire({
        text: '請輸目錄名稱',
        input: 'text',
        inputAttributes:{
            maxlength: '30'
        },
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
// ----------------- Create Single File----------------- //

function swalAddSingleFile(){
    Swal.fire({
    title: "檔案上傳",
    input: "file",
    inputAttributes: {
      "accept": ACCEPTED_MIME,
    },
    inputValidator: value => {
      if (value)
      if(!REGEX_DATA_NAME.test(value.name.split('.')[0])) return REGEX_WARN_DATA_NAME;      
    }
  })
  .then(result => {
    let file = result.value;
    return uploadSingleFile(file);
  });
  
  }
  function uploadSingleFile(file){
    // var formData = new FormData();
    // formData.append('file', file);
    // const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
    // formData.append('folderId', currentFolderId);
    // formData.append('location', 1); // TODO: 目前寫死
    const formData = prepareFormData(file);
    axios.post(API_ADD_FILE, formData, {
        headers: {
          'token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
          currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
          swalSuccess();
          hideLoadingMask();
      });
  }
  async function batchUpload(file){
    const formData = prepareFormData(file);
    const result = await axios.post(API_ADD_FILE, formData, {
        headers: {
          'token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
    return result;
  }
  function prepareFormData(file){
    var formData = new FormData();
    formData.append('file', file);
    const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
    formData.append('folderId', currentFolderId);
    formData.append('location', 1); // TODO: 目前寫死
    return formData;
  }
// ----------------- Fetch data ----------------- //
function fetchMyDrive(){
    showLoadingMask();
    globalTargetId = '';
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
    showLoadingMask();
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
    showLoadingMask();
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
    showLoadingMask();
    const api_preview = API_PREVIEW_PREFIX + fileId;
    axios.get(api_preview, {
        headers: {
            'token': localStorage.getItem('token')},
        responseType: 'blob'
    }).then(response => {
        const dataType = response.data.type;
        if(dataType === 'application/pdf'){
            const pdfURL = URL.createObjectURL(response.data);
            window.open(pdfURL, '_blank');
            swal('info','','檔案已在新視窗開啟');
            hideLoadingMask();
        }else{
            let url = URL.createObjectURL(new Blob([response.data]));
            $('#preview').attr('src', url);
            renderDialogPreview();
        }
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
        globalTargetId = '';
    });
}
function fetchSearch(keywords){
    showLoadingMask();
    let arr = filterKeywords(keywords);
    axios.post(API_SEARCH, {keywords: arr}, {
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        const result = response.data.data;
        if(result.length === 0){
            handleNoResult();
        }else{
            renderDriveData(result);
        }
    });
}
function filterKeywords(keywords){
    let cleanKeywords = keywords.replaceAll(/[^\w\s]/g, ''); // filter out any character not a word
    let arr = cleanKeywords.split(/\s+/);
    return arr;
}
// ----------------- Render data ----------------- //

function clearDriveData(){
    $('#folder').html('');
    $('#file').html('');
    $('#toolbar').addClass('hidden');
    $('#root').removeClass('hidden');
    $('.breadcrumb').removeClass('hidden');
    $('.breadcrumb-delimiter').removeClass('hidden');
}

function addBreadcrumb(target){
    $('#breadcrumb').addClass('flex');
    $('#breadcrumb li').removeClass('active');
    $('#breadcrumb').append(`<span class="breadcrumb-delimiter">></span><li id="${target.id}" class="active breadcrumb hide-overflow">${target.innerText}</li>`);
    $('.breadcrumb').click(e => {
        fetchDrive(e.target.id);
        $(e.target).nextAll().remove();});
}

function renderDriveData(rawData){
    clearDriveData();
    renderFolders(rawData);
    renderFiles(rawData);
    $('.folder').click(e => addFocus(e));
    $('.file').click(e => addFocus(e));
    $('.folder').dblclick(e => {
        fetchDrive(e.target.id);
        addBreadcrumb(e.target);
    });
    hideLoadingMask();
}

function renderTrash(rawData){
    clearDriveData();
    renderFolderTrash(rawData);
    renderFileTrash(rawData);
    // 好像移除group recover所以focus沒意義
    $('.folder').click(e => addFocus(e));
    $('.file').click(e => addFocus(e));
    $('.trash').dblclick(e => {
        $('.focus').removeClass('focus');
        $(e.target).addClass('focus');
        recover();
    });
    hideLoadingMask();
}

function renderFolders(rawData){
    const folders = rawData
    .filter(item => item.dataType === 0)
    .map(item => function(){
        return `<div class="folder hide-overflow" id="${item.id}" access="${item.accessLevel}" title="${item.dataName}"><i class="fas fa-folder icon"></i>${item.dataName}</div>`;
    });
    folders.forEach(folder => $('#folder').append(folder));
}

function renderFiles(rawData){
 const files = rawData
    .filter(item => item.dataType === 1)
    .map(item => {
        var fileHtml = `<div class="file hide-overflow" id="${item.id}" access="${item.accessLevel}" title="${item.dataName}">${item.dataName}</div>`;
        var fileElement = $(fileHtml);
        var type = determineMimeTypeByFileName(item.dataName);

        switch(type){
            case 'pdf':
                fileElement.addClass('box-pdf');
                fileElement.prepend('<i class="far fa-file-pdf icon"></i>');
                break;
            case 'jpg':
            case 'gif':
            case 'png':
                fileElement.addClass('box-image');
                fileElement.prepend('<i class="fas fa-image icon"></i>');
                break;
            default:
                fileElement.addClass('box-file');
                fileElement.prepend('<i class="fas fa-file icon"></i>');
                break;
        }
        $('#file').append(fileElement);
    });
    $('.file').dblclick(e => {
        globalTargetId = e.target.id;
        fetchPreview(globalTargetId);
    });
}
function determineMimeTypeByFileName(fileName){
    var index = fileName.lastIndexOf('.');
    var type = index == -1 ? '' : fileName.substring(index + 1).trim().toLowerCase();
    return type;
}
function renderFolderTrash(rawData){
    const folders = rawData
    .filter(item => item.dataType === 0)
    .map(item => function(){
        return `<div class="folder-trash trash hide-overflow" id="${item.id}" access="${item.accessLevel}" title="${item.dataName}"><i class="fas fa-folder icon">${item.dataName}</div>`;
    });
    folders.forEach(folder => $('#folder').append(folder));
}
function renderFileTrash(rawData){
    const files = rawData
       .filter(item => item.dataType === 1)
       .map(item => {
           var fileHtml = `<div class="file-trash trash hide-overflow" id="${item.id}" access="${item.accessLevel}" title="${item.dataName}">${item.dataName}</div>`;
           var fileElement = $(fileHtml);
            var type = determineMimeTypeByFileName(item.dataName);
    
            switch(type){
                case 'pdf':
                    fileElement.addClass('box-pdf');
                    fileElement.prepend('<i class="far fa-file-pdf icon"></i>');
                    break;
                case 'jpg':
                case 'gif':
                case 'png':
                    fileElement.addClass('box-image');
                    fileElement.prepend('<i class="fas fa-image icon"></i>');
                    break;
                default:
                    fileElement.addClass('box-file');
                    fileElement.prepend('<i class="fas fa-file icon"></i>');
                    break;
            }
            $('#file').append(fileElement);
       });
   }
// ----------------- Read: preview ----------------- //
   function renderDialogPreview() {
    $('.loading-mask').css({"display":"none"});
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
        '取得連結': function() {
            let currentAccess = $('.file').filter(function() {
                return this.id === globalTargetId;
            }).attr('access');
            switch(currentAccess){
                case '0': {
                    swalGoPublicDataAndGetLink();
                    return;
                }
                case '1':{
                    copyLink();
                    return;
                }
                default: {
                }
            }
        },
        '下載': function() {
            swalDownload(globalTargetId);
        },
        '關閉視窗': function() {
            globalTargetId = '';
            $( this ).dialog( "close" );
        }
      }
    });
}

function swalDownload(globalTargetId){
    Swal.fire({
        text: '是否要下載？',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        showLoaderOnConfirm: true,
        preConfirm: () => fetchDownload(globalTargetId),
        allowOutsideClick: () => !Swal.isLoading()
      }).then(() => swalSuccess());
}
// ----------------- Update: access level (only files)----------------- //
function copyLink() {
    const domain = window.location.hostname;
    const publicFileLink = generatePublicFileLink(domain, globalTargetId);
    navigator.clipboard.writeText(publicFileLink).then(() => swal('success', null, '連結已複製'));
}
function generatePublicFileLink(domain, fileId) {
    return domain + PUBLIC_FILE_SUFFIX + fileId;
}

function swalGoPublicData(){
    Swal.fire({
        text: '目前權限：私人',
        showCancelButton: true,
        confirmButtonText: '變更權限',
        denyButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) swalToggleAccess();
      });
}
function swalGoPrivateData(){
    Swal.fire({
        text: '目前權限：公開',
        showCancelButton: true,
        confirmButtonText: '變更權限',
        denyButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) swalToggleAccess();
      });
}
function swalGoPublicDataAndGetLink(){
    Swal.fire({
        title: '目前權限：私人',
        text: '需將檔案設定為公開才能取得連結，請問要公開嗎？',
        showCancelButton: true,
        confirmButtonText: '是，公開檔案',
        denyButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) doPublicAndGetLink();
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
function doPublicAndGetLink(){
    const api_toggle_access = API_ACCESS_CONTROL_PREFIX + globalTargetId;
    axios.post(api_toggle_access, null, {
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        copyLink();
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
    })
}
function doToggleAccess(){
    const api_toggle_access = API_ACCESS_CONTROL_PREFIX + globalTargetId;
    axios.post(api_toggle_access, null, {
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
        swalSuccess();
        globalTargetId = '';
    })
}
// ----------------- Update: rename ----------------- //
function swalRename(targetId, dataType){
    Swal.fire({
        text: '請輸入新的名稱',
        input: 'text',
        inputAttributes:{
            maxlength: '30'
        },
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
function swalTrashConflict(){
    Swal.fire({
        icon: 'warning',
        title: '垃圾桶已有同名檔案',
        text: '請問是否以新檔案取代？(原先在垃圾桶的檔案將無法復原)',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) {
            const list = collectFocusedInfo();
            handleTrashConflict(list);
        }
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
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
        swalSuccess();
    })
    .catch(error => {
        let errorCode = error.response.data.code;
        if(errorCode === 23010) {
            swalTrashConflict()
        }
    });
}
function handleTrashConflict(list){
    const jsonList = JSON.stringify(list);
    axios.post(API_CONFLICT_TRASH, jsonList, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        const currentFolderId = $('.breadcrumb').last().attr('id') || 0;
        currentFolderId === 0 ? fetchMyDrive() : fetchDrive(currentFolderId);
        swalSuccess();
    });
}
// ----------------- Delete: clean all ----------------- //
function swalClean(){
    Swal.fire({
        text: '是否要清空垃圾桶？(注意：此動作不可復原)',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) doClean();
      });
}
function doClean(){
    axios.post(API_CLEAN, {}, {
        headers: {
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        fetchMyTrash();
        swalSuccess();
    });
}
// ----------------- Delete: soft delete ----------------- //
function softDelete(){
    const list = collectFocused();
    if(list.length === 0) swal('warning', null, SWAL_NULL_DEST);
    else swalDelete(list);
}
function swalDelete(list){
    Swal.fire({
        text: '是否要將已選擇的檔案刪除？(注意：此動作不可復原)',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      }).then((result) => {
        if (result.isConfirmed) doDelete(list);
        else clearFocused();
      });
}
function doDelete(list){
    const jsonList = JSON.stringify(list);
    axios.post(API_DELETE, jsonList, {
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        $('.focus').remove();
        checkIfEmptyTrash();
        resumeHeader();
        swalSuccess();
    });
}
function checkIfEmptyTrash(){
    const trashCount = $('.trash').length;
    if(trashCount === 0) handleEmptyTrashcan();
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
        checkIfEmptyTrash();
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
        return `<li id="${item.id}" class="super-folder hide-overflow" title="${item.dataName}">${item.dataName}</li>`;
    });
    folders.forEach(folder => $('#dialog ul').append(folder));
    $('.super-folder').click(e => fetchSubFolders(e.target.id));
}

function renderSubFolders(rawData){
    $('#sub-folder').empty();
    const folders = rawData.map(item => {
        let className = includesLargeNumber(relocateTargetFolders, item.id) ? 'folder origin' : 'folder';
    return `<div id="${item.id}" class="${className} hide-overflow" title="${item.dataName}"><i class="fas fa-folder icon"></i>${item.dataName}</div>`;
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
    $('#sub-folder .folder').not(className).css({'cursor': 'pointer'}); 
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