import { useCallback, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

export function useFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (path, { method = 'GET', body } = {}) => {
        setLoading(true);
        setError(null);

        try {
            if (!API_URL) {
                throw new Error('.env에 VITE_API_URL을 설정하세요.');
            }

            const options = { method };

            if (body !== undefined) {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(body);
            }

            const res = await fetch(`${API_URL}${path}`, options);

            if (!res.ok) {
                throw new Error(`요청 실패 (${res.status})`);
            }

            return res.status === 204 ? undefined : await res.json();
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { request, loading, error };
}


// 예시 사용법
// const { request: fetchBooks, loading: loadingBooks } = useFetch();

// const {
//   request: saveBook,
//   loading: savingBook,
//   error: saveError,
// } = useFetch();


//   const { request } = useFetch();

//   const handleDelete = async (id) => {
//     try {
//       await request(`/posts/${id}`, {
//         method: 'DELETE'
//       })

//       setPosts(posts.filter((p) => p.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };
