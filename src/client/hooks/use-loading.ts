import { useCallback, useState } from "react";

export const useLoading = () => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), [])

  return { isLoading, startLoading, stopLoading }
}

export const useAppLoading = () => {
  //const [ intent, setIntent ] = useState<string>();
  const [ isAppLoading, setIsAppLoading ] = useState<boolean>(false);

  const startAppLoading = useCallback(() => setIsAppLoading(true), []);
  const stopAppLoading = useCallback(() => setIsAppLoading(false), [])

  return { isAppLoading, startAppLoading, stopAppLoading }
}

