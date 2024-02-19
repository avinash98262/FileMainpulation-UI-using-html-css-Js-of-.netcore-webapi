// Function to upload file
async function uploadFile() {
    
    const fileInput = document.getElementById('file');
       const file = fileInput.files[0];
    if (file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('https://localhost:44308/api/File', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Call function to fetch and display all files
                await fetchAndDisplayFiles();
            } else {
                throw new Error('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    } else {
        alert('Please select a file to upload.');
    }
}

// Function to fetch and display all files
async function fetchAndDisplayFiles() {
    try {
        const response = await fetch('https://localhost:44308/api/File/all');
        if (response.ok) {
            const files = await response.json();
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = ''; // Clear existing file list
            
            files.forEach(file => {
                // Create file item element
                const fileItem = document.createElement('div');
                fileItem.classList.add('fileItem');
                

                // Display thumbnail
                const thumbnailUrl = file.thumbnail ? file.thumbnail : 'https://thumbs.dreamstime.com/b/missing-unknown-file-d-rendering-folder-isolated-white-153167650.jpg';
                const thumbnail = document.createElement('img');
                thumbnail.src = thumbnailUrl;
                thumbnail.classList.add('thumbnail');
                fileItem.appendChild(thumbnail);

                // Display file name
                const fileName = document.createElement('span');
                fileName.textContent = file.fileName;
                fileItem.appendChild(fileName);

                // Create action buttons
                const actions = document.createElement('div');
                actions.classList.add('actions');

                // Create Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteFile(file.fileName);
                actions.appendChild(deleteButton);

                // Create Download button
                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Download';
                downloadButton.onclick = () => downloadFile(file.fileName);
                actions.appendChild(downloadButton);

                // Append action buttons to file item
                fileItem.appendChild(actions);

                // Append file item to file list
                fileList.appendChild(fileItem);
            });
        } else {
            throw new Error('Failed to fetch files.');
        }
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}




// Define a function to download a file by filename
async function downloadFile(filename) {
    try {
        const response = await fetch(`https://localhost:44308/api/File/${filename}`,{
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Error downloading file: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}

// Define a function to delete a file by filename
async function deleteFile(filename) {
    try {
        const response = await fetch(`https://localhost:44308/api/File/${filename}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Error deleting file: ${response.statusText}`);
        }
        await fetchAndDisplayFiles();
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
 
}

fetchAndDisplayFiles();