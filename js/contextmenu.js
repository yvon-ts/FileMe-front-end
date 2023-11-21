function driveMenu(){
    $.contextMenu({
        selector: '.file',
        items: {
            'download': {name: '下載', icon: 'fa-cloud-arrow-down'},
            'rename': {name: '重新命名', icon: 'edit'},
            'relocate': {name: '移動', icon: 'fa-file-export'},
            'trash': {name: '移至垃圾桶', icon: 'delete'}
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
                    let dataTypeValue = opt.$trigger[0].classList.contains('folder')? 0 : 1;
                    let list = [{id: opt.$trigger[0].id, dataType: dataTypeValue}];
                    doRecover(list, false);
                    opt.$trigger[0].remove();
                }},
            'delete': {name: '立即刪除', icon: 'fa-solid fa-ban', callback: () => {alert('立即刪除')}}
        }
      })
}