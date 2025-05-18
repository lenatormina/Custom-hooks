import { useState, useEffect } from 'react';

type LocalStorageSetValue = string;
type LocalStorageReturnValue = LocalStorageSetValue | null;

type UseLocalStorage = (key: string) => [
  value: LocalStorageReturnValue,
  {
    setItem: (value: LocalStorageSetValue) => void;
    removeItem: () => void;
  },
];

function gettingValue (key: string): LocalStorageReturnValue {
    const storageValue = localStorage.getItem(key);
        try {
            return storageValue ? JSON.parse(storageValue) : null;
        } catch (error) {
            if(error instanceof SyntaxError) {
                console.error(`Ошибка парсинга JSON: ${error.message}`);
            }
            return null;
        }
}


export const useLocalStorage: UseLocalStorage =  (key) => {
    const [value, setValue] = useState <LocalStorageReturnValue>(gettingValue(key))

    const setItem = (newValue: LocalStorageSetValue) =>{
        if(newValue === undefined) return; 
            
        const storageValue = JSON.stringify(newValue);
        localStorage.setItem(key, storageValue);
        setValue(newValue);
    }

    const removeItem = () =>{
        localStorage.removeItem(key);
        setValue(null);
    }

    useEffect(()=>{
        const resultValue = gettingValue(key);
        if(resultValue !== value){
            setValue(resultValue);
        }
    },[key])

    return [value, {setItem, removeItem}];
}