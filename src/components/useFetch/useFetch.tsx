import { useState, useRef, useEffect, useCallback } from "react";

type QueryParams = Record<string, string | number | boolean | undefined>;


function buildQueryString(params: QueryParams | undefined): string {
    if(!params) return '';
    const searchParams = new URLSearchParams();
    for(const key in params){
        const value = params[key];
        if(value !== undefined){
            searchParams.append(key, String(value));
        }
    }
    return `?${searchParams.toString()}`;
}

export function useFetch<T = unknown>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastParamsRef = useRef<QueryParams | undefined>(undefined);

    const fetchData = useCallback(async(params?: QueryParams)=>{
        setIsLoading(true);
        setError(null);

        if(abortControllerRef.current){
            abortControllerRef.current.abort()
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const response = await fetch(`${url}${buildQueryString(params)}`,{
                signal: abortController.signal
            })

            if(!response.ok){
                throw new Error("Ошибка сети");
            }

            const result = await response.json();
            setData(result)
        } catch (error) {
            if(error instanceof DOMException && error.name === 'AbortError'){
                return;
            }
        } finally{
            setIsLoading(false);
        }
    }, [url])

    const refetch = useCallback((option: { params?: QueryParams } = {})=> {
            lastParamsRef.current = option.params;
            fetchData(option.params);
    }, [fetchData])

    useEffect(()=>{
        fetchData(lastParamsRef.current);

        return () => {
        if(abortControllerRef.current){
            abortControllerRef.current.abort()
        }
    }
    },[url, fetchData])

    return {
        data,
        isLoading,
        error,
        refetch
    }
}