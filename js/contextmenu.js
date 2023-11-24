function folderMenu(){
    $.contextMenu({
        selector: '.folder',
        items: {
            'rename': {name: '重新命名', icon: 'fa-edit'},
            'relocate': {
                name: '移動',
                icon: 'fa-exchange-alt',
                callback: (key, opt) => {
                    const target = opt.$trigger[0];
                    relocateOriginId = opt.$trigger[0].id; // 不能點選的id(本人)
                    initDialogRelocate();
                    addListenerRelocate('context-menu-active');
                }},
            'trash': {
                name: '移至垃圾桶',
                icon: 'delete',
                callback: (key, opt) => {
                    let list = [{id: opt.$trigger[0].id, dataType: 0}];
                    doTrash(list, false);
                    opt.$trigger[0].remove();
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
                icon: 'fa-edit'
                // ,callback: (key, opt) => {
                //     $('.folder').clone().appendTo('#file');
                // }
            },
            'relocate': {
                name: '移動',
                icon: 'fa-exchange-alt'
                // ,callback: () => {

                // }
            },
            'trash': {
                name: '移至垃圾桶',
                icon: 'delete',
                callback: (key, opt) => {
                    let list = [{id: opt.$trigger[0].id, dataType: 1}];
                    doTrash(list, false);
                    opt.$trigger[0].remove();
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
                    let dataTypeValue = opt.$trigger[0].classList.contains('folder-trash')? 0 : 1;
                    let list = [{id: opt.$trigger[0].id, dataType: dataTypeValue}];
                    doRecover(list, false);
                    opt.$trigger[0].remove();
                }},
            'delete': {name: '立即刪除', icon: 'fa-solid fa-ban', callback: () => {alert('立即刪除')}}
        }
      })
}