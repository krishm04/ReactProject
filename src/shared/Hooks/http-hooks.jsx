
import { useCallback, useRef, useState, useEffect } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            console.log('Sending request to:', url);
console.log('Method:', method);
console.log('Headers:', headers);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal
                });
                const responseData = await response.json();

                activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);
                return responseData;
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.warn('Request was aborted.');
                    setIsLoading(false);
                    return; // Don't treat as a real error
                }

                setError(err.message || 'Something went wrong!');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, [])

    return { isLoading, error, sendRequest, clearError };
};