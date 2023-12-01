function folderMenu(){
    $.contextMenu({
        selector: '.folder',
        items: {
            'rename': {
                name: '重新命名',
                icon: 'fa-edit',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    const targetId = target.id
                    const dataType = opt.$trigger[0].classList.contains('folder') ? 0 : 1;
                    swalRename(targetId, dataType);
                }
            },
            'share': {
                name: '權限設定',
                icon: 'fa-edit',
                callback: (key, opt) => {
                    accessControlId = '';
                    const target = opt.$trigger[0];
                    accessControlId = target.id;
                    const accessCode = target.getAttribute('access');
                    const access = accessCode === '0' ? '私人' : '公開'
                    if(accessCode === '0') swalPublicFolder(access);
                    else swalPrivateFolder(access);
                }
            },
            'relocate': {
                name: '移動',
                icon: 'fa-exchange-alt',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    target.classList.add('focus');
                    relocateSetting();
                    displaySelectedMenu(relocateOrigin);
                }},
            'trash': {
                name: '移至垃圾桶',
                icon: 'delete',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    target.classList.add('focus');
                    trash();
                }}
        }
      })
}
function fileMenu(){
    $.contextMenu({
        selector: '.file',
        items: {
            'preview': {
                name: '預覽',
                icon: 'fa-search',
                callback: (key, opt) => {
                    downloadFileId = '';
                    const fileId = opt.$trigger[0].id;
                    downloadFileId = fileId;
                    fetchPreview(fileId);
                }
            },
            'download': {
                name: '下載',
                icon: 'fa-save',
                callback: (key, opt) => {
                    downloadFileId = '';
                    downloadFileId = downloadFileId.length === 0 ? opt.$trigger[0].id : downloadFileId;
                    swalDownload(downloadFileId);
                }},
            'rename': {
                name: '重新命名',
                icon: 'fa-edit',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    const targetId = target.id
                    const dataType = opt.$trigger[0].classList.contains('folder') ? 0 : 1;
                    swalRename(targetId, dataType);
                }
            },
            'relocate': {
                name: '移動',
                icon: 'fa-exchange-alt',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    target.classList.add('focus');
                    relocateSetting();
                    displaySelectedMenu(relocateOrigin);
                }},
            'trash': {
                name: '移至垃圾桶',
                icon: 'delete',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    target.classList.add('focus');
                    trash();
                }}
        }
      })
}
function trashMenu(){
    $.contextMenu({
        selector: '.trash',
        items: {
            'recover': {
                name: '還原',
                icon: 'fa-rotate-left',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    target.classList.add('focus');
                    recover();
                }},
            'delete': {name: '立即刪除', icon: 'fa-solid fa-ban', callback: () => {alert('立即刪除')}}
        }
      })
}