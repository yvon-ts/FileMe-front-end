function bodyMenu(){
    $.contextMenu({
        selector: '#content',
        items: {
            'addFolder': {
                name: '新增目錄',
                icon: 'fa-folder',
                callback: (key, opt) => {
                    swalAddFolder();
                }
            }
        }
    })
}
function addMenu(){
    $.contextMenu({
        selector: '#add',
        items: {
            'addFolder': {
                name: '新增目錄',
                icon: 'fa-folder',
                callback: (key, opt) => {
                    swalAddFolder();
                }
            }
        }
    })
}
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
            // 'access-control': {
            //     name: '權限設定',
            //     icon: 'fa-wrench',
            //     callback: (key, opt) => {
            //         accessControlId = '';
            //         const target = opt.$trigger[0];
            //         accessControlId = target.id;
            //         const accessCode = target.getAttribute('access');
            //         const access = accessCode === '0' ? '私人' : '公開'
            //         if(accessCode === '0') swalGoPublicData(access);
            //         else swalPrivateData(access);
            //     }
            // },
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
                    globalTargetId = '';
                    const fileId = opt.$trigger[0].id;
                    globalTargetId = fileId;
                    fetchPreview(fileId);
                }
            },
            'download': {
                name: '下載',
                icon: 'fa-save',
                callback: (key, opt) => {
                    globalTargetId = '';
                    globalTargetId = globalTargetId.length === 0 ? opt.$trigger[0].id : globalTargetId;
                    swalDownload(globalTargetId);
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
            'access-control': {
                name: '權限設定',
                icon: 'fa-wrench',
                callback: (key, opt) => {
                    globalTargetId = '';
                    const target = opt.$trigger[0];
                    globalTargetId = target.id;
                    const accessCode = target.getAttribute('access');
                    if(accessCode === '0') swalGoPublicData();
                    else swalGoPrivateData();
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