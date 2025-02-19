// src/utils/deleteAccountUtil.js

export const handleDeleteAccount = async (logout, navigate) => {
    try {
        const response = await fetch('http://localhost:5001/api/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // First remove token
            localStorage.removeItem('token');
            // Then logout
            await logout();
            // Finally navigate
            navigate('/login');
        } else {
            throw new Error(data.message || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Delete account error:', error);
        alert('Failed to delete account: ' + error.message);
    }
};