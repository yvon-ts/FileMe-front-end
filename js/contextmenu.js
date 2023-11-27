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
            'relocate': {
                name: '移動',
                icon: 'fa-exchange-alt',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    target.classList.add('focus');
                    batchRelocateSetting();
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
            'preview': {name: '預覽', icon: 'fa-search'},
            'download': {name: '下載', icon: 'fa-save'},
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
                    batchRelocateSetting();
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