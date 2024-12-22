import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Vui lòng chọn một ảnh.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('http://localhost:8080/books/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setImageUrl(response.data.value);
            } else {
                setError('Lỗi khi tải ảnh lên.');
            }
        } catch (error) {
            setError('Lỗi khi tải ảnh lên: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Tải ảnh lên</h1>

            {error && <div className="error">{error}</div>}

            <input type="file" onChange={handleFileChange} />

            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Đang tải...' : 'Tải lên'}
            </button>

            {imageUrl && (
                <div>
                    <p>Ảnh đã tải lên thành công:</p>
                    <img src={imageUrl} alt="Uploaded image" />
                </div>
            )}
        </div>
    );
}

export default Upload;