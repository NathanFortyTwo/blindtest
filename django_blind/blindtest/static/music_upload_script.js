document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const logButton = document.getElementById('logButton');

    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            const fileItem = createFileItem(files[i].name);
            fileList.appendChild(fileItem);
        }

        addDragAndDropHandlers();
    });

    function createFileItem(fileName) {
        const fileItem = document.createElement('li');
        fileItem.textContent = fileName;
        fileItem.setAttribute('draggable', 'true');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            fileItem.remove();
        });

        fileItem.appendChild(deleteButton);
        return fileItem;
    }

    function addDragAndDropHandlers() {
        const draggables = document.querySelectorAll('.file-list li');
        let draggedItem = null;

        draggables.forEach(item => {
            item.addEventListener('dragstart', function () {
                draggedItem = item;
                setTimeout(() => {
                    item.classList.add('dragging');
                }, 0);
            });

            item.addEventListener('dragend', function () {
                setTimeout(() => {
                    item.classList.remove('dragging');
                    draggedItem = null;
                }, 0);
            });

            item.addEventListener('dragover', function (event) {
                event.preventDefault();
            });

            item.addEventListener('dragenter', function (event) {
                event.preventDefault();
                this.classList.add('dragover');
            });

            item.addEventListener('dragleave', function () {
                this.classList.remove('dragover');
            });

            item.addEventListener('drop', function () {
                this.classList.remove('dragover');
                if (draggedItem) {
                    const items = Array.from(fileList.children);
                    const currentIndex = items.indexOf(this);
                    const draggedIndex = items.indexOf(draggedItem);

                    if (currentIndex > draggedIndex) {
                        this.after(draggedItem);
                    } else {
                        this.before(draggedItem);
                    }
                }
            });
        });
    }

    logButton.addEventListener('click', function () {
        const fileNames = [];
        const files = document.querySelectorAll('.file-list li');

        files.forEach(file => {
            fileNames.push(file.textContent);
        });

        console.log('File names in order:', fileNames);
    });
});