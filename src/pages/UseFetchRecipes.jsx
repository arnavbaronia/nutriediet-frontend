import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRecipes = (url) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipes(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch recipes.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [url]);

    return { recipes, loading, error };
};

export default useFetchRecipes;